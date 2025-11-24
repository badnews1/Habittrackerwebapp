/**
 * Централизованный менеджер модальных окон для модуля Habit Tracker
 * 
 * Управляет отображением всех модальных окон модуля:
 * - MonthYearPicker - выбор месяца/года
 * - ManageHabitsModal - управление привычками
 * - AddHabitModal - добавление новой привычки
 * - NumericInputModal - ввод числового значения для измеримой привычки
 * 
 * @module core/modals/HabitTrackerModals
 * @updated 23 ноября 2025 - миграция Category → Tag
 * @see /core/store/slices/modals.ts
 */

import { MonthYearPicker } from '@/modules/habit-tracker/features/calendar';
import { ManageHabitsModal, AddHabitModal, NumericInputModal } from '@/modules/habit-tracker/features/habits';
import { Habit } from '@/modules/habit-tracker/types';
import { Tag } from '@/modules/habit-tracker/features/tags';
import { declineUnit } from '@/shared/utils/text';

interface HabitTrackerModalsProps {
  // Month/Year Picker
  isMonthYearPickerOpen: boolean;
  selectedMonth: number;
  selectedYear: number;
  onMonthYearSelect: (month: number, year: number) => void;
  onMonthYearClose: () => void;

  // Manage Habits Modal
  isManageHabitsModalOpen: boolean;
  tags: Tag[];
  onManageHabitsClose: () => void;
  onManageHabitsSave: (habits: Habit[], tags: Tag[]) => void;

  // Add Habit Modal
  isAddHabitModalOpen: boolean;
  onAddHabitClose: () => void;
  onAddHabit: (habitData: any) => void;
  daysInMonth: number;

  // Numeric Input Modal
  numericInputModal: { habitId: string; date: string } | null;
  habits: Habit[];
  onNumericInputClose: () => void;
  onNumericInputSave: (habitId: string, date: string, value: number) => void;
  onNumericInputSkip: (habitId: string, date: string) => void;
}

export function HabitTrackerModals({
  isMonthYearPickerOpen,
  selectedMonth,
  selectedYear,
  onMonthYearSelect,
  onMonthYearClose,
  isManageHabitsModalOpen,
  tags,
  onManageHabitsClose,
  onManageHabitsSave,
  isAddHabitModalOpen,
  onAddHabitClose,
  onAddHabit,
  daysInMonth,
  numericInputModal,
  habits,
  onNumericInputClose,
  onNumericInputSave,
  onNumericInputSkip,
}: HabitTrackerModalsProps) {
  // Находим привычку для NumericInputModal
  const numericHabit = numericInputModal
    ? habits.find((h) => h.id === numericInputModal.habitId)
    : null;

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

      {/* Numeric Input Modal */}
      {numericInputModal && numericHabit && (
        <NumericInputModal
          isOpen={true}
          onClose={onNumericInputClose}
          habitName={numericHabit.name}
          date={numericInputModal.date}
          currentValue={
            typeof numericHabit.completions[numericInputModal.date] === 'number'
              ? (numericHabit.completions[numericInputModal.date] as number)
              : ''
          }
          unit={numericHabit.unit}
          targetValue={numericHabit.targetValue}
          targetType={numericHabit.targetType}
          onSave={(value) => onNumericInputSave(numericInputModal.habitId, numericInputModal.date, value)}
          onSkip={() => onNumericInputSkip(numericInputModal.habitId, numericInputModal.date)}
          declineUnit={declineUnit}
        />
      )}
    </>
  );
}