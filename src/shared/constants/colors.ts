/**
 * Цветовые константы приложения
 * 
 * Использует систему COLOR_VARIANTS - названия цветов для CSS переменных.
 * Каждый цвет имеет соответствующие CSS переменные в globals.css.
 * 
 * @module shared/constants/colors
 * @updated 29 ноября 2025 - удалена legacy система TAG_COLORS
 */

/**
 * Доступные варианты цветов для новой системы с CSS переменными
 * 
 * Используется в:
 * - ColorPicker (сетка выбора цвета)
 * - TagPicker (отображение цветных тегов)
 * 
 * Каждый цвет соответствует CSS переменным:
 * - --palette-{color}-bg (фон)
 * - --palette-{color}-text (текст)
 * - --palette-{color}-border (граница)
 * 
 * @example
 * ```typescript
 * // В ColorPicker
 * {COLOR_VARIANTS.map(color => (
 *   <button className={`bg-[var(--palette-${color}-bg)]`} />
 * ))}
 * ```
 */
export const COLOR_VARIANTS = [
  'gray', 'zinc', 'stone',
  'red', 'rose', 'pink',
  'orange', 'amber', 'yellow',
  'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet',
  'purple', 'fuchsia'
] as const;

/**
 * TypeScript тип для цветовых вариантов
 * 
 * @example
 * ```typescript
 * const myColor: ColorVariant = 'blue'; // ✅ OK
 * const badColor: ColorVariant = 'brown'; // ❌ Ошибка компиляции
 * ```
 */
export type ColorVariant = typeof COLOR_VARIANTS[number];
