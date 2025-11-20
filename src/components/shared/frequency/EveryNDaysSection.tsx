import React from 'react';
import { SingleInputFrequencySection } from './SingleInputFrequencySection';
import { declineDays } from '../../../utils/declineWords';

interface EveryNDaysSectionProps {
  isActive: boolean;
  period: number;
  localPeriod: number | undefined;
  onActivate: () => void;
  onPeriodChange: (value: string) => void;
  onPeriodBlur: () => void;
}

/**
 * Компонент для выбора частоты "Каждые N дней"
 * Использует универсальный SingleInputFrequencySection
 * Дата обновления: 19 ноября 2024
 */
export const EveryNDaysSection: React.FC<EveryNDaysSectionProps> = (props) => {
  return (
    <SingleInputFrequencySection
      isActive={props.isActive}
      value={props.period}
      localValue={props.localPeriod}
      onActivate={props.onActivate}
      onChange={props.onPeriodChange}
      onBlur={props.onPeriodBlur}
      defaultValue={5}
      min={1}
      max={365}
      declineWord={declineDays}
      prefix="Каждые"
    />
  );
};