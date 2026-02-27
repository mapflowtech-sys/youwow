-- Ужесточение RLS-политик партнёрской системы
-- Дата: 2026-02-27
--
-- ВАЖНО: Все операции записи и изменения идут через supabaseAdmin (service_role),
-- который обходит RLS. Поэтому нам достаточно ограничить anon key.
--
-- Что меняется:
-- 1. partner_clicks: убираем INSERT для anon (клики пишет proxy через supabaseAdmin)
-- 2. partner_conversions: убираем INSERT для anon (конверсии пишет supabaseAdmin)
-- 3. partner_payouts: убираем SELECT для anon (выплаты — только для админов)
-- 4. partners: SELECT оставляем (нужен для публичного дашборда партнёра)

-- ============================================
-- partner_clicks: убираем публичный INSERT
-- ============================================
DROP POLICY IF EXISTS "Allow insert clicks" ON partner_clicks;

-- ============================================
-- partner_conversions: убираем публичный INSERT
-- ============================================
DROP POLICY IF EXISTS "Allow insert conversions" ON partner_conversions;

-- ============================================
-- partner_payouts: убираем публичный SELECT
-- ============================================
DROP POLICY IF EXISTS "Allow public read payouts" ON partner_payouts;

-- Теперь partner_payouts доступен только через supabaseAdmin (service_role).
-- Это правильно, т.к. выплаты видны только в админке.
