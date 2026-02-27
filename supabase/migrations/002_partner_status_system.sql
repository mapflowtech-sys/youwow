-- Миграция #002: Система статусов для партнёров
-- Дата: 03.01.2026
-- Описание: Заменяем is_active на гибкую систему статусов (active/inactive/archived)

-- 1. Добавляем новое поле status
ALTER TABLE partners ADD COLUMN status TEXT DEFAULT 'active';

-- 2. Мигрируем данные из is_active в status
UPDATE partners
SET status = CASE
  WHEN is_active = TRUE THEN 'active'
  WHEN is_active = FALSE THEN 'inactive'
  ELSE 'active'
END;

-- 3. Добавляем дату архивации (для истории)
ALTER TABLE partners ADD COLUMN archived_at TIMESTAMPTZ;

-- 4. Добавляем constraint для проверки корректных значений status
ALTER TABLE partners
ADD CONSTRAINT partners_status_check
CHECK (status IN ('active', 'inactive', 'archived'));

-- 5. Создаём индекс для быстрой фильтрации по статусу
CREATE INDEX idx_partners_status ON partners(status);

-- 6. (Опционально) Удаляем старое поле is_active
-- ALTER TABLE partners DROP COLUMN is_active;
-- Пока оставляем для обратной совместимости, удалим позже

-- 7. Комментарии для документации
COMMENT ON COLUMN partners.status IS 'Статус партнёра: active (активен), inactive (неактивен), archived (в архиве)';
COMMENT ON COLUMN partners.archived_at IS 'Дата архивации партнёра';

-- 8. Функция для автоматического обновления archived_at
CREATE OR REPLACE FUNCTION update_archived_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'archived' AND OLD.status != 'archived' THEN
    NEW.archived_at = NOW();
  ELSIF NEW.status != 'archived' THEN
    NEW.archived_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Триггер для автоматического обновления archived_at
DROP TRIGGER IF EXISTS partners_archived_at_trigger ON partners;
CREATE TRIGGER partners_archived_at_trigger
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_archived_at();

-- 10. Обновляем RLS политики (если нужно)
-- Архивные партнёры всё ещё должны принимать клики/конверсии

-- Готово! Теперь у партнёров есть 3 статуса:
-- - active: активный партнёр (по умолчанию)
-- - inactive: временно неактивен (можно использовать для тестирования)
-- - archived: в архиве (скрыт из списка, но конверсии принимаются)
