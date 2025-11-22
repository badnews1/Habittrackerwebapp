/**
 * Dropdown picker для выбора типа цели
 * 
 * Используется в измеримых привычках для определения, является ли цель
 * минимальным или максимальным значением (не меньше / не больше).
 * 
 * @module modules/habit-tracker/features/habits/components/manage/TargetTypePicker
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { ChevronDown } from '@/shared/icons';
import { useDropdown } from '@/shared/hooks/use-dropdown';

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
  // Используем универсальный хук dropdown
  const dropdown = useDropdown({
    isOpen,
    onToggle,
  });

  const handleSelect = (type: 'min' | 'max') => {
    onSelectTargetType(type);
    dropdown.close();
  };

  return (
    <div className="relative" ref={dropdown.ref} data-picker="targetType">
      <button
        onClick={dropdown.toggle}
        className="w-full px-3 py-2 border border-gray-200 rounded hover:border-gray-300 transition-colors text-sm text-left flex items-center gap-2 text-gray-900"
      >
        <span className="flex-1">
          {selectedTargetType === 'min' ? 'Не меньше' : 'Не больше'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {dropdown.isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full overflow-hidden">
          <button
            onClick={() => handleSelect('min')}
            className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm ${
              selectedTargetType === 'min' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            }`}
          >
            Не меньше
          </button>
          <button
            onClick={() => handleSelect('max')}
            className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm border-t border-gray-200 ${
              selectedTargetType === 'max' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            }`}
          >
            Не больше
          </button>
        </div>
      )}
    </div>
  );
};
