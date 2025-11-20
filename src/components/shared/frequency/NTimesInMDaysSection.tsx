import React from 'react';
import { FrequencyButton } from './FrequencyButton';
import { FrequencyInput } from './FrequencyInput';
import { declineTimesIn, declineDays } from '../../../utils/declineWords';

interface NTimesInMDaysSectionProps {
  isActive: boolean;
  count: number;
  period: number;
  localCount: number | undefined;
  localPeriod: number | undefined;
  onActivate: () => void;
  onCountChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onCountBlur: () => void;
  onPeriodBlur: () => void;
}

/**
 * Компонент для выбора частоты "N раз в M дней"
 * Включает кнопку и два поля ввода с автоактивацией
 * Часть рефакторинга FrequencyEditor.tsx (705 строк)
 * Дата создания: 19 ноября 2024
 */
export const NTimesInMDaysSection: React.FC<NTimesInMDaysSectionProps> = ({
  isActive,
  count,
  period,
  localCount,
  localPeriod,
  onActivate,
  onCountChange,
  onPeriodChange,
  onCountBlur,
  onPeriodBlur,
}) => {
  // Значения для склонений
  const countForDeclension = isActive ? count : localCount;
  const periodForDeclension = isActive ? period : localPeriod;

  return (
    <FrequencyButton isActive={isActive} onActivate={onActivate}>
      <span className="flex items-center gap-2 flex-wrap">
        <FrequencyInput
          value={localCount}
          defaultValue={5}
          isActive={isActive}
          onActivate={onActivate}
          onChange={onCountChange}
          onBlur={onCountBlur}
          min={1}
          max={365}
        />
        <span>{declineTimesIn(countForDeclension)}</span>
        <FrequencyInput
          value={localPeriod}
          defaultValue={14}
          isActive={isActive}
          onActivate={onActivate}
          onChange={onPeriodChange}
          onBlur={onPeriodBlur}
          min={1}
          max={365}
        />
        {declineDays(periodForDeclension)}
      </span>
    </FrequencyButton>
  );
};