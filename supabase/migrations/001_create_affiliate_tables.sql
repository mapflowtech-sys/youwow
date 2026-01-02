-- Партнёрская система: создание таблиц
-- Дата: 02.01.2026

-- ============================================
-- Таблица: partners (партнёры)
-- ============================================
CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,              -- "dnsshop", "blogopodarki", "partner21"
  name TEXT NOT NULL,               -- "DNS Shop", "Блог о подарках"
  website TEXT,                     -- "https://dnsshop.ru"
  payment_info TEXT,                -- "Карта: 5536 9137 XXXX XXXX, Иван И."
  commission_rate DECIMAL(10,2) DEFAULT 200.00,  -- Комиссия в рублях
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,                       -- Комментарии для админа
  is_active BOOLEAN DEFAULT TRUE    -- Активен ли партнёр
);

-- Индексы для partners
CREATE INDEX IF NOT EXISTS idx_partners_created_at ON partners(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partners_is_active ON partners(is_active);

-- ============================================
-- Таблица: partner_clicks (клики)
-- ============================================
CREATE TABLE IF NOT EXISTS partner_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,         -- Уникальный ID сессии
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,                  -- Для дедупликации
  user_agent TEXT,                  -- Браузер/устройство
  referrer TEXT,                    -- Откуда пришёл
  landing_page TEXT NOT NULL,       -- "/song", "/", "/santa"
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Индексы для partner_clicks
CREATE INDEX IF NOT EXISTS idx_clicks_partner_id ON partner_clicks(partner_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON partner_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_session_id ON partner_clicks(session_id);
CREATE INDEX IF NOT EXISTS idx_clicks_ip_address ON partner_clicks(ip_address);

-- ============================================
-- Таблица: partner_conversions (конверсии)
-- ============================================
CREATE TABLE IF NOT EXISTS partner_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,         -- Связь с кликом
  order_id TEXT NOT NULL,           -- ID заказа
  service_type TEXT NOT NULL,       -- "song", "santa", будущие сервисы
  amount DECIMAL(10,2) NOT NULL,    -- Сумма заказа
  commission DECIMAL(10,2) NOT NULL, -- Комиссия партнёра
  converted_at TIMESTAMPTZ DEFAULT NOW(),
  landing_page TEXT,                -- С какой страницы пришёл
  is_paid_out BOOLEAN DEFAULT FALSE -- Выплачена ли комиссия
);

-- Индексы для partner_conversions
CREATE INDEX IF NOT EXISTS idx_conversions_partner_id ON partner_conversions(partner_id);
CREATE INDEX IF NOT EXISTS idx_conversions_converted_at ON partner_conversions(converted_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversions_order_id ON partner_conversions(order_id);
CREATE INDEX IF NOT EXISTS idx_conversions_is_paid_out ON partner_conversions(is_paid_out);
CREATE INDEX IF NOT EXISTS idx_conversions_session_id ON partner_conversions(session_id);

-- ============================================
-- Таблица: partner_payouts (выплаты)
-- ============================================
CREATE TABLE IF NOT EXISTS partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,    -- Сумма выплаты
  conversions_count INTEGER NOT NULL, -- Количество конверсий
  period_start DATE NOT NULL,       -- Начало периода
  period_end DATE NOT NULL,         -- Конец периода
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  payment_method TEXT,              -- "Карта", "СБП", "ЮMoney"
  notes TEXT,                       -- Комментарий к выплате
  conversion_ids UUID[]             -- Массив ID конверсий
);

-- Индексы для partner_payouts
CREATE INDEX IF NOT EXISTS idx_payouts_partner_id ON partner_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_payouts_paid_at ON partner_payouts(paid_at DESC);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Включаем RLS для всех таблиц
ALTER TABLE partner_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Политики: разрешаем публичное чтение
CREATE POLICY "Allow public read clicks" ON partner_clicks FOR SELECT USING (true);
CREATE POLICY "Allow insert clicks" ON partner_clicks FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read conversions" ON partner_conversions FOR SELECT USING (true);
CREATE POLICY "Allow insert conversions" ON partner_conversions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read payouts" ON partner_payouts FOR SELECT USING (true);

CREATE POLICY "Allow public read partners" ON partners FOR SELECT USING (true);

-- ============================================
-- Тестовые данные (опционально)
-- ============================================

-- Раскомментируйте для создания тестовых партнёров:
/*
INSERT INTO partners (id, name, website, commission_rate, notes) VALUES
  ('dnsshop', 'DNS Shop', 'https://dnsshop.ru', 200.00, 'Крупная сеть электроники'),
  ('blogopodarki', 'Блог о подарках', 'https://blogopodarki.ru', 200.00, 'Блог с идеями подарков'),
  ('gift-ideas', 'Gift Ideas', NULL, 250.00, 'Повышенная комиссия');
*/
