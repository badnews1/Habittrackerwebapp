/**
 * Habits Slice - управление привычками
 * 
 * Содержит все CRUD операции и логику работы с привычками:
 * - Добавление, удаление, обновление
 * - Переключение выполнения (бинарные и измеримые)
 * - Drag-n-drop перемещение
 * 
 * @module app/store/slices/habits
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import type { Habit, HabitData } from '@/entities/habit';
import { recalculateStrength } from '@/entities/habit/lib/strength/strengthCalculator';
import { formatDate } from '@/shared/lib/date';
import { habitLogger } from '@/shared/lib/logger';

/**
 * Создает slice с actions для работы с привычками
 */
export const createHabitsSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<
    HabitsState,
    | 'addHabit'
    | 'deleteHabit'
    | 'updateHabit'
    | 'toggleCompletion'
    | 'moveHabit'
  >
> = (set, get) => ({
  addHabit: (habitData) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name,
      description: habitData.description,
      createdAt: new Date().toISOString(),
      completions: {},
      frequency: habitData.frequency,
      icon: habitData.icon,
      tags: habitData.tags || [],
      section: habitData.section || 'other',
      type: habitData.type,
      unit: habitData.unit,
      targetValue: habitData.targetValue,
      targetType: habitData.targetType,
      reminders: habitData.reminders || [], // ← Добавлено: сохраняем напоминания
      strength: 0,
      lastStrengthUpdate: new Date().toISOString(),
      strengthBaseline: 0,
    };

    habitLogger.info('Добавлена новая привычка', {
      name: newHabit.name,
      type: newHabit.type,
      id: newHabit.id,
    });

    set((state) => ({
      habits: [...state.habits, newHabit],
    }));
  },

  deleteHabit: (habitId) => {
    const habit = get().habits.find((h) => h.id === habitId);

    if (habit) {
      habitLogger.info('Удалена привычка', { name: habit.name, id: habitId });
    }

    set((state) => ({
      habits: state.habits.filter((h) => h.id !== habitId),
    }));
  },

  updateHabit: (habitId, updates) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === habitId ? { ...habit, ...updates } : habit
      ),
    }));

    habitLogger.debug('Обновлена привычка', { habitId, updates });
  },

  toggleCompletion: (habitId, date) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === habitId);

    if (!habit) return;

    // ✅ Fix: доступ по индексу может вернуть undefined
    const currentValue = habit.completions[date] ?? undefined;

    // Для бинарных привычек
    if (habit.type === 'binary') {
      const newCompletions = { ...habit.completions };
      // ✅ Fix: exactOptionalPropertyTypes - нужно явно обрабатывать undefined
      const newSkipped = { ...(habit.skipped ?? {}) };

      if (currentValue === true) {
        // Клик 1: true → false (пропуск с заморозкой)
        newCompletions[date] = false;
        newSkipped[date] = true;
      } else if (currentValue === false) {
        // Клик 2: false → удаляем (возврат к пустому состоянию)
        delete newCompletions[date];
        delete newSkipped[date];
      } else {
        // Клик 0: undefined → true (выполнено)
        newCompletions[date] = true;
        delete newSkipped[date];
      }

      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        skipped: newSkipped,
      };

      // Пересчитываем силу привычки (передаём дату изменения для корректного пересчёта)
      const habitWithStrength = recalculateStrength(updatedHabit, date);

      set((state) => ({
        habits: state.habits.map((h) => (h.id === habitId ? habitWithStrength : h)),
      }));
    }
    // Для измеримых привычек - открываем модальное окно
    else if (habit.type === 'measurable') {
      state.openNumericInputModal(habitId, date);
    }
  },

  moveHabit: (dragIndex, hoverIndex) => {
    const state = get();
    const newHabits = [...state.habits];
    const [draggedHabit] = newHabits.splice(dragIndex, 1);
    
    // ✅ Fix: splice может вернуть undefined если индекс некорректный
    if (!draggedHabit) return;
    
    newHabits.splice(hoverIndex, 0, draggedHabit);

    set({ habits: newHabits });
    habitLogger.debug('Привычка перемещена', { from: dragIndex, to: hoverIndex });
  },
});
