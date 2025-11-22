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
  const toggleAllForDay = useHabitsStore(state => state.toggleAllForDay);
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
        
        {/* Separator line */}
        {habits.length > 0 && <div className="my-2 border-t border-gray-200"></div>}
        
        {/* Toggle All for Day Row */}
        {habits.length > 0 && (
          <div className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'} h-6 items-center`}>
            {monthDays.map((dayData, dayIndex) => {
              const dateStr = formatDate(dayData.date);
              // Only check binary habits that don't have a cross on this day
              const binaryHabitsWithoutCross = habits.filter(h => h.type === 'binary' && !h.skipped?.[dateStr]);
              // Button is active if all non-crossed binary habits are completed, or if all binary habits are crossed
              const allCompleted = (binaryHabitsWithoutCross.length === 0 && habits.filter(h => h.type === 'binary').length > 0) || 
                                   (binaryHabitsWithoutCross.length > 0 && binaryHabitsWithoutCross.every(h => h.completions[dateStr]));

              return (
                <div key={`calendar-toggle-all-${dayIndex}`} className="w-6 flex-shrink-0 flex items-center justify-center">
                  <button
                    onClick={() => toggleAllForDay(dateStr)}
                    className="w-4 h-4 rounded transition-all hover:scale-105 flex items-center justify-center bg-transparent"
                    title={`Отметить все за ${dayData.day}`}
                  >
                    <svg
                      className={`w-3 h-3 ${allCompleted ? 'text-gray-900' : 'text-gray-300'}`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}