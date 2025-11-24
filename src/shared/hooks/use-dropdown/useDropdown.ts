import { useState, useRef, useCallback, useEffect } from 'react';
import { useClickOutside } from '@/shared/hooks/use-click-outside';

/**
 * Опции для хука useDropdown
 */
interface UseDropdownOptions {
  /**
   * Внешнее управление состоянием открытия/закрытия
   * Если передано, компонент работает в controlled режиме
   */
  isOpen?: boolean;
  
  /**
   * Функция переключения состояния при внешнем управлении
   * Вызывается при toggle(), а также при закрытии через clickOutside
   */
  onToggle?: () => void;
  
  /**
   * Колбэк, вызываемый при закрытии dropdown
   * Полезно для сброса внутреннего состояния (pagination, форм и т.д.)
   */
  onClose?: () => void;
  
  /**
   * Включить/отключить закрытие при клике вне dropdown
   * По умолчанию: true для uncontrolled, false для controlled
   */
  closeOnClickOutside?: boolean;
}

/**
 * Возвращаемое значение хука useDropdown
 */
interface UseDropdownReturn {
  /**
   * Текущее состояние открытия dropdown
   * Управляется либо внешне (через isOpen prop), либо внутренне
   */
  isOpen: boolean;
  
  /**
   * Переключение состояния открыт/закрыт
   */
  toggle: () => void;
  
  /**
   * Открыть dropdown
   */
  open: () => void;
  
  /**
   * Закрыть dropdown
   */
  close: () => void;
  
  /**
   * Ref для контейнера dropdown
   * Должен быть прикреплён к корневому элементу dropdown компонента
   */
  ref: React.RefObject<HTMLDivElement>;
  
  /**
   * Флаг controlled режима
   * true если isOpen/onToggle переданы извне
   */
  isControlled: boolean;
}

/**
 * Универсальный хук для управления dropdown состоянием
 * 
 * @description
 * Устраняет дублирование логики в Picker компонентах (IconPicker, CategoryPicker,
 * UnitPicker, TargetTypePicker, HabitTypePicker) - экономия ~750 строк кода.
 * 
 * Поддерживает два режима работы:
 * 
 * **1. Uncontrolled (по умолчанию):** внутреннее управление состоянием
 *    - Использует внутренний useState
 *    - Автоматически закрывается при клике вне dropdown
 *    - Вызывает onClose при закрытии
 * 
 * **2. Controlled:** внешнее управление состоянием
 *    - Требует передачи isOpen и onToggle
 *    - Родительский компонент полностью контролирует состояние
 *    - onToggle вызывается при toggle() и при клике вне (если closeOnClickOutside=true)
 * 
 * @example
 * // Uncontrolled использование (внутреннее состояние)
 * const dropdown = useDropdown({
 *   onClose: () => setCurrentPage(0) // Опциональный сброс состояния
 * });
 * 
 * return (
 *   <div ref={dropdown.ref}>
 *     <button onClick={dropdown.toggle}>Toggle</button>
 *     {dropdown.isOpen && <div>Dropdown content</div>}
 *   </div>
 * );
 * 
 * @example
 * // Controlled использование (внешнее состояние)
 * const [isOpen, setIsOpen] = useState(false);
 * const dropdown = useDropdown({
 *   isOpen,
 *   onToggle: () => setIsOpen(!isOpen),
 *   closeOnClickOutside: true // Опционально: закрывать при клике вне
 * });
 * 
 * return (
 *   <div ref={dropdown.ref}>
 *     <button onClick={dropdown.toggle}>Toggle</button>
 *     {dropdown.isOpen && <div>Dropdown content</div>}
 *   </div>
 * );
 * 
 * @since 19 ноября 2025
 * @updated 22 ноября 2025 - добавлена поддержка Escape для закрытия dropdown
 * 
 * @param options - Опции конфигурации хука
 * @returns Объект с состоянием и методами управления dropdown
 */
export function useDropdown(options: UseDropdownOptions = {}): UseDropdownReturn {
  const {
    isOpen: externalIsOpen,
    onToggle: externalOnToggle,
    onClose,
    closeOnClickOutside,
  } = options;
  
  // Внутреннее состояние как fallback
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Определяем, controlled или uncontrolled режим
  const isControlled = externalIsOpen !== undefined && externalOnToggle !== undefined;
  
  // Используем внешнее состояние если передано, иначе внутреннее
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  
  // Toggle функция
  const toggle = useCallback(() => {
    if (isControlled) {
      externalOnToggle?.();
    } else {
      setInternalIsOpen(prev => !prev);
    }
  }, [isControlled, externalOnToggle]);
  
  // Функция открытия
  const open = useCallback(() => {
    if (isControlled && externalOnToggle && !externalIsOpen) {
      externalOnToggle();
    } else if (!isControlled) {
      setInternalIsOpen(true);
    }
  }, [isControlled, externalOnToggle, externalIsOpen]);
  
  // Функция закрытия
  const close = useCallback(() => {
    if (isControlled && externalOnToggle && externalIsOpen) {
      externalOnToggle();
    } else if (!isControlled) {
      setInternalIsOpen(false);
    }
    
    // Вызываем onClose колбэк если передан
    onClose?.();
  }, [isControlled, externalOnToggle, externalIsOpen, onClose]);
  
  // Определяем, нужно ли закрывать при клике вне
  // По умолчанию: true для uncontrolled, определяется опцией для controlled
  const shouldCloseOnClickOutside = closeOnClickOutside !== undefined 
    ? closeOnClickOutside 
    : !isControlled;
  
  // Закрытие при клике снаружи
  useClickOutside(
    ref,
    () => {
      if (isOpen) {
        close();
      }
    },
    shouldCloseOnClickOutside
  );
  
  // Закрытие при нажатии Escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);
  
  return {
    isOpen,
    toggle,
    open,
    close,
    ref,
    isControlled,
  };
}

// Экспортируем типы для использования в других файлах
export type { UseDropdownOptions, UseDropdownReturn };