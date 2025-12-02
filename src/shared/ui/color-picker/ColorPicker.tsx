/**
 * 🎨 ColorPicker — Современный color picker на Radix UI Popover
 * 
 * Компонент выбора цвета на основе проверенных примитивов:
 * - Popover (Radix UI) - позиционирование, portal, click outside
 * - CSS переменные - палитра из 20 цветов через --palette-{color}-*
 * - Controlled состояние - open/onOpenChange
 * 
 * ОСНОВНЫЕ ВОЗМОЖНОСТИ:
 * ✅ Меньше кода (используем Radix Popover)
 * ✅ Автоматическое позиционирование (collision detection)
 * ✅ Лучшая accessibility (ARIA из Radix)
 * ✅ CSS переменные вместо Tailwind классов
 * ✅ Controlled состояние для интеграции
 * ✅ Минималистичный дизайн (Jony Ive style)
 * 
 * @example
 * ```tsx
 * import { ColorPicker } from '@/shared/ui/color-picker';
 * 
 * const [isOpen, setIsOpen] = useState(false);
 * const [color, setColor] = useState<ColorVariant>('blue');
 * 
 * // С дефолтным триггером
 * <ColorPicker
 *   value={color}
 *   onChange={setColor}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * 
 * // С кастомным триггером
 * <ColorPicker
 *   value={color}
 *   onChange={setColor}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * >
 *   <Button>Выбрать цвет</Button>
 * </ColorPicker>
 * ```
 * 
 * @module shared/ui/color-picker
 * @created 28 ноября 2025
 * @updated 28 ноября 2025 - переименование ColorPickerV2 → ColorPicker (единственная версия)
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { COLOR_VARIANTS } from '@/shared/constants/colors';
import { Check } from 'lucide-react';
import type { ColorPickerProps } from './ColorPicker.types';
import type { ColorVariant } from '@/shared/constants/colors';

/**
 * ColorPicker - компонент выбора цвета с сеткой 5x4
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  open,
  onOpenChange,
  children,
  className = '',
}) => {
  const { t } = useTranslation('ui');
  const [internalOpen, setInternalOpen] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectColor = (color: ColorVariant) => {
    onChange(color);
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
          <button
            type="button"
            className={`w-[38px] h-[38px] rounded flex items-center justify-center transition-all hover:opacity-80 cursor-pointer ${className}`}
            style={{ backgroundColor: 'var(--bg-primary)' }}
            aria-label={t('ui.selectColor')}
          >
            {/* Цветной кружок внутри кнопки */}
            <div 
              className="w-5 h-5 rounded-full border"
              style={{
                backgroundColor: `var(--palette-${value}-bg)`,
                borderColor: `var(--palette-${value}-border)`,
              }}
            />
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent 
        className="p-3 w-auto"
        align="start"
        sideOffset={8}
      >
        {/* Сетка цветов 5x4 */}
        <div className="grid grid-cols-5 gap-2">
          {COLOR_VARIANTS.map((color) => {
            const isSelected = value === color;
            
            return (
              <Button
                key={color}
                type="button"
                onClick={() => handleSelectColor(color)}
                variant="outline"
                className="relative w-8 h-8 p-0 transition-all hover:scale-110"
                style={{
                  backgroundColor: `var(--palette-${color}-bg)`,
                  borderColor: `var(--palette-${color}-border)`,
                }}
                aria-label={color}
                aria-pressed={isSelected}
              >
                {/* Галочка для выбранного цвета */}
                {isSelected && (
                  <Check 
                    className="absolute inset-0 m-auto w-4 h-4 drop-shadow-sm"
                    style={{
                      color: `var(--palette-${color}-text)`,
                    }}
                  />
                )}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}