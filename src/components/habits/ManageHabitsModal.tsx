import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal } from '../modal';
import { AddHabitModal } from './AddHabitModal';
import { Habit, HabitType, FrequencyConfig, Reminder, MeasurableSettings } from '../../types/habit';
import { Category } from '../../types/category';
import { ManageHabitsHeader, HabitsList, ManageHabitsFooter } from './manage';
import { DeleteDialog } from '../modals/DeleteDialog';
import { useHabitsFilter } from '../../hooks/useHabitsFilter';
import { useCategoriesManager } from '../../hooks/useCategoriesManager';
import { useHabitsStore } from '../../stores/habitsStore';

interface ManageHabitsModalProps {
  habits: Habit[];
  onClose: () => void;
  onSave: (habits: Habit[], categories: Category[]) => void;
  selectedMonth: number;
  selectedYear: number;
  categories: Category[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onUpdateCategoryColor: (categoryName: string, color: string) => void;
}

export const ManageHabitsModal: React.FC<ManageHabitsModalProps> = ({
  habits: initialHabits,
  onClose,
  onSave,
  selectedMonth,
  selectedYear,
  categories: initialCategories,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategoryColor,
}) => {
  // === ZUSTAND STORE с useShallow для оптимизации ===
  const {
    localHabits,
    expandedHabitId,
    isInitialized,
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

  // Управление категориями через хук (пока не мигрировали)
  const {
    localCategories,
    handleAddCategory,
    handleDeleteCategory,
    handleUpdateCategoryColor,
  } = useCategoriesManager(initialCategories, clearCategoryFromLocalHabits);

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
    
    // Также сохраняем категории через старый механизм (пока не мигрировали)
    onSave([], localCategories); // Передаем пустой массив habits, т.к. они уже сохранены
    
    // Закрываем модалку
    closeManageHabitsModal();
  }, [saveManageHabitsChanges, onSave, localCategories, closeManageHabitsModal]);

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

  const handleUpdateCategory = React.useCallback((id: string, category: string) => {
    updateLocalHabit(id, { category });
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
            localCategories={localCategories}
            filterState={habitsFilter.state}
            filterActions={habitsFilter.actions}
            hasActiveFilters={habitsFilter.result.hasActiveFilters}
            isFilterDropdownOpen={isFilterDropdownOpen}
            onToggleFilterDropdown={handleToggleFilterDropdown}
          />

          {/* Habits List */}
          <HabitsList
            filteredHabits={habitsFilter.result.filteredHabits}
            localHabits={localHabits}
            expandedHabitId={expandedHabitId}
            scrollContainerRef={scrollContainerRef}
            monthYearKey={monthYearKey}
            localCategories={localCategories}
            onUpdateName={handleUpdateName}
            onUpdateDescription={handleUpdateDescription}
            onUpdateIcon={handleUpdateIcon}
            onUpdateCategory={handleUpdateCategory}
            onUpdateReminders={handleUpdateReminders}
            onUpdateType={handleUpdateType}
            onUpdateFrequency={handleUpdateFrequency}
            onUpdateMeasurableSettings={handleUpdateMeasurableSettings}
            onDeleteClick={handleDeleteClick}
            onMove={moveLocalHabit}
            onToggleExpand={handleToggleExpand}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateCategoryColor={handleUpdateCategoryColor}
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
            categories={localCategories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateCategoryColor={handleUpdateCategoryColor}
            daysInMonth={new Date(selectedYear, selectedMonth + 1, 0).getDate()}
            allHabits={localHabits}
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