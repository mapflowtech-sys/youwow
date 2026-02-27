// API: Изменить статус партнёра (для админки)

import { NextRequest, NextResponse } from 'next/server';
import { updatePartner } from '@/lib/affiliate/supabase-queries';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth';
import type { PartnerStatus } from '@/types/affiliate';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id: partnerId } = await params;
    const body = await request.json();
    const { status } = body as { status: PartnerStatus };

    // Валидация статуса
    const validStatuses: PartnerStatus[] = ['active', 'inactive', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Неверный статус. Допустимые: active, inactive, archived' },
        { status: 400 }
      );
    }

    // Обновляем статус
    const updatedPartner = await updatePartner(partnerId, { status });

    console.log(`[Admin API] Partner ${partnerId} status changed to ${status}`);

    return NextResponse.json({
      success: true,
      partner: updatedPartner,
    });
  } catch (error) {
    console.error('[Admin API] Error updating partner status:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Ошибка обновления статуса' },
      { status: 500 }
    );
  }
}
