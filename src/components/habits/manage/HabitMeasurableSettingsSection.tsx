import React, { useState } from 'react';
import { UnitPicker } from './UnitPicker';
import { TargetTypePicker } from './TargetTypePicker';
import { INPUT_STYLES } from '../../../constants/styles';

interface HabitMeasurableSettingsSectionProps {
  habitId: string;
  unit: string;
  targetValue: number | undefined;
  targetType: 'min' | 'max';
  onUpdateMeasurableSettings: (
    id: string,
    settings: { unit?: string; targetValue?: number; targetType?: 'min' | 'max' }
  ) => void;
}

/**
 * Settings section for measurable habits
 * Includes unit picker, target type picker, and target value input
 */
export const HabitMeasurableSettingsSection: React.FC<HabitMeasurableSettingsSectionProps> = ({
  habitId,
  unit,
  targetValue,
  targetType,
  onUpdateMeasurableSettings,
}) => {
  const [editedUnit, setEditedUnit] = useState(unit);
  const [editedTargetValue, setEditedTargetValue] = useState(targetValue?.toString() || '');
  const [editedTargetType, setEditedTargetType] = useState<'min' | 'max'>(targetType);

  const handleUnitChange = (newUnit: string) => {
    setEditedUnit(newUnit);
    onUpdateMeasurableSettings(habitId, {
      unit: newUnit,
      targetValue: editedTargetValue ? parseFloat(editedTargetValue) : undefined,
      targetType: editedTargetType,
    });
  };

  const handleTargetTypeChange = (newTargetType: 'min' | 'max') => {
    setEditedTargetType(newTargetType);
    onUpdateMeasurableSettings(habitId, {
      unit: editedUnit,
      targetValue: editedTargetValue ? parseFloat(editedTargetValue) : undefined,
      targetType: newTargetType,
    });
  };

  const handleTargetValueBlur = () => {
    onUpdateMeasurableSettings(habitId, {
      unit: editedUnit,
      targetValue: editedTargetValue ? parseFloat(editedTargetValue) : undefined,
      targetType: editedTargetType,
    });
  };

  return (
    <div className="mt-3 pb-3 border-b border-gray-100 space-y-3">
      {/* Unit Picker */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Единица измерения</label>
        <UnitPicker selectedUnit={editedUnit} onSelectUnit={handleUnitChange} />
      </div>

      {/* Target Type and Target Value */}
      <div className="grid grid-cols-2 gap-3">
        {/* Target Type Picker */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Тип цели</label>
          <TargetTypePicker
            selectedTargetType={editedTargetType}
            onSelectTargetType={handleTargetTypeChange}
          />
        </div>

        {/* Target Value Input */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Цель</label>
          <input
            type="text"
            inputMode="decimal"
            value={editedTargetValue}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numbers and decimal point
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setEditedTargetValue(value);
              }
            }}
            onBlur={handleTargetValueBlur}
            className={INPUT_STYLES.standard}
            placeholder="Например: 2 или 1.5"
          />
        </div>
      </div>
    </div>
  );
};