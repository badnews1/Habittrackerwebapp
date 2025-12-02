/**
 * Топ-10 привычек по проценту выполнения за месяц
 * 
 * Отображает рейтинг привычек, отсортированных по проценту выполнения
 * от лучших к худшим. Всегда показывает ровно 10 строк (пустые строки,
 * если привычек меньше 10).
 * 
 * Для каждой привычки показывает:
 * - Ранг (1-10)
 * - Название привычки (обрезается, если длинное)
 * - Процент выполнения
 * 
 * @module entities/habit/ui/stats
 * @migrated 30 ноября 2025 - перенесено из features/statistics в entities/habit
 * @refactored 1 декабря 2025 - адаптация к темной теме, убрана серая подложка
 * @refactored 2 декабря 2025 - убраны padding и заголовок, чистый entity компонент
 */

import { useEffect, useState } from 'react';
import type { Habit, DateConfig } from '../../model/types';
import { isHabitCompletedForDate, getMonthlyGoalFromFrequency } from '../../lib/habit-utils';

interface TopHabitsRankingProps {
  /** Список привычек для ранжирования */
  habits: Habit[];
  /** Конфигурация даты с информацией о месяце */
  dateConfig: DateConfig;
}

/**
 * Компонент топ-10 привычек
 * 
 * Алгоритм:
 * 1. Для каждой привычки рассчитывается процент выполнения за месяц
 * 2. Привычки сортируются по проценту (от большего к меньшему)
 * 3. Берутся топ-10 привычек
 * 4. Если привычек меньше 10, остальные строки остаются пустыми
 * 
 * @example
 * ```tsx
 * <TopHabitsRanking
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
export function TopHabitsRanking({
  habits,
  dateConfig,
}: TopHabitsRankingProps) {
  const { monthDays, formatDate, selectedMonth, selectedYear } = dateConfig;
  
  const [topHabits, setTopHabits] = useState<{ name: string, percentage: number, completedCount: number }[]>([]);

  useEffect(() => {
    // Рассчитываем процент выполнения для каждой привычки
    const habitsWithStats = habits.map(habit => {
      const completedCount = monthDays.filter(dayData => isHabitCompletedForDate(habit, formatDate(dayData.date))).length;
      const daysInMonth = monthDays.length;
      
      // Получаем месячную цель из частоты
      const goalValue = getMonthlyGoalFromFrequency(habit.frequency, daysInMonth, selectedMonth, selectedYear);
      
      const percentage = goalValue > 0 ? Math.round((completedCount / goalValue) * 100) : 0;
      
      return {
        name: habit.name,
        percentage,
        completedCount,
      };
    });
    
    // Сортируем по проценту (по убыванию)
    habitsWithStats.sort((a, b) => b.percentage - a.percentage);
    
    // Всегда показываем ровно 10 строк
    const displayRows = [];
    for (let i = 0; i < 10; i++) {
      if (i < habitsWithStats.length) {
        displayRows.push(habitsWithStats[i]);
      } else {
        displayRows.push(null);
      }
    }
    
    setTopHabits(displayRows);
  }, [habits, monthDays, formatDate, selectedMonth, selectedYear]);

  return (
    <div className="space-y-[5px]">
      {topHabits.map((habit, index) => (
        <div key={`top-habit-${index}`} className="flex items-center h-6">
          {/* Номер ранга */}
          {habits.length > 0 && habit && (
            <>
              <div 
                className="w-4 text-right"
                style={{ fontSize: '12px', color: 'var(--text-primary)' }}
              >
                {index + 1}
              </div>
              <div className="w-2" />
            </>
          )}
          
          {habit ? (
            <>
              {/* Название привычки */}
              <div className="flex-1 min-w-0 h-full flex items-center max-w-[calc(100%-20px)]">
                <div 
                  className="truncate"
                  style={{ fontSize: '12px', color: 'var(--text-primary)' }}
                >
                  {habit.name}
                </div>
              </div>
              <div className="w-2" />
              
              {/* Процент выполнения */}
              <div className="w-[30px] text-right" style={{ fontSize: '8px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {habit.percentage}%
              </div>
            </>
          ) : (
            <>
              {/* Пустая строка-заполнитель */}
              <div className="flex-1 min-w-0 h-full" />
              <div className="w-2" />
              <div className="w-10" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}