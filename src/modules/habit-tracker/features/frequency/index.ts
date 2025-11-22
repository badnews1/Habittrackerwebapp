/**
 * Публичный API модуля Frequency
 * 
 * Управление системой частоты выполнения привычек:
 * - Редактор частоты с 6 типами (daily, by_days_of_week, n_times_week, n_times_month, every_n_days, n_times_in_m_days)
 * - Валидация и автозаполнение значений
 * - Сохранение состояния при переключении между типами
 * 
 * @module modules/habit-tracker/features/frequency
 */

// Компоненты
export * from './components';

// Хуки
export * from './hooks';

// Типы
export * from './types';

// Утилиты
export * from './utils';
