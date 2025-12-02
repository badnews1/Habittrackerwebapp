/**
 * Утилита для работы с переводами единиц измерения
 * 
 * Решает проблему совместимости сохранённых значений единиц при переключении языка.
 * Хранит маппинг между ключами единиц и их переводами на разных языках.
 * 
 * @module shared/lib/units/unitTranslation
 * @created 2 декабря 2025
 */

/**
 * Универсальные ключи единиц измерения (language-agnostic)
 * Используются как промежуточный формат для конвертации между языками
 */
export const UNIT_KEYS = {
  // Счёт
  times: 'times',
  pieces: 'pieces',
  points: 'points',
  sets: 'sets',
  tasks: 'tasks',
  
  // Время
  minutes: 'minutes',
  hours: 'hours',
  
  // Расстояние
  steps: 'steps',
  kilometers: 'kilometers',
  meters: 'meters',
  
  // Вес
  kilograms: 'kilograms',
  grams: 'grams',
  
  // Объём
  glasses: 'glasses',
  liters: 'liters',
  milliliters: 'milliliters',
  portions: 'portions',
  cups: 'cups',
  
  // Калории
  calories: 'calories',
  
  // Чтение
  pages: 'pages',
  words: 'words',
  chapters: 'chapters',
  
  // Валюта
  rub: 'rub',
  usd: 'usd',
  eur: 'eur',
} as const;

/**
 * Маппинг: русские значения → ключи
 */
const RU_TO_KEY: Record<string, string> = {
  'разы': UNIT_KEYS.times,
  'штуки': UNIT_KEYS.pieces,
  'баллы': UNIT_KEYS.points,
  'подходы': UNIT_KEYS.sets,
  'задачи': UNIT_KEYS.tasks,
  'минуты': UNIT_KEYS.minutes,
  'часы': UNIT_KEYS.hours,
  'шаги': UNIT_KEYS.steps,
  'километры': UNIT_KEYS.kilometers,
  'метры': UNIT_KEYS.meters,
  'килограммы': UNIT_KEYS.kilograms,
  'граммы': UNIT_KEYS.grams,
  'стаканы': UNIT_KEYS.glasses,
  'литры': UNIT_KEYS.liters,
  'милилитры': UNIT_KEYS.milliliters,
  'порции': UNIT_KEYS.portions,
  'чашки': UNIT_KEYS.cups,
  'калории': UNIT_KEYS.calories,
  'страницы': UNIT_KEYS.pages,
  'слова': UNIT_KEYS.words,
  'главы': UNIT_KEYS.chapters,
  'руб.': UNIT_KEYS.rub,
  '$': UNIT_KEYS.usd,
  '€': UNIT_KEYS.eur,
};

/**
 * Маппинг: английские значения → ключи
 */
const EN_TO_KEY: Record<string, string> = {
  'times': UNIT_KEYS.times,
  'pieces': UNIT_KEYS.pieces,
  'points': UNIT_KEYS.points,
  'sets': UNIT_KEYS.sets,
  'tasks': UNIT_KEYS.tasks,
  'minutes': UNIT_KEYS.minutes,
  'hours': UNIT_KEYS.hours,
  'steps': UNIT_KEYS.steps,
  'kilometers': UNIT_KEYS.kilometers,
  'meters': UNIT_KEYS.meters,
  'kilograms': UNIT_KEYS.kilograms,
  'grams': UNIT_KEYS.grams,
  'glasses': UNIT_KEYS.glasses,
  'liters': UNIT_KEYS.liters,
  'milliliters': UNIT_KEYS.milliliters,
  'portions': UNIT_KEYS.portions,
  'cups': UNIT_KEYS.cups,
  'calories': UNIT_KEYS.calories,
  'pages': UNIT_KEYS.pages,
  'words': UNIT_KEYS.words,
  'chapters': UNIT_KEYS.chapters,
  'rub.': UNIT_KEYS.rub,
  '$': UNIT_KEYS.usd,
  '€': UNIT_KEYS.eur,
};

/**
 * Получить ключ единицы из локализованного значения
 * 
 * @param unitValue - локализованное значение единицы (на любом языке)
 * @returns ключ единицы или исходное значение если маппинг не найден
 */
export function getUnitKey(unitValue: string): string {
  // ✅ Fix: noUncheckedIndexedAccess - проверяем существование ключа
  const ruKey = RU_TO_KEY[unitValue];
  if (ruKey) {
    return ruKey;
  }
  
  const enKey = EN_TO_KEY[unitValue];
  if (enKey) {
    return enKey;
  }
  
  // Если не найдено - возвращаем как есть (возможно это уже ключ или кастомное значение)
  return unitValue;
}

/**
 * Получить локализованное значение единицы по ключу
 * 
 * Использует функцию перевода i18next для получения текущей локализации.
 * 
 * @param unitKey - ключ единицы
 * @param t - функция перевода из react-i18next
 * @returns локализованное значение единицы
 */
export function getLocalizedUnit(unitKey: string, t: (key: string) => string): string {
  // Маппинг ключей на пути переводов
  const keyToTranslationPath: Record<string, string> = {
    [UNIT_KEYS.times]: 'units.counting.times',
    [UNIT_KEYS.pieces]: 'units.counting.pieces',
    [UNIT_KEYS.points]: 'units.counting.points',
    [UNIT_KEYS.sets]: 'units.counting.sets',
    [UNIT_KEYS.tasks]: 'units.counting.tasks',
    [UNIT_KEYS.minutes]: 'units.time.minutes',
    [UNIT_KEYS.hours]: 'units.time.hours',
    [UNIT_KEYS.steps]: 'units.distance.steps',
    [UNIT_KEYS.kilometers]: 'units.distance.kilometers',
    [UNIT_KEYS.meters]: 'units.distance.meters',
    [UNIT_KEYS.kilograms]: 'units.weight.kilograms',
    [UNIT_KEYS.grams]: 'units.weight.grams',
    [UNIT_KEYS.glasses]: 'units.volume.glasses',
    [UNIT_KEYS.liters]: 'units.volume.liters',
    [UNIT_KEYS.milliliters]: 'units.volume.milliliters',
    [UNIT_KEYS.portions]: 'units.volume.portions',
    [UNIT_KEYS.cups]: 'units.volume.cups',
    [UNIT_KEYS.calories]: 'units.calories.calories',
    [UNIT_KEYS.pages]: 'units.reading.pages',
    [UNIT_KEYS.words]: 'units.reading.words',
    [UNIT_KEYS.chapters]: 'units.reading.chapters',
    [UNIT_KEYS.rub]: 'units.currency.rub',
    [UNIT_KEYS.usd]: 'units.currency.usd',
    [UNIT_KEYS.eur]: 'units.currency.eur',
  };
  
  const translationPath = keyToTranslationPath[unitKey];
  
  if (translationPath) {
    return t(translationPath);
  }
  
  // Если перевод не найден - возвращаем ключ как есть
  return unitKey;
}

/**
 * Конвертировать сохранённую единицу в текущую локализацию
 * 
 * Эта функция решает проблему совместимости:
 * - Старые привычки могут иметь единицы на русском ("километры")
 * - При переключении на английский нужно показать "kilometers"
 * 
 * @param savedUnit - сохранённое значение единицы (может быть на любом языке)
 * @param t - функция перевода из react-i18next
 * @returns локализованное значение для текущего языка
 */
export function convertUnitToCurrentLanguage(savedUnit: string, t: (key: string) => string): string {
  // 1. Получаем универсальный ключ из сохранённого значения
  const unitKey = getUnitKey(savedUnit);
  
  // 2. Получаем локализованное значение для текущего языка
  return getLocalizedUnit(unitKey, t);
}
