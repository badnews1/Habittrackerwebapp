# 🏪 /core/store - Zustand Store

> **Дата создания:** 21 ноября 2025  
> **Последнее обновление:** 21 ноября 2025  
> **Архитектура:** Slices pattern с middleware

---

## 📁 Структура файлов

```
/core/store
  index.ts           - Главный store (useHabitsStore)
  types.ts           - Глобальные типы (HabitsState)
  initialState.ts    - Начальное состояние всех слайсов
  middleware.ts      - Middleware (пока нет, но можно добавить)
  /slices
    addHabitForm.ts         - Форма добавления привычки (3 шага)
    categories.ts           - CRUD категорий
    goals.ts                - Цели и прогресс
    habits.ts               - CRUD привычек
    internal.ts             - Внутренняя логика (hydration)
    manageHabitsModal.ts    - Модалка управления
    modals.ts               - Открытие/закрытие модалок
    ui.ts                   - UI состояние (месяц, год)
```

---

## 🎯 Слайсы (Slices)

### 1. **habits** (`habits.ts`)
**Ответственность:** CRUD операции с привычками, completion, force calculations

**State:**
- `habits: Habit[]`
- `categories: Category[]`

**Actions:**
- `addHabit()` - добавление привычки
- `updateHabit()` - обновление привычки
- `deleteHabit()` - удаление привычки
- `toggleCompletion()` - переключение галочки
- `setNumericValue()` - установка числового значения (измеримые привычки)
- `forceRecalculateStrength()` - пересчёт силы всех привычек

---

### 2. **categories** (`categories.ts`)
**Ответственность:** CRUD категорий, инициализация дефолтных категорий

**State:**
- `categories: Category[]`

**Actions:**
- `addCategory()` - добавление категории
- `updateCategory()` - обновление категории
- `deleteCategory()` - удаление категории
- `initializeDefaultCategories()` - инициализация дефолтных категорий

---

### 3. **addHabitForm** (`addHabitForm.ts`)
**Ответственность:** Состояние формы добавления привычки (3 шага)

**State:**
- `currentStep: 1 | 2 | 3`
- `habitType: 'binary' | 'measurable'`
- `habitName: string`
- `habitDescription: string`
- `selectedCategory: string | null`
- `selectedIcon: string`
- `targetType: 'goal' | 'limit'`
- `targetValue: number`
- `selectedUnit: UnitType`
- `frequency: FrequencyConfig`
- `reminders: Reminder[]`

**Actions:**
- `setCurrentStep()` - переход между шагами
- `setHabitType()` - выбор типа привычки
- `setHabitName()` - установка названия
- `resetForm()` - сброс формы

---

### 4. **manageHabitsModal** (`manageHabitsModal.ts`)
**Ответственность:** Состояние модалки управления привычками

**State:**
- `editingHabitId: string | null`
- `editMode: boolean`
- `tempName: string`
- `tempIcon: string`
- `tempCategory: string | null`

**Actions:**
- `setEditingHabit()` - начало редактирования
- `cancelEditingHabit()` - отмена редактирования
- `updateEditingHabit()` - сохранение изменений

---

### 5. **modals** (`modals.ts`)
**Ответственность:** Открытие/закрытие всех модалок

**State:**
- `showAddModal: boolean`
- `showManageModal: boolean`
- `showNumericInputModal: boolean`
- `showStatisticsModal: boolean`
- `statisticsHabitId: string | null`

**Actions:**
- `openAddModal()` / `closeAddModal()`
- `openManageModal()` / `closeManageModal()`
- `openNumericInputModal()` / `closeNumericInputModal()`
- `openStatisticsModal()` / `closeStatisticsModal()`

---

### 6. **ui** (`ui.ts`)
**Ответственность:** UI состояние приложения

**State:**
- `currentMonth: number` (0-11)
- `currentYear: number`

**Actions:**
- `setCurrentMonth()` - установка месяца
- `setCurrentYear()` - установка года
- `nextMonth()` - следующий месяц
- `prevMonth()` - предыдущий месяц

---

### 7. **goals** (`goals.ts`)
**Ответственность:** Цели и прогресс

**State:**
- (используется логика из habits slice)

**Actions:**
- `updateGoals()` - обновление целей

---

### 8. **internal** (`internal.ts`)
**Ответственность:** Внутренняя логика store

**State:**
- `hydrated: boolean`

**Actions:**
- `setHydrated()` - установка флага hydration
- `logStoreState()` - логирование состояния

---

## 📝 Примеры использования

### Базовое использование:

```typescript
import { useHabitsStore } from '@/core/store';

function MyComponent() {
  // ❌ НЕ ОПТИМАЛЬНО - создаёт много подписок
  const habits = useHabitsStore((state) => state.habits);
  const addHabit = useHabitsStore((state) => state.addHabit);
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
}
```

### Оптимизированное использование (useShallow):

```typescript
import { useHabitsStore } from '@/core/store';
import { useShallow } from 'zustand/react/shallow';

function MyComponent() {
  // ✅ ОПТИМАЛЬНО - одна подписка
  const { habits, addHabit, deleteHabit } = useHabitsStore(
    useShallow((state) => ({
      habits: state.habits,
      addHabit: state.addHabit,
      deleteHabit: state.deleteHabit,
    }))
  );
}
```

### Для одного селектора (без useShallow):

```typescript
import { useHabitsStore } from '@/core/store';

function MyComponent() {
  // ✅ ОК - один селектор не требует useShallow
  const habits = useHabitsStore((state) => state.habits);
}
```

---

## ⚠️ Правила использования

### ✅ DO (Делай):
- Используй `useShallow` для множественных селекторов
- Используй селекторы для извлечения нужных данных
- Используй actions для изменения состояния
- Логируй изменения через `logStoreState()`

### ❌ DON'T (Не делай):
- Не изменяй state напрямую
- Не создавай новые глобальные слайсы (используй `/features/`)
- Не дублируй логику - используй существующие actions
- Не используй store вне React компонентов (только в actions)

---

## 🔄 Миграция

### История:
- **17-18 ноября 2025:** Создание Zustand store в `/stores/habitsStore/`
- **21 ноября 2025:** Миграция в `/core/store/`

### Старые пути (deprecated):
```typescript
// ❌ Старый путь (не использовать)
import { useHabitsStore } from '@/stores/habitsStore';

// ✅ Новый путь
import { useHabitsStore } from '@/core/store';
```

---

## 📚 Дополнительная документация

- `/docs/ZUSTAND_MIGRATION.md` - Полная история миграции на Zustand
- `/docs/ZUSTAND_QUICKSTART.md` - Быстрая шпаргалка по Zustand
- `/docs/OPTIMIZATION_AUDIT_REPORT.md` - Аудит оптимизации

---

**Обновлено:** 21 ноября 2025  
**Статус:** ✅ Готово к использованию
