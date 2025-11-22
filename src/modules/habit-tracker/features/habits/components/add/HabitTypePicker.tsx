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
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { ChevronDown } from '@/shared/icons';
import { useDropdown } from '@/shared/hooks/use-dropdown';
import type { HabitType } from '../../types';

interface HabitTypePickerProps {
  selectedType: HabitType;
  onSelectType: (type: HabitType) => void;
  /** Controlled состояние открытия dropdown */
  isOpen: boolean;
  /** Колбэк переключения состояния */
  onToggle: () => void;
}

export const HabitTypePicker = React.forwardRef<HTMLDivElement, HabitTypePickerProps>(
  ({ selectedType, onSelectType, isOpen, onToggle }, forwardedRef) => {
    // Используем универсальный хук dropdown в controlled режиме
    const dropdown = useDropdown({
      isOpen,
      onToggle,
    });

    const handleSelect = (type: HabitType) => {
      onSelectType(type);
      dropdown.close();
    };

    // Объединяем внешний ref с внутренним ref из хука
    const combinedRef = (node: HTMLDivElement | null) => {
      // Устанавливаем внутренний ref хука
      (dropdown.ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      
      // Устанавливаем внешний forwarded ref если он есть
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    return (
      <div className="relative" ref={combinedRef} data-picker="type">
        <button
          onClick={dropdown.toggle}
          className="w-full px-3 py-2 border border-gray-200 rounded hover:border-gray-300 transition-colors text-sm text-left flex items-center gap-2 text-gray-900"
        >
          <span className="flex-1">
            {selectedType === 'binary' ? 'Простая отметка' : 'Ввод числа'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Type Picker Dropdown */}
        {dropdown.isOpen && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full overflow-hidden">
            <button
              onClick={() => handleSelect('binary')}
              className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors text-sm ${
                selectedType === 'binary' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              }`}
            >
              <div className="font-medium">Простая отметка</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Для привычек, которые либо выполнены, либо нет.
              </div>
              <div className="text-xs text-gray-500">
                Например: "Заправить постель", "Медитация"
              </div>
            </button>
            <button
              onClick={() => handleSelect('measurable')}
              className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors text-sm border-t border-gray-200 ${
                selectedType === 'measurable' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              }`}
            >
              <div className="font-medium">Ввод числа</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Для привычек, где нужно достичь цели.
              </div>
              <div className="text-xs text-gray-500">
                Например: "Выпить 2л воды", "Прочитать 10 страниц"
              </div>
            </button>
          </div>
        )}
      </div>
    );
  }
);

HabitTypePicker.displayName = 'HabitTypePicker';
