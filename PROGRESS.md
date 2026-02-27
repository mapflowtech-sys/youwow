# История изменений — YouWow

## 2026-02-27 — Большое обновление стека + рефакторинг

### Обновление зависимостей
- Next.js 14.2.35 → **16.1.6** (Turbopack по умолчанию)
- React 18 → **19.2.4**
- Tailwind CSS 3.4.1 → **4.2.1** (CSS @theme вместо JS config)
- ESLint 8 → **9.39.3** (flat config: eslint.config.mjs)
- TypeScript → **5.9.3**
- framer-motion, Supabase, Zod, lucide-react и др. — всё обновлено

### Миграции для совместимости
- `params` → `Promise<params>` в 9 dynamic route handlers
- `request.ip` удалён (deprecated в Next 16)
- webpack externals → `serverExternalPackages`
- `.eslintrc.json` → `eslint.config.mjs`
- `tailwind.config.ts` удалён → `@theme` в globals.css
- Дублирующий `manifest.json` удалён (есть `manifest.ts`)

### Рефакторинг проекта
- 17 temp файлов `tmpclaude-*` удалены
- 9 скриптов → `scripts/`
- 13 документов → `docs/` (12 стали archive)
- Старый `OrderStatusDisplayOld.tsx` удалён
- Бэкап `suno-generation.ts.backup` удалён
- Создан `.claudeignore`, `CLAUDE.md`, `TODO.md`, `PROGRESS.md`
- Настроен `.claude/memory.md`

### Редизайн song/page.tsx (v2)
- Палитра: оранжевый → коралловый-розовый (#E8567F)
- Шрифт: Inter + Space Grotesk → Onest
- Добавлены framer-motion анимации (scroll-reveal, staggered cards, hover)
- Карточки с тенями, hover-lift, уникальными пастельными акцентами
- FAQ с CSS grid-template-rows анимацией
- Pulse-ring анимация для аудио плеера
- Все Schema.org JSON-LD сохранены

### MCP и инструменты
- Установлен Context7 MCP (актуальная документация библиотек)
- Установлены Skills: frontend-design, web-design-guidelines
