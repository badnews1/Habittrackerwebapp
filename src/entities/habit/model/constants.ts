/**
 * Константы для сущности Habit
 * 
 * @module entities/habit/model/constants
 * @created 29 ноября 2025 - миграция из /modules/habit-tracker
 */

import {
  COUNTING_UNITS,
  TIME_UNITS,
  DISTANCE_UNITS,
  WEIGHT_UNITS,
  VOLUME_UNITS,
  CALORIE_UNITS,
  READING_UNITS,
  CURRENCY_UNITS,
} from '@/shared/constants/units';
import type { UnitGroup } from '@/shared/ui/unit-picker';
import type { Section } from './types';

// ========================================
// Расчёт силы привычки (EMA алгоритм)
// ========================================

/**
 * Период EMA (Exponential Moving Average) для расчёта силы привычки
 * 
 * N = 32 означает период ~1 месяц (окно влияния)
 * 
 * Чем больше N, тем более плавно меняется сила:
 * - N = 10 → быстрая реакция на изменения
 * - N = 32 → баланс (текущее значение) ✅
 * - N = 100 → очень медленная реакция
 */
export const EMA_PERIOD = 32;

/**
 * Коэффициент EMA (рассчитанный из периода)
 * alpha = 1 / N
 * 
 * Используется в формуле:
 * strength_new = strength_old × (1 - alpha) + completion × alpha
 */
export const EMA_ALPHA = 1 / EMA_PERIOD;

// ========================================
// Разделы для привычек
// ========================================

/**
 * Ключи системных разделов (используются для переводов)
 */
export const SYSTEM_SECTION_KEYS = {
  other: 'other',
  morning: 'morning',
  day: 'day',
  evening: 'evening',
} as const;

export const DEFAULT_SECTION = SYSTEM_SECTION_KEYS.other;

export const PROTECTED_SECTIONS = [DEFAULT_SECTION];

/**
 * Дефолтные разделы с цветами
 * 
 * Стандартные разделы для группировки привычек по времени дня.
 * Названия разделов хранятся как ключи для переводов (en: other, morning, day, evening).
 * Цвета подобраны интуитивно:
 * - other (Другие): серый (нейтральный, как "Без тега")
 * - morning (Утро): янтарный (тёплый утренний свет)
 * - day (День): голубой (небо)
 * - evening (Вечер): индиго (сумерки)
 */
export const DEFAULT_SECTIONS_WITH_COLORS: Section[] = [
  { name: SYSTEM_SECTION_KEYS.other, color: 'gray' },
  { name: SYSTEM_SECTION_KEYS.morning, color: 'amber' },
  { name: SYSTEM_SECTION_KEYS.day, color: 'sky' },
  { name: SYSTEM_SECTION_KEYS.evening, color: 'indigo' },
];

/**
 * Названия дефолтных разделов (для обратной совместимости)
 */
export const DEFAULT_SECTIONS = DEFAULT_SECTIONS_WITH_COLORS.map(s => s.name);

// ========================================
// Единицы измерения для привычек
// ========================================

/**
 * Группы единиц измерения для привычек
 * 
 * Собираются из атомарных констант из /shared/constants/units.ts
 * 
 * Всего 22 единицы в 6 группах:
 * - Счёт: 5 единиц
 * - Время: 2 единицы
 * - Расстояние и движение: 3 единицы
 * - Здоровье и питание: 8 единиц
 * - Чтение и обучение: 3 единицы
 * - Финансы: 3 единицы
 */
export const HABIT_UNIT_GROUPS: UnitGroup[] = [
  {
    label: 'Счёт',
    units: COUNTING_UNITS,
  },
  {
    label: 'Время',
    units: TIME_UNITS,
  },
  {
    label: 'Расстояние и движение',
    units: DISTANCE_UNITS,
  },
  {
    label: 'Здоровье и питание',
    units: [...CALORIE_UNITS, ...WEIGHT_UNITS, ...VOLUME_UNITS],
  },
  {
    label: 'Чтение и обучение',
    units: READING_UNITS,
  },
  {
    label: 'Финансы',
    units: CURRENCY_UNITS,
  },
];