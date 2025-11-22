/**
 * Компонент для выбора частоты "N раз в месяц"
 * 
 * Использует универсальный SingleInputFrequencySection
 * 
 * @module modules/habit-tracker/features/frequency/components
 * @migrated 22 ноября 2025
 */

import { SingleInputFrequencySection } from './SingleInputFrequencySection';
import { declineTimesPerMonth } from '@/shared/utils/text';

interface NTimesMonthSectionProps {
  isActive: boolean;
  count: number;
  localCount: number | undefined;
  onActivate: () => void;
  onCountChange: (value: string) => void;
  onCountBlur: () => void;
}

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
