/**
 * Начальное состояние Zustand store
 * 
 * Все дефолтные значения для state приложения.
 * Разделение начального состояния улучшает читаемость.
 * 
 * @module stores/habitsStore/initialState
 */

import { initializeCategories } from '../../utils/initializeCategories';

/**
 * Начальное состояние store (только данные, без actions)
 */
export const getInitialState = () => ({
  // ==================== ДАННЫЕ ====================
  habits: [],
  categories: initializeCategories(),
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
    category: '',
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