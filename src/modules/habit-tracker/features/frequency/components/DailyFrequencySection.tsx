/**
 * Компонент для выбора частоты "Каждый день"
 * 
 * @module modules/habit-tracker/features/frequency/components
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { FrequencyButton } from './FrequencyButton';

interface DailyFrequencySectionProps {
  isActive: boolean;
  onActivate: () => void;
}

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
