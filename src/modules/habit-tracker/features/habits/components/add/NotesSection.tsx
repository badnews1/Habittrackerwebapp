/**
 * Секция заметок к привычке
 * 
 * Позволяет добавить текстовое описание или заметки к привычке.
 * Отображает счётчик символов.
 * 
 * @module modules/habit-tracker/features/habits/components/add/NotesSection
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';

interface NotesSectionProps {
  /** Текст заметок */
  description: string;
  
  /** Колбэк изменения заметок */
  onDescriptionChange: (description: string) => void;
  
  /** Максимальная длина заметок */
  maxLength?: number;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  description,
  onDescriptionChange,
  maxLength = TEXT_LENGTH_LIMITS.habitDescription.max,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-gray-500">Заметки</label>
        <span className="text-xs text-gray-400">{description.length}/{maxLength}</span>
      </div>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm resize-none placeholder:text-gray-400"
        placeholder="Добавьте заметки к привычке..."
        rows={3}
        maxLength={maxLength}
      />
    </div>
  );
};
