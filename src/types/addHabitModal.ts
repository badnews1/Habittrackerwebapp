import { Category } from './category';
import { Habit, HabitData } from './habit';

/**
 * Props for AddHabitModal component
 * Used for adding new habits or editing existing ones
 */
export interface AddHabitModalProps {
  /** Callback to close the modal */
  onClose: () => void;
  
  /** Callback to add/update a habit */
  onAdd: (habitData: HabitData) => void;
  
  /** List of available categories */
  categories: Category[];
  
  /** Callback to add a new category */
  onAddCategory: (category: string) => void;
  
  /** Callback to delete a category */
  onDeleteCategory: (category: string) => void;
  
  /** Callback to update category color */
  onUpdateCategoryColor: (categoryName: string, color: string) => void;
  
  /** Number of days in the current month */
  daysInMonth: number;
  
  /** All existing habits (for validation) */
  allHabits: Habit[];
  
  /** Whether the modal is in editing mode */
  isEditing?: boolean;
  
  /** Initial data for editing mode */
  initialData?: Partial<Habit>;
}