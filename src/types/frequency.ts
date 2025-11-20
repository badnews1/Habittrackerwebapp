/**
 * Типы для системы частоты выполнения привычек
 * Централизованное хранилище UI-специфичных типов системы частоты
 * 
 * Дата создания: 19 ноября 2024
 * Последнее обновление: 20 ноября 2025 - унификация типов, удалены дубликаты
 * 
 * ВАЖНО: Базовые типы FrequencyType и FrequencyConfig находятся в /types/habit.ts
 * и реэкспортируются здесь для удобства импорта в UI компонентах.
 */

// Реэкспорт базовых типов из /types/habit.ts для обратной совместимости
export type { FrequencyType, FrequencyConfig } from './habit';

/**
 * Пропсы компонента FrequencyEditor
 */
export interface FrequencyEditorProps {
  /** Текущий тип частоты */
  frequencyType: import('./habit').FrequencyType;
  
  /** Текущее количество выполнений */
  frequencyCount: number;
  
  /** Текущий период в днях */
  frequencyPeriod: number;
  
  /** Текущие выбранные дни недели */
  daysOfWeek?: number[];
  
  /** Колбэк изменения типа частоты */
  onFrequencyTypeChange: (type: import('./habit').FrequencyType) => void;
  
  /** Колбэк изменения количества */
  onFrequencyCountChange: (count: number) => void;
  
  /** Колбэк изменения периода */
  onFrequencyPeriodChange: (period: number) => void;
  
  /** Колбэк изменения дней недели */
  onDaysOfWeekChange?: (days: number[]) => void;
}

/**
 * Локальные значения для каждого типа частоты
 * Позволяют сохранять введённые значения при переключении между типами
 */
export interface LocalFrequencyValues {
  every_n_days: {
    period: number | undefined;
  };
  n_times_week: {
    count: number | undefined;
  };
  n_times_month: {
    count: number | undefined;
  };
  n_times_in_m_days: {
    count: number | undefined;
    period: number | undefined;
  };
  by_days_of_week: {
    days: number[] | undefined;
  };
}

/**
 * Дефолтные значения для каждого типа частоты
 */
export interface FrequencyDefaultValues {
  every_n_days: { period: number };
  n_times_week: { count: number };
  n_times_month: { count: number };
  n_times_in_m_days: { count: number; period: number };
  by_days_of_week: { days: number[] };
}

/**
 * Константы дефолтных значений
 */
export const DEFAULT_FREQUENCY_VALUES: FrequencyDefaultValues = {
  every_n_days: { period: 5 },
  n_times_week: { count: 5 },
  n_times_month: { count: 10 },
  n_times_in_m_days: { count: 5, period: 14 },
  by_days_of_week: { days: [] },
} as const;