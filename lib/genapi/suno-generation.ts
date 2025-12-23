import { genapi, pollRequestStatus } from './client';
import { SongFormData } from './text-generation';

export interface SunoGenerationParams {
  title: string;
  tags: string;
  prompt: string;
  voice: 'male' | 'female';
  model?: 'v5';
  translate_input?: boolean;
}

export interface SunoGenerationResult {
  audio_url?: string;
  video_url?: string;
  image_url?: string;
  duration?: number;
  [key: string]: unknown;
}

/**
 * Создаёт tags для Suno на основе данных формы
 * Формат: "жанр, мужской/женский вокал, настроение"
 */
function createSunoTags(formData: SongFormData): string {
  const genre = formData.genre;
  const voiceType = formData.voice === 'male' ? 'мужской вокал' : 'женский вокал';
  const style = formData.customStyle || formData.style;

  // Формируем tags: жанр + тип голоса + стиль/настроение
  return `${genre}, ${voiceType}, ${style}`;
}

/**
 * Извлекает название песни из текста или использует aboutWho
 * Пытается найти первую значимую строку после тегов
 */
function extractSongTitle(songText: string, fallbackTitle: string): string {
  // Удаляем все теги Suno
  const textWithoutTags = songText.replace(/\[.*?\]/g, '').trim();

  // Разбиваем на строки и ищем первую непустую
  const lines = textWithoutTags.split('\n').filter(line => {
    const trimmed = line.trim();
    // Пропускаем вокализы типа "О-о-о", "(со мной)", пустые строки
    return trimmed.length > 0 &&
           !trimmed.match(/^[А-Яа-яЁё\-]+\.\.\.$/) && // "О-о-о..."
           !trimmed.match(/^\(.*\)$/) && // "(со мной)"
           !trimmed.match(/^[А-Яа-яЁё\-!?…]+$/) && // только вокализы
           trimmed.length > 5; // минимальная длина
  });

  if (lines.length > 0) {
    // Берём первую строку и очищаем от лишнего
    let title = lines[0]
      .replace(/\(.*?\)/g, '') // убираем бэк-вокал
      .replace(/[!?.…]+$/g, '') // убираем пунктуацию в конце
      .trim();

    // Ограничиваем длину (Suno любит короткие названия)
    if (title.length > 50) {
      title = title.substring(0, 50).trim();
    }

    return title || fallbackTitle;
  }

  return fallbackTitle;
}

/**
 * Генерирует музыку в Suno на основе текста песни
 */
export async function generateSunoMusic(
  songText: string,
  formData: SongFormData
): Promise<SunoGenerationResult> {
  try {
    // Формируем параметры для Suno
    const title = extractSongTitle(songText, formData.aboutWho);
    const tags = createSunoTags(formData);

    console.log('Suno generation params:', { title, tags, textLength: songText.length });

    // Отправляем запрос в Suno через GenAPI
    const response = await genapi.post('/networks/suno', {
      title: title,
      tags: tags,
      prompt: songText,
      translate_input: false, // Текст уже на русском
      model: 'v5',
    });

    const requestId = response.data.request_id;
    console.log('Suno request created:', requestId);

    // Ждём результат (Suno может генерировать до 2-3 минут)
    // Увеличиваем количество попыток и интервал
    const result = await pollRequestStatus(requestId, 60, 5000); // 60 попыток * 5 сек = 5 минут

    // Парсим результат
    if (typeof result === 'string') {
      // Если вернулась строка, пытаемся распарсить как JSON
      try {
        return JSON.parse(result) as SunoGenerationResult;
      } catch {
        // Если не JSON, возвращаем как есть
        return { raw_output: result } as SunoGenerationResult;
      }
    }

    return result as SunoGenerationResult;

  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown }; message?: string };
      console.error('Suno generation error:', axiosError.response?.data || axiosError.message);
    } else {
      console.error('Suno generation error:', error);
    }
    throw new Error('Ошибка генерации музыки в Suno');
  }
}

/**
 * Проверяет статус генерации Suno
 */
export async function checkSunoStatus(requestId: number): Promise<{
  status: string;
  progress?: number;
  result?: SunoGenerationResult;
}> {
  try {
    const response = await genapi.get(`/request/get/${requestId}`);
    return {
      status: response.data.status,
      progress: response.data.progress,
      result: response.data.result || response.data.output,
    };
  } catch (error) {
    console.error('Suno status check error:', error);
    throw new Error('Ошибка проверки статуса Suno');
  }
}
