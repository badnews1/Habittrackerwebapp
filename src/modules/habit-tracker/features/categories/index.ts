/**
 * Фича Categories - управление категориями привычек
 * 
 * @module modules/habit-tracker/features/categories
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - добавлены типы и утилиты
 */

// Компоненты
export { HabitCategoryPicker } from './components';
export type { HabitCategoryPickerProps } from './components';

// Типы
export type { Category } from './types';

// Утилиты
export { initializeHabitCategories, migrateLegacyCategories, getCategoryColor } from './utils';