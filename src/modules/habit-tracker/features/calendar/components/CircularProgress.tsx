/**
 * Круговая диаграмма прогресса для измеримых привычек
 * 
 * Отображает прогресс выполнения цели в виде кругового индикатора.
 * Заполняется по часовой стрелке, начиная сверху.
 * 
 * @module modules/habit-tracker/features/calendar/components/CircularProgress
 */

import React from 'react';

interface CircularProgressProps {
  /** Процент выполнения от 0 до 100 */
  progress: number;
  /** Размер диаграммы в пикселях */
  size?: number;
}

export function CircularProgress({ progress, size = 16 }: CircularProgressProps) {
  // Ограничиваем прогресс от 0 до 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Параметры круга
  const strokeWidth = 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Вычисляем offset для stroke-dasharray (начинаем с верхней точки)
  const offset = circumference - (clampedProgress / 100) * circumference;
  
  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90" // Поворачиваем чтобы начать сверху
    >
      {/* Фоновый круг (светло-серый) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-300"
      />
      
      {/* Прогресс круг (чёрный) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-gray-900 transition-all duration-300"
      />
    </svg>
  );
}