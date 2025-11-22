/**
 * Хук для доступа к состоянию привычек
 * 
 * Предоставляет оптимизированный доступ к глобальному состоянию привычек
 * из Zustand store с использованием useShallow для предотвращения лишних ререндеров.
 * 
 * @module modules/habit-tracker/features/habits/hooks/useHabitState
 * @created 22 ноября 2025
 */

import { useHabitsStore } from '@/core/store';
import { useShallow } from 'zustand/react/shallow';
import type { Habit } from '../types';

/**
 * Состояние привычек из store
 */
interface HabitState {
  /** Список всех привычек */
  habits: Habit[];
  /** ID последней добавленной привычки (для автофокуса) */
  newlyAddedHabitId: string | null;
  /** Очистить ID последней добавленной привычки */
  clearNewlyAddedHabitId: () => void;
  /** Предыдущее состояние привычек (для Undo после clearAll) */
  previousHabitsState: Habit[] | null;
  /** Количество действий после очистки (для валидации Undo) */
  actionsAfterClear: number;
}

/**
 * Хук для получения состояния привычек из store
 * 
 * Использует useShallow для оптимизации и предотвращения
 * лишних ререндеров при изменении других частей store.
 * 
 * @returns Объект с состоянием привычек
 * 
 * @example
 * ```tsx
 * function HabitsList() {
 *   const { habits, newlyAddedHabitId } = useHabitState();
 *   
 *   return (
 *     <div>
 *       {habits.map(habit => (
 *         <HabitItem 
 *           key={habit.id} 
 *           habit={habit}
 *           isNew={habit.id === newlyAddedHabitId}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useHabitState(): HabitState {
  return useHabitsStore(
    useShallow((state) => ({
      habits: state.habits,
      newlyAddedHabitId: state.newlyAddedHabitId,
      clearNewlyAddedHabitId: state.clearNewlyAddedHabitId,
      previousHabitsState: state.previousHabitsState,
      actionsAfterClear: state.actionsAfterClear,
    }))
  );
}
