import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SONG_PRICE } from '@/lib/payment/config';

describe('Payment Config', () => {
  it('цена песни = 590 рублей', () => {
    expect(SONG_PRICE).toBe(590);
  });

  it('цена песни — число', () => {
    expect(typeof SONG_PRICE).toBe('number');
    expect(SONG_PRICE).toBeGreaterThan(0);
  });
});

describe('getPaymentProvider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Нужны реальные env для конструктора YooKassa
    process.env = {
      ...originalEnv,
      YOOKASSA_SHOP_ID: 'test-shop-id',
      YOOKASSA_SECRET_KEY: 'test-secret-key',
    };
    // Очищаем кэш модулей чтобы getPaymentProvider создал свежий инстанс
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetModules();
  });

  it('по умолчанию возвращает YooKassa провайдер', async () => {
    delete process.env.PAYMENT_PROVIDER;
    const { getPaymentProvider } = await import('@/lib/payment/config');
    const provider = getPaymentProvider();
    expect(provider.name).toBe('yookassa');
  });

  it('возвращает YooKassa при явном указании', async () => {
    process.env.PAYMENT_PROVIDER = 'yookassa';
    const { getPaymentProvider } = await import('@/lib/payment/config');
    const provider = getPaymentProvider();
    expect(provider.name).toBe('yookassa');
  });

  it('бросает ошибку при неизвестном провайдере', async () => {
    process.env.PAYMENT_PROVIDER = 'nonexistent';
    const { getPaymentProvider } = await import('@/lib/payment/config');
    expect(() => getPaymentProvider()).toThrow('Unknown payment provider');
  });
});
