# 🎨 Правила разделения UI и бизнес-логики

> **Дата обновления:** 22 ноября 2025  
> **Статус:** 📋 Рекомендации и best practices  
> **Цель:** Чёткое разделение презентационных компонентов (UI) от контейнеров с бизнес-логикой

> ⚠️ **ВАЖНО:** Этот документ описывает **рекомендуемый паттерн** Presentation/Container. В текущем проекте фичи используют структуру `/components/` без разделения на `/ui/` и `/components/`. Документ служит руководством для будущего рефакторинга и новых фич.

---

## 📋 Содержание

1. [Проблема смешивания](#проблема-смешивания)
2. [Решение: Presentation/Container паттерн](#решение)
3. [Структура папок](#структура-папок)
4. [Правила для `/ui/`](#правила-для-ui)
5. [Правила для `/components/`](#правила-для-components)
6. [Правила для `/hooks/`](#правила-для-hooks)
7. [Примеры](#примеры)
8. [Чеклист](#чеклист)

---

## ❌ Проблема смешивания

### Плохой пример (всё в одном компоненте):

```typescript
// /features/habits/components/HabitCard.tsx - ПЛОХО! ❌

import { useHabitStore } from '@/core/store';
import { toast } from 'sonner@2.0.3';

export function HabitCard({ habitId }: { habitId: string }) {
  // ❌ Бизнес-логика смешана с UI
  const habit = useHabitStore(state => state.habits.find(h => h.id === habitId));
  const toggleHabit = useHabitStore(state => state.toggleHabitCompletion);
  const deleteHabit = useHabitStore(state => state.deleteHabit);
  
  const handleToggle = (date: string) => {
    // ❌ Сложная логика в компоненте
    toggleHabit(habitId, date);
    toast.success('Привычка отмечена!');
  };

  const handleDelete = () => {
    if (confirm('Удалить привычку?')) {
      deleteHabit(habitId);
      toast.success('Привычка удалена');
    }
  };

  return (
    <div className="card">
      {/* UI */}
      <h3>{habit.name}</h3>
      <button onClick={() => handleToggle(new Date().toISOString())}>
        Отметить
      </button>
      <button onClick={handleDelete}>Удалить</button>
    </div>
  );
}
```

### Проблемы:
- ❌ Нельзя переиспользовать UI без логики
- ❌ Сложно тестировать
- ❌ Нельзя показать в Storybook
- ❌ UI зависит от конкретного store
- ❌ Нельзя использовать с другими источниками данных

---

## ✅ Решение: Presentation/Container паттерн

Разделяем компоненты на **3 типа**:

### 1. **Презентационные (Dumb)** - `/ui/`
- Только props → JSX
- Нет бизнес-логики
- Нет зависимостей от store
- Легко тестировать

### 2. **Контейнеры (Smart)** - `/components/`
- Подключают store
- Обрабатывают события
- Содержат бизнес-логику
- Рендерят презентационные компоненты

### 3. **Хуки (Logic)** - `/hooks/`
- Инкапсулируют переиспользуемую логику
- Можно использовать в разных компонентах
- Возвращают данные и функции

---

## 📁 Структура папок

### Для фич (`/features/{feature}/`):

```
/features/habits/
│
├── ui/                              ← Презентационные (dumb)
│   ├── HabitCard.tsx               ← Props → JSX
│   ├── HabitRow.tsx                ← Props → JSX
│   ├── StrengthIndicator.tsx       ← Props → JSX
│   └── HabitForm.tsx               ← Props → JSX
│
├── components/                      ← Container (smart)
│   ├── HabitCardContainer.tsx      ← Логика + Store
│   ├── HabitList.tsx               ← Логика + Store
│   ├── AddHabitModal.tsx           ← Логика + Store
│   └── EditHabitModal.tsx          ← Логика + Store
│
├── hooks/                           ← Переиспользуемая логика
│   ├── useHabitOperations.ts       ← Операции CRUD
│   ├── useHabitStrength.ts         ← Расчёт силы
│   ├── useHabitFrequency.ts        ← Логика частоты
│   └── useHabitFilters.ts          ← Фильтрация
│
├── utils/                           ← Чистые функции
│   ├── strengthCalculations.ts
│   └── habitValidation.ts
│
└── types/
    └── habit.types.ts
```

### Для shared (`/shared/`):

```
/shared/
│
├── ui/                          ← Презентационные
│   ├── ColorPicker.tsx         ← Props → JSX
│   ├── IconPicker.tsx          ← Props → JSX
│   └── FrequencySelector.tsx   ← Props → JSX
│
├── components/                  ← С логикой (если нужно)
│   └── RemindersManager.tsx    ← Может использовать store
│
├── hooks/
│   ├── useClickOutside.ts
│   └── useDropdown.ts
│
└── utils/
    └── dateUtils.ts
```

---

## 📌 Правила для `/ui/` (Презентационные)

### ✅ Можно:
```typescript
// ✅ Получать данные через props
interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    color: string;
    strength: number;
  };
  onToggle: (date: string) => void;
  onDelete: () => void;
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  return (
    <div className="card" style={{ borderColor: habit.color }}>
      <h3>{habit.name}</h3>
      <div>Сила: {habit.strength}%</div>
      
      <button onClick={() => onToggle(new Date().toISOString())}>
        Отметить
      </button>
      <button onClick={onDelete}>Удалить</button>
    </div>
  );
}
```

```typescript
// ✅ Использовать UI примитивы
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  return (
    <Card>
      <h3>{habit.name}</h3>
      <Button onClick={onToggle}>Отметить</Button>
    </Card>
  );
}
```

```typescript
// ✅ Локальное состояние UI (не бизнес-логика)
import { useState } from 'react';

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* UI */}
    </div>
  );
}
```

### ❌ Нельзя:
```typescript
// ❌ Использовать хуки store
import { useHabitStore } from '@/core/store'; // НЕТ!

export function HabitCard({ habitId }: { habitId: string }) {
  const habit = useHabitStore(state => state.habits[habitId]); // НЕТ!
  // ...
}
```

```typescript
// ❌ Содержать бизнес-логику
export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const handleToggle = () => {
    // ❌ Сложные вычисления, валидация
    if (calculateStrength(habit) < 50) {
      toast.warning('Низкая сила привычки!');
    }
    onToggle();
  };
  // ...
}
```

```typescript
// ❌ Делать API запросы
export function HabitCard() {
  useEffect(() => {
    fetch('/api/habits').then(...); // НЕТ!
  }, []);
  // ...
}
```

### Чеклист для `/ui/`:
- [ ] Получает данные только через props
- [ ] Вызывает коллбеки через props
- [ ] НЕ использует `useHabitStore` или другие store хуки
- [ ] НЕ содержит бизнес-логику
- [ ] НЕ делает API запросы
- [ ] Может использовать UI примитивы (`Button`, `Dialog`)
- [ ] Может иметь локальное UI состояние (`isHovered`, `isOpen`)
- [ ] Экспортирует тип Props для тестирования

---

## 📌 Правила для `/components/` (Контейнеры)

### ✅ Можно:
```typescript
// ✅ Использовать хуки store
import { useHabitStore } from '@/core/store';

export function HabitCardContainer({ habitId }: { habitId: string }) {
  const habit = useHabitStore(state => 
    state.habits.find(h => h.id === habitId)
  );
  
  // ...
}
```

```typescript
// ✅ Использовать кастомные хуки
import { useHabitOperations } from '../hooks/useHabitOperations';

export function HabitCardContainer({ habitId }: { habitId: string }) {
  const { toggleHabit, deleteHabit } = useHabitOperations();
  
  // ...
}
```

```typescript
// ✅ Обрабатывать события с бизнес-логикой
export function HabitCardContainer({ habitId }: { habitId: string }) {
  const handleToggle = (date: string) => {
    // Валидация
    if (!isValidDate(date)) {
      toast.error('Неверная дата');
      return;
    }
    
    // Бизнес-логика
    toggleHabit(habitId, date);
    toast.success('Привычка отмечена!');
  };
  
  // ...
}
```

```typescript
// ✅ Рендерить презентационные компоненты
import { HabitCard } from '../ui/HabitCard';

export function HabitCardContainer({ habitId }: { habitId: string }) {
  const habit = useHabitStore(state => state.habits[habitId]);
  const { toggleHabit, deleteHabit } = useHabitOperations();
  
  return (
    <HabitCard
      habit={habit}
      onToggle={toggleHabit}
      onDelete={() => deleteHabit(habitId)}
    />
  );
}
```

### ❌ Нельзя:
```typescript
// ❌ Экспортировать в barrel exports (если внутренний)
// /features/habits/index.ts
export { HabitCardContainer } from './components/HabitCardContainer'; // Только если public API
```

### Чеклист для `/components/`:
- [ ] Использует хуки store (`useHabitStore`)
- [ ] Использует кастомные хуки (`/hooks/`)
- [ ] Содержит бизнес-логику
- [ ] Обрабатывает события
- [ ] Рендерит презентационные компоненты из `/ui/`
- [ ] Может делать API запросы (через хуки)
- [ ] НЕ экспортируется в barrel, если внутренний

---

## 📌 Правила для `/hooks/` (Логика)

### ✅ Можно:
```typescript
// ✅ Инкапсулировать сложную логику
import { useHabitStore } from '@/core/store';
import { toast } from 'sonner@2.0.3';

export function useHabitOperations() {
  const toggleHabitCompletion = useHabitStore(state => state.toggleHabitCompletion);
  const deleteHabit = useHabitStore(state => state.deleteHabit);
  const setEditingHabitId = useHabitStore(state => state.setEditingHabitId);

  const toggleHabit = (habitId: string, date: string) => {
    // Сложная логика
    toggleHabitCompletion(habitId, date);
    toast.success('Привычка отмечена!');
  };

  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
    toast.success('Привычка удалена');
  };

  const openEditModal = (habitId: string) => {
    setEditingHabitId(habitId);
  };

  return {
    toggleHabit,
    deleteHabit: handleDeleteHabit,
    openEditModal,
  };
}
```

```typescript
// ✅ Переиспользуемая логика
export function useHabitStrength(habit: Habit) {
  const [strength, setStrength] = useState(0);
  
  useEffect(() => {
    // Сложные вычисления
    const newStrength = calculateStrength(habit);
    setStrength(newStrength);
  }, [habit]);
  
  return { strength };
}
```

```typescript
// ✅ Возвращать данные и функции
export function useHabitFilters() {
  const [filter, setFilter] = useState<HabitFilter>('all');
  
  const filterHabits = (habits: Habit[]) => {
    return habits.filter(h => applyFilter(h, filter));
  };
  
  return {
    filter,
    setFilter,
    filterHabits,
  };
}
```

### Чеклист для `/hooks/`:
- [ ] Инкапсулирует сложную логику
- [ ] Переиспользуется в разных компонентах
- [ ] Может использовать store
- [ ] Возвращает данные и функции
- [ ] Именуется с префиксом `use`
- [ ] Экспортируется в barrel, если public API

---

## 💡 Полный пример

### 1️⃣ Презентационный компонент

```typescript
// /features/habits/ui/HabitCard.tsx

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Экспортируем тип для тестирования
export interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    color: string;
    icon: string;
    strength: number;
  };
  onToggle: (date: string) => void;
  onDelete: () => void;
  onEdit: () => void;
}

// ✅ Чистая функция: props → JSX
export function HabitCard({ habit, onToggle, onDelete, onEdit }: HabitCardProps) {
  return (
    <Card className="p-4" style={{ borderLeftColor: habit.color }}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{habit.icon}</div>
        <h3>{habit.name}</h3>
      </div>
      
      <div className="mt-2">
        Сила привычки: {habit.strength}%
      </div>
      
      <div className="mt-4 flex gap-2">
        <Button onClick={() => onToggle(new Date().toISOString())}>
          Отметить сегодня
        </Button>
        <Button onClick={onEdit} variant="outline">
          Редактировать
        </Button>
        <Button onClick={onDelete} variant="destructive">
          Удалить
        </Button>
      </div>
    </Card>
  );
}
```

### 2️⃣ Кастомный хук

```typescript
// /features/habits/hooks/useHabitOperations.ts

import { useHabitStore } from '@/core/store';
import { toast } from 'sonner@2.0.3';

export function useHabitOperations() {
  const toggleHabitCompletion = useHabitStore(state => state.toggleHabitCompletion);
  const deleteHabit = useHabitStore(state => state.deleteHabit);
  const setEditingHabitId = useHabitStore(state => state.setEditingHabitId);

  const toggleHabit = (habitId: string, date: string) => {
    // Валидация
    if (!habitId || !date) {
      toast.error('Неверные параметры');
      return;
    }
    
    // Бизнес-логика
    toggleHabitCompletion(habitId, date);
    toast.success('Привычка отмечена!');
  };

  const handleDeleteHabit = (habitId: string) => {
    // Подтверждение
    if (!confirm('Вы уверены, что хотите удалить эту привычку?')) {
      return;
    }
    
    deleteHabit(habitId);
    toast.success('Привычка удалена');
  };

  const openEditModal = (habitId: string) => {
    setEditingHabitId(habitId);
  };

  return {
    toggleHabit,
    deleteHabit: handleDeleteHabit,
    openEditModal,
  };
}
```

### 3️⃣ Container компонент

```typescript
// /features/habits/components/HabitCardContainer.tsx

import { HabitCard } from '../ui/HabitCard';
import { useHabitOperations } from '../hooks/useHabitOperations';
import { useHabitStore } from '@/core/store';

interface Props {
  habitId: string;
}

// ✅ Вся бизнес-логика здесь
export function HabitCardContainer({ habitId }: Props) {
  // Получаем данные из store
  const habit = useHabitStore(state => 
    state.habits.find(h => h.id === habitId)
  );
  
  // Используем кастомный хук с логикой
  const { toggleHabit, deleteHabit, openEditModal } = useHabitOperations();

  if (!habit) {
    return <div>Привычка не найдена</div>;
  }

  // Обработчики событий
  const handleToggle = (date: string) => {
    toggleHabit(habitId, date);
  };

  const handleDelete = () => {
    deleteHabit(habitId);
  };

  const handleEdit = () => {
    openEditModal(habitId);
  };

  // ✅ Передаём чистые данные и коллбеки в UI
  return (
    <HabitCard
      habit={{
        id: habit.id,
        name: habit.name,
        color: habit.color,
        icon: habit.icon,
        strength: habit.currentStrength,
      }}
      onToggle={handleToggle}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );
}
```

### 4️⃣ Использование в App.tsx

```typescript
// /App.tsx

import { HabitCardContainer } from '@/features/habits/components/HabitCardContainer';

export default function App() {
  return (
    <div className="p-4">
      {/* ✅ Используем Container - он сам подключит UI */}
      <HabitCardContainer habitId="123" />
    </div>
  );
}
```

---

## ✅ Чеклист для проверки

### Перед созданием компонента спросите себя:

1. **Этот компонент использует store?**
   - ✅ Да → `/components/` (Container)
   - ❌ Нет → `/ui/` (Презентационный)

2. **Этот компонент содержит бизнес-логику?**
   - ✅ Да → `/components/` или вынести в `/hooks/`
   - ❌ Нет → `/ui/`

3. **Этот компонент можно протестировать без store?**
   - ✅ Да → `/ui/` (передавать данные через props)
   - ❌ Нет → `/components/`

4. **Этот компонент можно показать в Storybook?**
   - ✅ Да → `/ui/`
   - ❌ Нет → `/components/`

5. **Эта логика используется в нескольких компонентах?**
   - ✅ Да → `/hooks/`
   - ❌ Нет → оставить в `/components/`

---

## 📊 Сравнительная таблица

| Характеристика | `/ui/` | `/components/` | `/hooks/` |
|---------------|--------|----------------|-----------|
| **Использует store** | ❌ | ✅ | ✅ |
| **Бизнес-логика** | ❌ | ✅ | ✅ |
| **Получает props** | ✅ | ✅ | ❌ |
| **Возвращает JSX** | ✅ | ✅ | ❌ |
| **Тестирование** | Легко | Средне | Легко |
| **Storybook** | ✅ | ❌ | ❌ |
| **Переиспользуемость** | Высокая | Средняя | Высокая |
| **Barrel export** | Редко | Если public | Если public |

---

## 🎯 Правило большого пальца

```
┌─────────────────────────────────────────────────┐
│ Вопрос: Где должен лежать компонент?            │
└─────────────────────────────────────────────────┘

1️⃣ Это базовый UI примитив БЕЗ логики?
   (кнопка, инпут, карточка)
   ↓
   /components/ui/  ← Shadcn компоненты
   ❌ Мы их НЕ создаём, используем готовые

2️⃣ Это переиспользуемый UI БЕЗ store?
   (ColorPicker, IconPicker)
   ↓
   /shared/ui/  ✅

3️⃣ Это переиспользуемый UI С store?
   (RemindersManager)
   ↓
   /shared/components/  ✅

4️⃣ Это UI специфичный для фичи БЕЗ store?
   (HabitCard, DayCell)
   ↓
   /features/{feature}/ui/  ✅

5️⃣ Это контейнер С store?
   (HabitCardContainer, HabitList)
   ↓
   /features/{feature}/components/  ✅

6️⃣ Это переиспользуемая логика?
   (useHabitOperations, useHabitStrength)
   ↓
   /features/{feature}/hooks/  ✅
```

---

## 📝 Итого

### Золотые правила:

1. **Презентационные компоненты (`/ui/`) не знают о store**
   - Только props и JSX
   
2. **Контейнеры (`/components/`) знают о store и бизнес-логике**
   - Подключают store, обрабатывают события
   
3. **Хуки (`/hooks/`) инкапсулируют переиспользуемую логику**
   - Можно использовать в разных компонентах
   
4. **Один компонент = одна ответственность**
   - UI компонент отвечает за отображение
   - Container компонент отвечает за логику
   - Хук отвечает за переиспользуемую логику

5. **Композиция > Наследование**
   - Container рендерит UI компонент
   - UI компонент рендерит примитивы
   - Хук предоставляет логику

---

**Следование этим правилам сделает код:**
- ✅ Читаемым
- ✅ Тестируемым
- ✅ Переиспользуемым
- ✅ Поддерживаемым

**Готовы применять? 🚀**