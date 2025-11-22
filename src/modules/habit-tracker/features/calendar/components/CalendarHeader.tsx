/**
 * Шапка календаря с названием месяца и прогресс-барами
 * 
 * Мигрирован на Zustand - берет данные и actions напрямую из store
 * 
 * @module modules/habit-tracker/features/calendar
 */

import { useHabitsStore } from '@/core/store';
import { getDaysInMonth, formatDate } from '@/shared/utils/date';
import { DailyProgressBars, MonthlyCircle } from '@/modules/habit-tracker/features/statistics';

export function CalendarHeader() {
  // Получаем данные из store
  const habits = useHabitsStore(state => state.habits);
  const selectedMonth = useHabitsStore(state => state.selectedMonth);
  const selectedYear = useHabitsStore(state => state.selectedYear);
  const dailyGoals = useHabitsStore(state => state.dailyGoals);
  const openMonthYearPicker = useHabitsStore(state => state.openMonthYearPicker);

  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  const getMonthName = (month: number) => {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ];
    return months[month];
  };

  return (
    <header className="mb-3">
      <div className="inline-block min-w-max">
        <div className="flex items-end gap-4 mb-1">
          {/* Month name (taking up the habit name space) */}
          <div className="flex-shrink-0 h-[86px] flex flex-col justify-end items-center relative" style={{ width: '262px', top: '-43px' }}>
            <button 
              onClick={openMonthYearPicker}
              className="text-gray-900 hover:text-gray-600 transition-colors"
            >
              <h1 className="text-[36px] text-[rgb(0,0,0)]">{getMonthName(selectedMonth).toUpperCase()}</h1>
            </button>
            <div className="text-center text-[8px] text-gray-500 tracking-wider mb-1 whitespace-pre">
              —  S M A L L   S T E P S,   B I G   W I N S  —
            </div>
          </div>
          
          {/* Daily Progress Bars */}
          <>
            <DailyProgressBars
              monthDays={monthDays}
              habits={habits}
              dailyGoals={dailyGoals}
              formatDate={formatDate}
            />
          </>

          {/* Monthly Circle Progress */}
          <MonthlyCircle
            habits={habits}
            monthDays={monthDays}
            formatDate={formatDate}
            dailyGoals={dailyGoals}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      </div>
    </header>
  );
}