/**
 * Dropdown picker для выбора типа цели
 * 
 * Используется в измеримых привычках для определения, является ли цель
 * минимальным или максимальным значением (не меньше / не больше).
 * 
 * @module modules/habit-tracker/features/habits/components/manage/TargetTypePicker
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - мигрировано на Dropdown конструктор ⭐
 */

import React from 'react';
import { ChevronDown } from '@/shared/icons';
import { Dropdown } from '@/shared/constructors/dropdown';

interface TargetTypePickerProps {
  selectedTargetType: 'min' | 'max';
  onSelectTargetType: (type: 'min' | 'max') => void;
  /** Опциональное внешнее управление состоянием */
  isOpen?: boolean;
  onToggle?: () => void;
}

export const TargetTypePicker: React.FC<TargetTypePickerProps> = ({
  selectedTargetType,
  onSelectTargetType,
  isOpen,
  onToggle,
}) => {
  const handleSelect = (type: 'min' | 'max') => {
    onSelectTargetType(type);
  };

  return (
    <Dropdown.Root isOpen={isOpen} onToggle={onToggle}>
      <Dropdown.Trigger className="w-full px-3 py-2 border border-gray-200 rounded hover:border-gray-300 transition-colors text-sm text-left flex items-center gap-2 text-gray-900">
        <span className="flex-1">
          {selectedTargetType === 'min' ? 'Не меньше' : 'Не больше'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item
          selected={selectedTargetType === 'min'}
          onClick={() => handleSelect('min')}
        >
          Не меньше
        </Dropdown.Item>
        <Dropdown.Item
          selected={selectedTargetType === 'max'}
          onClick={() => handleSelect('max')}
        >
          Не больше
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};