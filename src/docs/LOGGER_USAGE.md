# 📝 Руководство по использованию Logger

> Создано: 20 ноября 2025  
> Файл: `/utils/logger.ts`

---

## 📋 Оглавление

1. [Что такое Logger и зачем он нужен](#что-такое-logger)
2. [Быстрый старт](#быстрый-старт)
3. [Базовое использование](#базовое-использование)
4. [Модульные логгеры](#модульные-логгеры)
5. [Группировка логов](#группировка-логов)
6. [Измерение времени](#измерение-времени)
7. [Конфигурация](#конфигурация)
8. [Примеры из реального кода](#примеры-из-реального-кода)
9. [Управление из консоли](#управление-из-консоли)
10. [Фильтрация по модулям](#фильтрация-по-модулям)

---

## Что такое Logger?

**Logger** — это централизованная система логирования, которая заменяет разрозненные `console.log` по всему коду на единый, управляемый интерфейс.

### 🎯 Преимущества:

✅ **Одна строка** — отключить все debug логи перед продакшеном  
✅ **Визуальная группировка** — цвета, иконки, модули  
✅ **Уровни важности** — debug, info, warn, error, success  
✅ **Группировка операций** — связанные логи вместе  
✅ **Измерение производительности** — встроенный таймер  
✅ **Готовность к Sentry** — легко добавить отправку ошибок

---

## Быстрый старт

### 1. Импортировать логгер

```typescript
// Общий логгер
import { logger } from '../utils/logger';

// Или специализированный модульный логгер
import { habitLogger, strengthLogger, storageLogger } from '../utils/logger';
```

### 2. Использовать вместо console.log

```typescript
// ❌ Старый способ
console.log('Habit added:', habit);

// ✅ Новый способ
logger.info('Habit added', habit);
// Вывод: ℹ️ [INFO] Habit added { id: "123", name: "Зарядка", ... }
```

---

## Базовое использование

### 📊 Уровни логирования

#### 🔍 Debug — для отладки (скрывается в продакшене)

```typescript
logger.debug('Calculating strength', { habit, date });
logger.debug('Processing frequency config', frequencyConfig);
```

**Когда использовать:** Временная отладка, детальная трассировка выполнения

#### ℹ️ Info — общая информация

```typescript
logger.info('Habit added successfully', habit);
logger.info('Categories initialized', categories.length);
```

**Когда использовать:** Важные события в жизненном цикле приложения

#### ⚠️ Warn — предупреждения

```typescript
logger.warn('Category already exists', categoryName);
logger.warn('Invalid frequency config, using defaults', config);
```

**Когда использовать:** Проблемы, которые не ломают работу, но требуют внимания

#### ❌ Error — ошибки

```typescript
logger.error('Failed to save habit', error);
logger.error('Invalid data format', { data, expected: 'HabitData' });
```

**Когда использовать:** Критичные ошибки, баги, исключения

#### ✅ Success — успешные операции

```typescript
logger.success('Data saved to localStorage');
logger.success('Habit updated');
```

**Когда использовать:** Подтверждение успешного выполнения важных операций

---

## Модульные логгеры

**Модульные логгеры** автоматически добавляют метку модуля к каждому логу.

### Доступные модули:

```typescript
import {
  habitLogger,      // Работа с привычками
  strengthLogger,   // Расчёт силы
  frequencyLogger,  // Частота выполнения
  categoryLogger,   // Категории
  storageLogger,    // localStorage
  statsLogger,      // Статистика
  uiLogger,         // UI события
  reminderLogger,   // Напоминания
  validationLogger, // Валидация
  initLogger,       // Инициализация
} from '../utils/logger';
```

### Пример использования:

```typescript
// В файле useHabitsActions.ts
import { habitLogger } from '../utils/logger';

const addHabit = (habitData: HabitData) => {
  habitLogger.debug('Adding new habit', habitData);
  
  const newHabit = createHabit(habitData);
  
  habitLogger.info('Habit created', newHabit.id);
  
  setHabits([...habits, newHabit]);
  
  habitLogger.success('Habit added to state');
};

// Консоль:
// 🔍 [DEBUG] [HABITS] Adding new habit { name: "Зарядка", ... }
// ℹ️ [INFO] [HABITS] Habit created 1732...
// ✅ [SUCCESS] [HABITS] Habit added to state
```

### Создание собственного модульного логгера:

```typescript
import { createModuleLogger } from '../utils/logger';

const myLogger = createModuleLogger('MY_MODULE');
myLogger.debug('Custom module log');
// Вывод: 🔍 [DEBUG] [MY_MODULE] Custom module log
```

---

## Группировка логов

Используйте группы для логов связанных операций.

### logger.group() — развёрнутая группа

```typescript
logger.group('Processing habit deletion', () => {
  logger.debug('Finding habit by ID', habitId);
  logger.debug('Checking dependencies...');
  logger.warn('Habit has 30 completions, will be lost');
  logger.success('Habit deleted');
});

// Консоль:
// 📦 Processing habit deletion
//   🔍 [DEBUG] Finding habit by ID 123
//   🔍 [DEBUG] Checking dependencies...
//   ⚠️ [WARN] Habit has 30 completions, will be lost
//   ✅ [SUCCESS] Habit deleted
```

### logger.groupCollapsed() — свёрнутая группа

```typescript
// Группа будет свёрнута по умолчанию
logger.groupCollapsed('Loading initial data', () => {
  logger.debug('Loading from localStorage...');
  logger.debug('Parsing habits...');
  logger.info('Loaded 15 habits');
});
```

**Когда использовать:** Для больших блоков логов, которые не нужно видеть постоянно

---

## Измерение времени

### logger.time() / logger.timeEnd()

```typescript
logger.time('Calculate all statistics');

habits.forEach(habit => {
  calculateStats(habit);
});

logger.timeEnd('Calculate all statistics');

// Консоль:
// ⏱️ Calculate all statistics: 142.35ms
```

### Пример с вложенными таймерами:

```typescript
strengthLogger.time('Full strength recalculation');

habits.forEach(habit => {
  strengthLogger.time(`Habit "${habit.name}"`);
  recalculateStrength(habit);
  strengthLogger.timeEnd(`Habit "${habit.name}"`);
});

strengthLogger.timeEnd('Full strength recalculation');

// Консоль:
// ⏱️ Habit "Зарядка": 2.15ms
// ⏱️ Habit "Медитация": 1.89ms
// ⏱️ Habit "Бег": 1547.23ms  ← Узкое место!
// ⏱️ Full strength recalculation: 1551.27ms
```

---

## Конфигурация

### Изменение настроек во время выполнения:

```typescript
import { updateLoggerConfig } from '../utils/logger';

// Показывать только ошибки
updateLoggerConfig({ minLevel: 'error' });

// Отключить timestamp
updateLoggerConfig({ showTimestamp: false });

// Отключить все логи
updateLoggerConfig({ enabled: false });
```

### Готовые пресеты:

```typescript
import {
  setErrorsOnlyMode,  // Только ошибки
  setVerboseMode,     // Всё подряд
  setSilentMode,      // Отключить всё
} from '../utils/logger';

// Перед продакшеном
setErrorsOnlyMode();

// Для глубокой отладки
setVerboseMode();

// Отключить все логи
setSilentMode();
```

---

## Примеры из реального кода

### 1. Добавление привычки (useHabitsActions.ts)

```typescript
import { habitLogger } from '../utils/logger';

export const useHabitsActions = () => {
  const addHabit = (habitData: HabitData) => {
    habitLogger.group('Adding new habit', () => {
      habitLogger.debug('Input data', habitData);
      
      // Валидация
      if (!habitData.name.trim()) {
        habitLogger.error('Validation failed: empty name');
        return;
      }
      
      habitLogger.debug('Validation passed');
      
      // Создание привычки
      const newHabit: Habit = {
        id: Date.now().toString(),
        ...habitData,
        completions: {},
        strength: 0,
      };
      
      habitLogger.debug('Habit object created', newHabit.id);
      
      // Сохранение
      setHabits(prev => {
        const updated = [...prev, newHabit];
        habitLogger.info(`Total habits: ${updated.length}`);
        return updated;
      });
      
      habitLogger.success('Habit added successfully', newHabit.name);
    });
  };
  
  return { addHabit };
};
```

**Консоль:**
```
📦 Adding new habit
  🔍 [DEBUG] [HABITS] Input data { name: "Зарядка", ... }
  🔍 [DEBUG] [HABITS] Validation passed
  🔍 [DEBUG] [HABITS] Habit object created 1732...
  ℹ️ [INFO] [HABITS] Total habits: 8
  ✅ [SUCCESS] [HABITS] Habit added successfully Зарядка
```

---

### 2. Расчёт силы привычки (strengthCalculator.ts)

```typescript
import { strengthLogger } from '../utils/logger';

export const calculateEMA = (
  completions: Record<string, boolean>,
  skipped: Record<string, boolean>,
  alpha: number
): number => {
  strengthLogger.time('EMA calculation');
  
  strengthLogger.debug('Input parameters', {
    completionsCount: Object.keys(completions).length,
    skippedCount: Object.keys(skipped).length,
    alpha,
  });
  
  const days = generateDaysArray(completions, skipped);
  
  strengthLogger.debug('Days array generated', { length: days.length });
  
  let ema = 0;
  
  strengthLogger.groupCollapsed('Day-by-day calculation', () => {
    days.forEach((completed, index) => {
      const prevEma = ema;
      ema = alpha * (completed ? 1 : 0) + (1 - alpha) * ema;
      
      strengthLogger.debug(
        `Day ${index}: ${completed ? '✅' : '❌'} | ${prevEma.toFixed(2)} → ${ema.toFixed(2)}`
      );
    });
  });
  
  strengthLogger.success('Final EMA calculated', ema.toFixed(3));
  strengthLogger.timeEnd('EMA calculation');
  
  return ema;
};
```

**Консоль (свёрнутая группа):**
```
🔍 [DEBUG] [STRENGTH] Input parameters { completionsCount: 25, ... }
🔍 [DEBUG] [STRENGTH] Days array generated { length: 30 }
📦 Day-by-day calculation (свёрнуто)
✅ [SUCCESS] [STRENGTH] Final EMA calculated 0.847
⏱️ EMA calculation: 3.45ms
```

---

### 3. Сохранение в localStorage (useHabitsStorage.ts)

```typescript
import { storageLogger } from '../utils/logger';

export const useHabitsStorage = () => {
  const saveToLocalStorage = (habits: Habit[]) => {
    storageLogger.time('Save to localStorage');
    
    try {
      storageLogger.debug('Serializing habits', { count: habits.length });
      
      const serialized = JSON.stringify(habits);
      
      storageLogger.debug('Serialized size', {
        bytes: serialized.length,
        kb: (serialized.length / 1024).toFixed(2),
      });
      
      localStorage.setItem('habits', serialized);
      
      storageLogger.success('Saved to localStorage');
    } catch (error) {
      storageLogger.error('Failed to save to localStorage', error);
    } finally {
      storageLogger.timeEnd('Save to localStorage');
    }
  };
  
  return { saveToLocalStorage };
};
```

**Консоль:**
```
🔍 [DEBUG] [STORAGE] Serializing habits { count: 8 }
🔍 [DEBUG] [STORAGE] Serialized size { bytes: 5847, kb: "5.71" }
✅ [SUCCESS] [STORAGE] Saved to localStorage
⏱️ Save to localStorage: 12.34ms
```

---

### 4. Инициализация приложения (App.tsx)

```typescript
import { initLogger } from '../utils/logger';

useEffect(() => {
  initLogger.group('Application initialization', () => {
    initLogger.debug('Loading habits from localStorage...');
    
    const savedHabits = loadFromLocalStorage();
    
    initLogger.info(`Loaded ${savedHabits.length} habits`);
    
    initLogger.debug('Initializing categories...');
    
    const categories = initializeCategories();
    
    initLogger.info(`Initialized ${categories.length} categories`);
    
    initLogger.debug('Setting up notification manager...');
    
    setupNotifications();
    
    initLogger.success('Application ready');
  });
}, []);
```

**Консоль:**
```
📦 Application initialization
  🔍 [DEBUG] [INIT] Loading habits from localStorage...
  ℹ️ [INFO] [INIT] Loaded 8 habits
  🔍 [DEBUG] [INIT] Initializing categories...
  ℹ️ [INFO] [INIT] Initialized 5 categories
  🔍 [DEBUG] [INIT] Setting up notification manager...
  ✅ [SUCCESS] [INIT] Application ready
```

---

## Управление из консоли

В режиме разработки логгер доступен глобально через `__logger`.

### Доступные команды:

```javascript
// Посмотреть текущую конфигурацию
__logger.config

// Отключить все логи
__logger.setSilent()

// Включить полное логирование
__logger.setVerbose()

// Показывать только ошибки
__logger.setErrorsOnly()

// Изменить конфигурацию
__logger.updateConfig({ showTimestamp: false })

// Использовать логгер напрямую
__logger.debug('Test from console')
__logger.info('Testing logger')
```

### Пример использования:

```javascript
// В консоли браузера:

> __logger.config
{
  enabled: true,
  minLevel: "debug",
  showTimestamp: true,
  showModule: true,
  enableGrouping: true
}

> __logger.setSilent()
// Все логи отключены

> __logger.setVerbose()
// Все логи включены обратно

> __logger.debug('Manual test', { foo: 'bar' })
🔍 [DEBUG] Manual test { foo: "bar" }
```

---

## Фильтрация по модулям

Логгер позволяет фильтровать логи по модулям, что упрощает отладку и анализ.

### Пример фильтрации:

```typescript
import { updateLoggerConfig } from '../utils/logger';

// Показывать только логи модуля HABITS
updateLoggerConfig({ filterModules: ['HABITS'] });

// Отключить фильтрацию
updateLoggerConfig({ filterModules: [] });
```

**Консоль:**
```
🔍 [DEBUG] [HABITS] Adding new habit { name: "Зарядка", ... }
ℹ️ [INFO] [HABITS] Total habits: 8
✅ [SUCCESS] [HABITS] Habit added successfully Зарядка
```

---

## 🎯 Итого

### Что делает Logger:

✅ **Заменяет разрозненные console.log** на единую систему  
✅ **Группирует логи по модулям** (HABITS, STRENGTH, STORAGE...)  
✅ **Визуально различает уровни** (debug, info, warn, error)  
✅ **Позволяет отключить debug логи одной строкой**  
✅ **Измеряет производительность** встроенными таймерами  
✅ **Готов к интеграции с Sentry** для продакшена  

### Как начать использовать:

1. Импортируйте нужный логгер:
   ```typescript
   import { logger } from '../utils/logger';
   // или
   import { habitLogger } from '../utils/logger';
   ```

2. Замените `console.log` на `logger.debug/info/warn/error`:
   ```typescript
   // Было:
   console.log('Habit added:', habit);
   
   // Стало:
   habitLogger.info('Habit added', habit);
   ```

3. Используйте группы для связанных операций:
   ```typescript
   logger.group('Processing data', () => {
     logger.debug('Step 1...');
     logger.debug('Step 2...');
     logger.success('Done!');
   });
   ```

4. Измеряйте производительность:
   ```typescript
   logger.time('Heavy calculation');
   doHeavyWork();
   logger.timeEnd('Heavy calculation');
   ```

---

**Вопросы? Проблемы?** Проверьте конфигурацию через `__logger.config` в консоли!