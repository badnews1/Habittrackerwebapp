/**
 * Утилиты для работы с текстом и числами
 * 
 * @description
 * Этот файл содержит функции для:
 * - Склонения русских слов в зависимости от числительного
 * - Склонения единиц измерения
 * - Форматирования чисел
 * - Получения сокращённых названий единиц
 * 
 * @since 21 ноября 2025 (объединение declineWords.ts и unitUtils.ts)
 * @updated 21 ноября 2025 - мигрировано в /shared/utils
 */

// ============================================
// БАЗОВАЯ ФУНКЦИЯ СКЛОНЕНИЯ
// ============================================

/**
 * Базовая функция склонения для любых слов
 * 
 * Правила склонения:
 * - 1, 21, 31, ... (кроме 11) → форма 1 (день, раз, привычка)
 * - 2-4, 22-24, 32-34, ... (кроме 12-14) → форма 2 (дня, раза, привычки)
 * - 0, 5-20, 25-30, ... → форма 3 (дней, раз, привычек)
 * 
 * Edge cases:
 * - undefined/null/NaN → форма 3 (дефолт)
 * - Отрицательные числа → берём абсолютное значение
 * - Дробные числа → округляем вниз
 * 
 * @param count - число (может быть undefined/null/NaN)
 * @param one - форма для 1 (день, раз, привычка)
 * @param few - форма для 2-4 (дня, раза, привычки)
 * @param many - форма для 5+ (дней, раз, привычек)
 * @returns склонённое слово
 * 
 * @example
 * decline(1, 'день', 'дня', 'дней') // "день"
 * decline(2, 'день', 'дня', 'дней') // "дня"
 * decline(5, 'день', 'дня', 'дней') // "дней"
 * decline(21, 'день', 'дня', 'дней') // "день"
 * decline(undefined, 'день', 'дня', 'дней') // "дней" (дефолт)
 * decline(-5, 'день', 'дня', 'дней') // "дней" (|-5| = 5)
 */
export function decline(count: number | undefined, one: string, few: string, many: string): string {
  // Проверка на undefined/null/NaN и отрицательные числа
  if (count === undefined || count === null || isNaN(count)) {
    return many; // Дефолтная форма для некорректных значений
  }

  // Берём абсолютное значение и округляем вниз
  const normalizedCount = Math.floor(Math.abs(count));
  
  const lastDigit = normalizedCount % 10;
  const lastTwoDigits = normalizedCount % 100;

  // Исключение: 11-14 всегда используют форму "many"
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return many;
  }

  // 1, 21, 31, ... → форма "one"
  if (lastDigit === 1) {
    return one;
  }

  // 2-4, 22-24, 32-34, ... → форма "few"
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }

  // 0, 5-20, 25-30, ... → форма "many"
  return many;
}

// ============================================
// ОБЩИЕ СЛОВА (дни, привычки, напоминания)
// ============================================

/**
 * Склонение слова "день"
 * @param count - количество дней (может быть undefined)
 * @returns "день", "дня" или "дней"
 * 
 * @example
 * declineDays(1) // "день"
 * declineDays(2) // "дня"
 * declineDays(5) // "дней"
 * declineDays(21) // "день"
 * declineDays(undefined) // "дней"
 */
export function declineDays(count: number | undefined): string {
  return decline(count, 'день', 'дня', 'дней');
}

/**
 * Склонение слова "раз"
 * @param count - количество раз (может быть undefined)
 * @returns "раз", "раза" или "раз"
 * 
 * @example
 * declineTimes(1) // "раз"
 * declineTimes(2) // "раза"
 * declineTimes(5) // "раз"
 * declineTimes(21) // "раз"
 * declineTimes(undefined) // "раз"
 */
export function declineTimes(count: number | undefined): string {
  return decline(count, 'раз', 'раза', 'раз');
}

/**
 * Склонение слова "привычка"
 * @param count - количество привычек (может быть undefined)
 * @returns "привычка", "привычки" или "привычек"
 * 
 * @example
 * declineHabits(1) // "привычка"
 * declineHabits(2) // "привычки"
 * declineHabits(5) // "привычек"
 * declineHabits(21) // "привычка"
 * declineHabits(undefined) // "привычек"
 */
export function declineHabits(count: number | undefined): string {
  return decline(count, 'привычка', 'привычки', 'привычек');
}

/**
 * Склонение слова "напоминание"
 * @param count - количество напоминаний (может быть undefined)
 * @returns "напоминание", "напоминания" или "напоминаний"
 * 
 * @example
 * declineReminders(1) // "напоминание"
 * declineReminders(2) // "напоминания"
 * declineReminders(5) // "напоминаний"
 * declineReminders(undefined) // "напоминаний"
 */
export function declineReminders(count: number | undefined): string {
  return decline(count, 'напоминание', 'напоминания', 'напоминаний');
}

// ============================================
// ФОРМАТИРОВАНИЕ С ЧИСЛОМ
// ============================================

/**
 * Форматирует число с правильным склонением
 * @param count - число (может быть undefined)
 * @param one - форма для 1
 * @param few - форма для 2-4
 * @param many - форма для 5+
 * @returns строка вида "5 дней", "1 день", "2 дня"
 * 
 * @example
 * formatWithDecline(1, 'день', 'дня', 'дней') // "1 день"
 * formatWithDecline(2, 'день', 'дня', 'дней') // "2 дня"
 * formatWithDecline(5, 'день', 'дня', 'дней') // "5 дней"
 * formatWithDecline(undefined, 'день', 'дня', 'дней') // "0 дней"
 */
export function formatWithDecline(count: number | undefined, one: string, few: string, many: string): string {
  // Если count некорректный, показываем 0
  const displayCount = (count === undefined || count === null || isNaN(count)) ? 0 : count;
  return `${displayCount} ${decline(count, one, few, many)}`;
}

/**
 * Форматирует количество дней
 * @param count - количество дней (может быть undefined)
 * @returns строка вида "5 дней", "1 день", "2 дня"
 */
export function formatDays(count: number | undefined): string {
  return formatWithDecline(count, 'день', 'дня', 'дней');
}

/**
 * Форматирует количество раз
 * @param count - количество раз (может быть undefined)
 * @returns строка вида "5 раз", "1 раз", "2 раза"
 */
export function formatTimes(count: number | undefined): string {
  return formatWithDecline(count, 'раз', 'раза', 'раз');
}

/**
 * Форматирует количество привычек
 * @param count - количество привычек (может быть undefined)
 * @returns строка вида "5 привычек", "1 привычка", "2 привычки"
 */
export function formatHabits(count: number | undefined): string {
  return formatWithDecline(count, 'привычка', 'привычки', 'привычек');
}

// ============================================
// СПЕЦИАЛИЗИРОВАННЫЕ ФУНКЦИИ ДЛЯ ЧАСТОТЫ
// ============================================

/**
 * Склонение фразы "раз в неделю"
 * Используется в NTimesWeekSection
 * @param count - количество раз (может быть undefined)
 * @returns "раз в неделю", "раза в неделю" или "раз в неделю"
 * 
 * @example
 * declineTimesPerWeek(1) // "раз в неделю"
 * declineTimesPerWeek(2) // "раза в неделю"
 * declineTimesPerWeek(5) // "раз в неделю"
 * declineTimesPerWeek(undefined) // "раз в неделю"
 */
export function declineTimesPerWeek(count: number | undefined): string {
  return decline(count, 'раз в неделю', 'раза в неделю', 'раз в неделю');
}

/**
 * Склонение фразы "раз в месяц"
 * Используется в NTimesMonthSection
 * @param count - количество раз (может быть undefined)
 * @returns "раз в месяц", "раза в месяц" или "раз в месяц"
 * 
 * @example
 * declineTimesPerMonth(1) // "раз в месяц"
 * declineTimesPerMonth(2) // "раза в месяц"
 * declineTimesPerMonth(5) // "раз в месяц"
 * declineTimesPerMonth(undefined) // "раз в месяц"
 */
export function declineTimesPerMonth(count: number | undefined): string {
  return decline(count, 'раз в месяц', 'раза в месяц', 'раз в месяц');
}

/**
 * Склонение фразы "раз в"
 * Используется в NTimesInMDaysSection для первой части фразы
 * @param count - количество раз (может быть undefined)
 * @returns "раз в", "раза в" или "раз в"
 * 
 * @example
 * declineTimesIn(1) // "раз в"
 * declineTimesIn(2) // "раза в"
 * declineTimesIn(5) // "раз в"
 * declineTimesIn(undefined) // "раз в"
 */
export function declineTimesIn(count: number | undefined): string {
  return decline(count, 'раз в', 'раза в', 'раз в');
}

// ============================================
// ЕДИНИЦЫ ИЗМЕРЕНИЯ
// ============================================

/**
 * Словарь склонений единиц измерения
 * [форма1, форма2, форма5]
 */
const UNIT_DECLENSIONS: Record<string, [string, string, string]> = {
  'разы': ['раз', 'раза', 'раз'],
  'штуки': ['штука', 'штуки', 'штук'],
  'баллы': ['балл', 'балла', 'баллов'],
  'минуты': ['минута', 'минуты', 'минут'],
  'часы': ['час', 'часа', 'часов'],
  'шаги': ['шаг', 'шага', 'шагов'],
  'километры': ['километр', 'километра', 'километров'],
  'метры': ['метр', 'метра', 'метров'],
  'подходы': ['подход', 'подхода', 'подходов'],
  'калории': ['калория', 'калории', 'калорий'],
  'килограммы': ['килограмм', 'килограмма', 'килограммов'],
  'граммы': ['грамм', 'грамма', 'граммов'],
  'стаканы': ['стакан', 'стакана', 'стаканов'],
  'литры': ['литр', 'литра', 'литров'],
  'милилитры': ['милилитр', 'милилитра', 'милилитров'],
  'порции': ['порция', 'порции', 'порций'],
  'чашки': ['чашка', 'чашки', 'чашек'],
  'страницы': ['страница', 'страницы', 'страниц'],
  'слова': ['слово', 'слова', 'слов'],
  'главы': ['глава', 'главы', 'глав'],
  'задачи': ['задача', 'задачи', 'задач'],
};

/**
 * Склонение единиц измерения в зависимости от числа
 * 
 * @param value - Числовое значение
 * @param unit - Единица измерения в форме множественного числа
 * @returns Правильно склонённая единица измерения
 * 
 * @example
 * declineUnit(1, 'разы') // "раз"
 * declineUnit(2, 'разы') // "раза"
 * declineUnit(5, 'разы') // "раз"
 * declineUnit(1.5, 'литры') // "литра"
 * declineUnit(2.5, 'килограммы') // "килограмма"
 */
export function declineUnit(value: number, unit: string): string {
  // Валюты и сокращения не склоняются
  if (unit === 'руб.' || unit === '$' || unit === '€') {
    return unit;
  }

  const forms = UNIT_DECLENSIONS[unit];
  if (!forms) {
    return unit; // Если единицы нет в словаре, возвращаем как есть
  }

  // Для дробных чисел всегда используем форму 2 (родительный падеж единственного числа)
  // 1.5 литра, 2.5 килограмма, 0.5 часа
  if (value % 1 !== 0) {
    return forms[1];
  }

  // Используем базовую функцию decline()
  const absValue = Math.floor(Math.abs(value));
  return decline(absValue, forms[0], forms[1], forms[2]);
}

/**
 * Получение сокращенного названия единицы измерения для календарной сетки
 * 
 * @param unit - Полное название единицы измерения
 * @returns Сокращённое название
 * 
 * @example
 * getShortUnit('километры') // "км"
 * getShortUnit('литры') // "л"
 * getShortUnit('минуты') // "мин"
 */
export function getShortUnit(unit: string): string {
  const shortUnits: Record<string, string> = {
    'разы': 'раз',
    'штуки': 'шт',
    'баллы': 'б',
    'минуты': 'мин',
    'часы': 'ч',
    'шаги': 'шаг',
    'километры': 'км',
    'метры': 'м',
    'подходы': 'подх',
    'калории': 'ккал',
    'килограммы': 'кг',
    'граммы': 'г',
    'стаканы': 'стак',
    'литры': 'л',
    'милилитры': 'мл',
    'порции': 'порц',
    'чашки': 'чаш',
    'страницы': 'стр',
    'слова': 'сл',
    'главы': 'гл',
    'задачи': 'зад',
    'руб.': 'руб',
    '$': '$',
    '€': '€',
  };

  return shortUnits[unit] || unit;
}

// ============================================
// ФОРМАТИРОВАНИЕ ЧИСЕЛ
// ============================================

/**
 * Форматирование больших чисел для компактного отображения в календаре
 * 
 * @param num - Число для форматирования
 * @returns Отформатированная строка
 * 
 * @example
 * formatNumber(999) // "999"
 * formatNumber(10000) // "10k"
 * formatNumber(15500) // "15.5k"
 * formatNumber(100000) // "100k"
 * formatNumber(1500000) // "1.5M"
 * 
 * Правила форматирования:
 * - 0-9999: как есть
 * - 10000-99999: с k и десятичной частью (например: 10k, 15.5k)
 * - 100000-999999: с k, округление (например: 101k, 100k)
 * - 1000000+: с M (например: 1M, 1.5M)
 */
export function formatNumber(num: number): string {
  if (num < 10000) {
    return num.toString();
  } else if (num < 100000) {
    const k = num / 1000;
    const rounded = parseFloat(k.toFixed(1));
    // Если после округления получилось целое число, показываем без .0
    return rounded % 1 === 0 ? `${Math.round(rounded)}k` : `${rounded}k`;
  } else if (num < 1000000) {
    const k = Math.round(num / 1000);
    // Если округление дало >= 1000k, показываем как M
    if (k >= 1000) {
      return '1M';
    }
    return `${k}k`;
  } else {
    const m = num / 1000000;
    const rounded = parseFloat(m.toFixed(1));
    return rounded % 1 === 0 ? `${Math.round(rounded)}M` : `${rounded}M`;
  }
}
