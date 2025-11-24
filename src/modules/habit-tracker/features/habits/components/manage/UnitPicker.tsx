/**
 * Dropdown picker для выбора единиц измерения
 * 
 * Используется в измеримых привычках для выбора единицы измерения.
 * Поддерживает внутреннее и внешнее управление состоянием.
 * 
 * ОБНОВЛЕНИЕ 22 ноября 2025:
 * ✅ Мигрировано на Dropdown конструктор
 * ✅ Добавлена группировка единиц по категориям (ОГРОМНОЕ UX улучшение!)
 * ✅ 22 единицы разбиты на 4 логические группы (было: плоский список)
 * 
 * @module modules/habit-tracker/features/habits/components/manage/UnitPicker
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - мигрировано на Dropdown конструктор с группировкой ⭐
 */

import React from 'react';
import { ChevronDown } from '@/shared/icons';
import { Dropdown } from '@/shared/constructors/dropdown';
import { UNIT_OPTIONS } from '@/modules/habit-tracker/shared/constants/units';

interface UnitPickerProps {
  selectedUnit: string;
  onSelectUnit: (unit: string) => void;
  /** Опциональное внешнее управление состоянием */
  isOpen?: boolean;
  onToggle?: () => void;
}

// Группировка единиц измерения для улучшения UX
const UNIT_GROUPS = [
  {
    label: 'Счёт',
    units: ['разы', 'штуки', 'баллы', 'подходы', 'задачи'],
  },
  {
    label: 'Время',
    units: ['минуты', 'часы'],
  },
  {
    label: 'Расстояние и движение',
    units: ['шаги', 'километры', 'метры'],
  },
  {
    label: 'Здоровье и питание',
    units: ['калории', 'килограммы', 'граммы', 'стаканы', 'литры', 'милилитры', 'порции', 'чашки'],
  },
  {
    label: 'Чтение и обучение',
    units: ['страницы', 'слова', 'главы'],
  },
  {
    label: 'Финансы',
    units: ['руб.', '$', '€'],
  },
] as const;

export const UnitPicker: React.FC<UnitPickerProps> = ({
  selectedUnit,
  onSelectUnit,
  isOpen,
  onToggle,
}) => {
  const handleSelect = (unit: string) => {
    onSelectUnit(unit);
  };

  return (
    <Dropdown.Root isOpen={isOpen} onToggle={onToggle}>
      <Dropdown.Trigger
        className={`w-full px-3 py-2 border border-gray-200 rounded hover:border-gray-300 transition-colors text-sm text-left flex items-center gap-2 ${
          selectedUnit ? 'text-gray-900' : 'text-gray-400'
        }`}
      >
        <span className="flex-1">
          {selectedUnit || 'Выберите единицу измерения'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </Dropdown.Trigger>

      <Dropdown.Content>
        {UNIT_GROUPS.map((group) => (
          <Dropdown.Group key={group.label} label={group.label}>
            {group.units.map((unit) => (
              <Dropdown.Item
                key={unit}
                selected={selectedUnit === unit}
                onClick={() => handleSelect(unit)}
              >
                {unit}
              </Dropdown.Item>
            ))}
          </Dropdown.Group>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};