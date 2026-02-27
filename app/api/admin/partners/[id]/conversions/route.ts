// API: Получить конверсии партнёра (для админки)

import { NextRequest, NextResponse } from 'next/server';
import { getPartnerConversions } from '@/lib/affiliate/supabase-queries';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth';

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

    const conversions = await getPartnerConversions(partnerId, limit);

    return NextResponse.json({
      success: true,
      conversions,
    });
  } catch (error) {
    console.error('[Admin API] Error fetching conversions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversions' },
      { status: 500 }
    );
  }
}
