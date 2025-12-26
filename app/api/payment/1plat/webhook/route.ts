import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    console.log('[1plat Webhook] Received payment notification');

    // 1. Получаем данные из JSON body
    const body = await request.json();

    const {
      signature,
      signature_v2,
      payment_id,
      guid,
      merchant_id,
      user_id,
      status,
      amount,
      amount_to_pay,
      amount_to_shop,
      expired,
    } = body;

    console.log('[1plat Webhook] Payment data:', {
      payment_id,
      guid,
      merchant_id,
      status,
      amount,
      amount_to_shop
    });

    // 2. Получаем секреты из переменных окружения
    const expectedShopId = process.env.ONEPLAT_SHOP_ID;
    const shopSecret = process.env.ONEPLAT_SECRET;

    if (!expectedShopId || !shopSecret) {
      console.error('[1plat Webhook] Missing environment variables');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    // 3. Проверяем, что это наш магазин
    if (merchant_id !== expectedShopId) {
      console.error('[1plat Webhook] Invalid merchant ID:', merchant_id);
      return new NextResponse('Invalid merchant ID', { status: 400 });
    }

    // 4. Проверка подписи (можно использовать signature или signature_v2)

    // Вариант 1: signature (HMAC SHA256)
    // Создаем копию body без полей signature и signature_v2 для проверки
    const payloadForSignature = { ...body };
    delete payloadForSignature.signature;
    delete payloadForSignature.signature_v2;

    const calculatedSignature = crypto
      .createHmac('sha256', shopSecret)
      .update(JSON.stringify(payloadForSignature))
      .digest('hex');

    // Вариант 2: signature_v2 (MD5)
    const calculatedSignatureV2 = crypto
      .createHash('md5')
      .update(`${merchant_id}${amount}${expectedShopId}${shopSecret}`)
      .digest('hex');

    console.log('[1plat Webhook] Signature check:', {
      received_signature: signature,
      calculated_signature: calculatedSignature,
      signature_match: signature === calculatedSignature,
      received_signature_v2: signature_v2,
      calculated_signature_v2: calculatedSignatureV2,
      signature_v2_match: signature_v2 === calculatedSignatureV2
    });

    // Проверяем хотя бы одну подпись
    const isSignatureValid = signature === calculatedSignature || signature_v2 === calculatedSignatureV2;

    if (!isSignatureValid) {
      console.error('[1plat Webhook] Invalid signature');
      return new NextResponse('Invalid signature', { status: 403 });
    }

    // 5. ВСЁ ПРОВЕРЕНО! Обрабатываем платёж

    console.log('[1plat Webhook] ✅ Payment verified successfully');
    console.log('[1plat Webhook] Payment ID:', payment_id);
    console.log('[1plat Webhook] GUID:', guid);
    console.log('[1plat Webhook] Status:', status);
    console.log('[1plat Webhook] Amount to shop:', amount_to_shop);

    // TODO: Обработка платежа в зависимости от статуса
    // Статусы 1plat:
    // -2 - нет подходящих реквизитов
    // -1 - черновик (выбор метода)
    // 0 - ожидает оплаты
    // 1 - оплачен, ожидает подтверждения мерчанта
    // 2 - подтвержден мерчантом, закрыт

    if (status === 1 || status === 2) {
      // Платёж успешно оплачен

      // TODO: Когда будет БД:
      /*
      const order = await db.order.findUnique({
        where: { id: user_id } // или по другому полю в зависимости от вашей логики
      });

      if (!order) {
        console.error('[1plat Webhook] Order not found:', user_id);
        return new NextResponse('Order not found', { status: 404 });
      }

      if (order.status === 'paid' || order.status === 'completed') {
        console.log('[1plat Webhook] Order already paid, skipping');
        return new NextResponse('OK', { status: 200 });
      }

      // Обновляем заказ
      await db.order.update({
        where: { id: user_id },
        data: {
          status: 'paid',
          paymentId: payment_id,
          paymentGuid: guid,
          paidAt: new Date(),
          paymentMethod: '1plat',
          amountPaid: amount,
          amountToShop: amount_to_shop,
        }
      });

      // Запускаем генерацию
      if (status === 2) { // только если полностью подтвержден
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/song/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: user_id })
        });
      }
      */
    }

    // 6. Возвращаем 200 или 201 - чтобы 1plat знал что всё ок
    return new NextResponse('OK', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

  } catch (error) {
    console.error('[1plat Webhook] Error processing payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// На всякий случай обрабатываем GET (хотя должен быть только POST)
export async function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
