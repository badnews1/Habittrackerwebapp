/**
 * useHabitsFilter - универсальный хук для фильтрации привычек
 * 
 * @description
 * Содержит всю логику фильтрации привычек без привязки к UI.
 * Может использоваться в любом компоненте приложения.
 * 
 * Особенности:
 * - Фильтрация по категориям (включая "без категории")
 * - Фильтрация по типам привычек (binary/measurable)
 * - UI состояние для аккордеонов (expand/collapse)
 * - Подсчёт активных фильтров
 * - Оптимизация через useMemo
 * - Конфигурируемое поведение
 * 
 * @since Ноябрь 2024
 * @updated 22 ноября 2025 - мигрирован в /modules/habit-tracker/shared/hooks
 */

import { useState, useMemo } from 'react';
import { Habit, HabitType } from '@/shared/types/habit';
import {
  HabitsFilterState,
  HabitsFilterResult,
  HabitsFilterActions,
  HabitsFilterConfig,
} from '../../types/filters';

/**
 * Универсальный хук для фильтрации привычек
 * 
 * @param habits - массив привычек для фильтрации
 * @param config - конфигурация поведения фильтра
 * @returns объект с состоянием, действиями и результатами фильтрации
 * 
 * @example
 * ```tsx
 * const { state, actions, result } = useHabitsFilter(habits, {
 *   initialState: {
 *     showUncategorized: false,
 *     isCategoryExpanded: true
 *   },
 *   enableTypeFilter: false
 * });
 * 
 * // Использование результатов
 * const { filteredHabits, hasActiveFilters } = result;
 * 
 * // Использование действий
 * const { toggleCategory, clearAllFilters } = actions;
 * ```
 */
export function useHabitsFilter(
  habits: Habit[],
  config: HabitsFilterConfig = {}
) {
  // Деструктуризация конфига с дефолтными значениями
  const {
    initialState = {},
    enableCategoryFilter = true,
    enableSectionFilter = true,
    enableTypeFilter = true,
    enableUncategorizedFilter = true,
  } = config;

  // State фильтров
  const [showUncategorized, setShowUncategorized] = useState(
    initialState.showUncategorized ?? true
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    initialState.selectedCategories ?? new Set()
  );
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    initialState.selectedSections ?? new Set()
  );
  const [selectedTypes, setSelectedTypes] = useState<Set<HabitType>>(
    initialState.selectedTypes ?? new Set(['binary', 'measurable'])
  );

  // UI состояние для аккордеонов
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(
    initialState.isCategoryExpanded ?? false
  );
  const [isSectionExpanded, setIsSectionExpanded] = useState(
    initialState.isSectionExpanded ?? false
  );
  const [isTypeExpanded, setIsTypeExpanded] = useState(
    initialState.isTypeExpanded ?? false
  );

  // Действия для управления фильтрами
  const toggleUncategorized = () => {
    setShowUncategorized(!showUncategorized);
  };

  const toggleCategory = (categoryName: string) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(categoryName)) {
      newSet.delete(categoryName);
    } else {
      newSet.add(categoryName);
    }
    setSelectedCategories(newSet);
  };

  const toggleSection = (sectionName: string) => {
    const newSet = new Set(selectedSections);
    if (newSet.has(sectionName)) {
      newSet.delete(sectionName);
    } else {
      newSet.add(sectionName);
    }
    setSelectedSections(newSet);
  };

  const toggleType = (type: HabitType) => {
    const newSet = new Set(selectedTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedTypes(newSet);
  };

  const clearAllFilters = () => {
    setShowUncategorized(true);
    setSelectedCategories(new Set());
    setSelectedSections(new Set());
    setSelectedTypes(new Set(['binary', 'measurable']));
  };

  // Вычисление наличия активных фильтров
  const hasActiveFilters = useMemo(() => {
    return (
      showUncategorized !== true ||
      selectedCategories.size > 0 ||
      selectedSections.size > 0 ||
      selectedTypes.size < 2
    );
  }, [showUncategorized, selectedCategories, selectedSections, selectedTypes]);

  // Подсчет количества активных фильтров
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (!showUncategorized) count++;
    count += selectedCategories.size;
    count += selectedSections.size;
    if (selectedTypes.size === 1) count++;
    return count;
  }, [showUncategorized, selectedCategories, selectedSections, selectedTypes]);

  // Фильтрация привычек на основе текущих настроек
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      // Фильтр по uncategorized
      if (enableUncategorizedFilter && !showUncategorized && (!habit.tags || habit.tags.length === 0)) {
        return false;
      }

      // Фильтр по категориям
      if (
        enableCategoryFilter &&
        selectedCategories.size > 0 &&
        (!habit.tags || !habit.tags.some(tag => selectedCategories.has(tag)))
      ) {
        return false;
      }

      // Фильтр по секциям
      if (
        enableSectionFilter &&
        selectedSections.size > 0 &&
        !selectedSections.has(habit.section || 'Другие')
      ) {
        return false;
      }

      // Фильтр по типам привычек
      if (
        enableTypeFilter &&
        selectedTypes.size < 2 &&
        !selectedTypes.has(habit.type)
      ) {
        return false;
      }

      return true;
    });
  }, [
    habits,
    showUncategorized,
    selectedCategories,
    selectedSections,
    selectedTypes,
    enableUncategorizedFilter,
    enableCategoryFilter,
    enableSectionFilter,
    enableTypeFilter,
  ]);

  // Формирование возвращаемого объекта

  // Текущее состояние фильтров
  const state: HabitsFilterState = {
    showUncategorized,
    selectedCategories,
    selectedSections,
    selectedTypes,
    isCategoryExpanded,
    isSectionExpanded,
    isTypeExpanded,
  };

  // Действия для изменения состояния
  const actions: HabitsFilterActions = {
    toggleUncategorized,
    toggleCategory,
    toggleSection,
    toggleType,
    clearAllFilters,
    toggleCategoryExpanded: () => setIsCategoryExpanded(!isCategoryExpanded),
    toggleSectionExpanded: () => setIsSectionExpanded(!isSectionExpanded),
    toggleTypeExpanded: () => setIsTypeExpanded(!isTypeExpanded),
  };

  // Результаты фильтрации
  const result: HabitsFilterResult = {
    filteredHabits,
    activeFiltersCount,
    hasActiveFilters,
  };

  return {
    state,
    actions,
    result,
  };
}