-- Синхронизация is_active с status
-- Убедимся что is_active соответствует status для всех записей
UPDATE partners SET is_active = (status = 'active') WHERE is_active != (status = 'active');

-- Комментарий на поле is_active
COMMENT ON COLUMN partners.is_active IS 'DEPRECATED: Use status column instead. Kept for backward compatibility.';
