/**
 * Вспомогательные функции для работы с категориями
 * 
 * @module modules/habit-tracker/features/categories/utils
 * @created 22 ноября 2025
 */

import { CATEGORY_COLORS } from '@/shared/constants/colors';
import type { Category } from '../types';

/**
 * Мигрирует категории из старого формата (string[]) в новый формат (Category[])
 * Также обновляет устаревшие цветовые схемы на актуальные
 * 
 * @param categories - Массив категорий в старом или новом формате
 * @returns Массив категорий в новом формате с обновлёнными цветами
 * 
 * @example
 * // Миграция из старого формата
 * const oldCategories = ['Здоровье', 'Работа'];
 * const newCategories = migrateLegacyCategories(oldCategories);
 * // => [{ name: 'Здоровье', color: '...' }, { name: 'Работа', color: '...' }]
 */
export const migrateLegacyCategories = (categories: any[]): Category[] => {
  if (categories.length === 0) return [];
  
  // Проверяем, уже ли новый формат
  if (typeof categories[0] === 'object' && categories[0] !== null && 'color' in categories[0]) {
    // Мигрируем старые значения цветов на новые
    return (categories as Category[]).map((cat) => {
      // Маппинг старых цветовых схем на новые
      const colorMap: { [key: string]: string } = {
        'bg-gray-100 text-gray-700 border-gray-200': 'bg-gray-200 text-gray-800 border-gray-300',
        'bg-red-100 text-red-700 border-red-200': 'bg-red-200 text-red-800 border-red-300',
        'bg-orange-100 text-orange-700 border-orange-200': 'bg-orange-200 text-orange-800 border-orange-300',
        'bg-yellow-100 text-yellow-700 border-yellow-200': 'bg-yellow-200 text-yellow-800 border-yellow-300',
        'bg-green-100 text-green-700 border-green-200': 'bg-green-200 text-green-800 border-green-300',
        'bg-teal-100 text-teal-700 border-teal-200': 'bg-teal-200 text-teal-800 border-teal-300',
        'bg-blue-100 text-blue-700 border-blue-200': 'bg-blue-200 text-blue-800 border-blue-300',
        'bg-indigo-100 text-indigo-700 border-indigo-200': 'bg-indigo-200 text-indigo-800 border-indigo-300',
        'bg-purple-100 text-purple-700 border-purple-200': 'bg-purple-200 text-purple-800 border-purple-300',
        'bg-pink-100 text-pink-700 border-pink-200': 'bg-pink-200 text-pink-800 border-pink-300',
        // Мигрируем из слишком яркого уровня 400 обратно на 200
        'bg-gray-300 text-gray-800 border-gray-400': 'bg-gray-200 text-gray-800 border-gray-300',
        'bg-red-400 text-red-900 border-red-500': 'bg-red-200 text-red-800 border-red-300',
        'bg-orange-400 text-orange-900 border-orange-500': 'bg-orange-200 text-orange-800 border-orange-300',
        'bg-yellow-400 text-yellow-900 border-yellow-500': 'bg-yellow-200 text-yellow-800 border-yellow-300',
        'bg-green-400 text-green-900 border-green-500': 'bg-green-200 text-green-800 border-green-300',
        'bg-teal-400 text-teal-900 border-teal-500': 'bg-teal-200 text-teal-800 border-teal-300',
        'bg-blue-400 text-blue-900 border-blue-500': 'bg-blue-200 text-blue-800 border-blue-300',
        'bg-indigo-400 text-indigo-900 border-indigo-500': 'bg-indigo-200 text-indigo-800 border-indigo-300',
        'bg-purple-400 text-purple-900 border-purple-500': 'bg-purple-200 text-purple-800 border-purple-300',
        'bg-pink-400 text-pink-900 border-pink-500': 'bg-pink-200 text-pink-800 border-pink-300',
      };
      
      return {
        ...cat,
        color: colorMap[cat.color] || cat.color
      };
    });
  }
  
  // Мигрируем из старого формата - назначаем цвета на основе индекса
  return (categories as string[]).map((name, index) => ({
    name,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));
};

/**
 * Получает цветовую схему для указанной категории
 * 
 * @param categories - Массив всех категорий
 * @param categoryName - Название категории для поиска
 * @returns Строка с Tailwind CSS классами цвета или цвет по умолчанию
 * 
 * @example
 * const categories = [{ name: 'Здоровье', color: 'bg-green-200...' }];
 * const color = getCategoryColor(categories, 'Здоровье');
 * // => 'bg-green-200 text-green-800 border-green-300'
 */
export const getCategoryColor = (categories: Category[], categoryName: string): string => {
  const category = categories.find(c => c.name === categoryName);
  return category?.color || CATEGORY_COLORS[0];
};
