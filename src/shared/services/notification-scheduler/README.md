# 🔔 Централизованный планировщик уведомлений

> **Дата создания:** 22 ноября 2025  
> **Последнее обновление:** 22 ноября 2025

---

## 📖 Описание

**NotificationScheduler** - это централизованный планировщик уведомлений, который координирует напоминания от всех модулей приложения (habits, tasks, finance и т.д.).

### Основные возможности:

- ✅ **Предотвращение спама** - группирует уведомления на одно время
- ✅ **Мультимодульность** - работает с любыми модулями
- ✅ **Умная группировка** - по типам или общим списком
- ✅ **Дедупликация** - автоматически отклоняет дубликаты
- ✅ **Конфигурируемость** - настраиваемая группировка

---

## 🎯 Проблема которую решаем

### Без планировщика:

```
[09:00] 🔔 "Время выполнить привычку: Зарядка"
[09:00] 🔔 "Время выполнить привычку: Выпить воду"
[09:00] 🔔 "Время выполнить задачу: Позвонить врачу"
[09:00] 🔔 "Событие: Встреча с командой"
```

→ **4 уведомления одновременно** = спам и раздражение! 😤

### С планировщиком:

```
[09:00] 🔔 "У вас 4 дела на это время"
        🎯 Привычки: Зарядка, Выпить воду
        ✅ Задачи: Позвонить врачу
        📅 События: Встреча с командой
```

→ **1 уведомление** = чисто и понятно! ✨

---

## 🚀 Быстрый старт

### Регистрация напоминания

```typescript
import { NotificationScheduler } from '@/shared/services/notification-scheduler';

// Регистрируем напоминание
NotificationScheduler.register({
  id: 'habit-123-09:00',           // Уникальный ID
  type: 'habit',                    // Тип (модуль-источник)
  time: '09:00',                    // Время в формате HH:mm
  title: 'Зарядка',                 // Заголовок
  body: 'Время выполнить привычку: Зарядка',  // Текст
  data: { habitId: '123' }          // Произвольные данные
});
```

### Отмена напоминания

```typescript
// Удаляем напоминание
NotificationScheduler.unregister('habit-123-09:00');
```

### Обновление напоминания

```typescript
// Обновляем время или другие параметры
NotificationScheduler.update('habit-123-09:00', {
  time: '10:00',
  title: 'Зарядка (обновлено)'
});
```

---

## 📝 Интеграция с модулями

### Модуль Habit Tracker

```typescript
// /modules/habit-tracker/features/notifications/services/habitNotificationScheduler.ts

import { NotificationScheduler } from '@/shared/services/notification-scheduler';
import type { Habit, Reminder } from '@/types/habit';

/**
 * Планирование напоминаний для привычки
 */
export function scheduleHabitReminders(habit: Habit): void {
  // Удаляем старые напоминания
  unscheduleHabitReminders(habit.id);
  
  // Регистрируем новые
  habit.reminders?.forEach(reminder => {
    NotificationScheduler.register({
      id: `habit-${habit.id}-${reminder.time}`,
      type: 'habit',
      time: reminder.time,
      title: habit.name,
      body: `Время выполнить привычку: ${habit.name}`,
      icon: habit.icon,
      data: { 
        habitId: habit.id,
        reminderId: reminder.id 
      }
    });
  });
}

/**
 * Отмена напоминаний для привычки
 */
export function unscheduleHabitReminders(habitId: string): void {
  // Удаляем все напоминания этой привычки
  const stats = NotificationScheduler.getStats();
  
  // TODO: В будущем добавим метод unregisterByPrefix
  // Пока удаляем вручную через getAll
}
```

### Модуль Task Manager (будущее)

```typescript
// /modules/task-manager/features/notifications/services/taskNotificationScheduler.ts

import { NotificationScheduler } from '@/shared/services/notification-scheduler';
import type { Task } from '@/modules/task-manager';

export function scheduleTaskReminder(task: Task): void {
  if (!task.reminder) return;
  
  NotificationScheduler.register({
    id: `task-${task.id}-${task.reminder.time}`,
    type: 'task',
    time: task.reminder.time,
    title: task.name,
    body: `Время выполнить задачу: ${task.name}`,
    data: { taskId: task.id }
  });
}
```

---

## ⚙️ Конфигурация

### Настройка группировки

```typescript
// Включение/выключение группировки
NotificationScheduler.configure({
  enabled: true,                // Группировать ли уведомления
  minCount: 2,                  // Минимум для группировки
  groupByType: true             // Группировать по типу
});

// Получение текущей конфигурации
const config = NotificationScheduler.getConfig();
console.log(config);
// {
//   enabled: true,
//   minCount: 2,
//   groupByType: true
// }
```

### Примеры конфигураций

#### 1. Всегда показывать раздельно

```typescript
NotificationScheduler.configure({
  enabled: false
});

// Результат: каждое уведомление отдельно
```

#### 2. Группировать от 3 уведомлений

```typescript
NotificationScheduler.configure({
  enabled: true,
  minCount: 3
});

// Результат:
// 1-2 уведомления = раздельно
// 3+ уведомления = сгруппированно
```

#### 3. Простой список (без группировки по типам)

```typescript
NotificationScheduler.configure({
  enabled: true,
  groupByType: false
});

// Результат:
// "У вас 4 дела на это время"
// • Зарядка
// • Выпить воду
// • Позвонить врачу
// • Встреча
```

---

## 📊 Статистика и отладка

### Получение статистики

```typescript
const stats = NotificationScheduler.getStats();

console.log(stats);
// {
//   totalReminders: 12,
//   uniqueTimeSlots: 5,
//   byType: {
//     habit: 8,
//     task: 3,
//     finance: 1,
//     event: 0,
//     other: 0
//   },
//   maxRemindersInSlot: 4
// }
```

### Просмотр всех напоминаний

```typescript
const all = NotificationScheduler.getAll();

all.forEach((reminders, time) => {
  console.log(`${time}: ${reminders.length} напоминаний`);
  reminders.forEach(r => {
    console.log(`  - [${r.type}] ${r.title}`);
  });
});

// Вывод:
// 09:00: 4 напоминания
//   - [habit] Зарядка
//   - [habit] Выпить воду
//   - [task] Позвонить врачу
//   - [event] Встреча
// 12:00: 2 напоминания
//   - [habit] Обед
//   - [task] Проверить почту
```

### Очистка (для тестов)

```typescript
// Удаляет ВСЕ напоминания и таймеры
NotificationScheduler.clear();
```

---

## 🏗️ Архитектура

### Как это работает

```
┌─────────────────────────────────────────────┐
│         NotificationScheduler               │
│                                             │
│  Map<time, ScheduledReminder[]>            │
│  ┌──────────┬─────────────────────────┐    │
│  │  "09:00" │ [habit, habit, task]    │    │
│  │  "12:00" │ [habit, task]           │    │
│  │  "18:00" │ [habit]                 │    │
│  └──────────┴─────────────────────────┘    │
│                                             │
│  Map<time, Timer>                          │
│  ┌──────────┬─────────────────────────┐    │
│  │  "09:00" │ setTimeout(...)         │    │
│  │  "12:00" │ setTimeout(...)         │    │
│  │  "18:00" │ setTimeout(...)         │    │
│  └──────────┴─────────────────────────┘    │
└─────────────────────────────────────────────┘
          ▲                   │
          │                   │
   register()          trigger(time)
          │                   │
          │                   ▼
┌─────────┴─────────┐   ┌──────────────┐
│  Habit Module     │   │ Notification │
│  Task Module      │   │   Service    │
│  Finance Module   │   │              │
└───────────────────┘   └──────────────┘
```

### Поток данных

1. **Модуль регистрирует напоминание** → `NotificationScheduler.register()`
2. **Планировщик сохраняет** → `Map<time, reminders[]>`
3. **Создаётся таймер** → `setTimeout()` до указанного времени
4. **Когда время пришло** → `trigger(time)`
5. **Проверка группировки** → `shouldGroup()`
6. **Показ уведомления** → `NotificationService.show()`

---

## 🔮 Будущие улучшения

### Планируется добавить:

- [ ] **Приоритизация** - сортировка по приоритету внутри группы
- [ ] **Отложить** - snooze на N минут
- [ ] **История** - лог показанных уведомлений
- [ ] **Методы фильтрации** - `unregisterByPrefix()`, `getByType()`
- [ ] **Персистентность** - сохранение в localStorage
- [ ] **Настройки звука** - разные звуки для разных типов

---

## 📚 См. также

- [NotificationService](../notifications/README.md) - Низкоуровневый сервис Web Notifications API
- [Reminder типы](/types/habit.ts) - Типы напоминаний в модуле привычек

---

**Дата последнего обновления:** 22 ноября 2025
