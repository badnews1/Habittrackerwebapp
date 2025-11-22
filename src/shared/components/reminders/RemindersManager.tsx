/**
 * Универсальный компонент управления напоминаниями
 * 
 * Используется в различных модулях приложения (habits, tasks, finance и т.д.)
 * для единообразного управления напоминаниями.
 * 
 * Функциональность:
 * - Добавление/удаление напоминаний
 * - Включение/выключение каждого напоминания
 * - Настройка времени каждого напоминания
 * - Отображение счётчика активных напоминаний с правильным склонением
 * 
 * @module shared/components/reminders
 * Дата создания: 19 ноября 2024
 * Последнее обновление: 21 ноября 2025 - миграция в /shared для переиспользования
 */

import { Bell, BellOff, Close, Plus } from '@/shared/icons';
import { declineReminders } from '@/shared/utils/text';
import type { Reminder } from '@/modules/habit-tracker/types';

interface RemindersManagerProps {
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
  
  /** Дополнительные CSS классы для контейнера */
  className?: string;
}

/**
 * Универсальный компонент управления напоминаниями
 * 
 * Используется в AddHabitModal, ManageHabitsModal и других модулях
 * для единообразного управления напоминаниями.
 */
export const RemindersManager: React.FC<RemindersManagerProps> = ({
  reminders,
  onToggleReminder,
  onUpdateReminderTime,
  onDeleteReminder,
  onAddReminder,
  className = '',
}) => {
  const enabledReminders = reminders.filter(r => r.enabled);
  const enabledCount = enabledReminders.length;

  return (
    <div className={className}>
      <label className="text-xs text-gray-500 mb-2 block">Напоминания</label>
      <div className="space-y-2">
        {/* Existing reminders */}
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center gap-2">
            {/* Toggle Button */}
            <button
              onClick={() => onToggleReminder(reminder.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded border transition-all ${
                reminder.enabled
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'
              }`}
              title={reminder.enabled ? 'Отключить напоминание' : 'Включить напоминание'}
            >
              {reminder.enabled ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </button>

            {/* Time Input */}
            <input
              type="time"
              value={reminder.time}
              onChange={(e) => onUpdateReminderTime(reminder.id, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm"
            />

            {/* Delete Button */}
            <button
              onClick={() => onDeleteReminder(reminder.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Удалить напоминание"
            >
              <Close className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Add Reminder Button */}
        <button
          onClick={onAddReminder}
          className="w-full p-2 border border-dashed border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2 text-xs"
        >
          <Plus className="w-3 h-3" />
          <span>Добавить время напоминания</span>
        </button>

        {/* Enabled Count */}
        {enabledCount > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            Вы получите {enabledCount} {declineReminders(enabledCount)} каждый день
          </p>
        )}
      </div>
    </div>
  );
};