# 📝 /shared/utils/logger - Централизованная система логирования

> **Назначение:** Единый интерфейс для логирования  
> **Статус:** ✅ Мигрировано (21 ноября 2025)  
> **Последнее обновление:** 21 ноября 2025

---

## 📦 Содержимое

### `logger.ts`
Полнофункциональная система логирования с поддержкой уровней, модулей, фильтрации и пресетов.

**Основной API:**
- `logger.debug()` - отладочные логи (скрываются в production)
- `logger.info()` - информационные логи
- `logger.warn()` - предупреждения
- `logger.error()` - ошибки
- `logger.success()` - успешные операции
- `logger.group()` - группировка логов
- `logger.time()` / `logger.timeEnd()` - измерение времени
- `logger.table()` - табличный вывод

**Модульные логгеры** (предсозданные):
- `habitLogger` - операции с привычками
- `strengthLogger` - расчёт силы
- `frequencyLogger` - работа с частотой
- `categoryLogger` - управление категориями
- `storageLogger` - localStorage операции
- `statsLogger` - статистика
- `uiLogger` - UI события
- `reminderLogger` - напоминания
- `validationLogger` - валидация
- `initLogger` - инициализация

**Управление:**
- `updateLoggerConfig()` - обновить настройки
- `setVerboseMode()` - показать все логи
- `setErrorsOnlyMode()` - только ошибки
- `setSilentMode()` - выключить все логи
- `showOnlyModules()` - фильтр по модулям (whitelist)
- `hideModules()` - скрыть модули (blacklist)

---

## 💡 Использование

### Базовое использование

```typescript
import { logger } from '@/shared/utils/logger';

// Простые логи
logger.debug('Calculating something...', { data });
logger.info('Operation completed', result);
logger.warn('This might be an issue', warning);
logger.error('Something went wrong', error);
logger.success('All done!');

// Группировка
logger.group('Processing data', () => {
  logger.debug('Step 1...');
  logger.debug('Step 2...');
  logger.success('Done!');
});

// Измерение времени
logger.time('Complex operation');
// ... операции ...
logger.timeEnd('Complex operation'); // ⏱️ Complex operation: 123.45ms

// Таблица
logger.table(arrayOfObjects);
```

### Модульные логгеры

```typescript
import { habitLogger, storageLogger } from '@/shared/utils/logger';

// В компоненте привычек
habitLogger.info('Adding new habit', habitData);
habitLogger.error('Failed to save habit', error);

// В функциях работы с storage
storageLogger.debug('Reading from localStorage', { key });
storageLogger.success('Data saved', data);
```

### Создание собственного модульного логгера

```typescript
import { createModuleLogger } from '@/shared/utils/logger';

// Создаём логгер для нового модуля
const myFeatureLogger = createModuleLogger('HABITS');

// Используем
myFeatureLogger.debug('Processing...', data);
myFeatureLogger.error('Error occurred', error);
```

### Настройка логирования

```typescript
import { 
  updateLoggerConfig,
  setVerboseMode,
  setErrorsOnlyMode,
  showOnlyModules,
  hideModules
} from '@/shared/utils/logger';

// Изменить минимальный уровень
updateLoggerConfig({ minLevel: 'warn' }); // Только warn и error

// Пресеты
setVerboseMode(); // Показать всё (debug + timestamp + группировка)
setErrorsOnlyMode(); // Только ошибки

// Фильтрация по модулям
showOnlyModules('STRENGTH', 'FREQUENCY'); // Показать только эти
hideModules('UI', 'STORAGE'); // Скрыть эти
```

### Управление через консоль (dev mode)

В режиме разработки logger доступен через `window.__logger`:

```javascript
// В консоли браузера:
__logger.setVerbose()  // Показать все логи
__logger.showOnly('STRENGTH')  // Только логи силы привычки
__logger.hide('UI', 'STORAGE')  // Скрыть UI и Storage логи
__logger.modules  // Показать все доступные модули
__logger.info('Тестовое сообщение')  // Написать в лог
```

### Production mode

В production логи автоматически отключаются. Включить можно через:

**Способ 1: Query параметр**
```
https://yourapp.com?debug=true
```

**Способ 2: localStorage**
```javascript
localStorage.setItem('enableLogger', 'true')
```

После этого `window.__logger` станет доступен и в production.

---

## 📥 История миграции

- **Откуда:** `/utils/logger.ts`
- **Когда:** 21 ноября 2025
- **Обновлено импортов:** 7 файлов
  1. `/core/store/index.ts`
  2. `/core/store/slices/categories.ts`
  3. `/core/store/slices/habits.ts`
  4. `/core/store/slices/internal.ts`
  5. `/core/store/slices/manageHabitsModal.ts`
  6. `/modules/habit-tracker/features/habits/components/manage/IconPicker.tsx`
  7. `/modules/habit-tracker/features/strength/hooks/useStrengthUpdater.ts`

---

## ✅ Особенности

### 🎨 Красивый вывод
- ✅ Цветные префиксы для каждого уровня
- ✅ Иконки (🔍 debug, ℹ️ info, ⚠️ warn, ❌ error, ✅ success)
- ✅ Timestamp в формате HH:MM:SS
- ✅ Имя модуля в квадратных скобках
- ✅ Styled console.log с CSS

### 🔧 Гибкая конфигурация
- ✅ Включение/отключение логов
- ✅ Минимальный уровень логирования
- ✅ Показ/скрытие timestamp и модулей
- ✅ Включение/отключение группировки

### 📊 Фильтрация по модулям
- ✅ **Whitelist** - показать только выбранные модули
- ✅ **Blacklist** - скрыть выбранные модули
- ✅ Динамическое переключение режимов

### 🚀 Production ready
- ✅ Автоматическое отключение в production
- ✅ Возможность активации через ?debug=true
- ✅ Возможность активации через localStorage
- ✅ Готовность к интеграции с Sentry

---

## 📚 Примеры из кода

### В Zustand store

```typescript
// /core/store/index.ts
import { storageLogger } from '@/shared/utils/logger';

storageLogger.info('Zustand store инициализирован');
```

### В slice с категориями

```typescript
// /core/store/slices/categories.ts
import { categoryLogger } from '@/shared/utils/logger';

categoryLogger.info('Добавлена категория', { name, color });
categoryLogger.info('Удалена категория', { name });
```

### В slice с привычками

```typescript
// /core/store/slices/habits.ts
import { habitLogger } from '@/shared/utils/logger';

habitLogger.info('Добавлена новая привычка', { name, type, id });
habitLogger.info('Удалена привычка', { name, id });
habitLogger.debug('Обновлена привычка', { habitId, updates });
```

### В UI компонентах

```typescript
// /modules/habit-tracker/features/habits/components/manage/IconPicker.tsx
import { uiLogger } from '@/shared/utils/logger';

uiLogger.warn(`Icon undefined for key: ${iconOption.key}`);
```

---

## 🎯 Доступные модули

| Модуль | Назначение | Логгер |
|--------|------------|--------|
| `HABITS` | Операции с привычками | `habitLogger` |
| `STRENGTH` | Расчёт силы привычки | `strengthLogger` |
| `FREQUENCY` | Настройки частоты | `frequencyLogger` |
| `CATEGORIES` | Управление категориями | `categoryLogger` |
| `STORAGE` | localStorage операции | `storageLogger` |
| `STATS` | Статистика и расчёты | `statsLogger` |
| `UI` | UI события | `uiLogger` |
| `REMINDERS` | Система напоминаний | `reminderLogger` |
| `VALIDATION` | Валидация данных | `validationLogger` |
| `INIT` | Инициализация | `initLogger` |

---

## ⚠️ Важные детали

### Уровни логирования (приоритет)

1. **debug** (0) - только в dev, детальная отладка
2. **info** (1) - общая информация
3. **success** (1) - как info, но для успешных операций
4. **warn** (2) - предупреждения
5. **error** (3) - ошибки

При `minLevel: 'warn'` будут показываться только warn и error.

### Production vs Development

**Development:**
- enabled: `true`
- minLevel: `debug`
- Все функции доступны
- `window.__logger` доступен автоматически

**Production:**
- enabled: `false` (по умолчанию)
- minLevel: `warn`
- Включить: `?debug=true` или `localStorage.setItem('enableLogger', 'true')`

### Модульные vs Обычные логи

```typescript
// Обычный лог (без модуля)
logger.info('App started');
// Вывод: ℹ️ [INFO] App started

// Модульный лог
habitLogger.info('Habit added');
// Вывод: ℹ️ [INFO] [HABITS] Habit added
```

---

## 🔄 Связанные файлы

### Используется в:
- `/core/store/` - все slices
- `/modules/habit-tracker/features/habits/components/manage/IconPicker.tsx`
- `/modules/habit-tracker/features/strength/hooks/useStrengthUpdater.ts`
- Практически везде где нужно логирование!

### См. также:
- `/docs/architecture/` - архитектурная документация
- `/shared/utils/` - другие утилиты