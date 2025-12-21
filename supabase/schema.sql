-- ВАЖНО: Этот SQL нужно будет выполнить в Supabase Dashboard
-- (SQL Editor → New Query → вставить этот код → Run)

-- Таблица users (минимальная идентификация по email)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_orders INTEGER DEFAULT 0,
  last_order_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Таблица orders (основная)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  service_type TEXT NOT NULL CHECK (service_type IN ('santa', 'tarot', 'song')),

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'processing', 'completed', 'failed')),

  customer_email TEXT NOT NULL,
  customer_name TEXT,

  input_data JSONB NOT NULL,

  result_url TEXT,
  result_metadata JSONB,

  payment_id TEXT,
  payment_provider TEXT,
  amount INTEGER NOT NULL,

  error_message TEXT,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_service_type ON orders(service_type);

-- Таблица service_options (гибкость опций)
CREATE TABLE IF NOT EXISTS service_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL,
  option_key TEXT NOT NULL,
  option_value TEXT NOT NULL,
  display_label TEXT NOT NULL,
  description TEXT,
  price_modifier INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(service_type, option_key, option_value)
);

CREATE INDEX IF NOT EXISTS idx_service_options_type ON service_options(service_type);
CREATE INDEX IF NOT EXISTS idx_service_options_active ON service_options(is_active);

-- Начальные данные для service_options
INSERT INTO service_options (service_type, option_key, option_value, display_label, description, sort_order) VALUES
-- Таро: Тоны
('tarot', 'tone', 'funny', 'Весёлое 😄', 'Лёгкое и позитивное предсказание', 1),
('tarot', 'tone', 'mystical', 'Мистическое 🔮', 'Загадочное и таинственное', 2),
('tarot', 'tone', 'romantic', 'Романтическое 💕', 'О любви и отношениях', 3),

-- Таро: Стили карт
('tarot', 'card_style', 'classic', 'Классический', 'Традиционный стиль Таро', 1),
('tarot', 'card_style', 'modern', 'Современный', 'Минималистичный дизайн', 2),

-- Дед Мороз: Персонажи
('santa', 'character', 'santa', 'Дед Мороз 🎅', 'Классический Дед Мороз', 1),

-- Песня: Жанры (уже в форме, но можно хранить в БД для гибкости)
('song', 'genre', 'pop', 'Поп 🎤', 'Новогодний поп', 1),
('song', 'genre', 'rock', 'Рок 🎸', 'Энергичный рок', 2),
('song', 'genre', 'rap', 'Рэп 🎧', 'Ритмичный рэп', 3),
('song', 'genre', 'chanson', 'Шансон 🎻', 'Душевный шансон', 4)
ON CONFLICT DO NOTHING;
