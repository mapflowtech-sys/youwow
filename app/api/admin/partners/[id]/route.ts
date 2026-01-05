// API: Обновить партнёра (для админки)

import { NextRequest, NextResponse } from 'next/server';
import { updatePartner } from '@/lib/affiliate/supabase-queries';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partnerId = params.id;
    const body = await request.json();
    const { name, website, payment_info, commission_rate, notes } = body;

    const partner = await updatePartner(partnerId, {
      name,
      website: website || null,
      payment_info: payment_info || null,
      commission_rate: commission_rate || 200.00,
      notes: notes || null,
    });

    console.log('[Admin API] Partner updated:', partner.id);

    return NextResponse.json({
      success: true,
      partner,
    });
  } catch (error) {
    console.error('[Admin API] Error updating partner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update partner' },
      { status: 500 }
    );
  }
}
