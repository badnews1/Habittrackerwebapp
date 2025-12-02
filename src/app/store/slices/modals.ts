/**
 * Modals Slice - управление модальными окнами
 * 
 * Содержит actions для открытия/закрытия всех модальных окон:
 * - AddHabitModal
 * - NumericInputModal
 * - StatsModal
 * - MonthYearPicker
 * 
 * @module app/store/slices/modals
 * @updated 1 декабря 2025 - удалена ManageHabitsModal
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';

/**
 * Создает slice с actions для модальных окон
 */
export const createModalsSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<
    HabitsState,
    | 'openAddHabitModal'
    | 'closeAddHabitModal'
    | 'openNumericInputModal'
    | 'closeNumericInputModal'
    | 'openStatsModal'
    | 'closeStatsModal'
    | 'openMonthYearPicker'
    | 'closeMonthYearPicker'
  >
> = (set) => ({
  openAddHabitModal: () => {
    set({ isAddHabitModalOpen: true });
  },

  closeAddHabitModal: () => {
    set({ isAddHabitModalOpen: false });
  },

  openNumericInputModal: (habitId, date) => {
    set({ numericInputModal: { habitId, date } });
  },

  closeNumericInputModal: () => {
    set({ numericInputModal: null });
  },

  openStatsModal: (habitId, monthYearKey) => {
    set({ statsModal: { habitId, monthYearKey } });
  },

  closeStatsModal: () => {
    set({ statsModal: null });
  },

  openMonthYearPicker: () => {
    set({ isMonthYearPickerOpen: true });
  },

  closeMonthYearPicker: () => {
    set({ isMonthYearPickerOpen: false });
  },
});
