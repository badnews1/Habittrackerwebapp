/**
 * Кастомный хук для управления состоянием редактора частоты
 * 
 * Инкапсулирует всю логику:
 * - Хранение локальных значений для каждого типа
 * - Обработка изменений значений
 * - Автоматическое заполнение дефолтами
 * - Валидация всех числовых значений
 * - Безопасная работа с типами без type casting
 * 
 * ВАЖНО: Хук НЕ синхронизирует локальное состояние с пропсами через useEffect,
 * чтобы избежать бесконечных циклов. Вместо этого используется однонаправленный
 * поток данных (Unidirectional Data Flow).
 * 
 * @module modules/habit-tracker/features/frequency/hooks
 * @migrated 22 ноября 2025
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type {
  FrequencyType,
  FrequencyEditorProps,
  LocalFrequencyValues,
} from '../types';
import { DEFAULT_FREQUENCY_VALUES } from '../types';
import { validateCount, validatePeriod } from '../utils';

export const useFrequencyState = (props: FrequencyEditorProps) => {
  const {
    frequencyType,
    frequencyCount,
    frequencyPeriod,
    daysOfWeek,
    onFrequencyTypeChange,
    onFrequencyCountChange,
    onFrequencyPeriodChange,
    onDaysOfWeekChange,
  } = props;

  // Локальное состояние для хранения значений всех типов частоты
  // Инициализируется ОДИН РАЗ при монтировании, дальше живёт независимо
  const [localValues, setLocalValues] = useState<LocalFrequencyValues>(() => ({
    every_n_days: { 
      period: frequencyType === 'every_n_days' ? frequencyPeriod : undefined 
    },
    n_times_week: { 
      count: frequencyType === 'n_times_week' ? frequencyCount : undefined 
    },
    n_times_month: { 
      count: frequencyType === 'n_times_month' ? frequencyCount : undefined 
    },
    n_times_in_m_days: { 
      count: frequencyType === 'n_times_in_m_days' ? frequencyCount : undefined,
      period: frequencyType === 'n_times_in_m_days' ? frequencyPeriod : undefined,
    },
    by_days_of_week: { 
      days: frequencyType === 'by_days_of_week' ? daysOfWeek : undefined 
    },
  }));

  // Ref для доступа к актуальным localValues без пересоздания колбэков
  // ✅ Обновляется АВТОМАТИЧЕСКИ через useEffect после каждого изменения localValues
  const localValuesRef = useRef(localValues);
  useEffect(() => {
    localValuesRef.current = localValues;
  }, [localValues]);

  // Refs для колбэков - стабильные ссылки, избегаем зависимости от пересоздаваемых пропсов
  const callbacksRef = useRef({
    onFrequencyTypeChange,
    onFrequencyCountChange,
    onFrequencyPeriodChange,
    onDaysOfWeekChange,
  });
  useEffect(() => {
    callbacksRef.current = {
      onFrequencyTypeChange,
      onFrequencyCountChange,
      onFrequencyPeriodChange,
      onDaysOfWeekChange,
    };
  }, [onFrequencyTypeChange, onFrequencyCountChange, onFrequencyPeriodChange, onDaysOfWeekChange]);

  /**
   * Обработчик смены типа частоты
   * Применяет сохранённые значения или дефолты
   */
  const handleTypeChange = useCallback((type: FrequencyType) => {
    const callbacks = callbacksRef.current;
    const currentValues = localValuesRef.current;

    callbacks.onFrequencyTypeChange(type);
    
    switch (type) {
      case 'daily':
        // Для daily просто устанавливаем count=7
        callbacks.onFrequencyCountChange(7);
        break;
        
      case 'every_n_days': {
        const finalValue = currentValues.every_n_days.period ?? DEFAULT_FREQUENCY_VALUES.every_n_days.period;
        
        // ✅ Обновляем локальное состояние (ref обновится автоматически через useEffect)
        if (currentValues.every_n_days.period === undefined) {
          setLocalValues(prev => ({
            ...prev,
            every_n_days: { period: finalValue }
          }));
        }
        
        // ✅ Вызываем родительский колбэк
        callbacks.onFrequencyPeriodChange(finalValue);
        break;
      }
        
      case 'n_times_week': {
        const finalValue = currentValues.n_times_week.count ?? DEFAULT_FREQUENCY_VALUES.n_times_week.count;
        
        // ✅ Обновляем локальное состояние (ref обновится автоматически через useEffect)
        if (currentValues.n_times_week.count === undefined) {
          setLocalValues(prev => ({
            ...prev,
            n_times_week: { count: finalValue }
          }));
        }
        
        // ✅ Вызываем родительский колбэк
        callbacks.onFrequencyCountChange(finalValue);
        break;
      }
        
      case 'n_times_month': {
        const finalValue = currentValues.n_times_month.count ?? DEFAULT_FREQUENCY_VALUES.n_times_month.count;
        
        // ✅ Обновляем локальное состояние (ref обновится автоматически через useEffect)
        if (currentValues.n_times_month.count === undefined) {
          setLocalValues(prev => ({
            ...prev,
            n_times_month: { count: finalValue }
          }));
        }
        
        // ✅ Вызываем родительский колбэк
        callbacks.onFrequencyCountChange(finalValue);
        break;
      }
        
      case 'n_times_in_m_days': {
        const finalCount = currentValues.n_times_in_m_days.count ?? DEFAULT_FREQUENCY_VALUES.n_times_in_m_days.count;
        const finalPeriod = currentValues.n_times_in_m_days.period ?? DEFAULT_FREQUENCY_VALUES.n_times_in_m_days.period;
        
        // ✅ Обновляем локальное состояние (ref обновится автоматически через useEffect)
        if (currentValues.n_times_in_m_days.count === undefined || currentValues.n_times_in_m_days.period === undefined) {
          setLocalValues(prev => ({
            ...prev,
            n_times_in_m_days: { count: finalCount, period: finalPeriod }
          }));
        }
        
        // ✅ Вызываем родительские колбэки
        callbacks.onFrequencyCountChange(finalCount);
        callbacks.onFrequencyPeriodChange(finalPeriod);
        break;
      }
        
      case 'by_days_of_week': {
        const days = currentValues.by_days_of_week.days ?? DEFAULT_FREQUENCY_VALUES.by_days_of_week.days;
        
        // Для дней недели не нужно обновлять локальное состояние при переключении типа
        // Просто вызываем колбэки
        callbacks.onDaysOfWeekChange?.(days);
        callbacks.onFrequencyCountChange(days.length);
        break;
      }
        
      default: {
        // ✅ Exhaustiveness check - TypeScript выдаст ошибку, если добавится новый тип
        const _exhaustiveCheck: never = type;
        return _exhaustiveCheck;
      }
    }
  }, []); // ✅ ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ - НИКОГДА НЕ ПЕРЕСОЗДАЁТСЯ!

  /**
   * Универсальный обработчик изменения count
   */
  const handleCountChange = useCallback((value: string, type: FrequencyType) => {
    const numValue = value === '' ? undefined : parseInt(value);
    
    // ✅ Валидация count
    const currentPeriod = type === 'n_times_in_m_days' ? localValuesRef.current.n_times_in_m_days.period : undefined;
    const validation = validateCount(numValue, type, currentPeriod);
    
    // Если невалидно (NaN, negative, zero) - игнорируем
    if (!validation.isValid) {
      return;
    }
    
    // Используем скорректированное значение (если было clamping)
    const finalValue = validation.value;
    
    // ✅ Универсальное обновление локального состояния
    setLocalValues(prev => {
      switch (type) {
        case 'n_times_week':
          return { ...prev, n_times_week: { count: finalValue } };
        case 'n_times_month':
          return { ...prev, n_times_month: { count: finalValue } };
        case 'n_times_in_m_days':
          return { ...prev, n_times_in_m_days: { ...prev.n_times_in_m_days, count: finalValue } };
        default:
          return prev;
      }
    });
    
    // ✅ Вызываем родительский колбэк
    if (finalValue !== undefined) {
      callbacksRef.current.onFrequencyCountChange(finalValue);
    }
  }, []); // ✅ ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ

  /**
   * Универсальный обработчик изменения period
   */
  const handlePeriodChange = useCallback((value: string, type: FrequencyType) => {
    const numValue = value === '' ? undefined : parseInt(value);
    
    // ✅ Валидация period
    const validation = validatePeriod(numValue, type);
    
    // Если невалидно (NaN, negative, zero) - игнорируем
    if (!validation.isValid) {
      return;
    }
    
    // Используем скорректированное значение (если было clamping)
    const finalValue = validation.value;
    
    // ✅ Обновляем локальное состояние (ref обновится автоматически через useEffect)
    if (type === 'every_n_days') {
      setLocalValues(prev => ({
        ...prev,
        every_n_days: { period: finalValue }
      }));
    } else if (type === 'n_times_in_m_days') {
      // ⚠️ КРИТИЧНО: При изменении period нужно перевалидировать count
      // Если count > новый period, ограничиваем count до period
      const currentCount = localValuesRef.current.n_times_in_m_days.count;
      let correctedCount = currentCount;
      
      if (currentCount !== undefined && finalValue !== undefined && currentCount > finalValue) {
        correctedCount = finalValue;
        // Обновляем count в родительском компоненте
        callbacksRef.current.onFrequencyCountChange(correctedCount);
      }
      
      setLocalValues(prev => ({
        ...prev,
        n_times_in_m_days: { 
          count: correctedCount,
          period: finalValue 
        }
      }));
    }
    
    // ✅ Вызываем родительский колбэк
    if (finalValue !== undefined) {
      callbacksRef.current.onFrequencyPeriodChange(finalValue);
    }
  }, []); // ✅ ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ

  /**
   * Обработчик изменения дней недели
   */
  const handleDaysOfWeekChange = useCallback((days: number[]) => {
    // ✅ Обновляем локальное состояние (ref обновится автоматически через useEffect)
    setLocalValues(prev => ({
      ...prev,
      by_days_of_week: { days }
    }));
    
    // ✅ Вызываем родительские колбэки
    const callbacks = callbacksRef.current;
    callbacks.onDaysOfWeekChange?.(days);
    callbacks.onFrequencyCountChange(days.length);
  }, []); // ✅ ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ

  /**
   * Автозаполнение дефолтным значением при blur
   * Вызывается только если поле пустое
   */
  const handleCountBlur = useCallback((type: FrequencyType) => {
    // ✅ Берём актуальное значение из ref (а не из параметра!)
    const currentValues = localValuesRef.current;
    
    let currentValue: number | undefined;
    let defaultValue: number | undefined;
    
    // ✅ Получаем текущее и дефолтное значение в зависимости от типа
    switch (type) {
      case 'n_times_week':
        currentValue = currentValues.n_times_week.count;
        defaultValue = DEFAULT_FREQUENCY_VALUES.n_times_week.count;
        break;
      case 'n_times_month':
        currentValue = currentValues.n_times_month.count;
        defaultValue = DEFAULT_FREQUENCY_VALUES.n_times_month.count;
        break;
      case 'n_times_in_m_days':
        currentValue = currentValues.n_times_in_m_days.count;
        defaultValue = DEFAULT_FREQUENCY_VALUES.n_times_in_m_days.count;
        break;
      default:
        // Для других типов count не используется
        return;
    }

    // Только если значение пустое (undefined) — заполняем дефолтом
    if (currentValue !== undefined || !defaultValue) return;
    
    // ✅ Универсальное обновление локального состояния
    setLocalValues(prev => {
      switch (type) {
        case 'n_times_week':
          return { ...prev, n_times_week: { count: defaultValue } };
        case 'n_times_month':
          return { ...prev, n_times_month: { count: defaultValue } };
        case 'n_times_in_m_days':
          return { ...prev, n_times_in_m_days: { ...prev.n_times_in_m_days, count: defaultValue } };
        default:
          return prev;
      }
    });
    
    // ✅ Вызываем родительский колбэк
    callbacksRef.current.onFrequencyCountChange(defaultValue);
  }, []); // ✅ ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ

  /**
   * Автозаполнение дефолтным значением period при blur
   * Вызывается только если поле пустое
   */
  const handlePeriodBlur = useCallback((type: FrequencyType) => {
    // ✅ Берём актуальное значение из ref (а не из параметра!)
    const currentValues = localValuesRef.current;
    
    let currentValue: number | undefined;
    let defaultValue: number | undefined;
    
    // ✅ Получаем текущее и дефолтное значение в зависимости от типа
    switch (type) {
      case 'every_n_days':
        currentValue = currentValues.every_n_days.period;
        defaultValue = DEFAULT_FREQUENCY_VALUES.every_n_days.period;
        break;
      case 'n_times_in_m_days':
        currentValue = currentValues.n_times_in_m_days.period;
        defaultValue = DEFAULT_FREQUENCY_VALUES.n_times_in_m_days.period;
        break;
      default:
        // Для других типов period не используется
        return;
    }

    // Только если значение пустое (undefined) — заполняем дефолтом
    if (currentValue !== undefined || !defaultValue) return;
    
    // ✅ Универсальное обновление локального состояния
    setLocalValues(prev => {
      switch (type) {
        case 'every_n_days':
          return { ...prev, every_n_days: { period: defaultValue } };
        case 'n_times_in_m_days':
          return { ...prev, n_times_in_m_days: { ...prev.n_times_in_m_days, period: defaultValue } };
        default:
          return prev;
      }
    });
    
    // ✅ Вызываем родительский колбэк
    callbacksRef.current.onFrequencyPeriodChange(defaultValue);
  }, []); // ✅ ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ

  // Мемоизируем возвращаемый объект для стабильности ссылок
  return useMemo(() => ({
    localValues,
    handleTypeChange,
    handleCountChange,
    handlePeriodChange,
    handleDaysOfWeekChange,
    handleCountBlur,
    handlePeriodBlur,
  }), [
    localValues,
    handleTypeChange,
    handleCountChange,
    handlePeriodChange,
    handleDaysOfWeekChange,
    handleCountBlur,
    handlePeriodBlur,
  ]);
};
