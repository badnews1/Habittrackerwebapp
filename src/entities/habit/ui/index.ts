/**
 * UI компоненты для entities/habit
 * 
 * @module entities/habit/ui
 * @updated 30 ноября 2025 - миграция FrequencyTwoColumn из features/frequency
 * @updated 30 ноября 2025 - миграция stats компонентов из features/statistics
 * @updated 2 декабря 2025 - добавлены HabitNameCell и HabitProgressCell для calendar widget
 */

export { HabitSectionSelect } from './HabitSectionSelect';
export { TargetTypePicker } from './TargetTypePicker';
export { HabitNotes } from './HabitNotes';
export { HabitReminders } from './reminders';
export { FrequencyTwoColumn } from './frequency';
export { StrengthProgressBar, DailyProgressBars, MonthlyCircle, ProgressSection, MonthlyStats, TopHabitsRanking, DailyStatsRows, DailyCompletionAreaChart } from './stats';

// Ячейки для calendar widget
export { HabitNameCell } from './HabitNameCell';
export { HabitProgressCell } from './HabitProgressCell';