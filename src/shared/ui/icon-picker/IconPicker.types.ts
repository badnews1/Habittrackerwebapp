/**
 * IconPicker Types — Типы для пикера иконок
 */

import type { ReactNode } from 'react';

/** Props для компонента IconPicker */
export interface IconPickerProps {
  /** Ключ выбранной иконки */
  value: string;
  /** Callback при выборе иконки */
  onChange: (iconKey: string) => void;
  /** Controlled состояние открытия */
  open?: boolean;
  /** Callback изменения состояния открытия */
  onOpenChange?: (open: boolean) => void;
  /** Кастомный триггер */
  children?: ReactNode;
  /** CSS класс */
  className?: string;
}
