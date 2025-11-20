/**
 * Available units for measurable habits
 * These units are used in habit tracking to measure progress
 */
export const UNIT_OPTIONS = [
  // Counting units
  'разы',
  'штуки',
  'баллы',
  
  // Time units
  'минуты',
  'часы',
  
  // Distance & movement
  'шаги',
  'километры',
  'метры',
  'подходы',
  
  // Health & nutrition
  'калории',
  'килограммы',
  'граммы',
  'стаканы',
  'литры',
  'милилитры',
  'порции',
  'чашки',
  
  // Reading & learning
  'страницы',
  'слова',
  'главы',
  'задачи',
  
  // Currency
  'руб.',
  '$',
  '€',
] as const;

/**
 * Type representing all possible unit values
 */
export type UnitOption = typeof UNIT_OPTIONS[number];

/**
 * Default unit for measurable habits
 */
export const DEFAULT_UNIT = 'разы';
