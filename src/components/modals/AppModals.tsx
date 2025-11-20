import React from 'react';
import { DeleteDialog } from './DeleteDialog';
import { NumericInputModal } from './NumericInputModal';
import { MonthYearPicker } from '../calendar/MonthYearPicker';
import { ManageHabitsModal } from '../habits/ManageHabitsModal';
import { AddHabitModal } from '../habits/AddHabitModal';
import { Habit } from '../../types/habit';
import { Category } from '../../types/category';
import { declineUnit } from '../../utils/unitUtils';
import { formatDateReadable } from '../../utils/dateUtils';

interface AppModalsProps {
  // Delete Dialog
  showDeleteDialog: string | null;
  habits: Habit[];
  onDeleteConfirm: (id: string) => void;
  onDeleteCancel: () => void;

  // Numeric Input Modal
  numericInputModal: { habitId: string; date: string } | null;
  onNumericInputClose: () => void;
  onNumericInputSave: (habitId: string, date: string, value: number) => void;
  onNumericInputSkip: (habitId: string, date: string) => void;

  // Month/Year Picker
  isMonthYearPickerOpen: boolean;
  selectedMonth: number;
  selectedYear: number;
  onMonthYearSelect: (month: number, year: number) => void;
  onMonthYearClose: () => void;

  // Manage Habits Modal
  isManageHabitsModalOpen: boolean;
  categories: Category[];
  onManageHabitsClose: () => void;
  onManageHabitsSave: (habits: Habit[], categories: Category[]) => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onUpdateCategoryColor: (category: string, color: string) => void;

  // Add Habit Modal
  isAddHabitModalOpen: boolean;
  onAddHabitClose: () => void;
  onAddHabit: (habitData: any) => void;
  daysInMonth: number;
}

export function AppModals({
  showDeleteDialog,
  habits,
  onDeleteConfirm,
  onDeleteCancel,
  numericInputModal,
  onNumericInputClose,
  onNumericInputSave,
  onNumericInputSkip,
  isMonthYearPickerOpen,
  selectedMonth,
  selectedYear,
  onMonthYearSelect,
  onMonthYearClose,
  isManageHabitsModalOpen,
  categories,
  onManageHabitsClose,
  onManageHabitsSave,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategoryColor,
  isAddHabitModalOpen,
  onAddHabitClose,
  onAddHabit,
  daysInMonth,
}: AppModalsProps) {
  return (
    <>
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <DeleteDialog
          habitName={habits.find((h) => h.id === showDeleteDialog)?.name || ''}
          onConfirm={() => onDeleteConfirm(showDeleteDialog)}
          onCancel={onDeleteCancel}
        />
      )}

      {/* Numeric Input Modal */}
      {numericInputModal && (() => {
        const habit = habits.find(h => h.id === numericInputModal.habitId);
        if (!habit) return null;
        
        const currentValue = habit.completions[numericInputModal.date];
        const numValue = typeof currentValue === 'number' ? currentValue : '';
        const formattedDate = formatDateReadable(numericInputModal.date);
        
        return (
          <NumericInputModal
            isOpen={true}
            onClose={onNumericInputClose}
            habitName={habit.name}
            date={formattedDate}
            currentValue={numValue}
            unit={habit.unit}
            targetValue={habit.targetValue}
            targetType={habit.targetType}
            onSave={(value) => onNumericInputSave(numericInputModal.habitId, numericInputModal.date, value)}
            onSkip={() => onNumericInputSkip(numericInputModal.habitId, numericInputModal.date)}
            declineUnit={declineUnit}
          />
        );
      })()}

      {/* Month/Year Picker Dialog */}
      {isMonthYearPickerOpen && (
        <MonthYearPicker
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onSelect={onMonthYearSelect}
          onClose={onMonthYearClose}
        />
      )}

      {/* Manage Habits Modal */}
      {isManageHabitsModalOpen && (
        <ManageHabitsModal
          habits={habits}
          onClose={onManageHabitsClose}
          onSave={onManageHabitsSave}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          categories={categories}
          onAddCategory={onAddCategory}
          onDeleteCategory={onDeleteCategory}
          onUpdateCategoryColor={onUpdateCategoryColor}
        />
      )}

      {/* Add Habit Modal */}
      {isAddHabitModalOpen && (
        <AddHabitModal
          onClose={onAddHabitClose}
          onAdd={onAddHabit}
          categories={categories}
          onAddCategory={onAddCategory}
          onDeleteCategory={onDeleteCategory}
          onUpdateCategoryColor={onUpdateCategoryColor}
          daysInMonth={daysInMonth}
          allHabits={habits}
        />
      )}
    </>
  );
}
