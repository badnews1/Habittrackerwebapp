import React, { useMemo, useState } from 'react';
import { Modal } from '../modal';
import { Habit } from '../../types/habit';
import { Line, LineChart, Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { calculateHabitPower } from '../../utils/habitPower';
import { getMonthlyGoalFromFrequency, isHabitCompletedForDate } from '../../utils/habitUtils';
import { calculateStrengthHistory } from '../../utils/strengthHistory';
import { declineDays } from '../../utils/declineWords';
import { StrengthProgressBar } from '../statistics/StrengthProgressBar';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { Button } from '../common';

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
  const todayStr = today.toISOString().split('T')[0];
  
  // Парсим monthYearKey (например, "2024-11" -> год=2024, месяц=11)
  const [year, month] = monthYearKey.split('-').map(Number);
  
  // Определяем границы месяца
  const monthStart = new Date(year, month - 1, 1); // месяц в Date начинается с 0
  const monthEnd = new Date(year, month, 0); // последний день месяца
  const monthStartStr = monthStart.toISOString().split('T')[0];
  const monthEndStr = monthEnd.toISOString().split('T')[0];
  
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
    const dateStr = currentDate.toISOString().split('T')[0];
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
  
  // Плучаем все даты и сортируем их
  const allDatesForBestStreak = [
    ...Object.entries(habit.completions || {})
      .filter(([_, value]) => value === true || typeof value === 'number')
      .map(([date, _]) => date),
    ...Object.entries(habit.skipped || {})
      .filter(([_, value]) => value === true)
      .map(([date, _]) => date)
  ].sort();
  
  if (allDatesForBestStreak.length > 0) {
    const startDate = new Date(allDatesForBestStreak[0]);
    const endDate = new Date(today);
    
    let checkDate = new Date(startDate);
    currentBestStreak = 0;
    
    while (checkDate <= endDate) {
      const dateStr = checkDate.toISOString().split('T')[0];
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
  // Получаем дни в месяце
  const getDaysInMonth = (monthYearKey: string): number => {
    const [year, month] = monthYearKey.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(monthYearKey);
  const stats = calculateStats(habit, monthYearKey, daysInMonth);

  // Рассчитываем историю силы привычки для графика
  const strengthHistory = calculateStrengthHistory(habit);
  
  // Форматируем данные для графика (показываем не все точки, чтобы график не был переполнен)
  const formatChartData = (history: Array<{ date: string; strength: number }>) => {
    if (history.length === 0) return [];
    
    // Если точек меньше 30, показываем все
    if (history.length <= 30) {
      return history.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
      }));
    }
    
    // Если точек больше, берем каждую N-ю точку + последнюю
    const step = Math.ceil(history.length / 30);
    const filtered = history.filter((_, index) => index % step === 0 || index === history.length - 1);
    
    return filtered.map(item => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    }));
  };
  
  const chartData = formatChartData(strengthHistory);

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
      // Интерполяция от свтло-зелёного (34, 197, 94) к зелёному (16, 185, 129)
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
      <Modal.Content size="xl" className="max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1 pr-4">
            <h4 className="text-gray-900 truncate">{habit.name}</h4>
            <p className="text-sm text-gray-500 mt-1">
              Статистика привычки
            </p>
          </div>
          <Modal.CloseButton onClick={onClose} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Сила привычки (EMA) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-500">Сила привычки</h3>
                <span className="text-sm text-gray-500">{stats.strength}%</span>
              </div>
              
              <StrengthProgressBar strength={stats.strength} showLabel={false} size="lg" />
              
              {/* График истории силы привычки */}
              {chartData.length > 0 && (
                <div className="mt-6 h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="displayDate" 
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                        label={{ value: '%', position: 'insideLeft', style: { fontSize: 11, fill: '#9ca3af' } }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value: number) => [`${value}%`, 'Сила']}
                        labelFormatter={(label) => `Дата: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="strength" 
                        stroke={lineColor} 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Разделитель */}
            <div className="border-t border-gray-100" />

            {/* Дополнительная статистика */}
            <div className="space-y-4">
              <h3 className="text-sm text-gray-500">Дополнительная статистика</h3>
              
              {/* Текущий стрик */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">Текущий стрик</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.streak} {declineDays(stats.streak)}
                </span>
              </div>

              {/* Лучший стрик */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Target className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">Лучший стрик</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.bestStreak} {declineDays(stats.bestStreak)}
                </span>
              </div>

              {/* Прогресс за месяц */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Прогресс за месяц</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.percentage}% <span className="text-gray-400">({stats.completedDays}/{stats.targetDays})</span>
                </span>
              </div>

              {/* Всего выполнено */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Award className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Всего выполнено</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalCompletedAllTime} {declineDays(stats.totalCompletedAllTime)}
                </span>
              </div>

              {/* Возраст привычки */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">Возраст привычки</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {daysOld} {declineDays(daysOld)}
                </span>
              </div>
            </div>

            {/* Разделитель */}
            {habit.description && (
              <>
                <div className="border-t border-gray-100" />
                
                {/* Описание */}
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Описание</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {habit.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={onClose}
            fullWidth
          >
            Закрыть
          </Button>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
};