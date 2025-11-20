/**
 * Компонент-менеджер уведомлений
 * 
 * Отвечает за инициализацию и планирование уведомлений на основе привычек.
 * Вся бизнес-логика вынесена в NotificationService.
 * 
 * @module components/notifications/NotificationManager
 * Дата создания: начало проекта
 * Последнее обновление: 20 ноября 2025 - рефакторинг с выделением сервиса
 */

import React, { useEffect } from 'react';
import { Habit } from '../../types/habit';
import { notificationService } from '../../services/notifications';

interface NotificationManagerProps {
  habits: Habit[];
}

/**
 * Менеджер уведомлений
 * 
 * Использует NotificationService для:
 * - Запроса разрешений при монтировании
 * - Планирования уведомлений для всех привычек
 * - Очистки таймеров при размонтировании
 */
export const NotificationManager: React.FC<NotificationManagerProps> = ({
  habits,
}) => {
  // Запрос разрешения при монтировании компонента
  useEffect(() => {
    if (notificationService.isSupported() && notificationService.getPermissionStatus() === 'default') {
      notificationService.requestPermission();
    }
  }, []);

  // Планирование уведомлений при изменении списка привычек
  useEffect(() => {
    // Отменяем все существующие уведомления
    notificationService.cancelAllNotifications();

    // Инициализируем автоматический сброс в полночь
    notificationService.initializeMidnightReset();

    // Планируем уведомления для всех привычек
    notificationService.scheduleHabitsNotifications(habits);

    // Cleanup при размонтировании или изменении зависимостей
    return () => {
      notificationService.cleanup();
    };
  }, [habits]);

  // Компонент не рендерит UI
  return null;
};
