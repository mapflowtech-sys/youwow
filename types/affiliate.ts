// Партнёрская система - TypeScript типы

/**
 * Статус партнёра
 */
export type PartnerStatus = 'active' | 'inactive' | 'archived';

/**
 * Партнёр
 */
export interface Partner {
  id: string; // "dnsshop", "blogopodarki"
  name: string; // "DNS Shop"
  website?: string;
  payment_info?: string; // Реквизиты для выплат
  commission_rate: number; // Комиссия в рублях (200.00)
  created_at: string;
  notes?: string;
  /** @deprecated Use status instead */
  is_active: boolean;
  status: PartnerStatus;
  archived_at?: string; // Дата архивации
}

/**
 * Клик по партнёрской ссылке
 */
export interface PartnerClick {
  id: string;
  partner_id: string;
  session_id: string; // UUID для связи с конверсией
  clicked_at: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string; // Откуда пришёл
  landing_page: string; // "/song", "/santa"
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

/**
 * Конверсия (покупка)
 */
export interface PartnerConversion {
  id: string;
  partner_id: string;
  session_id: string;
  order_id: string; // ID заказа
  service_type: 'song' | 'santa' | 'future_service'; // Тип сервиса
  amount: number; // Сумма заказа
  commission: number; // Комиссия партнёра
  converted_at: string;
  landing_page?: string;
  is_paid_out: boolean; // Выплачена ли комиссия
}

/**
 * Выплата партнёру
 */
export interface PartnerPayout {
  id: string;
  partner_id: string;
  amount: number;
  conversions_count: number;
  period_start: string; // Дата начала периода
  period_end: string; // Дата конца периода
  paid_at: string;
  payment_method?: string; // "Карта", "СБП"
  notes?: string;
  conversion_ids?: string[]; // ID конверсий в этой выплате
}

/**
 * Данные партнёра в cookie
 */
export interface PartnerCookieData {
  partnerId: string;
  sessionId: string;
  clickedAt: string;
  landingPage: string;
}

/**
 * Статистика партнёра
 */
export interface PartnerStats {
  partnerId: string;
  partnerName: string;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number; // В процентах
  totalEarned: number; // Всего заработано
  totalPaidOut: number; // Выплачено
  pendingPayout: number; // К выплате
  commissionRate: number; // Комиссия партнёра
  /** @deprecated Use status instead */
  isActive: boolean;
  status: PartnerStatus;
  hasNewActivity?: boolean; // Есть ли новые клики/конверсии (для архивных)
}

/**
 * Данные для графика
 */
export interface ChartDataPoint {
  date: string; // "2026-01-02"
  clicks: number;
  conversions: number;
}

/**
 * Запрос на создание партнёра
 */
export interface CreatePartnerRequest {
  id: string;
  name: string;
  website?: string;
  payment_info?: string;
  commission_rate?: number;
  notes?: string;
  status?: PartnerStatus; // Опционально при создании
}

/**
 * Запрос на отметку выплаты
 */
export interface CreatePayoutRequest {
  partner_id: string;
  period_start: string;
  period_end: string;
  payment_method?: string;
  notes?: string;
}
