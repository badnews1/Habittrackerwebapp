/**
 * Виджет графика дневного прогресса выполнения привычек
 * 
 * Area Chart с градиентной заливкой, показывающий количество
 * выполненных привычек по дням месяца. Включает:
 * - Заголовок с днями недели и числами месяца
 * - График area chart
 * - Три строки статистики под графиком (процент, выполнено, всего)
 * 
 * @module widgets/habit-daily-chart
 * @created 30 ноября 2025 - выделено из features/statistics/StrengthChart
 * @updated 1 декабря 2025 - обёрнут в Card компонент
 * @refactored 2 декабря 2025 - добавлена структура CardContent, убран p-4
 */

import type { Habit, DateConfig } from '@/entities/habit';
import { DailyStatsRows, DailyCompletionAreaChart } from '@/entities/habit';
import { CalendarDayHeader } from '@/shared/ui/calendar-day-header';
import { Card, CardContent } from '@/components/ui/card';

interface HabitDailyChartProps {
  /** Список привычек для отображения */
  habits: Habit[];
  /** Конфигурация дат (месяц, форматирование) */
  dateConfig: DateConfig;
}

/**
 * Виджет графика дневного прогресса
 * 
 * Показывает area chart с количеством выполненных привычек по дням.
 * Под графиком три строки:
 * 1. Процент выполнения = (completedHabits / adjustedGoal) * 100
 * 2. Количество выполненных привычек
 * 3. Общее количество привычек (с учётом пропущенных)
 * 
 * adjustedGoal = totalHabits - skippedHabits
 */
export function HabitDailyChart({
  habits,
  dateConfig,
}: HabitDailyChartProps) {
  const { monthDays, formatDate, getDayName } = dateConfig;

  return (
    <Card>
      <CardContent className="p-6 flex flex-col">
        {/* Заголовок календаря: дни недели + числа месяца */}
        <div className="-mx-6">
          <CalendarDayHeader
            monthDays={monthDays}
            getDayName={getDayName}
          />
        </div>
        
        {/* График - выходит за границы padding с помощью отрицательных margin */}
        <div className="mt-4 -mx-6">
          <DailyCompletionAreaChart
            habits={habits}
            monthDays={monthDays}
            formatDate={formatDate}
          />
        </div>

        {/* Три строки статистики: проценты, выполнено, всего */}
        <div className="mt-4 -mx-6">
          <DailyStatsRows
            habits={habits}
            monthDays={monthDays}
            formatDate={formatDate}
          />
        </div>
      </CardContent>
    </Card>
  );
}