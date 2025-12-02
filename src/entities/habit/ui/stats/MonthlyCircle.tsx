/**
 * Круговой индикатор месячного прогресса привычек (справа вверху)
 * 
 * Композитный компонент, использующий CircularProgress для отображения
 * круговой диаграммы с процентом выполнения всех привычек за месяц.
 * Учитывает частоту каждой привычки при расчёте общего количества
 * возможных выполнений.
 * 
 * Показывает:
 * - Процент выполнения (0-100%)
 * - Количество выполненных / возможных действий
 * - Визуальную круговую диаграмму
 * 
 * @module entities/habit/ui/stats
 * @created 30 ноября 2025 - мигрировано из features/statistics
 * @refactored 1 декабря 2025 - использует CircularProgress из shared/ui
 */

import React from 'react';
import type { Habit } from '../../model/types';
import { isHabitCompletedForDate, getMonthlyGoalFromFrequency } from '../../lib/habit-utils';
import { CircularProgress } from '@/shared/ui/circular-progress';

interface MonthlyCircleProps {
  /** Список привычек для расчёта прогресса */
  habits: Habit[];
  /** Массив дней месяца с датами */
  monthDays: { date: Date; day: number }[];
  /** Функция форматирования даты в строку */
  formatDate: (date: Date) => string;
  /** Выбранный месяц (0-11) */
  selectedMonth: number;
  /** Выбранный год */
  selectedYear: number;
}

/**
 * Круговая диаграмма месячного прогресса
 * 
 * Алгоритм расчёта:
 * 1. Для каждой привычки получаем месячную цель через getMonthlyGoalFromFrequency
 * 2. Суммируем все цели = totalPossible
 * 3. Для каждого дня считаем выполненные привычки
 * 4. Суммируем выполнения = totalCompleted
 * 5. Процент = (totalCompleted / totalPossible) * 100
 * 
 * Адаптивная ширина:
 * - 28 дней в месяце: 283px
 * - Остальные: 280px
 * 
 * @example
 * ```tsx
 * <MonthlyCircle
 *   habits={habits}
 *   monthDays={monthDays}
 *   formatDate={(date) => date.toISOString().split('T')[0]}
 *   selectedMonth={10}
 *   selectedYear={2025}
 * />
 * ```
 */
export function MonthlyCircle({
  habits,
  monthDays,
  formatDate,
  selectedMonth,
  selectedYear,
}: MonthlyCircleProps) {
  // Расчёт общего возможного количества выполнений и фактических выполнений
  const daysInMonth = monthDays.length;
  
  // Рассчитываем общее количество возможных выполнений на основе частоты каждой привычки
  let dailyTotalPossible = 0;
  habits.forEach(habit => {
    const goalValue = getMonthlyGoalFromFrequency(habit.frequency, daysInMonth, selectedMonth, selectedYear);
    dailyTotalPossible += goalValue;
  });
  
  // Считаем фактическое количество выполнений за все дни месяца
  const dailyTotalCompleted = monthDays.reduce((total, dayData) => {
    const dateStr = formatDate(dayData.date);
    const completedOnDay = habits.filter((habit) => isHabitCompletedForDate(habit, dateStr)).length;
    return total + completedOnDay;
  }, 0);

  const totalPossible = dailyTotalPossible;
  const totalCompleted = dailyTotalCompleted;

  // Рассчитываем процент выполнения
  const percentage = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

  // Защита от NaN
  const safePercentage = isNaN(percentage) ? 0 : percentage;
  const safeTotalCompleted = isNaN(totalCompleted) ? 0 : totalCompleted;
  const safeTotalPossible = isNaN(totalPossible) ? 0 : totalPossible;

  return (
    <div 
      className={`flex-shrink-0 ${monthDays.length === 28 ? 'w-[283px] min-w-[283px] max-w-[283px]' : 'w-[280px] min-w-[280px] max-w-[280px]'}`} 
      style={{ marginLeft: '17px' }}
    >
      <div className="flex items-center justify-center gap-4">
        {/* Левая текстовая секция */}
        <div className="flex flex-col items-start justify-center">
          <div className="uppercase tracking-wider" style={{ fontSize: '8px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
            Habits
          </div>
          <div style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1, color: 'var(--text-secondary)' }}>
            {safeTotalCompleted}
            <span style={{ fontWeight: 400, margin: '0 5px', color: 'var(--text-secondary)' }}>/</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{safeTotalPossible}</span>
          </div>
        </div>
        
        {/* Круговая диаграмма */}
        <div className="w-[100px] h-[100px] relative flex items-center justify-center">
          <CircularProgress 
            progress={safePercentage} 
            size={100} 
            strokeWidth={7}
          />
          
          {/* Текст в центре круга */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1, color: 'var(--text-primary)' }}>
              {Math.round(safePercentage)}%
            </div>
            <div className="uppercase tracking-wider" style={{ fontSize: '8px', fontWeight: 600, marginTop: '4px', color: 'var(--text-secondary)' }}>
              Progress
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}