import React, { useState } from 'react';
import { Bug } from '../icons';
import { Habit, Reminder } from '../../types/habit';
import { Button } from '../common';

interface DebugPanelProps {
  habits: Habit[];
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  habits,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Collect all active reminders
  const activeReminders: Array<{ habitName: string; time: string }> = [];
  habits.forEach(habit => {
    // New format
    if (habit.reminders && habit.reminders.length > 0) {
      habit.reminders.forEach(reminder => {
        if (reminder.enabled) {
          activeReminders.push({ habitName: habit.name, time: reminder.time });
        }
      });
    }
    // Legacy format
    else if (habit.reminderEnabled && habit.reminderTime) {
      activeReminders.push({ habitName: habit.name, time: habit.reminderTime });
    }
  });

  // Sort by time
  activeReminders.sort((a, b) => a.time.localeCompare(b.time));

  const habitsWithReminders = habits.filter(h => 
    (h.reminders && h.reminders.some(r => r.enabled)) ||
    h.reminderEnabled
  );
  
  const notificationSupport = 'Notification' in window;
  const notificationPermission = notificationSupport ? Notification.permission : 'not-supported';

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-2 right-2 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
        title="Открыть панель отладки"
      >
        <Bug className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-2 right-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-gray-900">Отладка уведомлений</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-gray-500">Поддержка уведомлений:</span>
          <span className={`ml-2 ${notificationSupport ? 'text-green-600' : 'text-red-600'}`}>
            {notificationSupport ? '✓ Да' : '✗ Нет'}
          </span>
        </div>

        <div>
          <span className="text-gray-500">Разрешение:</span>
          <span className="ml-2 text-gray-900">{notificationPermission}</span>
        </div>

        <div>
          <span className="text-gray-500">Всего привычек:</span>
          <span className="ml-2 text-gray-900">{habits.length}</span>
        </div>

        <div>
          <span className="text-gray-500">С напоминаниями:</span>
          <span className="ml-2 text-gray-900">{habitsWithReminders.length}</span>
        </div>

        <div>
          <span className="text-gray-500">Активных напоминаний:</span>
          <span className="ml-2 text-gray-900">{activeReminders.length}</span>
        </div>

        {activeReminders.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-gray-500 mb-2">Расписание напоминаний:</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {activeReminders.map((reminder, index) => (
                <div key={index} className="text-xs text-gray-700 flex items-center gap-2">
                  <span className="w-12 text-gray-500">{reminder.time}</span>
                  <span className="truncate flex-1">{reminder.habitName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {notificationSupport && notificationPermission === 'default' && (
          <Button
            onClick={async () => {
              const permission = await Notification.requestPermission();
              if (permission === 'granted') {
                new Notification('✅ Готово!', {
                  body: 'Уведомления успешно включены',
                });
              }
              setIsOpen(false);
              setTimeout(() => setIsOpen(true), 100);
            }}
            className="w-full mt-3 px-3 py-2 bg-gray-900 text-white rounded text-xs hover:bg-gray-800 transition-colors"
          >
            Включить уведомления
          </Button>
        )}
      </div>
    </div>
  );
};