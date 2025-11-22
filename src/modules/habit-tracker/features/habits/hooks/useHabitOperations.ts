/**
 * Хук для операций с привычками (CRUD)
 * 
 * Предоставляет обёртку над Zustand store actions для работы с привычками.
 * Используется в компонентах для выполнения операций: создание, обновление,
 * удаление, переключение выполнения, перемещение привычек.
 * 
 * @module modules/habit-tracker/features/habits/hooks/useHabitOperations
 * @created 22 ноября 2025
 */

import { useCallback } from 'react';
import { useHabitsStore } from '@/core/store';
import { useShallow } from 'zustand/react/shallow';
import type { Habit, HabitData } from '../types';

/**
 * Возвращаемый объект хука с операциями над привычками
 */
interface HabitOperations {
  /** Добавить новую привычку */
  addHabit: (habitData: HabitData) => void;
  /** Удалить привычку */
  deleteHabit: (habitId: string) => void;
  /** Обновить данные привычки */
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  /** Переключить выполнение привычки (бинарная) или открыть модалку ввода (измеримая) */
  toggleCompletion: (habitId: string, date: string) => void;
  /** Переключить все привычки на дату */
  toggleAllForDay: (date: string) => void;
  /** Переместить привычку в списке (drag-n-drop) */
  moveHabit: (dragIndex: number, hoverIndex: number) => void;
  /** Очистить все выполнения за текущий месяц */
  clearAllCompletions: () => void;
  /** Отменить очистку выполнений (Undo) */
  undoClearAllCompletions: () => void;
}

/**
 * Хук для управления операциями с привычками
 * 
 * @returns Объект с функциями операций над привычками
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { addHabit, deleteHabit, toggleCompletion } = useHabitOperations();
 *   
 *   const handleAdd = () => {
 *     addHabit({
 *       name: 'Медитация',
 *       type: 'binary',
 *       frequency: { type: 'daily' },
 *       // ...
 *     });
 *   };
 *   
 *   return <button onClick={handleAdd}>Добавить</button>;
 * }
 * ```
 */
export function useHabitOperations(): HabitOperations {
  // Получаем actions из store с оптимизацией через useShallow
  const operations = useHabitsStore(
    useShallow((state) => ({
      addHabit: state.addHabit,
      deleteHabit: state.deleteHabit,
      updateHabit: state.updateHabit,
      toggleCompletion: state.toggleCompletion,
      toggleAllForDay: state.toggleAllForDay,
      moveHabit: state.moveHabit,
      clearAllCompletions: state.clearAllCompletions,
      undoClearAllCompletions: state.undoClearAllCompletions,
    }))
  );

  // Оборачиваем в useCallback для стабильности ссылок
  const addHabit = useCallback(
    (habitData: HabitData) => operations.addHabit(habitData),
    [operations.addHabit]
  );

  const deleteHabit = useCallback(
    (habitId: string) => operations.deleteHabit(habitId),
    [operations.deleteHabit]
  );

  const updateHabit = useCallback(
    (habitId: string, updates: Partial<Habit>) => operations.updateHabit(habitId, updates),
    [operations.updateHabit]
  );

  const toggleCompletion = useCallback(
    (habitId: string, date: string) => operations.toggleCompletion(habitId, date),
    [operations.toggleCompletion]
  );

  const toggleAllForDay = useCallback(
    (date: string) => operations.toggleAllForDay(date),
    [operations.toggleAllForDay]
  );

  const moveHabit = useCallback(
    (dragIndex: number, hoverIndex: number) => operations.moveHabit(dragIndex, hoverIndex),
    [operations.moveHabit]
  );

  const clearAllCompletions = useCallback(
    () => operations.clearAllCompletions(),
    [operations.clearAllCompletions]
  );

  const undoClearAllCompletions = useCallback(
    () => operations.undoClearAllCompletions(),
    [operations.undoClearAllCompletions]
  );

  return {
    addHabit,
    deleteHabit,
    updateHabit,
    toggleCompletion,
    toggleAllForDay,
    moveHabit,
    clearAllCompletions,
    undoClearAllCompletions,
  };
}
