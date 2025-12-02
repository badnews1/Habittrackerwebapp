/**
 * Детальная статистика привычек за месяц
 * 
 * Компонент для отображения месячной статистики с круговой диаграммой
 * и текстовым описанием.
 * 
 * Показывает:
 * - Круговую диаграмму с процентом выполнения
 * - Текст "ПРОГРЕСС" в центре круга
 * - Количество выполненных / возможных действий
 * 
 * @module entities/habit/ui/stats
 * @created 30 ноября 2025 - мигрировано из features/statistics
 * @refactored 1 декабря 2025 - использует CircularProgress из shared/ui, адаптация к темной теме
 * @refactored 2 декабря 2025 - убраны padding, заголовок и кнопка, чистый entity компонент
 */

import React from 'react';
import type { Habit, DateConfig } from '../../model/types';
import { isHabitCompletedForDate, getMonthlyGoalFromFrequency } from '../../lib/habit-utils';
import { CircularProgress } from '@/shared/ui/circular-progress';
import { useTranslation } from 'react-i18next';

interface MonthlyStatsProps {
  /** Список привычек для расчёта статистики */
  habits: Habit[];
  /** Конфигурация даты с информацией о месяце */
  dateConfig: DateConfig;
}

/**
 * Блок месячной статистики
 * 
 * Алгоритм расчёта:
 * 1. Для каждой привычки получаем месячную цель через getMonthlyGoalFromFrequency
 * 2. Суммируем все цели = totalPossible
 * 3. Для каждого дня считаем выполненные привычки
 * 4. Суммируем выполнения = totalCompleted
 * 5. Процент = (totalCompleted / totalPossible) * 100
 * 
 * @example
 * ```tsx
 * <MonthlyStats
 *   habits={habits}
 *   dateConfig={{
 *     monthDays: [...],
 *     formatDate: (date) => date.toISOString().split('T')[0],
 *     selectedMonth: 10,
 *     selectedYear: 2025
 *   }}
 * />
 * ```
 */
export function MonthlyStats({
  habits,
  dateConfig,
}: MonthlyStatsProps) {
  const { monthDays, formatDate, selectedMonth, selectedYear } = dateConfig;
  const { t } = useTranslation('stats');

  // Рассчитываем общее количество возможных выполнений на основе частоты
  let totalPossible = 0;
  const daysInMonth = monthDays.length;
  habits.forEach(habit => {
    const goalValue = getMonthlyGoalFromFrequency(habit.frequency, daysInMonth, selectedMonth, selectedYear);
    totalPossible += goalValue;
  });
  
  // Считаем фактическое количество выполнений
  const totalCompleted = monthDays.reduce((total, dayData) => {
    const dateStr = formatDate(dayData.date);
    const completedOnDay = habits.filter(habit => isHabitCompletedForDate(habit, dateStr)).length;
    return total + completedOnDay;
  }, 0);

  // Рассчитываем процент выполнения
  const percentage = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
  const safePercentage = isNaN(percentage) ? 0 : percentage;
  const safeTotalCompleted = isNaN(totalCompleted) ? 0 : totalCompleted;
  const safeTotalPossible = isNaN(totalPossible) ? 0 : totalPossible;

  return (
    <div className="flex items-center justify-start gap-4">
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
            {t('stats.progress')}
          </div>
        </div>
      </div>
      
      {/* Текстовая секция справа */}
      <div className="inline-flex flex-col items-start justify-center" style={{ height: '100px' }}>
        <div className="uppercase tracking-wider" style={{ fontSize: '8px', fontWeight: 600, marginBottom: '8px', width: 'fit-content', color: 'var(--text-primary)' }}>
          {t('stats.habits')}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1, color: 'var(--text-secondary)' }}>
          {safeTotalCompleted}
          <span style={{ fontWeight: 400, margin: '0 5px', color: 'var(--text-secondary)' }}>/</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{safeTotalPossible}</span>
        </div>
      </div>
    </div>
  );
}