import { NextRequest, NextResponse } from 'next/server';
import { type SongFormData } from '@/lib/genapi/text-generation';
import { createOrder } from '@/lib/db-helpers';

export const maxDuration = 300; // 5 минут для полной генерации

export async function POST(request: NextRequest) {
  try {
    const formData: SongFormData = await request.json();

    // Валидация
    if (!formData.aboutWho || !formData.aboutWhat || !formData.email) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    if (!formData.genre || !formData.style || !formData.occasion) {
      return NextResponse.json(
        { error: 'Выберите жанр, стиль и повод' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Некорректный email' },
        { status: 400 }
      );
    }

    // Шаг 1: Создаём заказ со статусом "pending"
    const order = await createOrder({
      serviceType: 'song',
      customerEmail: formData.email,
      customerName: formData.aboutWho,
      inputData: formData as unknown as Record<string, unknown>,
      amount: 0, // Пока бесплатно
    });

    console.log('Order created:', order.id);

    // Возвращаем orderId сразу, чтобы пользователь мог отслеживать статус
    // Генерация будет происходить в фоне
    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Заказ создан. Генерация начнётся после оплаты.',
    });

  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка создания заказа';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
