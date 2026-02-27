// API: Запись клика по партнёрской ссылке

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      partner_id,
      session_id,
      landing_page,
      utm_source,
      utm_medium,
      utm_campaign,
    } = body;

    // Валидация
    if (!partner_id || !session_id || !landing_page) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Проверяем существование партнёра
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .select('id, status')
      .eq('id', partner_id)
      .single();

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    if (partner.status !== 'active') {
      return NextResponse.json(
        { error: 'Partner is inactive' },
        { status: 403 }
      );
    }

    // Получаем IP и User-Agent
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || null;

    // Проверка дедупликации (один IP не может кликнуть дважды за 1 минуту)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: recentClick } = await supabaseAdmin
      .from('partner_clicks')
      .select('id')
      .eq('partner_id', partner_id)
      .eq('ip_address', ip_address)
      .gte('clicked_at', oneMinuteAgo)
      .limit(1)
      .single();

    if (recentClick) {
      // Клик уже был недавно, не записываем дубликат
      return NextResponse.json(
        { message: 'Click already tracked', click_id: recentClick.id },
        { status: 200 }
      );
    }

    // Записываем клик
    const { data: click, error: clickError } = await supabaseAdmin
      .from('partner_clicks')
      .insert({
        partner_id,
        session_id,
        landing_page,
        ip_address,
        user_agent,
        referrer,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      })
      .select()
      .single();

    if (clickError) {
      console.error('Error tracking click:', clickError);
      return NextResponse.json(
        { error: 'Failed to track click' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Click tracked successfully', click },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in track-click API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
