// API: Создать выплату партнёру (для админки)

import { NextRequest, NextResponse } from 'next/server';
import { createPayout, getPartnerPayouts } from '@/lib/affiliate/supabase-queries';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id: partnerId } = await params;
    const body = await request.json();
    const { period_start, period_end, payment_method, notes } = body;

    // Валидация
    if (!period_start || !period_end) {
      return NextResponse.json(
        { success: false, error: 'Укажите период выплаты' },
        { status: 400 }
      );
    }

    // Создаём выплату
    const payout = await createPayout({
      partnerId,
      periodStart: period_start,
      periodEnd: period_end,
      paymentMethod: payment_method,
      notes,
    });

    return NextResponse.json({
      success: true,
      payout,
    });
  } catch (error) {
    console.error('[Admin API] Error creating payout:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Ошибка создания выплаты' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id: partnerId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const payouts = await getPartnerPayouts(partnerId, limit);

    return NextResponse.json({
      success: true,
      payouts,
    });
  } catch (error) {
    console.error('[Admin API] Error fetching payouts:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка загрузки выплат' },
      { status: 500 }
    );
  }
}
