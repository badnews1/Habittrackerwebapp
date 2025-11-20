import React from 'react';
import { ChevronDown } from '../../icons';
import { useDropdown } from '../../../hooks/useDropdown';
import { UNIT_OPTIONS } from '../../../constants/units';

interface UnitPickerProps {
  selectedUnit: string;
  onSelectUnit: (unit: string) => void;
  /** Опциональное внешнее управление состоянием */
  isOpen?: boolean;
  onToggle?: () => void;
}

/**
 * Dropdown picker для выбора единиц измерения
 * 
 * Используется в измеримых привычках для выбора единицы измерения.
 * 
 * Поддерживает как внутреннее, так и внешнее управление состоянием:
 * - Внутреннее: просто передайте selectedUnit и onSelectUnit
 * - Внешнее: также передайте isOpen и onToggle для полного контроля
 * 
 * Дата создания: 19 ноября 2024
 * Дата рефакторинга: 19 ноября 2025 (использует useDropdown хук)
 */
export const UnitPicker: React.FC<UnitPickerProps> = ({
  selectedUnit,
  onSelectUnit,
  isOpen,
  onToggle,
}) => {
  // Используем универсальный хук dropdown
  const dropdown = useDropdown({
    isOpen,
    onToggle,
  });

  const handleSelect = (unit: string) => {
    onSelectUnit(unit);
    dropdown.close();
  };

  return (
    <div className="relative" ref={dropdown.ref} data-picker="unit">
      <button
        onClick={dropdown.toggle}
        className={`w-full px-3 py-2 border border-gray-200 rounded hover:border-gray-300 transition-colors text-sm text-left flex items-center gap-2 ${
          selectedUnit ? 'text-gray-900' : 'text-gray-400'
        }`}
      >
        <span className="flex-1">
          {selectedUnit || 'Выберите единицу измерения'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {dropdown.isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-h-[200px] overflow-y-auto">
          {UNIT_OPTIONS.map((unitOption) => (
            <button
              key={unitOption}
              onClick={() => handleSelect(unitOption)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm ${
                selectedUnit === unitOption ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              }`}
            >
              {unitOption}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
