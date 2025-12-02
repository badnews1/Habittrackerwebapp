/**
 * Public API для модуля date utilities
 */

// Утилиты для работы с датами
export {
  getDaysInMonth,
  formatDate,
} from './dateUtils';

// Локализованные функции для отображения
export {
  getLocalizedDayName,
  getLocalizedDayNameFull,
  getLocalizedMonthNameShort,
  getLocalizedMonthNameFull,
  getLocalizedMonthNameGenitive,
  formatDateReadable,
  formatDateFull,
} from './i18n';
