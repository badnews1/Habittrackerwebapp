/**
 * Секция прогресса выполнения привычек за месяц
 * 
 * UI-компонент для отображения списка горизонтальных прогресс-баров,
 * где каждый бар показывает процент выполнения отдельной привычки за месяц.
 * 
 * Для каждой привычки отображает:
 * - Процент выполнения (слева)
 * - Прогресс-бар (центр)
 * - Количество выполненных/целевых действий (справа)
 * 
 * Учитывает частоту привычки через getMonthlyGoalFromFrequency.
 * 
 * @module entities/habit/ui/stats
 * @created 30 ноября 2025 - мигрировано из features/statistics
 * @refactored 1 декабря 2025 - адаптация к темной теме, убрана серая подложка
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3 } from '@/shared/assets/icons/system';
import { ProgressBar } from '@/shared/ui/progress-bar';

interface ProgressSectionProps {
  /** Данные о прогрессе привычек за месяц */
  progressData: {
    habitId: string;
    completedCount: number;
    goalValue: number;
  }[];
  /** Callback при клике на иконку статистики */
  onShowStats?: (habitId: string) => void;
}

/**
 * Секция прогресса привычек за месяц
 * 
 * Для каждой привычки рассчитывает:
 * 1. Количество выполненных дней (completedCount)
 * 2. Месячную цель из частоты (goalValue)
 * 3. Процент выполнения = (completedCount / goalValue) * 100
 * 
 * Адаптивная ширина в зависимости от количества дней в месяце:
 * - 28 дней: 283px
 * - 30 дней: 279px
 * - Остальные: 280px
 * 
 * Прогресс-бар ограничен 100% для визуального отображения,
 * но процент может превышать 100% (отображается в цифрах).
 * 
 * @example
 * ```tsx
 * <ProgressSection
 *   progressData={[
 *     { habitId: '1', completedCount: 15, goalValue: 20 },
 *     { habitId: '2', completedCount: 25, goalValue: 30 },
 *   ]}
 *   onShowStats={(habitId) => console.log(`Show stats for habit ${habitId}`)}
 * />
 * ```
 */
export const ProgressSection: React.FC<ProgressSectionProps> = ({
  progressData,
  onShowStats,
}) => {
  const { t } = useTranslation('ui');
  
  // Получаем текущую дату для фильтрации данных за текущий месяц
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  return (
    <div className={`${progressData.length === 28 ? 'w-[283px] min-w-[283px] max-w-[283px]' : progressData.length === 30 ? 'w-[279px] min-w-[279px] max-w-[279px]' : 'w-[280px] min-w-[280px] max-w-[280px]'} p-4`}>
      {/* Заголовок секции прогресса */}
      <div className="mb-4 text-center flex items-center justify-center" style={{ height: 24, position: 'relative', top: 5 }}>
        <span className="tracking-wider uppercase" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {t('progressSection.monthProgress')}
        </span>
      </div>
      
      {/* Прогресс-бары для каждой привычки */}
      <div className="space-y-0.5">
        {progressData.map((data) => {
          const { habitId, completedCount, goalValue } = data;
          
          // Рассчитываем процент выполнения
          const percentage = goalValue > 0 ? Math.round((completedCount / goalValue) * 100) : 0;
          const safePercentage = isNaN(percentage) ? 0 : percentage;
          
          // Ограничиваем процент на 100% для визуального отображения
          const displayPercentage = Math.min(safePercentage, 100);
          
          return (
            <div key={habitId} className="flex items-center h-8">
              {/* Процент выполнения */}
              <div className="w-6 text-right" style={{ fontSize: '8px', fontWeight: 700, color: 'var(--text-secondary)' }}>
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
                  backgroundColor="var(--border-light)"
                  animationDuration={300}
                />
              </div>
              
              {/* Отступ */}
              <div className="w-[32px]" />
              
              {/* Количество выполнений и иконка статистики */}
              <div className="flex items-center gap-1.5 -ml-[5px]">
                <div className="w-[45px] text-right" style={{ fontSize: '8px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {completedCount} / {goalValue}
                </div>
                
                {/* Иконка статистики */}
                <button
                  onClick={() => onShowStats?.(habitId)}
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
              </div>
            </div>
          );
        })}
        
        {/* Разделитель */}
        {progressData.length > 0 && <div className="my-2" style={{ borderTop: '1px solid var(--border-light)' }} />}
      </div>
    </div>
  );
}