/**
 * Ячейка с названием и иконкой привычки
 * 
 * Чистый UI компонент без бизнес-логики и store.
 * Используется в виджетах для отображения имени привычки.
 * 
 * @module entities/habit/ui/HabitNameCell
 * @created 2 декабря 2025
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Habit } from '../model/types';
import { ICON_MAP, SmallFilledCircle } from '@/shared/constants/icons';

interface HabitNameCellProps {
  /** Привычка для отображения */
  habit: Habit;
  /** Ширина ячейки (например, '262px') */
  width?: string;
}

/**
 * Ячейка с иконкой и названием привычки
 * 
 * Отображает:
 * - Иконку привычки (или точку по умолчанию)
 * - Название с truncate
 * - Фиксированная высота 32px (h-8)
 */
export function HabitNameCell({ habit, width = '262px' }: HabitNameCellProps) {
  const { t } = useTranslation('habits');
  // ✅ Fix: noUncheckedIndexedAccess - проверяем что иконка существует в карте
  const IconComponent = habit.icon ? (ICON_MAP[habit.icon] ?? SmallFilledCircle) : SmallFilledCircle;

  return (
    <div 
      className="h-8 pl-2 pr-4 flex-shrink-0"
      style={{ width }}
    >
      <div className="flex items-center gap-2 h-full">
        <IconComponent className="w-4 h-4 text-text-primary flex-shrink-0" />
        <h3 className="text-xs truncate text-text-primary flex-1 min-w-0">
          {habit.name || t('habit.noName')}
        </h3>
      </div>
    </div>
  );
}