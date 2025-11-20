/**
 * Модульные компоненты для AddHabitModal
 * 
 * Barrel export для всех подкомпонентов модального окна создания/редактирования привычки.
 * 
 * Структура:
 * - FrequencyModal - модальное окно редактирования частоты
 * - FrequencyModalTrigger - кнопка для открытия модального окна частоты (бывшая FrequencyButton)
 * - HabitBasicInfoStep - шаг 1 (основная информация)
 * - HabitMeasurableStep - шаг 2 (настройки измеримой привычки)
 * - HabitDetailsStep - шаг 3 (частота, напоминания, заметки)
 * - HabitTypePicker - выбор типа привычки (бинарная/измеримая)
 * - RemindersSection - секция напоминаний
 * - NotesSection - секция заметок
 * 
 * Дата создания: 19 ноября 2024
 * Дата обновления: 20 ноября 2025 (добавлен HabitTypePicker)
 */

export { FrequencyModal } from './FrequencyModal';
export { FrequencyModalTrigger } from './FrequencyModalTrigger';
export { HabitBasicInfoStep } from './HabitBasicInfoStep';
export { HabitMeasurableStep } from './HabitMeasurableStep';
export { HabitDetailsStep } from './HabitDetailsStep';
export { HabitTypePicker } from './HabitTypePicker';
export { RemindersSection } from './RemindersSection';
export type { Reminder } from './RemindersSection';
export { NotesSection } from './NotesSection';