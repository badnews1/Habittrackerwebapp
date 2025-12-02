/**
 * Public API для модуля уведомлений
 * 
 * @description
 * Инфраструктура уведомлений для всего приложения:
 * - Низкоуровневая обёртка над Web Notifications API
 * - Централизованный планировщик с группировкой и анти-спамом
 * 
 * @module shared/lib/notifications
 * @created 22 ноября 2025
 * @updated 30 ноября 2025 - миграция из shared/services в shared/lib согласно FSD
 */

// Notification API (низкоуровневая обёртка)
export { NotificationService } from './notification-api';
export type { NotificationConfig } from './notification-api';

// Notification Scheduler (централизованный планировщик)
export { NotificationScheduler } from './scheduler';

// Типы
export type {
  ScheduledReminder,
  ReminderType,
  NotificationGroupingConfig,
  SchedulerStats
} from './types';
