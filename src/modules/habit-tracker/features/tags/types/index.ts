/**
 * Типы тегов привычек
 * 
 * @module modules/habit-tracker/features/tags/types
 * @created 23 ноября 2025 (миграция с categories)
 */

/**
 * Интерфейс тега привычки
 */
export interface Tag {
  /** Название тега */
  name: string;
  /** Tailwind CSS классы для цвета тега */
  color: string;
}
