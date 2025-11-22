/**
 * CategoryPicker для привычек
 * 
 * Специфичная для модуля привычек обёртка над generic CategoryPicker.
 * Подключается к Zustand store и передаёт habit-specific логику.
 * 
 * @module modules/habit-tracker/features/categories/components
 * @created 22 ноября 2025
 */

import React from 'react';
import { CategoryPicker } from '@/shared/components/category-picker';
import { useHabitsStore } from '@/core/store';

export interface HabitCategoryPickerProps {
  /** Выбранная категория */
  selectedCategory: string;
  /** Callback выбора категории */
  onSelectCategory: (category: string) => void;
  /** Опциональное внешнее управление состоянием dropdown */
  isOpen?: boolean;
  /** Функция переключения состояния dropdown */
  onToggle?: () => void;
}

/**
 * CategoryPicker для привычек
 * 
 * Обёртка над generic CategoryPicker с подключением к habit store.
 * Автоматически подключает:
 * - Категории из store
 * - CRUD операции из store
 * - Подсчёт использований по привычкам
 * 
 * @example
 * ```tsx
 * <HabitCategoryPicker
 *   selectedCategory={habit.category}
 *   onSelectCategory={(cat) => updateHabit(habit.id, { category: cat })}
 * />
 * ```
 */
export const HabitCategoryPicker: React.FC<HabitCategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
  isOpen,
  onToggle,
}) => {
  // Подключаемся к habit store
  const categories = useHabitsStore(state => state.categories);
  const habits = useHabitsStore(state => state.habits);
  const addCategory = useHabitsStore(state => state.addCategory);
  const deleteCategory = useHabitsStore(state => state.deleteCategory);
  const updateCategoryColor = useHabitsStore(state => state.updateCategoryColor);

  return (
    <CategoryPicker
      selectedCategory={selectedCategory}
      onSelectCategory={onSelectCategory}
      categories={categories}
      onAddCategory={addCategory}
      onDeleteCategory={deleteCategory}
      onUpdateCategoryColor={updateCategoryColor}
      getCategoryUsageCount={(name) => habits.filter(h => h.category === name).length}
      isOpen={isOpen}
      onToggle={onToggle}
      placeholder="Без категории"
      deleteMessageSingular="привычке"
      deleteMessagePlural="привычках"
    />
  );
};
