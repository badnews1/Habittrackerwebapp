/**
 * Константы и утилиты для работы с датами
 * 
 * @description
 * Набор универсальных функций для форматирования дат, получения дней месяца,
 * работы с днями недели и месяцами на русском языке.
 * 
 * @since Ноябрь 2024
 * @updated 30 ноября 2025 - мигрировано в /shared/lib согласно FSD
 */

// Короткие названия дней недели
export const DAY_NAMES_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// Названия месяцев в родительном падеже
export const MONTH_NAMES_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'
];

/**
 * Возвращает массив дней для указанного месяца и года
 * 
 * @param month - номер месяца (0-11)
 * @param year - год
 * @returns массив объектов с датой и номером дня
 * 
 * @example
 * ```typescript
 * const days = getDaysInMonth(0, 2025); // Январь 2025
 * // [{ date: Date(2025-01-01), day: 1 }, { date: Date(2025-01-02), day: 2 }, ...]
 * ```
 */
export const getDaysInMonth = (month: number, year: number) => {
  const days = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({ 
      date, 
      day 
    });
  }
  return days;
};

/**
 * Форматирует дату в строку формата YYYY-MM-DD
 * 
 * @param date - объект Date
 * @returns строка формата YYYY-MM-DD
 * 
 * @example
 * ```typescript
 * const dateStr = formatDate(new Date('2025-01-15'));
 * // '2025-01-15'
 * ```
 */
export const formatDate = (date: Date): string => {
  // ✅ Fix: split может вернуть undefined, но ISO формат всегда содержит 'T'
  const datePart = date.toISOString().split('T')[0];
  return datePart ?? date.toISOString();
};

/**
 * Возвращает короткое название дня недели
 * 
 * @param date - объект Date
 * @returns короткое название дня недели (Пн, Вт и т.д.)
 * 
 * @example
 * ```typescript
 * const dayName = getDayName(new Date('2025-01-15'));
 * // 'Ср' (если это среда)
 * ```
 */
export const getDayName = (date: Date): string => {
  // ✅ Fix: доступ по индексу может вернуть undefined
  const dayName = DAY_NAMES_SHORT[date.getDay()];
  return dayName ?? 'Пн'; // Fallback на понедельник
};

/**
 * Форматирует дату из строки в читаемый формат с днем недели
 * 
 * @param dateStr - Дата в формате 'YYYY-MM-DD'
 * @returns Строка в формате "День недели, День Месяц"
 * 
 * @example
 * ```ts
 * formatDateReadable('2025-11-24') // "Пт, 24 ноября"
 * ```
 */
export const formatDateReadable = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return `${DAY_NAMES_SHORT[dateObj.getDay()]}, ${parseInt(day)} ${MONTH_NAMES_GENITIVE[dateObj.getMonth()]}`;
};

/**
 * Форматирует дату из строки в полный читаемый формат с годом
 * 
 * @param dateStr - Дата в формате 'YYYY-MM-DD'
 * @returns Строка в формате "День Месяц Год"
 * 
 * @example
 * ```ts
 * formatDateFull('2025-11-24') // "24 ноября 2025"
 * ```
 */
export const formatDateFull = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return `${parseInt(day)} ${MONTH_NAMES_GENITIVE[dateObj.getMonth()]} ${year}`;
};
