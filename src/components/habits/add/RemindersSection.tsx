import React from 'react';
import { RemindersManager, Reminder } from '../../shared/RemindersManager';

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

/**
 * Секция управления напоминаниями для AddHabitModal
 * 
 * Обёртка над RemindersManager для использования в шаге создания привычки.
 * 
 * Дата создания: 19 ноября 2024
 * Дата рефакторинга: 19 ноября 2024 (использует RemindersManager)
 */
export const RemindersSection: React.FC<RemindersSectionProps> = (props) => {
  return <RemindersManager {...props} />;
};
