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
 */
export async function trackConversion(
  orderId: string,
  serviceType: 'song' | 'santa' | 'future_service',
  amount: number
): Promise<void> {
  try {
    const partnerData = await getPartnerCookie();

    if (!partnerData) {
      console.log('[Affiliate] No partner cookie found, skipping conversion tracking');
      return;
    }

    console.log('[Affiliate] Tracking conversion for partner:', partnerData.partnerId);

    // Вызываем API для записи конверсии
    // Используем абсолютный URL для серверных запросов
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

    const response = await fetch(`${baseUrl}/api/affiliate/track-conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        partner_id: partnerData.partnerId,
        session_id: partnerData.sessionId,
        order_id: orderId,
        service_type: serviceType,
        amount: amount,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Affiliate] Failed to track conversion:', error);
      return;
    }

    const result = await response.json();
    console.log('[Affiliate] Conversion tracked successfully:', result);
  } catch (error) {
    console.error('[Affiliate] Error tracking conversion:', error);
    // Не бросаем ошибку, чтобы не прервать основной процесс
  }
}
