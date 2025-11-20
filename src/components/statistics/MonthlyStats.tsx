import React from 'react';
import { Close, Undo } from '../icons';
import { Habit } from '../../types/habit';
import { DateConfig, GoalConfig, UndoConfig } from '../../types/habitsTableProps';
import { isHabitCompletedForDate, getMonthlyGoalFromFrequency } from '../../utils/habitUtils';

interface MonthlyStatsProps {
  habits: Habit[];
  dateConfig: DateConfig;
  goalConfig: GoalConfig;
  undoConfig: UndoConfig;
  hasAnyCompletions: boolean;
}

export function MonthlyStats({
  habits,
  dateConfig,
  goalConfig,
  undoConfig,
  hasAnyCompletions,
}: MonthlyStatsProps) {
  const { monthDays, formatDate, selectedMonth, selectedYear } = dateConfig;
  const { defaultDailyGoal, onSetDefaultDailyGoal } = goalConfig;
  const { canUndo, onClearAllCompletions, onUndoClearAllCompletions } = undoConfig;

  return (
    <div className="flex flex-col gap-4 w-[262px]">
      {/* Pie Chart Section */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 w-[262px]" style={{ height: '198px' }}>
        <div className="mb-4 text-center flex items-center justify-center" style={{ height: '24px', marginTop: '6px' }}>
          <span className="text-[11px] text-gray-900 tracking-wider uppercase" style={{ fontWeight: 600 }}>
            Статистика за месяц
          </span>
        </div>
        
        <div className="flex items-center justify-start gap-4" style={{ width: '100%', height: 100, paddingLeft: '16px', marginTop: '20px' }}>
          {(() => {
            // Calculate total possible for each habit based on frequency
            let totalPossible = 0;
            const daysInMonth = monthDays.length;
            habits.forEach(habit => {
              const goalValue = getMonthlyGoalFromFrequency(habit.frequency, daysInMonth, selectedMonth, selectedYear);
              totalPossible += goalValue;
            });
            
            const totalCompleted = monthDays.reduce((total, dayData) => {
              const dateStr = formatDate(dayData.date);
              const completedOnDay = habits.filter(habit => isHabitCompletedForDate(habit, dateStr)).length;
              return total + completedOnDay;
            }, 0);

            const percentage = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
            const safePercentage = isNaN(percentage) ? 0 : percentage;
            const safeTotalCompleted = isNaN(totalCompleted) ? 0 : totalCompleted;
            const safeTotalPossible = isNaN(totalPossible) ? 0 : totalPossible;
            
            // SVG circle parameters
            const size = 100;
            const strokeWidth = 7;
            const radius = (size - strokeWidth) / 2;
            const circumference = 2 * Math.PI * radius;
            // Cap percentage at 100% for visual display
            const displayPercentage = Math.min(percentage, 100);
            const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

            return (
              <>
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-gray-900" style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1 }}>
                      {Math.round(safePercentage)}%
                    </div>
                    <div className="text-gray-400 uppercase tracking-wider" style={{ fontSize: '8px', fontWeight: 600, marginTop: '4px' }}>
                      Прогресс
                    </div>
                  </div>
                </div>
                
                {/* Text section */}
                <div className="inline-flex flex-col items-start justify-center" style={{ height: '100px' }}>
                  <div className="text-gray-900 uppercase tracking-wider" style={{ fontSize: '8px', fontWeight: 600, marginBottom: '8px', width: 'fit-content' }}>
                    Привычки
                  </div>
                  <div className="text-gray-500" style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1 }}>
                    {safeTotalCompleted}
                    <span className="text-gray-400" style={{ fontWeight: 400, margin: '0 5px' }}>/</span>
                    <span className="text-gray-900" style={{ fontWeight: 700 }}>{safeTotalPossible}</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Stats Section Below */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-visible" style={{ width: 262 }}>
        {(() => {
          // Calculate total possible for each habit individually
          let totalPossible = 0;
          const daysInMonth = monthDays.length;
          habits.forEach(habit => {
            const goalValue = getMonthlyGoalFromFrequency(habit.frequency, daysInMonth, selectedMonth, selectedYear);
            totalPossible += goalValue;
          });
          
          const totalCompleted = monthDays.reduce((total, dayData) => {
            const dateStr = formatDate(dayData.date);
            const completedOnDay = habits.filter(habit => isHabitCompletedForDate(habit, dateStr)).length;
            return total + completedOnDay;
          }, 0);

          const percentage = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
          const safePercentage = isNaN(percentage) ? 0 : percentage;
          const safeTotalCompleted = isNaN(totalCompleted) ? 0 : totalCompleted;
          const safeTotalPossible = isNaN(totalPossible) ? 0 : totalPossible;
          const notCompleted = Math.max(0, safeTotalPossible - safeTotalCompleted);
          
          return (
            <>
              {/* Статистика выполнения */}
              <div className="px-6 pb-5 pt-[23px] flex gap-6 w-[262px] -mt-[1px]">
                <div className="flex flex-col items-start">
                  <div className="text-gray-400 mb-2" style={{ fontSize: 8, letterSpacing: '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap', height: 10 }}>
                    Выполнено
                  </div>
                  <div className="text-gray-900" style={{ fontSize: 26, fontWeight: 300, lineHeight: 1 }}>
                    {totalCompleted}
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-gray-400 mb-2" style={{ fontSize: 8, letterSpacing: '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap', height: 10 }}>
                    Не выполнено
                  </div>
                  <div className="text-gray-900" style={{ fontSize: 26, fontWeight: 300, lineHeight: 1 }}>
                    {notCompleted}
                  </div>
                </div>
                <div className="flex flex-col items-start" style={{ marginTop: -1 }}>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="text-gray-400" style={{ fontSize: 8, letterSpacing: '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap', height: 10, marginTop: 1 }}>
                      Цель
                    </div>
                    <div className="relative group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 10, marginTop: 1 }}>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="10" 
                        height="10" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="cursor-help text-gray-400"
                      >
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-4 py-2 bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" style={{ fontSize: 12, fontWeight: 400, letterSpacing: 'normal', textTransform: 'none', zIndex: 1000, width: '340px', whiteSpace: 'normal', lineHeight: '1.4', textAlign: 'justify' }}>
                        Вы можете установить ежедневную цель по количеству выполненных привычек. Прогресс за день будет считаться 100%, как только вы достигнете заданной цели.
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-900" style={{ fontSize: 26, fontWeight: 300, lineHeight: 1 }}>
                    <input
                      type="text"
                      min="0"
                      value={defaultDailyGoal}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only digits
                        if (/^\d*$/.test(value)) {
                          onSetDefaultDailyGoal(value);
                        }
                      }}
                      placeholder={habits.length.toString()}
                      className="bg-transparent border-none outline-none text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ fontSize: 26, fontWeight: 300, lineHeight: 1, padding: 0, margin: 0, width: '3ch', marginTop: -3 }}
                    />
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </div>
      
      {/* Clear All Button - Below the gray section */}
      <div style={{ width: 262, marginTop: '0px' }} className="flex gap-2">
        <button
          onClick={onClearAllCompletions}
          disabled={!hasAnyCompletions}
          className="px-4 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:border-gray-200"
          style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', paddingTop: '17.5px', paddingBottom: '17.5px', flex: 1 }}
        >
          <Close className="w-3.5 h-3.5" />
          Снять все отметки
        </button>
        <button
          onClick={onUndoClearAllCompletions}
          disabled={!canUndo}
          className="border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 rounded-xl transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-500 disabled:hover:border-gray-200"
          style={{ paddingTop: '17.5px', paddingBottom: '17.5px', paddingLeft: '17.5px', paddingRight: '17.5px' }}
          title="Отменить снятие галочек"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
