import { useState, useCallback } from 'react';
import { Category, CATEGORY_COLORS } from '../types/category';

/**
 * Хук для управления категориями привычек
 * 
 * Инкапсулирует:
 * - Локальное состояние категорий
 * - CRUD операции для категорий
 * - Синхронизацию с привычками при удалении категории
 * 
 * Используется в:
 * - ManageHabitsModal
 * - AddHabitModal
 * 
 * @param initialCategories - Исходный массив категорий
 * @param onCategoryDelete - Callback для синхронизации с привычками при удалении категории (опционально)
 */
export const useCategoriesManager = (
  initialCategories: Category[],
  onCategoryDelete?: (categoryName: string) => void
) => {
  // Локальное состояние категорий
  const [localCategories, setLocalCategories] = useState<Category[]>([...initialCategories]);

  /**
   * Добавление новой категории
   * Проверяет дубликаты и назначает дефолтный цвет
   */
  const handleAddCategory = useCallback((category: string) => {
    setLocalCategories(prev => {
      // Проверка на дубликаты
      if (prev.some(cat => cat.name === category)) {
        return prev;
      }
      // Добавление с дефолтным цветом
      return [...prev, { name: category, color: CATEGORY_COLORS[0] }];
    });
  }, []);

  /**
   * Удаление категории
   * Вызывает callback для синхронизации с привычками (очистка category у привычек)
   */
  const handleDeleteCategory = useCallback((categoryToDelete: string) => {
    setLocalCategories(prev => prev.filter(cat => cat.name !== categoryToDelete));
    
    // Синхронизация с привычками (если callback передан)
    if (onCategoryDelete) {
      onCategoryDelete(categoryToDelete);
    }
  }, [onCategoryDelete]);

  /**
   * Обновление цвета категории
   */
  const handleUpdateCategoryColor = useCallback((categoryName: string, color: string) => {
    setLocalCategories(prev => prev.map(cat =>
      cat.name === categoryName ? { ...cat, color } : cat
    ));
  }, []);

  return {
    localCategories,
    setLocalCategories,
    handleAddCategory,
    handleDeleteCategory,
    handleUpdateCategoryColor,
  };
};
