/**
 * Начальное состояние Zustand store
 * 
 * Все дефолтные значения для state приложения.
 * Разделение начального состояния улучшает читаемость.
 * 
 * @module app/store/initialState
 * @updated 23 ноября 2025 - миграция categories → tags
 * @updated 1 декабря 2025 - прямой импорт initializeHabitTags для избежания циклической зависимости
 * @updated 2 декабря 2025 - добавлены дефолтные разделы с цветами
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import { initializeHabitTags } from '@/entities/habit/lib/tag-utils';
import { DEFAULT_SECTIONS_WITH_COLORS } from '@/entities/habit';

/**
 * Начальное состояние store (только данные, без actions)
 */
export const getInitialState = () => {
  const initialTags = initializeHabitTags();
  console.log('🔄 getInitialState вызван', {
    tagsCount: initialTags.length,
    tags: initialTags.map(t => t.name),
    sectionsCount: DEFAULT_SECTIONS_WITH_COLORS.length,
    sections: DEFAULT_SECTIONS_WITH_COLORS.map(s => s.name),
  });

  return {
    // ==================== ДАННЫЕ ====================
    habits: [],
    tags: initialTags,
    sections: DEFAULT_SECTIONS_WITH_COLORS,

  // ==================== UI СОСТОЯНИЕ ====================
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),

    // ==================== МОДАЛЬНЫЕ ОКНА ====================
    numericInputModal: null,
    statsModal: null,
    isMonthYearPickerOpen: false,
    isAddHabitModalOpen: false,
    addHabitForm: {
      name: '',
      description: '',
      icon: 'dumbbell',
      tags: [],
      section: 'other',
      type: 'binary',
      frequency: {
        type: 'by_days_of_week',
        count: 7,
        period: 7,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
      reminders: [],
      measurable: {
        unit: '',
        targetValue: '',
        targetType: 'min',
      },
      currentStep: 1,
      openPicker: null,
      isInitialized: false,
    },
  };
};
