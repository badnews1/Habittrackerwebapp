/**
 * Утилиты для работы с привычками
 * 
 * @module modules/habit-tracker/features/habits/utils
 * @created 22 ноября 2025
 */

import { Habit } from '@/modules/habit-tracker/types';
import { declineDays, declineTimes } from '@/shared/utils/text';

/**
 * Проверяет, выполнена ли привычка на заданную дату
 * 
 * Для бинарных привычек: проверяет значение true
 * Для измеримых привычек: проверяет соответствие значения целевым критериям
 * 
 * @param habit - Привычка для проверки
 * @param dateStr - Дата в формате строки (YYYY-MM-DD)
 * @returns true если привычка выполнена, иначе false
 */
export function isHabitCompletedForDate(habit: Habit, dateStr: string): boolean {
  const value = habit.completions?.[dateStr];
  
  // Если нет значения, привычка не выполнена
  if (value === undefined || value === null || value === false) {
    return false;
  }
  
  // Для binary типа - просто проверяем boolean
  if (habit.type === 'binary') {
    return value === true;
  }
  
  // Для measurable типа - проверяем числовое значение
  if (habit.type === 'measurable') {
    // Если значение true (старый формат) - считаем выполненным
    if (value === true) return true;
    
    // Если значение число - проверяем относительно цели
    if (typeof value === 'number') {
      const targetValue = habit.targetValue;
      const targetType = habit.targetType || 'min';
      
      // Если нет цели, считаем любое число выполнением
      if (targetValue === undefined || targetValue === null) {
        return value > 0;
      }
      
      // Проверяем соответствие цели
      if (targetType === 'min') {
        return value >= targetValue;
      } else { // max
        return value <= targetValue;
      }
    }
    
    return false;
  }
  
  return false;
}

/**
 * Получает пропорциональное значение выполнения (0-100) для расчёта EMA
 * 
 * Для бинарных привычек: возвращает 100 если выполнено, 0 если нет
 * 
 * Для измеримых привычек: возвращает пропорциональное значение на основе факта vs цели
 * 
 * Примеры для targetType 'min' (не меньше):
 *   - Цель: 10 страниц, Факт: 9  → 90%  (частичное выполнение засчитывается)
 *   - Цель: 10 страниц, Факт: 10 → 100% (цель достигнута)
 *   - Цель: 10 страниц, Факт: 15 → 100% (ограничено максимумом, перевыполнение не штрафуется)
 * 
 * Примеры для targetType 'max' (не больше):
 *   - Цель: 5 сигарет, Факт: 0  → 100% (идеально)
 *   - Цель: 5 сигарет, Факт: 5  → 100% (на пределе)
 *   - Цель: 5 сигарет, Факт: 7.5 → 50%  (50% превышения = 50% штрафа)
 *   - Цель: 5 сигарет, Факт: 10 → 0%   (100% превышения = полный штраф)
 * 
 * @param habit - Привычка для расчёта
 * @param dateStr - Дата в формате строки (YYYY-MM-DD)
 * @returns Пропорциональное значение от 0 до 100
 */
export function getCompletionValueForDate(habit: Habit, dateStr: string): number {
  const value = habit.completions?.[dateStr];
  
  // Если нет значения, возвращаем 0
  if (value === undefined || value === null || value === false) {
    return 0;
  }
  
  // Для binary типа - возвращаем 100 или 0
  if (habit.type === 'binary') {
    return value === true ? 100 : 0;
  }
  
  // Для measurable типа - рассчитываем пропорциональное значение
  if (habit.type === 'measurable') {
    // Если значение true (старый формат) - возвращаем 100
    if (value === true) return 100;
    
    // Если значение число - рассчитываем пропорцию
    if (typeof value === 'number') {
      const targetValue = habit.targetValue;
      const targetType = habit.targetType || 'min';
      
      // Если нет цели, считаем любое положительное число как 100
      if (targetValue === undefined || targetValue === null || targetValue === 0) {
        return value > 0 ? 100 : 0;
      }
      
      // Рассчитываем пропорциональное значение
      if (targetType === 'min') {
        // Для "не меньше": пропорция от 0 до 100, ограниченная максимумом в 100
        // Например: цель 10, выполнено 9 → 90%, выполнено 10 → 100%, выполнено 15 → 100%
        const proportion = (value / targetValue) * 100;
        return Math.min(proportion, 100);
      } else { // max
        // Для "не больше": 100% если <= цели, штраф если превышено
        // Например: цель 5, выполнено 0 → 100%, выполнено 5 → 100%, выполнено 10 → 0%
        if (value <= targetValue) {
          return 100;
        } else {
          // Превышение: штраф пропорционально превышению
          const excess = value - targetValue;
          const penalty = (excess / targetValue) * 100;
          return Math.max(100 - penalty, 0);
        }
      }
    }
    
    return 0;
  }
  
  return 0;
}

/**
 * Рассчитывает месячную цель на основе настроек частоты
 * 
 * @param frequency - Конфигурация частоты привычки
 * @param daysInMonth - Общее количество дней в месяце
 * @param month - Номер месяца (0-11, опционально для точных расчётов дней недели)
 * @param year - Год (опционально для точных расчётов дней недели)
 * @returns Количество дней, в которые привычка должна быть выполнена в месяце
 */
export function getMonthlyGoalFromFrequency(
  frequency: Habit['frequency'],
  daysInMonth: number,
  month?: number,
  year?: number
): number {
  if (!frequency) return daysInMonth; // По умолчанию: каждый день
  
  switch (frequency.type) {
    case 'daily':
      return daysInMonth;
    
    case 'every_n_days':
      // Каждые N дней - делим количество дней в месяце на период
      return Math.floor(daysInMonth / (frequency.period || 1));
    
    case 'n_times_week':
      // N раз в неделю - умножаем на количество недель в месяце
      const weeksInMonth = daysInMonth / 7;
      return Math.round((frequency.count || 7) * weeksInMonth);
    
    case 'n_times_month':
      // N раз в месяц - просто возвращаем count
      return frequency.count || daysInMonth;
    
    case 'n_times_in_m_days':
      // N раз в M дней - масштабируем на месяц
      const period = frequency.period || 7;
      const count = frequency.count || 1;
      const periodsInMonth = daysInMonth / period;
      return Math.round(count * periodsInMonth);
    
    case 'by_days_of_week':
      // По дням недели - считаем реальное количество выбранных дней в месяце
      const selectedDays = frequency.daysOfWeek || [];
      if (selectedDays.length === 0) return 0;
      
      // Если переданы month и year, считаем точно
      if (month !== undefined && year !== undefined) {
        let totalDays = 0;
        // Для каждого выбранного дня недели считаем сколько раз он встречается в месяце
        selectedDays.forEach(dayOfWeek => {
          // dayOfWeek: 0 = Пн, 1 = Вт, ..., 6 = Вс
          // Date.getDay(): 0 = Вс, 1 = Пн, ..., 6 = Сб
          const targetDay = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
          
          // Считаем сколько раз встречается этот день недели
          let occurrences = 0;
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            if (date.getDay() === targetDay) {
              occurrences++;
            }
          }
          totalDays += occurrences;
        });
        return totalDays;
      }
      
      // Fallback: среднее значение
      const daysCount = selectedDays.length;
      const weeksInMonth2 = daysInMonth / 7;
      return Math.round(daysCount * weeksInMonth2);
    
    default:
      return daysInMonth;
  }
}

/**
 * Проверяет, требуется ли выполнение привычки на заданную дату на основе частоты
 * 
 * @param frequency - Конфигурация частоты привычки
 * @param date - Дата для проверки
 * @returns true если привычка требуется на эту дату, иначе false
 */
export function isRequiredByFrequency(frequency: Habit['frequency'], date: Date): boolean {
  if (!frequency || frequency.type === 'daily') {
    return true;
  }
  
  switch (frequency.type) {
    case 'every_n_days': {
      const period = frequency.period || 1;
      const dayOfMonth = date.getDate();
      return dayOfMonth % period === 0;
    }
    
    case 'n_times_week': {
      const count = frequency.count || 7;
      const dayOfWeek = date.getDay();
      const daysOfWeek = frequency.daysOfWeek || [];
      return daysOfWeek.includes(dayOfWeek) && daysOfWeek.length <= count;
    }
    
    case 'n_times_month': {
      const count = frequency.count || 1;
      const dayOfMonth = date.getDate();
      return dayOfMonth <= count;
    }
    
    case 'n_times_in_m_days': {
      const count = frequency.count || 1;
      const period = frequency.period || 7;
      const dayOfMonth = date.getDate();
      return dayOfMonth % period === 0 && dayOfMonth <= count * period;
    }
    
    case 'by_days_of_week': {
      const days = frequency.daysOfWeek || [];
      const dayOfWeek = date.getDay();
      return days.includes(dayOfWeek);
    }
    
    default:
      return true;
  }
}

/**
 * Форматирует настройки частоты в читаемую строку на русском языке
 * 
 * @param frequency - Конфигурация частоты привычки
 * @returns Отформатированная строка частоты
 */
export function formatFrequency(frequency: Habit['frequency']): string {
  if (!frequency || frequency.type === 'daily') {
    return 'Каждый день';
  }
  
  switch (frequency.type) {
    case 'every_n_days': {
      const period = frequency.period || 1;
      return `Каждые ${period} ${declineDays(period)}`;
    }
    
    case 'n_times_week': {
      const count = frequency.count || 7;
      return `${count} ${declineTimes(count)} в неделю`;
    }
    
    case 'n_times_month': {
      const count = frequency.count || 1;
      return `${count} ${declineTimes(count)} в месяц`;
    }
    
    case 'n_times_in_m_days': {
      const count = frequency.count || 1;
      const period = frequency.period || 7;
      return `${count} ${declineTimes(count)} в ${period} ${declineDays(period)}`;
    }
    
    case 'by_days_of_week': {
      const days = frequency.daysOfWeek || [];
      const count = frequency.count || days.length;
      const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      
      if (days.length === 7) {
        return 'Каждый день';
      }
      
      if (days.length === 0) {
        return 'Дни не выбраны';
      }
      
      return `${count} ${declineTimes(count)}/нед. • ${days.map(d => dayNames[d]).join(', ')}`;
    }
    
    default:
      return 'Каждый день';
  }
}