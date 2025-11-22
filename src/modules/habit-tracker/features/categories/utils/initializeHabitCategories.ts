/**
 * Утилита инициализации категорий привычек
 * 
 * @module modules/habit-tracker/features/categories/utils/initializeHabitCategories
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - обновлены импорты на модульную структуру
 */

import { Category } from '../types';
import { migrateLegacyCategories } from './categoryHelpers';
import { initializeCategories } from '@/shared/utils/categories';
import { categoryLogger } from '@/shared/utils/logger';

/**
 * Дефолтные категории привычек
 */
const DEFAULT_HABIT_CATEGORIES: Category[] = migrateLegacyCategories([
  'Здоровье', 
  'Учеба', 
  'Работа', 
  'Спорт', 
  'Питание', 
  'Сон', 
  'Творчество', 
  'Саморазвитие', 
  'Отношения', 
  'Финансы', 
  'Дом'
]);

/**
 * Инициализация категорий привычек
 * 
 * Загружает категории из localStorage ('categories') 
 * или возвращает дефолтные значения.
 * 
 * @returns Массив категорий привычек
 * 
 * @example
 * ```typescript
 * const categories = initializeHabitCategories();
 * ```
 */
export function initializeHabitCategories(): Category[] {
  return initializeCategories({
    storageKey: 'categories',
    defaultCategories: DEFAULT_HABIT_CATEGORIES,
    migrationFn: migrateLegacyCategories,
    logger: categoryLogger,
  });
}