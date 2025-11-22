/**
 * Типы и интерфейсы для Zustand store
 * 
 * Этот файл содержит все TypeScript интерфейсы для store.
 * Разделение типов улучшает читаемость и переиспользование кода.
 * 
 * @module core/store/types
 * @updated 22 ноября 2025 - обновлены импорты на модульные типы
 */

import { Habit, HabitData, HabitType, FrequencyConfig, Reminder } from '@/modules/habit-tracker/types';
import { Category } from '@/modules/habit-tracker/features/categories';
import type { AddHabitFormActions } from './slices/addHabitForm';

/**
 * Интерфейс для модального окна ввода числового значения
 */
export interface NumericInputModal {
  habitId: string;
  date: string;
}

/**
 * Интерфейс для состояния модального окна управления привычками
 */
export interface ManageHabitsModalState {
  /** Локальная копия привычек для редактирования */
  localHabits: Habit[];
  /** ID развернутой привычки */
  expandedHabitId: string | null;
  /** Флаг инициализации (true = модалка открыта и инициализирована) */
  isInitialized: boolean;
}

/**
 * Интерфейс для состояния формы добавления привычки
 */
export interface AddHabitFormState {
  /** Основные поля */
  name: string;
  description: string;
  icon: string;
  category: string;
  type: HabitType;
  
  /** Частота выполнения */
  frequency: FrequencyConfig;
  frequencyBackup: FrequencyConfig | null;
  
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
  openPicker: 'unit' | 'targetType' | 'icon' | 'category' | 'type' | null;
  currentIconPage: number;
  
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
  /** Список категорий */
  categories: Category[];
  /** Цели по дням: ключ - дата (YYYY-MM-DD), значение - количество привычек */
  dailyGoals: { [date: string]: number };
  /** Дефолтная дневная цель (строка для пустого значения) */
  defaultDailyGoal: string;

  // ==================== UI СОСТОЯНИЕ ====================
  /** Текущая секция приложения */
  currentSection: string;
  /** Открыт ли сайдбар */
  isSidebarOpen: boolean;
  /** Выбранный месяц (0-11) */
  selectedMonth: number;
  /** Выбранный год */
  selectedYear: number;

  // ==================== UNDO СИСТЕМА ====================
  /** Предыдущее состояние привычек (для Undo) */
  previousHabitsState: Habit[] | null;
  /** Счетчик действий после очистки всех галочек */
  actionsAfterClear: number;

  // ==================== МОДАЛЬНЫЕ ОКНА ====================
  /** ID новодобавленной привычки (для анимации) */
  newlyAddedHabitId: string | null;
  /** Модальное окно ввода числового значения */
  numericInputModal: NumericInputModal | null;
  /** Открыт ли picker месяца/года */
  isMonthYearPickerOpen: boolean;
  /** Дата для редактирования цели */
  editingGoal: string | null;
  /** Открыто ли модальное окно управления привычками */
  isManageHabitsModalOpen: boolean;
  /** Открыто ли модальное окно добавления привычки */
  isAddHabitModalOpen: boolean;
  /** Состояние модального окна управления привычками */
  manageHabitsModal: ManageHabitsModalState;
  /** Состояние формы добавления привычки */
  addHabitForm: AddHabitFormState;

  // ==================== ACTIONS: UI ====================
  /** Установить текущую секцию */
  setCurrentSection: (section: string) => void;
  /** Переключить сайдбар */
  toggleSidebar: (open: boolean) => void;
  /** Установить выбранный месяц и год */
  setSelectedDate: (month: number, year: number) => void;

  // ==================== ACTIONS: МОДАЛЬНЫЕ ОКНА ====================
  /** Открыть модальное окно добавления привычки */
  openAddHabitModal: () => void;
  /** Закрыть модальное окно добавления привычки */
  closeAddHabitModal: () => void;
  /** Открыть модальное окно управления привычками */
  openManageHabitsModal: () => void;
  /** Закрыть модальное окно управления привычками */
  closeManageHabitsModal: () => void;
  /** Открыть модальное окно ввода числового значения */
  openNumericInputModal: (habitId: string, date: string) => void;
  /** Закрыть модальное окно ввода числового значения */
  closeNumericInputModal: () => void;
  /** Открыть picker месяца/года */
  openMonthYearPicker: () => void;
  /** Закрыть picker месяца/года */
  closeMonthYearPicker: () => void;
  /** Установить редактируемую цель */
  setEditingGoal: (date: string | null) => void;
  /** Очистить ID новодобавленной привычки */
  clearNewlyAddedHabitId: () => void;

  // ==================== ACTIONS: MANAGE HABITS MODAL ====================
  /** Инициализировать локальное состояние модального окна (deep copy habits) */
  initializeManageHabitsModal: () => void;
  /** Сбросить локальное состояние модального окна */
  resetManageHabitsModal: () => void;
  /** Обновить локальную привычку в модалке */
  updateLocalHabit: (habitId: string, updates: Partial<Habit>) => void;
  /** Удалить локальную привычку в модалке */
  deleteLocalHabit: (habitId: string) => void;
  /** Добавить локальную привычку в модалке */
  addLocalHabit: (habitData: HabitData) => void;
  /** Переместить локальную привычку в модалке */
  moveLocalHabit: (dragIndex: number, hoverIndex: number) => void;
  /** Установить ID развернутой привычки */
  setExpandedHabitId: (habitId: string | null) => void;
  /** Получить привычки для сохранения (фильтрация пустых имен) */
  getHabitsToSave: () => Habit[];
  /** Очистить категорию у всех локальных привычек */
  clearCategoryFromLocalHabits: (categoryName: string) => void;
  /** Сохранить изменения из модального окна в глобальное состояние */
  saveManageHabitsChanges: () => void;

  // ==================== ACTIONS: ПРИВЫЧКИ ====================
  /** Добавить новую привычку */
  addHabit: (habitData: HabitData) => void;
  /** Удалить привычку */
  deleteHabit: (habitId: string) => void;
  /** Обновить привычку */
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  /** Переключить выполнение привычки */
  toggleCompletion: (habitId: string, date: string) => void;
  /** Переключить все привычки за день */
  toggleAllForDay: (date: string) => void;
  /** Переместить привычку (drag-n-drop) */
  moveHabit: (dragIndex: number, hoverIndex: number) => void;
  /** Очистить все галочки текущего меся��а */
  clearAllCompletions: () => void;
  /** Отменить очистку всех галочек */
  undoClearAllCompletions: () => void;

  // ==================== ACTIONS: КАТЕГОРИИ ====================
  /** Добавить категорию */
  addCategory: (categoryName: string) => void;
  /** Удалить категорию */
  deleteCategory: (categoryName: string) => void;
  /** Обновить цвет категории */
  updateCategoryColor: (categoryName: string, color: string) => void;

  // ==================== ACTIONS: ЦЕЛИ ====================
  /** Установить цели по дням */
  setDailyGoals: (goals: { [date: string]: number }) => void;
  /** Установить дефолтную цель */
  setDefaultDailyGoal: (value: string) => void;
  /** Обработать изменение дефолтной цели */
  handleDefaultDailyGoalChange: (value: string) => void;

  // ==================== ACTIONS: ВНУТРЕННИЕ ====================
  /** Инкрементировать счетчик действий после очистки */
  incrementActionCounter: () => void;
  /** Обновить силу привычек (вызывается при загрузке приложения) */
  updateHabitsStrength: () => void;
  /** Очистить previousHabitsState после N действий */
  clearPreviousStateIfNeeded: () => void;
}