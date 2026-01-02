import { NextRequest, NextResponse } from 'next/server';
import { generateSongText, type SongFormData } from '@/lib/genapi/text-generation';
import { generateSunoMusic } from '@/lib/genapi/suno-generation';
import { getOrderById, updateOrderStatus } from '@/lib/db-helpers';
import { sendSongReadyEmail } from '@/lib/email';
import { trackConversion } from '@/lib/affiliate/tracking';

export const maxDuration = 300; // 5 минут для полной генерации

interface ProcessRequest {
  orderId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId }: ProcessRequest = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID отсутствует' },
        { status: 400 }
      );
    }

    // Получаем заказ
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      );
    }

    // ВАЖНО: Проверяем статус и сразу меняем на processing атомарно!
    // Это предотвращает дублирование генерации при параллельных вызовах
    if (order.status !== 'pending' && order.status !== 'paid') {
      console.log(`[${orderId}] Заказ уже в статусе ${order.status}, пропускаем генерацию`);
      return NextResponse.json(
        { error: 'Заказ уже обработан или обрабатывается' },
        { status: 400 }
      );
    }

    // Атомарно меняем статус на "processing" чтобы избежать race condition
    await updateOrderStatus(orderId, 'processing');
    console.log(`[${orderId}] Статус изменён на processing, запускаем генерацию`);

    // Запускаем генерацию в фоне (не блокируя ответ)
    // В production это должно быть в отдельной очереди/worker
    processSongGeneration(orderId, order.input_data as SongFormData)
      .catch(error => {
        console.error('Background generation error:', error);
      });

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: 'Оплата принята. Генерация началась.',
    });

  } catch (error) {
    console.error('Process API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка обработки заказа';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Фоновая обработка генерации
async function processSongGeneration(orderId: string, formData: SongFormData) {
  try {
    console.log(`[${orderId}] Начало генерации`);

    // Получаем заказ для доступа к customer_email
    const order = await getOrderById(orderId);

    // Статус уже установлен в "processing" в вызывающей функции
    // (не меняем здесь, чтобы не было race condition)

    // Шаг 1: Генерация текста песни через ChatGPT
    console.log(`[${orderId}] Генерация текста...`);
    const songText = await generateSongText(formData);
    console.log(`[${orderId}] Текст сгенерирован, длина: ${songText.length} символов`);

    // Сохраняем промежуточный результат
    await updateOrderStatus(orderId, 'processing', {
      result_metadata: {
        songText: songText,
        step: 'text_generated',
      },
    });

    // Шаг 2: Генерация музыки через Suno
    console.log(`[${orderId}] Генерация музыки в Suno...`);
    const sunoResult = await generateSunoMusic(songText, formData);
    console.log(`[${orderId}] Музыка сгенерирована:`, sunoResult);

    // Извлекаем URL аудио из результата Suno
    let audioUrl: string | null = null;

    // Suno может вернуть разные форматы, пробуем их все
    if (typeof sunoResult === 'object' && sunoResult !== null) {
      audioUrl = (sunoResult.audio_url as string) ||
                 (sunoResult.video_url as string) ||
                 (sunoResult.raw_output as string) || // GenAPI возвращает в raw_output
                 null;

      // Если пришёл массив результатов (Suno генерирует 2 варианта)
      if (Array.isArray(sunoResult) && sunoResult.length > 0) {
        const firstResult = sunoResult[0];
        if (typeof firstResult === 'object' && firstResult !== null) {
          audioUrl = (firstResult.audio_url as string) ||
                     (firstResult.video_url as string) ||
                     (firstResult.raw_output as string) ||
                     null;
        }
      }
    }

    if (!audioUrl) {
      throw new Error('Suno не вернул URL аудио');
    }

    // Обновляем заказ со статусом "completed"
    console.log(`[${orderId}] Обновляем статус на completed с audioUrl:`, audioUrl);
    await updateOrderStatus(orderId, 'completed', {
      result_url: audioUrl,
      result_metadata: {
        songText: songText,
        sunoResult: sunoResult,
        step: 'completed',
      },
    });

    console.log(`[${orderId}] ✅ Генерация завершена успешно! URL сохранён:`, audioUrl);

    // Трекинг партнёрской конверсии (если есть партнёр)
    await trackConversion(orderId, 'song', order.amount || 590);
    console.log(`[${orderId}] Партнёрская конверсия обработана`);

    // Отправляем email с готовой песней
    if (order.customer_email) {
      console.log(`[${orderId}] Отправка email на ${order.customer_email}...`);
      const emailResult = await sendSongReadyEmail({
        to: order.customer_email,
        orderId: orderId,
        audioUrl: audioUrl,
      });

      if (emailResult.success) {
        console.log(`[${orderId}] ✅ Email успешно отправлен!`);
      } else {
        console.error(`[${orderId}] ❌ Ошибка отправки email:`, emailResult.error);
      }
    } else {
      console.warn(`[${orderId}] Email не указан, пропускаем отправку`);
    }

  } catch (error) {
    console.error(`[${orderId}] Ошибка генерации:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';

    await updateOrderStatus(orderId, 'failed', {
      error_message: errorMessage,
    });
  }
}
