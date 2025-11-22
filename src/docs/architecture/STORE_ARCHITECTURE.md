# 🏪 Zustand Store - Архитектура и Colocation

> **Дата обновления:** 22 ноября 2025  
> **Принцип:** Slices живут внутри фич (Feature-Based Colocation)

---

## 📋 Содержание

1. [Принцип Colocation](#принцип-colocation)
2. [Структура Store](#структура-store)
3. [Создание Slice](#создание-slice)
4. [Объединение Slices](#объединение-slices)
5. [Использование Store](#использование-store)
6. [Миграция текущего Store](#миграция-текущего-store)
7. [Примеры](#примеры)

---

## 🎯 Принцип Colocation

### Где должны лежать slices?

**✅ ПРАВИЛЬНО: Slices внутри фич**

```
/features/habits/
  /store/
    habits.slice.ts           ← Основная логика
    addHabitForm.slice.ts     ← Локальное состояние формы
    manageModal.slice.ts      ← Локальное состояние модалки
```

**❌ НЕПРАВИЛЬНО: Slices в /core/**

```
/core/store/slices/
  habits.ts                   ← НЕТ! Логика habits не в core!
  categories.ts               ← НЕТ! Логика categories не в core!
```

---

### Почему Colocation?

#### 1. **Удаление фичи = одна команда**
```bash
# ✅ Удалить фичу Habits
rm -rf /features/habits/

# Всё удалено:
# - Компоненты (HabitsTable, AddHabitModal)
# - Store логика (habits.slice.ts)
# - Типы (habit.ts)
# - Утилиты (habitCompletion.ts)
# - Константы (units.ts)
```

**VS**

```bash
# ❌ Без colocation - нужно чистить вручную
rm -rf /components/habits/        # Удалить компоненты
rm /core/store/slices/habits.ts   # Удалить slice
rm /types/habit.ts                # Удалить типы
rm /utils/habitUtils.ts           # Удалить утилиты
rm /constants/units.ts            # Удалить константы

# Ещё нужно:
# - Убрать импорт из /core/store/index.ts
# - Убрать тип из HabitsState
# - Проверить нет ли ссылок в других файлах
```

---

#### 2. **Всё что изменяется вместе — лежит рядом**

```
// Добавляем новое поле в Habit
/features/habits/
  ├── types/habit.ts                 ← 1. Обновить тип
  ├── store/habits.slice.ts          ← 2. Обновить slice
  ├── components/HabitRow.tsx        ← 3. Отобразить в UI
  └── utils/habitValidation.ts       ← 4. Добавить валидацию

// ✅ Всё в одной папке!
```

---

#### 3. **Чёткие границы ответственности**

```typescript
/features/habits/store/habits.slice.ts  ← Логика ТОЛЬКО habits
/features/categories/store/categories.slice.ts  ← Логика ТОЛЬКО categories
/core/store/slices/ui.slice.ts  ← Только глобальный UI (sidebar, date)
```

---

## 📁 Структура Store

### Полная структура проекта:

```
/
├── features/
│   ├── habits/
│   │   └── store/
│   │       ├── habits.slice.ts           ← Основная логика habits
│   │       ├── addHabitForm.slice.ts     ← Форма добавления
│   │       └── manageModal.slice.ts      ← Модалка управления
│   │
│   ├── categories/
│   │   └── store/
│   │       └── categories.slice.ts       ← Логика categories
│   │
│   └── statistics/
│       └── store/
│           └── goals.slice.ts            ← Логика goals
│
└── core/
    └── store/
        ├── index.ts                       ← Объединяет все slices ⭐
        ├── types.ts                       ← Глобальный State тип
        └── slices/                        ← Только глобальные slices
            ├── ui.slice.ts                ← Глобальный UI state
            └── modals.slice.ts            ← Глобальные модалки
```

---

### Правило: Что в `/core/store/slices/`?

**✅ Только глобальные slices (не относятся к фичам):**
- `ui.slice.ts` - Sidebar, currentDate, currentMonth, currentYear
- `modals.slice.ts` - Глобальные модальные окна

**❌ НЕ относятся к core:**
- `habits.ts` → `/features/habits/store/habits.slice.ts`
- `categories.ts` → `/features/categories/store/categories.slice.ts`
- `goals.ts` → `/features/statistics/store/goals.slice.ts`

---

## 🔧 Создание Slice

### Шаг 1: Создать slice в фиче

```typescript
// /features/habits/store/habits.slice.ts

import { StateCreator } from 'zustand';
import { Habit } from '../types/habit';

// 1️⃣ Определить интерфейс slice
export interface HabitsSlice {
  // State
  habits: Habit[];
  
  // Actions
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
}

// 2️⃣ Создать slice creator
export const createHabitsSlice: StateCreator<
  HabitsSlice,  // Тип этого slice
  [],           // Middleware (пусто)
  [],           // Мутаторы (пусто)
  HabitsSlice   // Возвращаемый тип
> = (set, get) => ({
  // State
  habits: [],
  
  // Actions
  addHabit: (habit) => set((state) => ({
    habits: [...state.habits, habit]
  })),
  
  deleteHabit: (id) => set((state) => ({
    habits: state.habits.filter(h => h.id !== id)
  })),
  
  updateHabit: (id, updates) => set((state) => ({
    habits: state.habits.map(h => 
      h.id === id ? { ...h, ...updates } : h
    )
  })),
  
  toggleHabitCompletion: (id, date) => set((state) => ({
    habits: state.habits.map(h => {
      if (h.id === id) {
        const completedDates = new Set(h.completedDates);
        if (completedDates.has(date)) {
          completedDates.delete(date);
        } else {
          completedDates.add(date);
        }
        return { ...h, completedDates: Array.from(completedDates) };
      }
      return h;
    })
  })),
});
```

---

### Шаг 2: Создать barrel export (опционально)

```typescript
// /features/habits/store/index.ts

export { createHabitsSlice } from './habits.slice';
export { createAddHabitFormSlice } from './addHabitForm.slice';
export { createManageModalSlice } from './manageModal.slice';

export type { HabitsSlice } from './habits.slice';
export type { AddHabitFormSlice } from './addHabitForm.slice';
export type { ManageModalSlice } from './manageModal.slice';
```

---

## 🔗 Объединение Slices

### `/core/store/index.ts` - главный store

```typescript
// /core/store/index.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ✅ Импортируем слайсы из фич
import { createHabitsSlice, HabitsSlice } from '@/features/habits/store/habits.slice';
import { createCategoriesSlice, CategoriesSlice } from '@/features/categories/store/categories.slice';
import { createGoalsSlice, GoalsSlice } from '@/features/statistics/store/goals.slice';

// Глобальные slices из core
import { createUISlice, UISlice } from './slices/ui.slice';
import { createModalsSlice, ModalsSlice } from './slices/modals.slice';

// 1️⃣ Объединить типы всех slices
export type HabitsState = 
  HabitsSlice & 
  CategoriesSlice & 
  GoalsSlice &
  UISlice & 
  ModalsSlice;

// 2️⃣ Создать store с persist
export const useHabitsStore = create<HabitsState>()(
  persist(
    (...args) => ({
      // Объединяем все слайсы
      ...createHabitsSlice(...args),
      ...createCategoriesSlice(...args),
      ...createGoalsSlice(...args),
      ...createUISlice(...args),
      ...createModalsSlice(...args),
    }),
    {
      name: 'habits-storage',  // Ключ в localStorage
      partialize: (state) => ({
        // Что сохранять (исключаем UI state)
        habits: state.habits,
        categories: state.categories,
        goals: state.goals,
        // НЕ сохраняем:
        // - currentDate, currentMonth (пересоздаются при загрузке)
        // - isAddHabitModalOpen (модалки закрыты по умолчанию)
      }),
    }
  )
);
```

---

## 💡 Использование Store

### В компонентах:

```typescript
// /features/habits/components/HabitsList.tsx

import { useHabitsStore } from '@/core/store';
import { useShallow } from 'zustand/react/shallow';

export function HabitsList() {
  // ✅ Подписка с useShallow (оптимизация)
  const { habits, addHabit, deleteHabit } = useHabitsStore(
    useShallow(state => ({
      habits: state.habits,
      addHabit: state.addHabit,
      deleteHabit: state.deleteHabit,
    }))
  );
  
  return (
    <div>
      {habits.map(habit => (
        <div key={habit.id}>
          {habit.name}
          <button onClick={() => deleteHabit(habit.id)}>Удалить</button>
        </div>
      ))}
      
      <button onClick={() => addHabit({ /* ... */ })}>
        Добавить привычку
      </button>
    </div>
  );
}
```

---

### С кастомным хуком (рекомендуется):

```typescript
// /features/habits/hooks/useHabitsOperations.ts

import { useHabitsStore } from '@/core/store';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner@2.0.3';

export function useHabitsOperations() {
  const { addHabit, deleteHabit, updateHabit } = useHabitsStore(
    useShallow(state => ({
      addHabit: state.addHabit,
      deleteHabit: state.deleteHabit,
      updateHabit: state.updateHabit,
    }))
  );
  
  // Обёртки с бизнес-логикой
  const handleAddHabit = (habit: Habit) => {
    addHabit(habit);
    toast.success('Привычка добавлена!');
  };
  
  const handleDeleteHabit = (id: string) => {
    if (!confirm('Удалить привычку?')) return;
    deleteHabit(id);
    toast.success('Привычка удалена');
  };
  
  return {
    addHabit: handleAddHabit,
    deleteHabit: handleDeleteHabit,
    updateHabit,
  };
}
```

```typescript
// /features/habits/components/HabitsList.tsx

import { useHabitsStore } from '@/core/store';
import { useHabitsOperations } from '../hooks/useHabitsOperations';

export function HabitsList() {
  const habits = useHabitsStore(state => state.habits);  // Только чтение
  const { addHabit, deleteHabit } = useHabitsOperations();  // С логикой
  
  return (
    <div>
      {habits.map(habit => (
        <div key={habit.id}>
          {habit.name}
          <button onClick={() => deleteHabit(habit.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}
```

---

##🔄 Миграция текущего Store

### Текущая структура:

```
/core/store/
  ├── index.ts
  ├── types.ts
  ├── initialState.ts
  └── slices/
      ├── habits.ts
      ├── categories.ts
      ├── goals.ts
      ├── ui.ts
      ├── modals.ts
      ├── addHabitForm.ts
      ├── manageHabitsModal.ts
      └── internal.ts
```

---

### План миграции:

#### Этап 1: Переместить slices в фичи

```bash
# Habits слайсы
/core/store/slices/habits.ts 
  → /features/habits/store/habits.slice.ts

/core/store/slices/addHabitForm.ts 
  → /features/habits/store/addHabitForm.slice.ts

/core/store/slices/manageHabitsModal.ts 
  → /features/habits/store/manageModal.slice.ts

# Categories слайс
/core/store/slices/categories.ts 
  → /features/categories/store/categories.slice.ts

# Goals слайс  
/core/store/slices/goals.ts 
  → /features/statistics/store/goals.slice.ts

# Глобальные slices остаются в core
/core/store/slices/ui.ts 
  → /core/store/slices/ui.slice.ts (переименовать)

/core/store/slices/modals.ts 
  → /core/store/slices/modals.slice.ts (переименовать)
```

---

#### Этап 2: Обновить `/core/store/index.ts`

```typescript
// /core/store/index.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ✅ Новые импорты из фич
import { createHabitsSlice } from '@/features/habits/store/habits.slice';
import { createAddHabitFormSlice } from '@/features/habits/store/addHabitForm.slice';
import { createManageModalSlice } from '@/features/habits/store/manageModal.slice';
import { createCategoriesSlice } from '@/features/categories/store/categories.slice';
import { createGoalsSlice } from '@/features/statistics/store/goals.slice';

// Глобальные из core
import { createUISlice } from './slices/ui.slice';
import { createModalsSlice } from './slices/modals.slice';

// Объединяем типы
export type HabitsState = 
  HabitsSlice & 
  AddHabitFormSlice &
  ManageModalSlice &
  CategoriesSlice & 
  GoalsSlice &
  UISlice & 
  ModalsSlice;

// Создаём store
export const useHabitsStore = create<HabitsState>()(
  persist(
    (...args) => ({
      ...createHabitsSlice(...args),
      ...createAddHabitFormSlice(...args),
      ...createManageModalSlice(...args),
      ...createCategoriesSlice(...args),
      ...createGoalsSlice(...args),
      ...createUISlice(...args),
      ...createModalsSlice(...args),
    }),
    {
      name: 'habits-storage',
    }
  )
);
```

---

#### Этап 3: Обновить `/core/store/types.ts`

```typescript
// /core/store/types.ts

// ✅ Реэкспортируем типы из фич
export type { HabitsSlice } from '@/features/habits/store/habits.slice';
export type { AddHabitFormSlice } from '@/features/habits/store/addHabitForm.slice';
export type { ManageModalSlice } from '@/features/habits/store/manageModal.slice';
export type { CategoriesSlice } from '@/features/categories/store/categories.slice';
export type { GoalsSlice } from '@/features/statistics/store/goals.slice';

// Локальные типы из core
export type { UISlice } from './slices/ui.slice';
export type { ModalsSlice } from './slices/modals.slice';

// Глобальный тип (объединение всех slices)
export type { HabitsState } from './index';
```

---

#### Этап 4: Удалить старую папку

```bash
rm -rf /stores/
```

---

## 📊 Сравнительная таблица

| Аспект | До (Централизованно) | После (Colocation) |
|--------|----------------------|-------------------|
| **Расположение** | `/core/store/slices/habits.ts` | `/features/habits/store/habits.slice.ts` |
| **Удаление фичи** | Чистить вручную (5+ файлов) | `rm -rf /features/habits/` |
| **Найти логику** | Искать в `/core/store/slices/` | Сразу в `/features/habits/store/` |
| **Связь с UI** | Разные папки | Рядом с компонентами |
| **Импорт в core** | `import { ... } from './slices/habits'` | `import { ... } from '@/features/habits/store/habits.slice'` |
| **Изоляция** | Низкая (все slices рядом) | Высокая (каждая фича отдельно) |

---

## ✅ Итого

### Золотые правила:

1. **Slices живут внутри фич** (`/features/{feature}/store/`)
2. **Глобальные slices в core** (`/core/store/slices/`)
3. **Core только объединяет** (`/core/store/index.ts`)
4. **Используй кастомные хуки** (инкапсулируй логику)
5. **Используй useShallow** (оптимизация)

### Преимущества:

- ✅ Удаление фичи = одна команда
- ✅ Всё что меняется вместе — лежит рядом
- ✅ Чёткие границы ответственности
- ✅ Легко находить код
- ✅ Проще масштабировать

---

**Готовы мигрировать Store на Colocation? 🚀**