/**
 * Modals Slice - управление модальными окнами
 * 
 * Содержит actions для открытия/закрытия всех модальных окон:
 * - AddHabitModal
 * - ManageHabitsModal
 * - NumericInputModal
 * - MonthYearPicker
 * 
 * @module core/store/slices/modals
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
    | 'openManageHabitsModal'
    | 'closeManageHabitsModal'
    | 'openNumericInputModal'
    | 'closeNumericInputModal'
    | 'openMonthYearPicker'
    | 'closeMonthYearPicker'
    | 'setEditingGoal'
    | 'clearNewlyAddedHabitId'
  >
> = (set) => ({
  openAddHabitModal: () => {
    set({ isAddHabitModalOpen: true });
  },

  closeAddHabitModal: () => {
    set({ isAddHabitModalOpen: false });
  },

  openManageHabitsModal: () => {
    set({ isManageHabitsModalOpen: true });
  },

  closeManageHabitsModal: () => {
    set({ isManageHabitsModalOpen: false });
  },

  openNumericInputModal: (habitId, date) => {
    set({ numericInputModal: { habitId, date } });
  },

  closeNumericInputModal: () => {
    set({ numericInputModal: null });
  },

  openMonthYearPicker: () => {
    set({ isMonthYearPickerOpen: true });
  },

  closeMonthYearPicker: () => {
    set({ isMonthYearPickerOpen: false });
  },

  setEditingGoal: (date) => {
    set({ editingGoal: date });
  },

  clearNewlyAddedHabitId: () => {
    set({ newlyAddedHabitId: null });
  },
});
