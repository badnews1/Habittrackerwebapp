/**
 * Типы для компонента списка напоминаний
 * 
 * @module shared/ui/reminder-list
 */

/**
 * Интерфейс элемента напоминания
 * Используется в различных модулях (habits, tasks, finance и т.д.)
 */
export interface ReminderItem {
  /** Уникальный идентификатор напоминания */
  id: string;
  
  /** Время напоминания в формате HH:MM */
  time: string;
  
  /** Включено ли напоминание */
  enabled: boolean;
}
