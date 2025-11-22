/**
 * Internal Slice - внутренние системные actions
 * 
 * Содержит служебные actions, которые не должны вызываться напрямую из UI:
 * - Инкремент счетчика действий (для Undo системы)
 * - Обновление силы привычек при загрузке приложения
 * - Очистка previousHabitsState после N действий
 * 
 * @module core/store/slices/internal
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import { recalculateStrength } from '@/modules/habit-tracker/features/strength';
import { storageLogger } from '@/shared/utils/logger';

/**
 * Создает slice с внутренними системными actions
 */
export const createInternalSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<HabitsState, 'incrementActionCounter' | 'updateHabitsStrength' | 'clearPreviousStateIfNeeded'>
> = (set, get) => ({
  incrementActionCounter: () => {
    const state = get();

    if (state.previousHabitsState !== null) {
      set({ actionsAfterClear: state.actionsAfterClear + 1 });

      // Автоматически очищаем после 5 действий
      if (state.actionsAfterClear + 1 >= 5) {
        set({ previousHabitsState: null, actionsAfterClear: 0 });
        storageLogger.debug('previousHabitsState очищен после 5 действий');
      }
    }
  },

  updateHabitsStrength: () => {
    const state = get();
    const today = new Date();

    const updatedHabits = state.habits.map((habit) => {
      const lastUpdate = habit.lastStrengthUpdate ? new Date(habit.lastStrengthUpdate) : null;

      // Обновляем только если прошел хотя бы 1 день
      if (!lastUpdate || today.toDateString() !== lastUpdate.toDateString()) {
        return recalculateStrength(habit);
      }

      return habit;
    });

    set({ habits: updatedHabits });
    storageLogger.info('Сила привычек обновлена', { count: updatedHabits.length });
  },

  clearPreviousStateIfNeeded: () => {
    const state = get();

    if (state.actionsAfterClear >= 5 && state.previousHabitsState !== null) {
      set({ previousHabitsState: null, actionsAfterClear: 0 });
      storageLogger.debug('previousHabitsState очищен');
    }
  },
});