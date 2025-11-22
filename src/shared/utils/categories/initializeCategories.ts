/**
 * Generic утилита инициализации категорий
 * 
 * Универсальная функция для загрузки категорий из localStorage
 * или инициализации дефолтными значениями.
 * 
 * @module shared/utils/categories
 * @created 22 ноября 2025
 */

/**
 * Базовый интерфейс категории
 */
export interface BaseCategory {
  name: string;
  color: string;
}

/**
 * Функция миграции legacy формата категорий
 */
export type MigrationFunction<T extends BaseCategory> = (data: any) => T[];

/**
 * Опции инициализации категорий
 */
export interface InitializeCategoriesOptions<T extends BaseCategory> {
  /** Ключ localStorage для хранения */
  storageKey: string;
  /** Дефолтные категории */
  defaultCategories: T[];
  /** Функция миграции legacy формата (опционально) */
  migrationFn?: MigrationFunction<T>;
  /** Логгер для отладки (опционально) */
  logger?: {
    info: (message: string, data?: any) => void;
    error: (message: string, error?: any) => void;
    debug: (message: string, data?: any) => void;
  };
}

/**
 * Generic функция инициализации категорий
 * 
 * Загружает категории из localStorage или возвращает дефолтные значения.
 * Поддерживает миграцию из legacy форматов.
 * 
 * @template T - Тип категории, расширяющий BaseCategory
 * @param options - Опции инициализации
 * @returns Массив категорий
 * 
 * @example
 * ```typescript
 * // В модуле привычек
 * const habitCategories = initializeCategories({
 *   storageKey: 'habit_categories',
 *   defaultCategories: [
 *     { name: 'Здоровье', color: 'bg-blue-500' },
 *     { name: 'Спорт', color: 'bg-green-500' },
 *   ],
 *   migrationFn: migrateLegacyHabitCategories,
 *   logger: categoryLogger,
 * });
 * ```
 */
export function initializeCategories<T extends BaseCategory>(
  options: InitializeCategoriesOptions<T>
): T[] {
  const { storageKey, defaultCategories, migrationFn, logger } = options;

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Миграция если функция передана
        const migrated = migrationFn ? migrationFn(parsed) : parsed;
        
        if (logger) {
          logger.info(`Loaded categories from localStorage`, { 
            key: storageKey,
            count: migrated.length 
          });
        }
        
        return migrated;
      } catch (e) {
        if (logger) {
          logger.error(`Error loading categories from localStorage`, e);
        }
      }
    }
  }

  // Возвращаем дефолтные категории
  if (logger) {
    logger.debug(`Initialized default categories`, { 
      key: storageKey,
      count: defaultCategories.length 
    });
  }
  
  return defaultCategories;
}
