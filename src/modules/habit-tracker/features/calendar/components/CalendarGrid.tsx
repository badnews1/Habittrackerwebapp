/**
 * Сетка календаря с чекбоксами для отметки выполнения привычек
 * 
 * Мигрирован на Zustand - берет actions напрямую из store
 * 
 * @module modules/habit-tracker/features/calendar
 */

import React from 'react';
import { Habit } from '@/modules/habit-tracker/types';
import { DateConfig } from '@/modules/habit-tracker/features/habits/types';
import { CalendarDayHeader } from './CalendarDayHeader';
import { HabitCheckboxCell } from '@/modules/habit-tracker/features/habits';
import { useHabitsStore } from '@/core/store';

interface CalendarGridProps {
  habits: Habit[];
  dateConfig: DateConfig;
}

export function CalendarGrid({
  habits,
  dateConfig,
}: CalendarGridProps) {
  // Получаем actions из store
  const toggleCompletion = useHabitsStore(state => state.toggleCompletion);
  const updateHabit = useHabitsStore(state => state.updateHabit);
  const openNumericInputModal = useHabitsStore(state => state.openNumericInputModal);

  const { monthDays, formatDate, getDayName } = dateConfig;

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
      {/* Calendar Header */}
      <CalendarDayHeader
        monthDays={monthDays}
        getDayName={getDayName}
      />

      {/* Habit Checkboxes Only */}
      <div className="space-y-0.5">
        {habits.map((habit) => (
          <div key={habit.id} className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'} h-8 items-center`}>
            {monthDays.map((dayData, dayIndex) => {
              const dateStr = formatDate(dayData.date);
              return (
                <HabitCheckboxCell
                  key={`calendar-cell-${habit.id}-${dayIndex}`}
                  habit={habit}
                  dayData={dayData}
                  dayIndex={dayIndex}
                  dateStr={dateStr}
                  onToggleCompletion={toggleCompletion}
                  onUpdateHabit={updateHabit}
                  onOpenNumericInput={openNumericInputModal}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}