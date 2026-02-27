// API: Получить статистику партнёра (публичный endpoint)

import { NextRequest, NextResponse } from 'next/server';
import { getPartnerStats } from '@/lib/affiliate/supabase-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: partnerId } = await params;

    const stats = await getPartnerStats(partnerId);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('[Partner API] Error fetching partner stats:', error);

    // Если партнёр не найден
    if (error instanceof Error && error.message === 'Partner not found') {
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
