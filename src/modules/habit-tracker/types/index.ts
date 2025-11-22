/**
 * Централизованные типы для модуля habit-tracker
 * 
 * Этот файл содержит все интерфейсы и типы, связанные с привычками.
 * Используется во всех компонентах модуля для обеспечения единообразия типов.
 * 
 * @module modules/habit-tracker/types
 * @created 22 ноября 2025
 * @migrated из /types/habit.ts
 */

/**
 * Тип привычки
 * binary - бинарная привычка (выполнено/не выполнено)
 * measurable - измеримая привычка (с числовыми значениями и целями)
 */
export type HabitType = 'binary' | 'measurable';

/**
 * Тип частоты выполнения привычки
 */
export type FrequencyType =
  | 'daily'                 // Каждый день
  | 'every_n_days'          // Каждые N дней
  | 'n_times_week'          // N раз в неделю
  | 'n_times_month'         // N раз в месяц
  | 'n_times_in_m_days'     // N раз в M дней
  | 'by_days_of_week';      // По определённым дням недели

/**
 * Конфигурация частоты выполнения привычки
 */
export interface FrequencyConfig {
  /** Тип частоты */
  type: FrequencyType;
  /** Количество раз (для n_times_week, n_times_month, n_times_in_m_days) */
  count?: number;
  /** Период в днях (для every_n_days, n_times_in_m_days) */
  period?: number;
  /** Дни недели (0-6, где 0 - воскресенье) для by_days_of_week */
  daysOfWeek?: number[];
}

/**
 * Напоминание для привычки
 */
export interface Reminder {
  id: string;
  time: string;
  enabled: boolean;
}

/**
 * Основной интерфейс привычки
 */
export interface Habit {
  /** Уникальный идентификатор */
  id: string;
  /** Название привычки */
  name: string;
  /** Дата создания (ISO формат) */
  createdAt: string;
  /** Записи о выполнении: ключ - дата (YYYY-MM-DD), значение - true/false для binary или число для measurable */
  completions: { [date: string]: boolean | number };
  /** Записи о пропусках (заморозка силы привычки) */
  skipped?: { [date: string]: boolean };
  /** Конфигурация частоты выполнения */
  frequency?: FrequencyConfig;
  /** Описание привычки */
  description?: string;
  /** Флаг для временного состояния (используется в UI) */
  checked?: boolean;
  /** Иконка привычки (emoji или название иконки) */
  icon?: string;
  /** Категория привычки */
  category?: string;
  /** Включены ли напоминания (legacy, для обратной совместимости) */
  reminderEnabled?: boolean;
  /** Время напоминания (legacy, для обратной совместимости) */
  reminderTime?: string;
  /** Массив напоминаний (новый формат) */
  reminders?: Reminder[];
  /** Сила привычки (0-100), рассчитывается по алгоритму EMA */
  strength?: number;
  /** Дата последнего полного пересчёта силы (ISO формат) */
  lastStrengthUpdate?: string;
  /** Базовая сила на момент lastStrengthUpdate (для инкрементального пересчёта) */
  strengthBaseline?: number;
  /** Тип привычки: бинарная (галочка/пропуск) или измеримая (с метриками) */
  type: HabitType;
  /** Единица измерения для measurable типа (км, кг, литров и т.д.) */
  unit?: string;
  /** Целевое значение для measurable типа */
  targetValue?: number;
  /** Тип цели: достичь минимума или не превысить максимум */
  targetType?: 'min' | 'max';
}

/**
 * Данные для создания новой привычки
 */
export interface HabitData {
  name: string;
  description: string;
  frequency: FrequencyConfig;
  icon: string;
  category?: string;
  type: HabitType;
  unit?: string;
  targetValue?: number;
  targetType?: 'min' | 'max';
  reminders?: Reminder[];
}

/**
 * Настройки для измеримой привычки (используется при обновлении)
 */
export interface MeasurableSettings {
  /** Единица измерения */
  unit?: string;
  /** Целевое значение */
  targetValue?: number;
  /** Тип цели: достичь минимума или не превысить максимум */
  targetType?: 'min' | 'max';
}
