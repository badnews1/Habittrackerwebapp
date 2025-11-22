/**
 * Barrel export для компонентов ManageHabitsModal
 * 
 * Содержит все подкомпоненты для модального окна управления привычками.
 * 
 * @module modules/habit-tracker/features/habits/components/manage
 * @migrated 22 ноября 2025
 */

// Main components (для декомпозиции ManageHabitsModal)
export { ManageHabitsHeader } from './ManageHabitsHeader';
export { HabitsList } from './HabitsList';
export { ManageHabitsFooter } from './ManageHabitsFooter';

// Habit Item
export { HabitItem } from './HabitItem';

// Sub-components (используются в HabitItem и AddHabitModal)
export { IconPicker } from './IconPicker';
export { HabitNameEditor } from './HabitNameEditor';
export { HabitMeasurableSettingsSection } from './HabitMeasurableSettingsSection';
export { HabitFrequencySection } from './HabitFrequencySection';
export { HabitRemindersSection } from './HabitRemindersSection';
export { UnitPicker } from './UnitPicker';
export { TargetTypePicker } from './TargetTypePicker';
