/**
 * Типы для сервиса уведомлений
 * 
 * @module services/notifications/types
 * Дата создания: 20 ноября 2025
 */

import { Habit, Reminder } from '../../types/habit';

/**
 * Конфигурация уведомления
 */
export interface NotificationConfig {
  /** Заголовок уведомления */
  title: string;
  /** Текст уведомления */
  body: string;
  /** Путь к иконке */
  icon?: string;
  /** Тег для группировки уведомлений */
  tag?: string;
  /** Требовать взаимодействие от пользователя */
  requireInteraction?: boolean;
  /** Тихое уведомление (без звука) */
  silent?: boolean;
}

/**
 * Данные запланированного уведомления
 */
export interface ScheduledNotification {
  /** ID привычки */
  habitId: string;
  /** ID напоминания */
  reminderId: string;
  /** Время отправки */
  scheduledTime: Date;
  /** ID таймера */
  timerId: NodeJS.Timeout;
  /** Уникальный ключ уведомления */
  key: string;
}

/**
 * Результат планирования уведомления
 */
export interface ScheduleResult {
  /** Успешно ли запланировано */
  success: boolean;
  /** Уникальный ключ уведомления */
  key?: string;
  /** Причина неудачи */
  reason?: 'permission_denied' | 'time_passed' | 'already_scheduled' | 'invalid_time';
}

/**
 * Данные для планирования уведомления о привычке
 */
export interface HabitNotificationData {
  /** Привычка */
  habit: Habit;
  /** Напоминание */
  reminder: Reminder;
}
