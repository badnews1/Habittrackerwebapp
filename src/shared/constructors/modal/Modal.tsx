import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Close } from '@/shared/icons';
import { 
  MODAL_STYLES, 
  getModalContentClasses, 
  Z_INDEX 
} from '@/shared/constants/styles';

/**
 * 🎨 UNIVERSAL MODAL SYSTEM
 * Композитная система модальных окон в стиле Radix UI / shadcn
 * 
 * Использование:
 * ```tsx
 * <Modal.Root level="dialog" onClose={handleClose}>
 *   <Modal.Backdrop onClick={handleClose} />
 *   <Modal.Content size="md">
 *     <Modal.Header title="Заголовок" onClose={handleClose} />
 *     <div className="p-6">Контент</div>
 *     <Modal.Footer>
 *       <Button>Кнопки</Button>
 *     </Modal.Footer>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 * 
 * Дата создания: 19 ноября 2025
 * Дата миграции: 21 ноября 2025
 */

// ============================================
// TYPES
// ============================================

type ModalLevel = 'modal' | 'dialog' | 'nested';
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';

interface ModalRootProps {
  children: ReactNode;
  level?: ModalLevel;
  onClose?: () => void;
  className?: string;
}

interface ModalBackdropProps {
  onClick?: () => void;
}

interface ModalContentProps {
  children: ReactNode;
  size?: ModalSize;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

interface ModalCloseButtonProps {
  onClick: () => void;
  className?: string;
}

// ============================================
// MODAL ROOT
// ============================================

/**
 * Корневой контейнер модального окна
 * - Управляет z-index (modal/dialog/nested)
 * - Обрабатывает ESC клавишу для закрытия
 * - Центрирует содержимое
 * - Создаёт Portal в document.body
 */
function ModalRoot({ 
  children, 
  level = 'modal', 
  onClose,
  className = ''
}: ModalRootProps) {
  // Обработка ESC клавиши
  useEffect(() => {
    if (!onClose) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Получаем z-index в зависимости от уровня
  const zIndex = {
    modal: Z_INDEX.modal,
    dialog: Z_INDEX.dialog,
    nested: Z_INDEX.nested,
  }[level];

  const modalContent = (
    <div className={`${MODAL_STYLES.center} ${zIndex} ${className}`}>
      {children}
    </div>
  );

  // Рендерим через Portal в document.body
  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}

// ============================================
// MODAL BACKDROP
// ============================================

/**
 * Полупрозрачный фон модального окна
 * - bg-white/40 с backdrop-blur
 * - Опциональный обработчик клика для закрытия
 */
function ModalBackdrop({ onClick }: ModalBackdropProps) {
  return (
    <div 
      className={MODAL_STYLES.backdrop} 
      onClick={onClick}
      aria-hidden="true"
    />
  );
}

// ============================================
// MODAL CONTENT
// ============================================

/**
 * Контент модального окна (белое окно)
 * - Белый фон с rounded-[20px]
 * - Настраиваемый размер (sm/md/lg/xl/2xl/4xl/6xl)
 * - Останавливает всплытие клика (чтобы не закрывать при клике внутри)
 */
function ModalContent({ 
  children, 
  size = 'md',
  className = '',
  onClick
}: ModalContentProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <div 
      className={`${getModalContentClasses(size)} ${className}`}
      onClick={handleClick}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}

// ============================================
// MODAL HEADER
// ============================================

/**
 * Заголовок модального окна
 * - Стандартный стиль с border-b
 * - Опциональная кнопка закрытия (✕)
 * - Выравнивание заголовка и кнопки
 */
function ModalHeader({ 
  title, 
  onClose,
  showCloseButton = true 
}: ModalHeaderProps) {
  return (
    <div className={MODAL_STYLES.header}>
      <h4 className="text-gray-900">{title}</h4>
      {showCloseButton && onClose && (
        <ModalCloseButton onClick={onClose} />
      )}
    </div>
  );
}

// ============================================
// MODAL FOOTER
// ============================================

/**
 * Футер модального окна
 * - Стандартный стиль с border-t
 * - Кастомизируемое содержимое (обычно кнопки)
 */
function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`${MODAL_STYLES.footer} ${className}`}>
      {children}
    </div>
  );
}

// ============================================
// MODAL CLOSE BUTTON
// ============================================

/**
 * Кнопка закрытия модального окна (✕)
 * - Минималистичный стиль Jony Ive
 * - Hover эффект
 */
function ModalCloseButton({ onClick, className = '' }: ModalCloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-gray-400 hover:text-gray-900 transition-colors ${className}`}
      aria-label="Закрыть"
    >
      <Close size={20} />
    </button>
  );
}

// ============================================
// NAMESPACE EXPORT
// ============================================

/**
 * Экспорт в виде namespace для удобства использования
 * Позволяет писать: Modal.Root, Modal.Backdrop, Modal.Content и т.д.
 */
export const Modal = {
  Root: ModalRoot,
  Backdrop: ModalBackdrop,
  Content: ModalContent,
  Header: ModalHeader,
  Footer: ModalFooter,
  CloseButton: ModalCloseButton,
};
