# 🔔 Сервис уведомлений (NotificationService)

> **Дата создания:** 20 ноября 2025  
> **Модуль:** `/services/notifications/`

---

## 📋 Описание

Сервис для работы с Web Notifications API. Инкапсулирует всю бизнес-логику:
- Проверка поддержки и разрешений
- Запрос разрешения на уведомления
- Планирование и отправка уведомлений
- Управление таймерами
- Автоматический сброс в полночь

---

## 🎯 Почему создан отдельный сервис?

### ❌ Проблема до рефакторинга:

`NotificationManager.tsx` смешивал:
- React компонент (useEffect, refs)
- Бизнес-логику (планирование, таймеры)
- Web API (Notification API)

**Результат:**
- ❌ Сложно тестировать
- ❌ Нельзя переиспользовать вне компонента
- ❌ Смешение ответственности

### ✅ После рефакторинга:

```
/services/notifications/NotificationService.ts  ← Чистая логика
/components/notifications/NotificationManager.tsx ← UI + вызовы сервиса
```

**Результаты:**
- ✅ Легко тестировать (чистый TypeScript)
- ✅ Переиспользуемый (можно вызывать где угодно)
- ✅ Чёткое разделение ответственности

---

## 📦 Структура файлов

```
/services/notifications/
├── index.ts                    - Barrel export
├── NotificationService.ts      - Основной класс сервиса
├── types.ts                    - TypeScript типы
└── README.md                   - Эта документация
```

---

## 🚀 Быстрый старт

### Импорт:

```typescript
import { notificationService } from '@/services/notifications';
```

### Проверка поддержки:

```typescript
if (notificationService.isSupported()) {
  console.log('Web Notifications поддерживаются!');
}
```

### Запрос разрешения:

```typescript
const permission = await notificationService.requestPermission();

if (permission === 'granted') {
  console.log('Разрешение получено!');
}
```

### Отправка уведомления:

```typescript
notificationService.sendNotification({
  title: 'Привет!',
  body: 'Это тестовое уведомление',
  icon: '/favicon.ico',
});
```

### Планирование уведомления о привычке:

```typescript
const result = notificationService.scheduleNotification({
  habit: myHabit,
  reminder: myReminder,
});

if (result.success) {
  console.log('Уведомление запланировано:', result.key);
} else {
  console.log('Не удалось запланировать:', result.reason);
}
```

---

## 🔧 API Reference

### Методы проверки

#### `isSupported(): boolean`
Проверяет поддержку Web Notifications API

**Возвращает:** `true` если поддерживается

**Пример:**
```typescript
if (!notificationService.isSupported()) {
  alert('Ваш браузер не поддерживает уведомления');
}
```

---

#### `getPermissionStatus(): NotificationPermission`
Получает текущий статус разрешения

**Возвращает:** `'granted'` | `'denied'` | `'default'`

**Пример:**
```typescript
const status = notificationService.getPermissionStatus();
console.log('Статус разрешения:', status);
```

---

### Методы работы с разрешениями

#### `requestPermission(): Promise<NotificationPermission>`
Запрашивает разрешение на отправку уведомлений

**Возвращает:** Promise с результатом

**Пример:**
```typescript
const permission = await notificationService.requestPermission();

switch (permission) {
  case 'granted':
    console.log('✅ Разрешено');
    break;
  case 'denied':
    console.log('❌ Запрещено');
    break;
  case 'default':
    console.log('⏳ Ожидает ответа');
    break;
}
```

---

### Методы отправки

#### `sendNotification(config: NotificationConfig): Notification | null`
Отправляет уведомление

**Параметры:**
```typescript
interface NotificationConfig {
  title: string;              // Заголовок
  body: string;               // Текст
  icon?: string;              // Иконка (по умолчанию: /favicon.ico)
  tag?: string;               // Тег для группировки
  requireInteraction?: boolean; // Требовать взаимодействие
  silent?: boolean;           // Тихое уведомление
}
```

**Возвращает:** `Notification` объект или `null` при ошибке

**Пример:**
```typescript
const notification = notificationService.sendNotification({
  title: '🎉 Поздравляем!',
  body: 'Вы выполнили все привычки за сегодня!',
  tag: 'daily-complete',
});

if (notification) {
  console.log('Уведомление отправлено');
}
```

---

#### `sendHabitNotification(habit: Habit, time: string): Notification | null`
Отправляет уведомление о привычке

**Параметры:**
- `habit` - объект привычки
- `time` - время в формате "HH:MM"

**Пример:**
```typescript
notificationService.sendHabitNotification(habit, '09:00');
```

---

### Методы планирования

#### `scheduleNotification(data: HabitNotificationData): ScheduleResult`
Планирует отправку уведомления

**Параметры:**
```typescript
interface HabitNotificationData {
  habit: Habit;
  reminder: Reminder;
}
```

**Возвращает:**
```typescript
interface ScheduleResult {
  success: boolean;
  key?: string;                          // Уникальный ключ (если успех)
  reason?: 'permission_denied'           // Разрешение не дано
         | 'time_passed'                 // Время уже прошло
         | 'already_scheduled'           // Уже запланировано
         | 'invalid_time';               // Неверное время
}
```

**Пример:**
```typescript
const result = notificationService.scheduleNotification({
  habit: myHabit,
  reminder: { id: '1', time: '10:00', enabled: true },
});

if (!result.success) {
  console.error('Ошибка планирования:', result.reason);
}
```

---

#### `scheduleHabitsNotifications(habits: Habit[]): void`
Планирует уведомления для массива привычек

**Параметры:**
- `habits` - массив привычек

**Поддерживает:**
- ✅ Новый формат: `habit.reminders[]`
- ✅ Legacy формат: `habit.reminderEnabled` + `habit.reminderTime`

**Пример:**
```typescript
notificationService.scheduleHabitsNotifications(allHabits);
```

---

### Методы отмены

#### `cancelNotification(habitId: string, reminderId: string): boolean`
Отменяет запланированное уведомление

**Возвращает:** `true` если отменено успешно

**Пример:**
```typescript
const cancelled = notificationService.cancelNotification('habit-1', 'reminder-2');

if (cancelled) {
  console.log('Уведомление отменено');
}
```

---

#### `cancelAllNotifications(): void`
Отменяет все запланированные уведомления

**Пример:**
```typescript
notificationService.cancelAllNotifications();
console.log('Все уведомления отменены');
```

---

### Методы инициализации

#### `initializeMidnightReset(): void`
Инициализирует автоматический сброс счётчика в полночь

**Описание:**
- Рассчитывает время до полуночи
- Планирует очистку `sentToday` в 00:00
- Рекурсивно планирует следующий сброс

**Пример:**
```typescript
notificationService.initializeMidnightReset();
```

---

#### `cleanup(): void`
Полная очистка всех таймеров и состояния

**Описание:**
- Отменяет все запланированные уведомления
- Останавливает таймер midnight reset
- Очищает счётчик отправленных

**Пример:**
```typescript
// При размонтировании компонента
useEffect(() => {
  return () => notificationService.cleanup();
}, []);
```

---

### Методы статистики

#### `getScheduledCount(): number`
Возвращает количество запланированных уведомлений

**Пример:**
```typescript
console.log('Запланировано:', notificationService.getScheduledCount());
```

---

#### `getSentTodayCount(): number`
Возвращает количество отправленных сегодня уведомлений

**Пример:**
```typescript
console.log('Отправлено сегодня:', notificationService.getSentTodayCount());
```

---

## 💡 Примеры использования

### В React компоненте

```typescript
import { notificationService } from '@/services/notifications';

function MyComponent() {
  useEffect(() => {
    // Запрос разрешения при монтировании
    notificationService.requestPermission();
    
    return () => {
      // Очистка при размонтировании
      notificationService.cleanup();
    };
  }, []);
  
  const handleSchedule = () => {
    notificationService.scheduleHabitsNotifications(habits);
  };
  
  return <button onClick={handleSchedule}>Запланировать</button>;
}
```

---

### В хуке

```typescript
function useNotifications(habits: Habit[]) {
  useEffect(() => {
    notificationService.cancelAllNotifications();
    notificationService.initializeMidnightReset();
    notificationService.scheduleHabitsNotifications(habits);
    
    return () => notificationService.cleanup();
  }, [habits]);
}
```

---

### Вне React

```typescript
// В любом TypeScript/JavaScript коде
import { notificationService } from '@/services/notifications';

async function setupNotifications() {
  if (!notificationService.isSupported()) {
    console.error('Уведомления не поддерживаются');
    return;
  }
  
  const permission = await notificationService.requestPermission();
  
  if (permission !== 'granted') {
    console.error('Разрешение не получено');
    return;
  }
  
  // Отправить тестовое уведомление
  notificationService.sendNotification({
    title: 'Готово!',
    body: 'Уведомления настроены',
  });
}
```

---

## 🔍 Внутреннее устройство

### Singleton Pattern

Сервис экспортируется как singleton:

```typescript
export const notificationService = new NotificationService();
```

**Преимущества:**
- ✅ Единое состояние во всём приложении
- ✅ Не нужно создавать инстансы вручную
- ✅ Простой импорт и использование

---

### Внутреннее состояние

```typescript
class NotificationService {
  // Карта запланированных уведомлений
  private scheduledNotifications: Map<string, ScheduledNotification>;
  
  // Множество отправленных сегодня
  private sentToday: Set<string>;
  
  // Таймер сброса в полночь
  private midnightResetTimer: NodeJS.Timeout | null;
}
```

---

### Ключи уведомлений

**Timer Key:** `${habitId}-${reminderId}`
- Для управления таймерами

**Notification Key:** `${habitId}-${reminderId}-${dateString}`
- Для предотвращения дублирования в один день

---

## 🧪 Тестирование

### Преимущества тестирования сервиса:

```typescript
describe('NotificationService', () => {
  let service: NotificationService;
  
  beforeEach(() => {
    service = new NotificationService();
  });
  
  afterEach(() => {
    service.cleanup();
  });
  
  it('should check browser support', () => {
    expect(service.isSupported()).toBe(true);
  });
  
  it('should schedule notification', () => {
    const result = service.scheduleNotification({
      habit: mockHabit,
      reminder: mockReminder,
    });
    
    expect(result.success).toBe(true);
    expect(service.getScheduledCount()).toBe(1);
  });
  
  it('should cancel notification', () => {
    service.scheduleNotification({ habit, reminder });
    const cancelled = service.cancelNotification(habit.id, reminder.id);
    
    expect(cancelled).toBe(true);
    expect(service.getScheduledCount()).toBe(0);
  });
});
```

---

## 🎨 Архитектура

### До рефакторинга:

```
NotificationManager.tsx
├── React компонент
├── Бизнес-логика
├── Web API
└── State management (refs)
```

**Проблемы:** Смешение ответственности

---

### После рефакторинга:

```
NotificationService.ts           NotificationManager.tsx
├── Чистая логика               ├── React компонент
├── Не зависит от React         ├── useEffect
├── Легко тестировать           └── Вызовы сервиса
└── Переиспользуемый
```

**Преимущества:** Separation of Concerns

---

## 📚 Связанные файлы

- **`/types/habit.ts`** - Типы Habit и Reminder
- **`/components/notifications/NotificationManager.tsx`** - React компонент-обёртка
- **`/components/notifications/NotificationPermissionBanner.tsx`** - UI баннер разрешений

---

## 🚀 Планы на будущее

### Потенциальные улучшения:

1. **Персистентность планирования**
   ```typescript
   // Сохранение запланированных уведомлений в localStorage
   // Восстановление после перезагрузки страницы
   ```

2. **Service Worker интеграция**
   ```typescript
   // Отправка уведомлений даже при закрытой вкладке
   ```

3. **Группировка уведомлений**
   ```typescript
   // "У вас 5 непрочитанных напоминаний"
   ```

4. **Статистика**
   ```typescript
   // Аналитика открытия уведомлений
   // Оптимальное время отправки
   ```

5. **Кастомизация звуков**
   ```typescript
   // Разные звуки для разных привычек
   ```

---

## ⚠️ Важные замечания

### Ограничения браузера:

1. **Разрешения сохраняются**
   - Если пользователь нажал "Deny", нельзя запросить снова программно
   - Нужно показать инструкцию по ручной разблокировке

2. **Таймеры сбрасываются**
   - При перезагрузке страницы все `setTimeout` теряются
   - Нужно переинициализировать при каждой загрузке

3. **Фоновые уведомления**
   - Web API не отправляет уведомления при закрытой вкладке
   - Для этого нужен Service Worker

### Безопасность:

- ✅ Уведомления работают только в HTTPS
- ✅ Требуется явное разрешение пользователя
- ✅ Браузер может блокировать частые уведомления

---

## 📞 Контакты

При вопросах или предложениях по улучшению сервиса:
- Создайте Issue в проекте
- Обновите эту документацию при изменениях

---

**Версия:** 1.0.0  
**Последнее обновление:** 20 ноября 2025  
**Статус:** ✅ Готов к использованию
