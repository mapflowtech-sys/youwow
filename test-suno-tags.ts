/**
 * Тестовый файл для проверки новой системы генерации тегов для Suno
 * Запустить: npx tsx test-suno-tags.ts
 */

// Копируем словари из suno-generation.ts для тестирования
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

const STYLE_TAGS: Record<string, string> = {
  'Весёлая': 'playful mood, upbeat feeling, bright melody, positive energy, lighthearted performance',
  'Душевная': 'emotional mood, warm feeling, sincere vocals, heartfelt delivery, soft dynamics',
  'Прожарка': 'sarcastic tone, playful sarcasm, confident delivery, rhythmic emphasis, attitude performance',
  'Романтичная': 'romantic mood, tender emotion, soft vocals, intimate delivery, gentle dynamics',
  'Энергичная': 'inspiring mood, uplifting energy, anthemic feeling, confident vocals, building dynamics',
  'Мотивирующая': 'inspiring mood, uplifting energy, anthemic feeling, confident vocals, building dynamics',
  'Ностальгическая': 'nostalgic mood, reflective feeling, warm tone, emotional depth, soft arrangement',
};

interface TestFormData {
  voice: 'male' | 'female';
  genre: string;
  style: string;
  customStyle?: string;
}

function createSunoTags(formData: TestFormData): string {
  const vocalType = formData.voice === 'male' ? 'male singer' : 'female singer';
  const genreTags = GENRE_TAGS[formData.genre] || formData.genre;

  let styleTags = '';
  if (formData.style === 'Свой вариант' && formData.customStyle) {
    styleTags = `experimental mood, ${formData.customStyle}, experimental feeling`;
  } else {
    const styleKey = formData.customStyle || formData.style;
    styleTags = STYLE_TAGS[styleKey] || styleKey;
  }

  return `${vocalType}, ${genreTags}, ${styleTags}`;
}

// Тестовые случаи
console.log('=== ТЕСТИРОВАНИЕ НОВОЙ СИСТЕМЫ ТЕГОВ ДЛЯ SUNO ===\n');

// Пример 1: Женский вокал + Романтичная + Классический поп (из вашего примера)
console.log('ПРИМЕР 1: Женский вокал + Романтичная + Классический поп');
const test1 = createSunoTags({
  voice: 'female',
  genre: 'Классический поп',
  style: 'Романтичная',
});
console.log('Теги:', test1);
console.log('');

// Пример 2: Мужской вокал + Весёлая + Рок
console.log('ПРИМЕР 2: Мужской вокал + Весёлая + Рок');
const test2 = createSunoTags({
  voice: 'male',
  genre: 'Рок',
  style: 'Весёлая',
});
console.log('Теги:', test2);
console.log('');

// Пример 3: Женский вокал + Ностальгическая + Шансон
console.log('ПРИМЕР 3: Женский вокал + Ностальгическая + Шансон');
const test3 = createSunoTags({
  voice: 'female',
  genre: 'Шансон',
  style: 'Ностальгическая',
});
console.log('Теги:', test3);
console.log('');

// Пример 4: Мужской вокал + Прожарка + Рэп
console.log('ПРИМЕР 4: Мужской вокал + Прожарка + Рэп');
const test4 = createSunoTags({
  voice: 'male',
  genre: 'Рэп',
  style: 'Прожарка',
});
console.log('Теги:', test4);
console.log('');

// Пример 5: Женский вокал + Свой вариант (кастомный стиль) + Джаз
console.log('ПРИМЕР 5: Женский вокал + Свой вариант "медленная и грустная" + Джаз');
const test5 = createSunoTags({
  voice: 'female',
  genre: 'Джаз',
  style: 'Свой вариант',
  customStyle: 'медленная и грустная',
});
console.log('Теги:', test5);
console.log('');

// Пример 6: Мужской вокал + Мотивирующая + Электро
console.log('ПРИМЕР 6: Мужской вокал + Мотивирующая + Электро');
const test6 = createSunoTags({
  voice: 'male',
  genre: 'Электро',
  style: 'Мотивирующая',
});
console.log('Теги:', test6);
console.log('');

console.log('=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
