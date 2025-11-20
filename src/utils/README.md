# 🛠️ Утилиты проекта

> Набор вспомогательных функций и инструментов для работы с данными

---

## 📝 Logger — Система логирования

**Файл:** `logger.ts`  
**Документация:** `/docs/LOGGER_USAGE.md` | `/docs/LOGGER_QUICKSTART.md`

### Быстрый старт:

```typescript
import { logger, habitLogger } from './utils/logger';

// Базовое использование
logger.debug('Debug info', data);
logger.info('Important event', data);
logger.warn('Warning message', data);
logger.error('Error occurred', error);
logger.success('Success!');

// Модульный логгер (рекомендуется!)
habitLogger.info('Habit added', habit);
// Вывод: ℹ️ [INFO] [HABITS] Habit added {...}

// Группировка
logger.group('Operation', () => {
  logger.debug('Step 1');
  logger.debug('Step 2');
  logger.success('Done!');
});

// Измерение времени
logger.time('Calculate');
doWork();
logger.timeEnd('Calculate');
```

### Доступные модульные логгеры:

- `habitLogger` — работа с привычками
- `strengthLogger` — расчёт силы привычки
- `frequencyLogger` — частота выполнения
- `categoryLogger` — категории
- `storageLogger` — localStorage
- `statsLogger` — статистика
- `uiLogger` — UI события
- `reminderLogger` — напоминания
- `validationLogger` — валидация
- `initLogger` — инициализация

---

## 📅 Работа с датами

**Файл:** `dateUtils.ts`

Утилиты для форматирования, парсинга и вычислений с датами.

---

## 💪 Расчёт силы привычки

**Файлы:** `strengthCalculator.ts`, `strengthHistory.ts`  
**Константы:** `/constants/strength.ts` (EMA_PERIOD = 32)

### `strengthCalculator.ts`
Инкрементальный расчёт силы привычки с оптимизацией для текущего дня.

```typescript
import { recalculateStrength } from './utils/strengthCalculator';

const updatedHabit = recalculateStrength(habit, changedDate);
```

### `strengthHistory.ts` ⭐ НОВОЕ
Универсальные функции для построения истории силы привычки и EMA расчётов.

```typescript
import { 
  calculateStrengthHistory,
  calculateStrengthAtDate,
  applyEMAStep 
} from './utils/strengthHistory';

// Полная история для графика
const history = calculateStrengthHistory(habit);
// → [{date: '2025-01-01', strength: 10}, {date: '2025-01-02', strength: 15}, ...]

// Сила на конкретную дату
const strength = calculateStrengthAtDate(habit, '2025-11-20');

// Применить один шаг EMA
const newStrength = applyEMAStep(currentStrength, completionValue, EMA_PERIOD);
```

**Алгоритм:** EMA (Exponential Moving Average) с периодом N=32 (~1 месяц).

---

## 📊 Работа с частотой

**Файл:** `frequencyValidation.ts`

Валидация и обработка настроек частоты выполнения привычек.

---

## 🏷️ Единицы измерения

**Файл:** `unitUtils.ts`

Работа с единицами измерения для измеримых привычек.

---

## 🔤 Склонение слов

**Файл:** `declineWords.ts`

Правильное склонение числительных для русского языка.

---

## 🎯 Работа с привычками

**Файл:** `habitUtils.ts`

Вспомогательные функции для обработки данных привычек.

---

## 🎨 Инициализация категорий

**Файл:** `initializeCategories.ts`

Создание категорий по умолчанию при первом запуске.

---

## 📚 Дополнительная документация

- **Logger:** `/docs/LOGGER_USAGE.md` — полное руководство
- **Logger:** `/docs/LOGGER_QUICKSTART.md` — краткая шпаргалка
- **Константы:** `/constants/README.md` — доступные константы

---

**Обновлено:** 20 ноября 2025