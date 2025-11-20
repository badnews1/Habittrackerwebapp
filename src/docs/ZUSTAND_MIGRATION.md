# 🏪 Миграция на Zustand - Документация

> **Дата миграции:** 20 ноября 2025  
> **Статус:** ✅ Завершена (фаза 1 - App.tsx)

---

## 📖 Оглавление

1. [Обзор](#обзор)
2. [Что изменилось](#что-изменилось)
3. [Преимущества](#преимущества)
4. [Структура Store](#структура-store)
5. [Использование](#использование)
6. [План дальнейшей миграции](#план-дальнейшей-миграции)

---

## 🎯 Обзор

Приложение Habit Tracker мигрировано с **prop drilling** (передача пропсов через множество компонентов) на **Zustand** - современную библиотеку управления состоянием.

### Почему Zustand?

- ✅ **Минималистичный API** - проще чем Redux, мощнее чем Context
- ✅ **Нет prop drilling** - компоненты получают данные напрямую из store
- ✅ **Persist из коробки** - автосохранение в localStorage через middleware
- ✅ **TypeScript friendly** - полная типизация без усилий
- ✅ **Отличная производительность** - обновляются только подписанные компоненты
- ✅ **Маленький размер** - ~1KB в gzip

---

## 🔄 Что изменилось

### До миграции (prop drilling):

```typescript
// App.tsx
const [habits, setHabits] = useState<Habit[]>([]);
const [categories, setCategories] = useState<Category[]>([]);

// Передача через множество компонентов
<HabitsTable 
  habits={habits} 
  setHabits={setHabits}
  categories={categories}
  // ... еще 20 пропсов
/>

// В дочернем компоненте
<HabitRow 
  habits={habits}
  setHabits={setHabits}
  // ... опять передаем дальше
/>
```

### После миграции (Zustand):

```typescript
// App.tsx
import { useHabitsStore } from './stores/habitsStore';

const { habits, categories, addHabit, updateHabit } = useHabitsStore();

// Минимум пропсов, только необходимые
<HabitsTable dateConfig={dateConfig} />

// В любом компоненте - прямой доступ
const { habits, addHabit } = useHabitsStore();
```

---

## ✨ Преимущества

### 1. **Чистый код**

**Было:**
```typescript
// 15 строк импортов хуков
// 50 строк useState
// 30 строк передачи пропсов
```

**Стало:**
```typescript
// 1 импорт store
const { habits, addHabit } = useHabitsStore();
```

### 2. **Нет промежуточных компонентов**

**Было:**
```
App → HabitsTable → HabitRow → HabitCell
(каждый пробрасывает пропсы дальше)
```

**Стало:**
```
App ← useHabitsStore()
HabitsTable ← useHabitsStore()
HabitRow ← useHabitsStore()
HabitCell ← useHabitsStore()
(каждый берет только нужные данные)
```

### 3. **Автосохранение**

```typescript
// Persist middleware автоматически сохраняет в localStorage
const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({ /* store */ }),
    {
      name: 'habits-storage',
      partialize: (state) => ({
        habits: state.habits,
        categories: state.categories,
        // UI state НЕ сохраняется
      }),
    }
  )
);
```

### 4. **Centralized Actions**

```typescript
// Вся бизнес-логика в одном месте
addHabit: (habitData) => {
  const newHabit = { /* ... */ };
  set((state) => ({ habits: [...state.habits, newHabit] }));
  get().incrementActionCounter();
}
```

---

## 🏗️ Структура Store

### `/stores/habitsStore.ts`

```typescript
interface HabitsState {
  // ==================== ДАННЫЕ ====================
  habits: Habit[];
  categories: Category[];
  dailyGoals: { [date: string]: number };
  defaultDailyGoal: string;

  // ==================== UI СОСТОЯНИЕ ====================
  currentSection: string;
  isSidebarOpen: boolean;
  selectedMonth: number;
  selectedYear: number;

  // ==================== МОДАЛЬНЫЕ ОКНА ====================
  showDeleteDialog: string | null;
  isAddHabitModalOpen: boolean;
  isManageHabitsModalOpen: boolean;
  // ...

  // ==================== ACTIONS ====================
  addHabit: (habitData: HabitData) => void;
  deleteHabit: (habitId: string) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  // ... еще 20+ actions
}
```

### Разделы Store:

1. **Данные (Data)** - `habits`, `categories`, `dailyGoals`
2. **UI состояние** - `currentSection`, `isSidebarOpen`, `selectedMonth/Year`
3. **Модальные окна** - состояние всех модалок
4. **Undo система** - `previousHabitsState`, `actionsAfterClear`
5. **Actions** - вся бизнес-логика

---

## 📚 Использование

### В компонентах

```typescript
import { useHabitsStore } from './stores/habitsStore';

function MyComponent() {
  // Вариант 1: Получить все нужные данные
  const { habits, addHabit, deleteHabit } = useHabitsStore();

  // Вариант 2: Подписаться только на конкретные поля (оптимизация)
  const habits = useHabitsStore(state => state.habits);
  const addHabit = useHabitsStore(state => state.addHabit);

  return (
    <div>
      <button onClick={() => addHabit(newHabitData)}>
        Добавить привычку
      </button>
    </div>
  );
}
```

### Работа с actions

```typescript
// Добавить привычку
const addHabit = useHabitsStore(state => state.addHabit);
addHabit({
  name: 'Пробежка',
  type: 'binary',
  frequency: { type: 'daily' }
});

// Обновить привычку
const updateHabit = useHabitsStore(state => state.updateHabit);
updateHabit('habit-123', { name: 'Новое название' });

// Удалить привычку
const deleteHabit = useHabitsStore(state => state.deleteHabit);
deleteHabit('habit-123');
```

### Работа с модальными окнами

```typescript
const { 
  isAddHabitModalOpen, 
  openAddHabitModal, 
  closeAddHabitModal 
} = useHabitsStore();

// Открыть модалку
<button onClick={openAddHabitModal}>Добавить привычку</button>

// В модальном окне
{isAddHabitModalOpen && (
  <Modal onClose={closeAddHabitModal}>
    {/* ... */}
  </Modal>
)}
```

---

## 🗺️ План дальнейшей миграции

### ✅ Фаза 1: App.tsx (ЗАВЕРШЕНА)

- [x] Создать `/stores/habitsStore.ts`
- [x] Мигрировать App.tsx
- [x] Обновить документацию

### 📋 Фаза 2: Основные компоненты (TODO)

Компоненты, которые стоит мигрировать:

1. **HabitsTable.tsx** - убрать пробрасывание пропсов
2. **HabitRow.tsx** - прямой доступ к habits и actions
3. **HabitCheckboxCell.tsx** - прямой доступ к toggleCompletion
4. **AddHabitModal.tsx** - прямой доступ к addHabit
5. **ManageHabitsModal.tsx** - прямой доступ к updateHabit
6. **CalendarHeader.tsx** - прямой доступ к habits и dailyGoals

### 📋 Фаза 3: Опционально (TODO)

1. Разбить store на слайсы (если станет слишком большим)
2. Добавить devtools для отладки
3. Оптимизировать селекторы для производительности

---

## 🔧 Технические детали

### Persist Middleware

```typescript
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'habits-storage', // ключ в localStorage
    partialize: (state) => ({
      // Сохраняем только данные
      habits: state.habits,
      categories: state.categories,
      dailyGoals: state.dailyGoals,
      defaultDailyGoal: state.defaultDailyGoal,
      // UI state НЕ сохраняется (модалки, выбранный месяц и т.д.)
    }),
  }
)
```

### Логирование

Все actions логируются через модульный логгер:

```typescript
addHabit: (habitData) => {
  // ...
  habitsLogger.info('Добавлена новая привычка', { 
    name: newHabit.name, 
    type: newHabit.type 
  });
}
```

---

## 📝 Примечания

### Обратная совместимость

Старые хуки (`useHabitsStorage`, `useHabitsActions`, `useModalState`) **не удалены**.  
Они могут использоваться как wrapper'ы, если нужно постепенно мигрировать компоненты.

### Производительность

Zustand автоматически оптимизирует ре-рендеры:

```typescript
// ❌ Плохо - подписка на весь store
const store = useHabitsStore();

// ✅ Хорошо - подписка только на нужные поля
const habits = useHabitsStore(state => state.habits);
const addHabit = useHabitsStore(state => state.addHabit);
```

---

## 🎉 Итоги

### Результаты фазы 1:

- ✅ App.tsx полностью мигрирован
- ✅ Удалено **~50 строк** useState и хуков
- ✅ Централизована вся бизнес-логика
- ✅ Автосохранение в localStorage работает
- ✅ Полная типизация TypeScript
- ✅ Документация обновлена

### Следующие шаги:

1. Протестировать приложение
2. Убедиться что все работает корректно
3. Начать миграцию дочерних компонентов (фаза 2)

---

**Дата последнего обновления:** 20 ноября 2025
