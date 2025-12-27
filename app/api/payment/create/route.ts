import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider, SONG_PRICE } from '@/lib/payment/config';
import { createOrder } from '@/lib/db-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, formData } = body;

    if (!email || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await createOrder({
      serviceType: 'song',
      customerEmail: email,
      customerName: formData.aboutWho || 'Клиент',
      inputData: formData,
      amount: SONG_PRICE,
    });

    console.log('[Payment] Order created:', order.id);

    // Create payment with 1plat
    const paymentProvider = getPaymentProvider();

    const payment = await paymentProvider.createPayment({
      orderId: order.id,
      userId: order.user_id || order.id,
      amount: SONG_PRICE,
      email: email,
      method: 'card', // Default to card payment
    });

    console.log('[Payment] Payment created:', {
      guid: payment.guid,
      paymentId: payment.paymentId,
      url: payment.paymentUrl,
    });

    // Update order with payment info
    const { updateOrderStatus } = await import('@/lib/db-helpers');
    await updateOrderStatus(order.id, 'pending', {
      payment_id: payment.guid,
      payment_provider: paymentProvider.name,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      payment: {
        guid: payment.guid,
        url: payment.paymentUrl,
        data: payment.paymentData,
      },
    });
  } catch (error) {
    console.error('[Payment] Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
