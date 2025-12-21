# YouWow

Мультисервисная платформа персонализированных цифровых подарков на базе ИИ.

## Сервисы

- **Гадание Таро** (290₽) — AI генерирует карту Таро с лицом пользователя
- **Видео от Деда Мороза** (от 390₽) — персональное видео-поздравление
- **Персональная песня** (490₽) — AI создаёт уникальную песню

## Технологии

- Next.js 14.2 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Framer Motion

## Запуск

```bash
npm install
cp .env.example .env.local
# Заполните .env.local вашими ключами
npm run dev
```

## Структура

```
/app          — страницы (App Router)
/components   — React компоненты
/lib          — утилиты
/services     — AI, платежи, email
/types        — TypeScript типы
```
