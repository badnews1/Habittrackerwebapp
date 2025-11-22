/**
 * Элемент списка привычек в ManageHabitsModal
 * 
 * Функционал:
 * - Drag & drop для изменения порядка
 * - Inline редактирование названия
 * - Раскрывающаяся секция с настройками
 * - Все настройки привычки (категория, частота, напоминания, заметки)
 * - Бейджи с информацией о типе, категории и напоминаниях
 * 
 * @module modules/habit-tracker/features/habits/components/manage/HabitItem
 * @migrated 22 ноября 2025
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragHandle, Close, ChevronDown, ChevronUp, Settings, Trash2, Bell, Hash, CheckSquare, Tag } from '@/shared/icons';
import { HabitCategoryPicker } from '@/modules/habit-tracker/features/categories';
import { HabitNameEditor } from './HabitNameEditor';
import { HabitMeasurableSettingsSection } from './HabitMeasurableSettingsSection';
import { HabitFrequencySection } from './HabitFrequencySection';
import { HabitRemindersSection } from './HabitRemindersSection';
import { IconPicker } from './IconPicker';
import { NotesSection } from '../add/NotesSection';
import type { Habit, HabitType, Reminder } from '../../types';
import { Category, getCategoryColor } from '@/modules/habit-tracker/features/categories';
import { useHabitsStore } from '@/core/store';

const ITEM_TYPE = 'HABIT_ITEM';

interface HabitItemProps {
  habit: Habit;
  index: number;
  onUpdateName: (id: string, name: string) => void;
  onUpdateDescription: (id: string, description: string) => void;
  onUpdateIcon: (id: string, icon: string) => void;
  onUpdateCategory: (id: string, category: string) => void;
  onUpdateReminders: (id: string, reminders: Reminder[]) => void;
  onUpdateType: (id: string, type: HabitType) => void;
  onUpdateFrequency: (id: string, frequency: Habit['frequency']) => void;
  onUpdateMeasurableSettings: (id: string, settings: { unit?: string; targetValue?: number; targetType?: 'min' | 'max' }) => void;
  onDelete: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  monthYearKey: string;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export const HabitItem: React.FC<HabitItemProps> = ({ 
  habit, 
  index, 
  onUpdateName,
  onUpdateDescription,
  onUpdateIcon,
  onUpdateCategory,
  onUpdateReminders,
  onUpdateType,
  onUpdateFrequency,
  onUpdateMeasurableSettings,
  onDelete, 
  onMove,
  isExpanded,
  onToggleExpand,
  monthYearKey,
  scrollContainerRef
}) => {
  // Получаем категории из store
  const categories = useHabitsStore(state => state.categories);

  // Calculate days in month from monthYearKey (format: "YYYY-MM")
  const getDaysInMonth = (monthYearKey: string): number => {
    const [year, month] = monthYearKey.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(monthYearKey);

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(habit?.name || '');
  
  // Refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Drag and Drop
  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  preview(drop(ref));

  // Auto-edit mode for new habits with empty name
  useEffect(() => {
    if (isExpanded && !habit.name && !isEditingName) {
      setIsEditingName(true);
    }
  }, [isExpanded, habit.name, isEditingName]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // Handlers
  const handleIconSelect = (iconName: string) => {
    onUpdateIcon(habit.id, iconName);
  };

  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-200 rounded-xl transition-all ${
        isDragging ? 'opacity-30' : 'opacity-100'
      } ${isOver ? 'border-gray-900' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        {/* Drag Handle */}
        <button
          ref={drag}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Перетащите для изменения порядка"
        >
          <DragHandle className="w-4 h-4" />
        </button>

        {/* Icon Picker - полностью автономное управление */}
        <IconPicker
          selectedIcon={habit.icon}
          onSelectIcon={handleIconSelect}
        />

        {/* Habit Name & Stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <HabitNameEditor
                name={habit.name}
                isEditing={isEditingName}
                editedName={editedName}
                inputRef={nameInputRef}
                onStartEditing={() => setIsEditingName(true)}
                onStopEditing={() => setIsEditingName(false)}
                onNameChange={setEditedName}
                onSave={(newName) => {
                  onUpdateName(habit.id, newName);
                  setIsEditingName(false);
                }}
              />
            </div>
            
            {!isEditingName && (
              <>
                {/* Habit Type badge */}
                <span 
                  className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                    habit.type === 'measurable' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                  title={habit.type === 'measurable' ? 'Ввод числа' : 'Простая отметка'}
                >
                  {habit.type === 'measurable' ? (
                    <>
                      <Hash className="w-3 h-3" />
                      Ввод числа
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-3 h-3" />
                      Простая отметка
                    </>
                  )}
                </span>
                
                {/* Category badge */}
                {habit.category && (
                  <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ${getCategoryColor(categories, habit.category)}`}>
                    <Tag className="w-3 h-3" />
                    {habit.category}
                  </span>
                )}
                
                {/* Reminder badge */}
                {((habit.reminders && habit.reminders.some(r => r.enabled)) || habit.reminderEnabled) && (
                  <span 
                    className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs" 
                    title={
                      habit.reminders && habit.reminders.length > 0
                        ? `${habit.reminders.filter(r => r.enabled).length} напоминаний: ${habit.reminders.filter(r => r.enabled).map(r => r.time).join(', ')}`
                        : `Напоминание в ${habit.reminderTime}`
                    }
                  >
                    <Bell className="w-3 h-3" />
                    {habit.reminders && habit.reminders.length > 0 
                      ? habit.reminders.filter(r => r.enabled).length 
                      : habit.reminderTime}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Controls Group */}
        <div className="flex items-center gap-1.5">
          {/* Expand/Collapse Button */}
          <button
            onClick={onToggleExpand}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title={isExpanded ? 'Свернуть' : 'Настройки привычки'}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 rounded-md transition-colors text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Удалить привычку"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-100">
          {/* Category Picker */}
          <HabitCategoryPicker
            selectedCategory={habit.category}
            onSelectCategory={(category) => onUpdateCategory(habit.id, category)}
          />

          {/* Measurable Settings (only for measurable habits) */}
          {habit.type === 'measurable' && (
            <HabitMeasurableSettingsSection
              habitId={habit.id}
              unit={habit.unit || ''}
              targetValue={habit.targetValue}
              targetType={habit.targetType || 'min'}
              onUpdateMeasurableSettings={onUpdateMeasurableSettings}
            />
          )}

          {/* Frequency Section */}
          <HabitFrequencySection
            habitId={habit.id}
            frequency={habit.frequency}
            onUpdateFrequency={onUpdateFrequency}
          />

          {/* Reminders Section */}
          <HabitRemindersSection
            habitId={habit.id}
            reminders={habit.reminders}
            onUpdateReminders={onUpdateReminders}
          />

          {/* Description */}
          <div className="mt-3">
            <NotesSection
              description={habit.description || ''}
              onDescriptionChange={(description) => onUpdateDescription(habit.id, description)}
            />
          </div>
        </div>
      )}
    </div>
  );
};