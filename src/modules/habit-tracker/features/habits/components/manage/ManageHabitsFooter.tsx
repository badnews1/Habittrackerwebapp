/**
 * Footer для модального окна управления привычками
 * 
 * Компоненты:
 * - Кнопка "Отмена" (1/3 ширины)
 * - Кнопка "Готово" (2/3 ширины, primary)
 * 
 * Оптимизация: React.memo для предотвращения лишних ререндеров
 * 
 * @module modules/habit-tracker/features/habits/components/manage/ManageHabitsFooter
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { Button } from '@/shared/components/button';

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

ManageHabitsFooter.displayName = 'ManageHabitsFooter';
