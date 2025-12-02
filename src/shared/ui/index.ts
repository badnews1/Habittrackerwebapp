/**
 * Public API для shared/ui
 * 
 * @description
 * Generic UI компоненты, используемые в разных слоях приложения.
 * Все компоненты "глупые" (presentational), не зависят от конкретных entity.
 * 
 * @module shared/ui
 */

// Filter components
export { FilterDropdown } from './filter-dropdown';

// Picker components
export { ColorPicker } from './color-picker';
export { IconPicker } from './icon-picker';
export { SectionPicker } from './section-picker';
export { UnitPicker } from './unit-picker';

// Progress components
export { CircularProgress } from './circular-progress';
export { ProgressBar } from './progress-bar';

// Button components
export { CompletionButton } from './completion-button';

// Toggle components
export { ToggleChip } from './toggle-chip';

// Modal components
export { Modal } from './modal';

// Reminders components
export { ReminderList, type ReminderItem } from './reminder-list';

// Utility components
export { OverflowTrigger } from './overflow-trigger';

// Debug components
export { DebugPanel } from './debug-panel';
