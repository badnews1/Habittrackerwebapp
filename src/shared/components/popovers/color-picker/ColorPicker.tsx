/**
 * Пикер цветов с пагинацией
 * 
 * Компонент для выбора цвета категории из палитры.
 * Поддерживает пагинацию для навигации по 20 цветам (10 на страницу).
 * Self-contained компонент с внутренним управлением состоянием dropdown.
 * 
 * ИСПРАВЛЕННЫЕ БАГИ:
 * - ✅ Disabled prop предотвращает открытие когда категория не выбрана
 * - ✅ Dropdown автоматически закрывается при выборе цвета
 * - ✅ Страница пагинации сбрасывается на 0 после закрытия dropdown
 * 
 * UX УЛУЧШЕНИЯ:
 * - ✅ Tooltip отображает русские названия цветов вместо Tailwind классов
 * - ✅ Унифицированный дизайн кнопки (белый фон + тонкий border) в стиле Jony Ive
 * 
 * @module shared/components/popovers/color-picker
 * @created ранее
 * @updated 22 ноября 2025 - мигрировано на Dropdown конструктор, русские названия, минималистичный дизайн ⭐
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@/shared/icons';
import { Dropdown } from '@/shared/constructors/dropdown';
import { TAG_COLORS, COLOR_DISPLAY_MAP, COLOR_NAME_MAP, PAGINATION } from '@/shared/constants';

interface ColorPickerProps {
  /** Текущий выбранный цвет */
  currentColor: string;
  /** Callback при выборе цвета */
  onSelectColor: (color: string) => void;
  /** Disabled state (например, если категория не выбрана) */
  disabled?: boolean;
  /** Tooltip текст */
  title?: string;
}

/**
 * Внутренний компонент контента ColorPicker
 * Получает доступ к DropdownContext для программного закрытия
 */
const ColorPickerContent: React.FC<{
  currentColor: string;
  onSelectColor: (color: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}> = ({ currentColor, onSelectColor, currentPage, setCurrentPage }) => {
  // Получаем доступ к контексту Dropdown для программного закрытия
  const context = Dropdown.useContext();
  
  const totalPages = Math.ceil(TAG_COLORS.length / PAGINATION.colorsPerPage);
  const startIndex = currentPage * PAGINATION.colorsPerPage;
  const endIndex = startIndex + PAGINATION.colorsPerPage;
  const currentColors = TAG_COLORS.slice(startIndex, endIndex);

  const handleSelectColor = (color: string) => {
    onSelectColor(color);
    setCurrentPage(0); // Сбрасываем пагинацию при выборе
    context.close(); // ✅ Закрываем dropdown программно
  };

  return (
    <Dropdown.Content 
      direction="down" 
      width="256px"
    >
      {/* Colors Grid */}
      <div className="p-3">
        <div className="grid grid-cols-5 gap-2 mb-3">
          {currentColors.map((color, idx) => {
            const lightColorBgClass = color.split(' ')[0];
            const displayColorBgClass = COLOR_DISPLAY_MAP[lightColorBgClass] || lightColorBgClass;
            const isSelected = currentColor === color;
            const colorName = COLOR_NAME_MAP[color] || color; // ✅ Получаем русское название
            
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectColor(color)}
                className={`w-full aspect-square rounded-full border ${displayColorBgClass} ${
                  isSelected ? 'ring-2 ring-gray-900' : 'border-gray-200'
                } hover:scale-110 transition-transform`}
                title={colorName}
                aria-label={colorName}
              />
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Предотвращаем закрытие dropdown
                setCurrentPage(Math.max(0, currentPage - 1));
              }}
              disabled={currentPage === 0}
              className={`p-1 rounded transition-colors ${
                currentPage === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Предыдущая страница"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Indicators */}
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation(); // Предотвращаем закрытие dropdown
                    setCurrentPage(i);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    currentPage === i ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={`Страница ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Предотвращаем закрытие dropdown
                setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
              }}
              disabled={currentPage === totalPages - 1}
              className={`p-1 rounded transition-colors ${
                currentPage === totalPages - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Следующая страница"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Dropdown.Content>
  );
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  currentColor, 
  onSelectColor,
  disabled = false,
  title = 'Изменить цвет',
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Определяем класс фона для отображения текущего цвета на кружке
  const lightColorBgClass = currentColor.split(' ')[0];
  const displayBgClass = COLOR_DISPLAY_MAP[lightColorBgClass] || lightColorBgClass;

  return (
    <div className="flex-shrink-0">
      <Dropdown.Root 
        onClose={() => setCurrentPage(0)} // Сбрасываем пагинацию при закрытии
        closeOnSelect={false} // ✅ Отключаем автоматическое закрытие, управляем вручную
      >
        {/* Кнопка-триггер с цветным кружком внутри */}
        <Dropdown.Trigger 
          className={`h-[38px] w-[38px] rounded flex items-center justify-center transition-all bg-white ${
            disabled ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'
          }`}
          title={title}
          disabled={disabled}
        >
          {/* Цветной кружок внутри кнопки */}
          <div className={`w-5 h-5 rounded-full ${displayBgClass}`} />
        </Dropdown.Trigger>

        {/* Dropdown контент с сеткой цветов - выносим в отдельный компонент */}
        <ColorPickerContent 
          currentColor={currentColor}
          onSelectColor={onSelectColor}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Dropdown.Root>
    </div>
  );
};

ColorPicker.displayName = 'ColorPicker';