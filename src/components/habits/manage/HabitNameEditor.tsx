import React from 'react';
import { TEXT_LENGTH_LIMITS } from '../../../constants';
import { INPUT_STYLES } from '../../../constants/styles';

interface HabitNameEditorProps {
  name: string;
  isEditing: boolean;
  editedName: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNameChange: (name: string) => void;
  onSave: (name: string) => void;
}

/**
 * Controlled inline name editor for habits
 * State is managed by the parent component
 */
export const HabitNameEditor: React.FC<HabitNameEditorProps> = ({
  name,
  isEditing,
  editedName,
  inputRef,
  onStartEditing,
  onStopEditing,
  onNameChange,
  onSave,
}) => {
  const handleSave = () => {
    if (editedName.trim()) {
      onSave(editedName.trim());
    } else {
      onNameChange(name);
      onStopEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onNameChange(name);
      onStopEditing();
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={editedName}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`${INPUT_STYLES.compact} pr-12`}
          maxLength={TEXT_LENGTH_LIMITS.habitName.max}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
          {TEXT_LENGTH_LIMITS.habitName.max - editedName.length}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onStartEditing}
      className="text-gray-900 cursor-pointer hover:text-gray-600 transition-colors truncate"
      title="Нажмите для редактирования"
    >
      {name || 'Без названия'}
    </div>
  );
};