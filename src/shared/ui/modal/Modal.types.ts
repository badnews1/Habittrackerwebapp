/**
 * Типы для Modal компонента
 */

import type { ReactNode } from 'react';

/**
 * Уровень z-index модального окна
 * - modal: базовый уровень (z-50)
 * - dialog: диалоги поверх модалок (z-60)
 * - nested: вложенные модалки (z-70)
 */
export type ModalLevel = 'modal' | 'dialog' | 'nested';

/**
 * Размер модального окна
 * - xs: 340px
 * - sm: 400px
 * - md: 500px (default)
 * - lg: 600px
 * - xl: 700px
 * - 2xl: 800px
 * - 4xl: 1000px
 * - 6xl: 1200px
 */
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';

/** Пропсы для Modal.Root */
export interface ModalRootProps {
  /** Содержимое модального окна */
  children: ReactNode;
  /** Уровень z-index */
  level?: ModalLevel;
  /** Callback при закрытии (ESC клавиша) */
  onClose?: () => void;
  /** CSS классы */
  className?: string;
}

/** Пропсы для Modal.Backdrop */
export interface ModalBackdropProps {
  /** Callback при клике на backdrop */
  onClick?: () => void;
}

/** Пропсы для Modal.Content */
export interface ModalContentProps {
  /** Содержимое модального окна */
  children: ReactNode;
  /** Размер модального окна */
  size?: ModalSize;
  /** CSS классы */
  className?: string;
  /** Callback при клике */
  onClick?: (e: React.MouseEvent) => void;
}

/** Пропсы для Modal.Header */
export interface ModalHeaderProps {
  /** Заголовок модального окна */
  title: string;
  /** Подзаголовок */
  subtitle?: string | ReactNode;
  /** Callback при нажатии на кнопку закрытия */
  onClose?: () => void;
  /** Показывать ли кнопку закрытия (✕) */
  showCloseButton?: boolean;
  /** Скрыть автоматический разделитель снизу */
  hideSeparator?: boolean;
}

/** Пропсы для Modal.Footer */
export interface ModalFooterProps {
  /** Содержимое футера */
  children: ReactNode;
  /** CSS классы */
  className?: string;
  /** Скрыть автоматический разделитель сверху */
  hideSeparator?: boolean;
}

/** Пропсы для Modal.CloseButton */
export interface ModalCloseButtonProps {
  /** Callback при нажатии на кнопку */
  onClick: () => void;
  /** CSS классы */
  className?: string;
}
