import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Мокаем next/server чтобы не зависеть от Next.js runtime
vi.mock('next/server', () => {
  class MockNextRequest extends Request {
    constructor(url: string, init?: RequestInit) {
      super(url, init);
    }
  }

  class MockNextResponse {
    static json(body: unknown, init?: { status?: number }) {
      return {
        body,
        status: init?.status || 200,
      };
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

import { verifyAdminAuth, unauthorizedResponse } from '@/lib/admin-auth';
import { NextRequest } from 'next/server';

describe('verifyAdminAuth', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, ADMIN_PASSWORD: 'test-secret-123' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('возвращает true при правильном токене', () => {
    const req = new NextRequest('http://localhost/api/admin/test', {
      headers: { 'x-admin-token': 'test-secret-123' },
    });
    expect(verifyAdminAuth(req)).toBe(true);
  });

  it('возвращает false при неправильном токене', () => {
    const req = new NextRequest('http://localhost/api/admin/test', {
      headers: { 'x-admin-token': 'wrong-password' },
    });
    expect(verifyAdminAuth(req)).toBe(false);
  });

  it('возвращает false без токена', () => {
    const req = new NextRequest('http://localhost/api/admin/test');
    expect(verifyAdminAuth(req)).toBe(false);
  });

  it('возвращает false если ADMIN_PASSWORD не установлен', () => {
    delete process.env.ADMIN_PASSWORD;
    const req = new NextRequest('http://localhost/api/admin/test', {
      headers: { 'x-admin-token': 'anything' },
    });
    expect(verifyAdminAuth(req)).toBe(false);
  });

  it('возвращает false при пустом токене', () => {
    const req = new NextRequest('http://localhost/api/admin/test', {
      headers: { 'x-admin-token': '' },
    });
    expect(verifyAdminAuth(req)).toBe(false);
  });
});

describe('unauthorizedResponse', () => {
  it('возвращает 401 с правильным телом', () => {
    const response = unauthorizedResponse();
    expect(response.status).toBe(401);
  });
});
