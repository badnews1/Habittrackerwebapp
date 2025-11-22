/**
 * Типы модуля habits
 * 
 * Реэкспортирует типы из модуля habit-tracker
 * и добавляет UI-специфичные типы для компонентов habits.
 * 
 * @module modules/habit-tracker/features/habits/types
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - обновлены импорты на модульные типы
 */

// Реэкспорт основных типов привычек из модуля
export type {
  Habit,
  HabitData,
  HabitType,
  FrequencyConfig,
  FrequencyType,
  Reminder,
  MeasurableSettings,
} from '@/modules/habit-tracker/types';

/**
 * Пропсы для HabitRow компонента
 */
export interface HabitRowProps {
  /** Привычка для отображения */
  habit: Habit;
  /** Индекс привычки в списке (для drag-n-drop) */
  index?: number;
  /** Колбэк перемещения привычки */
  onMoveHabit?: (dragIndex: number, hoverIndex: number) => void;
  /** Колбэк обновления привычки */
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  /** Флаг только что добавленной привычки */
  isNewlyAdded?: boolean;
  /** Колбэк завершения редактирования */
  onEditComplete?: () => void;
  /** Текущий месяц */
  selectedMonth?: number;
  /** Текущий год */
  selectedYear?: number;
  /** Показывать чекбокс для выбора */
  showCheckbox?: boolean;
  /** Режим недельного отображения */
  isWeekly?: boolean;
}