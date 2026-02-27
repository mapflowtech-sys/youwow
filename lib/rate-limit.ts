/**
 * Простой in-memory rate limiter для API routes.
 * Ограничивает количество запросов с одного IP за заданное окно времени.
 *
 * Для production с несколькими инстансами — использовать Redis.
 * Для одного инстанса Next.js — достаточно.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Очистка устаревших записей каждые 5 минут
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Уникальный ключ для этого лимитера (например, 'admin-auth') */
  key: string;
  /** Максимум запросов за окно */
  limit: number;
  /** Окно в секундах */
  windowSec: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Проверяет rate limit для указанного IP.
 * Возвращает { success: true } если запрос разрешён.
 */
export function checkRateLimit(ip: string, options: RateLimitOptions): RateLimitResult {
  const { key, limit, windowSec } = options;
  const storeKey = `${key}:${ip}`;
  const now = Date.now();

  const entry = store.get(storeKey);

  // Нет записи или окно истекло — создаём новую
  if (!entry || entry.resetAt < now) {
    store.set(storeKey, {
      count: 1,
      resetAt: now + windowSec * 1000,
    });
    return { success: true, remaining: limit - 1, resetAt: now + windowSec * 1000 };
  }

  // Есть запись, окно активно
  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Извлекает IP клиента из запроса
 */
export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  return 'unknown';
}
