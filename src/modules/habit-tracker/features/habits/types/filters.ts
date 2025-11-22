/**
 * Типы для системы фильтрации привычек
 * 
 * @module modules/habit-tracker/features/habits/types/filters
 * @created 22 ноября 2025
 * @migrated из /types/filters.ts
 */

import { Habit, HabitType } from '@/modules/habit-tracker/types';

/**
 * Состояние фильтров привычек
 */
export interface HabitsFilterState {
  // Фильтр по категориям
  showUncategorized: boolean;
  selectedCategories: Set<string>;
  
  // Фильтр по типам
  selectedTypes: Set<HabitType>;
  
  // UI состояние для аккордеонов
  isCategoryExpanded: boolean;
  isTypeExpanded: boolean;
}

/**
 * Результат работы фильтра
 */
export interface HabitsFilterResult {
  filteredHabits: Habit[];
  activeFiltersCount: number;
  hasActiveFilters: boolean;
}

/**
 * Действия для управления фильтрами
 */
export interface HabitsFilterActions {
  toggleUncategorized: () => void;
  toggleCategory: (categoryName: string) => void;
  toggleType: (type: HabitType) => void;
  clearAllFilters: () => void;
  toggleCategoryExpanded: () => void;
  toggleTypeExpanded: () => void;
}

/**
 * Конфигурация фильтра для кастомизации поведения
 */
export interface HabitsFilterConfig {
  initialState?: Partial<HabitsFilterState>;
  enableCategoryFilter?: boolean;
  enableTypeFilter?: boolean;
  enableUncategorizedFilter?: boolean;
}