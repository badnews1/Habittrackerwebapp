/**
 * Утилиты для работы с тегами привычек
 * 
 * @module modules/habit-tracker/features/tags/utils/tagHelpers
 * @created 23 ноября 2025 (миграция с categories)
 * @updated 23 ноября 2025 (миграция CATEGORY_COLORS → TAG_COLORS)
 */

import { TAG_COLORS } from '@/shared/constants/colors';
import type { Tag } from '../types';

/**
 * Миграция legacy тегов (строки) в новый формат (объекты с цветами)
 * 
 * Используется для обратной совместимости со старым форматом данных,
 * когда теги были просто массивом строк без цветовой информации.
 * 
 * @param tags Массив legacy тегов (строки) или новых тегов (объекты)
 * @returns Массив тегов в новом формате с назначенными цветами
 * 
 * @example
 * ```typescript
 * // Legacy формат
 * const oldTags = ['Здоровье', 'Спорт', 'Питание'];
 * const newTags = migrateLegacyTags(oldTags);
 * // => [
 * //   { name: 'Здоровье', color: 'bg-gray-200 text-gray-800 border-gray-300' },
 * //   { name: 'Спорт', color: 'bg-red-200 text-red-800 border-red-300' },
 * //   { name: 'Питание', color: 'bg-orange-200 text-orange-800 border-orange-300' }
 * // ]
 * ```
 */
export const migrateLegacyTags = (tags: (string | Tag)[]): Tag[] => {
  // Если теги уже в новом формате (объекты), вернуть как есть
  if (tags.length > 0 && typeof tags[0] === 'object') {
    return tags as Tag[];
  }

  // Миграция из строк в объекты с назначением цветов
  return (tags as string[]).map((name, index) => ({
    name,
    color: TAG_COLORS[index % TAG_COLORS.length],
  }));
};

/**
 * Получить цвет тега по имени
 * 
 * @param tags Массив всех тегов
 * @param tagName Имя искомого тега
 * @returns Цвет тега или дефолтный серый цвет, если тег не найден
 * 
 * @example
 * ```typescript
 * const color = getTagColor(tags, 'Здоровье');
 * // => 'bg-green-200 text-green-800 border-green-300'
 * ```
 */
export const getTagColor = (tags: Tag[], tagName: string): string => {
  const tag = tags.find(t => t.name === tagName);
  return tag?.color || TAG_COLORS[0];
};