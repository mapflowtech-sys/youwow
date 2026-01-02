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
 * Словарь детальных тегов для жанров музыки
 * Каждый жанр содержит набор английских тегов для улучшения качества генерации в Suno
 */
const GENRE_TAGS: Record<string, string> = {
  'Новогодний поп': 'pop, christmas pop, festive melody, bells, warm synths, joyful mood, mid-tempo, magical atmosphere',
  'Классический поп': 'pop, melodic pop, radio friendly, clean production, layered vocals, emotional mood, mid-tempo, modern sound',
  'Рок': 'rock, alternative rock, electric guitar, live drums, energetic performance, driving rhythm, high energy, dynamic tempo',
  'Рэп': 'rap, hip hop, rhythmic flow, punchy beat, deep bass, minimal melody, confident delivery, strong groove',
  'Шансон': 'chanson, russian chanson, acoustic guitar, accordion, storytelling vocals, emotional depth, slow tempo, intimate mood',
  'Джаз': 'jazz, smooth jazz, live brass, piano, upright bass, swing rhythm, warm arrangement, relaxed mood, expressive vocals',
  'Электро': 'electronic, electro pop, synth driven, electronic beat, modern production, energetic mood, dance tempo, clean drops',
  'Блюз': 'blues, soul blues, blues guitar, slow groove, emotional vocals, raw feeling, low tempo, deep atmosphere',
  'Кантри': 'country, modern country, acoustic guitar, folk rhythm, storytelling vocals, warm mood, mid-tempo, organic sound',
  'Акустика': 'acoustic, acoustic pop, acoustic guitar, minimal arrangement, close vocal, intimate performance, soft mood, slow to mid tempo',
};

/**
 * Словарь детальных тегов для стилей текста
 * Каждый стиль добавляет музыкальные параметры для настроения песни
 */
const STYLE_TAGS: Record<string, string> = {
  'Весёлая': 'playful mood, upbeat feeling, bright melody, positive energy, lighthearted performance',
  'Душевная': 'emotional mood, warm feeling, sincere vocals, heartfelt delivery, soft dynamics',
  'Прожарка': 'sarcastic tone, playful sarcasm, confident delivery, rhythmic emphasis, attitude performance',
  'Романтичная': 'romantic mood, tender emotion, soft vocals, intimate delivery, gentle dynamics',
  'Энергичная': 'inspiring mood, uplifting energy, anthemic feeling, confident vocals, building dynamics',
  'Мотивирующая': 'inspiring mood, uplifting energy, anthemic feeling, confident vocals, building dynamics',
  'Ностальгическая': 'nostalgic mood, reflective feeling, warm tone, emotional depth, soft arrangement',
};

/**
 * Создаёт tags для Suno на основе данных формы
 * Формат: "vocal type, genre tags, style tags"
 * Все теги на английском языке для лучшей работы Suno AI
 */
function createSunoTags(formData: SongFormData): string {
  // 1. Vocal type - ВСЕГДА первый параметр (критично для Suno!)
  const vocalType = formData.voice === 'male' ? 'male singer' : 'female singer';

  // 2. Теги жанра
  const genreTags = GENRE_TAGS[formData.genre] || formData.genre;

  // 3. Теги стиля
  let styleTags = '';

  // Если пользователь выбрал "Свой вариант" и указал кастомный стиль
  if (formData.style === 'Свой вариант' && formData.customStyle) {
    styleTags = `experimental mood, ${formData.customStyle}, experimental feeling`;
  } else {
    // Используем предустановленный стиль
    const styleKey = formData.customStyle || formData.style;
    styleTags = STYLE_TAGS[styleKey] || styleKey;
  }

  // Объединяем все теги: vocal type идет первым!
  return `${vocalType}, ${genreTags}, ${styleTags}`;
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
    throw new Error('Ошибка генерации музыки');
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
