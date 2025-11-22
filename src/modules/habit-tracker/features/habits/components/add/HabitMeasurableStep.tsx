/**
 * Шаг 2: Настройки измеримой привычки
 * 
 * Отображается только для привычек типа 'measurable'.
 * Содержит поля:
 * - Единица измерения (обязательно)
 * - Тип цели (не меньше/не больше)
 * - Значение цели (обязательно)
 * 
 * @module modules/habit-tracker/features/habits/components/add/HabitMeasurableStep
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { UnitPicker } from '../manage/UnitPicker';
import { TargetTypePicker } from '../manage/TargetTypePicker';
import { INPUT_STYLES } from '@/shared/constants/styles';

interface HabitMeasurableStepProps {
  /** Выбранная единица измерения */
  unit: string;
  
  /** Колбэк изменения единицы измерения */
  onUnitChange: (unit: string) => void;
  
  /** Тип цели (min/max) */
  targetType: 'min' | 'max';
  
  /** Колбэк изменения типа цели */
  onTargetTypeChange: (targetType: 'min' | 'max') => void;
  
  /** Значение цели */
  targetValue: string;
  
  /** Колбэк изменения значения цели */
  onTargetValueChange: (value: string) => void;
  
  /** Открытый пикер */
  openPicker: 'unit' | 'targetType' | null;
  
  /** Колбэк изменения открытого пикера */
  onOpenPickerChange: (picker: 'unit' | 'targetType' | null) => void;
}

export const HabitMeasurableStep: React.FC<HabitMeasurableStepProps> = ({
  unit,
  onUnitChange,
  targetType,
  onTargetTypeChange,
  targetValue,
  onTargetValueChange,
  openPicker,
  onOpenPickerChange,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
      {/* Unit */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          Единица измерения
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <UnitPicker
          selectedUnit={unit}
          onSelectUnit={onUnitChange}
          isOpen={openPicker === 'unit'}
          onToggle={() => onOpenPickerChange(openPicker === 'unit' ? null : 'unit')}
        />
      </div>

      {/* Target Value and Target Type */}
      <div className="grid grid-cols-2 gap-3">
        {/* Target Type */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Тип цели</label>
          <TargetTypePicker
            selectedTargetType={targetType}
            onSelectTargetType={onTargetTypeChange}
            isOpen={openPicker === 'targetType'}
            onToggle={() => onOpenPickerChange(openPicker === 'targetType' ? null : 'targetType')}
          />
        </div>

        {/* Target Value */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Цель
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={targetValue}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numbers and decimal point
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                onTargetValueChange(value);
              }
            }}
            className={INPUT_STYLES.standard}
            placeholder="Например: 2 или 1.5"
          />
        </div>
      </div>
    </div>
  );
};
