/**
 * Главная таблица привычек
 * 
 * Использует хуки модуля habits для операций и состояния.
 * Координирует работу всех подкомпонентов: список привычек,
 * календарная сетка, статистика и графики.
 * 
 * @module modules/habit-tracker/features/habits/components/HabitsTable
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { HabitsListPanel } from './HabitsListPanel';
import { CalendarGrid } from '@/modules/habit-tracker/features/calendar';
import { ProgressSection, MonthlyStats, StrengthChart } from '@/modules/habit-tracker/features/statistics';
import { isHabitCompletedForDate } from '../utils';
import { getDaysInMonth, formatDate, getDayName } from '@/shared/utils/date';
import { useHabitsStore } from '@/core/store';

export function HabitsTable() {
  // Получаем данные напрямую из store с useShallow для оптимизации
  const {
    habits,
    selectedMonth,
    selectedYear,
    newlyAddedHabitId,
    clearNewlyAddedHabitId,
    dailyGoals,
    editingGoal,
    defaultDailyGoal,
    previousHabitsState,
  } = useHabitsStore(
    useShallow((state) => ({
      habits: state.habits,
      selectedMonth: state.selectedMonth,
      selectedYear: state.selectedYear,
      newlyAddedHabitId: state.newlyAddedHabitId,
      clearNewlyAddedHabitId: state.clearNewlyAddedHabitId,
      dailyGoals: state.dailyGoals,
      editingGoal: state.editingGoal,
      defaultDailyGoal: state.defaultDailyGoal,
      previousHabitsState: state.previousHabitsState,
    }))
  );

  // Вычисляем дни месяца
  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  // Проверяем наличие выполнений в текущем месяце
  const hasAnyCompletions = habits.some(habit => {
    return monthDays.some(dayData => {
      const dateStr = formatDate(dayData.date);
      return isHabitCompletedForDate(habit, dateStr) || habit.skipped?.[dateStr];
    });
  });

  // Формируем конфигурационные объекты для дочерних компонентов
  const dateConfig = {
    selectedMonth,
    selectedYear,
    monthDays,
    formatDate,
    getDayName,
  };

  const goalConfig = {
    dailyGoals,
    editingGoal,
    defaultDailyGoal,
    onSetDailyGoals: useHabitsStore.getState().setDailyGoals,
    onSetEditingGoal: useHabitsStore.getState().setEditingGoal,
    onSetDefaultDailyGoal: useHabitsStore.getState().handleDefaultDailyGoalChange,
  };

  const undoConfig = {
    canUndo: previousHabitsState !== null,
    onClearAllCompletions: useHabitsStore.getState().clearAllCompletions,
    onUndoClearAllCompletions: useHabitsStore.getState().undoClearAllCompletions,
  };

  return (
    <div className="space-y-4">
      {/* Top Section: Habits, Calendar, Progress Bars */}
      <div className="min-w-max flex gap-4 pr-5">
        {/* Habits List with gray background */}
        <HabitsListPanel
          habits={habits}
          newlyAddedHabitId={newlyAddedHabitId}
          onClearNewlyAdded={clearNewlyAddedHabitId}
          dateConfig={dateConfig}
        />

        {/* Calendar Section with Gray Background */}
        <CalendarGrid
          habits={habits}
          dateConfig={dateConfig}
        />

        {/* Progress Bars and Delete Buttons - Separate Gray Background */}
        <ProgressSection
          habits={habits}
          dateConfig={dateConfig}
        />
      </div>

      {/* Bottom Section: Pie Chart and Area Chart */}
      <div className="min-w-max flex gap-4 pr-5">
        {/* Left Column: Pie Chart and New Section */}
        <MonthlyStats
          habits={habits}
          dateConfig={dateConfig}
          goalConfig={goalConfig}
          undoConfig={undoConfig}
          hasAnyCompletions={hasAnyCompletions}
        />

        <StrengthChart
          habits={habits}
          dateConfig={dateConfig}
          goalConfig={goalConfig}
        />
      </div>
    </div>
  );
}