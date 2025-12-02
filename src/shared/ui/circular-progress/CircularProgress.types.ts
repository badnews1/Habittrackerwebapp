/**
 * Типы для CircularProgress
 * 
 * @module shared/ui/circular-progress
 */

export interface CircularProgressProps {
  /** Процент выполнения от 0 до 100 */
  progress: number;
  /** Размер диаграммы в пикселях */
  size?: number;
  /** Толщина линии круга */
  strokeWidth?: number;
  /** CSS класс для кастомизации */
  className?: string;
}
