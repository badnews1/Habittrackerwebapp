/**
 * 🔵 CircularProgress — Универсальная круговая диаграмма прогресса
 * 
 * Компонент отображает прогресс в виде кругового индикатора.
 * Заполняется по часовой стрелке, начиная сверху.
 * 
 * ОСНОВНЫЕ ВОЗМОЖНОСТИ:
 * ✅ Универсальный - подходит для любых модулей (habit-tracker, finance, tasks и т.д.)
 * ✅ Настраиваемый размер
 * ✅ Плавная анимация transition-all
 * ✅ Автоматическое ограничение прогресса 0-100%
 * ✅ Минималистичный дизайн (Jony Ive style)
 * 
 * @example
 * ```tsx
 * import { CircularProgress } from '@/shared/ui/circular-progress';
 * 
 * // Базовое использование
 * <CircularProgress progress={75} />
 * 
 * // С кастомным размером
 * <CircularProgress progress={50} size={24} />
 * ```
 * 
 * @module shared/ui/circular-progress
 * @created 29 ноября 2025
 */

import React from 'react';
import type { CircularProgressProps } from './CircularProgress.types';

/**
 * CircularProgress - универсальный компонент круговой диаграммы прогресса
 */
export function CircularProgress({ 
  progress, 
  size = 16,
  strokeWidth = 2,
  className = ''
}: CircularProgressProps) {
  // Ограничиваем прогресс от 0 до 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Параметры круга
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Вычисляем offset для stroke-dasharray (начинаем с верхней точки)
  const offset = circumference - (clampedProgress / 100) * circumference;
  
  return (
    <svg
      width={size}
      height={size}
      className={`transform -rotate-90 ${className}`}
    >
      {/* Фоновый круг */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border-default)"
        strokeWidth={strokeWidth}
      />
      
      {/* Прогресс круг */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--text-primary)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300"
      />
    </svg>
  );
}

CircularProgress.displayName = 'CircularProgress';
