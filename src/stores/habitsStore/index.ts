/**
 * Главный файл Zustand store
 * 
 * Объединяет все slices в единый store с persist middleware.
 * Модульная архитектура позволяет легко находить и модифицировать код.
 * 
 * Структура:
 * - types.ts - все TypeScript интерфейсы
 * - initialState.ts - начальное состояние
 * - slices/ - модули с actions по функциональности
 *   - ui.ts - UI управление (sidebar, section, date)
 *   - modals.ts - модальные окна
 *   - manageHabitsModal.ts - модалка управления привычками
 *   - addHabitForm.ts - форма добавления привычки
 *   - habits.ts - CRUD привычек
 *   - categories.ts - управление категориями
 *   - goals.ts - управление целями
 *   - internal.ts - внутренние системные actions
 * 
 * @module stores/habitsStore
 * @see https://github.com/pmndrs/zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HabitsState } from './types';
import { getInitialState } from './initialState';
import { createUISlice } from './slices/ui';
import { createModalsSlice } from './slices/modals';
import { createManageHabitsModalSlice } from './slices/manageHabitsModal';
import { createAddHabitFormSlice } from './slices/addHabitForm';
import { createHabitsSlice } from './slices/habits';
import { createCategoriesSlice } from './slices/categories';
import { createGoalsSlice } from './slices/goals';
import { createInternalSlice } from './slices/internal';
import { storageLogger } from '../../utils/logger';

/**
 * Главный Zustand store приложения
 * 
 * Использует persist middleware для автоматического сохранения данных в localStorage.
 * Только данные (habits, categories, goals) сохраняются, UI состояние - нет.
 */
export const useHabitsStore = create<HabitsState>()(
  persist(
    (...args) => ({
      // Начальное состояние
      ...getInitialState(),

      // Slices с actions
      ...createUISlice(...args),
      ...createModalsSlice(...args),
      ...createManageHabitsModalSlice(...args),
      ...createAddHabitFormSlice(...args),
      ...createHabitsSlice(...args),
      ...createCategoriesSlice(...args),
      ...createGoalsSlice(...args),
      ...createInternalSlice(...args),
    }),
    {
      name: 'habits-storage', // Ключ для localStorage
      partialize: (state) => ({
        // Сохраняем только данные, UI состояние не сохраняем
        habits: state.habits,
        categories: state.categories,
        dailyGoals: state.dailyGoals,
        defaultDailyGoal: state.defaultDailyGoal,
      }),
    }
  )
);

// Логируем инициализацию store
storageLogger.info('Zustand store инициализирован (модульная архитектура)');