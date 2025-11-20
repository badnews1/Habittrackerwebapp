import { Category, migrateLegacyCategories } from '../types/category';
import { categoryLogger } from './logger';

export const initializeCategories = (): Category[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrated = migrateLegacyCategories(parsed);
        categoryLogger.info('Loaded categories from localStorage', { count: migrated.length });
        return migrated;
      } catch (e) {
        categoryLogger.error('Error loading categories', e);
      }
    }
  }
  // Return default categories
  const defaultCategories = migrateLegacyCategories([
    'Здоровье', 'Учеба', 'Работа', 'Спорт', 'Питание', 
    'Сон', 'Творчество', 'Саморазвитие', 'Отношения', 'Финансы', 'Дом'
  ]);
  categoryLogger.debug('Initialized default categories', { count: defaultCategories.length });
  return defaultCategories;
};