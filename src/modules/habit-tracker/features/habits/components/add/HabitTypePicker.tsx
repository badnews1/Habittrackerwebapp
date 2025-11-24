/**
 * Dropdown picker для выбора типа привычки
 * 
 * Позволяет выбрать между:
 * - Простая отметка (binary) - для привычек, которые либо выполнены, либо нет
 * - Ввод числа (measurable) - для привычек, где нужно достичь числовой цели
 * 
 * Работает ТОЛЬКО в controlled режиме (требует isOpen и onToggle).
 * 
 * @module modules/habit-tracker/features/habits/components/add/HabitTypePicker
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - мигрировано на Dropdown конструктор ⭐
 */

import React from 'react';
import { ChevronDown } from '@/shared/icons';
import { Dropdown } from '@/shared/constructors/dropdown';
import type { HabitType } from '../../types';

interface HabitTypePickerProps {
  selectedType: HabitType;
  onSelectType: (type: HabitType) => void;
  /** Controlled состояние открытия dropdown */
  isOpen: boolean;
  /** Колбэк переключения состояния */
  onToggle: () => void;
}

export const HabitTypePicker: React.FC<HabitTypePickerProps> = ({
  selectedType,
  onSelectType,
  isOpen,
  onToggle,
}) => {
  
  const handleSelect = (type: HabitType) => {
    onSelectType(type);
  };

  return (
    <Dropdown.Root isOpen={isOpen} onToggle={onToggle}>
      <Dropdown.Trigger asChild>
        <button 
          className="w-full px-3 py-2 border border-gray-200 rounded hover:border-gray-300 transition-colors text-sm text-left flex items-center gap-2 text-gray-900"
          type="button"
        >
          <span className="flex-1">
            {selectedType === 'binary' ? 'Простая отметка' : 'Ввод числа'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item
          selected={selectedType === 'binary'}
          onClick={() => handleSelect('binary')}
        >
          <div>
            <div className="font-medium">Простая отметка</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Для привычек, которые либо выполнены, либо нет.
            </div>
            <div className="text-xs text-gray-500">
              Например: "Заправить постель", "Медитация"
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item
          selected={selectedType === 'measurable'}
          onClick={() => handleSelect('measurable')}
        >
          <div>
            <div className="font-medium">Ввод числа</div>
            <div className="text-xs text-gray-500 mt-0.5">
              Для привычек, где нужно достичь цели.
            </div>
            <div className="text-xs text-gray-500">
              Например: "Выпить 2л воды", "Прочитать 10 страниц"
            </div>
          </div>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};