/**
 * Модальное окно управления привычками
 * 
 * Функционал:
 * - Просмотр и редактирование всех привычек
 * - Изменение порядка через drag-and-drop
 * - Фильтрация по категориям и типам
 * - Добавление новых привычек
 * - Удаление привычек
 * 
 * Использует локальное состояние (manageHabitsModal slice) из Zustand store
 * для изолированного редактирования без влияния на основное состояние.
 * 
 * @module modules/habit-tracker/features/habits/components/ManageHabitsModal
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useShallow } from 'zustand/react/shallow';
import { Modal } from '@/shared/constructors/modal';
import { AddHabitModal } from './AddHabitModal';
import type { Habit, HabitType, FrequencyConfig, Reminder, MeasurableSettings } from '../types';
import { Tag } from '@/modules/habit-tracker/features/tags';
import { ManageHabitsHeader, HabitsList, ManageHabitsFooter } from './manage';
import { DeleteDialog } from './DeleteDialog';
import { useHabitsFilter } from '@/modules/habit-tracker/shared/hooks/use-habits-filter';
import { useHabitsStore } from '@/core/store';

interface ManageHabitsModalProps {
  habits: Habit[];
  onClose: () => void;
  onSave: (habits: Habit[], tags: Tag[]) => void;
  selectedMonth: number;
  selectedYear: number;
}

export const ManageHabitsModal: React.FC<ManageHabitsModalProps> = ({
  habits: initialHabits,
  onClose,
  onSave,
  selectedMonth,
  selectedYear,
}) => {
  // === ZUSTAND STORE с useShallow для оптимизации ===
  const {
    localHabits,
    expandedHabitId,
    isInitialized,
    tags,
    initializeManageHabitsModal,
    resetManageHabitsModal,
    updateLocalHabit,
    deleteLocalHabit,
    addLocalHabit,
    moveLocalHabit,
    setExpandedHabitId,
    getHabitsToSave,
    clearCategoryFromLocalHabits,
    saveManageHabitsChanges,
    closeManageHabitsModal,
  } = useHabitsStore(
    useShallow((s) => ({
      localHabits: s.manageHabitsModal.localHabits,
      expandedHabitId: s.manageHabitsModal.expandedHabitId,
      isInitialized: s.manageHabitsModal.isInitialized,
      tags: s.tags,
      initializeManageHabitsModal: s.initializeManageHabitsModal,
      resetManageHabitsModal: s.resetManageHabitsModal,
      updateLocalHabit: s.updateLocalHabit,
      deleteLocalHabit: s.deleteLocalHabit,
      addLocalHabit: s.addLocalHabit,
      moveLocalHabit: s.moveLocalHabit,
      setExpandedHabitId: s.setExpandedHabitId,
      getHabitsToSave: s.getHabitsToSave,
      clearCategoryFromLocalHabits: s.clearCategoryFromLocalHabits,
      saveManageHabitsChanges: s.saveManageHabitsChanges,
      closeManageHabitsModal: s.closeManageHabitsModal,
    }))
  );
  
  // Инициализация при первом рендере
  React.useEffect(() => {
    if (!isInitialized) {
      initializeManageHabitsModal();
    }
  }, [isInitialized, initializeManageHabitsModal]);

  // UI state
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = React.useState(false);
  const [habitToDelete, setHabitToDelete] = React.useState<Habit | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Фильтрация привычек с использованием универсального хука
  const habitsFilter = useHabitsFilter(localHabits, {
    initialState: {
      isCategoryExpanded: false,
      isTypeExpanded: false,
    },
  });

  // ============= useCallback Оптимизации для производительности =============
  
  const handleAddHabit = React.useCallback(() => {
    setIsAddHabitModalOpen(true);
  }, []);

  const handleBackdropClick = React.useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleSave = React.useCallback(() => {
    // Сохраняем изменения в store (localHabits → habits)
    saveManageHabitsChanges();
    
    // Также сохраняем теги через старый механизм (для обратной совместимости)
    onSave([], tags); // Передаем пустой массив habits, т.к. они уже сохранены
    
    // Закрываем модалку
    closeManageHabitsModal();
  }, [saveManageHabitsChanges, onSave, tags, closeManageHabitsModal]);

  const handleCancel = React.useCallback(() => {
    // Отменяем изменения (сбрасываем localHabits)
    resetManageHabitsModal();
    
    // Закрываем модалку
    closeManageHabitsModal();
  }, [resetManageHabitsModal, closeManageHabitsModal]);

  const handleToggleFilterDropdown = React.useCallback(() => {
    setIsFilterDropdownOpen(prev => !prev);
  }, []);

  const handleCloseAddHabitModal = React.useCallback(() => {
    setIsAddHabitModalOpen(false);
  }, []);

  // Оптимизированные handlers для HabitsList
  const handleUpdateName = React.useCallback((id: string, name: string) => {
    updateLocalHabit(id, { name });
  }, [updateLocalHabit]);

  const handleUpdateDescription = React.useCallback((id: string, description: string) => {
    updateLocalHabit(id, { description });
  }, [updateLocalHabit]);

  const handleUpdateIcon = React.useCallback((id: string, icon: string) => {
    updateLocalHabit(id, { icon });
  }, [updateLocalHabit]);

  const handleUpdateTag = React.useCallback((id: string, tags: string[]) => {
    updateLocalHabit(id, { tags });
  }, [updateLocalHabit]);

  const handleUpdateSection = React.useCallback((id: string, section: string) => {
    updateLocalHabit(id, { section });
  }, [updateLocalHabit]);

  const handleUpdateReminders = React.useCallback((id: string, reminders: Reminder[]) => {
    updateLocalHabit(id, { reminders });
  }, [updateLocalHabit]);

  const handleUpdateType = React.useCallback((id: string, type: HabitType) => {
    updateLocalHabit(id, { type });
  }, [updateLocalHabit]);

  const handleUpdateFrequency = React.useCallback((id: string, frequency: FrequencyConfig) => {
    updateLocalHabit(id, { frequency });
  }, [updateLocalHabit]);

  const handleUpdateMeasurableSettings = React.useCallback((id: string, settings: MeasurableSettings) => {
    updateLocalHabit(id, settings);
  }, [updateLocalHabit]);

  const handleDeleteClick = React.useCallback((id: string) => {
    const habit = localHabits.find(h => h.id === id);
    if (habit) {
      setHabitToDelete(habit);
    }
  }, [localHabits]);

  const handleToggleExpand = React.useCallback((id: string) => {
    const currentExpandedId = useHabitsStore.getState().manageHabitsModal.expandedHabitId;
    setExpandedHabitId(currentExpandedId === id ? null : id);
  }, [setExpandedHabitId]);

  const handleConfirmDelete = React.useCallback(() => {
    if (habitToDelete) {
      deleteLocalHabit(habitToDelete.id);
      setHabitToDelete(null);
    }
  }, [habitToDelete, deleteLocalHabit]);

  const handleCancelDelete = React.useCallback(() => {
    setHabitToDelete(null);
  }, []);

  // Month year key for goals
  const monthYearKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

  return (
    <DndProvider backend={HTML5Backend}> 
      <Modal.Root level="modal" onClose={handleCancel}>
        <Modal.Backdrop onClick={handleCancel} />
        <Modal.Content size="xl" className="max-h-[85vh] flex flex-col">
          {/* Header */}
          <ManageHabitsHeader
            habitsCount={localHabits.length}
            onClose={handleCancel}
            localHabits={localHabits}
            localTags={tags}
            filterState={habitsFilter.state}
            filterActions={habitsFilter.actions}
            hasActiveFilters={habitsFilter.result.hasActiveFilters}
            isFilterDropdownOpen={isFilterDropdownOpen}
            onToggleFilterDropdown={handleToggleFilterDropdown}
          />

          {/* Habits List */}
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
            onMove={moveLocalHabit}
            onToggleExpand={handleToggleExpand}
          />

          {/* Footer */}
          <ManageHabitsFooter
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </Modal.Content>

        {/* Add Habit Modal */}
        {isAddHabitModalOpen && (
          <AddHabitModal
            onClose={handleCloseAddHabitModal}
            onAdd={addLocalHabit}
            daysInMonth={new Date(selectedYear, selectedMonth + 1, 0).getDate()}
          />
        )}

        {/* Delete Habit Dialog */}
        {habitToDelete && (
          <DeleteDialog
            habitName={habitToDelete.name}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </Modal.Root>
    </DndProvider>
  );
};