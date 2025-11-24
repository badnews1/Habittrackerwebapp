/**
 * Tags Slice - управление тегами
 * 
 * Содержит actions для:
 * - Добавление тега с автоматическим цветом
 * - Удаление тега (+ очистка у всех привычек)
 * - Обновление цвета тега
 * 
 * @module core/store/slices/tags
 * @created 23 ноября 2025 (миграция с categories)
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import { getTagColor } from '@/modules/habit-tracker/features/tags';
import { categoryLogger } from '@/shared/utils/logger';

/**
 * Создает slice с actions для работы с тегами
 */
export const createTagsSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<HabitsState, 'addTag' | 'deleteTag' | 'updateTagColor'>
> = (set, get) => ({
  addTag: (tagName, color) => {
    const state = get();

    // Проверяем уникальность тега (case-insensitive для большей надёжности)
    if (!state.tags.some((tag) => tag.name.toLowerCase() === tagName.toLowerCase())) {
      // Используем переданный цвет или получаем дефолтный
      const newColor = color || getTagColor(state.tags, tagName);
      const newTag = { name: tagName, color: newColor };

      set({ tags: [...state.tags, newTag] });
      categoryLogger.info('Добавлен тег', { name: tagName, color: newColor });
    } else {
      categoryLogger.warn('Тег уже существует', { name: tagName });
    }
  },

  deleteTag: (tagName) => {
    set((state) => ({
      tags: state.tags.filter((tag) => tag.name !== tagName),
      habits: state.habits.map((habit) =>
        habit.tags?.includes(tagName) 
          ? { ...habit, tags: habit.tags.filter(t => t !== tagName) } 
          : habit
      ),
    }));

    categoryLogger.info('Удалён тег', { name: tagName });
  },

  updateTagColor: (tagName, color) => {
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.name === tagName ? { ...tag, color } : tag
      ),
    }));

    categoryLogger.debug('Обновлен цвет тега', { name: tagName, color });
  },
});