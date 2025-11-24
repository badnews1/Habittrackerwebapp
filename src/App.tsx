/**
 * Главный компонент приложения Habit Tracker
 * 
 * Мигрирован на Zustand для централизованного управления состоянием.
 * Все данные (привычки, категории, цели) и UI состояние теперь хранятся в store.
 * 
 * @module App
 * @see /core/store/index.ts
 */

import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from '@/shared/components/layout';
import { HabitsTable } from '@/modules/habit-tracker/features/habits';
import { CalendarHeader } from '@/modules/habit-tracker/features/calendar';
import { HabitsNotificationManager } from '@/modules/habit-tracker/features/notifications';
import { NotificationPermissionBanner } from '@/shared/components/notifications';
import { VersionIndicator } from '@/shared/components/layout';
import { HabitTrackerModals } from '@/core/modals';
import { DateConfig, HabitActions, ModalActions, GoalConfig, UndoConfig } from '@/modules/habit-tracker/features/habits/types';
import { getDaysInMonth, formatDate, getDayName } from '@/shared/utils/date';
import { useHabitsStore } from '@/core/store';
import { recalculateStrength } from '@/modules/habit-tracker/features/strength';
import { Habit } from '@/modules/habit-tracker/types';
import { Tag } from '@/modules/habit-tracker/features/tags';

export default function App() {
  // ==================== ZUSTAND STORE ====================
  // Получаем все данные и actions из централизованного store
  const {
    // Данные
    habits,
    tags,
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
    moveHabit,
    clearAllCompletions,
    undoClearAllCompletions,
    
    // Actions: Теги
    addTag,
    deleteTag,
    updateTagColor,
    
    // Actions: Цели
    setDailyGoals,
    setDefaultDailyGoal,
    handleDefaultDailyGoalChange,
    
    // Actions: Внутренние
    updateHabitsStrength,
  } = useHabitsStore();

  // ==================== EFFECTS ====================
  
  // Обновляем силу привычек при загрузке приложения (новый день)
  useEffect(() => {
    updateHabitsStrength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Только при монтировании

  // ==================== COMPUTED VALUES ====================
  
  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  // ==================== MODAL HANDLERS ====================
  
  // Обработчик сохранения числового значения для измеримой привычки
  const handleNumericInputSave = (habitId: string, date: string, value: number) => {
    const habit = habits.find(h => h.id === habitId);
    
    if (habit) {
      const newCompletions = { ...habit.completions };
      const newSkipped = { ...habit.skipped };
      
      newCompletions[date] = value;
      
      // Если привычка была заморожена на этот день, снимаем заморозку
      if (newSkipped[date]) {
        delete newSkipped[date];
      }
      
      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        skipped: newSkipped,
      };
      
      // Пересчитываем силу привычки с передачей даты изменения
      const habitWithStrength = recalculateStrength(updatedHabit, date);
      updateHabit(habitId, habitWithStrength);
    }
  };

  // Обработчик пропуска (skip) для измеримой привычки
  const handleNumericInputSkip = (habitId: string, date: string) => {
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
      
      // Пересчитываем силу привычки с передачей даты изменения
      const habitWithStrength = recalculateStrength(updatedHabit, date);
      updateHabit(habitId, habitWithStrength);
    }
  };

  // Обработчик выбора месяца/года
  const handleMonthYearSelect = (month: number, year: number) => {
    setSelectedDate(month, year);
    closeMonthYearPicker();
  };

  // Обработчик сохранения из ManageHabitsModal
  const handleManageHabitsSave = (updatedHabits: Habit[], updatedTags: Tag[]) => {
    // Привычки уже сохранены через store (saveManageHabitsChanges)
    // Теги тоже уже управляются через store
    
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
    onToggleCompletion: toggleCompletion,
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
      <HabitsNotificationManager habits={habits} />
      
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
        <HabitTrackerModals
          numericInputModal={numericInputModal}
          habits={habits}
          onNumericInputClose={closeNumericInputModal}
          onNumericInputSave={handleNumericInputSave}
          onNumericInputSkip={handleNumericInputSkip}
          isMonthYearPickerOpen={isMonthYearPickerOpen}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthYearSelect={handleMonthYearSelect}
          onMonthYearClose={closeMonthYearPicker}
          isManageHabitsModalOpen={isManageHabitsModalOpen}
          tags={tags}
          onManageHabitsClose={closeManageHabitsModal}
          onManageHabitsSave={handleManageHabitsSave}
          isAddHabitModalOpen={isAddHabitModalOpen}
          onAddHabitClose={closeAddHabitModal}
          onAddHabit={addHabit}
          daysInMonth={monthDays.length}
        />
      </main>
      
      <NotificationPermissionBanner />
      <VersionIndicator />
    </div>
  );
}