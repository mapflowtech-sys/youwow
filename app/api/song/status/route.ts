import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID отсутствует' },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.created_at,
        processingStartedAt: order.processing_started_at,
        completedAt: order.completed_at,
        resultUrl: order.result_url,
        resultMetadata: order.result_metadata,
        errorMessage: order.error_message,
      },
    });

  } catch (error) {
    console.error('Status API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка получения статуса';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
