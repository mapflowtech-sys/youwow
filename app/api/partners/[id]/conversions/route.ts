// API: Получить конверсии партнёра (публичный endpoint)

import { NextRequest, NextResponse } from 'next/server';
import { getPartnerConversions } from '@/lib/affiliate/supabase-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: partnerId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const conversions = await getPartnerConversions(partnerId, limit);

    return NextResponse.json({
      success: true,
      conversions,
    });
  } catch (error) {
    console.error('[Partner API] Error fetching conversions:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка загрузки конверсий' },
      { status: 500 }
    );
  }
}
