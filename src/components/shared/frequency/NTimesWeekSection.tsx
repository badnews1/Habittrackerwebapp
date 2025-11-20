import React from 'react';
import { SingleInputFrequencySection } from './SingleInputFrequencySection';
import { declineTimesPerWeek } from '../../../utils/declineWords';

interface NTimesWeekSectionProps {
  isActive: boolean;
  count: number;
  localCount: number | undefined;
  onActivate: () => void;
  onCountChange: (value: string) => void;
  onCountBlur: () => void;
}

/**
 * Компонент для выбора частоты "N раз в неделю"
 * Использует универсальный SingleInputFrequencySection
 * Дата обновления: 19 ноября 2024
 */
export const NTimesWeekSection: React.FC<NTimesWeekSectionProps> = (props) => {
  return (
    <SingleInputFrequencySection
      isActive={props.isActive}
      value={props.count}
      localValue={props.localCount}
      onActivate={props.onActivate}
      onChange={props.onCountChange}
      onBlur={props.onCountBlur}
      defaultValue={5}
      min={1}
      max={7}
      declineWord={declineTimesPerWeek}
    />
  );
};