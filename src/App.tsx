/**
 * Главный компонент приложения Habit Tracker
 * 
 * Мигрирован на Zustand для централизованного управления состоянием.
 * Все данные (привычки, категории, цели) и UI состояние теперь хранятся в store.
 * 
 * @module App
 * @see /stores/habitsStore.ts
 */

import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './components/layout/Sidebar';
import { HabitsTable } from './components/habits/HabitsTable';
import { CalendarHeader } from './components/calendar/CalendarHeader';
import { RulerControls } from './components/dev/RulerControls';
import { NotificationManager } from './components/notifications/NotificationManager';
import { NotificationPermissionBanner } from './components/notifications/NotificationPermissionBanner';
import { VersionIndicator } from './components/layout/VersionIndicator';
import { DebugPanel } from './components/dev/DebugPanel';
import { AppModals } from './components/modals/AppModals';
import { DateConfig, HabitActions, ModalActions, GoalConfig, UndoConfig } from './types/habitsTableProps';
import { getDaysInMonth, formatDate, getDayName } from './utils/dateUtils';
import { useHabitsStore } from './stores/habitsStore';
import { useRulerState } from './hooks/useRulerState';
import { useRulerMode } from './hooks/useRulerMode';
import { recalculateStrength } from './utils/strengthCalculator';

export default function App() {
  // ==================== ZUSTAND STORE ====================
  // Получаем все данные и actions из централизованного store
  const {
    // Данные
    habits,
    categories,
    dailyGoals,
    defaultDailyGoal,
    
    // UI состояние
    currentSection,
    isSidebarOpen,
    selectedMonth,
    selectedYear,
    
    // Undo система
    previousHabitsState,
    
    // Модальные окна
    showDeleteDialog,
    newlyAddedHabitId,
    numericInputModal,
    isMonthYearPickerOpen,
    editingGoal,
    isManageHabitsModalOpen,
    isAddHabitModalOpen,
    
    // Actions: UI
    setCurrentSection,
    toggleSidebar,
    setSelectedDate,
    
    // Actions: Модальные окна
    openAddHabitModal,
    closeAddHabitModal,
    openManageHabitsModal,
    closeManageHabitsModal,
    openDeleteDialog,
    closeDeleteDialog,
    openNumericInputModal,
    closeNumericInputModal,
    openMonthYearPicker,
    closeMonthYearPicker,
    setEditingGoal,
    clearNewlyAddedHabitId,
    
    // Actions: Привычки
    addHabit,
    deleteHabit,
    updateHabit,
    toggleCompletion,
    toggleAllForDay,
    moveHabit,
    clearAllCompletions,
    undoClearAllCompletions,
    
    // Actions: Категории
    addCategory,
    deleteCategory,
    updateCategoryColor,
    
    // Actions: Цели
    setDailyGoals,
    setDefaultDailyGoal,
    handleDefaultDailyGoalChange,
    
    // Actions: Внутренние
    updateHabitsStrength,
  } = useHabitsStore();

  // ==================== RULER STATE (dev only) ====================
  const rulerState = useRulerState();
  
  // Ruler mode (keyboard + dragging)
  useRulerMode(
    rulerState.draggingGuide,
    rulerState.setDraggingGuide,
    rulerState.setAddingGuideType,
    rulerState.setRulerMode,
    rulerState.setGuides
  );

  // ==================== EFFECTS ====================
  
  // Обновляем силу привычек при загрузке приложения (новый день)
  useEffect(() => {
    updateHabitsStrength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Только при монтировании

  // ==================== COMPUTED VALUES ====================
  
  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  // ==================== MODAL HANDLERS ====================
  
  // Обработчик подтверждения удаления привычки
  const handleDeleteConfirm = () => {
    if (showDeleteDialog) {
      deleteHabit(showDeleteDialog);
    }
  };

  // Обработчик сохранения числового значения для измеримой привычки
  const handleNumericInputSave = (value: number) => {
    if (!numericInputModal) return;
    
    const { habitId, date } = numericInputModal;
    const habit = habits.find(h => h.id === habitId);
    
    if (habit) {
      const newCompletions = { ...habit.completions };
      newCompletions[date] = value;
      
      const updatedHabit = {
        ...habit,
        completions: newCompletions,
      };
      
      // Пересчитываем силу привычки
      const habitWithStrength = recalculateStrength(updatedHabit);
      updateHabit(habitId, habitWithStrength);
    }
    
    closeNumericInputModal();
  };

  // Обработчик пропуска (skip) для измеримой привычки
  const handleNumericInputSkip = () => {
    if (!numericInputModal) return;
    
    const { habitId, date } = numericInputModal;
    const habit = habits.find(h => h.id === habitId);
    
    if (habit) {
      const newCompletions = { ...habit.completions };
      const newSkipped = { ...habit.skipped };
      
      // Если уже был пропуск - удаляем, иначе добавляем
      if (newSkipped[date]) {
        delete newCompletions[date];
        delete newSkipped[date];
      } else {
        newCompletions[date] = 0;
        newSkipped[date] = true;
      }
      
      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        skipped: newSkipped,
      };
      
      // Пересчитываем силу привычки
      const habitWithStrength = recalculateStrength(updatedHabit);
      updateHabit(habitId, habitWithStrength);
    }
    
    closeNumericInputModal();
  };

  // Обработчик выбора месяца/года
  const handleMonthYearSelect = (month: number, year: number) => {
    setSelectedDate(month, year);
    closeMonthYearPicker();
  };

  // Обработчик сохранения из ManageHabitsModal
  const handleManageHabitsSave = (updatedHabits: Habit[], updatedCategories: Category[]) => {
    // Привычки уже сохранены через store (saveManageHabitsChanges)
    // Здесь обрабатываем только категории (пока не мигрированы в store)
    
    // Обновляем категории, если они изменились
    const currentCategoriesStr = JSON.stringify(categories);
    const updatedCategoriesStr = JSON.stringify(updatedCategories);
    
    if (currentCategoriesStr !== updatedCategoriesStr) {
      // TODO: Когда categories будут в store, это можно будет удалить
      // Пока categories еще в App.tsx state через store actions
    }
    
    closeManageHabitsModal();
  };

  // ==================== GROUPED PROPS ====================
  
  // Group related props for HabitsTable
  const dateConfig: DateConfig = {
    selectedMonth,
    selectedYear,
    monthDays,
    formatDate,
    getDayName,
  };

  const habitActions: HabitActions = {
    onDelete: openDeleteDialog,
    onToggleCompletion: toggleCompletion,
    onToggleAllForDay: toggleAllForDay,
    onMoveHabit: moveHabit,
    onUpdateHabit: updateHabit,
  };

  const modalActions: ModalActions = {
    onAddHabit: openAddHabitModal,
    onManageHabits: openManageHabitsModal,
    onOpenNumericInput: openNumericInputModal,
  };

  const goalConfig: GoalConfig = {
    dailyGoals,
    editingGoal,
    defaultDailyGoal,
    onSetDailyGoals: setDailyGoals,
    onSetEditingGoal: setEditingGoal,
    onSetDefaultDailyGoal: handleDefaultDailyGoalChange,
  };

  const undoConfig: UndoConfig = {
    canUndo: previousHabitsState !== null,
    onClearAllCompletions: clearAllCompletions,
    onUndoClearAllCompletions: undoClearAllCompletions,
  };

  // ==================== RENDER ====================
  
  return (
    <div className="flex min-h-screen bg-white">
      {/* Notification Manager */}
      <NotificationManager habits={habits} />
      
      {/* Sidebar */}
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection}
        isOpen={isSidebarOpen}
        onClose={() => toggleSidebar(false)}
      />
    
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-auto">
        <div className="pl-5 pr-5 pt-12 pb-12">
          <CalendarHeader />

          {/* Habits List */}
          <DndProvider backend={HTML5Backend}>
            <HabitsTable />
          </DndProvider>
        </div>

        {/* All Modals */}
        <AppModals
          showDeleteDialog={showDeleteDialog}
          habits={habits}
          onDeleteConfirm={handleDeleteConfirm}
          onDeleteCancel={closeDeleteDialog}
          numericInputModal={numericInputModal}
          onNumericInputClose={closeNumericInputModal}
          onNumericInputSave={handleNumericInputSave}
          onNumericInputSkip={handleNumericInputSkip}
          isMonthYearPickerOpen={isMonthYearPickerOpen}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthYearSelect={handleMonthYearSelect}
          onMonthYearClose={closeMonthYearPicker}
          isManageHabitsModalOpen={isManageHabitsModalOpen}
          categories={categories}
          onManageHabitsClose={closeManageHabitsModal}
          onManageHabitsSave={handleManageHabitsSave}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onUpdateCategoryColor={updateCategoryColor}
          isAddHabitModalOpen={isAddHabitModalOpen}
          onAddHabitClose={closeAddHabitModal}
          onAddHabit={addHabit}
          daysInMonth={monthDays.length}
        />
      </main>

      {/* Dev Tools */}
      {process.env.NODE_ENV === 'development' && (
        <RulerControls {...rulerState} />
      )}
      
      <NotificationPermissionBanner />
      <VersionIndicator />
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel habits={habits} />
      )}
    </div>
  );
}