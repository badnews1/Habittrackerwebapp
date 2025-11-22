/**
 * Manage Habits Modal Slice - управление модальным окном редактирования привычек
 * 
 * Содержит actions для работы с локальным состоянием модального окна:
 * - Инициализация (deep copy habits)
 * - CRUD операции над локальными привычками
 * - Сохранение/отмена изменений
 * 
 * Локальное состояние позволяет редактировать привычки без изменения
 * глобального state до момента нажатия "Сохранить".
 * 
 * @module core/store/slices/manageHabitsModal
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import type { Habit, HabitData } from '@/modules/habit-tracker/types';
import { habitLogger, categoryLogger } from '@/shared/utils/logger';

/**
 * Создает slice с actions для модального окна управления привычками
 */
export const createManageHabitsModalSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<
    HabitsState,
    | 'initializeManageHabitsModal'
    | 'resetManageHabitsModal'
    | 'updateLocalHabit'
    | 'deleteLocalHabit'
    | 'addLocalHabit'
    | 'moveLocalHabit'
    | 'setExpandedHabitId'
    | 'getHabitsToSave'
    | 'clearCategoryFromLocalHabits'
    | 'saveManageHabitsChanges'
  >
> = (set, get) => ({
  initializeManageHabitsModal: () => {
    const state = get();

    set({
      manageHabitsModal: {
        localHabits: JSON.parse(JSON.stringify(state.habits)),
        expandedHabitId: null,
        isInitialized: true,
      },
    });
  },

  resetManageHabitsModal: () => {
    set({
      manageHabitsModal: {
        localHabits: [],
        expandedHabitId: null,
        isInitialized: false,
      },
    });
  },

  updateLocalHabit: (habitId, updates) => {
    set((state) => ({
      manageHabitsModal: {
        ...state.manageHabitsModal,
        localHabits: state.manageHabitsModal.localHabits.map((habit) =>
          habit.id === habitId ? { ...habit, ...updates } : habit
        ),
      },
    }));

    habitLogger.debug('Обновлена локальная привычка', { habitId, updates });
  },

  deleteLocalHabit: (habitId) => {
    set((state) => ({
      manageHabitsModal: {
        ...state.manageHabitsModal,
        localHabits: state.manageHabitsModal.localHabits.filter((h) => h.id !== habitId),
      },
    }));

    habitLogger.info('Удалена локальная привычка', { id: habitId });
  },

  addLocalHabit: (habitData) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name,
      description: habitData.description,
      createdAt: new Date().toISOString(),
      completions: {},
      frequency: habitData.frequency,
      icon: habitData.icon,
      category: habitData.category,
      type: habitData.type,
      unit: habitData.unit,
      targetValue: habitData.targetValue,
      targetType: habitData.targetType,
      strength: 0,
      lastStrengthUpdate: new Date().toISOString(),
      strengthBaseline: 0,
    };

    habitLogger.info('Добавлена новая локальная привычка', {
      name: newHabit.name,
      type: newHabit.type,
      id: newHabit.id,
    });

    set((state) => ({
      manageHabitsModal: {
        ...state.manageHabitsModal,
        localHabits: [...state.manageHabitsModal.localHabits, newHabit],
      },
    }));

    get().incrementActionCounter();
  },

  moveLocalHabit: (dragIndex, hoverIndex) => {
    const state = get();
    const newHabits = [...state.manageHabitsModal.localHabits];
    const [draggedHabit] = newHabits.splice(dragIndex, 1);
    newHabits.splice(hoverIndex, 0, draggedHabit);

    set({
      manageHabitsModal: {
        ...state.manageHabitsModal,
        localHabits: newHabits,
      },
    });

    habitLogger.debug('Локальная привычка перемещена', { from: dragIndex, to: hoverIndex });
  },

  setExpandedHabitId: (habitId) => {
    set((state) => ({
      manageHabitsModal: {
        ...state.manageHabitsModal,
        expandedHabitId: habitId,
      },
    }));
  },

  getHabitsToSave: () => {
    const state = get();

    return state.manageHabitsModal.localHabits.filter((habit) => habit.name.trim() !== '');
  },

  clearCategoryFromLocalHabits: (categoryName) => {
    set((state) => ({
      manageHabitsModal: {
        ...state.manageHabitsModal,
        localHabits: state.manageHabitsModal.localHabits.map((habit) =>
          habit.category === categoryName ? { ...habit, category: undefined } : habit
        ),
      },
    }));

    categoryLogger.info('Очищена категория у локальных привычек', { name: categoryName });
  },

  saveManageHabitsChanges: () => {
    const state = get();

    // Фильтруем привычки с пустыми именами перед сохранением
    const habitsToSave = state.manageHabitsModal.localHabits.filter(
      (habit) => habit.name.trim() !== ''
    );

    set({
      habits: habitsToSave,
      manageHabitsModal: {
        localHabits: [],
        expandedHabitId: null,
        isInitialized: false,
      },
    });

    habitLogger.info('Сохранены изменения из модального окна управления привычками');
  },
});