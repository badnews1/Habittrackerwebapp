/**
 * Ячейка чекбокса привычки в календарной сетке
 * 
 * Отображает состояние выполнения привычки за день:
 * - Для бинарных: галочка/пропуск/пусто
 * - Для измеримых: галочка (цель достигнута) / круговая диаграмма (частично) / пусто
 * Поддерживает клик для переключения и ПКМ для заморозки (measurable).
 * 
 * @module modules/habit-tracker/features/habits/components/HabitCheckboxCell
 * @migrated 22 ноября 2025
 */

import React from 'react';
import type { Habit } from '../types';
import { isHabitCompletedForDate } from '../utils';
import { declineUnit } from '@/shared/utils/text';
import { CircularProgress } from '@/modules/habit-tracker/features/calendar';
import { Pause, Check } from '@/shared/icons';

interface HabitCheckboxCellProps {
  habit: Habit;
  dayData: { date: Date; day: number };
  dayIndex: number;
  dateStr: string;
  onToggleCompletion: (habitId: string, date: string, value?: number) => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onOpenNumericInput: (habitId: string, date: string) => void;
}

// Кастомная функция сравнения для React.memo - проверяем только релевантные данные
function arePropsEqual(
  prevProps: HabitCheckboxCellProps,
  nextProps: HabitCheckboxCellProps
): boolean {
  // Если изменился dateStr - нужен ре-рендер
  if (prevProps.dateStr !== nextProps.dateStr) {
    return false;
  }
  
  // Если изменился ID привычки - нужен ре-рендер
  if (prevProps.habit.id !== nextProps.habit.id) {
    return false;
  }
  
  // Проверяем только данные для конкретной даты
  const prevValue = prevProps.habit.completions[prevProps.dateStr];
  const nextValue = nextProps.habit.completions[nextProps.dateStr];
  const prevSkipped = prevProps.habit.skipped?.[prevProps.dateStr];
  const nextSkipped = nextProps.habit.skipped?.[nextProps.dateStr];
  
  // Для измеримых привычек также проверяем targetValue и unit
  if (prevProps.habit.type === 'measurable' || nextProps.habit.type === 'measurable') {
    if (
      prevProps.habit.targetValue !== nextProps.habit.targetValue ||
      prevProps.habit.unit !== nextProps.habit.unit ||
      prevProps.habit.targetType !== nextProps.habit.targetType
    ) {
      return false;
    }
  }
  
  // Если значения для этой даты не изменились - пропускаем ре-рендер
  return prevValue === nextValue && prevSkipped === nextSkipped;
}

export const HabitCheckboxCell = React.memo(function HabitCheckboxCell({
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

  // Для измеримых привычек - показываем чекбокс с прогрессом
  if (habit.type === 'measurable') {
    const value = habit.completions[dateStr];
    const numValue = typeof value === 'number' ? value : 0;
    
    // Проверяем, достигнута ли цель
    const isMet = isHabitCompletedForDate(habit, dateStr);
    
    // Вычисляем процент прогресса
    const target = habit.targetValue || 0;
    const progress = target > 0 ? (numValue / target) * 100 : 0;
    
    // Форматирование для tooltip
    const tooltipValue = numValue > 0 
      ? `${numValue} ${habit.unit ? declineUnit(numValue, habit.unit) : ''}`
      : '0';
    
    return (
      <div key={`calendar-input-${habit.id}-${dayIndex}`} className="w-6 flex-shrink-0 flex items-center justify-center">
        {isSkipped ? (
          // Показываем паузу если заморожено
          <button
            onClick={() => onToggleCompletion(habit.id, dateStr)}
            className="w-5 h-5 rounded-full bg-gray-300 transition-all hover:scale-105 flex items-center justify-center"
            title={`${dayData.day}: Заморожено`}
          >
            <Pause className="w-2 h-2 text-gray-600 shrink-0" />
          </button>
        ) : (
          <button
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
            className={`w-5 h-5 rounded-full transition-all hover:scale-105 flex items-center justify-center ${
              numValue === 0
                ? 'bg-white'
                : isMet
                ? 'bg-gray-900'
                : 'bg-transparent'
            }`}
            title={`${dayData.day}: ${tooltipValue} (ПКМ для заморозки)`}
          >
            {numValue === 0 ? (
              // Пустое состояние - ничего не показываем
              null
            ) : isMet ? (
              // Цель достигнута - показываем галочку
              <Check className="w-3 h-3 text-white" />
            ) : (
              // Частично выполнено - показываем круговую диаграмму
              <CircularProgress progress={progress} size={20} />
            )}
          </button>
        )}
      </div>
    );
  }
  
  // Для бинарных привычек - показываем кнопку чекбокса
  return (
    <div key={`calendar-checkbox-${habit.id}-${dayIndex}`} className="w-6 flex-shrink-0 flex items-center justify-center">
      <button
        onClick={() => onToggleCompletion(habit.id, dateStr)}
        className={`w-5 h-5 rounded-full transition-all hover:scale-105 flex items-center justify-center ${
          isCompleted 
            ? 'bg-gray-900' 
            : isSkipped 
            ? 'bg-gray-300' 
            : 'bg-white'
        }`}
        title={`${dayData.day} ${isCompleted ? '✓' : isSkipped ? '×' : ''}`}
      >
        {isCompleted ? (
          <Check className="w-3 h-3 text-white" />
        ) : isSkipped ? (
          <Pause className="w-2 h-2 text-gray-600 shrink-0" />
        ) : null}
      </button>
    </div>
  );
}, arePropsEqual);