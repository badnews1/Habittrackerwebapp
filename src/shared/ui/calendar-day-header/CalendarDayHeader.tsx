/**
 * Заголовок календаря с днями недели и числами
 * 
 * Переиспользуемый глупый компонент для отображения шапки календаря.
 * Используется в habit-calendar и habit-daily-chart виджетах.
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
  // Динамический расчёт padding для выравнивания с реальными точками графика
  // Базовое значение 20px для 28 дней, уменьшается на 0.5px за каждый дополнительный день
  // Результаты: 28 дней = 20px, 29 дней = 19.5px, 30 дней = 19px, 31 день = 18.5px
  const paddingPx = 20 - (monthDays.length - 28) * 0.5;
  
  // Динамический расчёт gap между днями
  // Базовое значение 7px для 28 дней, уменьшается на 1px за каждый дополнительный день
  // Результаты: 28 дней = 7px, 29 дней = 6px, 30 дней = 5px, 31 день = 4px
  const gapPx = 7 - (monthDays.length - 28);

  return (
    <div style={{ paddingLeft: `${paddingPx}px`, paddingRight: `${paddingPx}px` }}>
      {/* Дни недели */}
      <div className="flex" style={{ gap: `${gapPx}px`, transform: 'translateY(5px)' }}>
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
      <div className="flex" style={{ gap: `${gapPx}px`, transform: 'translateY(5px)' }}>
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