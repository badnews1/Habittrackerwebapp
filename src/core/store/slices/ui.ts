/**
 * UI Slice - управление интерфейсом приложения
 * 
 * Содержит actions для:
 * - Переключение секций приложения
 * - Управление сайдбаром
 * - Выбор месяца/года
 * 
 * @module core/store/slices/ui
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';

/**
 * Создает slice с UI actions
 */
export const createUISlice: StateCreator<HabitsState, [], [], Pick<HabitsState, 'setCurrentSection' | 'toggleSidebar' | 'setSelectedDate'>> = (set) => ({
  setCurrentSection: (section) => {
    set({ currentSection: section });
  },

  toggleSidebar: (open) => {
    set({ isSidebarOpen: open });
  },

  setSelectedDate: (month, year) => {
    set({ selectedMonth: month, selectedYear: year });
  },
});
