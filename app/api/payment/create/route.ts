import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider, SONG_PRICE } from '@/lib/payment/config';
import { createOrder } from '@/lib/db-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, formData, bypass, method, useWidget } = body;

    if (!email || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if this is a bypass request (for testing)
    const bypassEmail = process.env.TEST_BYPASS_EMAIL;
    const isBypassRequest = bypass && bypassEmail && email.toLowerCase() === bypassEmail.toLowerCase();

    // Create order in database
    const order = await createOrder({
      serviceType: 'song',
      customerEmail: email,
      customerName: formData.aboutWho || 'Клиент',
      inputData: formData,
      amount: isBypassRequest ? 0 : SONG_PRICE, // Free for bypass
    });

    console.log('[Payment] Order created:', order.id, isBypassRequest ? '(BYPASS MODE)' : '');

    // If bypass mode, skip payment and mark as paid immediately
    if (isBypassRequest) {
      const { updateOrderStatus } = await import('@/lib/db-helpers');
      await updateOrderStatus(order.id, 'paid', {
        payment_id: 'bypass-' + order.id,
        payment_provider: 'bypass',
      });

      console.log('[Bypass] Order marked as paid, ready for generation');

      return NextResponse.json({
        success: true,
        orderId: order.id,
        bypass: true,
      });
    }

    // Normal payment flow
    const paymentProvider = getPaymentProvider();

    const payment = await paymentProvider.createPayment({
      orderId: order.id,
      userId: order.user_id || order.id,
      amount: SONG_PRICE,
      email: email,
      method: method || 'card', // Use selected method or default to card
      useWidget: useWidget ?? false, // Use widget mode if requested
    });

    console.log('[Payment] Payment created:', {
      guid: payment.guid,
      paymentId: payment.paymentId,
      url: payment.paymentUrl,
      token: payment.confirmationToken ? '***' : undefined,
      useWidget: useWidget ?? false,
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
        confirmationToken: payment.confirmationToken, // For widget
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
