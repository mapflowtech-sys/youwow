// API: Получить статистику партнёра (для админки)

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
  } catch (error) {
    console.error('[Admin API] Error fetching partner stats:', error);

    if (error instanceof Error && error.message === 'Partner not found') {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
