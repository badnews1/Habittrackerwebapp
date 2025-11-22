/**
 * Модульные компоненты для AddHabitModal
 * 
 * Barrel export для всех подкомпонентов модального окна создания/редактирования привычки.
 * 
 * Структура:
 * - FrequencyModal - модальное окно редактирования частоты
 * - FrequencyModalTrigger - кнопка для открытия модального окна частоты
 * - HabitBasicInfoStep - шаг 1 (основная информация)
 * - HabitMeasurableStep - шаг 2 (настройки измеримой привычки)
 * - HabitDetailsStep - шаг 3 (частота, напоминания, заметки)
 * - HabitTypePicker - выбор типа привычки (бинарная/измеримая)
 * - RemindersSection - секция напоминаний
 * - NotesSection - секция заметок
 * - ModalFooter - футер модального окна с навигацией по шагам
 * 
 * @module modules/habit-tracker/features/habits/components/add
 * @migrated 22 ноября 2025
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
export { ModalFooter } from './ModalFooter';