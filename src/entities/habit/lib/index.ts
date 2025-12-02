/**
 * Public API для entities/habit/lib
 * 
 * @description
 * Утилиты для работы с привычками
 * 
 * @module entities/habit/lib
 * @updated 29 ноября 2025 - добавлена initializeHabitTags (миграция из /modules/habit-tracker/features/tags)
 * @updated 29 ноября 2025 - добавлена getCompletionValueForDate (миграция из /modules/habit-tracker/features/habits/utils)
 * @updated 30 ноября 2025 - мигрированы strength и frequency-validation из /features
 * @updated 30 ноября 2025 - удалён useFrequencyModal хук (заменён на атомарное управление через store)
 */

// Утилиты фильтрации
export {
  getUniqueSections,
  getUniqueTags,
  countByTag,
  countBySection,
  countByType,
  countUncategorized,
  hasUncategorizedHabits,
} from './filters';

// Утилиты тегов
export { 
  initializeHabitTags,
  isSystemTag,
  SYSTEM_TAG_KEYS,
} from './tag-utils';

// Утилиты выполнения (completions)
export { getCompletionValueForDate } from './completion-utils';

// Базовые утилиты работы с привычками
export {
  isHabitCompletedForDate,
  getMonthlyGoalFromFrequency,
  isRequiredByFrequency,
  formatFrequency,
} from './habit-utils';

// Утилиты силы привычки (Strength / EMA)
export {
  recalculateStrength,
  applyEMAStep,
  findEarliestDateWithData,
  calculateStrengthHistory,
  calculateStrengthAtDate,
  type StrengthHistoryPoint,
  type StrengthHistoryOptions,
} from './strength';

// Утилиты валидации частоты
export {
  validateCount,
  validatePeriod,
  getMinValue,
  getMaxValue,
  FREQUENCY_LIMITS,
  type ValidationResult,
} from './frequency-validation';

// Утилиты разделов
export {
  groupHabitsBySection,
  getSectionOrder,
  getSectionColor,
  isSystemSection,
} from './section-utils';