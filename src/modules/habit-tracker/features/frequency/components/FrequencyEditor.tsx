/**
 * Главный компонент редактора частоты привычки
 * 
 * Координирует работу всех подкомпонентов для выбора типа частоты
 * и ввода параметров (дни недели, количество, период)
 * 
 * @module modules/habit-tracker/features/frequency/components
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { useFrequencyState } from '../hooks';
import type { FrequencyEditorProps } from '../types';
import { DailyFrequencySection } from './DailyFrequencySection';
import { ByDaysOfWeekSection } from './ByDaysOfWeekSection';
import { EveryNDaysSection } from './EveryNDaysSection';
import { NTimesWeekSection } from './NTimesWeekSection';
import { NTimesMonthSection } from './NTimesMonthSection';
import { NTimesInMDaysSection } from './NTimesInMDaysSection';

export const FrequencyEditor: React.FC<FrequencyEditorProps> = (props) => {
  const {
    frequencyType,
    frequencyCount,
    frequencyPeriod,
    daysOfWeek,
  } = props;

  // Вся логика состояния инкапсулирована в кастомном хуке
  const {
    localValues,
    handleTypeChange,
    handleCountChange,
    handlePeriodChange,
    handleDaysOfWeekChange,
    handleCountBlur,
    handlePeriodBlur,
  } = useFrequencyState(props);

  return (
    <div className="space-y-3">
      {/* Hide number input spinners */}
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Frequency Type Buttons */}
      <div className="flex flex-col gap-2">
        {/* Daily */}
        <DailyFrequencySection
          isActive={frequencyType === 'daily'}
          onActivate={() => handleTypeChange('daily')}
        />

        {/* By Days of Week */}
        <ByDaysOfWeekSection
          isActive={frequencyType === 'by_days_of_week'}
          daysOfWeek={localValues.by_days_of_week.days || daysOfWeek || []}
          onActivate={() => handleTypeChange('by_days_of_week')}
          onDaysChange={handleDaysOfWeekChange}
        />

        {/* N Times per Week */}
        <NTimesWeekSection
          isActive={frequencyType === 'n_times_week'}
          count={frequencyCount}
          localCount={localValues.n_times_week.count}
          onActivate={() => handleTypeChange('n_times_week')}
          onCountChange={(value) => handleCountChange(value, 'n_times_week')}
          onCountBlur={() => handleCountBlur('n_times_week')}
        />

        {/* N Times per Month */}
        <NTimesMonthSection
          isActive={frequencyType === 'n_times_month'}
          count={frequencyCount}
          localCount={localValues.n_times_month.count}
          onActivate={() => handleTypeChange('n_times_month')}
          onCountChange={(value) => handleCountChange(value, 'n_times_month')}
          onCountBlur={() => handleCountBlur('n_times_month')}
        />

        {/* Every N Days */}
        <EveryNDaysSection
          isActive={frequencyType === 'every_n_days'}
          period={frequencyPeriod}
          localPeriod={localValues.every_n_days.period}
          onActivate={() => handleTypeChange('every_n_days')}
          onPeriodChange={(value) => handlePeriodChange(value, 'every_n_days')}
          onPeriodBlur={() => handlePeriodBlur('every_n_days')}
        />

        {/* N Times in M Days */}
        <NTimesInMDaysSection
          isActive={frequencyType === 'n_times_in_m_days'}
          count={frequencyCount}
          localCount={localValues.n_times_in_m_days.count}
          period={frequencyPeriod}
          localPeriod={localValues.n_times_in_m_days.period}
          onActivate={() => handleTypeChange('n_times_in_m_days')}
          onCountChange={(value) => handleCountChange(value, 'n_times_in_m_days')}
          onPeriodChange={(value) => handlePeriodChange(value, 'n_times_in_m_days')}
          onCountBlur={() => handleCountBlur('n_times_in_m_days')}
          onPeriodBlur={() => handlePeriodBlur('n_times_in_m_days')}
        />
      </div>
    </div>
  );
};
