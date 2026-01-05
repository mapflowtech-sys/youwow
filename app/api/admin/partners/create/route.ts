// API: Создать нового партнёра (для админки)

import { NextRequest, NextResponse } from 'next/server';
import { createPartner } from '@/lib/affiliate/supabase-queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, website, payment_info, commission_rate, notes, is_active, status } = body;

    // Валидация
    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: 'ID and name are required' },
        { status: 400 }
      );
    }

    // Проверка формата ID (только латиница, цифры, дефис)
    if (!/^[a-z0-9-]+$/.test(id)) {
      return NextResponse.json(
        { success: false, error: 'ID must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    const partner = await createPartner({
      id,
      name,
      website: website || null,
      payment_info: payment_info || null,
      commission_rate: commission_rate || 200.00,
      notes: notes || null,
      is_active: is_active !== undefined ? is_active : true,
      status: status || 'active', // По умолчанию 'active'
    });

    console.log('[Admin API] Partner created:', partner.id);

    return NextResponse.json({
      success: true,
      partner,
    });
  } catch (error) {
    console.error('[Admin API] Error creating partner:', error);

    // Проверяем на дублирование ID
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Partner with this ID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}
