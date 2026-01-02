-- Добавляем поля партнёрской системы в таблицу orders

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS partner_id TEXT,
ADD COLUMN IF NOT EXISTS partner_session_id UUID;

-- Добавляем индекс для быстрого поиска заказов партнёра
CREATE INDEX IF NOT EXISTS idx_orders_partner_id ON orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner_session ON orders(partner_session_id);

-- Комментарии для документации
COMMENT ON COLUMN orders.partner_id IS 'ID партнёра из таблицы partners (если заказ пришёл по партнёрской ссылке)';
COMMENT ON COLUMN orders.partner_session_id IS 'Session ID из партнёрского cookie для связи с partner_clicks';
