import React from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { Habit } from '../../types/habit';
import { DateConfig, GoalConfig } from '../../types/habitsTableProps';
import { isHabitCompletedForDate, getMonthlyGoalFromFrequency } from '../../utils/habitUtils';

interface StrengthChartProps {
  habits: Habit[];
  dateConfig: DateConfig;
  goalConfig: GoalConfig;
}

export function StrengthChart({
  habits,
  dateConfig,
  goalConfig,
}: StrengthChartProps) {
  const { monthDays, formatDate, getDayName, selectedMonth, selectedYear } = dateConfig;
  const { dailyGoals, editingGoal, onSetDailyGoals, onSetEditingGoal } = goalConfig;

  return (
    <>
      {/* Area Chart Section */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
        {/* Chart Header */}
        <div className="mb-4" style={{ paddingTop: '6px' }}>
          {/* Days of Week */}
          <div className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`}>
            {monthDays.map((dayData) => (
              <div
                key={`chart-header-day-${dayData.day}`}
                className="w-6 h-3 flex-shrink-0 flex items-center justify-center uppercase text-gray-900"
                style={{ fontWeight: 600, fontSize: '7px' }}
              >
                {getDayName(dayData.date)}
              </div>
            ))}
          </div>
          {/* Day Numbers */}
          <div className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`}>
            {monthDays.map((dayData) => {
              // Check if this is today
              const today = new Date();
              const isToday = 
                dayData.date.getDate() === today.getDate() &&
                dayData.date.getMonth() === today.getMonth() &&
                dayData.date.getFullYear() === today.getFullYear();
              
              return (
                <div
                  key={`chart-header-num-${dayData.day}`}
                  className="w-6 h-3 flex-shrink-0 flex flex-col items-center justify-center relative text-gray-500"
                  style={{ 
                    fontWeight: isToday ? 700 : 400,
                    fontSize: '7px'
                  }}
                >
                  {dayData.day}
                  {/* Today indicator dot */}
                  {isToday && (
                    <div 
                      className="absolute bottom-0 w-1 h-1 rounded-full"
                      style={{ 
                        backgroundColor: '#6b7280',
                        transform: 'translateY(3px)'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div style={{ width: 'calc(100% + 32px)', height: 230, marginLeft: '-16px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={(() => {
                const realData = monthDays.map((dayData) => {
                  const dateStr = formatDate(dayData.date);
                  const completedHabits = habits.filter(habit => isHabitCompletedForDate(habit, dateStr)).length;
                  
                  return {
                    day: dayData.day,
                    completed: completedHabits
                  };
                });
                
                const lastDay = monthDays[monthDays.length - 1]?.day || 31;
                // Add dummy points at the edges
                return [
                  { day: 0, completed: realData[0]?.completed || 0 },
                  ...realData,
                  { day: lastDay + 1, completed: realData[realData.length - 1]?.completed || 0 }
                ];
              })()}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#171717" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#171717" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                hide={true}
                type="category"
                scale="point"
                padding={{ left: 0, right: 0 }}
              />
              <YAxis hide={true} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
                labelStyle={{ color: '#171717', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#171717"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompleted)"
                name="Выполнено"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Completion Percentage */}
        <div className={`mt-4 flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`}>
          {monthDays.map((dayData, dayIndex) => {
            const dateStr = formatDate(dayData.date);
            const totalHabits = habits.length;
            const completedHabits = habits.filter(habit => isHabitCompletedForDate(habit, dateStr)).length;
            const skippedHabits = habits.filter(habit => habit.skipped?.[dateStr]).length;
            const goalValue = dailyGoals[dateStr] !== undefined ? dailyGoals[dateStr] : totalHabits;
            const adjustedGoal = Math.max(0, goalValue - skippedHabits);
            const percentage = adjustedGoal > 0 ? Math.round((completedHabits / adjustedGoal) * 100) : 0;

            return (
              <div
                key={`chart-stats-percentage-${dayIndex}`}
                className="w-6 h-3 flex-shrink-0 flex items-center justify-center text-gray-500"
                style={{ fontSize: '7px', fontWeight: 600 }}
              >
                {percentage}%
              </div>
            );
          })}
        </div>

        {/* Daily Completion Count */}
        <div className={`mt-1 flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`}>
          {monthDays.map((dayData, dayIndex) => {
            const dateStr = formatDate(dayData.date);
            const completedHabits = habits.filter(habit => isHabitCompletedForDate(habit, dateStr)).length;

            return (
              <div
                key={`chart-stats-count-${dayIndex}`}
                className="w-6 h-3 flex-shrink-0 flex items-center justify-center text-gray-400"
                style={{ fontSize: '7px', fontWeight: 500 }}
              >
                {completedHabits}
              </div>
            );
          })}
        </div>

        {/* Total Habits Per Day */}
        <div className={`mt-1 flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`}>
          {monthDays.map((dayData, dayIndex) => {
            const dateStr = formatDate(dayData.date);
            const defaultTotal = habits.length;
            const goalValue = dailyGoals[dateStr] !== undefined ? dailyGoals[dateStr] : defaultTotal;
            const isEditing = editingGoal === dateStr;
            const skippedHabits = habits.filter(habit => habit.skipped?.[dateStr]).length;
            const adjustedGoal = Math.max(0, goalValue - skippedHabits);

            return (
              <div
                key={`chart-stats-total-${dayIndex}`}
                className="w-6 h-3 flex-shrink-0 flex items-center justify-center text-gray-400"
                style={{ fontSize: '7px', fontWeight: 500 }}
              >
                {isEditing ? (
                  <input
                    type="text"
                    min="0"
                    max="99"
                    value={goalValue}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Allow only digits
                      if (/^\d*$/.test(inputValue)) {
                        const value = Math.max(0, Math.min(99, parseInt(inputValue) || 0));
                        onSetDailyGoals({ ...dailyGoals, [dateStr]: value });
                      }
                    }}
                    onBlur={() => onSetEditingGoal(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSetEditingGoal(null);
                      }
                    }}
                    autoFocus
                    className="w-6 h-3 text-center border-none outline-none bg-transparent text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ fontSize: '7px', fontWeight: 500 }}
                  />
                ) : (
                  <span
                    onClick={() => onSetEditingGoal(dateStr)}
                    className="cursor-pointer hover:text-gray-600"
                  >
                    {adjustedGoal}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 10 Habits Section */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 pt-4 px-4 pb-[15px]" style={{ width: monthDays.length === 28 ? 283 : monthDays.length === 30 ? 279 : 280 }}>
        <div className="mb-4 text-center flex items-center justify-center" style={{ height: '24px', marginTop: '6px' }}>
          <span className="text-[11px] text-gray-900 tracking-wider uppercase" style={{ fontWeight: 600 }}>
            Топ 10 привычек
          </span>
        </div>
        
        <div className="space-y-[5px] -mt-[2px]">
          {(() => {
            // Calculate completion percentage for each habit
            const habitsWithStats = habits.map(habit => {
              const completedCount = monthDays.filter(dayData => isHabitCompletedForDate(habit, formatDate(dayData.date))).length;
              const daysInMonth = monthDays.length;
              
              // Get monthly goal from frequency
              const goalValue = getMonthlyGoalFromFrequency(habit.frequency, daysInMonth, selectedMonth, selectedYear);
              
              const percentage = goalValue > 0 ? Math.round((completedCount / goalValue) * 100) : 0;
              
              return {
                name: habit.name,
                percentage,
                completedCount,
              };
            });
            
            // Sort by percentage descending
            habitsWithStats.sort((a, b) => b.percentage - a.percentage);
            
            // Always show exactly 10 rows
            const displayRows = [];
            for (let i = 0; i < 10; i++) {
              if (i < habitsWithStats.length) {
                displayRows.push(habitsWithStats[i]);
              } else {
                displayRows.push(null);
              }
            }
            
            return displayRows.map((habit, index) => (
              <div key={`top-habit-${index}`} className="flex items-center h-6">
                {/* Rank number */}
                {habits.length > 0 && habit && (
                  <>
                    <div 
                      className="w-4 text-right text-[12px]"
                      style={{ color: '#000000' }}
                    >
                      {index + 1}
                    </div>
                    <div className="w-2" />
                  </>
                )}
                
                {habit ? (
                  <>
                    {/* Habit name */}
                    <div className="flex-1 min-w-0 h-full flex items-center max-w-[calc(100%-20px)]">
                      <div 
                        className="text-[12px] truncate"
                        style={{ color: '#000000' }}
                      >
                        {habit.name}
                      </div>
                    </div>
                    <div className="w-2" />
                    
                    {/* Percentage */}
                    <div className="w-[30px] text-right text-[8px] text-gray-500" style={{ fontWeight: 600 }}>
                      {habit.percentage}%
                    </div>
                  </>
                ) : (
                  <>
                    {/* Empty placeholder */}
                    <div className="flex-1 min-w-0 h-full" />
                    <div className="w-2" />
                    <div className="w-10" />
                  </>
                )}
              </div>
            ));
          })()}
        </div>
      </div>
    </>
  );
}
