// API: Получить список всех партнёров (для админки)

import { NextRequest, NextResponse } from 'next/server';
import { getAllPartners } from '@/lib/affiliate/supabase-queries';

export async function GET(request: NextRequest) {
  try {
    const partners = await getAllPartners();

    return NextResponse.json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error('[Admin API] Error fetching partners list:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}
