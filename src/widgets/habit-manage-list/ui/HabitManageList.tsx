/**
 * Виджет списка управления привычками
 * 
 * Композиция фильтров и списка привычек.
 * На этом этапе работает с локальным состоянием (будет рефакторинг на следующих шагах).
 * 
 * @module widgets/habit-manage-list/ui/HabitManageList
 * @created 1 декабря 2025
 */

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useShallow } from 'zustand/react/shallow';
import { useHabitsStore } from '@/app/store';
import { HabitsList, DeleteDialog } from '@/features/habit-manage';
import { useHabitsFilter } from '@/features/habit-filters';
import { FilterDropdown } from '@/shared/ui/filter-dropdown';
import { declineHabits } from '@/shared/lib/text';
import { 
  countByTag, 
  countBySection, 
  countByType, 
  countUncategorized, 
  hasUncategorizedHabits,
  getUniqueSections 
} from '@/entities/habit';
import type { Habit, HabitType, FrequencyConfig, Reminder, MeasurableSettings } from '@/entities/habit';
import type { FilterSection } from '@/shared/types';
import { Plus } from '@/shared/assets/icons/system';
import { useTranslation } from 'react-i18next';
import { useTranslatedTagName } from '@/entities/tag';
import { useTranslatedSectionName } from '@/entities/section';

export const HabitManageList: React.FC = () => {
  const { t, i18n } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  const currentLanguage = i18n.language;
  const getTranslatedTagName = useTranslatedTagName();
  const getTranslatedSectionName = useTranslatedSectionName();
  
  // === ZUSTAND STORE (работаем напрямую с глобальным state) ===
  const {
    habits,
    tags,
    selectedMonth,
    selectedYear,
    updateHabit,
    deleteHabit,
    moveHabit,
    openAddHabitModal,
  } = useHabitsStore(
    useShallow((s) => ({
      habits: s.habits,
      tags: s.tags,
      selectedMonth: s.selectedMonth,
      selectedYear: s.selectedYear,
      updateHabit: s.updateHabit,
      deleteHabit: s.deleteHabit,
      moveHabit: s.moveHabit,
      openAddHabitModal: s.openAddHabitModal,
    }))
  );

  // Локальный UI state для раскрытой привычки
  const [expandedHabitId, setExpandedHabitId] = React.useState<string | null>(null);

  // UI state
  const [habitToDelete, setHabitToDelete] = React.useState<Habit | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  
  // Фильтрация привычек
  const habitsFilter = useHabitsFilter(habits);

  // Подсчёт количества привычек для фильтров
  const filterCounts = React.useMemo(() => ({
    tags: countByTag(habits),
    sections: countBySection(habits),
    types: countByType(habits),
    uncategorized: countUncategorized(habits),
  }), [habits]);

  // Получаем уникальные секции
  const availableSections = React.useMemo(() => getUniqueSections(habits), [habits]);

  // Подготавливаем секции фильтров
  const filterSections: FilterSection[] = React.useMemo(() => {
    const sections: FilterSection[] = [];

    // Секция "Теги"
    const tagOptions = [];
    
    // Опция "Без тега"
    if (hasUncategorizedHabits(habits)) {
      tagOptions.push({
        id: 'uncategorized',
        label: t('manage.filters.uncategorized'),
        checked: habitsFilter.state.showUncategorized,
        count: filterCounts.uncategorized,
        onChange: habitsFilter.actions.toggleUncategorized,
      });
    }
    
    // Опции для каждого тега
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag) => {
        tagOptions.push({
          id: tag.name,
          label: getTranslatedTagName(tag.name),
          checked: habitsFilter.state.selectedCategories.has(tag.name),
          count: filterCounts.tags.get(tag.name) || 0,
          onChange: () => habitsFilter.actions.toggleCategory(tag.name),
        });
      });
    }

    sections.push({
      id: 'tags',
      title: t('manage.filters.tags'),
      options: tagOptions,
    });

    // Секция "Разделы"
    const sectionOptions = availableSections.map((section) => ({
      id: section,
      label: getTranslatedSectionName(section),
      checked: habitsFilter.state.selectedSections.has(section),
      count: filterCounts.sections.get(section) || 0,
      onChange: () => habitsFilter.actions.toggleSection(section),
    }));

    sections.push({
      id: 'sections',
      title: t('manage.filters.sections'),
      options: sectionOptions,
    });

    // Секция "Тип отслеживания"
    sections.push({
      id: 'types',
      title: t('manage.filters.trackingType'),
      options: [
        {
          id: 'binary',
          label: t('habit.types.binary'),
          checked: habitsFilter.state.selectedTypes.has('binary'),
          count: filterCounts.types.binary,
          onChange: () => habitsFilter.actions.toggleType('binary'),
        },
        {
          id: 'measurable',
          label: t('habit.types.measurable'),
          checked: habitsFilter.state.selectedTypes.has('measurable'),
          count: filterCounts.types.measurable,
          onChange: () => habitsFilter.actions.toggleType('measurable'),
        },
      ],
    });

    return sections;
  }, [habits, tags, habitsFilter.state, habitsFilter.actions, filterCounts, availableSections, getTranslatedTagName, getTranslatedSectionName, t]);

  // Handlers
  const handleToggleFilterDropdown = React.useCallback(() => {
    setIsFilterDropdownOpen(prev => !prev);
  }, []);

  const handleUpdateName = React.useCallback((id: string, name: string) => {
    updateHabit(id, { name });
  }, [updateHabit]);

  const handleUpdateDescription = React.useCallback((id: string, description: string) => {
    updateHabit(id, { description });
  }, [updateHabit]);

  const handleUpdateIcon = React.useCallback((id: string, icon: string) => {
    updateHabit(id, { icon });
  }, [updateHabit]);

  const handleUpdateTag = React.useCallback((id: string, tags: string[]) => {
    updateHabit(id, { tags });
  }, [updateHabit]);

  const handleUpdateSection = React.useCallback((id: string, section: string) => {
    updateHabit(id, { section });
  }, [updateHabit]);

  const handleUpdateReminders = React.useCallback((id: string, reminders: Reminder[]) => {
    updateHabit(id, { reminders });
  }, [updateHabit]);

  const handleUpdateType = React.useCallback((id: string, type: HabitType) => {
    updateHabit(id, { type });
  }, [updateHabit]);

  const handleUpdateFrequency = React.useCallback((id: string, frequency: FrequencyConfig) => {
    updateHabit(id, { frequency });
  }, [updateHabit]);

  const handleUpdateMeasurableSettings = React.useCallback((id: string, settings: MeasurableSettings) => {
    updateHabit(id, settings);
  }, [updateHabit]);

  const handleDeleteClick = React.useCallback((id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      setHabitToDelete(habit);
    }
  }, [habits]);

  const handleToggleExpand = React.useCallback((id: string) => {
    setExpandedHabitId(prev => prev === id ? null : id);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id);
      setHabitToDelete(null);
    }
  }, [habitToDelete, deleteHabit]);

  const handleCancelDelete = React.useCallback(() => {
    setHabitToDelete(null);
  }, []);

  // Month year key for goals
  const monthYearKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header с фильтрами и счётчиком */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FilterDropdown
              sections={filterSections}
              hasActiveFilters={habitsFilter.result.hasActiveFilters}
              onClearAll={habitsFilter.actions.clearAllFilters}
              isOpen={isFilterDropdownOpen}
              onToggleOpen={handleToggleFilterDropdown}
            />
          </div>
          
          <p className="text-text-tertiary">
            {habitsFilter.result.filteredHabits.length} {declineHabits(habitsFilter.result.filteredHabits.length, t, currentLanguage)}
          </p>
        </div>

        {/* Список привычек */}
        <HabitsList
          habits={habitsFilter.result.filteredHabits}
          expandedHabitId={expandedHabitId}
          monthYearKey={monthYearKey}
          onUpdateName={handleUpdateName}
          onUpdateDescription={handleUpdateDescription}
          onUpdateIcon={handleUpdateIcon}
          onUpdateTag={handleUpdateTag}
          onUpdateSection={handleUpdateSection}
          onUpdateReminders={handleUpdateReminders}
          onUpdateType={handleUpdateType}
          onUpdateFrequency={handleUpdateFrequency}
          onUpdateMeasurableSettings={handleUpdateMeasurableSettings}
          onDeleteClick={handleDeleteClick}
          onMove={moveHabit}
          onToggleExpand={handleToggleExpand}
        />

        {/* Кнопка добавления привычки */}
        <button
          onClick={openAddHabitModal}
          className="w-full py-3 border-2 border-dashed border-border-default hover:border-border-hover rounded-lg transition-colors flex items-center justify-center gap-2 text-text-tertiary hover:text-text-primary"
        >
          <Plus className="w-5 h-5" />
          <span>{t('habit.addHabit')}</span>
        </button>
      </div>

      {/* Delete Dialog */}
      {habitToDelete && (
        <DeleteDialog
          habitName={habitToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </DndProvider>
  );
};