/**
 * Фича Notifications - уведомления для привычек
 * 
 * @module modules/habit-tracker/features/notifications
 * @created 22 ноября 2025
 */

// Сервисы планирования напоминаний
export {
  scheduleHabitReminders,
  scheduleHabitReminder,
  unscheduleHabitReminders,
  unscheduleHabitReminder,
  rescheduleHabitReminder,
  hasScheduledReminders,
  getScheduledRemindersCount
} from './services';

// Компоненты
export { HabitsNotificationManager } from './components';