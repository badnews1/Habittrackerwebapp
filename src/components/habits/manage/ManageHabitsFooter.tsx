import React from 'react';
import { Button } from '../../common';

/**
 * Footer для модального окна управления привычками
 * 
 * Компоненты:
 * - Кнопка "Отмена" (1/3 ширины)
 * - Кнопка "Готово" (2/3 ширины, primary)
 * 
 * Используется в:
 * - ManageHabitsModal
 * 
 * Оптимизация: React.memo для предотвращения лишних ререндеров
 * 
 * Дата создания: 19 ноября 2025
 * Дата обновления: 19 ноября 2025 (использует Button компонент)
 */

interface ManageHabitsFooterProps {
  onCancel: () => void;
  onSave: () => void;
}

export const ManageHabitsFooter: React.FC<ManageHabitsFooterProps> = React.memo(({ 
  onCancel,
  onSave,
}) => {
  return (
    <div className="p-6 border-t border-gray-200 flex gap-3">
      <Button
        variant="secondary"
        onClick={onCancel}
        className="flex-[1]"
      >
        Отмена
      </Button>
      <Button
        variant="primary"
        onClick={onSave}
        className="flex-[2]"
      >
        Готово
      </Button>
    </div>
  );
});