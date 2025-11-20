/**
 * Константы и утилиты для работы с датами
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
 * @param month - номер месяца (0-11)
 * @param year - год
 * @returns массив объектов с датой и номером дня
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
 * @param date - объект Date
 * @returns строка формата YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Возвращает короткое название дня недели
 * @param date - объект Date
 * @returns короткое название дня недели (Пн, Вт и т.д.)
 */
export const getDayName = (date: Date): string => {
  return DAY_NAMES_SHORT[date.getDay()];
};

/**
 * Форматирует дату в читаемый формат "Пн, 15 января"
 * @param dateStr - строка даты в формате YYYY-MM-DD
 * @returns форматированная строка
 */
export const formatDateReadable = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return `${DAY_NAMES_SHORT[dateObj.getDay()]}, ${parseInt(day)} ${MONTH_NAMES_GENITIVE[dateObj.getMonth()]}`;
};
