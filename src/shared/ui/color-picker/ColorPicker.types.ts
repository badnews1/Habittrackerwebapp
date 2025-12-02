/**
 * 🎨 ColorPicker — типы для компонента выбора цвета
 * 
 * @module shared/ui/color-picker
 * @created 28 ноября 2025
 */

import type { ColorVariant } from '@/shared/constants/colors';

/**
 * Пропсы компонента ColorPicker
 */
export interface ColorPickerProps {
  /**
   * Текущий выбранный цвет
   * @example 'blue'
   */
  value: ColorVariant;
  
  /**
   * Колбэк при изменении цвета
   * @param color - Новый выбранный цвет
   */
  onChange: (color: ColorVariant) => void;
  
  /**
   * Open состояние (controlled)
   */
  open?: boolean;
  
  /**
   * Колбэк при изменении open состояния
   */
  onOpenChange?: (open: boolean) => void;
  
  /**
   * Кастомный триггер (кнопка)
   * Если не передан, используется дефолтная цветная кнопка
   */
  children?: React.ReactNode;
  
  /**
   * Дополнительный CSS класс для триггера (если используется дефолтная кнопка)
   */
  className?: string;
}
