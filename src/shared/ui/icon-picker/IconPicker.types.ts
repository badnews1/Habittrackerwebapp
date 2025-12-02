/**
 * 🎯 IconPicker Types — Типы для пикера иконок
 * 
 * @module shared/ui/icon-picker
 * @created 29 ноября 2025
 */

import type { ReactNode } from 'react';

/**
 * Props для компонента IconPicker
 */
export interface IconPickerProps {
  /** Ключ выбранной иконки */
  value: string;
  
  /** Callback при выборе иконки */
  onChange: (iconKey: string) => void;
  
  /** Controlled состояние открытия */
  open?: boolean;
  
  /** Callback изменения состояния открытия */
  onOpenChange?: (open: boolean) => void;
  
  /** Кастомный триггер (опционально) */
  children?: ReactNode;
  
  /** Дополнительный CSS класс */
  className?: string;
}
