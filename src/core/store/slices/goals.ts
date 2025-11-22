/**
 * Goals Slice - управление целями
 * 
 * Содержит actions для:
 * - Установка целей по конкретным дням
 * - Установка дефолтной цели для месяца
 * - Обработка изменения дефолтной цели (применение ко всем дням)
 * 
 * @module core/store/slices/goals
 */

import type { HabitsState } from '../types';
import { formatDate } from '@/shared/utils/date';

/**
 * Создает slice с actions для работы с целями
 */
export const createGoalsSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<HabitsState, 'setDailyGoals' | 'setDefaultDailyGoal' | 'handleDefaultDailyGoalChange'>
> = (set, get) => ({
  setDailyGoals: (goals) => {
    set({ dailyGoals: goals });
  },

  setDefaultDailyGoal: (value) => {
    set({ defaultDailyGoal: value });
  },

  handleDefaultDailyGoalChange: (value) => {
    const state = get();
    const { dailyGoals, selectedMonth, selectedYear } = state;

    set({ defaultDailyGoal: value });

    const newDailyGoals = { ...dailyGoals };
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    if (value && !isNaN(parseInt(value))) {
      const goalNumber = parseInt(value);

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, selectedMonth, day);
        const dateStr = formatDate(date);
        newDailyGoals[dateStr] = goalNumber;
      }
    } else {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, selectedMonth, day);
        const dateStr = formatDate(date);
        delete newDailyGoals[dateStr];
      }
    }

    set({ dailyGoals: newDailyGoals });
  },
});