/**
 * Функции для расчёта силы привычки по алгоритму EMA (Exponential Moving Average)
 * 
 * @module entities/habit/lib/strength
 * @created 22 ноября 2025
 * @migrated 30 ноября 2025 - перенос из /features/strength в /entities/habit
 */

import type { Habit } from '../../model/types';
import { EMA_PERIOD } from '../../model/constants';
import { getCompletionValueForDate } from '../completion-utils';
import { format } from 'date-fns';
import { applyEMAStep, findEarliestDateWithData } from './strengthHistory';
import { strengthLogger } from '@/shared/lib/logger';

/**
 * Пересчитывает силу привычки и возвращает обновлённую привычку
 * При изменении галочек ВСЕГДА пересчитывает от базовой силы (strengthBaseline)
 * 
 * @param habit - привычка для пересчёта
 * @param changedDate - дата, которая была изменена (опционально, для оптимизации)
 */
export const recalculateStrength = (habit: Habit, changedDate?: string): Habit => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = format(today, 'yyyy-MM-dd');
  
  strengthLogger.group(`Recalculate: ${habit.name}`, () => {
    strengthLogger.debug('Changed date', changedDate);
    strengthLogger.debug('Current strength', habit.strength);
    strengthLogger.debug('Completions', Object.entries(habit.completions || {}).filter(([_, v]) => v === true || typeof v === 'number').map(([d, v]) => `${d}:${v}`).sort());
    strengthLogger.debug('Skipped', Object.entries(habit.skipped || {}).filter(([_, v]) => v === true).map(([d]) => d).sort());
  });
  
  // Если изменён день в будущем, не пересчитываем силу
  if (changedDate && changedDate > todayStr) {
    strengthLogger.debug('Changed date is in the future - skipping recalculation', { changedDate, today: todayStr });
    return habit;
  }
  
  // Определяем точку отсчёта для пересчёта
  const lastUpdate = new Date(habit.lastStrengthUpdate || habit.createdAt);
  lastUpdate.setHours(0, 0, 0, 0);
  const lastUpdateStr = format(lastUpdate, 'yyyy-MM-dd');
  
  // Проверяем, был ли изменён день до lastUpdate
  const isChangedBeforeLastUpdate = changedDate && changedDate < lastUpdateStr;
  
  // Если lastUpdate === сегодня И изменён день >= lastUpdate, 
  // пересчитываем от базовой силы (оптимизация для изменений в текущем окне)
  if (lastUpdateStr === todayStr && habit.lastStrengthUpdate && !isChangedBeforeLastUpdate) {
    // Используем базовую силу на момент последнего полного пересчёта
    const baseStrength = habit.strengthBaseline ?? habit.strength ?? 0;
    let strength = baseStrength;
    
    // Пересчитываем все дни с момента lastUpdate включительно
    let currentDate = new Date(lastUpdate);
    
    strengthLogger.group(`Recalculating from baseline: ${habit.name}`, () => {
      strengthLogger.debug('Baseline strength', baseStrength);
      strengthLogger.debug('From', lastUpdateStr, 'To', todayStr);
    });
    
    while (currentDate <= today) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      // Игнорируем галочки за будущие дни (на всякий случай)
      if (dateStr > todayStr) {
        strengthLogger.debug(`Day ${dateStr}: skipped (future)`);
        break;
      }
      
      const isSkipped = habit.skipped?.[dateStr] === true;
      
      // Логика заморозки: намеренный пропуск (✗) не меняет силу
      if (isSkipped) {
        // ЗАМОРОЗКА: сила не меняется
        strengthLogger.debug(`  ${dateStr}: ✗ FROZEN - strength stays at ${strength.toFixed(2)}%`);
      } else {
        // Получаем пропорциональное значение выполнения (0-100)
        const completionValue = getCompletionValueForDate(habit, dateStr);
        const oldStrength = strength;
        strength = applyEMAStep(strength, completionValue, EMA_PERIOD);
        
        if (completionValue === 100) {
          strengthLogger.debug(`  ${dateStr}: ✓ COMPLETED (100%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
        } else if (completionValue > 0) {
          strengthLogger.debug(`  ${dateStr}: ◐ PARTIAL (${completionValue.toFixed(1)}%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
        } else {
          strengthLogger.debug(`  ${dateStr}: ○ MISSED (0%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    strengthLogger.debug('Final strength', Math.floor(strength));
    
    return {
      ...habit,
      strength: Math.floor(strength),
      lastStrengthUpdate: habit.lastStrengthUpdate, // Не меняем дату обновления
      strengthBaseline: baseStrength, // Сохраняем базовую силу
    };
  }
  
  // Новый день ИЛИ изменение дня до lastUpdate - делаем полный пересчёт и фиксируем новый baseline
  let strength = 0; // Начинаем с нуля при полном пересчёте
  let strengthBeforeToday = 0; // По умолчанию
  
  // Начинаем с самой ранней даты: либо дата создания, либо самая ранняя галочка
  const createdAt = new Date(habit.createdAt);
  createdAt.setHours(0, 0, 0, 0);
  
  // Находим самую раннюю дату с галочкой или крестиком (или числовым значением для measurable)
  const allDates = [
    ...Object.entries(habit.completions || {})
      .filter(([_, value]) => value === true || typeof value === 'number')
      .map(([date, _]) => date),
    ...Object.entries(habit.skipped || {})
      .filter(([_, value]) => value === true)
      .map(([date, _]) => date)
  ];
  
  let startDate = new Date(createdAt);
  if (allDates.length > 0) {
    // ✅ Fix: доступ по индексу может вернуть undefined
    const earliestDateStr = allDates.sort()[0];
    if (earliestDateStr) {
      const earliestDate = new Date(earliestDateStr);
      earliestDate.setHours(0, 0, 0, 0);
      
      // Начинаем с самой ранней даты
      if (earliestDate < startDate) {
        strengthLogger.debug('Found earlier date with completions:', earliestDateStr, '(before createdAt:', format(createdAt, 'yyyy-MM-dd'), ')');
        startDate = earliestDate;
      }
    }
  }
  
  let currentDate = new Date(startDate);
  
  const reason = isChangedBeforeLastUpdate 
    ? `changed date ${changedDate} before lastUpdate ${lastUpdateStr}`
    : 'new day';
  strengthLogger.group(`Full recalculation (${reason}): ${habit.name}`, () => {
    strengthLogger.debug('Starting from scratch at:', format(currentDate, 'yyyy-MM-dd'));
    strengthLogger.debug('To:', todayStr);
  });
  
  while (currentDate <= today) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Игнорируем галочки за будущие дни (на всякий случай)
    if (dateStr > todayStr) {
      strengthLogger.debug(`Day ${dateStr}: skipped (future)`);
      break;
    }
    
    const isToday = dateStr === todayStr;
    
    // Сохраняем силу ПЕРЕД пересчётом сегодняшнего дня
    if (isToday) {
      strengthBeforeToday = strength;
      strengthLogger.debug('Baseline for today:', strengthBeforeToday);
    }
    
    const isSkipped = habit.skipped?.[dateStr] === true;
    
    // Логика заморозки: намеренный пропуск (✗) не меняет силу
    if (isSkipped) {
      // ЗАМОРОЗКА: сила не меняется
      strengthLogger.debug(`  ${dateStr}: ✗ FROZEN - strength stays at ${strength.toFixed(2)}%`);
    } else {
      // Получаем пропорциональное значение выполнения (0-100)
      const completionValue = getCompletionValueForDate(habit, dateStr);
      const oldStrength = strength;
      strength = applyEMAStep(strength, completionValue, EMA_PERIOD);
      
      if (completionValue === 100) {
        strengthLogger.debug(`  ${dateStr}: ✓ COMPLETED (100%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
      } else if (completionValue > 0) {
        strengthLogger.debug(`  ${dateStr}: ◐ PARTIAL (${completionValue.toFixed(1)}%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
      } else {
        strengthLogger.debug(`  ${dateStr}: ○ MISSED (0%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  strengthLogger.debug('Final strength', Math.floor(strength));
  
  return {
    ...habit,
    strength: Math.floor(strength),
    lastStrengthUpdate: today.toISOString(), // Обновляем дату
    strengthBaseline: strengthBeforeToday, // Фиксируем силу на начало сегодняшнего дня
  };
};
