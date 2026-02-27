# Руководство по интеграции виджета ЮKassa

Документация по работе с виджетом ЮKassa для приёма платежей.

---

## Ключевые особенности

### Способы оплаты
Способы оплаты, которые поддерживает виджет:
- Кошелек ЮMoney
- Банковская карта (произвольная карта и карты, привязанные к кошельку ЮMoney или к Сбер ID)
- Mir Pay
- SberPay
- T-Pay
- СБП (Система быстрых платежей)
- «Покупки в кредит» от СберБанка (кредит и рассрочка)

**Важно:** Если проводите платежи в две стадии или сохраняете способ оплаты для автоплатежей, на платежной форме отображаются только те способы, которые поддерживают используемую вами опцию.

### Платежная форма
- Автоматически подстраивается под размеры устройства пользователя
- Проверяет вводимые данные
- Подсказывает пользователю, если что-то введено некорректно
- Можно настроить язык интерфейса и цветовую схему

Если оплата не проходит, виджет обрабатывает неуспешные попытки: отображает сообщение об ошибке и предлагает попробовать оплатить еще раз с повторным выбором способа оплаты. Можно отключить эту настройку через менеджера ЮKassa.

---

## Сценарий проведения платежа

1. Пользователь переходит к оплате
2. Вы отправляете ЮKassa запрос на создание платежа
3. ЮKassa возвращает вам созданный объект платежа с токеном для инициализации виджета
4. Вы инициализируете виджет и отображаете форму на странице оплаты или во всплывающем окне
5. Пользователь выбирает способ оплаты, вводит данные
6. При необходимости виджет перенаправляет пользователя на страницу подтверждения платежа или отображает всплывающее окно (например, для аутентификации по 3‑D Secure)
7. Пользователь подтверждает платеж
8. Если платеж не прошел и срок действия токена не истек, виджет отображает сообщение об ошибке и предлагает оплатить еще раз
9. Если пользователь подтвердил платеж или закончился срок действия токена, виджет перенаправляет на страницу завершения оплаты или выполняет настроенные действия
10. Вы отображаете нужную информацию в зависимости от статуса платежа

---

## Быстрый старт

### Шаг 1. Создайте платеж

```bash
curl https://api.yookassa.ru/v3/payments \
  -X POST \
  -u <Идентификатор магазина>:<Секретный ключ> \
  -H 'Idempotence-Key: <Ключ идемпотентности>' \
  -H 'Content-Type: application/json' \
  -d '{
        "amount": {
          "value": "2.00",
          "currency": "RUB"
        },
        "confirmation": {
          "type": "embedded"
        },
        "capture": true,
        "description": "Заказ №72"
      }'
```

В ответе вы получите `confirmation_token`:

```json
{
  "id": "22d6d597-000f-5000-9000-145f6df21d6f",
  "status": "pending",
  "confirmation": {
    "type": "embedded",
    "confirmation_token": "ct-24301ae5-000f-5000-9000-13f5f1c2f8e0"
  },
  ...
}
```

### Шаг 2. Инициализируйте виджет и отобразите платежную форму

```html
<!--Подключение библиотеки-->
<script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js"></script>

<!--HTML-элемент, в котором будет отображаться платежная форма-->
<div id="payment-form"></div>

<script>
//Инициализация виджета. Все параметры обязательные.
const checkout = new window.YooMoneyCheckoutWidget({
    confirmation_token: 'ct-24301ae5-000f-5000-9000-13f5f1c2f8e0', //Токен от ЮKassa
    return_url: 'https://example.com/', //Ссылка на страницу завершения оплаты
    error_callback: function(error) {
        console.log(error)
    }
});

//Отображение платежной формы в контейнере
checkout.render('payment-form');
</script>
```

### Шаг 3. Введите тестовые данные

**Для тестового магазина используйте тестовую карту:**
- Номер: `5555 5555 5555 4477`
- Срок действия: `01/30` (или другая дата больше текущей)
- CVC: `123` (или три любые цифры)
- Код для прохождения 3-D Secure: `123` (или три любые цифры)

---

## Размещение виджета

### Минимальные требования
- Минимальная ширина контейнера: **288 пикселей**
- Кодировка сайта: **UTF-8**

### Пример базовой интеграции

```html
<script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js"></script>
<div id="payment-form"></div>

<script>
const checkout = new window.YooMoneyCheckoutWidget({
    confirmation_token: 'confirmation-token',
    return_url: 'https://example.com',
    error_callback: function(error) {
        //Обработка ошибок инициализации
    }
});

checkout.render('payment-form')
  .then(() => {
     //Код после отображения платежной формы
  });
</script>
```

---

## Отображение виджета во всплывающем окне

Для отображения в модальном окне передайте `modal: true`:

```html
<script src="https://yookassa.ru/checkout-widget/v1/checkout-widget.js"></script>

<script>
const checkout = new window.YooMoneyCheckoutWidget({
    confirmation_token: 'confirmation-token',
    return_url: 'https://example.com',

    customization: {
        modal: true // Открыть во всплывающем окне
    },

    error_callback: function(error) {
        console.log(error)
    }
});

// Отображение платежной формы в модальном окне
checkout.render();
</script>
```

---

## Обработка событий виджета

### Простое уведомление о завершении оплаты

```javascript
const checkout = new window.YooMoneyCheckoutWidget({
  confirmation_token: 'confirmation-token',
  // НЕ указываем return_url!
  error_callback: function(error) {
    console.log(error)
  }
});

checkout.on('complete', () => {
  // Код после оплаты (успешной или нет)
  checkout.destroy(); // Удаление виджета
});

checkout.render('payment-form');
```

### Уведомление с детализацией статуса

```javascript
const checkout = new window.YooMoneyCheckoutWidget({
  confirmation_token: 'confirmation-token',
  error_callback: function(error) {
    console.log(error)
  }
});

checkout.on('success', () => {
  // Код после успешной оплаты
  checkout.destroy();
});

checkout.on('fail', () => {
  // Код после неудачной оплаты
  checkout.destroy();
});

checkout.render('payment-form');
```

### Закрытие модального окна

```javascript
checkout.on('modal_close', () => {
  // Пользователь закрыл модальное окно
  console.log('Модальное окно закрыто');
});
```

---

## Настройка внешнего вида

### Настройка языка

При создании платежа передайте `locale`:

```json
{
  "confirmation": {
    "type": "embedded",
    "locale": "en_US"
  }
}
```

### Настройка цветовой схемы

```javascript
const checkout = new window.YooMoneyCheckoutWidget({
    confirmation_token: 'confirmation-token',
    return_url: 'https://example.com',

    customization: {
        colors: {
            // Цвет кнопки Заплатить и акцентных элементов
            control_primary: '#8b5cf6',

            // Цвет платежной формы и её элементов
            background: '#F2F3F5'
        }
    },

    error_callback: function(error) {
        console.log(error)
    }
});
```

**Доступные параметры цветов:**
- `control_primary` — цвет акцентных элементов (кнопка Заплатить)
- `control_primary_content` — цвет текста в кнопке
- `background` — цвет фона платежной формы
- `text` — цвет текста
- `border` — цвет границ и разделителей
- `control_secondary` — цвет неакцентных элементов

---

## Перезагрузка виджета

Если пользователь может изменить заказ на странице оплаты:

```javascript
// Удаление старого виджета
checkout.destroy();

// Создание нового платежа и получение нового токена
const newToken = await createNewPayment();

// Инициализация нового виджета
const checkoutNew = new window.YooMoneyCheckoutWidget({
    confirmation_token: newToken,
    return_url: 'https://example.com',
    error_callback: function(error) {
        console.log(error)
    }
});

checkoutNew.render('payment-form');
```

---

## Важные моменты

### Токен подтверждения
- **confirmation_token** — одноразовый
- Срок действия: **1 час**
- Если срок истёк, виджет вернёт ошибку `token_expired`
- Для нового платежа нужен новый токен

### СБП (Система быстрых платежей)
- ❌ **НЕ доступна в тестовом режиме**
- ✅ **Доступна в боевом режиме** после:
  1. Подключения реального магазина
  2. Включения СБП в настройках ЮKassa
  3. Заключения договора с ЮKassa

### Обработка результата оплаты
После оплаты обязательно проверьте статус платежа:
- Через webhook-уведомления от ЮKassa (рекомендуется)
- Или периодическими запросами к API

```bash
curl https://api.yookassa.ru/v3/payments/{payment_id} \
  -u <Идентификатор магазина>:<Секретный ключ>
```

---

## Пример успешно завершенного платежа

```json
{
  "id": "22d6d597-000f-5000-9000-145f6df21d6f",
  "status": "succeeded",
  "paid": true,
  "amount": {
    "value": "2.00",
    "currency": "RUB"
  },
  "payment_method": {
    "type": "bank_card",
    "card": {
      "first6": "555555",
      "last4": "4477",
      "card_type": "MasterCard"
    }
  },
  ...
}
```

---

## Сравнение: Умный платёж vs Виджет

| Параметр | Умный платёж | Виджет ЮKassa |
|----------|--------------|---------------|
| Интеграция | Редирект на страницу ЮKassa | Встраивается на вашу страницу |
| Пользователь покидает сайт | ✅ Да | ❌ Нет |
| Промежуточная страница | ✅ Есть (~3-5 сек) | ❌ Нет |
| Кастомизация | ❌ Ограничена | ✅ Полная |
| Контроль UX | ❌ Минимальный | ✅ Полный |
| Модальное окно | ❌ Нет | ✅ Да |
| Обработка событий | ❌ Только return_url | ✅ Success/Fail/Complete |

---

## Полезные ссылки

- [Документация ЮKassa по виджету](https://yookassa.ru/developers/payment-acceptance/integration-scenarios/widget)
- [API Reference](https://yookassa.ru/developers/api)
- [Тестовые данные](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing)

---

**Дата последнего обновления:** 30.12.2024
