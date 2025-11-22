/**
 * Barrel export для shared сервисов
 * 
 * @module shared/services
 * @created 22 ноября 2025
 */

// Notification scheduler
export { NotificationScheduler } from './notification-scheduler';
export type {
  ScheduledReminder,
  ReminderType,
  NotificationGroupingConfig,
  SchedulerStats
} from './notification-scheduler';

// Notification service
export { NotificationService } from './notifications';
export type { NotificationConfig } from './notifications';
