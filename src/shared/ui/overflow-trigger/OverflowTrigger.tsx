/**
 * 🎨 OverflowTrigger — Универсальный триггер с overflow для списков элементов
 * 
 * Generic компонент, который отображает:
 * - Массив элементов (переданных через children или items)
 * - Overflow badge (+N) если элементов больше чем влезает
 * - Placeholder если элементов нет
 * - Иконку справа
 * 
 * ВАЖНО: Это полностью глупый компонент!
 * Он не знает про теги, проекты или другие сущности.
 * Принимает готовые React элементы для отображения.
 * 
 * @example
 * ```tsx
 * <OverflowTrigger
 *   items={[
 *     <Badge key="1">Работа</Badge>,
 *     <Badge key="2">Спорт</Badge>,
 *   ]}
 *   overflowCount={3}
 *   placeholder="Выберите элементы"
 *   icon={<ChevronDown />}
 * />
 * ```
 * 
 * @module shared/ui/overflow-trigger
 * @created 28 ноября 2025
 */

import React, { forwardRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

/**
 * Пропсы OverflowTrigger
 */
export interface OverflowTriggerProps {
  /** Массив React элементов для отображения */
  items?: React.ReactNode[];
  /** Количество элементов, которые не влезли (для +N badge) */
  overflowCount?: number;
  /** Placeholder когда элементов нет */
  placeholder?: React.ReactNode;
  /** Иконка placeholder (слева от текста) */
  placeholderIcon?: React.ReactNode;
  /** Иконка справа (обычно ChevronDown) */
  icon?: React.ReactNode;
  /** Callback клика */
  onClick?: () => void;
  /** Дополнительные классы */
  className?: string;
  /** Открыт ли попап (для стилизации) */
  isOpen?: boolean;
  /** Дополнительные классы для контейнера элементов */
  contentClassName?: string;
}

/**
 * OverflowTrigger - универсальная кнопка-триггер с overflow элементами
 */
export const OverflowTrigger = forwardRef<HTMLButtonElement, OverflowTriggerProps>(
  (
    {
      items = [],
      overflowCount = 0,
      placeholder = 'Не выбрано',
      placeholderIcon,
      icon,
      onClick,
      className,
      isOpen,
      contentClassName,
    },
    ref
  ) => {
    const hasItems = items.length > 0;

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          'w-full px-3 py-2 border border-input rounded-md cursor-pointer transition-colors text-sm text-left flex items-center gap-2 overflow-hidden',
          'hover:border-border-focus focus-visible:border-border-focus focus-visible:outline-none',
          isOpen && 'border-border-focus',
          hasItems ? 'text-text-primary' : 'text-text-tertiary',
          className
        )}
      >
        <div className={cn('flex items-center gap-2 flex-1 overflow-hidden', contentClassName)}>
          {/* Отображаем элементы или placeholder */}
          {hasItems ? (
            <>
              {items.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))}

              {/* Показываем +N если есть overflow */}
              {overflowCount > 0 && (
                <Badge variant="outline" className="flex-shrink-0">
                  +{overflowCount}
                </Badge>
              )}
            </>
          ) : (
            <>
              {placeholderIcon && placeholderIcon}
              <span className="flex-1">{placeholder}</span>
            </>
          )}
        </div>

        {/* Иконка справа */}
        {icon && <div className="flex-shrink-0 text-text-tertiary">{icon}</div>}
      </button>
    );
  }
);

OverflowTrigger.displayName = 'OverflowTrigger';
