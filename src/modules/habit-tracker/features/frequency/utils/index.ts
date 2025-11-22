/**
 * Публичный API модуля утилит Frequency
 * 
 * @module modules/habit-tracker/features/frequency/utils
 */

export {
  validateCount,
  validatePeriod,
  getMinValue,
  getMaxValue,
  FREQUENCY_LIMITS,
} from './frequencyValidation';

export type { ValidationResult } from './frequencyValidation';
