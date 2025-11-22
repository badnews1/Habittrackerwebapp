/**
 * Централизованное хранилище правил валидации
 * 
 * Этот файл содержит:
 * - Ограничения длины текстовых полей
 * - Диапазоны допустимых значений
 * - Регулярные выражения для валидации
 * - Сообщения об ошибках
 * 
 * Последнее обновление: 21 ноября 2025 (миграция в /shared/)
 */

// ============================================================================
// ОГРАНИЧЕНИЯ ДЛИНЫ ПОЛЕЙ
// ============================================================================

/**
 * Максимальные длины текстовых полей
 */
export const TEXT_LENGTH_LIMITS = {
  /** Название привычки */
  habitName: {
    min: 1,
    max: 25,
  },
  
  /** Описание привычки */
  habitDescription: {
    min: 0,
    max: 200,
  },
  
  /** Название категории */
  categoryName: {
    min: 1,
    max: 30,
  },
  
  /** Заметка к дню (если будет реализовано) */
  dayNote: {
    min: 0,
    max: 500,
  },
} as const;

// ============================================================================
// ДИАПАЗОНЫ ЧИСЛОВЫХ ЗНАЧЕНИЙ
// ============================================================================

/**
 * Ограничения для числовых значений
 */
export const NUMERIC_LIMITS = {
  /** Значение силы привычки (EMA) */
  habitStrength: {
    min: 0,
    max: 100,
  },
  
  /** Целевое значение для измеримой привычки */
  targetValue: {
    min: 0.01,
    max: 999999,
  },
  
  /** Значение выполнения измеримой привычки */
  measurableValue: {
    min: 0,
    max: 999999,
  },
  
  /** Количество дней серии */
  streak: {
    min: 0,
    max: 999999, // Теоретически неограничено
  },
  
  /** Процент выполнения */
  percentage: {
    min: 0,
    max: 100,
  },
  
  /** Количество привычек */
  habitsCount: {
    min: 0,
    max: 100, // Практическое ограничение для UX
  },
  
  /** Количество категорий */
  categoriesCount: {
    min: 0,
    max: 50, // Практическое ограничение для UX
  },
} as const;

// ============================================================================
// РЕГУЛЯРНЫЕ ВЫРАЖЕНИЯ
// ============================================================================

/**
 * Regex паттерны для валидации
 */
export const VALIDATION_PATTERNS = {
  /** Название привычки (буквы, цифры, пробелы, основные знаки препинания) */
  habitName: /^[а-яА-ЯёЁa-zA-Z0-9\s\-.,!?]+$/,
  
  /** Название категории (буквы, цифры, пробелы, дефис) */
  categoryName: /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/,
  
  /** Числовое значение с плавающей точкой */
  decimalNumber: /^\d+(\.\d{1,2})?$/,
  
  /** Целое положительное число */
  positiveInteger: /^\d+$/,
} as const;

// ============================================================================
// СООБЩЕНИЯ ОБ ОШИБКАХ
// ============================================================================

/**
 * Стандартные сообщения об ошибках валидации
 */
export const VALIDATION_MESSAGES = {
  /** Ошибки для привычек */
  habit: {
    nameRequired: 'Название привычки обязательно',
    nameTooShort: `Название должно содержать минимум ${TEXT_LENGTH_LIMITS.habitName.min} символ`,
    nameTooLong: `Название не должно превышать ${TEXT_LENGTH_LIMITS.habitName.max} символов`,
    nameInvalid: 'Название содержит недопустимые символы',
    descriptionTooLong: `Описание не должно превышать ${TEXT_LENGTH_LIMITS.habitDescription.max} символов`,
    iconRequired: 'Выберите иконку для привычки',
    targetValueRequired: 'Укажите целевое значение',
    targetValueInvalid: 'Целевое значение должно быть положительным числом',
    unitRequired: 'Выберите единицу измерения',
  },
  
  /** Ошибки для категорий */
  category: {
    nameRequired: 'Название категории обязательно',
    nameTooShort: `Название должно содержать минимум ${TEXT_LENGTH_LIMITS.categoryName.min} символ`,
    nameTooLong: `Название не должно превышать ${TEXT_LENGTH_LIMITS.categoryName.max} символов`,
    nameInvalid: 'Название содержит недопустимые символы',
    nameExists: 'Категория с таким названием уже существует',
    colorRequired: 'Выберите цвет для категории',
  },
  
  /** Ошибки для числовых значений */
  numeric: {
    valueRequired: 'Значение обязательно',
    valueTooSmall: 'Значение слишком маленькое',
    valueTooLarge: 'Значение слишком большое',
    valueInvalid: 'Некорректное числовое значение',
    mustBePositive: 'Значение должно быть положительным',
    mustBeInteger: 'Значение должно быть целым числом',
  },
  
  /** Общие ошибки */
  general: {
    required: 'Обязательное поле',
    invalid: 'Некорректное значение',
    tooLong: 'Значение слишком длинное',
    tooShort: 'Значение слишком короткое',
  },
} as const;

// ============================================================================
// УТИЛИТНЫЕ ФУНКЦИИ ВАЛИДАЦИИ
// ============================================================================

/**
 * Проверить длину текста
 * @param text - Текст для проверки
 * @param limits - Ограничения { min, max }
 * @returns true если длина в пределах допустимого
 */
export function validateTextLength(
  text: string,
  limits: { min: number; max: number }
): boolean {
  const length = text.trim().length;
  return length >= limits.min && length <= limits.max;
}

/**
 * Проверить название привычки
 * @param name - Название привычки
 * @returns Объект с результатом { isValid: boolean, error?: string }
 */
export function validateHabitName(name: string): { isValid: boolean; error?: string } {
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return { isValid: false, error: VALIDATION_MESSAGES.habit.nameRequired };
  }
  
  if (trimmedName.length < TEXT_LENGTH_LIMITS.habitName.min) {
    return { isValid: false, error: VALIDATION_MESSAGES.habit.nameTooShort };
  }
  
  if (trimmedName.length > TEXT_LENGTH_LIMITS.habitName.max) {
    return { isValid: false, error: VALIDATION_MESSAGES.habit.nameTooLong };
  }
  
  if (!VALIDATION_PATTERNS.habitName.test(trimmedName)) {
    return { isValid: false, error: VALIDATION_MESSAGES.habit.nameInvalid };
  }
  
  return { isValid: true };
}

/**
 * Проверить название категории
 * @param name - Название категории
 * @param existingCategories - Список существующих категорий
 * @returns Объект с результатом { isValid: boolean, error?: string }
 */
export function validateCategoryName(
  name: string,
  existingCategories: string[] = []
): { isValid: boolean; error?: string } {
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return { isValid: false, error: VALIDATION_MESSAGES.category.nameRequired };
  }
  
  if (trimmedName.length < TEXT_LENGTH_LIMITS.categoryName.min) {
    return { isValid: false, error: VALIDATION_MESSAGES.category.nameTooShort };
  }
  
  if (trimmedName.length > TEXT_LENGTH_LIMITS.categoryName.max) {
    return { isValid: false, error: VALIDATION_MESSAGES.category.nameTooLong };
  }
  
  if (!VALIDATION_PATTERNS.categoryName.test(trimmedName)) {
    return { isValid: false, error: VALIDATION_MESSAGES.category.nameInvalid };
  }
  
  if (existingCategories.includes(trimmedName)) {
    return { isValid: false, error: VALIDATION_MESSAGES.category.nameExists };
  }
  
  return { isValid: true };
}

/**
 * Проверить числовое значение
 * @param value - Значение для проверки
 * @param limits - Ограничения { min, max }
 * @returns Объект с результатом { isValid: boolean, error?: string }
 */
export function validateNumericValue(
  value: number,
  limits: { min: number; max: number }
): { isValid: boolean; error?: string } {
  if (isNaN(value)) {
    return { isValid: false, error: VALIDATION_MESSAGES.numeric.valueInvalid };
  }
  
  if (value < limits.min) {
    return { isValid: false, error: VALIDATION_MESSAGES.numeric.valueTooSmall };
  }
  
  if (value > limits.max) {
    return { isValid: false, error: VALIDATION_MESSAGES.numeric.valueTooLarge };
  }
  
  return { isValid: true };
}

/**
 * Проверить целевое значение измеримой привычки
 * @param value - Целевое значение
 * @returns Объект с результатом { isValid: boolean, error?: string }
 */
export function validateTargetValue(value: number): { isValid: boolean; error?: string } {
  if (value <= 0) {
    return { isValid: false, error: VALIDATION_MESSAGES.numeric.mustBePositive };
  }
  
  return validateNumericValue(value, NUMERIC_LIMITS.targetValue);
}

/**
 * Форматировать число для отображения (ограничение 2 знаками после запятой)
 * @param value - Число для форматирования
 * @returns Отформатированная строка
 */
export function formatNumericValue(value: number): string {
  return Number(value.toFixed(2)).toString();
}
