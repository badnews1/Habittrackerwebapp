/**
 * Типы сущности Habit (Привычка)
 * 
 * @description
 * Все интерфейсы и типы для работы с привычками.
 * Используется во всех модулях и фичах приложения.
 * 
 * @module entities/habit/model/types
 * @created 29 ноября 2025 - миграция из /modules/habit-tracker/types
 * @updated 29 ноября 2025 - добавлен тип Tag (миграция из /modules/habit-tracker/features/tags)
 */

import type { ColorVariant } from '@/shared/constants/colors';

/**
 * Тип привычки
 * binary - бинарная привычка (выполнено/не выполнено)
 * measurable - измеримая привычка (с числовыми значениями и целями)
 */
export type HabitType = 'binary' | 'measurable';

/**
 * Интерфейс тега привычки
 */
export interface Tag {
  /** Название тега */
  name: string;
  /** Цвет тега из универсальной палитры (ColorVariant) */
  color: ColorVariant;
}

/**
 * Интерфейс раздела привычки
 * 
 * Разделы позволяют группировать привычки (Утро, День, Вечер и т.д.)
 * с визуальным выделением через цветные полосы.
 * 
 * @property name - Название раздела (уникальное)
 * @property color - Цвет раздела из универсальной палитры
 */
export interface Section {
  /** Название раздела */
  name: string;
  /** Цвет раздела из универсальной палитры (ColorVariant) */
  color: ColorVariant;
}

/**
 * Тип частоты выполнения привычки
 */
export type FrequencyType =
  | 'every_n_days'            // Каждые N дней
  | 'n_times_week'            // N раз в неделю
  | 'n_times_month'           // N раз в месяц
  | 'by_days_of_week';        // По определённым дням недели

/**
 * Конфигурация частоты выполнения привычки
 */
export interface FrequencyConfig {
  /** Тип частоты */
  type: FrequencyType;
  /** Количество раз (для n_times_week, n_times_month) */
  count?: number;
  /** Период в днях (для every_n_days) */
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
  /** Теги привычки (множественный выбор) */
  tags: string[];
  /** Раздел привычки (Утро, День, Вечер, Другие или кастомный) */
  section: string;
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
  tags?: string[];
  section?: string;
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

/**
 * Конфигурация даты для рендеринга календаря
 * Используется в CalendarGrid, MonthlyStats, StrengthChart, ProgressSection, HabitsList
 */
export interface DateConfig {
  selectedMonth: number;
  selectedYear: number;
  monthDays: { date: Date; day: number }[];
  formatDate: (date: Date) => string;
  getDayName: (date: Date) => string;
}