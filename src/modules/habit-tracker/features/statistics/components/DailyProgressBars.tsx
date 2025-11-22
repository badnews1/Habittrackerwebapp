/**
 * Дневные прогресс-бары для заголовка календаря
 * 
 * @module modules/habit-tracker/features/statistics
 */

import React from 'react';
import { Habit } from '@/modules/habit-tracker/types';
import { isHabitCompletedForDate } from '@/modules/habit-tracker/features/habits/utils';

interface DailyProgressBarsProps {
  monthDays: { date: Date; day: number }[];
  habits: Habit[];
  dailyGoals: { [date: string]: number };
  formatDate: (date: Date) => string;
}

export function DailyProgressBars({
  monthDays,
  habits,
  dailyGoals,
  formatDate,
}: DailyProgressBarsProps) {
  return (
    <div className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`} style={{ marginLeft: '17px' }}>
      {monthDays.map((dayData) => {
        const dateStr = formatDate(dayData.date);
        const totalHabits = habits.length;
        const completedHabits = habits.filter(
          (habit) => isHabitCompletedForDate(habit, dateStr)
        ).length;
        const skippedHabits = habits.filter(
          (habit) => habit.skipped?.[dateStr]
        ).length;
        const goalValue = dailyGoals[dateStr] !== undefined ? dailyGoals[dateStr] : totalHabits;
        const adjustedGoal = Math.max(0, goalValue - skippedHabits);
        const percentage = adjustedGoal > 0 ? (completedHabits / adjustedGoal) * 100 : 0;
        
        return (
          <div
            key={`progress-${dayData.day}`}
            className="w-6 flex-shrink-0 flex flex-col items-center"
          >
            <div className="w-2 h-[119px] overflow-hidden flex flex-col justify-end mb-1 mx-auto">
              <div
                className="w-full rounded-full transition-all duration-300 bg-gray-900"
                style={{ height: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <span className="text-[7px] font-bold text-gray-500">
              {Math.round(percentage)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}