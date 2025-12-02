/**
 * 🎯 IconPicker — Современный icon picker на Radix UI Popover
 * 
 * Компонент выбора иконки на основе проверенных примитивов:
 * - Popover (Radix UI) - позиционирование, portal, click outside
 * - Поиск по названию иконки
 * - Grid с скроллом (100 иконок)
 * - Controlled состояние - open/onOpenChange
 * 
 * ОСНОВНЫЕ ВОЗМОЖНОСТИ:
 * ✅ Меньше кода (используем Radix Popover вместо кастомного Dropdown)
 * ✅ Автоматическое позиционирование (collision detection)
 * ✅ Лучшая accessibility (ARIA из Radix)
 * ✅ Поиск по названию иконки (live search)
 * ✅ Скролл вместо пагинации (UX улучшение)
 * ✅ 4 ряда видимых (как в ColorPicker): max-h-[152px]
 * ✅ Controlled состояние для интеграции
 * ✅ Кастомный триггер через children
 * ✅ Минималистичный дизайн (Jony Ive style)
 * 
 * @example
 * ```tsx
 * import { IconPicker } from '@/shared/ui/icon-picker';
 * 
 * const [isOpen, setIsOpen] = useState(false);
 * const [icon, setIcon] = useState('dumbbell');
 * 
 * // С дефолтным триггером
 * <IconPicker
 *   value={icon}
 *   onChange={setIcon}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * 
 * // С кастомным триггером
 * <IconPicker
 *   value={icon}
 *   onChange={setIcon}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * >
 *   <Button>Выбрать иконку</Button>
 * </IconPicker>
 * ```
 * 
 * @module shared/ui/icon-picker
 * @created 29 ноября 2025
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ICON_MAP, ICON_OPTIONS, SmallFilledCircle } from '@/shared/constants/icons';
import { Search } from '@/shared/assets/icons/system';
import type { IconPickerProps } from './IconPicker.types';

/**
 * IconPicker - компонент выбора иконки с поиском и скроллом
 */
export function IconPicker({
  value,
  onChange,
  open,
  onOpenChange,
  children,
  className = '',
}: IconPickerProps) {
  const { t } = useTranslation('ui');
  
  // ============================================
  // STATE
  // ============================================
  
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // EFFECTS
  // ============================================

  // Автофокус на поисковый input при открытии
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  // Сброс поиска при закрытии
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  // ============================================
  // COMPUTED
  // ============================================

  // Фильтрация иконок по поисковому запросу
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return ICON_OPTIONS;
    }
    
    const query = searchQuery.toLowerCase();
    return ICON_OPTIONS.filter(icon =>
      icon.label.toLowerCase().includes(query) ||
      icon.key.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Получение компонента выбранной иконки
  const SelectedIconComponent = ICON_MAP[value] || SmallFilledCircle;

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectIcon = (iconKey: string) => {
    onChange(iconKey);
    // Закрываем popover после выбора
    onOpenChange?.(false);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="outline"
            size="icon"
            className={className}
            aria-label={t('ui.selectIcon')}
          >
            <SelectedIconComponent className="w-5 h-5" />
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent 
        className="p-3 w-64"
        align="start"
        sideOffset={8}
      >
        {/* Поиск */}
        <div className="mb-3 relative">
          <Search 
            className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
            style={{ color: 'var(--text-secondary)' }}
          />
          <Input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ui.searchIcons')}
            className="pl-8"
          />
        </div>

        {/* Сетка иконок с скроллом - 4 ряда видимых (как в ColorPicker) */}
        <div className="grid grid-cols-5 gap-2 max-h-[152px] overflow-y-auto">
          {filteredIcons.length > 0 ? (
            filteredIcons.map((iconOption) => {
              const Icon = iconOption.Icon;
              const isSelected = value === iconOption.key;
              
              return (
                <Button
                  key={iconOption.key}
                  type="button"
                  onClick={() => handleSelectIcon(iconOption.key)}
                  variant={isSelected ? 'default' : 'outline'}
                  size="icon"
                  title={iconOption.label}
                  aria-label={iconOption.label}
                  aria-pressed={isSelected}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              );
            })
          ) : (
            <div 
              className="col-span-5 text-center text-sm py-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('ui.iconsNotFound')}
            </div>
          )}
        </div>

        {/* Счетчик результатов (если есть поиск) */}
        {searchQuery && (
          <div 
            className="text-xs mt-2 text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('ui.found')}: {filteredIcons.length}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}