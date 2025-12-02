/**
 * Элемент списка привычек в ManageHabitsModal
 * 
 * Функционал:
 * - Drag & drop для изменения порядка
 * - Inline редактирование названия
 * - Раскрывающаяся секция с настройками
 * - Все настройки привычки (тег, частота, напоминания, заметки)
 * - Бейджи с информацией о типе, теге и напоминаниях (порядок: теги → напоминания → тип)
 * 
 * @module features/habit-manage/ui/HabitItem
 * @migrated 30 ноября 2025 - миграция на FSD
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';
import { useShallow } from 'zustand/react/shallow';
import { GripVertical, XIcon, ChevronDown, ChevronUp, Settings, Trash2, Bell, Hash, CheckSquare, Tag } from '@/shared/assets/icons/system';
import { HabitSectionSelect, SYSTEM_SECTION_KEYS } from '@/entities/habit';
import { HabitTagPicker, TagPickerTrigger, useTranslatedTagName } from '@/entities/tag';
import { HabitNameEditor } from './HabitNameEditor';
import { HabitMeasurableSettingsSection } from './HabitMeasurableSettingsSection';
import { HabitFrequencySection } from './HabitFrequencySection';
import { HabitRemindersSection } from './HabitRemindersSection';
import { IconPicker } from '@/shared/ui/icon-picker';
import { HabitNotes } from '@/entities/habit';
import type { Habit, HabitType, Reminder, Tag as TagType } from '@/entities/habit';
import { useHabitsStore } from '@/app/store';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ITEM_TYPE = 'HABIT_ITEM';

interface HabitItemProps {
  habit: Habit;
  index: number;
  onUpdateName: (id: string, name: string) => void;
  onUpdateDescription: (id: string, description: string) => void;
  onUpdateIcon: (id: string, icon: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  onUpdateSection: (id: string, section: string) => void;
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
  onUpdateTags,
  onUpdateSection,
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
  const { t } = useTranslation('habits');
  const getTranslatedTagName = useTranslatedTagName();
  
  // Получаем теги из store
  const tags = useHabitsStore(state => state.tags);

  // Calculate days in month from monthYearKey (format: "YYYY-MM")
  const getDaysInMonth = (monthYearKey: string): number => {
    const [year, month] = monthYearKey.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(monthYearKey);

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(habit?.name || '');
  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [isSectionPickerOpen, setIsSectionPickerOpen] = useState(false);
  
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
        <Button
          ref={drag}
          variant="ghost"
          size="icon"
          className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 h-auto w-auto text-gray-400 hover:text-gray-600"
          title={t('habitItem.dragToReorder')}
        >
          <GripVertical className="w-4 h-4" />
        </Button>

        {/* Icon Picker - полностью автономное управление */}
        <IconPicker
          value={habit.icon}
          onChange={handleIconSelect}
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
                {/* Tag badges - сначала */}
                {habit.tags && habit.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {habit.tags.map(tagName => {
                      const tag = tags.find(t => t.name === tagName);
                      return (
                        <Badge 
                          key={tagName}
                          variant={tag?.color as any}
                          className="flex-shrink-0"
                        >
                          <Tag className="w-3 h-3" />
                          {getTranslatedTagName(tagName)}
                        </Badge>
                      );
                    })}
                  </div>
                )}
                
                {/* Reminder badge - если есть */}
                {((habit.reminders && habit.reminders.some(r => r.enabled)) || habit.reminderEnabled) && (
                  <Badge 
                    variant="gray"
                    className="flex-shrink-0"
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
                  </Badge>
                )}
                
                {/* Habit Type badge - всегда отображается, справа перед настройками */}
                <Badge 
                  variant={habit.type === 'measurable' ? 'blue' : 'gray'}
                  className="flex-shrink-0"
                  title={habit.type === 'measurable' ? t('habit.types.measurable') : t('habit.types.binary')}
                >
                  {habit.type === 'measurable' ? (
                    <Hash className="w-3 h-3" />
                  ) : (
                    <CheckSquare className="w-3 h-3" />
                  )}
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Right Controls Group */}
        <div className="flex items-center gap-1.5">
          {/* Expand/Collapse Button */}
          <Button
            onClick={onToggleExpand}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600"
            title={isExpanded ? t('habitItem.collapse') : t('habitItem.settings')}
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Delete Button */}
          <Button
            onClick={() => onDelete(habit.id)}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            title={t('habitItem.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-100">
          {/* Section Picker */}
          <div>
            <Label>{t('habitItem.section')}</Label>
            <HabitSectionSelect
              selectedSection={habit.section || SYSTEM_SECTION_KEYS.other}
              onSelectSection={(section) => onUpdateSection(habit.id, section)}
              open={isSectionPickerOpen}
              onOpenChange={setIsSectionPickerOpen}
            />
          </div>

          {/* Tag Picker */}
          <div className="mt-3">
            <Label>{t('habitItem.tags')}</Label>
            <HabitTagPicker
              selectedTags={habit.tags || []}
              onSelectTags={(tags) => onUpdateTags(habit.id, tags)}
              open={isTagPickerOpen}
              onOpenChange={setIsTagPickerOpen}
            >
              <TagPickerTrigger
                selectedTags={habit.tags || []}
                allTags={useHabitsStore.getState().tags}
                placeholder={t('habitItem.noTag')}
                isOpen={isTagPickerOpen}
              />
            </HabitTagPicker>
          </div>

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
            <HabitNotes
              description={habit.description || ''}
              onDescriptionChange={(description) => onUpdateDescription(habit.id, description)}
            />
          </div>
        </div>
      )}
    </div>
  );
};