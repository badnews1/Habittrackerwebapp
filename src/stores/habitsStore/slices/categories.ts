/**
 * Categories Slice - управление категориями
 * 
 * Содержит actions для:
 * - Добавление категории с автоматическим цветом
 * - Удаление категории (+ очистка у всех привычек)
 * - Обновление цвета категории
 * 
 * @module stores/habitsStore/slices/categories
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import { getCategoryColor } from '../../../types/category';
import { categoryLogger } from '../../../utils/logger';

/**
 * Создает slice с actions для работы с категориями
 */
export const createCategoriesSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<HabitsState, 'addCategory' | 'deleteCategory' | 'updateCategoryColor'>
> = (set, get) => ({
  addCategory: (categoryName) => {
    const state = get();

    if (!state.categories.some((cat) => cat.name === categoryName)) {
      const newColor = getCategoryColor(state.categories, categoryName);
      const newCategory = { name: categoryName, color: newColor };

      set({ categories: [...state.categories, newCategory] });
      categoryLogger.info('Добавлена категория', { name: categoryName, color: newColor });
    }
  },

  deleteCategory: (categoryName) => {
    set((state) => ({
      categories: state.categories.filter((cat) => cat.name !== categoryName),
      habits: state.habits.map((habit) =>
        habit.category === categoryName ? { ...habit, category: undefined } : habit
      ),
    }));

    categoryLogger.info('Удалена категория', { name: categoryName });
  },

  updateCategoryColor: (categoryName, color) => {
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.name === categoryName ? { ...cat, color } : cat
      ),
    }));

    categoryLogger.debug('Обновлен цвет категории', { name: categoryName, color });
  },
});
