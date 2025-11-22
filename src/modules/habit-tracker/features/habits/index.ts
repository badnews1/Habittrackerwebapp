/**
 * Public API модуля habits
 * 
 * Экспортирует компоненты, хуки, типы и утилиты для работы с привычками.
 * 
 * @module modules/habit-tracker/features/habits
 * @created 22 ноября 2025
 */

// Компоненты
export {
  HabitRow,
  HabitStatisticsModal,
  HabitCheckboxCell,
  HabitsListPanel,
  HabitsTable,
  AddHabitModal,
  ManageHabitsModal,
  NumericInputModal,
  DeleteDialog,
} from './components';

// Хуки
export {
  useHabitOperations,
  useHabitState,
} from './hooks';

// Типы
export type {
  Habit,
  HabitData,
  HabitType,
  FrequencyConfig,
  FrequencyType,
  Reminder,
  MeasurableSettings,
  AddHabitModalProps,
  HabitRowProps,
  DateConfig,
} from './types';

// Утилиты
export {
  isHabitCompletedForDate,
  getCompletionValueForDate,
  getMonthlyGoalFromFrequency,
  isRequiredByFrequency,
  formatFrequency,
} from './utils';