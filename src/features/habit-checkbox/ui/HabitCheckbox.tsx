/**
 * Компонент чекбокса привычки
 * 
 * Отображает состояние выполнения привычки за день:
 * - Для бинарных: галочка/пропуск/пусто
 * - Для измеримых: галочка (цель достигнута) / круговая диаграмма (частично) / пусто
 * Поддерживает клик для переключения и ПКМ для заморозки (measurable).
 * 
 * @module features/habit-checkbox/ui/HabitCheckbox
 * @migrated 30 ноября 2025 - миграция на FSD
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Habit } from '@/entities/habit';
import { isHabitCompletedForDate } from '@/entities/habit';
import { declineUnit } from '@/shared/lib/text';
import { CircularProgress } from '@/shared/ui/circular-progress';
import { Pause, Check } from '@/shared/assets/icons/system';
import { CompletionButton } from '@/shared/ui/completion-button';

interface HabitCheckboxProps {
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
  prevProps: HabitCheckboxProps,
  nextProps: HabitCheckboxProps
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
  // ✅ Fix: доступ по индексу может вернуть undefined
  const prevValue = prevProps.habit.completions[prevProps.dateStr] ?? undefined;
  const nextValue = nextProps.habit.completions[nextProps.dateStr] ?? undefined;
  const prevSkipped = prevProps.habit.skipped?.[prevProps.dateStr] ?? undefined;
  const nextSkipped = nextProps.habit.skipped?.[nextProps.dateStr] ?? undefined;
  
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

export const HabitCheckbox = React.memo(function HabitCheckbox({
  habit,
  dayData,
  dayIndex,
  dateStr,
  onToggleCompletion,
  onUpdateHabit,
  onOpenNumericInput,
}: HabitCheckboxProps) {
  const { t, i18n } = useTranslation('habits');
  const currentLanguage = i18n.language;
  
  // ✅ Fix: доступ по индексу может вернуть undefined
  const isCompleted = habit.completions[dateStr] ?? undefined;
  const isSkipped = habit.skipped?.[dateStr] ?? undefined;

  // Для измеримых привычек - показываем чекбокс с прогрессом
  if (habit.type === 'measurable') {
    const value = habit.completions[dateStr] ?? undefined;
    const numValue = typeof value === 'number' ? value : 0;
    
    // Проверяем, достигнута ли цель
    const isMet = isHabitCompletedForDate(habit, dateStr);
    
    // Вычисляем процент прогресса
    const target = habit.targetValue || 0;
    const progress = target > 0 ? (numValue / target) * 100 : 0;
    
    // Форматирование для tooltip
    const tooltipValue = numValue > 0 
      ? `${numValue} ${habit.unit ? declineUnit(numValue, habit.unit, t, currentLanguage) : ''}`
      : '0';
    
    return (
      <div key={`calendar-input-${habit.id}-${dayIndex}`} className="w-6 flex-shrink-0 flex items-center justify-center">
        {isSkipped ? (
          // Показываем паузу если заморожено
          <CompletionButton
            variant="skipped"
            onClick={() => onToggleCompletion(habit.id, dateStr)}
            title={`${dayData.day}: Заморожено`}
          >
            <Pause className="w-2 h-2 shrink-0" />
          </CompletionButton>
        ) : (
          <CompletionButton
            variant={numValue === 0 ? 'empty' : isMet ? 'completed' : 'partial'}
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
            title={`${dayData.day}: ${tooltipValue} (ПКМ для заморозки)`}
          >
            {numValue === 0 ? (
              // Пустое состояние - ничего не показываем
              null
            ) : isMet ? (
              // Цель достигнута - показываем галочку (цвет управляется CompletionButton)
              <Check className="w-3 h-3" />
            ) : (
              // Частично выполнено - показываем круговую диаграмму
              <CircularProgress progress={progress} size={20} />
            )}
          </CompletionButton>
        )}
      </div>
    );
  }
  
  // Для бинарных привычек - показываем кнопку чекбокса
  return (
    <div key={`calendar-checkbox-${habit.id}-${dayIndex}`} className="w-6 flex-shrink-0 flex items-center justify-center">
      <CompletionButton
        variant={isCompleted ? 'completed' : isSkipped ? 'skipped' : 'empty'}
        onClick={() => onToggleCompletion(habit.id, dateStr)}
        title={`${dayData.day} ${isCompleted ? '✓' : isSkipped ? '×' : ''}`}
      >
        {isCompleted ? (
          <Check className="w-3 h-3" />
        ) : isSkipped ? (
          <Pause className="w-2 h-2 shrink-0" />
        ) : null}
      </CompletionButton>
    </div>
  );
}, arePropsEqual);