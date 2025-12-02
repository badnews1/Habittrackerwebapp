/**
 * 🎯 UnitPicker Types — Типы для пикера единиц измерения
 * 
 * @module shared/ui/unit-picker
 * @created 29 ноября 2025
 */

/**
 * Props для компонента UnitPicker
 */
export interface UnitPickerProps {
  /** Выбранная единица измерения */
  value: string;
  
  /** Callback при выборе единицы */
  onChange: (unit: string) => void;
  
  /** Группы единиц для отображения */
  groups: UnitGroup[];
  
  /** Placeholder текст когда не выбрано */
  placeholder?: string;
  
  /** Дополнительный CSS класс */
  className?: string;
  
  /** Disabled состояние */
  disabled?: boolean;
}

/**
 * Группа единиц измерения
 */
export interface UnitGroup {
  /** Название группы */
  label: string;
  
  /** Единицы в группе */
  units: readonly string[];
}
