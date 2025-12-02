/**
 * FilterDropdown - generic dropdown компонент для фильтрации
 * 
 * @description
 * Универсальный "глупый" компонент для фильтрации любых данных.
 * Не зависит от конкретных entity (Habit, Task, и т.д.)
 * 
 * Особенности:
 * - Иконка фильтра с индикатором активных фильтров
 * - Dropdown панель с настраиваемыми секциями
 * - Аккордеон секций (на базе shadcn/ui Accordion)
 * - Кнопка "Сбросить" для очистки фильтров
 * - Автозакрытие при клике вне области
 * 
 * @module shared/ui/filter-dropdown
 * @created 29 ноября 2025 - рефакторинг на generic компонент
 */

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { FilterDropdownConfig } from '@/shared/types';
import { Filter } from '@/shared/assets/icons/system';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutside';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FilterDropdownProps extends FilterDropdownConfig {
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Generic dropdown компонент для фильтрации
 * 
 * @example
 * ```tsx
 * const sections: FilterSection[] = [
 *   {
 *     id: 'tags',
 *     title: 'Теги',
 *     options: [
 *       { id: 'sport', label: 'Спорт', checked: true, count: 5, onChange: () => {} },
 *       { id: 'health', label: 'Здоровье', checked: false, count: 3, onChange: () => {} }
 *     ]
 *   }
 * ];
 * 
 * <FilterDropdown
 *   sections={sections}
 *   hasActiveFilters={true}
 *   onClearAll={() => {}}
 *   isOpen={isOpen}
 *   onToggleOpen={() => setIsOpen(!isOpen)}
 * />
 * ```
 */
export function FilterDropdown({
  sections,
  hasActiveFilters,
  onClearAll,
  isOpen,
  onToggleOpen,
  className = '',
}: FilterDropdownProps) {
  const { t } = useTranslation('ui');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие dropdown при клике вне его области
  useClickOutside(dropdownRef, () => {
    if (isOpen) onToggleOpen();
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Кнопка фильтра */}
      <Button
        onClick={onToggleOpen}
        variant={hasActiveFilters ? 'default' : 'ghost'}
        size="icon"
        className="rounded-full relative"
        aria-label={t('common.filter')}
      >
        <Filter className="w-4 h-4" />
        {/* Индикатор активных фильтров */}
        {hasActiveFilters && (
          <span 
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-current"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          />
        )}
      </Button>

      {/* Dropdown панель */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-60 h-[280px] rounded-2xl shadow-lg border overflow-hidden flex flex-col"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-default)',
            zIndex: 'var(--z-dropdown)'
          }}
        >
          {/* Header с кнопкой "Сбросить" */}
          <div 
            className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <span className="font-medium text-sm">{t('common.filter')}</span>
            {hasActiveFilters && (
              <Button
                onClick={onClearAll}
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
              >
                {t('common.reset')}
              </Button>
            )}
          </div>

          {/* Accordion секции фильтров */}
          <Accordion type="multiple" className="w-full overflow-y-auto flex-1">
            {sections.map((section, index) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className={index > 0 ? 'border-t border-b-0' : 'border-b-0'}
                style={index > 0 ? { borderColor: 'var(--border-default)' } : undefined}
              >
                <AccordionTrigger 
                  className="px-4 py-3 text-xs font-medium uppercase tracking-wide hover:no-underline transition-colors"
                  style={{ 
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                  }}
                >
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-2">
                  {section.options.length > 0 ? (
                    section.options.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={`filter-${section.id}-${option.id}`}
                        className="px-4 py-2 cursor-pointer transition-colors gap-2"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                        }}
                      >
                        <Checkbox
                          id={`filter-${section.id}-${option.id}`}
                          checked={option.checked}
                          onCheckedChange={option.onChange}
                        />
                        <span 
                          className="text-sm" 
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span 
                            className="text-xs" 
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            ({option.count})
                          </span>
                        )}
                      </Label>
                    ))
                  ) : (
                    <div 
                      className="px-4 py-2 text-sm text-center"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('ui.noResults')}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}