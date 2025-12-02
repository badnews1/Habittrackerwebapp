/**
 * Виджет месячного кругового прогресса
 * 
 * Отображает круговой индикатор общего прогресса за месяц.
 * 
 * @module widgets/habit-monthly-circle
 * @created 30 ноября 2025 - выделено из features/habit-calendar/CalendarHeader
 */

import { useHabitsStore } from '@/app/store';
import { getDaysInMonth, formatDate } from '@/shared/lib/date';
import { MonthlyCircle } from '@/entities/habit';

export function HabitMonthlyCircle() {
  // Получаем данные из store
  const habits = useHabitsStore(state => state.habits);
  const selectedMonth = useHabitsStore(state => state.selectedMonth);
  const selectedYear = useHabitsStore(state => state.selectedYear);

  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  return (
    <MonthlyCircle
      habits={habits}
      monthDays={monthDays}
      formatDate={formatDate}
      selectedMonth={selectedMonth}
      selectedYear={selectedYear}
    />
  );
}