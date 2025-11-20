import React from 'react';
import { Close } from '../../icons';
import { HabitsFilterDropdown } from '../../shared/filters/HabitsFilterDropdown';
import { Habit } from '../../../types/habit';
import { Category } from '../../../types/category';
import { declineHabits } from '../../../utils/declineWords';

/**
 * Header для модального окна управления привычками
 * 
 * Компоненты:
 * - Заголовок с количеством привычек
 * - Фильтр привычек (HabitsFilterDropdown)
 * - Кнопка закрытия
 * 
 * Используется в:
 * - ManageHabitsModal
 * 
 * Оптимизация: React.memo для предотвращения лишних ререндеров
 * 
 * Дата создания: 19 ноября 2025
 */

interface ManageHabitsHeaderProps {
  habitsCount: number;
  onClose: () => void;
  // Filter props
  localHabits: Habit[];
  localCategories: Category[];
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
  localCategories,
  filterState,
  filterActions,
  hasActiveFilters,
  isFilterDropdownOpen,
  onToggleFilterDropdown,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h4 className="text-gray-900">Управление ежедневными привычками</h4>
        <p className="text-sm text-gray-500 mt-1">
          {habitsCount} {declineHabits(habitsCount)}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Filter Dropdown */}
        <HabitsFilterDropdown
          habits={localHabits}
          categories={localCategories}
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