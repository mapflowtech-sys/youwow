import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 попыток за 15 минут с одного IP
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(ip, {
      key: 'admin-auth',
      limit: 5,
      windowSec: 15 * 60,
    });

    if (!rateCheck.success) {
      const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { success: false, error: 'Слишком много попыток. Попробуйте позже.' },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter) },
        }
      );
    }

    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('[Admin Auth] ADMIN_PASSWORD not set');
      return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 });
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
