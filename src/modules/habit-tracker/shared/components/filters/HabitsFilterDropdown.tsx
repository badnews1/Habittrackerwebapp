/**
 * HabitsFilterDropdown - dropdown компонент для фильтрации привычек
 * 
 * @description
 * Компактный dropdown UI для фильтрации привычек по тегам, разделам и типам.
 * Используется в модалках, тулбарах и хедерах.
 * 
 * Особенности:
 * - Иконка фильтра с индикатором активных фильтров
 * - Dropdown панель с тремя секциями (теги + разделы + типы)
 * - Collapsible секции (аккордеон)
 * - Кнопка "Сбросить" для очистки фильтров
 * - Автозакрытие при клике вне области
 * - Логика фильтрации вынесена в useHabitsFilter хук
 * 
 * @since Ноябрь 2024
 * @updated 24 ноября 2025 - добавлена фильтрация по разделам
 */

import React, { useRef } from 'react';
import { Habit } from '@/shared/types/habit';
import { Tag } from '@/modules/habit-tracker/features/tags';
import { HabitsFilterState, HabitsFilterActions } from '../../types/filters';
import { Filter, ChevronUp, ChevronDown } from '@/shared/icons';
import { useClickOutside } from '@/shared/hooks/use-click-outside';

interface HabitsFilterDropdownProps {
  /** Массив привычек для отображения опций фильтра */
  habits: Habit[];
  /** Массив тегов для отображения в фильтре */
  tags: Tag[];
  
  /** Состояние фильтров из useHabitsFilter */
  filterState: HabitsFilterState;
  /** Действия для управления фильтрами из useHabitsFilter */
  filterActions: HabitsFilterActions;
  /** Есть ли активные фильтры (для индикатора) */
  hasActiveFilters: boolean;
  
  /** Открыт ли dropdown */
  isOpen: boolean;
  /** Callback для переключения открытия/закрытия */
  onToggleOpen: () => void;
}

/**
 * Dropdown компонент для фильтрации привычек
 * 
 * @example
 * ```tsx
 * const { state, actions, result } = useHabitsFilter(habits);
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <HabitsFilterDropdown
 *   habits={habits}
 *   tags={tags}
 *   filterState={state}
 *   filterActions={actions}
 *   hasActiveFilters={result.hasActiveFilters}
 *   isOpen={isOpen}
 *   onToggleOpen={() => setIsOpen(!isOpen)}
 * />
 * ```
 */
export function HabitsFilterDropdown({
  habits,
  tags,
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
    selectedSections,
    selectedTypes,
    isCategoryExpanded,
    isSectionExpanded,
    isTypeExpanded,
  } = filterState;

  const {
    toggleUncategorized,
    toggleCategory,
    toggleSection,
    toggleType,
    clearAllFilters,
    toggleCategoryExpanded,
    toggleSectionExpanded,
    toggleTypeExpanded,
  } = filterActions;

  // Получаем уникальные разделы из привычек
  const availableSections = React.useMemo(() => {
    const sectionsSet = new Set<string>();
    habits.forEach((habit) => {
      if (habit.section) {
        sectionsSet.add(habit.section);
      }
    });
    return Array.from(sectionsSet).sort();
  }, [habits]);

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

          {/* Секция фильтрации по тегам */}
          <div>
            <button
              onClick={toggleCategoryExpanded}
              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Теги
              </span>
              {isCategoryExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {isCategoryExpanded && (
              <div className="py-2">
                {/* Опция "Без тега" */}
                {habits.some((h) => !h.tag) && (
                  <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={showUncategorized}
                      onChange={toggleUncategorized}
                      className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">Без тега</span>
                  </label>
                )}

                {/* Список тегов */}
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <label
                      key={tag.name}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(tag.name)}
                        onChange={() => toggleCategory(tag.name)}
                        className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400 text-center">
                    Нет тегов для фильтрации
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Секция фильтрации по разделам */}
          <div className="border-t border-gray-200">
            <button
              onClick={toggleSectionExpanded}
              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Разделы
              </span>
              {isSectionExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {isSectionExpanded && (
              <div className="py-2">
                {availableSections.length > 0 ? (
                  availableSections.map((section) => (
                    <label
                      key={section}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSections.has(section)}
                        onChange={() => toggleSection(section)}
                        className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">{section}</span>
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400 text-center">
                    Нет разделов для фильтрации
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