import React from 'react';
import { Habit } from '../../types/habit';
import { isHabitCompletedForDate, getMonthlyGoalFromFrequency } from '../../utils/habitUtils';

export function MonthlyCircle({
  habits,
  monthDays,
  formatDate,
  dailyGoals,
  selectedMonth,
  selectedYear,
}: {
  habits: Habit[];
  monthDays: { date: Date; day: number }[];
  formatDate: (date: Date) => string;
  dailyGoals: { [date: string]: number };
  selectedMonth: number;
  selectedYear: number;
}) {
  // Calculate total possible completions and actual completions
  const daysInMonth = monthDays.length;
  
  // Calculate total possible based on frequency
  let dailyTotalPossible = 0;
  habits.forEach(habit => {
    const goalValue = getMonthlyGoalFromFrequency(habit.frequency, daysInMonth, selectedMonth, selectedYear);
    dailyTotalPossible += goalValue;
  });
  
  const dailyTotalCompleted = monthDays.reduce((total, dayData) => {
    const dateStr = formatDate(dayData.date);
    const completedOnDay = habits.filter((habit) => isHabitCompletedForDate(habit, dateStr)).length;
    return total + completedOnDay;
  }, 0);

  // Use only daily totals
  const totalPossible = dailyTotalPossible;
  const totalCompleted = dailyTotalCompleted;

  const percentage = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
  
  // SVG circle parameters
  const size = 100;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Cap percentage at 100% for visual display
  const displayPercentage = Math.min(percentage, 100);
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

  // Ensure values are valid numbers
  const safePercentage = isNaN(percentage) ? 0 : percentage;
  const safeTotalCompleted = isNaN(totalCompleted) ? 0 : totalCompleted;
  const safeTotalPossible = isNaN(totalPossible) ? 0 : totalPossible;

  return (
    <div className={`flex-shrink-0 ${monthDays.length === 28 ? 'w-[283px] min-w-[283px] max-w-[283px]' : 'w-[280px] min-w-[280px] max-w-[280px]'} bg-gray-50 rounded-2xl border border-gray-100 p-4`} style={{ marginLeft: '17px' }}>
      <div className="flex items-center justify-center gap-4">
        {/* Left text section */}
        <div className="flex flex-col items-start justify-center">
          <div className="text-gray-400 uppercase tracking-wider" style={{ fontSize: '8px', fontWeight: 600, marginBottom: '8px' }}>
            Прогресс
          </div>
          <div className="text-gray-900" style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1 }}>
            {Math.round(safePercentage)}%
          </div>
        </div>
        
        {/* Circle chart */}
        <div className="w-[100px] h-[100px] relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#171717"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          {/* Text in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500" style={{ fontSize: `${safeTotalCompleted} / ${safeTotalPossible}`.length >= 11 ? '12px' : '14px', fontWeight: 400, lineHeight: 1 }}>
              {safeTotalCompleted}
              <span className="text-gray-400" style={{ fontWeight: 400, margin: '0 5px' }}>/</span>
              <span className="text-gray-900" style={{ fontWeight: 700 }}>{safeTotalPossible}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
