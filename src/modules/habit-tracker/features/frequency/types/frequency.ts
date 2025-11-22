/**
 * Типы для конфигурации частоты выполнения привычки
 * 
 * @module modules/habit-tracker/features/frequency/types
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - обновлены реэкспорты на модульные типы
 */

// Реэкспорт базовых типов из модуля habit-tracker для обратной совместимости
export type { FrequencyType, FrequencyConfig } from '@/modules/habit-tracker/types';

/**
 * Пропсы компонента FrequencyEditor
 */
export interface FrequencyEditorProps {
  /** Текущий тип частоты */
  frequencyType: import('@/types/habit').FrequencyType;
  
  /** Текущее количество выполнений */
  frequencyCount: number;
  
  /** Текущий период в днях */
  frequencyPeriod: number;
  
  /** Текущие выбранные дни недели */
  daysOfWeek?: number[];
  
  /** Колбэк изменения типа частоты */
  onFrequencyTypeChange: (type: import('@/types/habit').FrequencyType) => void;
  
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