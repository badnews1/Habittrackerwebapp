/**
 * Универсальный input компонент для системы частоты
 * 
 * Инкапсулирует логику:
 * - Автоактивации при клике/фокусе
 * - Автозаполнения дефолтным значением при blur
 * - Динамических стилей в зависимости от состояния
 * - Предотвращения всплытия событий
 * 
 * @module modules/habit-tracker/features/frequency/components
 * @migrated 22 ноября 2025
 */

import React from 'react';

interface FrequencyInputProps {
  /** Значение для отображения (может быть undefined) */
  value: number | undefined;
  
  /** Дефолтное значение для отображения когда неактивно */
  defaultValue: number;
  
  /** Активна ли данная секция частоты */
  isActive: boolean;
  
  /** Колбэк активации секции */
  onActivate: () => void;
  
  /** Колбэк изменения значения */
  onChange: (value: string) => void;
  
  /** Колбэк при потере фокуса (для автозаполнения) */
  onBlur: () => void;
  
  /** Минимальное значение */
  min?: number;
  
  /** Максимальное значение */
  max?: number;
  
  /** Дополнительные CSS классы */
  className?: string;
}

export const FrequencyInput: React.FC<FrequencyInputProps> = ({
  value,
  defaultValue,
  isActive,
  onActivate,
  onChange,
  onBlur,
  min = 1,
  max = 365,
  className = 'w-14',
}) => {
  // Отображаемое значение: если активно - value или пусто, если неактивно - value или дефолт
  const displayValue = isActive
    ? (value !== undefined ? value : '')
    : (value !== undefined ? value : defaultValue);

  return (
    <input
      type="number"
      min={min}
      max={max}
      value={displayValue}
      onChange={(e) => {
        e.stopPropagation();
        // Вызываем onChange всегда, не только когда активно
        // Активация происходит асинхронно, и нужно сохранять изменения
        onChange(e.target.value);
      }}
      onClick={(e) => {
        e.stopPropagation();
        // Автоактивация при клике
        if (!isActive) {
          onActivate();
        }
      }}
      onFocus={(e) => {
        // Автоактивация при фокусе
        if (!isActive) {
          onActivate();
        }
      }}
      onBlur={(e) => {
        // Автозаполнение дефолтным значением при пустом поле
        if (isActive && e.target.value === '') {
          onBlur();
        }
      }}
      className={`${className} px-2 py-1 text-center border rounded focus:outline-none transition-colors text-sm ${
        isActive
          ? 'bg-white text-gray-900 border-gray-300 focus:border-gray-900'
          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-pointer'
      }`}
    />
  );
};
