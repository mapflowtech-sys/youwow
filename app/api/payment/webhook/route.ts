import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Free-Kassa (FK.Money) разрешённые IP адреса
const ALLOWED_IPS = [
  '168.119.157.136',
  '168.119.60.227',
  '178.154.197.79',
  '51.250.54.238'
];

// Получить реальный IP клиента
function getClientIP(request: NextRequest): string {
  // Проверяем заголовки в порядке приоритета
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // X-Forwarded-For может содержать несколько IP через запятую
    return xForwardedFor.split(',')[0].trim();
  }

  // Fallback (хотя в Vercel/Next.js это обычно не используется)
  return request.ip || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // 1. Проверка IP адреса
    const clientIP = getClientIP(request);
    console.log('[Webhook] Request from IP:', clientIP);

    if (!ALLOWED_IPS.includes(clientIP)) {
      console.error('[Webhook] Forbidden IP:', clientIP);
      return new NextResponse('Forbidden: Invalid IP', { status: 403 });
    }

    // 2. Получаем данные из form-data
    const formData = await request.formData();

    const merchantId = formData.get('MERCHANT_ID') as string;
    const amount = formData.get('AMOUNT') as string;
    const intid = formData.get('intid') as string; // ID операции FK
    const merchantOrderId = formData.get('MERCHANT_ORDER_ID') as string;
    const pEmail = formData.get('P_EMAIL') as string;
    const pPhone = formData.get('P_PHONE') as string;
    const curId = formData.get('CUR_ID') as string;
    const sign = formData.get('SIGN') as string;
    const payerAccount = formData.get('payer_account') as string;
    const commission = formData.get('commission') as string;

    console.log('[Webhook] Payment notification:', {
      merchantId,
      amount,
      intid,
      merchantOrderId,
      pEmail,
      curId,
      sign
    });

    // Собираем us_ параметры (пользовательские)
    const customParams: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('us_')) {
        customParams[key] = value as string;
      }
    }

    // 3. Проверка обязательных параметров
    if (!merchantId || !amount || !merchantOrderId || !sign) {
      console.error('[Webhook] Missing required parameters');
      return new NextResponse('Bad Request: Missing parameters', { status: 400 });
    }

    // 4. Получаем секреты из переменных окружения
    const expectedMerchantId = process.env.FK_MERCHANT_ID;
    const secretWord2 = process.env.FK_SECRET_WORD_2;

    if (!expectedMerchantId || !secretWord2) {
      console.error('[Webhook] Missing environment variables');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    // 5. Проверяем, что это наш магазин
    if (merchantId !== expectedMerchantId) {
      console.error('[Webhook] Invalid merchant ID:', merchantId);
      return new NextResponse('Invalid merchant ID', { status: 400 });
    }

    // 6. Проверка подписи
    // Формула: MD5(MERCHANT_ID:AMOUNT:SECRET_WORD_2:MERCHANT_ORDER_ID)
    const signatureString = `${merchantId}:${amount}:${secretWord2}:${merchantOrderId}`;
    const calculatedSign = crypto.createHash('md5').update(signatureString).digest('hex');

    console.log('[Webhook] Signature check:', {
      received: sign,
      calculated: calculatedSign,
      match: sign === calculatedSign
    });

    if (sign !== calculatedSign) {
      console.error('[Webhook] Invalid signature');
      return new NextResponse('Invalid signature', { status: 403 });
    }

    // 7. ВСЁ ПРОВЕРЕНО! Обрабатываем платёж

    console.log('[Webhook] ✅ Payment verified successfully');
    console.log('[Webhook] Order ID:', merchantOrderId);
    console.log('[Webhook] Amount:', amount);
    console.log('[Webhook] FK Transaction ID:', intid);
    console.log('[Webhook] Email:', pEmail);
    console.log('[Webhook] Custom params:', customParams);

    // TODO: Здесь добавить логику:
    // 1. Найти заказ в БД по merchantOrderId
    // 2. Проверить, что заказ не был уже оплачен
    // 3. Проверить, что сумма совпадает с суммой заказа
    // 4. Обновить статус заказа на 'paid'
    // 5. Запустить генерацию песни
    // 6. Отправить email пользователю (опционально)

    // Пример (когда будет БД):
    /*
    const order = await db.order.findUnique({
      where: { id: merchantOrderId }
    });

    if (!order) {
      console.error('[Webhook] Order not found:', merchantOrderId);
      return new NextResponse('Order not found', { status: 404 });
    }

    if (order.status === 'paid' || order.status === 'completed') {
      console.log('[Webhook] Order already paid, skipping');
      return new NextResponse('YES', { status: 200 });
    }

    if (parseFloat(amount) !== order.amount) {
      console.error('[Webhook] Amount mismatch');
      return new NextResponse('Amount mismatch', { status: 400 });
    }

    // Обновляем заказ
    await db.order.update({
      where: { id: merchantOrderId },
      data: {
        status: 'paid',
        paymentId: intid,
        paidAt: new Date(),
        paymentMethod: `FK CUR_${curId}`,
        paymentEmail: pEmail,
        paymentPhone: pPhone,
      }
    });

    // Запускаем генерацию
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/song/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: merchantOrderId })
    });
    */

    // 8. Возвращаем YES - чтобы FK знал что всё ок
    return new NextResponse('YES', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

  } catch (error) {
    console.error('[Webhook] Error processing payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// На всякий случай обрабатываем GET (хотя должен быть только POST)
export async function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
