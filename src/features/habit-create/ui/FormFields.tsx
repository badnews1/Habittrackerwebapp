/**
 * Компоненты полей формы создания/редактирования привычки
 * 
 * @description
 * Содержит три логических группы полей:
 * - HabitBasicInfo: основная информация (название, иконка, раздел, теги, тип)
 * - HabitMeasurable: настройки измеримой привычки (единицы, цель)
 * - HabitDetails: детали (частота, напоминания, заметки)
 * 
 * @module features/habit-create/ui/FormFields
 * @created 1 декабря 2025 - объединение HabitBasicInfo, HabitMeasurable, HabitDetails
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { HabitType, HabitSectionSelect, HabitTypePicker, useHabitUnitGroups, useLocalizedUnit, TargetTypePicker } from '@/entities/habit';
import { HabitTagPicker, TagPickerTrigger } from '@/entities/tag';
import { IconPicker } from '@/shared/ui/icon-picker';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHabitsStore } from '@/app/store';
import { UnitPicker } from '@/shared/ui/unit-picker';
import type { FrequencyConfig, Reminder } from '@/entities/habit';
import { HabitReminders, HabitNotes, FrequencyTwoColumn } from '@/entities/habit';

// ============================================
// HABIT BASIC INFO
// ============================================

interface HabitBasicInfoProps {
  /** Ссылка на input для автофокуса */
  nameInputRef: React.RefObject<HTMLInputElement>;
  
  /** Название привычки */
  name: string;
  
  /** Колбэк изменения названия */
  onNameChange: (name: string) => void;
  
  /** Выбранная иконка */
  icon: string;
  
  /** Колбэк изменения иконки */
  onIconChange: (icon: string) => void;
  
  /** Выбранные теги */
  tags: string[];
  
  /** Колбэк изменения тегов */
  onTagsChange: (tags: string[]) => void;
  
  /** Выбранный раздел */
  section: string;
  
  /** Колбэк изменения раздела */
  onSectionChange: (section: string) => void;
  
  /** Выбранный тип привычки */
  type: HabitType;
  
  /** Колбэк изменения типа */
  onTypeChange: (type: HabitType) => void;
  
  /** Открытый пикер */
  openPicker: 'icon' | 'tag' | 'section' | null;
  
  /** Колбэк изменения открытого пикера */
  onOpenPickerChange: (picker: 'icon' | 'tag' | 'section' | null) => void;
}

export const HabitBasicInfo: React.FC<HabitBasicInfoProps> = ({
  nameInputRef,
  name,
  onNameChange,
  icon,
  onIconChange,
  tags,
  onTagsChange,
  section,
  onSectionChange,
  type,
  onTypeChange,
  openPicker,
  onOpenPickerChange,
}) => {
  const { t } = useTranslation('habits');
  
  return (
    <div className="space-y-4">
      {/* Icon + Name */}
      <div>
        <Label htmlFor="habit-name">
          {t('form.nameAndIcon')}
          <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <div className="flex items-center gap-2">
          {/* Icon Picker */}
          <IconPicker
            value={icon}
            onChange={onIconChange}
            open={openPicker === 'icon'}
            onOpenChange={(open) => onOpenPickerChange(open ? 'icon' : null)}
          />

          {/* Name Input */}
          <Input
            id="habit-name"
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={t('form.namePlaceholder')}
            maxLength={TEXT_LENGTH_LIMITS.habitName.max}
            showCounter
            className="flex-1"
          />
        </div>
      </div>

      {/* Section */}
      <div>
        <Label>{t('form.section')}</Label>
        <HabitSectionSelect
          selectedSection={section}
          onSelectSection={onSectionChange}
          open={openPicker === 'section'}
          onOpenChange={(open) => onOpenPickerChange(open ? 'section' : null)}
        />
      </div>

      {/* Tag */}
      <div>
        <Label>{t('form.tags')}</Label>
        <HabitTagPicker
          selectedTags={tags}
          onSelectTags={onTagsChange}
          open={openPicker === 'tag'}
          onOpenChange={(open) => onOpenPickerChange(open ? 'tag' : null)}
        >
          <TagPickerTrigger
            selectedTags={tags}
            allTags={useHabitsStore.getState().tags}
            placeholder={t('manage.filters.uncategorized')}
            isOpen={openPicker === 'tag'}
          />
        </HabitTagPicker>
      </div>

      {/* Habit Type */}
      <div>
        <Label>{t('form.trackingType')}</Label>
        <HabitTypePicker
          selectedType={type}
          onSelectType={onTypeChange}
        />
      </div>
    </div>
  );
};

// ============================================
// HABIT MEASURABLE
// ============================================

interface HabitMeasurableProps {
  /** Выбранная единица измерения */
  unit: string;
  
  /** Колбэк изменения единицы измерения */
  onUnitChange: (unit: string) => void;
  
  /** Тип цели (min/max) */
  targetType: 'min' | 'max';
  
  /** Колбэк изменения типа цели */
  onTargetTypeChange: (targetType: 'min' | 'max') => void;
  
  /** Значение цели */
  targetValue: string;
  
  /** Колбэк изменения значения цели */
  onTargetValueChange: (value: string) => void;
  
  /** Открытый пикер */
  openPicker: 'targetType' | null;
  
  /** Колбэк изменения открытого пикера */
  onOpenPickerChange: (picker: 'targetType' | null) => void;
}

export const HabitMeasurable: React.FC<HabitMeasurableProps> = ({
  unit,
  onUnitChange,
  targetType,
  onTargetTypeChange,
  targetValue,
  onTargetValueChange,
  openPicker,
  onOpenPickerChange,
}) => {
  const { t } = useTranslation('habits');
  const unitGroups = useHabitUnitGroups();
  const localizedUnit = useLocalizedUnit(unit);
  
  return (
    <div className="space-y-4">
      {/* Unit */}
      <div>
        <Label>
          {t('form.unitOfMeasurement')}
          <span className="text-red-500 ml-0.5">*</span>
        </Label>
        <UnitPicker
          value={localizedUnit}
          onChange={onUnitChange}
          groups={unitGroups}
        />
      </div>

      {/* Target Value and Target Type */}
      <div className="grid grid-cols-2 gap-3">
        {/* Target Type */}
        <div>
          <Label>{t('form.targetType')}</Label>
          <TargetTypePicker
            selectedTargetType={targetType}
            onSelectTargetType={onTargetTypeChange}
            isOpen={openPicker === 'targetType'}
            onOpenChange={(open) => onOpenPickerChange(open ? 'targetType' : null)}
          />
        </div>

        {/* Target Value */}
        <div>
          <Label htmlFor="target-value">
            {t('form.targetValue')}
            <span className="text-red-500 ml-0.5">*</span>
          </Label>
          <Input
            id="target-value"
            type="text"
            inputMode="decimal"
            value={targetValue}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numbers and decimal point
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                onTargetValueChange(value);
              }
            }}
            placeholder={t('form.targetPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// HABIT DETAILS
// ============================================

interface HabitDetailsProps {
  /** Текущая частота */
  frequency: FrequencyConfig;
  
  /** Колбэк изменения частоты */
  onFrequencyChange: (frequency: FrequencyConfig) => void;
  
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

export const HabitDetails: React.FC<HabitDetailsProps> = ({
  frequency,
  onFrequencyChange,
  reminders,
  onToggleReminder,
  onUpdateReminderTime,
  onDeleteReminder,
  onAddReminder,
  description,
  onDescriptionChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Frequency Two-Column Layout */}
      <FrequencyTwoColumn
        frequency={frequency}
        onFrequencyChange={onFrequencyChange}
      />

      {/* Reminders */}
      <HabitReminders
        reminders={reminders}
        onToggleReminder={onToggleReminder}
        onUpdateReminderTime={onUpdateReminderTime}
        onDeleteReminder={onDeleteReminder}
        onAddReminder={onAddReminder}
      />

      {/* Notes */}
      <HabitNotes
        description={description}
        onDescriptionChange={onDescriptionChange}
      />
    </div>
  );
};