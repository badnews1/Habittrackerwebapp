/**
 * Типы для системы фильтрации привычек
 * 
 * @description
 * Интерфейсы для управления состоянием фильтров, их действиями и результатами.
 * Используются в HabitsFilterDropdown и useHabitsFilter хуке.
 * 
 * Типы фильтров:
 * - По категориям (включая "без категории")
 * - По типам привычек (binary/measurable)
 * - UI состояние аккордеонов
 * 
 * @since Ноябрь 2024
 * @updated 22 ноября 2025 - мигрирован в /modules/habit-tracker/shared/types
 */

import { Habit, HabitType } from '@/shared/types/habit';

/**
 * Состояние фильтров привычек
 */
export interface HabitsFilterState {
  /** Показывать ли привычки без категории */
  showUncategorized: boolean;
  /** Set выбранных категорий для фильтрации */
  selectedCategories: Set<string>;
  /** Set выбранных разделов для фильтрации */
  selectedSections: Set<string>;
  
  /** Set выбранных типов привычек */
  selectedTypes: Set<HabitType>;
  
  /** Развёрнута ли секция категорий в UI */
  isCategoryExpanded: boolean;
  /** Развёрнута ли секция разделов в UI */
  isSectionExpanded: boolean;
  /** Развёрнута ли секция типов в UI */
  isTypeExpanded: boolean;
}

/**
 * Результат работы фильтра
 */
export interface HabitsFilterResult {
  /** Отфильтрованный массив привычек */
  filteredHabits: Habit[];
  /** Количество активных фильтров */
  activeFiltersCount: number;
  /** Есть ли активные фильтры */
  hasActiveFilters: boolean;
}

/**
 * Действия для управления фильтрами
 */
export interface HabitsFilterActions {
  /** Переключить фильтр "без категории" */
  toggleUncategorized: () => void;
  /** Переключить фильтр по конкретной категории */
  toggleCategory: (categoryName: string) => void;
  /** Переключить фильтр по конкретному разделу */
  toggleSection: (sectionName: string) => void;
  /** Переключить фильтр по типу привычки */
  toggleType: (type: HabitType) => void;
  /** Сбросить все фильтры к дефолтным значениям */
  clearAllFilters: () => void;
  /** Переключить развёрнутость секции категорий */
  toggleCategoryExpanded: () => void;
  /** Переключить развёрнутость секции разделов */
  toggleSectionExpanded: () => void;
  /** Переключить развёрнутость секции типов */
  toggleTypeExpanded: () => void;
}

/**
 * Конфигурация фильтра для кастомизации поведения
 */
export interface HabitsFilterConfig {
  /** Начальное состояние фильтров (partial) */
  initialState?: Partial<HabitsFilterState>;
  /** Включить фильтрацию по категориям */
  enableCategoryFilter?: boolean;
  /** Включить фильтрацию по разделам */
  enableSectionFilter?: boolean;
  /** Включить фильтрацию по типам */
  enableTypeFilter?: boolean;
  /** Включить фильтрацию "без категории" */
  enableUncategorizedFilter?: boolean;
}