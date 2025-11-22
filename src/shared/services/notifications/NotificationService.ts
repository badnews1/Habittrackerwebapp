/**
 * Низкоуровневый сервис работы с Web Notifications API
 * 
 * Чистая обёртка над браузерным API без бизнес-логики.
 * Используется NotificationScheduler для показа уведомлений.
 * 
 * @module shared/services/notifications
 * @created 22 ноября 2025
 */

/**
 * Конфигурация для показа уведомления
 */
export interface NotificationConfig {
  /** Заголовок уведомления */
  title: string;
  
  /** Текст уведомления */
  body?: string;
  
  /** Иконка (URL или emoji) */
  icon?: string;
  
  /** Тег для группировки/замены уведомлений */
  tag?: string;
  
  /** Произвольные данные */
  data?: any;
  
  /** Требует ли уведомление взаимодействия пользователя */
  requireInteraction?: boolean;
  
  /** Беззвучное уведомление */
  silent?: boolean;
}

/**
 * Статический сервис для работы с Web Notifications API
 * 
 * Предоставляет методы для:
 * - Проверки поддержки API
 * - Запроса разрешений
 * - Показа уведомлений
 */
export class NotificationService {
  /**
   * Проверка поддержки Web Notifications API
   */
  static isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Получение текущего статуса разрешения
   */
  static getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Запрос разрешения на отправку уведомлений
   * 
   * @returns Promise с результатом (granted | denied | default)
   */
  static async requestPermission(): Promise<NotificationPermission> {
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
      console.log(`[NotificationService] Разрешение: ${permission}`);
      return permission;
    } catch (error) {
      console.error('[NotificationService] Ошибка запроса разрешения:', error);
      return 'denied';
    }
  }

  /**
   * Показ уведомления
   * 
   * @param config - Конфигурация уведомления
   * @returns Promise<void>
   * 
   * @example
   * ```typescript
   * await NotificationService.show({
   *   title: 'Напоминание',
   *   body: 'Время выполнить привычку: Зарядка',
   *   icon: '💪'
   * });
   * ```
   */
  static async show(config: NotificationConfig): Promise<void> {
    if (!this.isSupported()) {
      // API не поддерживается - тихо выходим
      return;
    }

    if (Notification.permission !== 'granted') {
      // Разрешение не предоставлено - тихо выходим (это нормальная ситуация)
      return;
    }

    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/favicon.ico',
        tag: config.tag,
        data: config.data,
        requireInteraction: config.requireInteraction ?? false,
        silent: config.silent ?? false,
      });

      // Фокус на окне при клике
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Автоматическое закрытие через 10 секунд
      setTimeout(() => notification.close(), 10000);

      console.log(`[NotificationService] Показано уведомление: ${config.title}`);
    } catch (error) {
      console.error('[NotificationService] Ошибка показа уведомления:', error);
      throw error;
    }
  }
}