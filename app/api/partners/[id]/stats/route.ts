// API: Получить статистику партнёра (публичный endpoint)

import { NextRequest, NextResponse } from 'next/server';
import { getPartnerStats } from '@/lib/affiliate/supabase-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partnerId = params.id;

    const stats = await getPartnerStats(partnerId);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('[Partner API] Error fetching partner stats:', error);

    // Если партнёр не найден
    if (error.message === 'Partner not found') {
      return NextResponse.json(
        { success: false, error: 'Партнёр не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Ошибка загрузки статистики' },
      { status: 500 }
    );
  }
}
