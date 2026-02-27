import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // 1. Получаем данные из JSON body
    const body = await request.json();

    const {
      signature,
      signature_v2,
      payment_id,
      guid,
      merchant_id,
      user_id: _user_id, // eslint-disable-line @typescript-eslint/no-unused-vars
      status,
      amount,
      amount_to_pay: _amount_to_pay, // eslint-disable-line @typescript-eslint/no-unused-vars
      amount_to_shop,
      expired: _expired, // eslint-disable-line @typescript-eslint/no-unused-vars
    } = body;

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

    // Проверяем хотя бы одну подпись
    const isSignatureValid = signature === calculatedSignature || signature_v2 === calculatedSignatureV2;

    if (!isSignatureValid) {
      console.error('[1plat Webhook] Invalid signature');
      return new NextResponse('Invalid signature', { status: 403 });
    }

    // 5. ВСЁ ПРОВЕРЕНО! Обрабатываем платёж

    console.log(`[1plat Webhook] Payment verified: payment_id=${payment_id}, status=${status}, amount=${amount_to_shop}`);

    // Статусы 1plat:
    // -2 - нет подходящих реквизитов
    // -1 - черновик (выбор метода)
    // 0 - ожидает оплаты
    // 1 - оплачен, ожидает подтверждения мерчанта
    // 2 - подтвержден мерчантом, закрыт

    if (status === 1 || status === 2) {
      // Платёж успешно оплачен

      // Find order by payment_id (guid)
      const { updateOrderStatus } = await import('@/lib/db-helpers');
      const { supabaseAdmin } = await import('@/lib/supabase');

      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('payment_id', guid)
        .single();

      if (!order) {
        console.error('[1plat Webhook] Order not found for payment:', guid);
        return new NextResponse('Order not found', { status: 404 });
      }

      if (order.status === 'paid' || order.status === 'processing' || order.status === 'completed') {
        return new NextResponse('OK', { status: 200 });
      }

      // Update order to paid status
      await updateOrderStatus(order.id, 'paid');
      console.log(`[1plat Webhook] Order ${order.id} marked as paid, triggering generation`);

      // Запускаем генерацию песни
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      // Запускаем генерацию асинхронно
      fetch(`${baseUrl}/api/song/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id })
      }).catch(error => {
        console.error('[1plat Webhook] Failed to trigger song generation:', error);
      });
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
