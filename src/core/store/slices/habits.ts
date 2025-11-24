/**
 * Habits Slice - управление привычками
 * 
 * Содержит все CRUD операции и логику работы с привычками:
 * - Добавление, удаление, обновление
 * - Переключение выполнения (бинарные и измеримые)
 * - Drag-n-drop перемещение
 * - Массовые операции (clearAllCompletions)
 * - Система Undo для очистки всех галочек
 * 
 * @module core/store/slices/habits
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import type { Habit, HabitData } from '@/modules/habit-tracker/types';
import { recalculateStrength } from '@/modules/habit-tracker/features/strength';
import { formatDate } from '@/shared/utils/date';
import { habitLogger } from '@/shared/utils/logger';

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
    | 'clearAllCompletions'
    | 'undoClearAllCompletions'
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
      section: habitData.section || 'Другие',
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
      newlyAddedHabitId: newHabit.id,
    }));

    get().incrementActionCounter();
  },

  deleteHabit: (habitId) => {
    const habit = get().habits.find((h) => h.id === habitId);

    if (habit) {
      habitLogger.info('Удалена привычка', { name: habit.name, id: habitId });
    }

    set((state) => ({
      habits: state.habits.filter((h) => h.id !== habitId),
      showDeleteDialog: null,
    }));

    get().incrementActionCounter();
  },

  updateHabit: (habitId, updates) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === habitId ? { ...habit, ...updates } : habit
      ),
    }));

    habitLogger.debug('Обновлена привычка', { habitId, updates });
    get().incrementActionCounter();
  },

  toggleCompletion: (habitId, date) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === habitId);

    if (!habit) return;

    const currentValue = habit.completions[date];

    // Для бинарных привычек
    if (habit.type === 'binary') {
      const newCompletions = { ...habit.completions };
      const newSkipped = { ...habit.skipped };

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

    get().incrementActionCounter();
  },

  moveHabit: (dragIndex, hoverIndex) => {
    const state = get();
    const newHabits = [...state.habits];
    const [draggedHabit] = newHabits.splice(dragIndex, 1);
    newHabits.splice(hoverIndex, 0, draggedHabit);

    set({ habits: newHabits });
    habitLogger.debug('Привычка перемещена', { from: dragIndex, to: hoverIndex });
  },

  clearAllCompletions: () => {
    const state = get();
    const { selectedMonth, selectedYear } = state;

    // Сохраняем текущее состояние для Undo
    set({ previousHabitsState: [...state.habits], actionsAfterClear: 0 });

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const clearedHabits = state.habits.map((habit) => {
      const newCompletions = { ...habit.completions };
      const newSkipped = { ...habit.skipped };

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, selectedMonth, day);
        const dateStr = formatDate(date);
        delete newCompletions[dateStr];
        delete newSkipped[dateStr];
      }

      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        skipped: newSkipped,
      };

      return recalculateStrength(updatedHabit);
    });

    set({ habits: clearedHabits });
    habitLogger.info('Очищены все галочки есяца', { month: selectedMonth, year: selectedYear });
  },

  undoClearAllCompletions: () => {
    const state = get();

    if (state.previousHabitsState) {
      set({
        habits: state.previousHabitsState,
        previousHabitsState: null,
        actionsAfterClear: 0,
      });

      habitLogger.info('Отменена очистка галочек (Undo)');
    }
  },
});