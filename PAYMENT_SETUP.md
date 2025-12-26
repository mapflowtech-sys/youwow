# Настройка платёжной системы Free-Kassa

## 1. Переменные окружения (.env.local)

Замените `ваш_merchant_id` на реальный ID магазина в Free-Kassa:

```env
FK_MERCHANT_ID=ваш_merchant_id_из_личного_кабинета
FK_SECRET_WORD_1=9$NZ^d1KxQ-PAOe
FK_SECRET_WORD_2=PMTPL?)nZx?Pv5&
```

**Где взять Merchant ID:**
- Зайдите в личный кабинет Free-Kassa
- Раздел "Настройки магазина" или "Данные магазина"
- Скопируйте ID (обычно числовое значение)

---

## 2. Настройка в личном кабинете Free-Kassa

### URL сайта:
```
https://youwow.ru
```
**Метод:** GET

---

### URL успеха оплаты:
```
https://youwow.ru/payment/success
```
**Метод:** GET

---

### URL неудачи оплаты:
```
https://youwow.ru/payment/failure
```
**Метод:** GET

---

### URL оповещения (webhook):
```
https://youwow.ru/api/payment/webhook
```
**Метод:** POST

⚠️ **ВАЖНО:** Попросите техподдержку Free-Kassa включить проверку ответа "YES" для webhook.

---

## 3. Как работает webhook

### Что делает endpoint `/api/payment/webhook`:

1. ✅ **Проверяет IP адрес** - только с серверов FK (168.119.157.136, 168.119.60.227, 178.154.197.79, 51.250.54.238)
2. ✅ **Проверяет подпись** - MD5(MERCHANT_ID:AMOUNT:SECRET_WORD_2:MERCHANT_ORDER_ID)
3. ✅ **Проверяет Merchant ID** - что это наш магазин
4. ✅ **Логирует данные** - для отладки
5. ⏳ **TODO: Обновляет заказ в БД** - статус 'pending' → 'paid'
6. ⏳ **TODO: Запускает генерацию** - автоматически стартует создание песни
7. ✅ **Возвращает "YES"** - чтобы FK не слал уведомление повторно

---

## 4. Тестирование webhook (локально)

Для локального тестирования используйте **ngrok** или **cloudflared tunnel**:

### Вариант 1: ngrok
```bash
npm run dev
# В другом терминале:
ngrok http 3000
```

Используйте ngrok URL для webhook в настройках FK:
```
https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app/api/payment/webhook
```

### Вариант 2: Vercel Preview Deploy
Просто запушьте изменения в GitHub - Vercel создаст preview URL.

---

## 5. Логи webhook

Все события webhook логируются в консоль. Смотрите логи в Vercel Dashboard:
- Зайдите в проект на Vercel
- Вкладка "Logs"
- Фильтр по `/api/payment/webhook`

Что логируется:
- IP адрес отправителя
- Все параметры платежа
- Проверка подписи (received vs calculated)
- Результат обработки

---

## 6. Безопасность

✅ **Реализовано:**
- Проверка IP адресов FK
- Проверка MD5 подписи
- Проверка Merchant ID
- Валидация обязательных параметров

⚠️ **TODO (когда будет БД):**
- Проверка что заказ существует
- Проверка что заказ не был уже оплачен
- Проверка что сумма платежа совпадает с суммой заказа

---

## 7. Интеграция с формой оплаты

Когда пользователь заполнил форму и нажал "Оплатить", нужно:

1. Создать заказ в БД (сохранить данные песни)
2. Получить orderId
3. Сформировать ссылку на оплату:

```typescript
const merchantId = process.env.FK_MERCHANT_ID;
const secretWord1 = process.env.FK_SECRET_WORD_1;
const amount = '590'; // цена в рублях
const currency = 'RUB';
const orderId = 'song_abc123';

// MD5(merchantId:amount:secretWord1:currency:orderId)
const sign = crypto
  .createHash('md5')
  .update(`${merchantId}:${amount}:${secretWord1}:${currency}:${orderId}`)
  .digest('hex');

// Редирект на оплату
const paymentUrl = `https://pay.fk.money/?m=${merchantId}&oa=${amount}&o=${orderId}&s=${sign}&currency=${currency}&i=42&lang=ru&em=${userEmail}`;

// Редиректим пользователя
window.location.href = paymentUrl;
```

Параметры:
- `m` - Merchant ID
- `oa` - сумма (order amount)
- `o` - номер заказа (order)
- `s` - подпись (sign)
- `currency` - валюта (RUB)
- `i` - предпочитаемый способ оплаты (42 = СБП, 4 = карта RUB)
- `lang` - язык (ru/en)
- `em` - email пользователя

---

## 8. Что дальше?

После успешной оплаты:
1. FK отправит webhook на `/api/payment/webhook`
2. Webhook обновит статус заказа в БД
3. Webhook запустит генерацию песни
4. Пользователя редиректнет на `/payment/success?orderId=xxx`
5. Готовая песня придёт на email и будет доступна в личном кабинете

---

## 9. Поддержка

Если возникли проблемы:
- Проверьте логи в Vercel
- Проверьте что все env переменные заполнены
- Напишите в поддержку FK если webhook не срабатывает
- Проверьте что включена проверка ответа "YES" у FK
