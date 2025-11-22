/**
 * Секция управления напоминаниями для AddHabitModal
 * 
 * Обёртка над RemindersManager для использования в шаге создания привычки.
 * 
 * @module modules/habit-tracker/features/habits/components/add/RemindersSection
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { RemindersManager, Reminder } from '@/shared/components/reminders';

// Реэкспортируем тип для обратной совместимости
export type { Reminder };

interface RemindersSectionProps {
  /** Список напоминаний */
  reminders: Reminder[];
  
  /** Колбэк переключения включения напоминания */
  onToggleReminder: (id: string) => void;
  
  /** Колбэк изменения времени напоминания */
  onUpdateReminderTime: (id: string, time: string) => void;
  
  /** Колбэк удаления напоминания */
  onDeleteReminder: (id: string) => void;
  
  /** Колбэк добавления нового напоминания */
  onAddReminder: () => void;
}

export const RemindersSection: React.FC<RemindersSectionProps> = (props) => {
  return <RemindersManager {...props} />;
};
