/**
 * 🔄 useStrengthUpdater Hook
 * 
 * Хук для автоматического обновления силы привычек при загрузке приложения (новый день)
 * 
 * Дата создания: 20 ноября 2025
 * Последнее обновление: 22 ноября 2025 (мигрировано в модуль habit-tracker)
 */

import { useEffect } from 'react';
import { Habit } from '@/modules/habit-tracker/types';
import { recalculateStrength } from '../utils';
import { strengthLogger } from '@/shared/utils/logger';

/**
 * Хук для автоматического обновления силы привычек при загрузке приложения (новый день)
 */
export function useStrengthUpdater(
  habits: Habit[],
  setHabits: (habits: Habit[] | ((prev: Habit[]) => Habit[])) => void
) {
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    // Проверяем, есть ли привычки, которые нужно обновить
    const habitsToUpdate = habits.filter(habit => {
      const lastUpdate = habit.lastStrengthUpdate;
      // Обновляем, если lastStrengthUpdate отсутствует или не сегодня
      return !lastUpdate || lastUpdate.split('T')[0] !== todayStr;
    });
    
    if (habitsToUpdate.length > 0) {
      strengthLogger.info('New day detected, updating habits', { count: habitsToUpdate.length, date: todayStr });
      // Обновляем силу для всех привычек, которые не обновлялись сегодня
      // recalculateStrength автоматически установит новый strengthBaseline
      setHabits(currentHabits =>
        currentHabits.map(habit => {
          if (habitsToUpdate.find(h => h.id === habit.id)) {
            return recalculateStrength(habit);
          }
          return habit;
        })
      );
    }
  }, []); // Запускаем только при монтировании компонента
}