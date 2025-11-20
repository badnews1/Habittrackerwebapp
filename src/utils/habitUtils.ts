import { Habit } from '../types/habit';
import { declineDays, declineTimes } from './declineWords';

/**
 * Checks if a habit is completed for a given date
 * For binary habits: checks if value is true
 * For measurable habits: checks if value meets the target criteria
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
 * Gets proportional completion value (0-100) for EMA calculation
 * 
 * For binary habits: returns 100 if completed, 0 if not
 * 
 * For measurable habits: returns proportional value based on actual vs target
 * 
 * Examples for targetType 'min' (не меньше):
 *   - Target: 10 pages, Actual: 9  → 90%  (partial effort rewarded)
 *   - Target: 10 pages, Actual: 10 → 100% (goal met)
 *   - Target: 10 pages, Actual: 15 → 100% (capped at max, overachievement not penalized)
 * 
 * Examples for targetType 'max' (не больше):
 *   - Target: 5 cigarettes, Actual: 0  → 100% (perfect)
 *   - Target: 5 cigarettes, Actual: 5  → 100% (at limit)
 *   - Target: 5 cigarettes, Actual: 7.5 → 50%  (50% excess = 50% penalty)
 *   - Target: 5 cigarettes, Actual: 10 → 0%   (100% excess = full penalty)
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
 * Calculates monthly goal based on frequency settings
 * 
 * @param frequency - The habit's frequency configuration
 * @param daysInMonth - Total days in the month
 * @param month - Month number (0-11, optional for precise day-of-week calculations)
 * @param year - Year number (optional for precise day-of-week calculations)
 * @returns Number of days the habit should be completed in the month
 */
export function getMonthlyGoalFromFrequency(
  frequency: Habit['frequency'],
  daysInMonth: number,
  month?: number,
  year?: number
): number {
  if (!frequency) return daysInMonth; // Default: every day
  
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
 * Checks if a habit is required to be completed on a given date based on its frequency
 * 
 * @param frequency - The habit's frequency configuration
 * @param date - The date to check
 * @returns True if the habit is required on the given date, false otherwise
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
 * Formats frequency settings into a human-readable string in Russian
 * 
 * @param frequency - The habit's frequency configuration
 * @returns Formatted frequency string
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