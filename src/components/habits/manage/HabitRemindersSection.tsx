import React from 'react';
import { RemindersManager, Reminder } from '../../shared/RemindersManager';

interface HabitRemindersSectionProps {
  habitId: string;
  reminders: Reminder[] | undefined;
  onUpdateReminders: (id: string, reminders: Reminder[]) => void;
}

/**
 * Секция управления напоминаниями для ManageHabitsModal
 * 
 * Обёртка над RemindersManager с адаптацией интерфейса для редактирования привычки.
 * Преобразует API "habitId + onUpdateReminders" в колбэки для отдельных действий.
 * 
 * Дата создания: 19 ноября 2024
 * Дата рефакторинга: 19 ноября 2024 (использует RemindersManager)
 */
export const HabitRemindersSection: React.FC<HabitRemindersSectionProps> = ({
  habitId,
  reminders,
  onUpdateReminders,
}) => {
  // Адаптируем интерфейс для RemindersManager
  const handleToggleReminder = (reminderId: string) => {
    const newReminders = (reminders || []).map(r =>
      r.id === reminderId ? { ...r, enabled: !r.enabled } : r
    );
    onUpdateReminders(habitId, newReminders);
  };

  const handleUpdateReminderTime = (reminderId: string, newTime: string) => {
    const newReminders = (reminders || []).map(r =>
      r.id === reminderId ? { ...r, time: newTime } : r
    );
    onUpdateReminders(habitId, newReminders);
  };

  const handleDeleteReminder = (reminderId: string) => {
    const newReminders = (reminders || []).filter(r => r.id !== reminderId);
    onUpdateReminders(habitId, newReminders);
  };

  const handleAddReminder = () => {
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      time: '09:00',
      enabled: true,
    };
    const currentReminders = reminders || [];
    onUpdateReminders(habitId, [...currentReminders, newReminder]);
  };

  return (
    <RemindersManager
      reminders={reminders || []}
      onToggleReminder={handleToggleReminder}
      onUpdateReminderTime={handleUpdateReminderTime}
      onDeleteReminder={handleDeleteReminder}
      onAddReminder={handleAddReminder}
      className="mt-3 pb-3 border-b border-gray-100"
    />
  );
};
