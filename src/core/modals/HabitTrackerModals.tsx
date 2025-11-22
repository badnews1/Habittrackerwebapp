/**
 * Централизованный менеджер модальных окон для модуля Habit Tracker
 * 
 * Управляет отображением всех модальных окон модуля:
 * - MonthYearPicker - выбор месяца/года
 * - ManageHabitsModal - управление привычками
 * - AddHabitModal - добавление новой привычки
 * 
 * @module core/modals/HabitTrackerModals
 * @see /core/store/slices/modals.ts
 */

import { MonthYearPicker } from '@/modules/habit-tracker/features/calendar';
import { ManageHabitsModal, AddHabitModal } from '@/modules/habit-tracker/features/habits';
import { Habit } from '@/modules/habit-tracker/types';
import { Category } from '@/modules/habit-tracker/features/categories';

interface HabitTrackerModalsProps {
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

  // Add Habit Modal
  isAddHabitModalOpen: boolean;
  onAddHabitClose: () => void;
  onAddHabit: (habitData: any) => void;
  daysInMonth: number;
}

export function HabitTrackerModals({
  isMonthYearPickerOpen,
  selectedMonth,
  selectedYear,
  onMonthYearSelect,
  onMonthYearClose,
  isManageHabitsModalOpen,
  categories,
  onManageHabitsClose,
  onManageHabitsSave,
  isAddHabitModalOpen,
  onAddHabitClose,
  onAddHabit,
  daysInMonth,
}: HabitTrackerModalsProps) {
  return (
    <>
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
          onClose={onManageHabitsClose}
          onSave={onManageHabitsSave}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}

      {/* Add Habit Modal */}
      {isAddHabitModalOpen && (
        <AddHabitModal
          onClose={onAddHabitClose}
          onAdd={onAddHabit}
          daysInMonth={daysInMonth}
        />
      )}
    </>
  );
}
