/**
 * График для отображения количества выполненных привычек по дням
 * 
 * Обёртка над переиспользуемым компонентом AreaChart из shared/ui.
 * Содержит бизнес-логику подсчёта выполненных привычек и подготовки данных.
 * 
 * @module entities/habit/ui/stats
 * @migrated 30 ноября 2025 - перенесено из features/statistics в entities/habit
 * @updated 2 декабря 2025 - добавлена мультиязычность
 */

import { useTranslation } from 'react-i18next';
import type { Habit } from '../../model/types';
import { isHabitCompletedForDate } from '../../lib/habit-utils';
import { AreaChart } from '@/shared/ui/area-chart';

interface DailyCompletionAreaChartProps {
  /** Список привычек для подсчёта выполнения */
  habits: Habit[];
  /** Массив дней месяца с датами */
  monthDays: Array<{ day: number; date: Date }>;
  /** Функция форматирования даты в строку */
  formatDate: (date: Date) => string;
}

/**
 * Area Chart дневного выполнения привычек
 * 
 * Алгоритм:
 * 1. Для каждого дня считается количество выполненных привычек
 * 2. Подготавливаются данные в формате { label, value }
 * 3. Рендерится через переиспользуемый AreaChart из shared/ui
 * 
 * @example
 * ```tsx
 * <DailyCompletionAreaChart
 *   habits={habits}
 *   monthDays={monthDays}
 *   formatDate={(date) => date.toISOString().split('T')[0]}
 * />
 * ```
 */
export function DailyCompletionAreaChart({
  habits,
  monthDays,
  formatDate,
}: DailyCompletionAreaChartProps) {
  const { t } = useTranslation('stats');
  
  // Подсчёт выполненных привычек для каждого дня
  const chartData = monthDays.map((dayData) => {
    const dateStr = formatDate(dayData.date);
    const completedHabits = habits.filter(habit => 
      isHabitCompletedForDate(habit, dateStr)
    ).length;
    
    return {
      label: dayData.day,
      value: completedHabits
    };
  });

  return (
    <AreaChart
      data={chartData}
      height={230}
      color="var(--text-primary)"
      valueLabel={t('charts.completed')}
      showTooltip={true}
      addPaddingPoints={true}
      gradientId="dailyCompletionGradient"
    />
  );
}
