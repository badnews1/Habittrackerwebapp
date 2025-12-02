/**
 * Централизованный менеджер модальных окон приложения
 * 
 * Управляет отображением всех модальных окон:
 * - MonthYearPicker - выбор месяца/года
 * - AddHabitModal - добавление новой привычки
 * - NumericInputModal - ввод числового значения для измеримой привычки
 * - HabitStatisticsModal - статистика привычки
 * 
 * @module app/providers/AppModals
 * @updated 1 декабря 2025 - удалена ManageHabitsModal (заменена на страницу /manage)
 * @updated 2 декабря 2025 - миграция из /core/modals/ в /app/providers/ (FSD архитектура)
 * @see /app/store/slices/modals.ts
 */

import { MonthYearPicker } from '@/features/date-navigation';
import { NumericInputModal } from '@/features/habit-checkbox';
import { AddHabitModal } from '@/features/habit-create';
import { HabitStatisticsModal } from '@/features/habit-stats';
import type { Habit } from '@/entities/habit';
import { declineUnit } from '@/shared/lib/text';

interface AppModalsProps {
  // Month/Year Picker
  isMonthYearPickerOpen: boolean;
  selectedMonth: number;
  selectedYear: number;
  onMonthYearSelect: (month: number, year: number) => void;
  onMonthYearClose: () => void;

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

  // Stats Modal
  statsModal: { habitId: string; monthYearKey: string } | null;
  onStatsClose: () => void;
}

export function AppModals({
  isMonthYearPickerOpen,
  selectedMonth,
  selectedYear,
  onMonthYearSelect,
  onMonthYearClose,
  isAddHabitModalOpen,
  onAddHabitClose,
  onAddHabit,
  daysInMonth,
  numericInputModal,
  habits,
  onNumericInputClose,
  onNumericInputSave,
  onNumericInputSkip,
  statsModal,
  onStatsClose,
}: AppModalsProps) {
  // Находим привычку для NumericInputModal
  const numericHabit = numericInputModal
    ? habits.find((h) => h.id === numericInputModal.habitId)
    : null;

  // Находим привычку для StatsModal
  const statsHabit = statsModal
    ? habits.find((h) => h.id === statsModal.habitId)
    : null;

  return (
    <>
      {/* Month/Year Picker Dialog */}
      <MonthYearPicker
        isOpen={isMonthYearPickerOpen}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSelect={onMonthYearSelect}
        onClose={onMonthYearClose}
      />

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isAddHabitModalOpen}
        onClose={onAddHabitClose}
        onAdd={onAddHabit}
        daysInMonth={daysInMonth}
      />

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

      {/* Stats Modal */}
      {statsModal && statsHabit && (
        <HabitStatisticsModal
          habit={statsHabit}
          onClose={onStatsClose}
          monthYearKey={statsModal.monthYearKey}
        />
      )}
    </>
  );
}
