/**
 * Секция заметок к привычке
 * 
 * Позволяет добавить текстовое описание или заметки к привычке.
 * Отображает счётчик символов.
 * 
 * @module entities/habit/ui/HabitNotes
 * @created 30 ноября 2025 - миграция на FSD
 * @migrated 30 ноября 2025 - перенос из features/habits (FSD fix)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';
import { Textarea } from '@/components/ui/textarea';

interface HabitNotesProps {
  /** Текст заметок */
  description: string;
  
  /** Колбэк изменения заметок */
  onDescriptionChange: (description: string) => void;
  
  /** Максимальная длина заметок */
  maxLength?: number;
}

export const HabitNotes: React.FC<HabitNotesProps> = ({
  description,
  onDescriptionChange,
  maxLength = TEXT_LENGTH_LIMITS.habitDescription.max,
}) => {
  const { t } = useTranslation('habits');
  
  return (
    <Textarea
      id="habit-notes"
      label={t('notes.label')}
      showCounter
      value={description}
      onChange={(e) => onDescriptionChange(e.target.value)}
      placeholder={t('notes.placeholder')}
      rows={3}
      maxLength={maxLength}
      className="resize-none"
    />
  );
};