/**
 * Barrel export для утилит работы с текстом
 */
export {
  // Базовая функция
  decline,
  
  // Склонение общих слов
  declineDays,
  declineTimes,
  declineHabits,
  declineReminders,
  
  // Форматирование с числом
  formatWithDecline,
  formatDays,
  formatTimes,
  formatHabits,
  
  // Специализированные функции для частоты
  declineTimesPerWeek,
  declineTimesPerMonth,
  declineTimesIn,
  
  // Единицы измерения
  declineUnit,
  getShortUnit,
  
  // Форматирование чисел
  formatNumber,
} from './textUtils';
