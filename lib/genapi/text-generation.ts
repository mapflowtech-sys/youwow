import { genapi, pollRequestStatus } from './client';
import { getCurrentModelConfig } from './models';

export interface SongFormData {
  voice: 'male' | 'female';
  aboutWho: string;
  aboutWhat: string;
  genre: string;
  style: string;
  customStyle?: string;
  occasion: string;
  customOccasion?: string;
  mustInclude?: string;
  email: string;
}

function createSongPrompt(formData: SongFormData): string {
  const genre = formData.genre;
  const occasion = formData.customOccasion || formData.occasion;

  return `Ты — профессиональный автор песен. Напиши текст песни на русском языке для нейросети Suno AI.

ИНФОРМАЦИЯ О ПЕСНЕ:

О КОМ ПЕСНЯ: ${formData.aboutWho}
О ЧЁМ СПЕТЬ: ${formData.aboutWhat}
ЖАНР МУЗЫКИ: ${genre}
СТИЛЬ ТЕКСТА: ${formData.style}
ПОВОД: ${occasion}
ГОЛОС ИСПОЛНИТЕЛЯ: ${formData.voice === 'male' ? 'Мужской' : 'Женский'}
${formData.mustInclude ? `ОБЯЗАТЕЛЬНЫЕ ФРАЗЫ: ${formData.mustInclude}` : ''}

ТРЕБОВАНИЯ К СТРУКТУРЕ:

Используй теги Suno для разметки:

[Intro] — вступление (опционально)
[Verse 1] — первый куплет (4-6 строк)
[Chorus] — припев (3-4 строки, запоминающийся)
[Verse 2] — второй куплет (4-6 строк)
[Chorus] — припев (повтор)
[Bridge] — бридж (2-4 строки, опционально)
[Chorus] — финальный припев
[Outro] — концовка (опционально)
[End] — обязательно в конце

ТРЕБОВАНИЯ К РИФМОВКЕ:

- Для попа: AABB или ABAB
- Для рэпа: сложные внутренние рифмы
- Для рока: свободная, энергичная
- Для шансона: простые, душевные
- Для джаза: джазовые фразеологизмы
- Адаптируй под жанр: ${genre}

ЯЗЫК И ЛЕКСИКА:

КРИТИЧНО: Если в описании есть нецензурная лексика:
- НЕ используй её в тексте песни
- Замени на яркие эмоциональные синонимы
- Примеры замен: "офигенный", "невероятный", "крутейший", "легендарный", "бомбовый", "космический"
- Сохрани силу эмоции, но без мата

ТОН И СТИЛЬ:

- Соответствует: ${formData.style}
- Учитывай повод: ${occasion}
- Если День рождения → поздравительный тон
- Если Новый год → праздничный, волшебный
- Если без повода → свободный, искренний

ПЕРСОНАЛИЗАЦИЯ:

- Вплети детали из описания естественно
${formData.mustInclude ? `- ОБЯЗАТЕЛЬНО включи фразы: ${formData.mustInclude}` : ''}
- Используй конкретные образы, а не общие фразы

МУЗЫКАЛЬНОСТЬ (правила Suno):

1. Ударения:
   - Правильное ударение капсом: зАмок или замОк
   - Акцент на словах капсом: Мысли убегают, оставляя лишь ТЕНИ

2. Буква Ё:
   - ВСЕГДА пиши букву Ё (не Е)
   - Пример: всё, ещё, чёрный

3. Распевы гласных:
   - Для длинных нот: ле-е-ето, о-о-о-о
   - Больше гласных = длиннее распев
   - Используй дефисы между гласными

4. Вокализы:
   - Добавляй эмоциональные: У-у-у… А-а-а! О-о-у-у…
   - Можно в конце строк или отдельной строкой

5. Бэк-вокал:
   - Используй круглые скобки: (со мной, со мной)
   - Пример: Моя мечта (и только ты!) останется со мной (со мной)

6. Пунктуация:
   - Используй …, !, ?, !.., ?.., ?! для интонации
   - Влияют на эмоциональность исполнения

7. Длина строк:
   - Короткие строки = протяжное пение
   - Длинные строки = речитатив (для рэпа)

ДЛИНА ПЕСНИ:

- Общая длина: 20-30 строк (без учёта тегов)
- Куплет: 4-6 строк
- Припев: 3-4 строки
- Бридж: 2-4 строки

ФОРМАТ ВЫВОДА:

⚠️ КРИТИЧНО: Верни ТОЛЬКО текст песни с тегами Suno.
⚠️ НЕ добавляй НИКАКИХ комментариев, пояснений, вступлений или заключений.
⚠️ НЕ пиши "Вот текст песни:", "Надеюсь вам понравится" и т.п.
⚠️ Только чистый текст песни, который можно сразу отправить в Suno.

Пример правильного формата:

[Intro]
О-о-о…

[Verse 1]
Мой друг Алексей (Алексей!)
Ты лучший на све-е-ете
С тобой всегда веселЕй
И радостнЕй на планете

[Chorus]
С Днём рожденья, бра-а-ат!
Ты как солнца луч и гро-о-ом
Пусть сбудется всё подря-а-ад
Счастье ждёт за каждым углом! (за углом!)

[Verse 2]
...

[Chorus]
...

[Bridge]
...

[Chorus]
...

[Outro]
О-о-о… (с Днём рожденья!)

[End]

НАЧИНАЙ ГЕНЕРАЦИЮ ТЕКСТА ПЕСНИ СЕЙЧАС`;
}

async function generateWithChatGPT(prompt: string): Promise<number> {
  try {
    const response = await genapi.post('/networks/gpt-5-2', {
      messages: [
        {
          role: 'system',
          content: 'Ты — профессиональный автор песен на русском языке для Suno AI. Отвечаешь ТОЛЬКО текстом песни с тегами, без комментариев.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4096,
      temperature: 0.9,
      top_p: 1,
    });

    return response.data.request_id;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown }; message?: string };
      console.error('ChatGPT error:', axiosError.response?.data || axiosError.message);
    } else {
      console.error('ChatGPT error:', error);
    }
    throw new Error('Ошибка генерации текста');
  }
}

async function generateWithClaude(prompt: string): Promise<number> {
  const response = await genapi.post('/networks/claude-sonnet-3-5', {
    prompt: prompt,
    max_tokens: 4096,
    temperature: 0.9,
  });
  return response.data.request_id;
}

async function generateWithGemini(prompt: string): Promise<number> {
  const response = await genapi.post('/networks/gemini-pro', {
    prompt: prompt,
    max_tokens: 4096,
  });
  return response.data.request_id;
}

export async function generateSongText(formData: SongFormData): Promise<string> {
  const prompt = createSongPrompt(formData);
  const modelConfig = getCurrentModelConfig();

  let requestId: number;

  switch (modelConfig.networkId) {
    case 'gpt-5-2':
      requestId = await generateWithChatGPT(prompt);
      break;
    case 'claude-sonnet-3-5':
      requestId = await generateWithClaude(prompt);
      break;
    case 'gemini-pro':
      requestId = await generateWithGemini(prompt);
      break;
    default:
      throw new Error(`Неизвестная модель: ${modelConfig.networkId}`);
  }

  const result = await pollRequestStatus(requestId, 30, 3000);

  // Для ChatGPT результат возвращается как строка
  if (typeof result === 'string') {
    return result;
  }

  // Если результат - объект с полем content (новый формат ChatGPT)
  if (result && typeof result === 'object' && 'content' in result) {
    const content = (result as { content: unknown }).content;
    if (typeof content === 'string') {
      return content;
    }
  }

  throw new Error('Неожиданный формат ответа от AI модели');
}
