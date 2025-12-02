/**
 * 🎨 Modal — Универсальная система модальных окон
 * 
 * Композитная система модальных окон в стиле Radix UI / shadcn.
 * Поддерживает различные уровни z-index, размеры и полную кастомизацию.
 * 
 * @example
 * ```tsx
 * <Modal.Root level="dialog" onClose={handleClose}>
 *   <Modal.Backdrop onClick={handleClose} />
 *   <Modal.Content size="md">
 *     <Modal.Header 
 *       title="Заголовок" 
 *       subtitle="Опциональный подзаголовок"
 *       onClose={handleClose} 
 *     />
 *     <div className="p-6">Контент</div>
 *     <Modal.Footer>
 *       <Button onClick={handleClose}>Закрыть</Button>
 *     </Modal.Footer>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 * 
 * @module shared/ui/modal
 * @created 19 ноября 2025
 * @migrated 26 ноября 2025 (в /shared/ui/)
 * @updated 1 декабря 2025 - перенесены стили внутрь компонента
 * @updated 1 декабря 2025 - встроен Separator в Header и Footer (автоматическая консистентность)
 */

import React, { useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from '@/shared/assets/icons/system';
import { Separator } from '@/components/ui/separator';
import type {
  ModalRootProps,
  ModalBackdropProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalFooterProps,
  ModalCloseButtonProps,
} from './Modal.types';

import { useTranslation } from 'react-i18next';

// ============================================
// КОНСТАНТЫ СТИЛЕЙ
// ============================================

/**
 * Z-index уровни для модальных окон (из CSS-переменных)
 */
const Z_INDEX_STYLES = {
  /** Базовый уровень модальных окон */
  modal: { zIndex: 'var(--z-modal)' },
  /** Диалоги поверх модалок */
  dialog: { zIndex: 'var(--z-popover)' },
  /** Вложенные модалки (например, FrequencyModal внутри AddHabitModal) */
  nested: { zIndex: 'var(--z-modal-nested)' },
} as const;

/**
 * Базовые стили для частей модального окна
 */
const MODAL_STYLES = {
  /** Центрирование модального окна */
  center: 'fixed inset-0 flex items-center justify-center',
  
  /** Полупрозрачный фон (backdrop) - использует --bg-backdrop из globals.css с размытием */
  backdrop: 'fixed inset-0 bg-[var(--bg-backdrop)] backdrop-blur-sm',
  
  /** Заголовок модального окна */
  header: 'flex items-center justify-between px-6 pt-6 pb-4',
  
  /** Футер модального окна */
  footer: 'flex items-center justify-end gap-3 px-6 py-4',
} as const;

/**
 * Размеры модальных окон
 */
const MODAL_SIZES = {
  xs: 'w-full max-w-[340px]',
  sm: 'w-full max-w-[400px]',
  md: 'w-full max-w-[500px]',
  lg: 'w-full max-w-[600px]',
  xl: 'w-full max-w-[700px]',
  '2xl': 'w-full max-w-[800px]',
  '4xl': 'w-full max-w-[1000px]',
  '6xl': 'w-full max-w-[1200px]',
} as const;

/**
 * Получить классы для контента модального окна
 * 
 * Фон модального окна использует --bg-primary (основной фон приложения)
 * для полной поддержки светлой и темной темы.
 * Скругление rounded-md соответствует кнопкам (--radius-md)
 */
function getModalContentClasses(size: keyof typeof MODAL_SIZES = 'md'): string {
  return `relative bg-[var(--bg-primary)] rounded-md shadow-lg ${MODAL_SIZES[size]}`;
}

// ============================================
// MODAL ROOT
// ============================================

/**
 * Корневой контейнер модального окна
 * 
 * Возможности:
 * - Управляет z-index уровнями (modal/dialog/nested)
 * - Обрабатывает ESC клавишу для закрытия
 * - Центрирует содержимое
 * - Создаёт Portal в document.body
 * 
 * @param props - ModalRootProps
 */
function ModalRoot({ 
  children, 
  level = 'modal', 
  onClose,
  className = ''
}: ModalRootProps) {
  // Обработка ESC клавиши для закрытия модалки
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

  // Получаем z-index стиль в зависимости от уровня
  const zIndexStyle = {
    modal: Z_INDEX_STYLES.modal,
    dialog: Z_INDEX_STYLES.dialog,
    nested: Z_INDEX_STYLES.nested,
  }[level];

  const modalContent = (
    <div 
      className={`${MODAL_STYLES.center} ${className}`} 
      style={zIndexStyle}
      data-modal="true" 
      data-modal-level={level}
    >
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
 * 
 * Стиль: bg-white/40 с backdrop-blur
 * 
 * @param props - ModalBackdropProps
 */
const ModalBackdrop = React.memo(function ModalBackdrop({ onClick }: ModalBackdropProps) {
  return (
    <div 
      className={MODAL_STYLES.backdrop} 
      onClick={onClick}
      aria-hidden="true"
    />
  );
});

// ============================================
// MODAL CONTENT
// ============================================

/**
 * Контент модального окна (белое окно)
 * 
 * Возможности:
 * - Белый фон с rounded-[20px]
 * - Настраиваемый размер (sm/md/lg/xl/2xl/4xl/6xl)
 * - Останавливает всплытие клика (не закрывается при клике внутри)
 * - Accessibility атрибуты (role="dialog", aria-modal="true")
 * - Поддержка forwardRef для измерения размеров или анимаций
 * 
 * @param props - ModalContentProps
 */
const ModalContent = React.memo(
  forwardRef<HTMLDivElement, ModalContentProps>(function ModalContent(
    { 
      children, 
      size = 'md',
      className = '',
      onClick
    },
    ref
  ) {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick?.(e);
    };

    return (
      <div 
        ref={ref}
        className={`${getModalContentClasses(size)} ${className}`}
        onClick={handleClick}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    );
  })
);

// ============================================
// MODAL HEADER
// ============================================

/**
 * Заголовок модального окна
 * 
 * Возможности:
 * - Стандартный стиль с автоматическим разделителем снизу
 * - Опциональный подзаголовок
 * - Опциональная кнопка закрытия (✕)
 * - Выравнивание заголовка и кнопки
 * - Опция hideSeparator для отключения разделителя
 * 
 * @param props - ModalHeaderProps
 */
const ModalHeader = React.memo(function ModalHeader({ 
  title, 
  subtitle,
  onClose,
  showCloseButton = true,
  hideSeparator = false
}: ModalHeaderProps) {
  return (
    <>
      <div className={MODAL_STYLES.header}>
        <div className="flex flex-col gap-1">
          <h4 className="text-text-primary">{title}</h4>
          {subtitle && (
            <p className="text-text-secondary">{subtitle}</p>
          )}
        </div>
        {showCloseButton && onClose && (
          <ModalCloseButton onClick={onClose} />
        )}
      </div>
      {!hideSeparator && <Separator />}
    </>
  );
});

// ============================================
// MODAL FOOTER
// ============================================

/**
 * Футер модального окна
 * 
 * Возможности:
 * - Стандартный стиль с автоматическим разделителем сверху
 * - Кастомизируемое содержимое (обычно кнопки)
 * - Опция hideSeparator для отключения разделителя
 * 
 * @param props - ModalFooterProps
 */
const ModalFooter = React.memo(function ModalFooter({ 
  children, 
  className = '',
  hideSeparator = false 
}: ModalFooterProps) {
  return (
    <>
      {!hideSeparator && <Separator />}
      <div className={`${MODAL_STYLES.footer} ${className}`}>
        {children}
      </div>
    </>
  );
});

// ============================================
// MODAL CLOSE BUTTON
// ============================================

/**
 * ModalCloseButton - Кнопка закрытия модального окна
 * @param props - ModalCloseButtonProps
 */
const ModalCloseButton = React.memo(function ModalCloseButton({ onClick, className = '' }: ModalCloseButtonProps) {
  const { t } = useTranslation('ui');
  
  return (
    <button
      onClick={onClick}
      className={`text-text-tertiary hover:text-text-primary transition-colors ${className}`}
      aria-label={t('ui.close')}
    >
      <XIcon size={20} />
    </button>
  );
});

// ============================================
// ЭКСПОРТ
// ============================================

/**
 * Modal — экспорт в виде namespace для удобства использования
 * 
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