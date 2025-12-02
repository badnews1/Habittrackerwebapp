/**
 * Централизованный экспорт всех констант
 * 
 * Этот файл позволяет импортировать все константы из одного места:
 * ```typescript
 * import { COLOR_VARIANTS, TEXT_LENGTH_LIMITS } from '@/shared/constants';
 * 
 * // Для типов цветов:
 * import type { ColorVariant } from '@/shared/constants/colors';
 * ```
 * 
 * Последнее обновление: 1 декабря 2025 - удалён styles.ts (стили перенесены в компоненты)
 */

// Экспортируем все константы цветов
export * from './colors';

// Экспортируем все правила валидации
export * from './validation';

// Экспортируем иконки
export * from './icons';

// Экспортируем единицы измерения (реэкспорт из habit-tracker модуля)
export * from './units';