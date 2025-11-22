/**
 * Компонент для выбора частоты "N раз в неделю"
 * 
 * Использует универсальный SingleInputFrequencySection
 * 
 * @module modules/habit-tracker/features/frequency/components
 * @migrated 22 ноября 2025
 */

import { SingleInputFrequencySection } from './SingleInputFrequencySection';
import { declineTimesPerWeek } from '@/shared/utils/text';

interface NTimesWeekSectionProps {
  isActive: boolean;
  count: number;
  localCount: number | undefined;
  onActivate: () => void;
  onCountChange: (value: string) => void;
  onCountBlur: () => void;
}

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
