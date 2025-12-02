/**
 * Ячейка с прогресс-баром привычки
 * 
 * Чистый UI компонент без бизнес-логики и store.
 * Отображает процент выполнения, прогресс-бар, счётчик и иконку статистики.
 * 
 * @module entities/habit/ui/HabitProgressCell
 * @created 2 декабря 2025
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3 } from '@/shared/assets/icons/system';
import { ProgressBar } from '@/shared/ui/progress-bar';

interface HabitProgressCellProps {
  /** ID привычки (для key и callback) */
  habitId: string;
  /** Количество выполненных дней */
  completedCount: number;
  /** Целевое значение (месячная цель из частоты) */
  goalValue: number;
  /** Ширина ячейки (адаптивная в зависимости от дней в месяце) */
  width?: string;
  /** Callback при клике на иконку статистики */
  onStatsClick?: (habitId: string) => void;
}

/**
 * Ячейка прогресса привычки
 * 
 * Отображает:
 * - Процент выполнения (слева, 6px ширина)
 * - Прогресс-бар (141px ширина)
 * - Счётчик "45/50" (45px ширина)
 * - Иконка статистики (16px ширина)
 * 
 * Адаптивная ширина в зависимости от количества дней:
 * - 28 дней: 283px
 * - 30 дней: 279px
 * - Остальные: 280px
 */
export function HabitProgressCell({
  habitId,
  completedCount,
  goalValue,
  width = '280px',
  onStatsClick,
}: HabitProgressCellProps) {
  const { t } = useTranslation('ui');
  
  // Рассчитываем процент выполнения
  const percentage = goalValue > 0 ? Math.round((completedCount / goalValue) * 100) : 0;
  const safePercentage = isNaN(percentage) ? 0 : percentage;
  
  // Ограничиваем процент на 100% для визуального отображения
  const displayPercentage = Math.min(safePercentage, 100);

  return (
    <div 
      className="h-8 flex items-center flex-shrink-0"
      style={{ width }}
    >
      {/* Процент выполнения */}
      <div 
        className="w-6 text-right"
        style={{ 
          fontSize: '8px', 
          fontWeight: 700, 
          color: 'var(--text-secondary)' 
        }}
      >
        {safePercentage}%
      </div>
      
      {/* Отступ */}
      <div className="w-2" />
      
      {/* Прогресс-бар */}
      <div className="w-[141px] flex-shrink-0">
        <ProgressBar
          value={displayPercentage}
          size="md"
          variant="solid"
          fillColor="var(--text-primary)"
          backgroundColor="var(--bg-hover)"
          animationDuration={300}
        />
      </div>
      
      {/* Отступ */}
      <div className="w-[32px]" />
      
      {/* Количество выполнений и иконка статистики */}
      <div className="flex items-center gap-1.5 -ml-[5px]">
        <div 
          className="w-[45px] text-right"
          style={{ 
            fontSize: '8px', 
            fontWeight: 600, 
            color: 'var(--text-secondary)' 
          }}
        >
          {completedCount} / {goalValue}
        </div>
        
        {/* Иконка статистики */}
        {onStatsClick && (
          <button
            onClick={() => onStatsClick(habitId)}
            className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={t('ui.showStatistics')}
          >
            <BarChart3 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}