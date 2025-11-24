/**
 * Шаг 1: Основная информация о привычке
 * 
 * Содержит поля:
 * - Иконка и название (обязательно)
 * - Тег
 * - Раздел
 * - Тип отслеживания (бинарная/измеримая)
 * 
 * @module modules/habit-tracker/features/habits/components/add/HabitBasicInfoStep
 * @migrated 22 ноября 2025
 * @updated 23 ноября 2025 - миграция category → tag
 */

import React from 'react';
import { DragHandle } from '@/shared/icons';
import { HabitTagPicker } from '@/modules/habit-tracker/features/tags';
import { SectionPicker } from '@/shared/components/section-picker';
import { IconPicker } from '../manage/IconPicker';
import { HabitTypePicker } from './HabitTypePicker';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';
import { INPUT_STYLES } from '@/shared/constants/styles';
import type { HabitType } from '../../types';

interface HabitBasicInfoStepProps {
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
  
  /** Список разделов из store */
  sections: string[];
  
  /** Добавить раздел */
  onAddSection: (name: string) => void;
  
  /** Удалить раздел */
  onDeleteSection: (name: string) => void;
  
  /** Получить количество привычек в разделе */
  getSectionUsageCount: (name: string) => number;
  
  /** Выбранный тип привычки */
  type: HabitType;
  
  /** Колбэк изменения типа */
  onTypeChange: (type: HabitType) => void;
  
  /** Открытый пикер */
  openPicker: 'icon' | 'tag' | 'section' | 'type' | null;
  
  /** Колбэк изменения открытого пикера */
  onOpenPickerChange: (picker: 'icon' | 'tag' | 'section' | 'type' | null) => void;
  
  /** Текущая страница иконок */
  currentIconPage: number;
  
  /** Колбэк изменения страницы иконок */
  onIconPageChange: (page: number) => void;
}

export const HabitBasicInfoStep: React.FC<HabitBasicInfoStepProps> = ({
  nameInputRef,
  name,
  onNameChange,
  icon,
  onIconChange,
  tags,
  onTagsChange,
  section,
  onSectionChange,
  sections,
  onAddSection,
  onDeleteSection,
  getSectionUsageCount,
  type,
  onTypeChange,
  openPicker,
  onOpenPickerChange,
  currentIconPage,
  onIconPageChange,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[320px]">
      {/* Icon + Name */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          Название и иконка
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="flex items-center gap-2">
          {/* Icon Picker */}
          <IconPicker
            selectedIcon={icon}
            onSelectIcon={onIconChange}
            isOpen={openPicker === 'icon'}
            onToggle={() => onOpenPickerChange(openPicker === 'icon' ? null : 'icon')}
            currentPage={currentIconPage}
            onPageChange={onIconPageChange}
          />

          {/* Name Input */}
          <div className="relative flex-1">
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className={`${INPUT_STYLES.standard} pr-12`}
              placeholder="Например: Утренняя пробежка"
              maxLength={TEXT_LENGTH_LIMITS.habitName.max}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
              {TEXT_LENGTH_LIMITS.habitName.max - name.length}
            </span>
          </div>
        </div>
      </div>

      {/* Section */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Раздел</label>
        <SectionPicker
          selectedSection={section}
          onSelectSection={onSectionChange}
          sections={sections}
          onAddSection={onAddSection}
          onDeleteSection={onDeleteSection}
          getSectionUsageCount={getSectionUsageCount}
          isOpen={openPicker === 'section'}
          onToggle={() => onOpenPickerChange(openPicker === 'section' ? null : 'section')}
        />
      </div>

      {/* Tag */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Теги</label>
        <HabitTagPicker
          selectedTags={tags}
          onSelectTags={onTagsChange}
          isOpen={openPicker === 'tag'}
          onToggle={() => onOpenPickerChange(openPicker === 'tag' ? null : 'tag')}
        />
      </div>

      {/* Habit Type */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Тип отслеживания</label>
        <HabitTypePicker
          selectedType={type}
          onSelectType={onTypeChange}
          isOpen={openPicker === 'type'}
          onToggle={() => onOpenPickerChange(openPicker === 'type' ? null : 'type')}
        />
      </div>
    </div>
  );
};