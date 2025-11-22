/**
 * Менеджер уведомлений для модуля привычек
 * 
 * Специфичный для habits адаптер над централизованным NotificationScheduler.
 * Отвечает за инициализацию и планирование уведомлений на основе привычек.
 * 
 * @module modules/habit-tracker/features/notifications/components
 * @created 22 ноября 2025 (мигрировано из /components/notifications/)
 */

import React, { useEffect } from 'react';
import { Habit } from '@/modules/habit-tracker/types';
import { NotificationService } from '@/shared/services/notifications';
import { habitNotificationScheduler } from '../services';

interface HabitsNotificationManagerProps {
  /** Список привычек для планирования уведомлений */
  habits: Habit[];
}

/**
 * Менеджер уведомлений для привычек
 * 
 * Использует NotificationScheduler через habitNotificationScheduler для:
 * - Запроса разрешений при монтировании
 * - Планирования уведомлений для всех привычек
 * - Автоматической очистки при изменении списка привычек
 * 
 * @example
 * ```tsx
 * <HabitsNotificationManager habits={habits} />
 * ```
 */
export const HabitsNotificationManager: React.FC<HabitsNotificationManagerProps> = ({
  habits,
}) => {
  // Запрос разрешения при монтировании компонента
  useEffect(() => {
    if (NotificationService.isSupported() && NotificationService.getPermissionStatus() === 'default') {
      NotificationService.requestPermission();
    }
  }, []);

  // Планирование уведомлений при изменении списка привычек
  useEffect(() => {
    // Отменяем все существующие уведомления для привычек
    habits.forEach(habit => {
      habitNotificationScheduler.unschedule(habit.id);
    });

    // Планируем уведомления для всех привычек
    habits.forEach(habit => {
      habitNotificationScheduler.schedule(habit);
    });

    // Cleanup при размонтировании
    return () => {
      habits.forEach(habit => {
        habitNotificationScheduler.unschedule(habit.id);
      });
    };
  }, [habits]);

  // Компонент не рендерит UI
  return null;
};