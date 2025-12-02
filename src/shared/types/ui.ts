/**
 * Generic типы для UI компонентов
 * 
 * @description
 * Универсальные интерфейсы для построения переиспользуемых UI компонентов.
 * Не зависят от конкретных entity (Habit, Task, и т.д.)
 * 
 * @module shared/types
 * @created 29 ноября 2025
 * @updated 30 ноября 2025 - миграция из shared/model в shared/types согласно FSD
 */

/**
 * Опция фильтра (чекбокс)
 */
export interface FilterOption {
  /** Уникальный идентификатор опции */
  id: string;
  /** Текст для отображения */
  label: string;
  /** Выбрана ли опция */
  checked: boolean;
  /** Количество элементов (необязательно) */
  count?: number;
  /** Callback при изменении */
  onChange: () => void;
}

/**
 * Секция фильтра (группа опций)
 */
export interface FilterSection {
  /** Уникальный идентификатор секции */
  id: string;
  /** Заголовок секции */
  title: string;
  /** Список опций в секции */
  options: FilterOption[];
}

/**
 * Конфигурация FilterDropdown компонента
 */
export interface FilterDropdownConfig {
  /** Секции фильтров */
  sections: FilterSection[];
  /** Есть ли активные фильтры (для индикатора) */
  hasActiveFilters: boolean;
  /** Callback для сброса всех фильтров */
  onClearAll: () => void;
  /** Открыт ли dropdown */
  isOpen: boolean;
  /** Callback для переключения открытия/закрытия */
  onToggleOpen: () => void;
}
