/**
 * Типы пропсов для компонентов привычек
 * 
 * @module modules/habit-tracker/features/habits/types/props
 * @created 22 ноября 2025
 * @migrated из /types/habitsTableProps.ts
 */

import { Habit } from '@/modules/habit-tracker/types';

/**
 * Date-related configuration for calendar rendering
 * Used across CalendarGrid, MonthlyStats, StrengthChart, ProgressSection, HabitsListPanel
 */
export interface DateConfig {
  selectedMonth: number;
  selectedYear: number;
  monthDays: { date: Date; day: number }[];
  formatDate: (date: Date) => string;
  getDayName: (date: Date) => string;
}

/**
 * Actions for habit manipulation
 * Used in CalendarGrid, HabitsListPanel
 */
export interface HabitActions {
  onToggleCompletion: (habitId: string, date: string, value?: number) => void;
  onToggleAllForDay: (date: string) => void;
  onMoveHabit: (dragIndex: number, hoverIndex: number) => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
}

/**
 * Actions for opening modals
 * Used in CalendarGrid, HabitsListPanel
 */
export interface ModalActions {
  onAddHabit: () => void;
  onManageHabits: () => void;
  onOpenNumericInput: (habitId: string, date: string) => void;
}

/**
 * Configuration for daily/monthly goals
 * Used in MonthlyStats, StrengthChart
 */
export interface GoalConfig {
  dailyGoals: { [date: string]: number };
  editingGoal: string | null;
  defaultDailyGoal: string;
  onSetDailyGoals: (goals: { [date: string]: number }) => void;
  onSetEditingGoal: (dateStr: string | null) => void;
  onSetDefaultDailyGoal: (value: string) => void;
}

/**
 * Configuration for undo/clear functionality
 * Used in MonthlyStats
 */
export interface UndoConfig {
  canUndo: boolean;
  onClearAllCompletions: () => void;
  onUndoClearAllCompletions: () => void;
}