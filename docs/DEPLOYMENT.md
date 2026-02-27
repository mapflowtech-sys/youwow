# Инструкция по деплою YouWow на Vercel

## Подготовка перед деплоем

### ✅ Что уже готово:
- [x] Production build проходит успешно
- [x] Все TypeScript ошибки исправлены
- [x] SEO оптимизация настроена
- [x] Supabase интеграция готова
- [x] Формы заказов работают
- [x] Страница статуса заказа с автообновлением
- [x] Responsive дизайн на всех устройствах
- [x] Footer с реквизитами (заглушки)

### ⚠️ Что нужно сделать ПОСЛЕ деплоя:

1. **Обновить реквизиты в Footer**
   - Открыть `components/shared/footer.tsx`
   - Заменить заглушки на реальные данные:
     - ИП: ваше реальное наименование
     - ИНН: ваш реальный ИНН (12 цифр)
     - ОГРНИП: ваш реальный ОГРНИП (15 цифр)

2. **Заполнить юридические страницы**
   - `/legal/privacy` - Политика конфиденциальности
   - `/legal/offer` - Договор оферты
   - `/legal/terms` - Пользовательское соглашение

3. **Создать OG изображение**
   - Размер: 1200x630px
   - Путь: `public/og-image.jpg`
   - Инструкции: см. `public/README_OG_IMAGE.md`

## Деплой на Vercel

### Шаг 1: Подключить репозиторий

1. Зайдите на https://vercel.com
2. Нажмите "New Project"
3. Импортируйте ваш Git репозиторий
4. Framework Preset: **Next.js** (определится автоматически)

### Шаг 2: Настроить переменные окружения

В Vercel Dashboard → Settings → Environment Variables добавьте:

#### Supabase (обязательно):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Приложение (обязательно):
```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### AI Сервисы (добавите позже):
```
EDEN_AI_API_KEY=
ELEVENLABS_API_KEY=
SYNCLABS_API_KEY=
SUNO_API_KEY=
REPLICATE_API_KEY=
```

#### Платежи (добавите позже):
```
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
```

#### Email (добавите позже):
```
RESEND_API_KEY=
```

### Шаг 3: Deploy!

1. Нажмите "Deploy"
2. Vercel соберет проект (~2-3 минуты)
3. После деплоя получите URL вида: `https://your-project.vercel.app`

## После деплоя

### Проверьте работоспособность:

1. **Главная страница**: `/`
   - Проверьте что все анимации работают
   - Кнопки ведут на правильные страницы

2. **Страницы сервисов**:
   - `/santa` - форма Деда Мороза
   - `/song` - форма песни
   - Заполните тестовую форму и проверьте валидацию

3. **База данных**:
   - Проверьте что данные сохраняются в Supabase
   - Откройте Supabase Dashboard → Table Editor → orders

4. **SEO**:
   - Проверьте мета-теги: https://www.opengraph.xyz/
   - Проверьте sitemap: `https://yourdomain.com/sitemap.xml`
   - Проверьте robots.txt: `https://yourdomain.com/robots.txt`

### Настройте домен (опционально):

1. В Vercel Dashboard → Settings → Domains
2. Добавьте свой домен (например, youwow.ru)
3. Настройте DNS записи у регистратора
4. Обновите `NEXT_PUBLIC_APP_URL` в переменных окружения

## Мониторинг

### Vercel Analytics (бесплатно):
- Автоматически включен
- Отслеживает посещаемость и производительность
- Доступен в Vercel Dashboard → Analytics

### Supabase Logs:
- Supabase Dashboard → Logs
- Смотрите ошибки при создании заказов

## Troubleshooting

### Ошибка "Missing environment variables"
→ Проверьте что все переменные из `.env.example` добавлены в Vercel

### Ошибка подключения к Supabase
→ Проверьте правильность ключей в переменных окружения
→ Убедитесь что в Supabase включен доступ из любых IP (Settings → API → Allow all)

### Страницы не обновляются
→ Сделайте redeploy в Vercel Dashboard
→ Очистите кеш браузера (Ctrl+Shift+R)

## Следующие шаги

После успешного деплоя:

1. ✅ Протестируйте все формы
2. ✅ Заполните юридические страницы
3. ✅ Обновите реквизиты
4. ✅ Создайте OG изображение
5. ⏳ Настройте интеграцию с AI сервисами
6. ⏳ Подключите YooKassa для приёма платежей
7. ⏳ Настройте email уведомления (Resend)
8. ⏳ Запустите продакшен!

---

**Поддержка**: Если возникнут вопросы, проверьте документацию Next.js и Vercel:
- https://nextjs.org/docs/deployment
- https://vercel.com/docs
