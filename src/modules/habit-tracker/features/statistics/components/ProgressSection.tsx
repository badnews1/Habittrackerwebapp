/**
 * Секция прогресса выполнения привычек за месяц
 * 
 * @module modules/habit-tracker/features/statistics
 */

import React from 'react';
import { Habit } from '@/modules/habit-tracker/types';
import { DateConfig } from '@/modules/habit-tracker/features/habits/types';
import { isHabitCompletedForDate, getMonthlyGoalFromFrequency } from '@/modules/habit-tracker/features/habits/utils';

interface ProgressSectionProps {
  habits: Habit[];
  dateConfig: DateConfig;
}

export function ProgressSection({
  habits,
  dateConfig,
}: ProgressSectionProps) {
  const { monthDays, formatDate, selectedMonth, selectedYear } = dateConfig;

  return (
    <div className={`${monthDays.length === 28 ? 'w-[283px] min-w-[283px] max-w-[283px]' : monthDays.length === 30 ? 'w-[279px] min-w-[279px] max-w-[279px]' : 'w-[280px] min-w-[280px] max-w-[280px]'} bg-gray-50 rounded-2xl border border-gray-100 p-4`}>
      {/* Header for Progress Section */}
      <div className="mb-4 text-center flex items-center justify-center" style={{ height: 24, position: 'relative', top: 5 }}>
        <span className="text-[11px] text-gray-900 tracking-wider uppercase" style={{ fontWeight: 600 }}>
          Прогресс за месяц
        </span>
      </div>
      
      {/* Progress bars */}
      <div className="space-y-0.5">
        {habits.map((habit) => {
          const completedCount = monthDays.filter(dayData => isHabitCompletedForDate(habit, formatDate(dayData.date))).length;
          const daysInMonth = monthDays.length;
          
          // Get monthly goal from frequency
          const goalValue = getMonthlyGoalFromFrequency(habit.frequency, daysInMonth, selectedMonth, selectedYear);
          
          const percentage = goalValue > 0 ? Math.round((completedCount / goalValue) * 100) : 0;
          const safePercentage = isNaN(percentage) ? 0 : percentage;
          // Cap percentage at 100% for visual display
          const displayPercentage = Math.min(safePercentage, 100);
          
          return (
            <div key={habit.id} className="flex items-center h-8">
              {/* Percentage */}
              <div className="w-6 text-right text-[8px] text-gray-500 font-bold">
                {safePercentage}%
              </div>
              {/* Gap */}
              <div className="w-2" />
              {/* Progress Bar */}
              <div className="w-[141px] flex-shrink-0 relative h-2 bg-white rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 rounded-full transition-all duration-300"
                  style={{ width: `${displayPercentage}%` }}
                />
              </div>
              {/* Gap */}
              <div className="w-[32px]" />
              {/* Completion count text */}
              <div className="text-[8px] text-gray-500 -ml-[5px] w-[60px] text-right" style={{ fontWeight: 600 }}>
                {completedCount} / {goalValue}
              </div>
            </div>
          );
        })}
        
        {/* Separator */}
        {habits.length > 0 && <div className="my-2 border-t border-gray-200" />}
        
        {/* Total Progress Bar */}
        {habits.length > 0 && (() => {
          const daysInMonth = monthDays.length;
          
          // Calculate total completions and goals for habits with names
          let totalCompleted = 0;
          let totalGoal = 0;
          
          habits.forEach(habit => {
            const completedCount = monthDays.filter(dayData => isHabitCompletedForDate(habit, formatDate(dayData.date))).length;
            const goalValue = getMonthlyGoalFromFrequency(habit.frequency, daysInMonth, selectedMonth, selectedYear);
            
            totalCompleted += completedCount;
            totalGoal += goalValue;
          });
          
          const totalPercentage = totalGoal > 0 ? Math.round((totalCompleted / totalGoal) * 100) : 0;
          const safeTotalPercentage = isNaN(totalPercentage) ? 0 : totalPercentage;
          const safeTotalCompleted = isNaN(totalCompleted) ? 0 : totalCompleted;
          const safeTotalGoal = isNaN(totalGoal) ? 0 : totalGoal;
          // Cap percentage at 100% for visual display
          const displayTotalPercentage = Math.min(safeTotalPercentage, 100);
          
          return (
            <div className="flex items-center h-6">
              {/* Percentage */}
              <div className="w-6 text-right text-[8px] text-gray-500 font-bold">
                {safeTotalPercentage}%
              </div>
              {/* Gap */}
              <div className="w-2" />
              {/* Progress Bar */}
              <div className="w-[141px] flex-shrink-0 relative h-2 bg-white rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 rounded-full transition-all duration-300"
                  style={{ width: `${displayTotalPercentage}%` }}
                />
              </div>
              {/* Gap */}
              <div className="w-[32px]" />
              {/* Completion count text */}
              <div className="text-[8px] text-gray-500 -ml-[5px] w-[60px] text-right" style={{ fontWeight: 600 }}>
                {safeTotalCompleted} / {safeTotalGoal}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}