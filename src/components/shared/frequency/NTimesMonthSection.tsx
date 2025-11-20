import React from 'react';
import { SingleInputFrequencySection } from './SingleInputFrequencySection';
import { declineTimesPerMonth } from '../../../utils/declineWords';

interface NTimesMonthSectionProps {
  isActive: boolean;
  count: number;
  localCount: number | undefined;
  onActivate: () => void;
  onCountChange: (value: string) => void;
  onCountBlur: () => void;
}

/**
 * Компонент для выбора частоты "N раз в месяц"
 * Использует универсальный SingleInputFrequencySection
 * Дата обновления: 19 ноября 2024
 */
export const NTimesMonthSection: React.FC<NTimesMonthSectionProps> = (props) => {
  return (
    <SingleInputFrequencySection
      isActive={props.isActive}
      value={props.count}
      localValue={props.localCount}
      onActivate={props.onActivate}
      onChange={props.onCountChange}
      onBlur={props.onCountBlur}
      defaultValue={10}
      min={1}
      max={31}
      declineWord={declineTimesPerMonth}
    />
  );
};