import React from 'react';
import { FrequencyButton } from './FrequencyButton';

interface ByDaysOfWeekSectionProps {
  isActive: boolean;
  daysOfWeek: number[];
  onActivate: () => void;
  onDaysChange: (days: number[]) => void;
}

/**
 * Компонент для выбора частоты "По дням недели"
 * Включает кнопку выбора и селектор дней недели
 * Часть рефакторинга FrequencyEditor.tsx (705 строк)
 * Дата создания: 19 ноября 2024
 */
export const ByDaysOfWeekSection: React.FC<ByDaysOfWeekSectionProps> = ({
  isActive,
  daysOfWeek,
  onActivate,
  onDaysChange,
}) => {
  const handleDayToggle = (index: number) => {
    // Автоматически активируем этот тип частоты, если он неактивен
    if (!isActive) {
      onActivate();
      // После активации переключаем этот день
      setTimeout(() => {
        const currentDays = daysOfWeek || [];
        if (currentDays.includes(index)) {
          onDaysChange(currentDays.filter(d => d !== index));
        } else {
          onDaysChange([...currentDays, index].sort((a, b) => a - b));
        }
      }, 0);
      return;
    }
    
    // Если уже активен, просто переключаем день
    const currentDaysOfWeek = daysOfWeek || [];
    if (currentDaysOfWeek.includes(index)) {
      // Убираем день из выбора
      onDaysChange(currentDaysOfWeek.filter(d => d !== index));
    } else {
      // Добавляем день в выбор
      onDaysChange([...currentDaysOfWeek, index].sort((a, b) => a - b));
    }
  };

  return (
    <>
      {/* Кнопка "По дням" */}
      <FrequencyButton isActive={isActive} onActivate={onActivate}>
        <span>По дням</span>
      </FrequencyButton>

      {/* Селектор дней недели - всегда виден, но кликабелен только когда активен */}
      <div className={`space-y-2 px-3 py-2 rounded border transition-all ${
        isActive
          ? 'bg-gray-50 border-gray-200'
          : 'bg-gray-100 border-gray-200 opacity-60'
      }`}>
        <div className="text-sm text-gray-400">Выберите дни недели</div>
        <div className="grid grid-cols-7 gap-1">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
            const currentDaysOfWeek = daysOfWeek || [];
            const isSelected = currentDaysOfWeek.includes(index);
            const isDisabled = !isActive;
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDayToggle(index)}
                className={`aspect-square rounded border text-xs transition-all flex items-center justify-center ${
                  isDisabled
                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-pointer hover:bg-gray-300'
                    : isSelected
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};