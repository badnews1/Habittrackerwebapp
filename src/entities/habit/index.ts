// Public API для entities/habit
export {
  // Константы
  EMA_PERIOD,
  EMA_ALPHA,
  DEFAULT_SECTION,
  DEFAULT_SECTIONS,
  DEFAULT_SECTIONS_WITH_COLORS,
  HABIT_UNIT_GROUPS,
  SYSTEM_SECTION_KEYS,
  // Типы
  type HabitType,
  type FrequencyType,
  type FrequencyConfig,
  type Reminder,
  type Habit,
  type HabitData,
  type MeasurableSettings,
  type Tag,
  type Section,
  // Хуки
  useHabitActions,
  useHabits,
  useHabitUnitGroups,
  useLocalizedUnit,
} from './model';

// UI компоненты
export { HabitRow } from './ui/HabitRow';
export { HabitSectionSelect } from './ui/HabitSectionSelect';
export { HabitTypePicker } from './ui/HabitTypePicker';
export { TargetTypePicker } from './ui/TargetTypePicker';
export { HabitNotes } from './ui/HabitNotes';
export { HabitReminders } from './ui/reminders';
export { FrequencyTwoColumn } from './ui/frequency';
export { StrengthProgressBar, DailyProgressBars, MonthlyCircle, ProgressSection, MonthlyStats, TopHabitsRanking, DailyStatsRows, DailyCompletionAreaChart } from './ui/stats';
export { HabitNameCell } from './ui/HabitNameCell';
export { HabitProgressCell } from './ui/HabitProgressCell';

// Утилиты
export {
  getUniqueSections,
  getUniqueTags,
  countByTag,
  countBySection,
  countByType,
  countUncategorized,
  hasUncategorizedHabits,
  initializeHabitTags,
  isSystemTag,
  SYSTEM_TAG_KEYS,
  getCompletionValueForDate,
  // Habit Utils
  isHabitCompletedForDate,
  getMonthlyGoalFromFrequency,
  isRequiredByFrequency,
  formatFrequency,
  // Strength (EMA)
  recalculateStrength,
  applyEMAStep,
  findEarliestDateWithData,
  calculateStrengthHistory,
  calculateStrengthAtDate,
  type StrengthHistoryPoint,
  type StrengthHistoryOptions,
  // Frequency Validation
  validateCount,
  validatePeriod,
  getMinValue,
  getMaxValue,
  FREQUENCY_LIMITS,
  type ValidationResult,
  // Section Utils
  groupHabitsBySection,
  getSectionOrder,
  getSectionColor,
  isSystemSection,
} from './lib';