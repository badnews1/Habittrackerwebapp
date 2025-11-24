/**
 * Header для модального окна управления привычками
 * 
 * Компоненты:
 * - Заголовок с количеством привычек
 * - Фильтр привычек (HabitsFilterDropdown)
 * - Кнопка закрытия
 * 
 * Оптимизация: React.memo для предотвращения лишних ререндеров
 * 
 * @module modules/habit-tracker/features/habits/components/manage/ManageHabitsHeader
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { Close } from '@/shared/icons';
import { HabitsFilterDropdown } from '@/modules/habit-tracker/shared/components/filters';
import type { Habit } from '../../types';
import { Tag } from '@/modules/habit-tracker/features/tags';
import { declineHabits } from '@/shared/utils/text';

interface ManageHabitsHeaderProps {
  // Display props
  habitsCount: number;
  onClose: () => void;
  // Filter props
  localHabits: Habit[];
  localTags: Tag[];
  filterState: {
    selectedCategories: string[];
    selectedTypes: ('binary' | 'measurable')[];
    isCategoryExpanded: boolean;
    isTypeExpanded: boolean;
  };
  filterActions: {
    toggleCategory: (category: string) => void;
    toggleType: (type: 'binary' | 'measurable') => void;
    toggleCategoryExpanded: () => void;
    toggleTypeExpanded: () => void;
    clearFilters: () => void;
  };
  hasActiveFilters: boolean;
  isFilterDropdownOpen: boolean;
  onToggleFilterDropdown: () => void;
}

export const ManageHabitsHeader: React.FC<ManageHabitsHeaderProps> = React.memo(({ 
  habitsCount,
  onClose,
  localHabits,
  localTags,
  filterState,
  filterActions,
  hasActiveFilters,
  isFilterDropdownOpen,
  onToggleFilterDropdown,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h4 className="text-gray-900">Управление привычками</h4>
        <p className="text-sm text-gray-500 mt-1">
          {habitsCount} {declineHabits(habitsCount)}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Filter Dropdown */}
        <HabitsFilterDropdown
          habits={localHabits}
          tags={localTags}
          filterState={filterState}
          filterActions={filterActions}
          hasActiveFilters={hasActiveFilters}
          isOpen={isFilterDropdownOpen}
          onToggleOpen={onToggleFilterDropdown}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
          title="Закрыть"
        >
          <Close className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

ManageHabitsHeader.displayName = 'ManageHabitsHeader';