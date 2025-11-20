/**
 * Утилиты для склонения русских слов в зависимости от числительного
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
 */

/**
 * Базовая функция склонения для любых слов
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
// Специализированные функции для компонентов частоты
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
