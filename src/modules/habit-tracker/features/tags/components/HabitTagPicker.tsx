/**
 * TagPicker для привычек
 * 
 * Специфичная для модуля привычек обёртка над generic TagPicker.
 * Подключается к Zustand store и передаёт habit-specific логику.
 * 
 * @module modules/habit-tracker/features/tags/components
 * @created 23 ноября 2025 (миграция с categories)
 */

import React from 'react';
import { TagPicker } from '@/shared/components/tag-picker';
import { useHabitsStore } from '@/core/store';

export interface HabitTagPickerProps {
  /** Выбранные теги */
  selectedTags: string[];
  /** Callback выбора тегов */
  onSelectTags: (tags: string[]) => void;
  /** Открыт ли пикер */
  isOpen: boolean;
  /** Toggle функция */
  onToggle: () => void;
}

/**
 * TagPicker для привычек
 * 
 * Обёртка над generic TagPicker с подключением к habit store.
 * Автоматически подключает:
 * - Теги из store
 * - CRUD операции из store
 * - Подсчёт использований по привычкам
 * 
 * @example
 * ```tsx
 * <HabitTagPicker
 *   selectedTags={habit.tags}
 *   onSelectTags={(tags) => updateHabit(habit.id, { tags })}
 *   isOpen={isOpen}
 *   onToggle={() => setIsOpen(!isOpen)}
 * />
 * ```
 */
export const HabitTagPicker: React.FC<HabitTagPickerProps> = ({
  selectedTags,
  onSelectTags,
  isOpen,
  onToggle,
}) => {
  // Подключаемся к habit store
  const tags = useHabitsStore(state => state.tags);
  const habits = useHabitsStore(state => state.habits);
  const addTag = useHabitsStore(state => state.addTag);
  const deleteTag = useHabitsStore(state => state.deleteTag);

  return (
    <TagPicker
      selectedTags={selectedTags}
      onSelectTags={onSelectTags}
      tags={tags}
      onAddTag={addTag}
      onDeleteTag={deleteTag}
      getTagUsageCount={(name) => habits.filter(h => h.tags?.includes(name)).length}
      placeholder="Без тега"
      deleteMessageSingular="привычке"
      deleteMessagePlural="привычках"
      isOpen={isOpen}
      onToggle={onToggle}
    />
  );
};