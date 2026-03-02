// API: Получить историю выплат партнёра (публичный endpoint)

import { NextRequest, NextResponse } from 'next/server';
import { getPartnerPayouts } from '@/lib/affiliate/supabase-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: partnerId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const payouts = await getPartnerPayouts(partnerId, limit);

    // Убираем внутренние поля (notes, conversion_ids) из публичного API
    const publicPayouts = (payouts || []).map(({ notes, conversion_ids, ...rest }) => rest);

    return NextResponse.json({
      success: true,
      payouts: publicPayouts,
    });
  } catch (error) {
    console.error('[Partner API] Error fetching payouts:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка загрузки выплат' },
      { status: 500 }
    );
  }
}
