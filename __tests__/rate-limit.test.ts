import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    // Сбрасываем время чтобы не зависеть от предыдущих тестов
    vi.useFakeTimers();
  });

  it('разрешает первый запрос', () => {
    const result = checkRateLimit('1.2.3.4', {
      key: 'test-first',
      limit: 5,
      windowSec: 60,
    });

    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('разрешает запросы до лимита', () => {
    const opts = { key: 'test-limit', limit: 3, windowSec: 60 };

    const r1 = checkRateLimit('2.2.2.2', opts);
    const r2 = checkRateLimit('2.2.2.2', opts);
    const r3 = checkRateLimit('2.2.2.2', opts);

    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(2);
    expect(r2.success).toBe(true);
    expect(r2.remaining).toBe(1);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('блокирует после превышения лимита', () => {
    const opts = { key: 'test-block', limit: 2, windowSec: 60 };

    checkRateLimit('3.3.3.3', opts);
    checkRateLimit('3.3.3.3', opts);
    const blocked = checkRateLimit('3.3.3.3', opts);

    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('разделяет лимиты по IP', () => {
    const opts = { key: 'test-ips', limit: 1, windowSec: 60 };

    checkRateLimit('4.4.4.4', opts);
    const blocked = checkRateLimit('4.4.4.4', opts);
    const allowed = checkRateLimit('5.5.5.5', opts);

    expect(blocked.success).toBe(false);
    expect(allowed.success).toBe(true);
  });

  it('разделяет лимиты по ключу', () => {
    const ip = '6.6.6.6';

    checkRateLimit(ip, { key: 'key-a', limit: 1, windowSec: 60 });
    const blockedA = checkRateLimit(ip, { key: 'key-a', limit: 1, windowSec: 60 });
    const allowedB = checkRateLimit(ip, { key: 'key-b', limit: 1, windowSec: 60 });

    expect(blockedA.success).toBe(false);
    expect(allowedB.success).toBe(true);
  });

  it('сбрасывает лимит после истечения окна', () => {
    const opts = { key: 'test-reset', limit: 1, windowSec: 60 };

    checkRateLimit('7.7.7.7', opts);
    const blocked = checkRateLimit('7.7.7.7', opts);
    expect(blocked.success).toBe(false);

    // Перематываем время на 61 секунду
    vi.advanceTimersByTime(61_000);

    const allowed = checkRateLimit('7.7.7.7', opts);
    expect(allowed.success).toBe(true);
  });

  it('возвращает корректный resetAt', () => {
    const now = Date.now();
    const result = checkRateLimit('8.8.8.8', {
      key: 'test-reset-at',
      limit: 5,
      windowSec: 120,
    });

    // resetAt должен быть примерно now + 120s
    expect(result.resetAt).toBeGreaterThanOrEqual(now + 120_000);
    expect(result.resetAt).toBeLessThanOrEqual(now + 121_000);
  });
});

describe('getClientIp', () => {
  it('извлекает IP из x-forwarded-for', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('извлекает IP из x-real-ip', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '10.20.30.40' },
    });
    expect(getClientIp(req)).toBe('10.20.30.40');
  });

  it('предпочитает x-forwarded-for перед x-real-ip', () => {
    const req = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '1.1.1.1',
        'x-real-ip': '2.2.2.2',
      },
    });
    expect(getClientIp(req)).toBe('1.1.1.1');
  });

  it('возвращает unknown если нет заголовков', () => {
    const req = new Request('http://localhost');
    expect(getClientIp(req)).toBe('unknown');
  });
});
