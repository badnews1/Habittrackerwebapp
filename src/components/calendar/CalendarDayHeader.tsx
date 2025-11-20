import React from 'react';

interface CalendarDayHeaderProps {
  monthDays: { date: Date; day: number }[];
  getDayName: (date: Date) => string;
}

export function CalendarDayHeader({
  monthDays,
  getDayName,
}: CalendarDayHeaderProps) {
  return (
    <div className="mb-4">
      {/* Days of Week */}
      <div className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`} style={{ transform: 'translateY(5px)' }}>
        {monthDays.map((dayData) => (
          <div
            key={`calendar-header-day-${dayData.day}`}
            className="w-6 h-3 flex-shrink-0 flex items-center justify-center uppercase text-gray-900"
            style={{ fontWeight: 600, fontSize: '7px' }}
          >
            {getDayName(dayData.date)}
          </div>
        ))}
      </div>
      {/* Day Numbers */}
      <div className={`flex ${monthDays.length === 28 ? 'gap-[7px]' : monthDays.length === 29 ? 'gap-[6px]' : monthDays.length === 30 ? 'gap-[5px]' : 'gap-1'}`} style={{ transform: 'translateY(5px)' }}>
        {monthDays.map((dayData) => {
          // Check if this is today
          const today = new Date();
          const isToday = 
            dayData.date.getDate() === today.getDate() &&
            dayData.date.getMonth() === today.getMonth() &&
            dayData.date.getFullYear() === today.getFullYear();
          
          return (
            <div
              key={`calendar-header-num-${dayData.day}`}
              className="w-6 h-3 flex-shrink-0 flex flex-col items-center justify-center text-xs text-[7px] relative text-gray-500"
              style={{ 
                fontWeight: isToday ? 700 : 400
              }}
            >
              {dayData.day}
              {/* Today indicator dot */}
              {isToday && (
                <div 
                  className="absolute bottom-0 w-1 h-1 rounded-full"
                  style={{ 
                    backgroundColor: '#6b7280',
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
