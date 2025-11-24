/**
 * Начальное состояние Zustand store
 * 
 * Все дефолтные значения для state приложения.
 * Разделение начального состояния улучшает читаемость.
 * 
 * @module core/store/initialState
 * @updated 23 ноября 2025 - миграция categories → tags
 */

import { initializeHabitTags } from '@/modules/habit-tracker/features/tags';

/**
 * Начальное состояние store (только данные, без actions)
 */
export const getInitialState = () => ({
  // ==================== ДАННЫЕ ====================
  habits: [],
  tags: initializeHabitTags(),
  sections: ['Другие', 'Утро', 'День', 'Вечер'],
  dailyGoals: {},
  defaultDailyGoal: '',

  // ==================== UI СОСТОЯНИЕ ====================
  currentSection: 'habits',
  isSidebarOpen: false,
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),

  // ==================== UNDO СИСТЕМА ====================
  previousHabitsState: null,
  actionsAfterClear: 0,

  // ==================== МОДАЛЬНЫЕ ОКНА ====================
  showDeleteDialog: null,
  newlyAddedHabitId: null,
  numericInputModal: null,
  isMonthYearPickerOpen: false,
  editingGoal: null,
  isManageHabitsModalOpen: false,
  isAddHabitModalOpen: false,
  manageHabitsModal: {
    localHabits: [],
    expandedHabitId: null,
    isInitialized: false,
  },
  addHabitForm: {
    name: '',
    description: '',
    icon: 'dumbbell',
    tags: [],
    section: 'Другие',
    type: 'binary',
    frequency: {
      type: 'daily',
      count: 7,
      period: 7,
      daysOfWeek: [],
    },
    frequencyBackup: null,
    reminders: [],
    measurable: {
      unit: '',
      targetValue: '',
      targetType: 'min',
    },
    currentStep: 1,
    openPicker: null,
    currentIconPage: 0,
    isInitialized: false,
  },
});