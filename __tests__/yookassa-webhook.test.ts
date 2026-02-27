import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('YooKassa verifyWebhook', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      YOOKASSA_SHOP_ID: 'test-shop',
      YOOKASSA_SECRET_KEY: 'test-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('корректно парсит успешный платёж', async () => {
    const { YooKassaProvider } = await import('@/lib/payment/providers/yookassa');
    const provider = new YooKassaProvider();

    const webhookBody = {
      type: 'notification',
      event: 'payment.succeeded',
      object: {
        id: 'payment-123',
        status: 'succeeded',
        paid: true,
        amount: { value: '590.00', currency: 'RUB' },
        metadata: { orderId: 'order-abc', userId: 'user-xyz' },
        created_at: '2024-01-01T00:00:00Z',
      },
    };

    const result = await provider.verifyWebhook(webhookBody);

    expect(result.orderId).toBe('order-abc');
    expect(result.paymentId).toBe('payment-123');
    expect(result.status).toBe(1); // succeeded = 1
    expect(result.amount).toBe(590);
    expect(result.userId).toBe('user-xyz');
  });

  it('корректно парсит отменённый платёж', async () => {
    const { YooKassaProvider } = await import('@/lib/payment/providers/yookassa');
    const provider = new YooKassaProvider();

    const webhookBody = {
      type: 'notification',
      event: 'payment.canceled',
      object: {
        id: 'payment-456',
        status: 'canceled',
        paid: false,
        amount: { value: '590.00', currency: 'RUB' },
        metadata: { orderId: 'order-def', userId: 'user-aaa' },
        created_at: '2024-01-01T00:00:00Z',
      },
    };

    const result = await provider.verifyWebhook(webhookBody);

    expect(result.status).toBe(3); // canceled = 3
    expect(result.orderId).toBe('order-def');
  });

  it('корректно парсит платёж в ожидании capture', async () => {
    const { YooKassaProvider } = await import('@/lib/payment/providers/yookassa');
    const provider = new YooKassaProvider();

    const webhookBody = {
      type: 'notification',
      event: 'payment.waiting_for_capture',
      object: {
        id: 'payment-789',
        status: 'waiting_for_capture',
        paid: false,
        amount: { value: '100.00', currency: 'RUB' },
        metadata: { orderId: 'order-ghi', userId: 'user-bbb' },
        created_at: '2024-01-01T00:00:00Z',
      },
    };

    const result = await provider.verifyWebhook(webhookBody);

    expect(result.status).toBe(2); // waiting_for_capture = 2
    expect(result.amount).toBe(100);
  });

  it('парсит pending платёж как status 0', async () => {
    const { YooKassaProvider } = await import('@/lib/payment/providers/yookassa');
    const provider = new YooKassaProvider();

    const webhookBody = {
      type: 'notification',
      event: 'payment.succeeded', // event может не совпадать со status
      object: {
        id: 'payment-000',
        status: 'pending',
        paid: false,
        amount: { value: '590.00', currency: 'RUB' },
        metadata: { orderId: 'order-xyz' },
        created_at: '2024-01-01T00:00:00Z',
      },
    };

    const result = await provider.verifyWebhook(webhookBody);

    expect(result.status).toBe(0); // pending = 0
  });

  it('использует payment.id если нет metadata.orderId', async () => {
    const { YooKassaProvider } = await import('@/lib/payment/providers/yookassa');
    const provider = new YooKassaProvider();

    const webhookBody = {
      type: 'notification',
      event: 'payment.succeeded',
      object: {
        id: 'payment-fallback-id',
        status: 'succeeded',
        paid: true,
        amount: { value: '590.00', currency: 'RUB' },
        // Нет metadata
        created_at: '2024-01-01T00:00:00Z',
      },
    };

    const result = await provider.verifyWebhook(webhookBody);

    expect(result.orderId).toBe('payment-fallback-id');
    expect(result.userId).toBe('');
  });

  it('бросает ошибку при неправильном type', async () => {
    const { YooKassaProvider } = await import('@/lib/payment/providers/yookassa');
    const provider = new YooKassaProvider();

    const webhookBody = {
      type: 'invalid',
      event: 'payment.succeeded',
      object: {
        id: 'payment-err',
        status: 'succeeded',
        paid: true,
        amount: { value: '590.00', currency: 'RUB' },
        created_at: '2024-01-01T00:00:00Z',
      },
    };

    await expect(provider.verifyWebhook(webhookBody)).rejects.toThrow('Invalid webhook type');
  });

  it('бросает ошибку если не настроены credentials', async () => {
    delete process.env.YOOKASSA_SHOP_ID;
    delete process.env.YOOKASSA_SECRET_KEY;

    vi.resetModules();
    const { YooKassaProvider } = await import('@/lib/payment/providers/yookassa');

    expect(() => new YooKassaProvider()).toThrow('YooKassa credentials not configured');
  });
});
