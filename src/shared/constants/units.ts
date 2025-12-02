/**
 * Универсальные единицы измерения для различных модулей
 * 
 * Эти константы могут использоваться любыми модулями приложения:
 * - Трекер привычек
 * - Трекер задач
 * - Другие модули планирования
 * 
 * Каждый модуль сам решает, какие единицы измерения ему нужны.
 * 
 * Последнее обновление: 29 ноября 2025
 */

/** Единицы подсчёта */
export const COUNTING_UNITS = ['разы', 'штуки', 'баллы', 'подходы', 'задачи'] as const;

/** Единицы времени */
export const TIME_UNITS = ['минуты', 'часы'] as const;

/** Единицы расстояния и движения */
export const DISTANCE_UNITS = ['шаги', 'километры', 'метры'] as const;

/** Единицы веса */
export const WEIGHT_UNITS = ['килограммы', 'граммы'] as const;

/** Единицы объёма */
export const VOLUME_UNITS = ['стаканы', 'литры', 'милилитры', 'порции', 'чашки'] as const;

/** Единицы калорий */
export const CALORIE_UNITS = ['калории'] as const;

/** Единицы для чтения */
export const READING_UNITS = ['страницы', 'слова', 'главы'] as const;

/** Единицы валют */
export const CURRENCY_UNITS = ['руб.', '$', '€'] as const;

/**
 * Все доступные единицы измерения (плоский массив)
 */
export const UNIT_OPTIONS = [
  ...COUNTING_UNITS,
  ...TIME_UNITS,
  ...DISTANCE_UNITS,
  ...WEIGHT_UNITS,
  ...VOLUME_UNITS,
  ...CALORIE_UNITS,
  ...READING_UNITS,
  ...CURRENCY_UNITS,
] as const;

/**
 * Тип для всех возможных единиц измерения
 */
export type UnitOption = typeof UNIT_OPTIONS[number];
