# YouWow — Персональные подарки с WOW-эффектом

## Что это
B2C платформа для создания персональных подарков (песни, видео). Основной продукт — генерация персональных песен с именами и фактами о получателе. Сайт: youwow.ru

## Стек
- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4, Radix UI, shadcn/ui, framer-motion
- **Шрифт:** Onest (Google Fonts, Cyrillic)
- **Цвета:** Коралловый-розовый (#E8567F) — CSS variables в `app/globals.css`
- **Backend:** Supabase (PostgreSQL, Auth)
- **Платежи:** YooKassa (основной), 1Plat (резервный)
- **AI генерация:** Suno API через GenAPI
- **Email:** Resend
- **Видео:** FFmpeg (fluent-ffmpeg)
- **Аналитика:** Яндекс.Метрика
- **TypeScript:** Strict mode, Zod для валидации форм

## Команды
```bash
npm run dev      # Dev server (Turbopack, port 3003)
npm run build    # Production build
npm run lint     # ESLint 9 (flat config)
```

## Структура проекта
```
app/
├── (services)/song/     # Главная страница — генерация песен
├── (services)/santa/    # Дед Мороз (сезонный)
├── (services)/_tarot/   # Таро (отключён, префикс _)
├── order/[id]/          # Страница заказа + статус генерации
├── admin/partners/      # Админка партнёрской программы
├── partner/[id]/        # Публичная статистика партнёра
├── legal/               # Юридические страницы
├── payment/             # Успех/неудача оплаты
├── api/song/            # API генерации и обработки песен
├── api/payment/         # Вебхуки оплаты (YooKassa, 1Plat)
├── api/affiliate/       # Трекинг партнёрских кликов
└── api/admin/           # Админ API

components/
├── ui/                  # shadcn/ui компоненты (button, dialog, select...)
├── shared/              # Header, Footer, Loading
├── affiliate/           # Компоненты партнёрской программы
├── PaymentWidget.tsx    # Виджет YooKassa
└── YandexMetrika.tsx    # Аналитика

lib/
├── genapi/              # Клиент AI генерации (Suno)
├── payment/             # Провайдеры оплаты (YooKassa, 1Plat)
├── affiliate/           # Партнёрская система
├── supabase.ts          # Клиент Supabase
└── utils.ts             # Утилиты (cn, formatPrice...)

scripts/                 # Утилиты разработки (test-*, check-*, trigger-*)
docs/                    # Документация (archive/ — устаревшие)
supabase/                # Миграции БД
```

## Ключевые паттерны
- **CSS переменные:** Все цвета через HSL в `:root` → `@theme` в globals.css
- **Формы:** react-hook-form + zod для валидации
- **Анимации:** framer-motion (scroll-reveal, staggered cards, hover)
- **Тема:** Только light mode (next-themes с `defaultTheme="light"`)
- **Middleware:** Трекинг партнёрских utm-меток (файл deprecated в Next 16, нужна миграция на proxy)

## Важно помнить
- `_tarot` — отключённый сервис, игнорируется в ESLint и tsconfig
- `serverExternalPackages` в next.config.mjs для FFmpeg
- YooKassa widget грузится динамически через `<script>`
- PrimeReact используется только в admin/partners (тема: lara-light-pink)
- Все Schema.org JSON-LD встроены в song/page.tsx
- Партнёрская система реализована на ~70%, есть план в docs/archive

## Текущий статус
Проект в активной разработке. Основной функционал работает. Фокус — улучшение UX, SEO, и расширение сервисов.
