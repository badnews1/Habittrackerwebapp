/**
 * Public API для shared/ui
 * 
 * Generic UI компоненты, используемые в разных слоях приложения.
 * Все компоненты presentational, не зависят от конкретных entity.
 */

// Filter components
export { FilterDropdown } from './filter-dropdown';

// Picker components
export { ColorPicker } from './color-picker';
export { IconPicker } from './icon-picker';
export { SectionPicker, type SectionItem } from './section-picker';
export { UnitPicker } from './unit-picker';

// Progress components
export { CircularProgress } from './circular-progress';
export { ProgressBar } from './progress-bar';

// Chart components
export { AreaChart, type AreaChartProps, type AreaChartDataPoint } from './area-chart';
export { LineChart, type LineChartProps, type LineChartDataPoint } from './line-chart';

// Button components
export { CompletionButton } from './completion-button';

// Toggle components
export { ToggleChip } from './toggle-chip';

// Modal components
export { Modal } from './modal';

// Reminders components
export { ReminderList, type ReminderItem } from './reminder-list';

// Calendar components
export { CalendarDayHeader } from './calendar-day-header';

// Utility components
export { OverflowTrigger } from './overflow-trigger';
