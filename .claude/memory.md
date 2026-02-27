# Память проекта YouWow

## Решения по дизайну
- Цветовая палитра: коралловый-розовый #E8567F (primary), тёплый кремовый фон #FCF9F6
- Шрифт: Onest (Google Fonts) — выбран вместо Inter/Space Grotesk за красивую кириллицу
- Дизайн: праздничный, подарочный, НЕ как SaaS — с анимациями, тенями, hover-эффектами
- Tailwind v4: конфиг через CSS @theme в globals.css (tailwind.config.ts удалён)

## Решения по архитектуре
- Основной платёжный провайдер: YooKassa (виджет)
- Резервный: 1Plat (redirect)
- AI генерация: Suno через GenAPI proxy
- БД: Supabase (PostgreSQL)
- Деплой: Docker / Vercel

## Предпочтения пользователя
- Язык общения: русский
- Дизайн должен быть без "следов ИИ" — уникальный и продуманный
- Использовать Skills (frontend-design, web-design-guidelines) для дизайн-задач
- Context7 MCP установлен — использовать "use context7" для актуальной документации

## Известные проблемы
- middleware.ts deprecated в Next.js 16 (предупреждение при build) — нужна миграция на proxy
- AffiliateChart.tsx: warning о missing dependency в useEffect (не критично)
- Партнёрская система реализована на ~70%

## История обновлений
- 2026-02-27: Обновлено Next.js 14→16, React 18→19, Tailwind 3→4, ESLint 8→9
- 2026-02-27: Редизайн song/page.tsx — коралловая палитра, Onest, framer-motion анимации
- 2026-02-27: Рефакторинг проекта — scripts/, docs/, cleanup
