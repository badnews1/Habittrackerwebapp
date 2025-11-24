/**
 * Централизованный экспорт всех констант
 * 
 * Этот файл позволяет импортировать все константы из одного места:
 * ```typescript
 * import { TAG_COLORS, PAGINATION, TEXT_LENGTH_LIMITS } from '@/shared/constants';
 * 
 * // Для модальных окон импортируйте напрямую из styles.ts:
 * import { MODAL_STYLES, Z_INDEX } from '@/shared/constants/styles';
 * ```
 * 
 * Последнее обновление: 21 ноября 2025 (миграция в /shared/)
 */

// Экспортируем все константы цветов
export * from './colors';

// Экспортируем все UI константы
export * from './ui';

// Экспортируем все правила валидации
export * from './validation';

// Экспортируем иконки
export * from './icons';

// Экспортируем единицы измерения
export * from './units';

// Экспортируем константы силы привычки (EMA)
export * from './strength';

// Экспортируем централизованные стили
export * from './styles';