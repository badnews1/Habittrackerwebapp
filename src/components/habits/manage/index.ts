/**
 * Manage Habits module exports
 * Contains all components used in the ManageHabitsModal and AddHabitModal
 * 
 * Последнее обновление: 20 ноября 2025 - очистка неиспользуемых компонентов
 */

// Main components (новые, для декомпозиции ManageHabitsModal)
export { ManageHabitsHeader } from './ManageHabitsHeader';
export { HabitsList } from './HabitsList';
export { ManageHabitsFooter } from './ManageHabitsFooter';

// Habit Item
export { HabitItem } from './HabitItem';

// Sub-components (используются в HabitItem и AddHabitModal)
export { IconPicker } from './IconPicker';
export { CategoryPicker } from './CategoryPicker';
export { HabitNameEditor } from './HabitNameEditor';
export { HabitMeasurableSettingsSection } from './HabitMeasurableSettingsSection';
export { HabitFrequencySection } from './HabitFrequencySection';
export { HabitRemindersSection } from './HabitRemindersSection';
export { UnitPicker } from './UnitPicker';
export { TargetTypePicker } from './TargetTypePicker';