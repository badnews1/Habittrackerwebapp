/**
 * Slice для управления формой добавления привычки
 * 
 * Содержит всю логику работы с формой:
 * - Состояние полей (name, description, icon, category, type, frequency, reminders)
 * - UI состояние (currentStep, openPicker, currentIconPage)
 * - Handlers для напоминаний, навигации по шагам, валидации
 * - Инициализация формы с начальными данными
 * - Сброс формы после submit
 * 
 * @module core/store/slices/addHabitForm
 */

import { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import type { FrequencyConfig, Reminder, HabitType } from '@/modules/habit-tracker/types';

/**
 * Данные для инициализации формы
 */
export interface InitializeFormData {
  name?: string;
  description?: string;
  icon?: string;
  category?: string;
  type?: HabitType;
  frequency?: FrequencyConfig;
  reminders?: Reminder[];
  unit?: string;
  targetValue?: string;
  targetType?: 'min' | 'max';
}

/**
 * Действия формы добавления привычки
 */
export interface AddHabitFormActions {
  // ==================== ИНИЦИАЛИЗАЦИЯ ====================
  /** Инициализировать форму с начальными данными */
  initializeAddHabitForm: (initialData?: InitializeFormData) => void;
  /** Сбросить форму к начальному состоянию */
  resetAddHabitForm: () => void;
  
  // ==================== SETTERS: ОСНОВНЫЕ ПОЛЯ ====================
  /** Установить имя привычки */
  setFormName: (name: string) => void;
  /** Установить описание привычки */
  setFormDescription: (description: string) => void;
  /** Установить иконку привычки */
  setFormIcon: (icon: string) => void;
  /** Установить категорию привычки */
  setFormCategory: (category: string) => void;
  /** Установить тип привычки */
  setFormType: (type: HabitType) => void;
  
  // ==================== SETTERS: ЧАСТОТА ====================
  /** Установить частоту выполнения */
  setFormFrequency: (frequency: FrequencyConfig) => void;
  /** Установить backup частоты (для отмены изменений) */
  setFormFrequencyBackup: (backup: FrequencyConfig | null) => void;
  
  // ==================== SETTERS: НАПОМИНАНИЯ ====================
  /** Установить список напоминаний */
  setFormReminders: (reminders: Reminder[]) => void;
  /** Добавить новое напоминание */
  addFormReminder: () => void;
  /** Удалить напоминание */
  deleteFormReminder: (reminderId: string) => void;
  /** Переключить активность напоминания */
  toggleFormReminder: (reminderId: string) => void;
  /** Обновить время напоминания */
  updateFormReminderTime: (reminderId: string, time: string) => void;
  
  // ==================== SETTERS: ИЗМЕРИМАЯ ПРИВЫЧКА ====================
  /** Установить единицу измерения */
  setFormUnit: (unit: string) => void;
  /** Установить целевое значение */
  setFormTargetValue: (value: string) => void;
  /** Установить тип цели (минимум/максимум) */
  setFormTargetType: (type: 'min' | 'max') => void;
  
  // ==================== SETTERS: UI ====================
  /** Установить текущий шаг */
  setFormCurrentStep: (step: 1 | 2 | 3) => void;
  /** Установить открытый picker */
  setFormOpenPicker: (picker: 'unit' | 'targetType' | 'icon' | 'category' | 'type' | null) => void;
  /** Установить текущую страницу иконок */
  setFormCurrentIconPage: (page: number) => void;
  
  // ==================== НАВИГАЦИЯ ПО ШАГАМ ====================
  /** Перейти к следующему шагу */
  handleFormNextStep: () => void;
  /** Вернуться к предыдущему шагу */
  handleFormPreviousStep: () => void;
  /** Получить общее количество шагов */
  getFormTotalSteps: () => number;
  /** Получить номер текущего шага для отображения */
  getFormDisplayStep: () => number;
  
  // ==================== ВАЛИДАЦИЯ ====================
  /** Можно ли перейти с шага 1 */
  canProceedFromFormStep1: () => boolean;
  /** Можно ли перейти с шага 2 */
  canProceedFromFormStep2: () => boolean;
  /** Можно ли отправить форму */
  canSubmitForm: () => boolean;
  
  // ==================== ПОЛУЧЕНИЕ ДАННЫХ ====================
  /** Получить данные формы для отправки */
  getFormData: () => {
    name: string;
    description: string;
    icon: string;
    category: string;
    type: HabitType;
    frequency: FrequencyConfig;
    reminders: Reminder[];
    unit: string;
    targetValue: string;
    targetType: 'min' | 'max';
  };
}

/**
 * Начальное состояние формы
 */
const getInitialFormState = () => ({
  name: '',
  description: '',
  icon: 'dumbbell',
  category: '',
  type: 'binary' as HabitType,
  frequency: {
    type: 'daily' as const,
    count: 7,
    period: 7,
    daysOfWeek: [],
  },
  frequencyBackup: null,
  reminders: [],
  measurable: {
    unit: '',
    targetValue: '',
    targetType: 'min' as const,
  },
  currentStep: 1 as const,
  openPicker: null,
  currentIconPage: 0,
  isInitialized: false,
});

/**
 * Создать slice для формы добавления привычки
 */
export const createAddHabitFormSlice: StateCreator<
  HabitsState,
  [],
  [],
  AddHabitFormActions
> = (set, get) => ({
  // ==================== ИНИЦИАЛИЗАЦИЯ ====================
  initializeAddHabitForm: (initialData) => {
    set((state) => ({
      addHabitForm: {
        name: initialData?.name || '',
        description: initialData?.description || '',
        icon: initialData?.icon || 'dumbbell',
        category: initialData?.category || '',
        type: initialData?.type || 'binary',
        frequency: initialData?.frequency || {
          type: 'daily',
          count: 7,
          period: 7,
          daysOfWeek: [],
        },
        frequencyBackup: null,
        reminders: initialData?.reminders || [],
        measurable: {
          unit: initialData?.unit || '',
          targetValue: initialData?.targetValue?.toString() || '',
          targetType: initialData?.targetType || 'min',
        },
        currentStep: 1,
        openPicker: null,
        currentIconPage: 0,
        isInitialized: true,
      },
    }));
  },

  resetAddHabitForm: () => {
    set((state) => ({
      addHabitForm: getInitialFormState(),
    }));
  },

  // ==================== SETTERS: ОСНОВНЫЕ ПОЛЯ ====================
  setFormName: (name) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, name },
    }));
  },

  setFormDescription: (description) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, description },
    }));
  },

  setFormIcon: (icon) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, icon },
    }));
  },

  setFormCategory: (category) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, category },
    }));
  },

  setFormType: (type) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, type },
    }));
  },

  // ==================== SETTERS: ЧАСТОТА ====================
  setFormFrequency: (frequency) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, frequency },
    }));
  },

  setFormFrequencyBackup: (backup) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, frequencyBackup: backup },
    }));
  },

  // ==================== SETTERS: НАПОМИНАНИЯ ====================
  setFormReminders: (reminders) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, reminders },
    }));
  },

  addFormReminder: () => {
    set((state) => {
      const newReminder: Reminder = {
        id: `reminder-${Date.now()}`,
        time: '09:00',
        enabled: true,
      };
      return {
        addHabitForm: {
          ...state.addHabitForm,
          reminders: [...state.addHabitForm.reminders, newReminder],
        },
      };
    });
  },

  deleteFormReminder: (reminderId) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        reminders: state.addHabitForm.reminders.filter((r) => r.id !== reminderId),
      },
    }));
  },

  toggleFormReminder: (reminderId) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        reminders: state.addHabitForm.reminders.map((r) =>
          r.id === reminderId ? { ...r, enabled: !r.enabled } : r
        ),
      },
    }));
  },

  updateFormReminderTime: (reminderId, time) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        reminders: state.addHabitForm.reminders.map((r) =>
          r.id === reminderId ? { ...r, time } : r
        ),
      },
    }));
  },

  // ==================== SETTERS: ИЗМЕРИМАЯ ПРИВЫЧКА ====================
  setFormUnit: (unit) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        measurable: { ...state.addHabitForm.measurable, unit },
      },
    }));
  },

  setFormTargetValue: (targetValue) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        measurable: { ...state.addHabitForm.measurable, targetValue },
      },
    }));
  },

  setFormTargetType: (targetType) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        measurable: { ...state.addHabitForm.measurable, targetType },
      },
    }));
  },

  // ==================== SETTERS: UI ====================
  setFormCurrentStep: (currentStep) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, currentStep },
    }));
  },

  setFormOpenPicker: (openPicker) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, openPicker },
    }));
  },

  setFormCurrentIconPage: (currentIconPage) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, currentIconPage },
    }));
  },

  // ==================== НАВИГАЦИЯ ПО ШАГАМ ====================
  handleFormNextStep: () => {
    const { addHabitForm } = get();
    
    // Проверка: должно быть заполнено имя
    if (!addHabitForm.name.trim()) return;

    if (addHabitForm.currentStep === 1) {
      // Если binary тип - переходим сразу на шаг 3
      // Если measurable тип - переходим на шаг 2
      const nextStep = addHabitForm.type === 'binary' ? 3 : 2;
      set((state) => ({
        addHabitForm: { ...state.addHabitForm, currentStep: nextStep as 1 | 2 | 3 },
      }));
    } else if (addHabitForm.currentStep === 2) {
      // Со шага 2 (measurable настройки) переходим на шаг 3
      set((state) => ({
        addHabitForm: { ...state.addHabitForm, currentStep: 3 },
      }));
    }
  },

  handleFormPreviousStep: () => {
    const { addHabitForm } = get();

    if (addHabitForm.currentStep === 3) {
      // Если binary тип - возвращаемся на шаг 1
      // Если measurable тип - возвращаемся на шаг 2
      const prevStep = addHabitForm.type === 'binary' ? 1 : 2;
      set((state) => ({
        addHabitForm: { ...state.addHabitForm, currentStep: prevStep as 1 | 2 | 3 },
      }));
    } else if (addHabitForm.currentStep === 2) {
      // Со шага 2 возвращаемся на шаг 1
      set((state) => ({
        addHabitForm: { ...state.addHabitForm, currentStep: 1 },
      }));
    }
  },

  getFormTotalSteps: () => {
    const { addHabitForm } = get();
    return addHabitForm.type === 'binary' ? 2 : 3;
  },

  getFormDisplayStep: () => {
    const { addHabitForm } = get();
    
    if (addHabitForm.currentStep === 1) return 1;
    if (addHabitForm.currentStep === 2) return 2; // Только для measurable
    if (addHabitForm.currentStep === 3) {
      return addHabitForm.type === 'binary' ? 2 : 3;
    }
    return 1;
  },

  // ==================== ВАЛИДАЦИЯ ====================
  canProceedFromFormStep1: () => {
    const { addHabitForm } = get();
    return addHabitForm.name.trim() !== '';
  },

  canProceedFromFormStep2: () => {
    const { addHabitForm } = get();
    return (
      addHabitForm.name.trim() !== '' &&
      addHabitForm.measurable.unit.trim() !== '' &&
      addHabitForm.measurable.targetValue.trim() !== ''
    );
  },

  canSubmitForm: () => {
    const { addHabitForm } = get();
    return addHabitForm.name.trim() !== '';
  },

  // ==================== ПОЛУЧЕНИЕ ДАННЫХ ====================
  getFormData: () => {
    const { addHabitForm } = get();
    
    return {
      name: addHabitForm.name.trim(),
      description: addHabitForm.description.trim(),
      icon: addHabitForm.icon,
      category: addHabitForm.category,
      type: addHabitForm.type,
      frequency: {
        ...addHabitForm.frequency,
        // Убираем daysOfWeek если тип не 'by_days_of_week'
        daysOfWeek: addHabitForm.frequency.type === 'by_days_of_week' 
          ? addHabitForm.frequency.daysOfWeek 
          : undefined,
      },
      reminders: addHabitForm.reminders,
      unit: addHabitForm.measurable.unit,
      targetValue: addHabitForm.measurable.targetValue,
      targetType: addHabitForm.measurable.targetType,
    };
  },
});