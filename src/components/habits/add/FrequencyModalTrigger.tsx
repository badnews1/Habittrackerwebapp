import React from 'react';
import { ChevronDown } from '../../icons';
import { formatFrequency } from '../../../utils/habitUtils';
import { FrequencyConfig } from '../../../types/habit';

interface FrequencyModalTriggerProps {
  /** Текущая частота */
  frequency: FrequencyConfig;
  
  /** Колбэк клика по кнопке */
  onClick: () => void;
}

/**
 * Кнопка-триггер для открытия модального окна редактирования частоты
 * 
 * Отображает текущую частоту в читаемом формате и открывает
 * модальное окно FrequencyModal при клике.
 * 
 * Дата создания: 19 ноября 2024
 * Дата переименования: 19 ноября 2025 (FrequencyButton → FrequencyModalTrigger)
 * Причина: Устранение конфликта имён с /components/shared/frequency/FrequencyButton.tsx
 */
export const FrequencyModalTrigger: React.FC<FrequencyModalTriggerProps> = ({
  frequency,
  onClick,
}) => {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">Частота</label>
      <button
        onClick={onClick}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer text-left flex items-center gap-2"
      >
        <span className="flex-1">{formatFrequency(frequency)}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};