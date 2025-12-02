/**
 * Дневные вертикальные прогресс-бары для визуализации выполнения привычек
 * 
 * UI-компонент для отображения ряда вертикальных столбиков, где каждый столбик
 * показывает процент выполненных привычек за конкретный день месяца.
 * 
 * Учитывает пропущенные привычки (freeze) при расчёте процента выполнения.
 * 
 * @module entities/habit/ui/stats
 * @created 30 ноября 2025 - мигрировано из features/statistics
 */

import React from 'react';
import type { Habit } from '../../model/types';
import { isHabitCompletedForDate } from '../../lib/habit-utils';
import { ProgressBar } from '@/shared/ui/progress-bar';

interface DailyProgressBarsProps {
  /** Массив дней месяца с датами */
  monthDays: { date: Date; day: number }[];
  /** Список привычек для расчёта прогресса */
  habits: Habit[];
  /** Функция форматирования даты в строку (например, "2025-11-30") */
  formatDate: (date: Date) => string;
}

/**
 * Компонент дневных прогресс-баров
 * 
 * Для каждого дня рассчитывает:
 * - Общее количество привычек
 * - Количество выполненных привычек
 * - Количество пропущенных (freeze) привычек
 * - Процент выполнения = (выполненные / (общие - пропущенные)) * 100
 * 
 * Адаптивные отступы в зависимости от количества дней в месяце:
 * - 28 дней: gap-[7px]
 * - 29 дней: gap-[6px]
 * - 30 дней: gap-[5px]
 * - 31 день: gap-1
 * 
 * @example
 * ```tsx
 * <DailyProgressBars
 *   monthDays={[{ date: new Date(), day: 1 }, ...]}
 *   habits={habits}
 *   formatDate={(date) => date.toISOString().split('T')[0]}
 * />
 * ```
 */
export function DailyProgressBars({
  monthDays,
  habits,
  formatDate,
}: DailyProgressBarsProps) {
  return (
    <div className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`} style={{ marginLeft: '17px' }}>
      {monthDays.map((dayData) => {
        const dateStr = formatDate(dayData.date);
        const totalHabits = habits.length;
        
        // Считаем выполненные привычки
        const completedHabits = habits.filter(
          (habit) => isHabitCompletedForDate(habit, dateStr)
        ).length;
        
        // Считаем пропущенные (freeze) привычки
        const skippedHabits = habits.filter(
          (habit) => habit.skipped?.[dateStr]
        ).length;
        
        // Корректируем цель с учётом пропущенных
        const adjustedGoal = Math.max(0, totalHabits - skippedHabits);
        
        // Рассчитываем процент выполнения
        const percentage = adjustedGoal > 0 ? (completedHabits / adjustedGoal) * 100 : 0;
        
        return (
          <div
            key={`progress-${dayData.day}`}
            className="w-6 flex-shrink-0 flex flex-col items-center"
          >
            {/* Вертикальный прогресс-бар */}
            <div className="h-[119px] mb-1 mx-auto">
              <ProgressBar
                value={Math.min(percentage, 100)}
                orientation="vertical"
                size="md"
                variant="solid"
                animationDuration={300}
                className="h-full"
                barClassName="h-full"
              />
            </div>
            
            {/* Процент выполнения */}
            <span className="text-[7px]" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
              {Math.round(percentage)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}