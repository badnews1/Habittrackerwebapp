/**
 * Сервисы уведомлений модуля Habit Tracker
 * 
 * @module features/habit-notifications/lib
 * @created 22 ноября 2025
 * @updated 30 ноября 2025 - переименование из notifications в habit-notifications
 * @updated 30 ноября 2025 - переименование файла в scheduler.ts
 */

// Экспорт объекта планировщика (для компонентов)
export { habitNotificationScheduler } from './scheduler';

// Экспорт отдельных функций (для прямого использования)
export {
  scheduleHabitReminders,
  scheduleHabitReminder,
  unscheduleHabitReminders,
  unscheduleHabitReminder,
  rescheduleHabitReminder,
  hasScheduledReminders,
  getScheduledRemindersCount
} from './scheduler';
