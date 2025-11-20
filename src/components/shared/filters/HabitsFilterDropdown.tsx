import React, { useRef } from 'react';
import { Habit } from '../../../types/habit';
import { Category } from '../../../types/category';
import { HabitsFilterState, HabitsFilterActions } from '../../../types/filters';
import { Filter, ChevronUp, ChevronDown } from '../../icons';
import { useClickOutside } from '../../../hooks/useClickOutside';

interface HabitsFilterDropdownProps {
  // Данные для отображения опций фильтра
  habits: Habit[];
  categories: Category[];
  
  // Состояние и действия из useHabitsFilter
  filterState: HabitsFilterState;
  filterActions: HabitsFilterActions;
  hasActiveFilters: boolean;
  
  // UI управление открытием/закрытием dropdown
  isOpen: boolean;
  onToggleOpen: () => void;
}

/**
 * Dropdown версия фильтра привычек
 * Компактный UI для использования в модалках, тулбарах и хедерах
 * Логика фильтрации вынесена в useHabitsFilter хук
 */
export function HabitsFilterDropdown({
  habits,
  categories,
  filterState,
  filterActions,
  hasActiveFilters,
  isOpen,
  onToggleOpen,
}: HabitsFilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие dropdown при клике вне его области
  useClickOutside(dropdownRef, () => {
    if (isOpen) onToggleOpen();
  });

  const {
    showUncategorized,
    selectedCategories,
    selectedTypes,
    isCategoryExpanded,
    isTypeExpanded,
  } = filterState;

  const {
    toggleUncategorized,
    toggleCategory,
    toggleType,
    clearAllFilters,
    toggleCategoryExpanded,
    toggleTypeExpanded,
  } = filterActions;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка фильтра */}
      <button
        onClick={onToggleOpen}
        className={`p-2 rounded-full transition-colors relative ${
          hasActiveFilters
            ? 'bg-gray-900 text-white hover:bg-gray-800'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
        }`}
        title="Фильтры"
      >
        <Filter className="w-5 h-5" />
        {hasActiveFilters && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Dropdown панель */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-64 max-h-80 overflow-y-auto">
          {/* Header с кнопкой сброса */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Фильтры</span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
              >
                Сбросить
              </button>
            )}
          </div>

          {/* Секция фильтрации по категориям */}
          <div>
            <button
              onClick={toggleCategoryExpanded}
              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Категории
              </span>
              {isCategoryExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {isCategoryExpanded && (
              <div className="py-2">
                {/* Опция "Без категории" */}
                {habits.some((h) => !h.category) && (
                  <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={showUncategorized}
                      onChange={toggleUncategorized}
                      className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">Без категории</span>
                  </label>
                )}

                {/* Список категорий */}
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <label
                      key={category.name}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(category.name)}
                        onChange={() => toggleCategory(category.name)}
                        className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400 text-center">
                    Нет категорий для фильтрации
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Секция фильтрации по типам привычек */}
          <div className="border-t border-gray-200">
            <button
              onClick={toggleTypeExpanded}
              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Тип отслеживания
              </span>
              {isTypeExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {isTypeExpanded && (
              <div className="py-2">
                <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedTypes.has('binary')}
                    onChange={() => toggleType('binary')}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">Простая отметка</span>
                </label>
                <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedTypes.has('measurable')}
                    onChange={() => toggleType('measurable')}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">Ввод числа</span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}