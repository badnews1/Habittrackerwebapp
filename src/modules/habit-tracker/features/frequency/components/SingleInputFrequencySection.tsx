/**
 * Универсальный компонент для секций частоты с одним input полем
 * 
 * Инкапсулирует общую логику для:
 * - NTimesWeekSection (N раз в неделю)
 * - NTimesMonthSection (N раз в месяц)
 * - EveryNDaysSection (Каждые N дней)
 * 
 * @module modules/habit-tracker/features/frequency/components
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { FrequencyButton } from './FrequencyButton';
import { FrequencyInput } from './FrequencyInput';

interface SingleInputFrequencySectionProps {
  /** Активна ли данная секция */
  isActive: boolean;
  
  /** Основное значение (count или period в зависимости от типа) */
  value: number;
  
  /** Локальное значение для input */
  localValue: number | undefined;
  
  /** Колбэк активации секции */
  onActivate: () => void;
  
  /** Колбэк изменения значения */
  onChange: (value: string) => void;
  
  /** Колбэк при потере фокуса */
  onBlur: () => void;
  
  /** Дефолтное значение для автозаполнения */
  defaultValue: number;
  
  /** Минимальное значение */
  min: number;
  
  /** Максимальное значение */
  max: number;
  
  /** Функция склонения слова */
  declineWord: (value: number | undefined) => string;
  
  /** Опциональный префикс перед input (например, "Каждые") */
  prefix?: string;
}

export const SingleInputFrequencySection: React.FC<SingleInputFrequencySectionProps> = ({
  isActive,
  value,
  localValue,
  onActivate,
  onChange,
  onBlur,
  defaultValue,
  min,
  max,
  declineWord,
  prefix,
}) => {
  // Значение для склонения (если активно - используем value, иначе localValue)
  const valueForDeclension = isActive ? value : localValue;

  return (
    <FrequencyButton isActive={isActive} onActivate={onActivate}>
      <span className="flex items-center gap-2">
        {prefix && <span>{prefix}</span>}
        <FrequencyInput
          value={localValue}
          defaultValue={defaultValue}
          isActive={isActive}
          onActivate={onActivate}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
          max={max}
        />
        {declineWord(valueForDeclension)}
      </span>
    </FrequencyButton>
  );
};
