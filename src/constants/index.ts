/**
 * Централизованный экспорт всех констант приложения
 * 
 * Этот файл позволяет импортировать все константы из одного места:
 * ```typescript
 * import { CATEGORY_COLORS, PAGINATION, TEXT_LENGTH_LIMITS } from '../constants';
 * 
 * // Для модальных окон импортируйте напрямую из styles.ts:
 * import { Z_INDEX, MODAL_STYLES, getModalClasses } from '../constants/styles';
 * ```
 * 
 * Последнее обновление: 19 ноября 2025 (консолидация констант)
 */

// Экспортируем все константы цветов
export * from './colors';

// Экспортируем все UI константы
export * from './ui';

// Экспортируем все правила валидации
export * from './validation';

// Экспортируем иконки (уже существующие)
export * from './icons';

// Экспортируем единицы измерения (уже существующие)
export * from './units';

// Экспортируем константы силы привычки (EMA)
export * from './strength';

// Экспортируем централизованные стили
export * from './styles';