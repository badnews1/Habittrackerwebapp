/**
 * Утилиты для фильтрации привычек
 * 
 * @description
 * Функции для работы с привычками в контексте фильтрации:
 * - Извлечение уникальных значений (теги, секции)
 * - Подсчёт количества привычек по различным критериям
 * 
 * @module entities/habit/lib
 * @created 29 ноября 2025
 */

import type { Habit, HabitType } from '../model/types';

/**
 * Получить уникальные секции из массива привычек
 * 
 * @param habits - массив привычек
 * @returns отсортированный массив уникальных секций
 */
export function getUniqueSections(habits: Habit[]): string[] {
  const sectionsSet = new Set<string>();
  
  habits.forEach((habit) => {
    sectionsSet.add(habit.section || 'other');
  });
  
  return Array.from(sectionsSet).sort();
}

/**
 * Получить уникальные теги из массива привычек
 * 
 * @param habits - массив привычек
 * @returns отсортированный массив уникальных тегов
 */
export function getUniqueTags(habits: Habit[]): string[] {
  const tagsSet = new Set<string>();
  
  habits.forEach((habit) => {
    if (habit.tags && habit.tags.length > 0) {
      habit.tags.forEach((tag) => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Подсчитать количество привычек для каждого тега
 * 
 * @param habits - массив привычек
 * @returns Map с количеством привычек для каждого тега
 */
export function countByTag(habits: Habit[]): Map<string, number> {
  const tagCounts = new Map<string, number>();
  
  habits.forEach((habit) => {
    if (habit.tags && habit.tags.length > 0) {
      habit.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });
  
  return tagCounts;
}

/**
 * Подсчитать количество привычек для каждой секции
 * 
 * @param habits - массив привычек
 * @returns Map с количеством привычек для каждой секции
 */
export function countBySection(habits: Habit[]): Map<string, number> {
  const sectionCounts = new Map<string, number>();
  
  habits.forEach((habit) => {
    const section = habit.section || 'other';
    sectionCounts.set(section, (sectionCounts.get(section) || 0) + 1);
  });
  
  return sectionCounts;
}

/**
 * Подсчитать количество привычек по типам
 * 
 * @param habits - массив привычек
 * @returns объект с количеством binary и measurable привычек
 */
export function countByType(habits: Habit[]): Record<HabitType, number> {
  let binaryCount = 0;
  let measurableCount = 0;
  
  habits.forEach((habit) => {
    if (habit.type === 'binary') {
      binaryCount++;
    } else if (habit.type === 'measurable') {
      measurableCount++;
    }
  });
  
  return {
    binary: binaryCount,
    measurable: measurableCount,
  };
}

/**
 * Подсчитать количество привычек без категории (без тегов)
 * 
 * @param habits - массив привычек
 * @returns количество привычек без тегов
 */
export function countUncategorized(habits: Habit[]): number {
  return habits.filter((habit) => !habit.tags || habit.tags.length === 0).length;
}

/**
 * Проверить, есть ли привычки без категории
 * 
 * @param habits - массив привычек
 * @returns true если есть хотя бы одна привычка без тегов
 */
export function hasUncategorizedHabits(habits: Habit[]): boolean {
  return habits.some((habit) => !habit.tags || habit.tags.length === 0);
}
