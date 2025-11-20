import React from 'react';
import { FrequencyButton } from './FrequencyButton';

interface DailyFrequencySectionProps {
  isActive: boolean;
  onActivate: () => void;
}

/**
 * Компонент для выбора частоты "Каждый день"
 * Часть рефакторинга FrequencyEditor.tsx (705 строк)
 * Дата создания: 19 ноября 2024
 */
export const DailyFrequencySection: React.FC<DailyFrequencySectionProps> = ({
  isActive,
  onActivate,
}) => {
  return (
    <FrequencyButton isActive={isActive} onActivate={onActivate}>
      <span>Каждый день</span>
    </FrequencyButton>
  );
};