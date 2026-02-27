# Настройка платёжной системы 1plat

## 1. Переменные окружения (.env.local)

После активации магазина в 1plat заполните:

```env
ONEPLAT_SHOP_ID=ваш_shop_id
ONEPLAT_SECRET=ваш_secret_key
```

**Где взять:**
- `ONEPLAT_SHOP_ID` - ID магазина (видно рядом с названием магазина в ЛК)
- `ONEPLAT_SECRET` - Секретный ключ (в настройках магазина в ЛК)

---

## 2. Настройка в личном кабинете 1plat

### URL страницы успешной оплаты (result_url):
```
https://youwow.ru/payment/success
```

### URL страницы неудачной оплаты (fail_url):
```
https://youwow.ru/payment/failure
```

### URL callback (url_callback):
```
https://youwow.ru/api/payment/1plat/webhook
```

⚠️ **ВАЖНО:** Webhook для 1plat - это **ОТДЕЛЬНЫЙ** endpoint, не путать с Free-Kassa!

---

## 3. Верификация магазина

Для верификации **нужно выбрать ОДИН из трех методов**:

### Метод 1: Файл 1plat.txt (РЕКОМЕНДУЮ - САМЫЙ ПРОСТОЙ)

1. Создайте файл `1plat.txt` в папке `public/`
2. Внутри файла напишите только ID вашего магазина (число)
3. Файл должен быть доступен по адресу: `https://youwow.ru/1plat.txt`

**Пример содержимого файла:**
```
12345
```
(где 12345 - ваш shop_id)

---

### Метод 2: NS-запись (если есть доступ к DNS)

Добавьте TXT-запись для домена:
```
youwow.ru. 3600 IN TXT "1plat:12345"
```
(где 12345 - ваш shop_id)

---

### Метод 3: Meta тег (если можете редактировать layout)

В `app/layout.tsx` в секцию `<head>` добавьте:
```html
<meta name="1plat" content="12345" />
```
(где 12345 - ваш shop_id)

---

## 4. Как работает webhook 1plat

### Что делает endpoint `/api/payment/1plat/webhook`:

1. ✅ **Получает JSON данные** о платеже
2. ✅ **Проверяет две подписи** (signature и signature_v2)
3. ✅ **Проверяет Shop ID** - что это наш магазин
4. ✅ **Логирует данные** - для отладки
5. ⏳ **TODO: Обновляет заказ в БД** - статус в зависимости от status
6. ⏳ **TODO: Запускает генерацию** - когда status = 2 (полностью подтвержден)
7. ✅ **Возвращает 200 OK** - чтобы 1plat не слал повторно

### Статусы платежей 1plat:

- `-2` - Нет подходящих реквизитов
- `-1` - Черновик (пользователь выбирает метод)
- `0` - Ожидает оплаты
- `1` - Оплачен, ожидает подтверждения мерчанта ✅
- `2` - Подтвержден мерчантом, закрыт ✅✅

---

## 5. Различия между Free-Kassa и 1plat webhooks

| Параметр | Free-Kassa | 1plat |
|----------|------------|-------|
| **URL** | `/api/payment/webhook` | `/api/payment/1plat/webhook` |
| **Формат данных** | form-data | JSON |
| **Проверка подписи** | MD5 | HMAC SHA256 или MD5 |
| **Проверка IP** | Да (4 IP) | Нет |
| **Ответ** | "YES" | "OK" (200) |

---

## 6. Создание платежа (Host2Host)

Когда пользователь нажимает "Оплатить", нужно:

### Вариант 1: Host2Host (API)

```typescript
const response = await fetch('https://1plat.cash/api/merchant/order/create/by-api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-shop': process.env.ONEPLAT_SHOP_ID,
    'x-secret': process.env.ONEPLAT_SECRET
  },
  body: JSON.stringify({
    merchant_order_id: orderId,
    user_id: userId,
    amount: 590, // сумма в рублях
    email: userEmail,
    method: 'card', // или 'sbp', 'qr', 'crypto'
    // currency: 'USDT', // только для crypto
  })
});

const data = await response.json();
// Редиректим пользователя на data.url
```

### Вариант 2: Redirect с подписью

```typescript
const shopId = process.env.ONEPLAT_SHOP_ID;
const secret = process.env.ONEPLAT_SECRET;
const amount = 590;
const merchantOrderId = orderId;

// Генерируем подпись
const sign = crypto
  .createHash('md5')
  .update(`${shopId}:${secret}:${amount}:${merchantOrderId}`)
  .digest('hex');

// Редиректим на форму оплаты
const paymentUrl = `https://1plat.cash/api/merchant/order/sign/create/by-api`;
// POST с параметрами: sign, merchant_order_id, user_id, shop_id, amount, email
```

---

## 7. Методы оплаты 1plat

Актуальные методы можно получить через API:
```
GET https://1plat.cash/api/merchant/payments/methods/by-api
```

Основные методы:
- `card` - оплата картой (мин: 100₽, макс: 500 000₽)
- `sbp` - оплата по СБП (мин: 100₽, макс: 500 000₽)
- `qr` - оплата по QR (НСПК) (мин: 100₽, макс: 500 000₽)
- `crypto` - криптовалюта (мин: 1₽, макс: 500 000₽)
  - Валюты: USDT, TRX

---

## 8. Тестирование

После активации магазина:
1. Создайте тестовый платёж через API
2. Проверьте что webhook получает уведомления
3. Проверьте логи в Vercel/TimeWeb
4. Проверьте редиректы на success/failure

---

## 9. Логи webhook

Все события логируются с префиксом `[1plat Webhook]`:
- Данные платежа
- Проверка подписей (обе версии)
- Результат обработки

Смотрите логи в консоли деплоя (Vercel/TimeWeb).

---

## 10. Безопасность

✅ **Реализовано:**
- Проверка двух подписей (signature и signature_v2)
- Проверка Shop ID
- Валидация JSON структуры

⚠️ **TODO (когда будет БД):**
- Проверка что заказ существует
- Проверка что заказ не оплачен дважды
- Проверка суммы платежа

---

## 11. URL для отправки в 1plat

| Поле | URL |
|------|-----|
| URL успешной оплаты | `https://youwow.ru/payment/success` |
| URL неудачной оплаты | `https://youwow.ru/payment/failure` |
| URL callback | `https://youwow.ru/api/payment/1plat/webhook` |
| Файл верификации | `https://youwow.ru/1plat.txt` (создать вручную) |

---

## 12. Что делать после получения ключей

1. Заполните `ONEPLAT_SHOP_ID` и `ONEPLAT_SECRET` в `.env.local`
2. Добавьте те же переменные в настройки проекта на TimeWeb Cloud
3. Создайте файл `public/1plat.txt` с вашим shop_id
4. Задеплойте изменения
5. Дождитесь верификации от 1plat
6. Протестируйте тестовый платёж
