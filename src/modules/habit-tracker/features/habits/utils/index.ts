/**
 * Утилиты модуля habits
 * 
 * Экспортирует все утилиты для работы с привычками:
 * - Проверка выполнения
 * - Расчёт пропорциональных значений для EMA
 * - Работа с частотой
 * - Форматирование частоты
 * 
 * @module modules/habit-tracker/features/habits/utils
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - Миграция habitUtils в модуль
 */

// Экспорт всех утилит для работы с привычками
export {
  isHabitCompletedForDate,
  getCompletionValueForDate,
  getMonthlyGoalFromFrequency,
  isRequiredByFrequency,
  formatFrequency,
} from './habitUtils';
