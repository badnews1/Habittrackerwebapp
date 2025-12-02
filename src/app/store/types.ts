/**
 * Типы и интерфейсы для Zustand store
 * 
 * Этот файл содержит все TypeScript интерфейсы для store.
 * Разделение типов улучшает читаемость и переиспользование кода.
 * 
 * @module app/store/types
 * @updated 23 ноября 2025 - миграция categories → tags
 * @updated 29 ноября 2025 - миграция на ColorVariant
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import type { Habit, HabitData, HabitType, FrequencyConfig, Reminder, Tag, Section } from '@/entities/habit';
import type { ColorVariant } from '@/shared/constants/colors';
import type { AddHabitFormActions } from './slices/addHabitForm';
import type { LanguageSlice } from './slices/language';

/**
 * Интерфейс для модального окна ввода числового значения
 */
export interface NumericInputModal {
  habitId: string;
  date: string;
}

/**
 * Интерфейс для модального окна статистики привычки
 */
export interface StatsModal {
  habitId: string;
  monthYearKey: string;
}

/**
 * Интерфейс для состояния формы добавления привычки
 */
export interface AddHabitFormState {
  /** Основные поля */
  name: string;
  description: string;
  icon: string;
  tags: string[];
  section: string;
  type: HabitType;
  
  /** Частота выполнения */
  frequency: FrequencyConfig;
  
  /** Напоминания */
  reminders: Reminder[];
  
  /** Настройки измеримой привычки */
  measurable: {
    unit: string;
    targetValue: string;
    targetType: 'min' | 'max';
  };
  
  /** UI состояние */
  currentStep: 1 | 2 | 3;
  openPicker: 'targetType' | 'icon' | 'tag' | 'section' | 'type' | null;
  
  /** Флаг инициализации */
  isInitialized: boolean;
}

/**
 * Основной интерфейс state приложения
 */
export interface HabitsState extends AddHabitFormActions {
  // ==================== ДАННЫЕ ====================
  /** Список всех привычек */
  habits: Habit[];
  /** Список тегов */
  tags: Tag[];
  /** Список разделов с цветами */
  sections: Section[];

  // ==================== UI СОСТОЯНИЕ ====================
  /** Выбранный месяц (0-11) */
  selectedMonth: number;
  /** Выбранный год */
  selectedYear: number;

  // ==================== МОДАЛЬНЫЕ ОКНА ====================
  /** Модальное окно ввода числового значения */
  numericInputModal: NumericInputModal | null;
  /** Модальное окно статистики привычки */
  statsModal: StatsModal | null;
  /** Открыт ли picker месяца/года */
  isMonthYearPickerOpen: boolean;
  /** Открыто ли модальное окно добавления привычки */
  isAddHabitModalOpen: boolean;
  /** Состояние формы добавления привычки */
  addHabitForm: AddHabitFormState;

  // ==================== ACTIONS: UI ====================
  /** Установить выбранный месяц и год */
  setSelectedDate: (month: number, year: number) => void;

  // ==================== ACTIONS: МОДАЛЬНЫЕ ОКНА ====================
  /** Открыть модальное окно добавления привычки */
  openAddHabitModal: () => void;
  /** Закрыть модальное окно добавления привычки */
  closeAddHabitModal: () => void;
  /** Открыть модальное окно ввода числового значения */
  openNumericInputModal: (habitId: string, date: string) => void;
  /** Закрыть модальное окно ввода числового значения */
  closeNumericInputModal: () => void;
  /** Открыть модальное окно статистики привычки */
  openStatsModal: (habitId: string, monthYearKey: string) => void;
  /** Закрыть модальное окно статистики привычки */
  closeStatsModal: () => void;
  /** Открыть picker месяца/года */
  openMonthYearPicker: () => void;
  /** Закрыть picker месяца/года */
  closeMonthYearPicker: () => void;

  // ==================== ACTIONS: ПРИВЫЧКИ ====================
  /** Добавить новую привычку */
  addHabit: (habitData: HabitData) => void;
  /** Удалить привычку */
  deleteHabit: (habitId: string) => void;
  /** Обновить привычку */
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  /** Переключить выполнение привычки */
  toggleCompletion: (habitId: string, date: string) => void;
  /** Переместить привычку (drag-n-drop) */
  moveHabit: (dragIndex: number, hoverIndex: number) => void;

  // ==================== ACTIONS: ТЕГИ ====================
  /** Добавить тег */
  addTag: (tagName: string, color?: ColorVariant) => void;
  /** Удалить тег */
  deleteTag: (tagName: string) => void;
  /** Обновить цвет тега */
  updateTagColor: (tagName: string, color: ColorVariant) => void;

  // ==================== ACTIONS: РАЗДЕЛЫ ====================
  /** Добавить раздел */
  addSection: (name: string, color: ColorVariant) => void;
  /** Обновить цвет раздела */
  updateSectionColor: (name: string, color: ColorVariant) => void;
  /** Удалить раздел */
  deleteSection: (name: string) => void;

  // ==================== ACTIONS: ВНУТРЕННИЕ ====================
  /** Обновить силу привычек (вызывается при загрузке приложения) */
  updateHabitsStrength: () => void;
}

/**
 * Основной интерфейс store приложения
 * Объединяет все слайсы
 */
export type AppStore = HabitsState & LanguageSlice;