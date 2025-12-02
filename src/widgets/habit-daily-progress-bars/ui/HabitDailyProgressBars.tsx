/**
 * Виджет дневных столбцов прогресса
 * 
 * Отображает вертикальные столбцы с прогрессом выполнения привычек по дням месяца.
 * 
 * @module widgets/habit-daily-progress-bars
 * @created 30 ноября 2025 - выделено из features/habit-calendar/CalendarHeader
 */

import { useHabitsStore } from '@/app/store';
import { getDaysInMonth, formatDate } from '@/shared/lib/date';
import { DailyProgressBars } from '@/entities/habit';

export function HabitDailyProgressBars() {
  // Получаем данные из store
  const habits = useHabitsStore(state => state.habits);
  const selectedMonth = useHabitsStore(state => state.selectedMonth);
  const selectedYear = useHabitsStore(state => state.selectedYear);

  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  return (
    <DailyProgressBars
      monthDays={monthDays}
      habits={habits}
      formatDate={formatDate}
    />
  );
}