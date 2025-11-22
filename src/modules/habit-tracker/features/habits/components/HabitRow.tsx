/**
 * Компонент строки привычки в списке
 * 
 * Отображает название, иконку и модальное окно статистики привычки.
 * Поддерживает режимы с чекбоксом и недельное отображение.
 * 
 * @module modules/habit-tracker/features/habits/components/HabitRow
 * @migrated 22 ноября 2025
 */

import React, { useState } from 'react';
import { HabitStatisticsModal } from './HabitStatisticsModal';
import type { HabitRowProps } from '../types';
import { ICON_MAP, SmallFilledCircle } from '@/shared/constants/icons';

export function HabitRow({
  habit,
  index,
  onMoveHabit,
  onUpdateHabit,
  isNewlyAdded,
  onEditComplete,
  selectedMonth,
  selectedYear,
  showCheckbox = false,
  isWeekly = false,
}: HabitRowProps) {
  // Получаем компонент иконки из карты, по умолчанию SmallFilledCircle
  const IconComponent = habit.icon ? ICON_MAP[habit.icon] : SmallFilledCircle;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Генерируем monthYearKey для модального окна статистики
  const monthYearKey = selectedMonth !== undefined && selectedYear !== undefined
    ? `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`
    : '';

  return (
    <div className="flex items-center gap-0.5 h-8 hover:opacity-90 transition-all">
      {showCheckbox && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newChecked = !(habit.checked || false);
            onUpdateHabit(habit.id, { checked: newChecked });
          }}
          className={'w-4 h-4 flex-shrink-0 rounded transition-all hover:scale-105 flex items-center justify-center mr-1 ' + ((habit.checked || false) ? 'bg-gray-900' : 'bg-white border border-gray-200')}
        >
          {(habit.checked || false) && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      )}
      
      {/* Habit Name with Icon */}
      <div 
        className={`${isWeekly ? 'w-[182px]' : 'w-[252px]'} pl-2 pr-4 h-full`}
      >
        <div className="flex items-center gap-2 h-full">
          <IconComponent className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <h3 
            onClick={() => setIsModalOpen(true)}
            className="text-xs truncate text-gray-900 flex-1 min-w-0 cursor-pointer hover:text-blue-600 transition-colors underline decoration-transparent hover:decoration-blue-600"
            title="Нажмите для просмотра статистики"
          >
            {habit.name || 'Без названия'}
          </h3>
        </div>
      </div>

      {/* Habit Statistics Modal */}
      {isModalOpen && monthYearKey && (
        <HabitStatisticsModal
          habit={habit}
          onClose={() => setIsModalOpen(false)}
          monthYearKey={monthYearKey}
        />
      )}
    </div>
  );
}
