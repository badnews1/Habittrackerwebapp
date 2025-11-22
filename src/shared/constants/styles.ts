/**
 * 🎨 UNIFIED STYLE CONSTANTS
 * Централизованное хранилище всех повторяющихся стилей приложения
 * Последнее обновление: 21 ноября 2025 (миграция в /shared/)
 */

// ============================================
// 🔲 MODAL STYLES (Модальные окна)
// ============================================

export const MODAL_STYLES = {
  // Backdrop - полупрозрачный фон за модальным окном
  backdrop: 'fixed inset-0 bg-white/40 backdrop-blur-[2px] z-0',
  
  // Content - само модальное окно (должен быть ПОВЕРХ backdrop)
  content: 'bg-white rounded-[20px] shadow-2xl relative z-10',
  
  // Header модального окна
  header: 'flex items-center justify-between p-6 border-b border-gray-200',
  
  // Footer модального окна
  footer: 'p-6 border-t border-gray-200',
  
  // Центрирование модального окна
  center: 'fixed inset-0 flex items-center justify-center',
} as const;

// ============================================
// 📐 ROUNDED (Скругление углов)
// ============================================

export const ROUNDED = {
  // Маленькое скругление для кнопок, input, маленьких карточек
  small: 'rounded-xl',          // 12px
  
  // Среднее скругление для модальных окон
  medium: 'rounded-[20px]',     // 20px (Jony Ive стиль)
  
  // Большое скругление для контейнеров, больших карточек
  large: 'rounded-2xl',         // 16px
  
  // Круглое (для аватаров, иконок)
  full: 'rounded-full',
} as const;

// ============================================
// 🎨 COLORS (Цвета)
// ============================================

export const COLORS = {
  // Backgrounds
  bg: {
    white: 'bg-white',
    gray50: 'bg-gray-50',         // Фон карточек, контейнеров
    gray100: 'bg-gray-100',
    gray900: 'bg-gray-900',       // Темный фон (для чекбоксов)
  },
  
  // Borders
  border: {
    gray100: 'border-gray-100',   // Легкие разделители (карточки)
    gray200: 'border-gray-200',   // Основные границы (input, buttons)
    gray300: 'border-gray-300',   // Hover состояния
    gray400: 'border-gray-400',   // Focus состояния
    gray900: 'border-gray-900',   // Активные границы
  },
  
  // Text colors
  text: {
    gray900: 'text-gray-900',     // Основной текст
    gray700: 'text-gray-700',     // Вторичный текст
    gray500: 'text-gray-500',     // Placeholder, неактивный текст
    gray400: 'text-gray-400',     // Disabled текст
    white: 'text-white',
  },
} as const;

// ============================================
// 📦 CONTAINERS (Контейнеры/Карточки)
// ============================================

export const CONTAINER_STYLES = {
  // Стандартная карточка (календарь, статистика)
  card: 'bg-gray-50 rounded-2xl border border-gray-100 p-4',
  
  // Карточка привычки в списке
  habitCard: 'bg-white border border-gray-200 rounded-xl',
  
  // Панель списка привычек
  panel: 'bg-gray-50 rounded-2xl border border-gray-100',
} as const;

// ============================================
// 🔘 BUTTON STYLES (Стили кнопок)
// ============================================

export const BUTTON_STYLES = {
  // Base стили для всех кнопок
  base: 'rounded-xl transition-all',
  
  // Hover состояния
  hover: {
    border: 'hover:border-gray-300',
    text: 'hover:text-gray-900',
    bg: 'hover:bg-gray-100',
  },
  
  // Focus состояния
  focus: {
    border: 'focus:border-gray-400',
    outline: 'focus:outline-none',
  },
  
  // Disabled состояния
  disabled: 'disabled:opacity-30 disabled:cursor-not-allowed',
} as const;

// ============================================
// 📝 INPUT STYLES (Стили полей ввода)
// ============================================

export const INPUT_STYLES = {
  // Базовые стили для всех input (используются напрямую редко)
  base: 'focus:outline-none transition-colors',
  
  // ✅ Стандартный input - используется в большинстве форм
  // Применение: HabitBasicInfoStep, HabitMeasurableStep, HabitMeasurableSettingsSection
  standard: 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm placeholder:text-gray-400',
  
  // ✅ Компактный input - для встроенных полей
  // Применение: HabitNameEditor, CategoryPicker
  compact: 'w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm placeholder:text-gray-400',
  
  // ✅ Большой числовой input - для модальных окон с числами
  // Применение: NumericInputModal
  numericLarge: 'w-full px-4 py-3 text-center text-2xl border-2 border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-colors',
  
  // ✅ Утилитарный класс для удаления стрелок у input[type="number"]
  // Применение: NumericInputModal, MonthlyStats, StrengthChart
  noSpinButtons: '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
} as const;

// ============================================
// 📏 Z-INDEX (Слои наложения)
// ============================================

export const Z_INDEX = {
  // Базовый слой модальных окон
  modal: 'z-50',
  
  // Важные диалоги (ConfirmDialog, AddHabitModal)
  dialog: 'z-[60]',
  
  // Вложенные модальные окна (FrequencyModal внутри AddHabitModal)
  nested: 'z-[70]',
  
  // Dev tools (самый верхний)
  dev: 'z-[100]',
} as const;

// ============================================
// 🎭 DIVIDERS (Разделители)
// ============================================

export const DIVIDER_STYLES = {
  // Легкий разделитель (внутри карточек)
  light: 'border-t border-gray-100',
  
  // Основной разделитель (между секциями)
  default: 'border-t border-gray-200',
} as const;

// ============================================
// ✨ TRANSITIONS (Переходы)
// ============================================

export const TRANSITIONS = {
  // Базовая анимация (цвет, фон, границы)
  default: 'transition-all',
  
  // Только цвета
  colors: 'transition-colors',
  
  // Трансформации (scale, translate)
  transform: 'transition-transform',
} as const;

// ============================================
// 🎯 COMPOSITE STYLES (Композитные стили)
// ============================================

/**
 * Готовые комбинации стилей для частых сценариев
 */
export const COMPOSITE = {
  // Полный стиль модального окна с backdrop
  modalWithBackdrop: `${MODAL_STYLES.backdrop} ${MODAL_STYLES.center}`,
  
  // Контент модального окна с отступами
  modalContent: `${MODAL_STYLES.content} p-6`,
  
  // Интерактивная кнопка с hover эффектами
  interactiveButton: `${BUTTON_STYLES.base} ${BUTTON_STYLES.hover.border} ${BUTTON_STYLES.hover.text} ${BUTTON_STYLES.disabled}`,
  
  // Стандартное поле ввода
  standardInput: `${INPUT_STYLES.standard} ${INPUT_STYLES.numeric}`,
} as const;

// ============================================
// 🔧 UTILITY FUNCTIONS (Вспомогательные функции)
// ============================================

/**
 * Создает className для модального окна с z-index
 * @param level - уровень модального окна: 'modal' | 'dialog' | 'nested'
 */
export function getModalClasses(level: 'modal' | 'dialog' | 'nested' = 'modal'): string {
  return `${MODAL_STYLES.modalWithBackdrop} ${Z_INDEX[level]}`;
}

/**
 * Создает className для контента модального окна
 * @param maxWidth - максимальная ширина: 
 *   - 'main' - для модальных окон первого уровня (576px / xl)
 *   - 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' - стандартные размеры
 */
export function getModalContentClasses(maxWidth: 'main' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' = 'md'): string {
  // Полный маппинг размеров для правильной работы Tailwind JIT
  const sizeClasses = {
    main: 'max-w-xl',   // 576px - единый размер для всех модалок первого уровня
    sm: 'max-w-sm',     // 384px
    md: 'max-w-md',     // 448px
    lg: 'max-w-lg',     // 512px
    xl: 'max-w-xl',     // 576px
    '2xl': 'max-w-2xl', // 672px
    '4xl': 'max-w-4xl', // 896px
    '6xl': 'max-w-6xl', // 1152px
  };
  
  return `${MODAL_STYLES.content} ${sizeClasses[maxWidth]} w-full mx-4`;
}

/**
 * Создает className для кнопки с заданным вариантом
 * @param variant - вариант кнопки: 'primary' | 'secondary'
 */
export function getButtonClasses(variant: 'primary' | 'secondary' = 'primary'): string {
  const base = `${BUTTON_STYLES.base} ${TRANSITIONS.default}`;
  
  if (variant === 'primary') {
    return `${base} bg-gray-900 text-white hover:bg-gray-800`;
  }
  
  return `${base} bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900`;
}
