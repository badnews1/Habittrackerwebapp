/**
 * Ячейка чекбокса привычки в календарной сетке
 * 
 * Отображает состояние выполнения привычки за день:
 * - Для бинарных: галочка/пропуск/пусто
 * - Для измеримых: числовое значение + единица измерения
 * Поддерживает клик для переключения и ПКМ для заморозки (measurable).
 * 
 * @module modules/habit-tracker/features/habits/components/HabitCheckboxCell
 * @migrated 22 ноября 2025
 */

import React from 'react';
import type { Habit } from '../types';
import { isHabitCompletedForDate } from '../utils';
import { declineUnit, getShortUnit, formatNumber } from '@/shared/utils/text';

interface HabitCheckboxCellProps {
  habit: Habit;
  dayData: { date: Date; day: number };
  dayIndex: number;
  dateStr: string;
  onToggleCompletion: (habitId: string, date: string, value?: number) => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onOpenNumericInput: (habitId: string, date: string) => void;
}

export function HabitCheckboxCell({
  habit,
  dayData,
  dayIndex,
  dateStr,
  onToggleCompletion,
  onUpdateHabit,
  onOpenNumericInput,
}: HabitCheckboxCellProps) {
  const isCompleted = habit.completions[dateStr];
  const isSkipped = habit.skipped?.[dateStr];

  // Для измеримых привычек - показываем поле ввода
  if (habit.type === 'measurable') {
    const value = habit.completions[dateStr];
    const numValue = typeof value === 'number' ? value : '';
    
    // Проверяем, достигнута ли цель
    const isMet = isHabitCompletedForDate(habit, dateStr);
    
    return (
      <div key={`calendar-input-${habit.id}-${dayIndex}`} className="w-6 flex-shrink-0 flex flex-col items-center justify-center gap-0">
        {isSkipped ? (
          // Показываем крестик если заморожено
          <button
            onClick={() => onToggleCompletion(habit.id, dateStr)}
            className="w-6 h-6 rounded transition-all hover:scale-105 flex items-center justify-center"
            title={`${dayData.day}: Заморожено`}
          >
            <svg
              className="w-2.5 h-2.5 text-gray-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="9" />
            </svg>
          </button>
        ) : (
          <div
            onClick={() => onOpenNumericInput(habit.id, dateStr)}
            onContextMenu={(e) => {
              e.preventDefault();
              const updatedHabit = {
                ...habit,
                completions: {
                  ...habit.completions,
                  [dateStr]: false,
                },
                skipped: {
                  ...habit.skipped,
                  [dateStr]: true,
                },
              };
              onUpdateHabit(habit.id, updatedHabit);
            }}
            className="w-full flex flex-col items-center justify-center gap-px cursor-pointer"
            title={`${dayData.day}: ${numValue || '0'} ${numValue !== '' && habit.unit ? declineUnit(parseFloat(numValue), habit.unit) : (habit.unit || '')} (ПКМ для заморозки)`}
          >
            <div className={`w-full h-2.5 text-[8px] text-center transition-all ${
              isMet
                ? 'text-gray-900 font-semibold'
                : 'text-gray-400'
            }`}>
              {numValue !== '' ? formatNumber(parseFloat(numValue)) : '0'}
            </div>
            <span className="text-[7px] text-gray-400 leading-none">
              {habit.unit ? (habit.unit === 'разы' && numValue !== '' ? declineUnit(parseFloat(numValue), habit.unit) : getShortUnit(habit.unit)) : ''}
            </span>
          </div>
        )}
      </div>
    );
  }
  
  // Для бинарных привычек - показываем кнопку чекбокса
  return (
    <div key={`calendar-checkbox-${habit.id}-${dayIndex}`} className="w-6 flex-shrink-0 flex items-center justify-center">
      <button
        onClick={() => onToggleCompletion(habit.id, dateStr)}
        className="w-4 h-4 rounded transition-all hover:scale-105 flex items-center justify-center bg-transparent"
        title={`${dayData.day} ${isCompleted ? '✓' : isSkipped ? '×' : ''}`}
      >
        {isCompleted ? (
          <svg
            className="w-3 h-3 text-gray-900"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : isSkipped ? (
          <svg
            className="w-2.5 h-2.5 text-gray-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
        ) : (
          <svg
            className="w-3 h-3 text-gray-300"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
    </div>
  );
}
