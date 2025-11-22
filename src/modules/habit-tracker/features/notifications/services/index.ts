/**
 * Сервисы уведомлений модуля Habit Tracker
 * 
 * @module modules/habit-tracker/features/notifications/services
 * @created 22 ноября 2025
 */

// Экспорт объекта планировщика (для компонентов)
export { habitNotificationScheduler } from './habitNotificationScheduler';

// Экспорт отдельных функций (для прямого использования)
export {
  scheduleHabitReminders,
  scheduleHabitReminder,
  unscheduleHabitReminders,
  unscheduleHabitReminder,
  rescheduleHabitReminder,
  hasScheduledReminders,
  getScheduledRemindersCount
} from './habitNotificationScheduler';