// API: Получить список всех партнёров (для админки)

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth';
import type { Partner, PartnerStatus } from '@/types/affiliate';

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') as PartnerStatus | null;

    let query = supabaseAdmin
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });

    // Фильтр по статусу (если указан)
    if (statusFilter && ['active', 'inactive', 'archived'].includes(statusFilter)) {
      query = query.eq('status', statusFilter);
    }

    const { data, error} = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      partners: data as Partner[],
    });
  } catch (error) {
    console.error('[Admin API] Error fetching partners list:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}
