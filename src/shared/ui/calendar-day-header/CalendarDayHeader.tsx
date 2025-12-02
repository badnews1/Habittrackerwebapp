/**
 * Заголовок календаря с днями недели и числами
 * 
 * Переиспользуемый глупый компонент для отображения шапки календаря.
 * Используется в habit-calendar и habit-daily-chart виджетах.
 * 
 * @module shared/ui/calendar-day-header
 * @migrated 30 ноября 2025 - перемещён из features/habit-calendar в shared/ui (FSD)
 * @refactored 2 декабря 2025 - убран mb-4, spacing управляется родителем
 */

import React from 'react';

interface CalendarDayHeaderProps {
  monthDays: { date: Date; day: number }[];
  getDayName: (date: Date) => string;
}

export function CalendarDayHeader({
  monthDays,
  getDayName,
}: CalendarDayHeaderProps) {
  // Padding для выравнивания с реальными точками графика (пропуск фиктивных точек)
  // Расчёт: (ширина колонки + gap) / 2 + небольшая корректировка
  const paddingStyle = monthDays.length === 28 
    ? 'px-[18px]' // скорректировано для точного выравнивания
    : monthDays.length === 29 
    ? 'px-[17.5px]' 
    : monthDays.length === 30 
    ? 'px-[17px]' 
    : 'px-[16.5px]';

  return (
    <div className={paddingStyle}>
      {/* Дни недели */}
      <div className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`} style={{ transform: 'translateY(5px)' }}>
        {monthDays.map((dayData) => (
          <div
            key={`calendar-header-day-${dayData.day}`}
            className="w-6 h-3 flex-shrink-0 flex items-center justify-center uppercase text-text-primary"
            style={{ fontWeight: 600, fontSize: '7px' }}
          >
            {getDayName(dayData.date)}
          </div>
        ))}
      </div>
      {/* Числа месяца */}
      <div className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`} style={{ transform: 'translateY(5px)' }}>
        {monthDays.map((dayData) => {
          // Проверяем, является ли этот день сегодняшним
          const today = new Date();
          const isToday = 
            dayData.date.getDate() === today.getDate() &&
            dayData.date.getMonth() === today.getMonth() &&
            dayData.date.getFullYear() === today.getFullYear();
          
          return (
            <div
              key={`calendar-header-num-${dayData.day}`}
              className="w-6 h-3 flex-shrink-0 flex flex-col items-center justify-center text-xs text-[7px] relative text-text-secondary"
              style={{ 
                fontWeight: isToday ? 700 : 400
              }}
            >
              {dayData.day}
              {/* Индикатор сегодняшнего дня */}
              {isToday && (
                <div 
                  className="absolute bottom-0 w-1 h-1 rounded-full bg-text-secondary"
                  style={{ 
                    transform: 'translateY(2px)'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}