/**
 * Модальное окно статистики привычки
 * 
 * Отображает детальную статистику привычки: силу привычки (EMA),
 * график истории силы, текущий и лучший стрик, прогресс за месяц,
 * общее количество выполнений и возраст привычки.
 * 
 * @module features/habit-stats/ui/HabitStatisticsModal
 * @migrated 30 ноября 2025 - миграция на FSD
 */

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { StrengthProgressBar } from '@/entities/habit';
import { TrendingUp } from '@/shared/assets/icons/system';
import { Award, Calendar, Target } from '@/shared/assets/icons/content';
import { LineChart } from '@/shared/ui/line-chart';
import { declineDays } from '@/shared/lib/text';
import { calculateStrengthHistory, isHabitCompletedForDate, getMonthlyGoalFromFrequency } from '@/entities/habit';
import type { Habit } from '@/entities/habit';

interface HabitStatisticsModalProps {
  habit: Habit;
  onClose: () => void;
  monthYearKey: string;
}

/**
 * Рассчитывает статистику привычки
 */
function calculateStats(habit: Habit, monthYearKey: string, daysInMonth?: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // ✅ Fix: split может вернуть undefined
  const todayStr = today.toISOString().split('T')[0] ?? today.toISOString();
  
  // Парсим monthYearKey (например, "2024-11" -> год=2024, месяц=11)
  const parts = monthYearKey.split('-').map(Number);
  const year = parts[0] ?? new Date().getFullYear();
  const month = parts[1] ?? 1;
  
  // Определяем границы месяца
  const monthStart = new Date(year, month - 1, 1); // месяц в Date начинается с 0
  const monthEnd = new Date(year, month, 0); // последний день месяца
  // ✅ Fix: split может вернуть undefined
  const monthStartStr = monthStart.toISOString().split('T')[0] ?? monthStart.toISOString();
  const monthEndStr = monthEnd.toISOString().split('T')[0] ?? monthEnd.toISOString();
  
  // Фильтруем только галочки/значения за выбранный месяц и до сегодняшнего дня включительно
  const completions = Object.entries(habit.completions || {})
    .filter(([date, _]) => date >= monthStartStr && date <= monthEndStr && date <= todayStr);
  const totalDays = completions.length;
  const completedDays = completions.filter(([date, _]) => isHabitCompletedForDate(habit, date)).length;
  
  // Считаем всего выполнено за всё время (до сегодняшнего дня включительно)
  const totalCompletedAllTime = Object.entries(habit.completions || {})
    .filter(([date, _]) => isHabitCompletedForDate(habit, date) && date <= todayStr).length;
  
  // Получаем месячную цель из частоты
  const effectiveDaysInMonth = daysInMonth || 30;
  const goalValue = getMonthlyGoalFromFrequency(habit.frequency, effectiveDaysInMonth, month, year);
  const targetDays = goalValue > 0 ? goalValue : totalDays;
  const percentage = targetDays > 0 ? Math.round((completedDays / targetDays) * 100) : 0;

  // Рассчитываем текущий стрик
  let streak = 0;
  
  let currentDate = new Date(today);
  let iterations = 0;
  const MAX_ITERATIONS = 365;
  
  while (iterations < MAX_ITERATIONS) {
    // ✅ Fix: split может вернуть undefined
    const dateStr = currentDate.toISOString().split('T')[0] ?? currentDate.toISOString();
    const isCompleted = isHabitCompletedForDate(habit, dateStr);
    const isSkipped = habit.skipped?.[dateStr];
    
    if (isCompleted || isSkipped) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
      iterations++;
    } else {
      break;
    }
  }

  // Рассчитываем лучший стрик (максимальная непрерывная серия)
  let bestStreak = 0;
  let currentBestStreak = 0;
  
  // Получаем все даты и сортируем их
  const allDatesForBestStreak = [
    ...Object.entries(habit.completions || {})
      .filter(([_, value]) => value === true || typeof value === 'number')
      .map(([date, _]) => date),
    ...Object.entries(habit.skipped || {})
      .filter(([_, value]) => value === true)
      .map(([date, _]) => date)
  ].sort();
  
  if (allDatesForBestStreak.length > 0) {
    // ✅ Fix: доступ по индексу может вернуть undefined
    const firstDate = allDatesForBestStreak[0];
    if (firstDate) {
      const startDate = new Date(firstDate);
      const endDate = new Date(today);
      
      let checkDate = new Date(startDate);
      currentBestStreak = 0;
      
      while (checkDate <= endDate) {
        // ✅ Fix: split может вернуть undefined
        const dateStr = checkDate.toISOString().split('T')[0] ?? checkDate.toISOString();
        const isCompleted = isHabitCompletedForDate(habit, dateStr);
        const isSkipped = habit.skipped?.[dateStr];
      
        if (isCompleted || isSkipped) {
          currentBestStreak++;
          bestStreak = Math.max(bestStreak, currentBestStreak);
        } else {
          currentBestStreak = 0;
        }
        
        checkDate.setDate(checkDate.getDate() + 1);
      }
    }
  }

  // Используем сохранённую силу привычки (она всегда актуальна, т.к. обновляется в App.tsx)
  // Fallback на 0 если по какой-то причине она не определена (не должно происходить)
  const strength = habit.strength ?? 0;

  return { streak, bestStreak, percentage, totalDays, completedDays, targetDays, strength, totalCompletedAllTime };
}

export const HabitStatisticsModal: React.FC<HabitStatisticsModalProps> = ({ 
  habit, 
  onClose, 
  monthYearKey 
}) => {
  const { t, i18n } = useTranslation('stats');
  const currentLanguage = i18n.language;
  
  // Получаем дни в месяце
  const getDaysInMonth = (monthYearKey: string): number => {
    // ✅ Fix: доступ по индексу может вернуть undefined
    const parts = monthYearKey.split('-').map(Number);
    const year = parts[0] ?? new Date().getFullYear();
    const month = parts[1] ?? 1;
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(monthYearKey);
  const stats = calculateStats(habit, monthYearKey, daysInMonth);

  // Рассчитываем историю силы привычки для графика
  const strengthHistory = calculateStrengthHistory(habit);
  
  // Форматируем данные для графика (показываем не все точки, чтобы график не был переполнен)
  const chartData = useMemo(() => {
    if (strengthHistory.length === 0) return [];
    
    let dataToFormat = strengthHistory;
    
    // Если точек больше 30, берем каждую N-ю точку + последнюю
    if (strengthHistory.length > 30) {
      const step = Math.ceil(strengthHistory.length / 30);
      dataToFormat = strengthHistory.filter((_, index) => index % step === 0 || index === strengthHistory.length - 1);
    }
    
    // Преобразуем в формат для LineChart
    return dataToFormat.map(item => ({
      label: new Date(item.date).toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' }),
      value: item.strength
    }));
  }, [strengthHistory, currentLanguage]);

  // Вычисляем цвет линии графика на основе текущей силы привычки
  const getLineColor = (value: number): string => {
    // Красный (0%) -> Оранжевый (25%) -> Жёлтый (50%) -> Светло-зелёный (75%) -> Зелёный (100%)
    if (value <= 25) {
      // Интерполяция от красного (239, 68, 68) к оранжевому (249, 115, 22)
      const ratio = value / 25;
      const r = Math.round(239 + (249 - 239) * ratio);
      const g = Math.round(68 + (115 - 68) * ratio);
      const b = Math.round(68 + (22 - 68) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (value <= 50) {
      // Интерполяция от оранжевого (249, 115, 22) к жёлтому (234, 179, 8)
      const ratio = (value - 25) / 25;
      const r = Math.round(249 + (234 - 249) * ratio);
      const g = Math.round(115 + (179 - 115) * ratio);
      const b = Math.round(22 + (8 - 22) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (value <= 75) {
      // Интерполяция от жёлтого (234, 179, 8) к светло-зелёному (34, 197, 94)
      const ratio = (value - 50) / 25;
      const r = Math.round(234 + (34 - 234) * ratio);
      const g = Math.round(179 + (197 - 179) * ratio);
      const b = Math.round(8 + (94 - 8) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Интерполяция от светло-зелёного (34, 197, 94) к зелёному (16, 185, 129)
      const ratio = (value - 75) / 25;
      const r = Math.round(34 + (16 - 34) * ratio);
      const g = Math.round(197 + (185 - 197) * ratio);
      const b = Math.round(94 + (129 - 94) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };
  
  const lineColor = getLineColor(stats.strength);

  // Дата создания привычки
  const createdDate = new Date(habit.createdAt);
  const today = new Date();
  
  // Находим самую раннюю дату с галочкой или крестиком (или числовым значением для measurable)
  const allDates = [
    ...Object.entries(habit.completions || {})
      .filter(([_, value]) => value === true || typeof value === 'number')
      .map(([date, _]) => date),
    ...Object.entries(habit.skipped || {})
      .filter(([_, value]) => value === true)
      .map(([date, _]) => date)
  ];
  
  // Возраст считается только если есть хотя бы одна галочка
  let daysOld = 0;
  if (allDates.length > 0) {
    const earliestDate = new Date(allDates.sort()[0]);
    daysOld = Math.floor((today.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  return (
    <Modal.Root level="modal" onClose={onClose}>
      <Modal.Backdrop onClick={onClose} />
      <Modal.Content size="4xl" className="flex flex-col h-[600px]">
        <Modal.Header 
          title={habit.name}
          subtitle={t('habitStats.title')}
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Сила привычки (EMA) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-text-tertiary">{t('habitStats.strength')}</h3>
                <span className="text-sm text-text-tertiary">{stats.strength}%</span>
              </div>
              
              <StrengthProgressBar strength={stats.strength} showLabel={false} size="lg" />
              
              {/* График истории силы привычки */}
              {chartData.length > 0 && (
                <div className="mt-6">
                  <LineChart
                    data={chartData}
                    height={192}
                    color={lineColor}
                    valueLabel={t('habitStats.strengthLabel')}
                    yAxisLabel="%"
                    showGrid={true}
                    domain={[0, 100]}
                    showTooltip={true}
                    strokeWidth={2}
                    showDots={false}
                    tooltipFormatter={(value: number) => [`${value}%`, t('habitStats.strengthLabel')]}
                    labelFormatter={(label) => `${t('charts.date')}: ${label}`}
                  />
                </div>
              )}
            </div>

            {/* Разделитель */}
            <div className="border-t border-border" />

            {/* Дополнительная статистика */}
            <div className="space-y-4">
              <h3 className="text-sm text-text-tertiary">{t('habitStats.additionalStats')}</h3>
              
              {/* Текущий стрик */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">{t('habitStats.currentStreak')}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {stats.streak} {declineDays(stats.streak, t, currentLanguage)}
                </span>
              </div>

              {/* Лучший стрик */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Target className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">{t('habitStats.bestStreak')}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {stats.bestStreak} {declineDays(stats.bestStreak, t, currentLanguage)}
                </span>
              </div>

              {/* Прогресс за месяц */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">{t('habitStats.monthProgress')}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {stats.percentage}% <span className="text-text-tertiary">({stats.completedDays}/{stats.targetDays})</span>
                </span>
              </div>

              {/* Всего выполнено */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Award className="w-5 h-5 text-green-500" />
                  <span className="text-sm">{t('habitStats.totalCompleted')}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {stats.totalCompletedAllTime} {declineDays(stats.totalCompletedAllTime, t, currentLanguage)}
                </span>
              </div>

              {/* Возраст привычки */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">{t('habitStats.habitAge')}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {daysOld} {declineDays(daysOld, t, currentLanguage)}
                </span>
              </div>
            </div>

            {/* Разделитель */}
            {habit.description && (
              <>
                <div className="border-t border-border" />
                
                {/* Описание */}
                <div>
                  <h3 className="text-sm text-text-tertiary mb-2">{t('habits:habit.description')}</h3>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">
                    {habit.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <Modal.Footer>
          <Button
            variant="default"
            onClick={onClose}
          >
            {t('common:common.close')}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};