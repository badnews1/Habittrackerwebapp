/**
 * Централизованное хранилище всех цветов приложения
 * 
 * Этот файл содержит:
 * - Цвета тегов (светлые bg-*-200/300/400 для фона)
 * - Маппинг светлых цветов в яркие для UI элементов (bg-*-500)
 * - Цвета статусов привычек
 * - Цвета графиков и индикаторов
 * - Цвета UI элементов
 * 
 * Последнее обновление: 23 ноября 2025 (изменение stone: bg-stone-400 → bg-stone-300)
 */

// ============================================================================
// ЦВЕТА ТЕГОВ
// ============================================================================

/**
 * Доступные цвета для тегов привычек
 * Используются светлые оттенки (bg-*-200/300/400) для фона тегов
 * Формат: 'bg-{color}-{shade} text-{color}-800 border-{color}-300'
 * 
 * 20 базовых цветов Tailwind (исключая neutral и slate)
 */
export const TAG_COLORS = [
  'bg-gray-200 text-gray-800 border-gray-300',       // Серый
  'bg-zinc-400 text-zinc-800 border-zinc-200',       // Цинковый
  'bg-stone-300 text-stone-800 border-stone-200',    // Каменный
  'bg-red-200 text-red-800 border-red-300',          // Красный
  'bg-rose-300 text-rose-800 border-rose-200',       // Розовая роза
  'bg-pink-200 text-pink-800 border-pink-300',       // Розовый
  'bg-orange-200 text-orange-800 border-orange-300', // Оранжевый
  'bg-amber-300 text-amber-800 border-amber-200',    // Янтарный
  'bg-yellow-200 text-yellow-800 border-yellow-300', // Жёлтый
  'bg-lime-200 text-lime-800 border-lime-300',       // Лаймовый
  'bg-green-200 text-green-800 border-green-300',    // Зелёный
  'bg-emerald-300 text-emerald-800 border-emerald-200', // Изумрудный
  'bg-teal-200 text-teal-800 border-teal-300',       // Бирюзовый
  'bg-cyan-300 text-cyan-800 border-cyan-200',       // Голубой
  'bg-sky-200 text-sky-800 border-sky-300',          // Небесный
  'bg-blue-300 text-blue-800 border-blue-200',       // Синий
  'bg-indigo-300 text-indigo-800 border-indigo-200', // Индиго
  'bg-violet-300 text-violet-800 border-violet-200', // Фиалковый
  'bg-purple-200 text-purple-800 border-purple-300', // Фиолетовый
  'bg-fuchsia-200 text-fuchsia-800 border-fuchsia-300', // Фуксия
] as const;

/**
 * Маппинг светлых пастельных цветов в более яркие для отображения в ColorPicker
 * 
 * Используется для преобразования цветов тегов (светлые пастельные для фона)
 * в яркие насыщенные цвета для отображения в пикере цветов.
 * 
 * @example
 * TAG_COLORS содержит: 'bg-blue-300 text-blue-900 border-blue-400' (светлый для тега)
 * COLOR_DISPLAY_MAP преобразует bg-blue-300 -> bg-blue-400 (яркий для пикера)
 */
export const COLOR_DISPLAY_MAP: Record<string, string> = {
  'bg-gray-200': 'bg-gray-400',
  'bg-zinc-400': 'bg-zinc-400',
  'bg-stone-300': 'bg-stone-400',
  'bg-red-200': 'bg-red-400',
  'bg-rose-300': 'bg-rose-400',
  'bg-pink-200': 'bg-pink-400',
  'bg-orange-200': 'bg-orange-400',
  'bg-amber-300': 'bg-amber-400',
  'bg-yellow-200': 'bg-yellow-400',
  'bg-lime-200': 'bg-lime-400',
  'bg-green-200': 'bg-green-400',
  'bg-emerald-300': 'bg-emerald-400',
  'bg-teal-200': 'bg-teal-400',
  'bg-cyan-300': 'bg-cyan-400',
  'bg-sky-200': 'bg-sky-400',
  'bg-blue-300': 'bg-blue-400',
  'bg-indigo-300': 'bg-indigo-400',
  'bg-violet-300': 'bg-violet-400',
  'bg-purple-200': 'bg-purple-400',
  'bg-fuchsia-200': 'bg-fuchsia-400',
} as const;

/**
 * Маппинг светлых цветов в русские названия
 * Используется для отображения понятных названий в UI (tooltip, aria-label)
 * 
 * Пример использования:
 * ```typescript
 * const lightColor = 'bg-blue-200 text-blue-800 border-blue-300';
 * const colorName = COLOR_NAME_MAP[lightColor]; // 'Синий'
 * ```
 */
export const COLOR_NAME_MAP: Record<string, string> = {
  'bg-gray-200 text-gray-800 border-gray-300': 'Серый',
  'bg-zinc-400 text-zinc-800 border-zinc-200': 'Цинковый',
  'bg-stone-300 text-stone-800 border-stone-200': 'Каменный',
  'bg-red-200 text-red-800 border-red-300': 'Красный',
  'bg-rose-300 text-rose-800 border-rose-200': 'Розовая роза',
  'bg-pink-200 text-pink-800 border-pink-300': 'Розовый',
  'bg-orange-200 text-orange-800 border-orange-300': 'Оранжевый',
  'bg-amber-300 text-amber-800 border-amber-200': 'Янтарный',
  'bg-yellow-200 text-yellow-800 border-yellow-300': 'Жёлтый',
  'bg-lime-200 text-lime-800 border-lime-300': 'Лаймовый',
  'bg-green-200 text-green-800 border-green-300': 'Зелёный',
  'bg-emerald-300 text-emerald-800 border-emerald-200': 'Изумрудный',
  'bg-teal-200 text-teal-800 border-teal-300': 'Бирюзовый',
  'bg-cyan-300 text-cyan-800 border-cyan-200': 'Голубой',
  'bg-sky-200 text-sky-800 border-sky-300': 'Небесный',
  'bg-blue-300 text-blue-800 border-blue-200': 'Синий',
  'bg-indigo-300 text-indigo-800 border-indigo-200': 'Индиго',
  'bg-violet-300 text-violet-800 border-violet-200': 'Фиалковый',
  'bg-purple-200 text-purple-800 border-purple-300': 'Фиолетовый',
  'bg-fuchsia-200 text-fuchsia-800 border-fuchsia-300': 'Фуксия',
} as const;

// ============================================================================
// ЦВЕТА СТАТУСОВ ПРИВЫЧЕК
// ============================================================================

/**
 * Цвета для различных состояний выполнения привычки
 */
export const HABIT_STATUS_COLORS = {
  /** Привычка выполнена */
  completed: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-100',
    border: 'border-green-500',
    text: 'text-green-700',
    hover: 'hover:bg-green-600',
  },
  
  /** Привычка не выполнена (пропущена) */
  incomplete: {
    bg: 'bg-gray-200',
    bgLight: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-500',
    hover: 'hover:bg-gray-300',
  },
  
  /** День заморожен */
  frozen: {
    bg: 'bg-blue-400',
    bgLight: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-700',
    hover: 'hover:bg-blue-500',
    icon: 'text-white',
  },
  
  /** Будущий день (недоступен) */
  future: {
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-gray-400',
  },
} as const;

// ============================================================================
// ЦВЕТА ГРАФИКОВ И ИНДИКАТОРОВ
// ============================================================================

/**
 * Цвета для графика силы привычки (EMA)
 */
export const STRENGTH_CHART_COLORS = {
  /** Линия графика */
  line: '#3b82f6', // blue-500
  
  /** Градиент заливки под графиком */
  gradient: {
    start: 'rgba(59, 130, 246, 0.2)', // blue-500 с прозрачностью
    end: 'rgba(59, 130, 246, 0.01)',
  },
  
  /** Сетка графика */
  grid: '#e5e7eb', // gray-200
  
  /** Текст осей */
  axis: '#6b7280', // gray-500
} as const;

/**
 * Пороговые значения силы привычки с соответствующими цветами
 */
export const STRENGTH_THRESHOLDS = {
  /** Слабая привычка (0-33) */
  weak: {
    min: 0,
    max: 33,
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
  },
  
  /** Средняя привычка (34-66) */
  medium: {
    min: 34,
    max: 66,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
  },
  
  /** Сильная привычка (67-100) */
  strong: {
    min: 67,
    max: 100,
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
  },
} as const;

/**
 * Цвета прогресс-баров
 */
export const PROGRESS_BAR_COLORS = {
  /** Прогресс выполнения */
  completion: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-100',
    text: 'text-green-700',
  },
  
  /** Прогресс силы привычки */
  strength: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-100',
    text: 'text-blue-700',
  },
  
  /** Фон прогресс-бара */
  background: 'bg-gray-200',
} as const;

// ============================================================================
// ЦВЕТА UI ЭЛЕМЕНТОВ
// ============================================================================

/**
 * Цвета кнопок
 */
export const BUTTON_COLORS = {
  /** Основная кнопка (primary) */
  primary: {
    bg: 'bg-gray-900',
    bgHover: 'hover:bg-gray-800',
    text: 'text-white',
    border: 'border-gray-900',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  
  /** Вторичная кнопка (secondary) */
  secondary: {
    bg: 'bg-white',
    bgHover: 'hover:bg-gray-50',
    text: 'text-gray-700',
    border: 'border border-gray-300',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  
  /** Опасная кнопка (danger) - для удаления */
  danger: {
    bg: 'bg-red-600',
    bgHover: 'hover:bg-red-700',
    text: 'text-white',
    border: 'border-red-600',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  
  /** Предупреждающая кнопка (warning) */
  warning: {
    bg: 'bg-orange-600',
    bgHover: 'hover:bg-orange-700',
    text: 'text-white',
    border: 'border-orange-600',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  
  /** Кнопка-призрак (ghost) - без фона */
  ghost: {
    bg: 'bg-transparent',
    bgHover: 'hover:bg-gray-100',
    text: 'text-gray-600',
    textHover: 'hover:text-gray-900',
    border: 'border-transparent',
  },
  
  /** Кнопка закрытия (close) */
  close: {
    bg: 'bg-transparent',
    bgHover: 'hover:bg-gray-100',
    text: 'text-gray-500',
    textHover: 'hover:text-gray-900',
    rounded: 'rounded-full',
  },
} as const;

/**
 * Цвета форм и инпутов
 */
export const INPUT_COLORS = {
  /** Базовые стили инпута */
  base: {
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-300',
    borderFocus: 'focus:border-gray-900',
    placeholder: 'placeholder:text-gray-400',
    disabled: 'disabled:bg-gray-100 disabled:text-gray-500',
  },
  
  /** Лейбл */
  label: {
    text: 'text-gray-500',
    size: 'text-xs',
  },
  
  /** Счётчик символов */
  counter: {
    text: 'text-gray-400',
    size: 'text-xs',
  },
  
  /** Сообщение об ошибке */
  error: {
    text: 'text-red-600',
    border: 'border-red-500',
    bg: 'bg-red-50',
  },
} as const;

/**
 * Цвета модальных окон
 */
export const MODAL_COLORS = {
  /** Оверлей фона */
  overlay: {
    bg: 'bg-black/20',
    backdrop: 'backdrop-blur-[2px]',
  },
  
  /** Контейнер модального окна */
  container: {
    bg: 'bg-white',
    border: 'border border-gray-200',
    shadow: 'shadow-2xl',
  },
  
  /** Заголовок */
  header: {
    text: 'text-gray-900',
    borderBottom: 'border-b border-gray-200',
  },
  
  /** Подзаголовок */
  subtitle: {
    text: 'text-gray-500',
    size: 'text-xs',
  },
  
  /** Футер */
  footer: {
    borderTop: 'border-t border-gray-200',
  },
} as const;

/**
 * Цвета границ
 */
export const BORDER_COLORS = {
  /** Светлая граница (по умолчанию) */
  light: 'border-gray-200',
  
  /** Средняя граница */
  medium: 'border-gray-300',
  
  /** Тёмная граница */
  dark: 'border-gray-400',
  
  /** Граница в фокусе */
  focus: 'border-gray-900',
  
  /** Граница при hover */
  hover: 'hover:border-gray-900',
  
  /** Пунктирная граница */
  dashed: 'border-dashed border-gray-300',
  dashedHover: 'hover:border-gray-400',
} as const;

/**
 * Цвета фона
 */
export const BACKGROUND_COLORS = {
  /** Белый фон */
  white: 'bg-white',
  
  /** Светло-серый (для секций) */
  gray50: 'bg-gray-50',
  gray100: 'bg-gray-100',
  gray200: 'bg-gray-200',
  
  /** При hover */
  hoverGray: 'hover:bg-gray-50',
  hoverGray100: 'hover:bg-gray-100',
  
  /** Прозрачный */
  transparent: 'bg-transparent',
} as const;

/**
 * Цвета текста
 */
export const TEXT_COLORS = {
  /** Оснвной текст */
  primary: 'text-gray-900',
  
  /** Вторичный текст */
  secondary: 'text-gray-700',
  
  /** Вспомогательный текст (подсказки, метки) */
  muted: 'text-gray-500',
  
  /** Неактивный текст */
  disabled: 'text-gray-400',
  
  /** Текст при hover */
  primaryHover: 'hover:text-gray-900',
  
  /** Цветной текст */
  success: 'text-green-700',
  danger: 'text-red-600',
  warning: 'text-orange-600',
  info: 'text-blue-600',
} as const;

/**
 * Цвета иконок
 */
export const ICON_COLORS = {
  /** Основной цвет иконок */
  default: 'text-gray-600',
  
  /** При hover */
  hover: 'hover:text-gray-900',
  
  /** Неактивная иконка */
  disabled: 'text-gray-300',
  
  /** Опасное действие (удаление) */
  danger: 'text-gray-400',
  dangerHover: 'hover:text-red-600',
  
  /** Белая иконка (на тёмном фоне) */
  white: 'text-white',
} as const;

// ============================================================================
// УТИЛИТНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Получить яркий цвет из светлого
 * @param lightColor - Светлый цвет (например, 'bg-blue-200')
 * @returns Яркий цвет (например, 'bg-blue-500') или исходный цвет
 */
export function getVibrantColor(lightColor: string): string {
  const baseColor = lightColor.split(' ')[0];
  return COLOR_DISPLAY_MAP[baseColor] || baseColor;
}

/**
 * Получить цвет силы привычки по значению
 * @param strength - Значение силы привычки (0-100)
 * @returns Объект с цветами для этого уровня силы
 */
export function getStrengthColor(strength: number) {
  if (strength <= STRENGTH_THRESHOLDS.weak.max) {
    return STRENGTH_THRESHOLDS.weak;
  } else if (strength <= STRENGTH_THRESHOLDS.medium.max) {
    return STRENGTH_THRESHOLDS.medium;
  } else {
    return STRENGTH_THRESHOLDS.strong;
  }
}