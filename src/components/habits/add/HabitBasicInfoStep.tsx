import React from 'react';
import { Category } from '../../../types/category';
import { Habit, HabitType } from '../../../types/habit';
import { IconPicker } from '../manage/IconPicker';
import { CategoryPicker } from '../manage/CategoryPicker';
import { HabitTypePicker } from './HabitTypePicker';
import { TEXT_LENGTH_LIMITS } from '../../../constants';
import { INPUT_STYLES } from '../../../constants/styles';

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
  
  /** Выбранная категория */
  category: string | undefined;
  
  /** Колбэк изменения категории */
  onCategoryChange: (category: string | undefined) => void;
  
  /** Выбранный тип привычки */
  type: HabitType;
  
  /** Колбэк изменения типа */
  onTypeChange: (type: HabitType) => void;
  
  /** Список категорий */
  categories: Category[];
  
  /** Колбэк добавления категории */
  onAddCategory: (name: string) => void;
  
  /** Колбэк удаления категории */
  onDeleteCategory: (name: string) => void;
  
  /** Колбэк изменения цвета категории */
  onUpdateCategoryColor: (name: string, color: string) => void;
  
  /** Все привычки (для проверки использования категории) */
  allHabits: Habit[];
  
  /** Открытый пикер */
  openPicker: 'icon' | 'category' | 'type' | null;
  
  /** Колбэк изменения открытого пикера */
  onOpenPickerChange: (picker: 'icon' | 'category' | 'type' | null) => void;
  
  /** Текущая страница иконок */
  currentIconPage: number;
  
  /** Колбэк изменения страницы иконок */
  onIconPageChange: (page: number) => void;
}

/**
 * Шаг 1: Основная информация о привычке
 * 
 * Содержит поля:
 * - Иконка и название (обязательно)
 * - Категория
 * - Тип отслеживания (бинарная/измеримая)
 * 
 * Дата создания: 19 ноября 2024
 */
export const HabitBasicInfoStep: React.FC<HabitBasicInfoStepProps> = ({
  nameInputRef,
  name,
  onNameChange,
  icon,
  onIconChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  categories,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategoryColor,
  allHabits,
  openPicker,
  onOpenPickerChange,
  currentIconPage,
  onIconPageChange,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
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

      {/* Category */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Категория</label>
        <CategoryPicker
          selectedCategory={category}
          onSelectCategory={onCategoryChange}
          categories={categories}
          onAddCategory={onAddCategory}
          onDeleteCategory={onDeleteCategory}
          onUpdateCategoryColor={onUpdateCategoryColor}
          allHabits={allHabits}
          isOpen={openPicker === 'category'}
          onToggle={() => onOpenPickerChange(openPicker === 'category' ? null : 'category')}
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