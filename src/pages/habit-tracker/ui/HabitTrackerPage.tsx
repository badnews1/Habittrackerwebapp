/**
 * Страница трекера привычек
 * 
 * Главная страница приложения с полным интерфейсом трекера:
 * - Календарная сетка с отметками выполнения
 * - Список привычек с управлением
 * - Прогресс-бары и статистика
 * - Графики и топ-10
 * 
 * @module pages/habit-tracker/ui/HabitTrackerPage
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 2 декабря 2025 - интеграция единого виджета HabitCalendar
 */

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { HabitCalendar } from '@/widgets/habit-calendar';
import { HabitDailyChart } from '@/widgets/habit-daily-chart';
import { HabitTop10 } from '@/widgets/habit-top10';
import { HabitMonthlyStats } from '@/widgets/habit-monthly-stats';
import { HabitMonthNavigation } from '@/widgets/habit-month-navigation';
import { HabitDailyProgressBars } from '@/widgets/habit-daily-progress-bars';
import { HabitMonthlyCircle } from '@/widgets/habit-monthly-circle';
import { getDaysInMonth, formatDate, getLocalizedDayName } from '@/shared/lib/date';
import { useHabitsStore } from '@/app/store';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export function HabitTrackerPage() {
  // ==================== I18N ====================
  const { t } = useTranslation('common');

  // Получаем данные и actions из store
  const {
    habits,
    selectedMonth,
    selectedYear,
    openStatsModal,
  } = useHabitsStore(
    useShallow((state) => ({
      habits: state.habits,
      selectedMonth: state.selectedMonth,
      selectedYear: state.selectedYear,
      openStatsModal: state.openStatsModal,
    }))
  );

  // Вычисляем дни месяца
  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  // Формируем конфигурационные объекты для дочерних компонентов
  const dateConfig = {
    selectedMonth,
    selectedYear,
    monthDays,
    formatDate,
    getDayName: (date: Date) => getLocalizedDayName(date, t), // Wrapper с передачей t
  };

  // Обработчик клика по иконке статистики
  const handleStatsClick = (habitId: string) => {
    const monthYearKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    openStatsModal(habitId, monthYearKey);
  };

  return (
    <div className="space-y-4">
      {/* Верхняя секция: навигация по месяцам, дневные прогресс-бары, круговой индикатор месяца */}
      <div className="mb-3">
        <div className="inline-block min-w-max">
          <div className="flex items-end gap-4 mb-1">
            {/* Навигация по месяцам */}
            <HabitMonthNavigation />
            
            {/* Дневные прогресс-бары */}
            <HabitDailyProgressBars />

            {/* Круговой индикатор прогресса месяца */}
            <HabitMonthlyCircle />
          </div>
        </div>
      </div>

      {/* Основная секция: единый виджет календаря привычек */}
      <div className="min-w-max pr-5">
        <HabitCalendar
          habits={habits}
          dateConfig={dateConfig}
          onStatsClick={handleStatsClick}
        />
      </div>

      {/* Секция аналитики: месячная статистика, дневной график, топ-10 привычек */}
      <div className="min-w-max flex gap-4 pr-5">
        {/* Месячная статистика */}
        <HabitMonthlyStats />

        {/* Дневной график выполнения */}
        <HabitDailyChart
          habits={habits}
          dateConfig={dateConfig}
        />

        {/* Топ-10 привычек */}
        <HabitTop10
          habits={habits}
          dateConfig={dateConfig}
        />
      </div>
    </div>
  );
}