/**
 * Фича Tags - управление тегами привычек
 * 
 * @module modules/habit-tracker/features/tags
 * @created 23 ноября 2025 (миграция с categories)
 */

// Компоненты
export { HabitTagPicker } from './components';
export type { HabitTagPickerProps } from './components';

// Типы
export type { Tag } from './types';

// Утилиты
export { initializeHabitTags, migrateLegacyTags, getTagColor } from './utils';
