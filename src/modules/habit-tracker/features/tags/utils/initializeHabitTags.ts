/**
 * Утилита инициализации тегов привычек
 * 
 * @module modules/habit-tracker/features/tags/utils/initializeHabitTags
 * @created 23 ноября 2025 (миграция с categories)
 * @updated 23 ноября 2025 (используем TAG_COLORS для автоматической синхронизации)
 */

import { Tag } from '../types';
import { migrateLegacyTags } from './tagHelpers';
import { initializeCategories } from '@/shared/utils/categories';
import { categoryLogger } from '@/shared/utils/logger';
import { TAG_COLORS } from '@/shared/constants/colors';

/**
 * Дефолтные теги привычек с предустановленными цветами
 * Цвета берутся из TAG_COLORS по индексам для автоматической синхронизации
 * Цвета подобраны так, чтобы максимально отличаться друг от друга
 * 
 * Индексы TAG_COLORS: emerald(11), indigo(16), purple(18), orange(6), lime(9), 
 *                      sky(14), fuchsia(19), teal(12), rose(4), amber(7), stone(2)
 */
const DEFAULT_HABIT_TAGS: Tag[] = [
  { name: 'Здоровье', color: TAG_COLORS[11] },      // emerald
  { name: 'Учеба', color: TAG_COLORS[16] },         // indigo
  { name: 'Работа', color: TAG_COLORS[18] },        // purple
  { name: 'Спорт', color: TAG_COLORS[6] },          // orange
  { name: 'Питание', color: TAG_COLORS[9] },        // lime
  { name: 'Сон', color: TAG_COLORS[14] },           // sky
  { name: 'Творчество', color: TAG_COLORS[19] },    // fuchsia
  { name: 'Саморазвитие', color: TAG_COLORS[12] },  // teal
  { name: 'Отношения', color: TAG_COLORS[4] },      // rose
  { name: 'Финансы', color: TAG_COLORS[7] },        // amber
  { name: 'Дом', color: TAG_COLORS[2] },            // stone
];

/**
 * Инициализация тегов привычек
 * 
 * Загружает теги из localStorage ('tags' или legacy 'categories') 
 * или возвращает дефолтные значения.
 * 
 * @returns Массив тегов привычек
 * 
 * @example
 * ```typescript
 * const tags = initializeHabitTags();
 * ```
 */
export function initializeHabitTags(): Tag[] {
  // Пытаемся загрузить из нового ключа 'tags'
  const tagsResult = initializeCategories({
    storageKey: 'tags',
    defaultCategories: DEFAULT_HABIT_TAGS,
    migrationFn: migrateLegacyTags,
    logger: categoryLogger,
  });
  
  // Если нет данных в 'tags', проверяем legacy ключ 'categories' для миграции
  if (tagsResult.length === DEFAULT_HABIT_TAGS.length) {
    try {
      const legacyData = localStorage.getItem('categories');
      if (legacyData) {
        const parsed = JSON.parse(legacyData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          categoryLogger.info('🔄 Мигрируем categories → tags');
          const migrated = migrateLegacyTags(parsed);
          const deduplicated = deduplicateTags(migrated);
          // Сохраняем в новый ключ очищенные данные
          localStorage.setItem('tags', JSON.stringify(deduplicated));
          return deduplicated;
        }
      }
    } catch (error) {
      categoryLogger.error('❌ Ошибка миграции categories → tags', error);
    }
  }
  
  // Дедупликация тегов перед возвратом
  const deduplicated = deduplicateTags(tagsResult);
  
  // Если были дубликаты, сохраняем очищенные данные обратно
  if (deduplicated.length !== tagsResult.length) {
    try {
      localStorage.setItem('tags', JSON.stringify(deduplicated));
      categoryLogger.info('✅ Сохранены очищенные от дубликатов теги');
    } catch (error) {
      categoryLogger.error('❌ Ошибка сохранения очищенных тегов', error);
    }
  }
  
  return deduplicated;
}

/**
 * Удаление дублирующихся тегов
 * Сохраняет первое вхождение каждого тега (case-insensitive)
 * 
 * @param tags Массив тегов
 * @returns Массив уникальных тегов
 */
function deduplicateTags(tags: Tag[]): Tag[] {
  const seen = new Set<string>();
  const result: Tag[] = [];
  
  for (const tag of tags) {
    const lowerName = tag.name.toLowerCase();
    if (!seen.has(lowerName)) {
      seen.add(lowerName);
      result.push(tag);
    } else {
      categoryLogger.warn('🔄 Удалён дублирующийся тег', { name: tag.name });
    }
  }
  
  return result;
}