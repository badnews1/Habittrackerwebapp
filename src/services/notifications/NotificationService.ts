/**
 * Сервис для работы с Web Notifications API
 * 
 * Инкапсулирует всю бизнес-логику работы с уведомлениями:
 * - Запрос разрешений
 * - Планирование уведомлений
 * - Отправка уведомлений
 * - Управление таймерами
 * 
 * @module services/notifications/NotificationService
 * Дата создания: 20 ноября 2025
 */

import { Habit, Reminder } from '../../types/habit';
import type {
  NotificationConfig,
  ScheduledNotification,
  ScheduleResult,
  HabitNotificationData,
} from './types';

/**
 * Сервис для управления уведомлениями
 */
export class NotificationService {
  /** Карта запланированных уведомлений */
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();
  
  /** Множество уже отправленных сегодня уведомлений */
  private sentToday: Set<string> = new Set();
  
  /** Таймер сброса в полночь */
  private midnightResetTimer: NodeJS.Timeout | null = null;

  /**
   * Проверяет поддержку Web Notifications API
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Получает текущий статус разрешения
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Запрашивает разрешение на отправку уведомлений
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('[NotificationService] Web Notifications API не поддерживается');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('[NotificationService] Ошибка запроса разрешения:', error);
      return 'denied';
    }
  }

  /**
   * Отправляет уведомление
   */
  sendNotification(config: NotificationConfig): Notification | null {
    if (!this.isSupported()) {
      console.warn('[NotificationService] Web Notifications API не поддерживается');
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.warn('[NotificationService] Разрешение на уведомления не предоставлено');
      return null;
    }

    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/favicon.ico',
        tag: config.tag,
        requireInteraction: config.requireInteraction ?? false,
        silent: config.silent ?? false,
      });

      // Клик по уведомлению фокусирует окно
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Автоматически закрыть через 10 секунд
      setTimeout(() => notification.close(), 10000);

      return notification;
    } catch (error) {
      console.error('[NotificationService] Ошибка отправки уведомления:', error);
      return null;
    }
  }

  /**
   * Отправляет уведомление о привычке
   */
  sendHabitNotification(habit: Habit, time: string): Notification | null {
    return this.sendNotification({
      title: '⏰ Напоминание о привычке',
      body: `${time} - Время для: ${habit.name}`,
      tag: `${habit.id}-${time}`,
    });
  }

  /**
   * Планирует уведомление на определённое время
   */
  scheduleNotification(data: HabitNotificationData): ScheduleResult {
    const { habit, reminder } = data;

    if (!reminder.time) {
      return { success: false, reason: 'invalid_time' };
    }

    if (Notification.permission !== 'granted') {
      return { success: false, reason: 'permission_denied' };
    }

    // Парсим время
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Если время уже прошло сегодня, не планируем
    if (scheduledTime.getTime() <= now.getTime()) {
      return { success: false, reason: 'time_passed' };
    }

    const notificationKey = this.getNotificationKey(habit.id, reminder.id, scheduledTime);

    // Если уже отправлено сегодня, не планируем
    if (this.sentToday.has(notificationKey)) {
      return { success: false, reason: 'already_scheduled' };
    }

    // Если уже запланировано, не планируем повторно
    const timerKey = this.getTimerKey(habit.id, reminder.id);
    if (this.scheduledNotifications.has(timerKey)) {
      return { success: false, reason: 'already_scheduled' };
    }

    // Планируем уведомление
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    const timerId = setTimeout(() => {
      this.sendHabitNotification(habit, reminder.time);
      this.sentToday.add(notificationKey);
      this.scheduledNotifications.delete(timerKey);
    }, timeUntilNotification);

    // Сохраняем информацию о запланированном уведомлении
    this.scheduledNotifications.set(timerKey, {
      habitId: habit.id,
      reminderId: reminder.id,
      scheduledTime,
      timerId,
      key: notificationKey,
    });

    return { success: true, key: notificationKey };
  }

  /**
   * Планирует уведомления для всех привычек
   */
  scheduleHabitsNotifications(habits: Habit[]): void {
    habits.forEach(habit => {
      // Новый формат: массив напоминаний
      if (habit.reminders && habit.reminders.length > 0) {
        habit.reminders.forEach(reminder => {
          if (reminder.enabled) {
            this.scheduleNotification({ habit, reminder });
          }
        });
      }
      // Legacy формат: одно напоминание
      else if (habit.reminderEnabled && habit.reminderTime) {
        this.scheduleNotification({
          habit,
          reminder: {
            id: 'legacy',
            time: habit.reminderTime,
            enabled: true,
          },
        });
      }
    });
  }

  /**
   * Отменяет запланированное уведомление
   */
  cancelNotification(habitId: string, reminderId: string): boolean {
    const timerKey = this.getTimerKey(habitId, reminderId);
    const scheduled = this.scheduledNotifications.get(timerKey);

    if (!scheduled) {
      return false;
    }

    clearTimeout(scheduled.timerId);
    this.scheduledNotifications.delete(timerKey);
    return true;
  }

  /**
   * Отменяет все запланированные уведомления
   */
  cancelAllNotifications(): void {
    this.scheduledNotifications.forEach(scheduled => {
      clearTimeout(scheduled.timerId);
    });
    this.scheduledNotifications.clear();
  }

  /**
   * Инициализирует автоматический сброс в полночь
   */
  initializeMidnightReset(): void {
    // Очищаем предыдущий таймер, если есть
    if (this.midnightResetTimer) {
      clearTimeout(this.midnightResetTimer);
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    this.midnightResetTimer = setTimeout(() => {
      this.sentToday.clear();
      // Рекурсивно планируем следующий сброс
      this.initializeMidnightReset();
    }, timeUntilMidnight);
  }

  /**
   * Очищает все таймеры и состояние
   */
  cleanup(): void {
    this.cancelAllNotifications();
    
    if (this.midnightResetTimer) {
      clearTimeout(this.midnightResetTimer);
      this.midnightResetTimer = null;
    }

    this.sentToday.clear();
  }

  /**
   * Получает количество запланированных уведомлений
   */
  getScheduledCount(): number {
    return this.scheduledNotifications.size;
  }

  /**
   * Получает количество отправленных сегодня уведомлений
   */
  getSentTodayCount(): number {
    return this.sentToday.size;
  }

  /**
   * Генерирует ключ таймера
   */
  private getTimerKey(habitId: string, reminderId: string): string {
    return `${habitId}-${reminderId}`;
  }

  /**
   * Генерирует уникальный ключ уведомления
   */
  private getNotificationKey(habitId: string, reminderId: string, date: Date): string {
    return `${habitId}-${reminderId}-${date.toDateString()}`;
  }
}

// Экспортируем singleton instance
export const notificationService = new NotificationService();
