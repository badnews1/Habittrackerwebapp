import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from '../icons';
import { CATEGORY_COLORS, COLOR_DISPLAY_MAP, PAGINATION } from '../../constants';

interface ColorPickerProps {
  currentColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
  anchorElement: HTMLElement | null; // HTML-элемент относительно которого позиционируется пикер
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onSelectColor, onClose, anchorElement }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null); // ✅ Начинаем с null чтобы не рендерить пока позиция не рассчитана
  const pickerRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(CATEGORY_COLORS.length / PAGINATION.colorsPerPage);
  const startIndex = currentPage * PAGINATION.colorsPerPage;
  const endIndex = startIndex + PAGINATION.colorsPerPage;
  const currentColors = CATEGORY_COLORS.slice(startIndex, endIndex);

  const handleSelectColor = (color: string) => {
    onSelectColor(color);
    setCurrentPage(0);
    onClose();
  };

  // Рассчитать позицию пикера относительно кнопки-якоря
  useEffect(() => {
    if (!anchorElement) return;

    const updatePosition = () => {
      const anchorRect = anchorElement.getBoundingClientRect();
      // Позиционируем пикер под кнопкой с небольшим отступом
      setPosition({
        top: anchorRect.bottom + 4,
        left: anchorRect.left,
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorElement]); // ✅ Теперь anchorElement стабилен - это сам HTML-элемент, а не ref объект

  // Закрытие при клике вне пикера
  useEffect(() => {
    const currentRef = pickerRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      // ✅ Проверяем что клик не был на самом anchorElement (кнопке которая открыла пикер)
      if (currentRef && !currentRef.contains(event.target as Node) && 
          anchorElement && !anchorElement.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, anchorElement]);

  // ✅ Не рендерим пикер пока позиция не рассчитана
  if (!position) {
    return null;
  }

  return createPortal(
    <div 
      className="fixed z-[60] bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64" 
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      ref={pickerRef}
      data-color-picker="true"
    >
      {/* Colors Grid */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {currentColors.map((color, idx) => {
          const lightColorBgClass = color.split(' ')[0];
          const displayColorBgClass = COLOR_DISPLAY_MAP[lightColorBgClass] || lightColorBgClass;
          return (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectColor(color);
              }}
              className={`w-6 h-6 rounded-full border ${displayColorBgClass} ${
                currentColor === color ? 'ring-2 ring-gray-900' : 'border-gray-200'
              } hover:scale-110 transition-transform`}
              title={color}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
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
                  e.stopPropagation();
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
              e.stopPropagation();
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
    </div>,
    document.body
  );
};