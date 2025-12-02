/**
 * Три строки статистики под графиком дневного прогресса
 * 
 * Отображает для каждого дня месяца:
 * 1. Процент выполнения = (completedHabits / adjustedGoal) * 100
 * 2. Количество выполненных привычек
 * 3. Общее количество привычек с учётом пропусков (adjustedGoal)
 * 
 * adjustedGoal = totalHabits - skippedHabits
 * 
 * @module entities/habit/ui/stats
 * @migrated 30 ноября 2025 - перенесено из features/statistics в entities/habit
 * @refactored 2 декабря 2025 - убраны mt-4, mt-1, обёрнуто в flex-col с gap
 */

import type { Habit } from '../../model/types';
import { isHabitCompletedForDate } from '../../lib/habit-utils';

interface DailyStatsRowsProps {
  habits: Habit[];
  monthDays: { date: Date; day: number }[];
  formatDate: (date: Date) => string;
}

/**
 * Компонент отображает три строки статистики под графиком:
 * - Процент выполнения для каждого дня
 * - Количество выполненных привычек
 * - Общее количество привычек (с вычетом пропущенных)
 */
export function DailyStatsRows({
  habits,
  monthDays,
  formatDate,
}: DailyStatsRowsProps) {
  // Динамический расчёт padding для выравнивания с реальными точками графика
  // Синхронизировано с CalendarDayHeader
  // Базовое значение 20px для 28 дней, уменьшается на 0.5px за каждый дополнительный день
  // Результаты: 28 дней = 20px, 29 дней = 19.5px, 30 дней = 19px, 31 день = 18.5px
  const paddingPx = 20 - (monthDays.length - 28) * 0.5;
  
  // Динамический расчёт gap между днями
  // Базовое значение 7px для 28 дней, уменьшается на 1px за каждый дополнительный день
  // Результаты: 28 дней = 7px, 29 дней = 6px, 30 дней = 5px, 31 день = 4px
  const gapPx = 7 - (monthDays.length - 28);

  return (
    <div className="flex flex-col gap-1" style={{ paddingLeft: `${paddingPx}px`, paddingRight: `${paddingPx}px` }}>
      {/* Строка 1: Процент выполнения за каждый день */}
      <div className="flex" style={{ gap: `${gapPx}px` }}>
        {monthDays.map((dayData, dayIndex) => {
          const dateStr = formatDate(dayData.date);
          const totalHabits = habits.length;
          const completedHabits = habits.filter(habit => isHabitCompletedForDate(habit, dateStr)).length;
          const skippedHabits = habits.filter(habit => habit.skipped?.[dateStr]).length;
          const adjustedGoal = Math.max(0, totalHabits - skippedHabits);
          const percentage = adjustedGoal > 0 ? Math.round((completedHabits / adjustedGoal) * 100) : 0;

          return (
            <div
              key={`chart-stats-percentage-${dayIndex}`}
              className="w-6 h-3 flex-shrink-0 flex items-center justify-center"
              style={{ fontSize: '7px', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              {percentage}%
            </div>
          );
        })}
      </div>

      {/* Строка 2: Количество выполненных привычек */}
      <div className="flex" style={{ gap: `${gapPx}px` }}>
        {monthDays.map((dayData, dayIndex) => {
          const dateStr = formatDate(dayData.date);
          const completedHabits = habits.filter(habit => isHabitCompletedForDate(habit, dateStr)).length;

          return (
            <div
              key={`chart-stats-count-${dayIndex}`}
              className="w-6 h-3 flex-shrink-0 flex items-center justify-center"
              style={{ fontSize: '7px', fontWeight: 500, color: 'var(--text-secondary)' }}
            >
              {completedHabits}
            </div>
          );
        })}
      </div>

      {/* Строка 3: Общее количество привычек (с учётом пропусков) */}
      <div className="flex" style={{ gap: `${gapPx}px` }}>
        {monthDays.map((dayData, dayIndex) => {
          const dateStr = formatDate(dayData.date);
          const totalHabits = habits.length;
          const skippedHabits = habits.filter(habit => habit.skipped?.[dateStr]).length;
          const adjustedGoal = Math.max(0, totalHabits - skippedHabits);

          return (
            <div
              key={`chart-stats-total-${dayIndex}`}
              className="w-6 h-3 flex-shrink-0 flex items-center justify-center"
              style={{ fontSize: '7px', fontWeight: 500, color: 'var(--text-secondary)' }}
            >
              <span>
                {adjustedGoal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}