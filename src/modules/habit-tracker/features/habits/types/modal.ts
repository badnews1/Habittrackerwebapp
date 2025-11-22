/**
 * Типы для модальных окон привычек
 * 
 * @module modules/habit-tracker/features/habits/types/modal
 * @created 22 ноября 2025
 * @migrated из /types/addHabitModal.ts
 */

import { Habit, HabitData } from '@/modules/habit-tracker/types';

/**
 * Props for AddHabitModal component
 * Used for adding new habits or editing existing ones
 * 
 * Обновлено: 22 ноября 2025 - убраны category props (управляются через store)
 */
export interface AddHabitModalProps {
  /** Callback to close the modal */
  onClose: () => void;
  
  /** Callback to add/update a habit */
  onAdd: (habitData: HabitData) => void;
  
  /** Number of days in the current month */
  daysInMonth: number;
  
  /** Whether the modal is in editing mode */
  isEditing?: boolean;
  
  /** Initial data for editing mode */
  initialData?: Partial<Habit>;
}