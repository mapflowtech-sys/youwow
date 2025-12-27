# 1plat API Documentation

## Base Information
- **Base URL**: https://1plat.cash
- **Shop ID**: 1296
- **Secret Key**: Kogortalove1!

## Authorization
For API requests, pass in headers:
- `x-shop`: Shop ID (1296)
- `x-secret`: Secret key (Kogortalove1!)

## Signature Generation

### Signature in Callback
Two signatures are sent: `signature` and `signature_v2`

```javascript
// signature (HMAC SHA256)
const signature = crypto
  .createHmac("sha256", shopSecret)
  .update(JSON.stringify(body.payload))
  .digest("hex");

// signature_v2 (MD5)
const signature_v2 = crypto
  .createHash('md5')
  .update(merchantId + '' + amount + '' + shopId + '' + shopSecret)
  .digest('hex')
```

### Signature in Request
```javascript
const sign = crypto
  .createHash('md5')
  .update(shopId + ':' + secret + ':' + amount + ':' + merchantOrderId)
  .digest('hex')
```

## Payment Statuses
- `-2` - No suitable requisites
- `-1` - Draft (waiting for method selection)
- `0` - Waiting for payment
- `1` - Paid, waiting for merchant confirmation
- `2` - Confirmed by merchant, closed

## Payment Methods
- `card` - Card payment
- `sbp` - SBP (phone number)
- `crypto` - Cryptocurrency
- `qr` - QR code (NSPK)

## API Endpoints

### Get Available Methods
```
GET /api/merchant/payments/methods/by-api
```

Response:
```json
{
  "success": 1,
  "systems": [
    {
      "system_group": "card",
      "min": 100,
      "max": 500000
    },
    {
      "system_group": "sbp",
      "min": 100,
      "max": 500000
    }
  ]
}
```

### Create Payment
```
POST /api/merchant/order/create/by-api
```

Headers:
- `x-shop`: 1296
- `x-secret`: Kogortalove1!

Body:
```json
{
  "merchant_order_id": "string",
  "user_id": 123,
  "amount": 14500,
  "email": "user@example.com",
  "method": "card" // or "sbp", "qr", "crypto"
}
```

Response (card/sbp):
```json
{
  "success": 1,
  "guid": "111111-add6-5b69-2222-725f7099a32f",
  "payment": {
    "note": {
      "currency": "RUB",
      "pan": "2200 1545 3449 7549",
      "bank": "Альфа",
      "fio": "Егор Гончаров"
    },
    "method_group": "card",
    "id": 271097,
    "status": 0,
    "amount": 14500,
    "expired": "2025-04-11T14:54:51.187Z"
  },
  "url": "https://pay.1plat.cash/pay/:guid"
}
```

### Get Payment Info
```
GET /api/merchant/order/info/:guid/by-api
```

### Callback (Webhook)
URL configured in shop settings. POST request with:
```json
{
  "signature": "asdw12asdv212sd",
  "signature_v2": "asfage3greawfa",
  "payment_id": "123",
  "guid": "guid",
  "merchant_id": "543",
  "user_id": "1111",
  "status": 0,
  "amount": 100,
  "amount_to_pay": 100,
  "amount_to_shop": 85,
  "expired": "date"
}
```

Must respond with status 200 or 201.

## Verification File
File already exists at `/public/1plat.txt` with content: `1296`

## Notes
- Webhook URL must be configured in shop settings
- Generation should start only after status becomes 1 or 2
- Status 1: Paid, waiting for confirmation
- Status 2: Confirmed and closed
