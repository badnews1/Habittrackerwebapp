import React from 'react';

interface FrequencyButtonProps {
  isActive: boolean;
  onActivate: () => void;
  children: React.ReactNode;
}

/**
 * Универсальный компонент кнопки выбора частоты с чекбоксом
 * Инкапсулирует дублированную UI логику всех Section-компонентов
 * Дата создания: 19 ноября 2024
 */
export const FrequencyButton: React.FC<FrequencyButtonProps> = ({
  isActive,
  onActivate,
  children,
}) => {
  return (
    <button
      type="button"
      onClick={onActivate}
      className={`w-full px-3 py-2.5 min-h-[50px] rounded border text-left text-sm transition-all flex items-center gap-3 ${
        isActive
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
      }`}
    >
      {/* Чекбокс */}
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
        isActive
          ? 'border-white bg-white'
          : 'border-gray-300'
      }`}>
        {isActive && (
          <svg className="w-3 h-3 text-gray-900" viewBox="0 0 12 12" fill="none">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      
      {/* Контент кнопки */}
      {children}
    </button>
  );
};