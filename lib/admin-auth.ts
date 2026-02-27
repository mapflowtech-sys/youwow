import { NextRequest, NextResponse } from 'next/server';

/**
 * Проверить авторизацию для admin API routes.
 * Клиент отправляет пароль в заголовке x-admin-token.
 */
export function verifyAdminAuth(request: NextRequest): boolean {
  const token = request.headers.get('x-admin-token');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!token || !adminPassword) return false;
  return token === adminPassword;
}

/**
 * Возвращает 401 ответ
 */
export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}
