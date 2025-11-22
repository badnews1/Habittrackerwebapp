/**
 * Типы категорий привычек
 * 
 * @module modules/habit-tracker/features/categories/types
 * @created 22 ноября 2025
 */

/**
 * Интерфейс категории привычки
 */
export interface Category {
  /** Название категории */
  name: string;
  /** Tailwind CSS классы для цвета категории */
  color: string;
}
