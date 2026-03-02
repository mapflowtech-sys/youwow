import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Мокаем Supabase ──────────────────────────────────────────────────────────

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockEq = vi.fn();
const mockGte = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();

function createChain(finalResult: { data: unknown; error: unknown }) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(finalResult),
  };
  return chain;
}

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

// Мокаем next/headers для cookies
const mockCookieGet = vi.fn();
const mockCookieSet = vi.fn();
const mockCookieDelete = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: (...args: unknown[]) => mockCookieGet(...args),
    set: (...args: unknown[]) => mockCookieSet(...args),
    delete: (...args: unknown[]) => mockCookieDelete(...args),
  }),
}));

// Мокаем next/server
vi.mock('next/server', () => {
  class MockNextRequest extends Request {
    constructor(url: string, init?: RequestInit) {
      super(url, init);
    }
  }
  class MockNextResponse {
    static json(body: unknown, init?: { status?: number }) {
      return { body, status: init?.status || 200 };
    }
  }
  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// Мокаем db-helpers
const mockGetOrderById = vi.fn();
vi.mock('@/lib/db-helpers', () => ({
  getOrderById: (...args: unknown[]) => mockGetOrderById(...args),
}));

// ── Тесты getPartnerCookie ──────────────────────────────────────────────────

describe('getPartnerCookie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('возвращает null если cookie не установлен', async () => {
    mockCookieGet.mockReturnValue(null);

    const { getPartnerCookie } = await import('@/lib/affiliate/tracking');
    const result = await getPartnerCookie();

    expect(result).toBeNull();
    expect(mockCookieGet).toHaveBeenCalledWith('youwow_partner');
  });

  it('возвращает данные партнёра из валидного cookie', async () => {
    const cookieData = {
      partnerId: 'test-partner',
      sessionId: '550e8400-e29b-41d4-a716-446655440000',
      clickedAt: new Date().toISOString(),
      landingPage: '/song',
    };

    mockCookieGet.mockReturnValue({
      value: JSON.stringify(cookieData),
    });

    const { getPartnerCookie } = await import('@/lib/affiliate/tracking');
    const result = await getPartnerCookie();

    expect(result).toEqual(cookieData);
  });

  it('возвращает null и удаляет cookie если прошло больше 30 дней', async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 31);

    const cookieData = {
      partnerId: 'old-partner',
      sessionId: '550e8400-e29b-41d4-a716-446655440000',
      clickedAt: oldDate.toISOString(),
      landingPage: '/song',
    };

    mockCookieGet.mockReturnValue({
      value: JSON.stringify(cookieData),
    });

    const { getPartnerCookie } = await import('@/lib/affiliate/tracking');
    const result = await getPartnerCookie();

    expect(result).toBeNull();
    expect(mockCookieDelete).toHaveBeenCalledWith('youwow_partner');
  });

  it('возвращает null при невалидном JSON в cookie', async () => {
    mockCookieGet.mockReturnValue({
      value: 'not-json',
    });

    const { getPartnerCookie } = await import('@/lib/affiliate/tracking');
    const result = await getPartnerCookie();

    expect(result).toBeNull();
  });
});

// ── Тесты trackConversion ───────────────────────────────────────────────────

describe('trackConversion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('пропускает трекинг если в заказе нет partner_id', async () => {
    mockGetOrderById.mockResolvedValue({
      id: 'order-1',
      partner_id: null,
      partner_session_id: null,
    });

    const { trackConversion } = await import('@/lib/affiliate/tracking');
    await trackConversion('order-1', 'song', 590);

    // Не должно быть обращений к supabase для партнёров
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('пропускает трекинг если партнёр неактивен', async () => {
    mockGetOrderById.mockResolvedValue({
      id: 'order-2',
      partner_id: 'inactive-partner',
      partner_session_id: 'session-123',
    });

    // Мок: партнёр найден но неактивен
    const partnerChain = createChain({
      data: { commission_rate: 200, status: 'inactive' },
      error: null,
    });
    mockFrom.mockReturnValue(partnerChain);

    const { trackConversion } = await import('@/lib/affiliate/tracking');
    await trackConversion('order-2', 'song', 590);

    expect(mockFrom).toHaveBeenCalledWith('partners');
    // Не должно быть insert в partner_conversions
    // (only partners table was queried, not conversions)
  });

  it('пропускает если конверсия уже записана (дедупликация)', async () => {
    mockGetOrderById.mockResolvedValue({
      id: 'order-3',
      partner_id: 'active-partner',
      partner_session_id: 'session-456',
    });

    // Первый вызов from('partners') — партнёр активен
    const partnerChain = createChain({
      data: { commission_rate: 200, status: 'active' },
      error: null,
    });

    // Второй вызов from('partner_conversions') — уже есть запись
    const existingConversionChain = createChain({
      data: { id: 'existing-conversion' },
      error: null,
    });

    let callCount = 0;
    mockFrom.mockImplementation((table: string) => {
      callCount++;
      if (table === 'partners') return partnerChain;
      if (table === 'partner_conversions' && callCount <= 3) return existingConversionChain;
      return createChain({ data: null, error: null });
    });

    const { trackConversion } = await import('@/lib/affiliate/tracking');
    await trackConversion('order-3', 'song', 590);

    // Партнёр запрошен
    expect(mockFrom).toHaveBeenCalledWith('partners');
    // Конверсии проверены
    expect(mockFrom).toHaveBeenCalledWith('partner_conversions');
  });

  it('записывает конверсию для активного партнёра', async () => {
    mockGetOrderById.mockResolvedValue({
      id: 'order-4',
      partner_id: 'active-partner',
      partner_session_id: 'session-789',
    });

    const insertMock = vi.fn().mockResolvedValue({ error: null });

    let callIndex = 0;
    mockFrom.mockImplementation((table: string) => {
      callIndex++;
      if (table === 'partners') {
        return createChain({
          data: { commission_rate: 200, status: 'active' },
          error: null,
        });
      }
      if (table === 'partner_conversions') {
        // Первый раз — проверка дедупликации (нет записи)
        if (callIndex <= 3) {
          return createChain({ data: null, error: { code: 'PGRST116' } });
        }
        // Второй раз — insert
        return {
          insert: insertMock.mockReturnValue({
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        };
      }
      if (table === 'partner_clicks') {
        return createChain({ data: { landing_page: '/song' }, error: null });
      }
      return createChain({ data: null, error: null });
    });

    const { trackConversion } = await import('@/lib/affiliate/tracking');
    await trackConversion('order-4', 'song', 590);

    expect(mockFrom).toHaveBeenCalledWith('partners');
    expect(mockFrom).toHaveBeenCalledWith('partner_conversions');
  });
});

// ── Тесты track-click API ───────────────────────────────────────────────────

describe('track-click API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('возвращает 400 при отсутствии обязательных полей', async () => {
    const { NextRequest } = await import('next/server');
    const { POST } = await import('@/app/api/affiliate/track-click/route');

    const req = new NextRequest('http://localhost/api/affiliate/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partner_id: 'test' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it('возвращает 404 для несуществующего партнёра', async () => {
    const partnerChain = createChain({ data: null, error: { code: 'PGRST116' } });
    mockFrom.mockReturnValue(partnerChain);

    const { NextRequest } = await import('next/server');
    const { POST } = await import('@/app/api/affiliate/track-click/route');

    const req = new NextRequest('http://localhost/api/affiliate/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partner_id: 'nonexistent',
        session_id: 'sess-123',
        landing_page: '/song',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(404);
  });

  it('возвращает 403 для неактивного партнёра', async () => {
    const partnerChain = createChain({
      data: { id: 'inactive', status: 'inactive' },
      error: null,
    });
    mockFrom.mockReturnValue(partnerChain);

    const { NextRequest } = await import('next/server');
    const { POST } = await import('@/app/api/affiliate/track-click/route');

    const req = new NextRequest('http://localhost/api/affiliate/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partner_id: 'inactive',
        session_id: 'sess-456',
        landing_page: '/song',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(403);
  });

  it('записывает клик для активного партнёра', async () => {
    // Партнёр активен
    const partnerChain = createChain({
      data: { id: 'active-partner', status: 'active' },
      error: null,
    });

    // Нет недавних кликов
    const recentClickChain = createChain({
      data: null,
      error: { code: 'PGRST116' },
    });

    // Insert клика
    const insertChain = createChain({
      data: { id: 'click-1', partner_id: 'active-partner' },
      error: null,
    });

    let callIndex = 0;
    mockFrom.mockImplementation(() => {
      callIndex++;
      if (callIndex === 1) return partnerChain;
      if (callIndex === 2) return recentClickChain;
      return insertChain;
    });

    const { NextRequest } = await import('next/server');
    const { POST } = await import('@/app/api/affiliate/track-click/route');

    const req = new NextRequest('http://localhost/api/affiliate/track-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-agent': 'TestBot/1.0',
      },
      body: JSON.stringify({
        partner_id: 'active-partner',
        session_id: 'sess-789',
        landing_page: '/song',
        utm_source: 'email',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(201);
  });
});
