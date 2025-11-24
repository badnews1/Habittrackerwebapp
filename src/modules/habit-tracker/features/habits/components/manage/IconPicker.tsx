/**
 * Пикер иконок с пагинацией
 * 
 * Компонент для выбора иконки привычки из библиотеки иконок.
 * Поддерживает пагинацию для навигации по большому количеству иконок.
 * Может работать в controlled и uncontrolled режимах.
 * 
 * ИСПРАВЛЕННЫЕ БАГИ:
 * - ✅ Dropdown автоматически закрывается при выборе иконки
 * - ✅ Страница пагинации сбрасывается на 0 после закрытия dropdown
 * 
 * UX УЛУЧШЕНИЯ:
 * - ✅ Унифицированный дизайн кнопки (белый фон + тонкий border) в стиле Jony Ive
 * 
 * @module modules/habit-tracker/features/habits/components/manage/IconPicker
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - мигрировано на Dropdown конструктор, минималистичный дизайн ⭐
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@/shared/icons';
import { Dropdown } from '@/shared/constructors/dropdown';
import { ICON_MAP, ICON_OPTIONS, SmallFilledCircle, ICONS_PER_PAGE } from '@/shared/constants/icons';
import { uiLogger } from '@/shared/utils/logger';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconKey: string) => void;
  /** Опциональное внешнее управление состоянием dropdown */
  isOpen?: boolean;
  onToggle?: () => void;
  /** Направление раскрытия dropdown */
  direction?: 'up' | 'down';
  /** Опциональное внешнее управление текущей страницей пагинации */
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

/**
 * Внутренний компонент контента IconPicker
 * Получает доступ к DropdownContext для программного закрытия
 */
const IconPickerContent: React.FC<{
  selectedIcon: string;
  onSelectIcon: (iconKey: string) => void;
  direction: 'up' | 'down';
  currentPage: number;
  onPageChange: (page: number) => void;
}> = ({ selectedIcon, onSelectIcon, direction, currentPage, onPageChange }) => {
  // Получаем доступ к контексту Dropdown для программного закрытия
  const context = Dropdown.useContext();

  // Вычисление пагинации
  const totalPages = Math.ceil(ICON_OPTIONS.length / ICONS_PER_PAGE);
  const startIndex = currentPage * ICONS_PER_PAGE;
  const endIndex = startIndex + ICONS_PER_PAGE;
  const currentIcons = ICON_OPTIONS.slice(startIndex, endIndex);

  const handleIconSelect = (iconKey: string) => {
    onSelectIcon(iconKey);
    context.close(); // ✅ Закрываем dropdown программно
  };

  return (
    <Dropdown.Content 
      direction={direction}
      width="256px"
    >
      {/* Icons Grid */}
      <div className="p-3 grid grid-cols-5 gap-2 max-h-[340px] overflow-y-auto">
        {currentIcons.map((iconOption) => {
          const Icon = iconOption.Icon;
          const isSelected = selectedIcon === iconOption.key;
          
          // Skip if Icon is undefined (safety check)
          if (!Icon) {
            uiLogger.warn(`Icon undefined for key: ${iconOption.key}`);
            return null;
          }
          
          return (
            <button
              key={iconOption.key}
              onClick={() => handleIconSelect(iconOption.key)}
              className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all border ${ 
                isSelected 
                  ? 'bg-gray-900 text-white border-gray-900' 
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
              title={iconOption.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 p-2 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Предотвращаем закрытие dropdown
              onPageChange(Math.max(0, currentPage - 1));
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
                  onPageChange(i);
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
              onPageChange(Math.min(totalPages - 1, currentPage + 1));
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
    </Dropdown.Content>
  );
};

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
  isOpen,
  onToggle,
  direction = 'down',
  currentPage: externalCurrentPage,
  onPageChange: externalOnPageChange,
}) => {
  // Внутреннее состояние пагинации как fallback
  const [internalCurrentPage, setInternalCurrentPage] = useState(0);
  
  // Используем внешнюю страницу если передана, иначе внутреннюю
  const currentPage = externalCurrentPage !== undefined ? externalCurrentPage : internalCurrentPage;
  
  const IconComponent = ICON_MAP[selectedIcon] || SmallFilledCircle;
  
  const handlePageChange = (page: number) => {
    if (externalOnPageChange) {
      externalOnPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  // Колбэк при закрытии dropdown - сбрасываем пагинацию
  const handleClose = () => {
    if (externalOnPageChange) {
      externalOnPageChange(0);
    } else {
      setInternalCurrentPage(0);
    }
  };

  return (
    <div className="flex-shrink-0">
      <Dropdown.Root 
        isOpen={isOpen} 
        onToggle={onToggle}
        onClose={handleClose}
        closeOnSelect={false} // ✅ Отключаем автоматическое закрытие, управляем вручную
      >
        {/* Кнопка-триггер с иконкой */}
        <Dropdown.Trigger 
          className="h-[38px] w-[38px] rounded flex items-center justify-center transition-all bg-white border border-gray-300 hover:border-gray-900 text-gray-600"
          title="Изменить иконку"
        >
          <IconComponent className="w-5 h-5" />
        </Dropdown.Trigger>

        {/* Dropdown контент с сеткой иконок - выносим в отдельный компонент */}
        <IconPickerContent 
          selectedIcon={selectedIcon}
          onSelectIcon={onSelectIcon}
          direction={direction}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Dropdown.Root>
    </div>
  );
};

IconPicker.displayName = 'IconPicker';