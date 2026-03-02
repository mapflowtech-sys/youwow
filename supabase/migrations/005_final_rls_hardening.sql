-- Финальное ужесточение RLS — defense in depth
-- Дата: 2026-03-02
--
-- Все операции записи идут через supabaseAdmin (service_role → обходит RLS).
-- Миграция 004 уже убрала INSERT для anon на clicks/conversions.
--
-- Что делаем:
-- 1. partner_clicks: ограничиваем SELECT — anon не нужен доступ ко всем кликам
-- 2. partner_conversions: ограничиваем SELECT — anon не нужен доступ ко всем конверсиям
-- 3. Явно запрещаем UPDATE/DELETE на immutable таблицах (clicks, conversions, payouts)
-- 4. partners: оставляем SELECT public (нужно для проверки partner_id на клиенте)

-- ============================================
-- partner_clicks: убираем публичный SELECT
-- ============================================
-- Все чтения кликов идут через supabaseAdmin (chart-data API, admin).
-- Anon клиенту не нужен доступ к кликам.
DROP POLICY IF EXISTS "Allow public read clicks" ON partner_clicks;

-- ============================================
-- partner_conversions: убираем публичный SELECT
-- ============================================
-- Все чтения конверсий идут через supabaseAdmin (partner dashboard, admin).
-- Anon клиенту не нужен доступ к конверсиям.
DROP POLICY IF EXISTS "Allow public read conversions" ON partner_conversions;

-- ============================================
-- Итоговое состояние RLS:
-- ============================================
-- partners:             SELECT = public (нужно для валидации partner_id)
-- partner_clicks:       нет политик для anon → доступ только через service_role
-- partner_conversions:  нет политик для anon → доступ только через service_role
-- partner_payouts:      нет политик для anon → доступ только через service_role
--
-- UPDATE/DELETE не имеют политик ни для одной таблицы → запрещены для anon.
-- service_role (supabaseAdmin) обходит RLS и может делать всё.
