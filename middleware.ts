// Middleware для обработки партнёрских ссылок

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const partnerId = searchParams.get('partner');

  // Если есть параметр ?partner=xxx
  if (partnerId) {
    try {
      // Создаём response для установки cookie
      const response = NextResponse.redirect(
        new URL(pathname, request.url)
      );

      // Генерируем session_id (UUID v4)
      const sessionId = crypto.randomUUID();

      // Сохраняем данные партнёра в cookie
      const cookieData = {
        partnerId,
        sessionId,
        clickedAt: new Date().toISOString(),
        landingPage: pathname,
      };

      response.cookies.set('youwow_partner', JSON.stringify(cookieData), {
        maxAge: 30 * 24 * 60 * 60, // 30 дней
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      // Собираем UTM параметры
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');

      // Асинхронно записываем клик в БД (не блокируем redirect)
      // Используем правильный базовый URL для production/dev
      const protocol = request.headers.get('x-forwarded-proto') || 'https';
      const host = request.headers.get('host') || 'localhost:3000';
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
      const apiUrl = `${baseUrl}/api/affiliate/track-click`;

      console.log('[Affiliate Middleware] Tracking click to:', apiUrl);

      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
          'x-real-ip': request.ip || '',
          'user-agent': request.headers.get('user-agent') || '',
          'referer': request.headers.get('referer') || '',
        },
        body: JSON.stringify({
          partner_id: partnerId,
          session_id: sessionId,
          landing_page: pathname,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        }),
      }).catch((error) => {
        console.error('[Affiliate Middleware] Error tracking click:', error);
      });

      return response;
    } catch (error) {
      console.error('Error in partner middleware:', error);
      // При ошибке просто редиректим без партнёрского трекинга
      return NextResponse.redirect(new URL(pathname, request.url));
    }
  }

  return NextResponse.next();
}

// Конфигурация: на каких путях запускать middleware
export const config = {
  matcher: [
    /*
     * Срабатывает на всех путях кроме:
     * - _next/static (статика)
     * - _next/image (оптимизация изображений)
     * - favicon.ico
     * - api routes (кроме нужных)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
