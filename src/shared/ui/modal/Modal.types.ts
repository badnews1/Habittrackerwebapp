/**
 * Типы для Modal компонента
 * 
 * @module shared/ui/modal
 * @created 26 ноября 2025
 */

import type { ReactNode } from 'react';

// ============================================
// ENUMS & TYPES
// ============================================

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

// ============================================
// COMPONENT PROPS
// ============================================

/**
 * Пропсы для Modal.Root
 */
export interface ModalRootProps {
  /** Содержимое модального окна */
  children: ReactNode;
  /** Уровень z-index */
  level?: ModalLevel;
  /** Callback при закрытии (ESC клавиша) */
  onClose?: () => void;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Пропсы для Modal.Backdrop
 */
export interface ModalBackdropProps {
  /** Callback при клике на backdrop (обычно закрывает модалку) */
  onClick?: () => void;
}

/**
 * Пропсы для Modal.Content
 */
export interface ModalContentProps {
  /** Содержимое модального окна */
  children: ReactNode;
  /** Размер модального окна */
  size?: ModalSize;
  /** Дополнительные CSS классы */
  className?: string;
  /** Callback при клике (используется редко) */
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Пропсы для Modal.Header
 */
export interface ModalHeaderProps {
  /** Заголовок модального окна */
  title: string;
  /** Подзаголовок модального окна (опционально) */
  subtitle?: string | ReactNode;
  /** Callback при нажатии на кнопку закрытия */
  onClose?: () => void;
  /** Показывать ли кнопку закрытия (✕) */
  showCloseButton?: boolean;
  /** Скрыть автоматический разделитель снизу */
  hideSeparator?: boolean;
}

/**
 * Пропсы для Modal.Footer
 */
export interface ModalFooterProps {
  /** Содержимое футера (обычно кнопки) */
  children: ReactNode;
  /** Дополнительные CSS классы */
  className?: string;
  /** Скрыть автоматический разделитель сверху */
  hideSeparator?: boolean;
}

/**
 * Пропсы для Modal.CloseButton
 */
export interface ModalCloseButtonProps {
  /** Callback при нажатии на кнопку */
  onClick: () => void;
  /** Дополнительные CSS классы */
  className?: string;
}
