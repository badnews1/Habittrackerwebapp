/**
 * I18n хелперы для работы с датами
 * 
 * Функции для получения локализованных названий дней недели и месяцев
 * 
 * @module shared/lib/date/i18n
 * @created 2 декабря 2025
 */

import i18n from '@/app/i18n';

/**
 * Получить короткое название дня недели
 * 
 * @param date - объект Date
 * @returns короткое название дня недели на текущем языке
 */
export const getLocalizedDayName = (date: Date): string => {
  const dayIndex = date.getDay();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  // ✅ Fix: доступ по индексу может вернуть undefined
  const dayKey = days[dayIndex] ?? 'monday';
  
  return i18n.t(`common:weekdays.short.${dayKey}`);
};

/**
 * Получить полное название дня недели
 * 
 * @param date - объект Date
 * @returns полное название дня недели на текущем языке
 */
export const getLocalizedDayNameFull = (date: Date): string => {
  const dayIndex = date.getDay();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  // ✅ Fix: доступ по индексу может вернуть undefined
  const dayKey = days[dayIndex] ?? 'monday';
  
  return i18n.t(`common:weekdays.full.${dayKey}`);
};

/**
 * Получить короткое название месяца
 * 
 * @param month - номер месяца (0-11)
 * @returns короткое название месяца на текущем языке
 */
export const getLocalizedMonthNameShort = (month: number): string => {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  // ✅ Fix: доступ по индексу может вернуть undefined
  const monthKey = months[month] ?? 'january';
  
  return i18n.t(`common:months.short.${monthKey}`);
};

/**
 * Получить полное название месяца
 * 
 * @param month - номер месяца (0-11)
 * @returns полное название месяца на текущем языке
 */
export const getLocalizedMonthNameFull = (month: number): string => {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  // ✅ Fix: доступ по индексу может вернуть undefined
  const monthKey = months[month] ?? 'january';
  
  return i18n.t(`common:months.full.${monthKey}`);
};
