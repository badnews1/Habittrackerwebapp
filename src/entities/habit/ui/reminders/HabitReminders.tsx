/**
 * Секция управления напоминаниями для привычек
 * 
 * Обёртка над ReminderList для использования с сущностью Habit.
 * Используется при создании и редактировании привычки.
 * 
 * @module entities/habit/ui/reminders/HabitReminders
 * @created 30 ноября 2025 - миграция на FSD
 * @migrated 30 ноября 2025 - перенос из features/habits (FSD fix)
 */

import React from 'react';
import { ReminderList, type ReminderItem } from '@/shared/ui/reminder-list';
import type { Reminder } from '@/entities/habit';

interface HabitRemindersProps {
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

export const HabitReminders: React.FC<HabitRemindersProps> = (props) => {
  return <ReminderList {...props} />;
};
