import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { YooKassaProvider } from '@/lib/payment/providers/yookassa';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const provider = new YooKassaProvider();
    const webhookData = await provider.verifyWebhook(body);

    // Only process successful payments
    if (webhookData.status !== 1) {
      return NextResponse.json({ received: true });
    }

    // Find the order by orderId
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', webhookData.orderId)
      .single();

    if (orderError || !order) {
      console.error('[YooKassa Webhook] Order not found:', webhookData.orderId, orderError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if already paid
    if (order.status === 'paid') {
      return NextResponse.json({ received: true });
    }

    // Update order status to paid
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_id: webhookData.paymentId,
        payment_provider: 'yookassa',
      })
      .eq('id', webhookData.orderId);

    if (updateError) {
      console.error('[YooKassa Webhook] Failed to update order:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    console.log(`[YooKassa Webhook] Order ${webhookData.orderId} marked as paid`);

    // Trigger song processing
    try {
      const processUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/song/process`;

      const processResponse = await fetch(processUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: webhookData.orderId,
        }),
      });

      if (!processResponse.ok) {
        const errorText = await processResponse.text();
        console.error('[YooKassa Webhook] Failed to trigger processing:', errorText);
      }
    } catch (processError) {
      console.error('[YooKassa Webhook] Error triggering processing:', processError);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[YooKassa Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
