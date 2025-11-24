/**
 * Универсальный конструктор dropdown меню
 * 
 * Композитный компонент на основе паттерна Context + Compound Components.
 * Устраняет дублирование ~400 строк dropdown логики в проекте.
 * 
 * КОМПОНЕНТЫ:
 * - Dropdown.Root: Контейнер с контекстом
 * - Dropdown.Trigger: Кнопка-триггер
 * - Dropdown.Content: Выпадающее меню
 * - Dropdown.Item: Элемент меню
 * - Dropdown.Separator: Разделитель
 * - Dropdown.Search: Поисковый input
 * - Dropdown.Empty: EmptyState для "Ничего не найдено"
 * - Dropdown.Label: Заголовок группы
 * - Dropdown.Group: Группа элементов
 * - Dropdown.useContext: Хук для доступа к контексту (close, toggle, etc.)
 * 
 * ОСОБЕННОСТИ:
 * - Controlled/Uncontrolled режимы через useDropdown
 * - Click outside для закрытия с поддержкой вложенных dropdown (через уникальные ID)
 * - Portal рендеринг (createPortal в document.body)
 * - Fixed позиционирование (не обрезается overflow: hidden)
 * - Динамический responsive maxHeight (8rem - 15rem в зависимости от viewport)
 * - closeOnSelect поддержка (для multi-select пикеров)
 * - Поиск и фильтрация (Search + keywords prop для расширенного поиска)
 * - Группировка элементов (Group + Label) для больших списков (22+ элемента)
 * - EmptyState (Empty) для отображения "Ничего не найдено"
 * - Клавиатурная навигация:
 *   • Escape - закрыть (или очистить search если активен)
 *   • ArrowUp/ArrowDown - навигация между элементами (включая из Search)
 *   • Home/End - переход к первому/последнему элементу
 *   • Typeahead - быстрый переход по первым буквам (например "К" → "км")
 * - Focus management (автофокус на первый элемент/Search, возврат на триггер)
 *   ⚠️ Focus trap НЕ реализован (Tab/Shift+Tab могут выйти за пределы)
 * - ARIA атрибуты для accessibility
 * - Гибкое позиционирование (up/down)
 * - Адаптивная ширина
 * 
 * @module shared/constructors/dropdown
 * @created 22 ноября 2025
 * @updated 23 ноября 2025 - добавлен enableTypeahead prop для отключения typeahead navigation
 * @updated 23 ноября 2025 - добавлена поддержка вложенных dropdown через уникальные ID (useId)
 */

import React, { createContext, useContext, useRef, useEffect, RefObject, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { useDropdown } from '@/shared/hooks/use-dropdown';
import { Search, X } from '@/shared/icons';

// ==================== TYPES ====================

interface DropdownContextValue {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  triggerRef: RefObject<HTMLButtonElement>;
  closeOnSelect: boolean;
  enableTypeahead: boolean;
  dropdownId: string; // Уникальный ID для идентификации вложенных dropdown
}

export interface DropdownRootProps {
  children: React.ReactNode;
  /** Controlled режим: текущее состояние открытия */
  isOpen?: boolean;
  /** Controlled режим: колбэк переключения */
  onToggle?: () => void;
  /** Колбэк при закрытии (для сброса состояния) */
  onClose?: () => void;
  /** Закрывать ли при клике вне (по умолчанию: true для uncontrolled) */
  closeOnClickOutside?: boolean;
  /** Закрывать ли dropdown при клике на Item (по умолчанию: true) */
  closeOnSelect?: boolean;
  /** Включить typeahead навигацию (по умолчанию: true) */
  enableTypeahead?: boolean;
  /** Дополнительные CSS классы для контейнера */
  className?: string;
}

export interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
  /** Если true, рендерит children как есть (без обёртки в button) */
  asChild?: boolean;
  /** Disabled state кнопки */
  disabled?: boolean;
}

export interface DropdownContentProps {
  children: React.ReactNode;
  /** Направление открытия: 'down' | 'up' */
  direction?: 'down' | 'up';
  /** Ширина: 'auto' | 'full' | '200px' */
  width?: 'auto' | 'full' | string;
  /** Максимальная высота (для скролла) */
  maxHeight?: string;
  /** Выравнивание: 'left' | 'right' | 'center' */
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  /** Показать как выбранный */
  selected?: boolean;
  /** Иконка слева */
  icon?: React.ComponentType<{ className?: string }>;
  /** Badge справа */
  badge?: React.ReactNode;
  /** Вариант отображения */
  variant?: 'default' | 'danger';
  /** Закрывать ли dropdown при клике (переопределяет closeOnSelect из Root) */
  closeOnClick?: boolean;
  /** Ключевые слова для поиска (синонимы, переводы, теги) */
  keywords?: string[];
  /** Значение для поиска и идентификации */
  value?: string;
}

export interface DropdownSeparatorProps {
  className?: string;
}

export interface DropdownSearchProps {
  /** Текущее значение поиска (controlled) */
  value?: string;
  /** Callback при изменении значения */
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface DropdownEmptyProps {
  children?: React.ReactNode;
  className?: string;
}

export interface DropdownLabelProps {
  children: React.ReactNode;
  className?: string;
  /** Иконка слева */
  icon?: React.ComponentType<{ className?: string }>;
  id?: string;
}

export interface DropdownGroupProps {
  children: React.ReactNode;
  /** Текст заголовка (prop-based) */
  label?: string;
  className?: string;
}

// ==================== CONTEXT ====================

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within Dropdown.Root');
  }
  return context;
}

// ==================== ROOT ====================

/**
 * Корневой контейнер dropdown
 * 
 * Управляет состоянием открытия/закрытия через useDropdown хук.
 * Поддерживает controlled и uncontrolled режимы.
 */
function DropdownRoot({ 
  children, 
  isOpen: controlledIsOpen,
  onToggle,
  onClose,
  closeOnClickOutside = true, // По умолчанию закрывать при клике вне
  closeOnSelect,
  enableTypeahead = true,
  className = '',
}: DropdownRootProps) {
  const dropdown = useDropdown({
    isOpen: controlledIsOpen,
    onToggle,
    onClose,
    closeOnClickOutside,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // Генерируем уникальный ID для этого экземпляра dropdown
  const dropdownId = useId();

  const contextValue: DropdownContextValue = {
    isOpen: dropdown.isOpen,
    toggle: dropdown.toggle,
    open: dropdown.open,
    close: dropdown.close,
    triggerRef,
    closeOnSelect: closeOnSelect ?? true,
    enableTypeahead,
    dropdownId, // Добавляем ID в контекст
  };

  return (
    <DropdownContext.Provider value={contextValue}>
      <div 
        ref={dropdown.ref} 
        className={`relative w-full ${className}`}
        data-dropdown-id={dropdownId} // Добавляем ID для идентификации
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// ==================== TRIGGER ====================

/**
 * Кнопка-триггер для открытия dropdown
 * 
 * Автоматически привязывается к контексту и переключает состояние.
 * Поддерживает режим asChild для рендера произвольного элемента.
 */
function DropdownTrigger({ 
  children, 
  className = '',
  asChild = false,
  disabled = false,
}: DropdownTriggerProps) {
  const { toggle, triggerRef, isOpen, dropdownId } = useDropdownContext();

  if (asChild && React.isValidElement(children)) {
    // Clone child с добвлением onClick и ref
    const handleClick = (e: React.MouseEvent) => {
      toggle();
    };
    
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
      ref: triggerRef,
      'data-dropdown-id': dropdownId, // Добавляем ID для идентификации вложенности
    });
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={toggle}
      tabIndex={0}
      className={className}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      disabled={disabled}
      data-dropdown-id={dropdownId} // Добавляем ID для идентификации вложенности
    >
      {children}
    </button>
  );
}

// ==================== CONTENT ====================

/**
 * Выпадающее меню с содержимым
 * 
 * Рендерится через Portal в document.body для избежания обрезания overflow: hidden.
 * Использует fixed позиционирование с динамическим вычислением координат.
 */
function DropdownContent({ 
  children, 
  direction = 'down',
  width = 'full', // По умолчанию full вместо auto
  maxHeight = '15rem', // 240px
  align = 'left',
  className = '',
}: DropdownContentProps) {
  const { isOpen, triggerRef, closeOnSelect, enableTypeahead, dropdownId } = useDropdownContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [calculatedMaxHeight, setCalculatedMaxHeight] = useState<number>(240); // default 15rem = 240px
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);
  
  // Typeahead navigation: поиск по первой букве
  const typeaheadRef = useRef({ query: '', timeout: null as NodeJS.Timeout | null });

  // Расчёт позиции при открытии
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const spacing = 4; // 4px отступ (эквивалент mt-1/mb-1)
      const viewportPadding = 16; // 16px отступ от края viewport

      let top = 0;
      let left = 0;
      
      // Вертикальное позиционирование
      if (direction === 'up') {
        // Открываем вверх: bottom триггера минус высота content
        // Высоту content узнаем после рендера через contentRef
        top = triggerRect.top - spacing;
      } else {
        // Открываем вниз: top триггера + высота триггера
        top = triggerRect.bottom + spacing;
      }

      // Горизонтальное позиционирование
      if (align === 'left') {
        left = triggerRect.left;
      } else if (align === 'right') {
        left = triggerRect.right;
      } else if (align === 'center') {
        left = triggerRect.left + triggerRect.width / 2;
      }

      // Расчёт доступного пространства для maxHeight
      const availableSpace = direction === 'down'
        ? window.innerHeight - triggerRect.bottom - spacing - viewportPadding
        : triggerRect.top - spacing - viewportPadding;
      
      // Минимум 8rem (128px), максимум 15rem (240px)
      const calculatedHeight = Math.max(128, Math.min(availableSpace, 240));
      setCalculatedMaxHeight(calculatedHeight);

      const newPosition = {
        top,
        left,
        width: triggerRect.width, // Для width="full"
      };
      setPosition(newPosition);
      setIsPositionCalculated(true);
    } else if (!isOpen) {
      // Сброс флага при закрытии
      setIsPositionCalculated(false);
    }
  }, [isOpen, direction, align, triggerRef]);

  // Корректировка позиции для direction="up" после рендера
  useEffect(() => {
    if (isOpen && direction === 'up' && contentRef.current) {
      const contentHeight = contentRef.current.offsetHeight;
      const spacing = 4;
      
      if (triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        setPosition(prev => ({
          ...prev,
          top: triggerRect.top - contentHeight - spacing,
        }));
      }
    }
  }, [isOpen, direction, triggerRef, children]); // children для пересчёта при изменении контента

  // Focus management: фокус на первый элемент при открытии (если нет Search)
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Проверяем: находится ли фокус в input/textarea/select
      // Если да → не трогаем фокус, пользователь вводит данные
      const activeElement = document.activeElement;
      if (
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      // Проверяем: есть ли Search среди children?
      const hasSearch = React.Children.toArray(children).some(child => 
        React.isValidElement(child) && child.type === DropdownSearch
      );

      if (hasSearch) {
        // Search сам себя сфокусирует через autoFocus
        return;
      }

      // Пытаемся найти выбранный элемент (aria-checked="true")
      const selectedItem = contentRef.current.querySelector('[role="menuitem"][aria-checked="true"]:not([disabled])') as HTMLElement;
      
      if (selectedItem) {
        // Фокусируем выбранный элемент
        selectedItem.focus();
      } else {
        // Если нет выбранного → фокусируем первый элемент
        const firstItem = contentRef.current.querySelector('[role="menuitem"]:not([disabled])') as HTMLElement;
        firstItem?.focus();
      }
    }
  }, [isOpen, children]);

  // Focus management: возврат фокуса на триггер при закрытии
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

  // Клавиатурная навигация стрелками
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Игнорируем события клавиатуры, если фокус в input/textarea/select
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT'
    ) {
      return;
    }

    const items = contentRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])');
    if (!items || items.length === 0) return;

    const currentIndex = Array.from(items).indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        (items[nextIndex] as HTMLElement).focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex === 0) {
          // Если на первом элементе → проверяем наличие Search
          const searchInput = contentRef.current?.querySelector('input[aria-label="Поиск"]') as HTMLElement;
          if (searchInput) {
            // Возвращаемся к Search (круговая навигация)
            searchInput.focus();
          } else {
            // Нет Search → зацикливаем на последний Item
            const lastIndex = items.length - 1;
            (items[lastIndex] as HTMLElement).focus();
          }
        } else {
          // Переход к предыдущему элементу
          const prevIndex = currentIndex - 1;
          (items[prevIndex] as HTMLElement).focus();
        }
        break;
      case 'Home':
        e.preventDefault();
        (items[0] as HTMLElement).focus();
        break;
      case 'End':
        e.preventDefault();
        (items[items.length - 1] as HTMLElement).focus();
        break;
      default:
        // Typeahead navigation: поиск по первой букве (если включено)
        if (!enableTypeahead) break;
        
        // Игнорируем служебные клавиши
        if (
          e.key.length === 1 && 
          !e.ctrlKey && 
          !e.metaKey && 
          !e.altKey
        ) {
          e.preventDefault();
          
          // Очищаем предыдущий таймер
          if (typeaheadRef.current.timeout) {
            clearTimeout(typeaheadRef.current.timeout);
          }
          
          // Добавляем символ к текущему запросу
          typeaheadRef.current.query += e.key.toLowerCase();
          
          // Ищем первый элемент, начинающийся с запроса
          const matchIndex = Array.from(items).findIndex((item) => {
            const text = item.textContent?.toLowerCase() || '';
            return text.startsWith(typeaheadRef.current.query);
          });
          
          if (matchIndex !== -1) {
            (items[matchIndex] as HTMLElement).focus();
            // Прокручиваем к элементу если нужно
            items[matchIndex].scrollIntoView({ block: 'nearest' });
          }
          
          // Сбрасываем запрос через 500ms
          typeaheadRef.current.timeout = setTimeout(() => {
            typeaheadRef.current.query = '';
          }, 500);
        }
        break;
    }
  };

  if (!isOpen) return null;

  // Стили для ширины
  const widthValue = width === 'full' 
    ? position.width 
    : width === 'auto' 
    ? 'auto' 
    : width;

  // Стили для выравнивания
  let finalLeft = position.left;
  let transformStyle = 'none';

  if (align === 'center') {
    // Center: transform translateX(-50%)
    transformStyle = 'translateX(-50%)';
  } else if (align === 'right' && contentRef.current) {
    // Right: left = trigger.right - content.width
    // Для этого нужна ширина content, используем transform
    transformStyle = 'translateX(-100%)';
  }

  const portalContent = (
    <div
      ref={contentRef}
      onKeyDown={handleKeyDown}
      className={`
        fixed z-[70] bg-white border border-gray-200 rounded-lg shadow-lg
        overflow-hidden
        transition-opacity duration-150
        ${width === 'auto' ? 'w-max min-w-[12rem]' : ''}
        ${className}
      `}
      style={{
        top: `${position.top}px`,
        left: `${finalLeft}px`,
        width: widthValue !== 'auto' ? widthValue : undefined,
        transform: transformStyle,
        opacity: isPositionCalculated ? 1 : 0,
        pointerEvents: isPositionCalculated ? 'auto' : 'none',
      }}
      data-dropdown-content
      data-dropdown-id={dropdownId} // Добавляем ID для идентификации этого dropdown
      role="menu"
      aria-labelledby={dropdownId} // Связываем с Label через ID
    >
      <div 
        className="overflow-y-auto"
        style={{ maxHeight: `${calculatedMaxHeight}px` }}
      >
        {children}
      </div>
    </div>
  );
  
  return createPortal(portalContent, document.body);
}

// ==================== ITEM ====================

/**
 * Элемент выпадающего меню
 * 
 * Представляет собой кликабельный лемент списка. Может быть disabled.
 * Автоматически закрывает dropdown при клике (если не disabled).
 * 
 * tabIndex:
 * - 0 для активных элементов (включены в клавиатурную навигацию)
 * - -1 для disabled (программно не фокусируемые, фильтруются через :not([disabled]))
 */
function DropdownItem({ 
  children, 
  onClick,
  disabled = false,
  className = '',
  selected = false,
  icon: Icon,
  badge,
  variant = 'default',
  closeOnClick,
  keywords,
  value,
}: DropdownItemProps) {
  const { close, closeOnSelect } = useDropdownContext();

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
      if (closeOnClick !== undefined ? closeOnClick : closeOnSelect) {
        close();
      }
    }
  };

  // Стили в зависимости от варианта
  const variantClasses = variant === 'danger'
    ? 'text-red-600 hover:bg-red-50 focus:bg-red-50'
    : 'hover:bg-gray-50 focus:bg-gray-100';

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      onClick={handleClick}
      aria-checked={selected}
      className={`
        w-full px-4 py-2 text-left text-sm
        ${variantClasses}
        ${selected ? 'bg-gray-50' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none
        transition-colors
        flex items-center gap-2
        ${className}
      `}
      aria-disabled={disabled}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span className="flex-1 whitespace-nowrap">{children}</span>
      {badge && <span className="flex-shrink-0">{badge}</span>}
    </button>
  );
}

// ==================== SEPARATOR ====================

/**
 * Горизонтальный разделитель между элементами
 */
function DropdownSeparator({ className = '' }: DropdownSeparatorProps) {
  return (
    <div 
      role="separator" 
      className={`h-px bg-gray-200 my-1 ${className}`}
      aria-orientation="horizontal"
    />
  );
}

// ==================== SEARCH ====================

/**
 * Поисковый input для фильтрации элементов
 * 
 * Controlled компонент - требует value и onChange props.
 * Родитель контролирует состояние поиска и логику фильтрации.
 * 
 * При монтировании автоматически получает фокус для мгновенного ввода.
 * 
 * @example
 * const [search, setSearch] = useState('');
 * 
 * <Dropdown.Search 
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Поиск..." 
 * />
 */
function DropdownSearch({ 
  value = '',
  onChange,
  placeholder = 'Поиск...',
  className = '',
}: DropdownSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Автофокус при монтировании (для мгновенного начала ввода)
  useEffect(() => {
    // Небольшая задержка для корректной работы с Portal
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleClearSearch = () => {
    onChange?.('');
    // Возвращаем фокус на input после очистки
    inputRef.current?.focus();
  };

  // Клавиатурная навигация из Search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // ArrowDown: переход к первому результату
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const firstItem = document.querySelector('[data-dropdown-content] [role="menuitem"]:not([disabled])') as HTMLElement;
      firstItem?.focus();
    }
    
    // ArrowUp: переход к последнему результату
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const items = document.querySelectorAll('[data-dropdown-content] [role="menuitem"]:not([disabled])');
      const lastItem = items[items.length - 1] as HTMLElement;
      lastItem?.focus();
    }
    
    // Escape: очистить поиск (если есть текст) или закрыть dropdown
    if (e.key === 'Escape' && value) {
      e.stopPropagation(); // Не закрывать dropdown
      onChange?.(''); // Очистить поиск
      // Фокус остаётся на input
    }
    // Если value пустой, Escape пробросится в Content и закроет dropdown
  };

  return (
    <div className={`px-4 py-2 ${className}`}>
      <div className="relative">
        {/* Иконка Search слева */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-8 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
          aria-label="Поиск"
        />
        {value && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Очистить поиск"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== EMPTY ====================

/**
 * EmptyState для "Ничего не найдено"
 * 
 * Отображается, когда нет элементов, соответствующих поиску.
 * 
 * @example
 * <Dropdown.Empty>Ничего не найдено</Dropdown.Empty>
 */
function DropdownEmpty({ 
  children,
  className = '',
}: DropdownEmptyProps) {
  return (
    <div className={`px-4 py-2 text-sm text-gray-500 ${className}`}>
      {children}
    </div>
  );
}

// ==================== LABEL ====================

/**
 * Заголовок группы элементов
 * 
 * Неинтерактивный текстовый элемент для визуального разделения групп.
 * Не участвует в клавиатурной навигации (role="presentation").
 * 
 * @example
 * <Dropdown.Label>Расстояние</Dropdown.Label>
 * <Dropdown.Label icon={Ruler}>Расстояние</Dropdown.Label>
 */
function DropdownLabel({ 
  children, 
  className = '',
  icon: Icon,
  id,
}: DropdownLabelProps) {
  return (
    <div
      id={id}
      role="presentation"
      className={`
        px-2 py-1.5 text-xs text-gray-500 font-medium
        flex items-center gap-2
        ${className}
      `}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </div>
  );
}

// ==================== GROUP ====================

/**
 * Группа элементов с опциональным заголовком
 * 
 * Визуальная группировка элементов dropdown для улучшения UX в больших списках.
 * Поддерживает два режима:
 * 1. Prop-based: <Dropdown.Group label="Заголовок">...</Dropdown.Group>
 * 2. Композитный: <Dropdown.Group><Dropdown.Label>...</Dropdown.Label>...</Dropdown.Group>
 * 
 * @example
 * // Простой вариант (prop-based)
 * <Dropdown.Group label="Расстояние">
 *   <Dropdown.Item>км</Dropdown.Item>
 *   <Dropdown.Item>м</Dropdown.Item>
 * </Dropdown.Group>
 * 
 * // Кастомный вариант (композитный)
 * <Dropdown.Group>
 *   <Dropdown.Label icon={Ruler}>Расстояние</Dropdown.Label>
 *   <Dropdown.Item>км</Dropdown.Item>
 *   <Dropdown.Item>м</Dropdown.Item>
 * </Dropdown.Group>
 */
function DropdownGroup({ 
  children, 
  label,
  className = '',
}: DropdownGroupProps) {
  // Генерируем уникальный ID для связи Label с Group через aria-labelledby
  const labelId = useId();

  return (
    <div 
      role="group" 
      aria-labelledby={label ? labelId : undefined}
      className={className}
    >
      {label && (
        <DropdownLabel id={labelId}>
          {label}
        </DropdownLabel>
      )}
      {children}
    </div>
  );
}

// ==================== EXPORT ====================

export const Dropdown = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Separator: DropdownSeparator,
  Search: DropdownSearch,
  Empty: DropdownEmpty,
  Label: DropdownLabel,
  Group: DropdownGroup,
  useContext: useDropdownContext, // ✅ Экспорт хука для доступа к контексту извне
};