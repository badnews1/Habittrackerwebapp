/**
 * Шаг 3: Детали и дополнительные настройки
 * 
 * Содержит:
 * - Частоту выполнения привычки
 * - Напоминания
 * - Заметки
 * 
 * Финальный шаг для всех типов привычек.
 * 
 * @module modules/habit-tracker/features/habits/components/add/HabitDetailsStep
 * @migrated 22 ноября 2025
 */

import React from 'react';
import type { FrequencyConfig, Reminder } from '../../types';
import { FrequencyModalTrigger } from './FrequencyModalTrigger';
import { RemindersSection } from './RemindersSection';
import { NotesSection } from './NotesSection';

interface HabitDetailsStepProps {
  /** Текущая частота */
  frequency: FrequencyConfig;
  
  /** Колбэк открытия модального окна частоты */
  onOpenFrequencyModal: () => void;
  
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
  
  /** Текст заметок */
  description: string;
  
  /** Колбэк изменения заметок */
  onDescriptionChange: (description: string) => void;
}

export const HabitDetailsStep: React.FC<HabitDetailsStepProps> = ({
  frequency,
  onOpenFrequencyModal,
  reminders,
  onToggleReminder,
  onUpdateReminderTime,
  onDeleteReminder,
  onAddReminder,
  description,
  onDescriptionChange,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
      {/* Frequency Button */}
      <FrequencyModalTrigger
        frequency={frequency}
        onClick={onOpenFrequencyModal}
      />

      {/* Reminders */}
      <RemindersSection
        reminders={reminders}
        onToggleReminder={onToggleReminder}
        onUpdateReminderTime={onUpdateReminderTime}
        onDeleteReminder={onDeleteReminder}
        onAddReminder={onAddReminder}
      />

      {/* Notes */}
      <NotesSection
        description={description}
        onDescriptionChange={onDescriptionChange}
      />
    </div>
  );
};
