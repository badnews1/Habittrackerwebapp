# ⚡ Logger — Быстрый старт

> Краткая шпаргалка по использованию системы логирования  
> **Дата обновления:** 22 ноября 2025

---

## 📥 Импорт

```typescript
// Общий логгер
import { logger } from '../utils/logger';

// Модульные логгеры (рекомендуется!)
import { 
  habitLogger,      // Привычки
  strengthLogger,   // Сила привычки
  storageLogger,    // localStorage
  statsLogger,      // Статистика
  uiLogger,         // UI события
} from '../utils/logger';
```

---

## 🎯 Основные методы

```typescript
// 🔍 DEBUG - для отладки (скрывается в продакшене)
logger.debug('Calculating strength', { habit, date });
habitLogger.debug('Processing habit', habit);

// ℹ️ INFO - важные события
logger.info('Habit added', habit);
habitLogger.info('Total habits: 15');

// ⚠️ WARN - предупреждения
logger.warn('Category already exists', categoryName);

// ❌ ERROR - ошибки
logger.error('Failed to save', error);

// ✅ SUCCESS - успех
logger.success('Data saved!');
```

---

## 📦 Группировка

```typescript
// Связанные логи вместе
logger.group('Adding habit', () => {
  logger.debug('Validating...');
  logger.debug('Saving...');
  logger.success('Done!');
});

// Свёрнутая группа
logger.groupCollapsed('Details', () => {
  logger.debug('Step 1');
  logger.debug('Step 2');
});
```

---

## ⏱️ Измерение времени

```typescript
logger.time('Heavy calculation');
doSomething();
logger.timeEnd('Heavy calculation');
// Вывод: ⏱️ Heavy calculation: 142.35ms
```

---

## 🎨 Пример использования

### ❌ Было:
```typescript
console.log('Adding habit:', habitData);
console.log('Created:', newHabit);
console.log('Saved!');
```

### ✅ Стало:
```typescript
habitLogger.group('Adding habit', () => {
  habitLogger.debug('Input data', habitData);
  habitLogger.debug('Created habit', newHabit);
  habitLogger.success('Saved!');
});
```

### 🖥️ Консоль:
```
📦 [HABITS] Adding habit
  🔍 [DEBUG] [HABITS] Input data { name: "Зарядка", ... }
  🔍 [DEBUG] [HABITS] Created habit { id: "123", ... }
  ✅ [SUCCESS] [HABITS] Saved!
```

---

## ⚙️ Управление логами

```typescript
import { 
  updateLoggerConfig,
  setErrorsOnlyMode,
  setVerboseMode,
  setSilentMode,
} from '../utils/logger';

// Показывать только ошибки
setErrorsOnlyMode();

// Показывать всё
setVerboseMode();

// Отключить все логи
setSilentMode();

// Кастомная настройка
updateLoggerConfig({ showTimestamp: false });
```

---

## 🎮 Управление из консоли (dev mode)

```javascript
// В консоли браузера:
__logger.config              // Текущие настройки
__logger.setSilent()         // Отключить всё
__logger.setVerbose()        // Включить всё
__logger.setErrorsOnly()     // Только ошибки
```

---

## 🎯 Когда использовать какой уровень?

| Уровень | Когда использовать | Продакшен |
|---------|-------------------|-----------|
| **debug** | Временная отладка, детали выполнения | ❌ Скрыт |
| **info** | Важные события, инициализация | ❌ Скрыт |
| **warn** | Проблемы, но не критичные | ✅ Показан |
| **error** | Критичные ошибки, исключения | ✅ Показан |
| **success** | Успешное выполнение операций | ❌ Скрыт |

---

## 📚 Полная документация

См. `/docs/LOGGER_USAGE.md` для подробных примеров и всех возможностей.

---

**Совет:** Используйте модульные логгеры (`habitLogger`, `strengthLogger`) вместо общего `logger` — так логи будут автоматически группироваться по модулям! 🚀