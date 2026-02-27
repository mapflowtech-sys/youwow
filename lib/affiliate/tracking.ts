// Партнёрская система: работа с cookies и трекингом

import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import type { PartnerCookieData } from '@/types/affiliate';

// Константы
const PARTNER_COOKIE_NAME = 'youwow_partner';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 дней в секундах

/**
 * Сохранить данные партнёра в cookie
 */
export async function setPartnerCookie(
  partnerId: string,
  landingPage: string
): Promise<string> {
  const sessionId = uuidv4();

  const cookieData: PartnerCookieData = {
    partnerId,
    sessionId,
    clickedAt: new Date().toISOString(),
    landingPage,
  };

  const cookieStore = await cookies();

  cookieStore.set(PARTNER_COOKIE_NAME, JSON.stringify(cookieData), {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return sessionId;
}

/**
 * Получить данные партнёра из cookie
 */
export async function getPartnerCookie(): Promise<PartnerCookieData | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(PARTNER_COOKIE_NAME);

    if (!cookie?.value) {
      return null;
    }

    const data = JSON.parse(cookie.value) as PartnerCookieData;

    // Проверяем что cookie не истёк (30 дней)
    const clickedAt = new Date(data.clickedAt);
    const now = new Date();
    const daysDiff = (now.getTime() - clickedAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > 30) {
      await clearPartnerCookie();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading partner cookie:', error);
    return null;
  }
}

/**
 * Очистить партнёрский cookie
 */
export async function clearPartnerCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PARTNER_COOKIE_NAME);
}

/**
 * Проверить активность партнёра
 */
export async function hasActivePartner(): Promise<boolean> {
  const data = await getPartnerCookie();
  return data !== null;
}

/**
 * Записать конверсию (покупку) для партнёра
 * Читает данные из заказа (не из cookie, т.к. вызывается из серверного контекста)
 */
export async function trackConversion(
  orderId: string,
  serviceType: 'song' | 'santa' | 'future_service',
  amount: number
): Promise<void> {
  try {
    const { getOrderById } = await import('@/lib/db-helpers');
    const { supabaseAdmin } = await import('@/lib/supabase');

    const order = await getOrderById(orderId);

    if (!order.partner_id || !order.partner_session_id) {
      console.log('[Affiliate] No partner data in order, skipping conversion tracking');
      return;
    }

    console.log('[Affiliate] Tracking conversion for partner:', order.partner_id);

    // Получаем комиссию партнёра
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .select('commission_rate, status')
      .eq('id', order.partner_id)
      .single();

    if (partnerError || !partner) {
      console.error('[Affiliate] Partner not found:', order.partner_id);
      return;
    }

    if (partner.status !== 'active') {
      console.log('[Affiliate] Partner inactive, skipping conversion');
      return;
    }

    // Проверяем дедупликацию
    const { data: existing } = await supabaseAdmin
      .from('partner_conversions')
      .select('id')
      .eq('order_id', orderId)
      .single();

    if (existing) {
      console.log('[Affiliate] Conversion already tracked for order:', orderId);
      return;
    }

    // Получаем landing_page из клика
    const { data: click } = await supabaseAdmin
      .from('partner_clicks')
      .select('landing_page')
      .eq('session_id', order.partner_session_id)
      .single();

    // Записываем конверсию
    const { error: insertError } = await supabaseAdmin
      .from('partner_conversions')
      .insert({
        partner_id: order.partner_id,
        session_id: order.partner_session_id,
        order_id: orderId,
        service_type: serviceType,
        amount,
        commission: partner.commission_rate,
        landing_page: click?.landing_page || null,
        is_paid_out: false,
      });

    if (insertError) {
      console.error('[Affiliate] Failed to insert conversion:', insertError);
      return;
    }

    console.log('[Affiliate] Conversion tracked: partner=%s, commission=%s₽', order.partner_id, partner.commission_rate);
  } catch (error) {
    console.error('[Affiliate] Error tracking conversion:', error);
  }
}
