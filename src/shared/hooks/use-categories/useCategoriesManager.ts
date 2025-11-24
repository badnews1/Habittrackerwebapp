/**
 * Generic хук для управления категориями
 * 
 * Универсальная логика управления категориями для любого модуля.
 * 
 * @module shared/hooks/use-categories
 * @created 22 ноября 2025
 */

import { useState, useCallback } from 'react';

/**
 * Базовый интерфейс категории
 */
export interface BaseCategory {
  name: string;
  color: string;
}

/**
 * Интерфейс CRUD операций для категорий
 */
export interface CategoryActions<T extends BaseCategory> {
  addCategory: (category: Omit<T, 'id'>) => void;
  deleteCategory: (id: string) => void;
  renameCategory: (id: string, newName: string) => void;
  recolorCategory: (id: string, newColor: string) => void;
}

/**
 * Generic хук для управления категориями
 * 
 * Инкапсулирует:
 * - Локальное состояние категорий
 * - CRUD операции для категорий
 * - Валидацию и дедупликацию
 * - Синхронизацию с элементами при удалении категории
 * 
 * @template T - Тип категории, расширяющий BaseCategory
 * @param initialCategories - Исходный массив категорий
 * @param defaultColor - Цвет по умолчанию для новых категорий
 * @param onCategoryDelete - Callback для синхронизации с элементами при удалении (опционально)
 * 
 * @example
 * ```typescript
 * // В модуле привычек
 * const manager = useCategoriesManager(
 *   categories,
 *   TAG_COLORS[0],
 *   (categoryName) => {
 *     // Очистить category у всех привычек
 *     habits.forEach(habit => {
 *       if (habit.category === categoryName) {
 *         updateHabit(habit.id, { category: '' });
 *       }
 *     });
 *   }
 * );
 * ```
 */
export function useCategoriesManager<T extends BaseCategory>(
  initialCategories: T[],
  defaultColor: string,
  onCategoryDelete?: (categoryName: string) => void
) {
  // Локальное состояние категорий
  const [localCategories, setLocalCategories] = useState<T[]>([...initialCategories]);

  /**
   * Добавление новой категории
   * Проверяет дубликаты и назначает дефолтный цвет
   */
  const handleAddCategory = useCallback((category: string) => {
    setLocalCategories(prev => {
      // Проверка на дубликаты (case-insensitive)
      if (prev.some(cat => cat.name.toLowerCase() === category.toLowerCase())) {
        return prev;
      }
      // Добавление с дефолтным цветом
      return [...prev, { name: category, color: defaultColor } as T];
    });
  }, [defaultColor]);

  /**
   * Удаление категории
   * Вызывает callback для синхронизации с элементами (очистка category у элементов)
   */
  const handleDeleteCategory = useCallback((categoryToDelete: string) => {
    setLocalCategories(prev => prev.filter(cat => cat.name !== categoryToDelete));
    
    // Синхронизация с элементами (если callback передан)
    if (onCategoryDelete) {
      onCategoryDelete(categoryToDelete);
    }
  }, [onCategoryDelete]);

  /**
   * Обновление цвета категории
   */
  const handleUpdateCategoryColor = useCallback((categoryName: string, color: string) => {
    setLocalCategories(prev => prev.map(cat =>
      cat.name === categoryName ? { ...cat, color } as T : cat
    ));
  }, []);

  /**
   * Переименование категории
   */
  const handleRenameCategory = useCallback((oldName: string, newName: string) => {
    setLocalCategories(prev => {
      // Проверка на дубликаты (case-insensitive)
      if (prev.some(cat => cat.name !== oldName && cat.name.toLowerCase() === newName.toLowerCase())) {
        return prev;
      }
      return prev.map(cat =>
        cat.name === oldName ? { ...cat, name: newName } as T : cat
      );
    });
  }, []);

  return {
    localCategories,
    setLocalCategories,
    handleAddCategory,
    handleDeleteCategory,
    handleUpdateCategoryColor,
    handleRenameCategory,
  };
}