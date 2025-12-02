/**
 * Компонент строки привычки в списке
 * 
 * Отображает название и иконку привычки.
 * Поддерживает режимы с чекбоксом и недельное отображение.
 * 
 * @module entities/habit/ui/HabitRow
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 30 ноября 2025 - убрана модалка статистики (перенесена на иконку в ProgressSection)
 * @updated 30 ноября 2025 - перемещён из features/habits в entities/habit (entity-уровень)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Habit } from '../model/types';
import { ICON_MAP, SmallFilledCircle } from '@/shared/constants/icons';
import { Checkbox } from '@/components/ui/checkbox';

/** Пропсы для HabitRow компонента */
interface HabitRowProps {
  /** Привычка для отображения */
  habit: Habit;
  /** Колбэк обновления привычки */
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  /** Текущий месяц */
  selectedMonth?: number;
  /** Текущий год */
  selectedYear?: number;
  /** Показывать чекбокс для выбора */
  showCheckbox?: boolean;
  /** Режим недельного отображения */
  isWeekly?: boolean;
}

export function HabitRow({
  habit,
  onUpdateHabit,
  selectedMonth,
  selectedYear,
  showCheckbox = false,
  isWeekly = false,
}: HabitRowProps) {
  const { t } = useTranslation();

  // ✅ Fix: noUncheckedIndexedAccess - проверяем что иконка существует в карте
  const IconComponent = habit.icon ? (ICON_MAP[habit.icon] ?? SmallFilledCircle) : SmallFilledCircle;

  return (
    <div className="flex items-center gap-0.5 h-8 hover:opacity-90 transition-all">
      {showCheckbox && (
        <Checkbox
          checked={habit.checked || false}
          onCheckedChange={(checked) => {
            onUpdateHabit(habit.id, { checked: checked as boolean });
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 mr-1 hover:scale-105"
        />
      )}
      
      {/* Habit Name with Icon */}
      <div 
        className={`${isWeekly ? 'w-[182px]' : 'w-[252px]'} pl-2 pr-4 h-full`}
      >
        <div className="flex items-center gap-2 h-full">
          <IconComponent className="w-4 h-4 text-text-primary flex-shrink-0" />
          <h3 
            className="text-xs truncate text-text-primary flex-1 min-w-0"
          >
            {habit.name || t('habit.noName')}
          </h3>
        </div>
      </div>
    </div>
  );
}