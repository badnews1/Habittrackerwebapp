# 🎨 Паттерны компонентов и Code Style

> **Последнее обновление:** 20 ноября 2025  
> **Цель:** Единый стандарт написания кода для всей команды

---

## 📑 Содержание

1. [Паттерны использования Zustand Store](#-1-паттерны-использования-zustand-store)
2. [Naming Conventions](#-2-naming-conventions)
3. [Code Style](#-3-code-style)
4. [Component Patterns](#-4-component-patterns)
5. [Best Practices](#-5-best-practices)
6. [Performance Optimization](#-6-performance-optimization)
7. [Error Handling](#-7-error-handling)
8. [Testing Guidelines](#-8-testing-guidelines)

---

## 🏪 1. Паттерны использования Zustand Store

### 1.1 Базовое использование

**✅ DO: Используй селекторы для оптимизации**

```tsx
// ✅ ХОРОШО - подписка только на нужные данные
function MyComponent() {
  const habits = useHabitsStore((state) => state.habits);
  const addHabit = useHabitsStore((state) => state.addHabit);
  
  return <div>{habits.length} привычек</div>;
}
```

**❌ DON'T: Не подписывайся на весь store**

```tsx
// ❌ ПЛОХО - подписка на весь store, ре-рендер при любом изменении
function MyComponent() {
  const store = useHabitsStore();
  
  return <div>{store.habits.length} привычек</div>;
}
```

---

### 1.2 Множественные селекторы

**✅ DO: Группируй связанные данные**

```tsx
// ✅ ХОРОШО - один селектор для связанных данных
function HabitsList() {
  const { habits, categories, selectedMonth } = useHabitsStore((state) => ({
    habits: state.habits,
    categories: state.categories,
    selectedMonth: state.selectedMonth,
  }));
  
  // ...
}
```

**✅ DO: Разделяй данные и actions**

```tsx
// ✅ ХОРОШО - данные и actions отдельно
function HabitForm() {
  // Данные
  const formData = useHabitsStore((state) => state.addHabitForm);
  
  // Actions
  const updateFormName = useHabitsStore((state) => state.updateAddHabitFormName);
  const updateFormIcon = useHabitsStore((state) => state.updateAddHabitFormIcon);
  
  // Или группой
  const { updateName, updateIcon, submitForm } = useHabitsStore((state) => ({
    updateName: state.updateAddHabitFormName,
    updateIcon: state.updateAddHabitFormIcon,
    submitForm: state.submitAddHabitForm,
  }));
}
```

---

### 1.3 Паттерны для модальных окон

**✅ DO: Храни состояние модалки в store**

```tsx
// ✅ ХОРОШО - состояние в store, доступно везде
function MyModal() {
  const isOpen = useHabitsStore((state) => state.isAddHabitModalOpen);
  const openModal = useHabitsStore((state) => state.openAddHabitModal);
  const closeModal = useHabitsStore((state) => state.closeAddHabitModal);
  
  return (
    <Modal.Root isOpen={isOpen} onClose={closeModal}>
      {/* content */}
    </Modal.Root>
  );
}
```

**❌ DON'T: Не дублируй состояние в useState**

```tsx
// ❌ ПЛОХО - дублирование состояния
function MyModal() {
  const [isOpen, setIsOpen] = useState(false); // ❌ Дублирование
  
  // ...
}
```

---

### 1.4 Паттерны для форм

**✅ DO: Используй локальное состояние для временных данных**

```tsx
// ✅ ХОРОШО - локальное состояние для живого ввода
function HabitNameEditor({ habitId, initialName }: Props) {
  const [localName, setLocalName] = useState(initialName);
  const updateHabit = useHabitsStore((state) => state.updateHabit);
  
  const handleBlur = () => {
    // Сохраняем в store только при потере фокуса
    if (localName !== initialName) {
      updateHabit(habitId, { name: localName });
    }
  };
  
  return (
    <input
      value={localName}
      onChange={(e) => setLocalName(e.target.value)}
      onBlur={handleBlur}
    />
  );
}
```

**✅ DO: Используй store для персистентных данных**

```tsx
// ✅ ХОРОШО - форма добавления привычки в store
function AddHabitModal() {
  const formData = useHabitsStore((state) => state.addHabitForm);
  const updateName = useHabitsStore((state) => state.updateAddHabitFormName);
  
  // Данные сохраняются при закрытии модалки
  return <input value={formData.name} onChange={(e) => updateName(e.target.value)} />;
}
```

---

### 1.5 Паттерны для вычисляемых значений

**✅ DO: Используй селекторы с вычислениями**

```tsx
// ✅ ХОРОШО - вычисление внутри селектора
function ProgressBar() {
  const completedCount = useHabitsStore((state) => 
    state.habits.filter(h => h.checked).length
  );
  
  const totalCount = useHabitsStore((state) => state.habits.length);
  
  const percentage = (completedCount / totalCount) * 100;
  
  return <div>{percentage}%</div>;
}
```

**❌ DON'T: Не вычисляй каждый рендер без необходимости**

```tsx
// ❌ ПЛОХО - пересчёт каждый рендер
function ProgressBar() {
  const store = useHabitsStore(); // Подписка на весь store
  
  const percentage = (store.habits.filter(h => h.checked).length / store.habits.length) * 100;
  
  return <div>{percentage}%</div>;
}
```

---

### 1.6 Actions внутри компонентов

**✅ DO: Вызывай actions напрямую**

```tsx
// ✅ ХОРОШО - чистый и понятный код
function DeleteButton({ habitId }: Props) {
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  
  return (
    <button onClick={() => deleteHabit(habitId)}>
      Удалить
    </button>
  );
}
```

**❌ DON'T: Не оборачивай actions без причины**

```tsx
// ❌ ПЛОХО - лишняя обёртка
function DeleteButton({ habitId }: Props) {
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  
  const handleDelete = () => {
    deleteHabit(habitId); // Зачем обёртка?
  };
  
  return <button onClick={handleDelete}>Удалить</button>;
}
```

**✅ DO: Оборачивай только при сложной логике**

```tsx
// ✅ ХОРОШО - обёртка оправдана сложной логикой
function DeleteButton({ habitId }: Props) {
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  const closeModal = useHabitsStore((state) => state.closeDeleteDialog);
  
  const handleDelete = () => {
    // Сложная логика
    logAction('delete_habit', { habitId });
    deleteHabit(habitId);
    closeModal();
    toast.success('Привычка удалена');
  };
  
  return <button onClick={handleDelete}>Удалить</button>;
}
```

---

## 📛 2. Naming Conventions

### 2.1 Компоненты

**Правило:** PascalCase для компонентов и типов

```tsx
// ✅ ХОРОШО
export function HabitRow() { }
export function AddHabitModal() { }
export const HabitItem: React.FC<Props> = () => { };

// ❌ ПЛОХО
export function habitRow() { }
export function add_habit_modal() { }
```

---

### 2.2 Файлы компонентов

**Правило:** PascalCase.tsx для компонентов

```
✅ ХОРОШО:
/components/habits/HabitRow.tsx
/components/habits/AddHabitModal.tsx
/components/shared/ColorPicker.tsx

❌ ПЛОХО:
/components/habits/habitRow.tsx
/components/habits/add-habit-modal.tsx
/components/shared/color_picker.tsx
```

---

### 2.3 Хуки

**Правило:** camelCase с префиксом `use`

```tsx
// ✅ ХОРОШО
export function useHabitsFilter() { }
export function useFrequencyState() { }
export function useClickOutside() { }

// ❌ ПЛОХО
export function UseHabitsFilter() { }
export function habitsFilter() { }
export function use_habits_filter() { }
```

**Файлы хуков:**

```
✅ ХОРОШО:
/hooks/useHabitsFilter.ts
/hooks/useFrequencyState.ts

❌ ПЛОХО:
/hooks/HabitsFilter.ts
/hooks/use_habits_filter.ts
```

---

### 2.4 Утилиты и константы

**Правило:** camelCase для функций, SCREAMING_SNAKE_CASE для констант

```tsx
// ✅ ХОРОШО - функции
export function formatDate(date: Date) { }
export function calculateStrength(habit: Habit) { }

// ✅ ХОРОШО - константы
export const DEFAULT_COLOR = '#3b82f6';
export const MAX_HABIT_NAME_LENGTH = 50;
export const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// ❌ ПЛОХО
export function FormatDate() { }
export const defaultColor = '#3b82f6'; // Должно быть DEFAULT_COLOR
```

---

### 2.5 Store actions

**Правило:** Глагол + существительное (camelCase)

```tsx
// ✅ ХОРОШО - понятные глаголы
addHabit(habit: Habit)
updateHabit(id: string, updates: Partial<Habit>)
deleteHabit(id: string)
toggleHabitCompletion(id: string, date: string)

openAddHabitModal()
closeAddHabitModal()

setSelectedMonth(month: number)
setSelectedYear(year: number)

// ❌ ПЛОХО - непонятные имена
habit(habit: Habit) // Что делает?
modal(open: boolean) // Какая модалка?
month(month: number) // Getter или setter?
```

---

### 2.6 Типы и интерфейсы

**Правило:** PascalCase, Props с суффиксом, без префикса I

```tsx
// ✅ ХОРОШО
interface HabitItemProps { }
interface AddHabitModalProps { }
type FrequencyType = 'daily' | 'weekly';
type HabitData = { };

// ❌ ПЛОХО
interface IHabitItem { } // Не нужен префикс I
interface habitItemProps { } // PascalCase
interface Props { } // Слишком общее
```

---

### 2.7 Переменные состояния

**Правило:** Описательные имена (camelCase)

```tsx
// ✅ ХОРОШО
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
const [localName, setLocalName] = useState('');

// ❌ ПЛОХО
const [open, setOpen] = useState(false); // Что открыто?
const [id, setId] = useState<string | null>(null); // ID чего?
const [name, setName] = useState(''); // Чьё имя?
```

---

### 2.8 Event handlers

**Правило:** Префикс `handle` для обработчиков

```tsx
// ✅ ХОРОШО
const handleClick = () => { };
const handleSubmit = () => { };
const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => { };
const handleBlur = () => { };

// ✅ ХОРОШО - в props
interface Props {
  onClick: () => void;
  onSubmit: () => void;
  onChange: (value: string) => void;
}

// ❌ ПЛОХО
const click = () => { };
const submitForm = () => { }; // Не используется в JSX
const nameChange = () => { };
```

---

## 🎨 3. Code Style

### 3.1 Структура компонента

**Стандартный порядок:**

```tsx
// 1. Импорты (сторонние библиотеки → наши модули)
import React, { useState, useEffect } from 'react';
import { DragHandle, Trash2 } from '../../icons';
import { Habit } from '../../../types/habit';
import { useHabitsStore } from '../../../stores/habitsStore';
import { formatDate } from '../../../utils/dateUtils';

// 2. Константы (если нужны только в этом файле)
const ITEM_TYPE = 'HABIT_ITEM';
const MAX_RETRIES = 3;

// 3. Типы и интерфейсы
interface HabitRowProps {
  habit: Habit;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
  isNewlyAdded?: boolean;
}

// 4. Основной компонент
export function HabitRow({ habit, onUpdate, isNewlyAdded }: HabitRowProps) {
  // 4.1 Хуки (в порядке: store → useState → useEffect → custom hooks)
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localName, setLocalName] = useState(habit.name);
  
  useEffect(() => {
    // Effect logic
  }, [habit.id]);
  
  const { filteredData } = useCustomHook();
  
  // 4.2 Вычисляемые значения
  const isCompleted = habit.checked || false;
  const displayName = localName.trim() || 'Без названия';
  
  // 4.3 Обработчики событий
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleDelete = () => {
    deleteHabit(habit.id);
  };
  
  // 4.4 Ранний возврат (если нужен)
  if (!habit) {
    return null;
  }
  
  // 4.5 JSX
  return (
    <div className="habit-row">
      {/* content */}
    </div>
  );
}

// 5. Вспомогательные компоненты (если нужны только здесь)
function SubComponent() {
  return <div>...</div>;
}
```

---

### 3.2 Порядок импортов

**Группы (разделяй пустой строкой):**

```tsx
// 1. React и сторонние библиотеки
import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 2. UI компоненты (shadcn/ui)
import { Button } from './components/ui/button';
import { Dialog } from './components/ui/dialog';

// 3. Наши компоненты
import { HabitRow } from './components/habits/HabitRow';
import { AddHabitModal } from './components/habits/AddHabitModal';

// 4. Типы
import type { Habit } from './types/habit';
import type { Category } from './types/category';

// 5. Хуки
import { useHabitsStore } from './stores/habitsStore';
import { useFrequencyState } from './hooks/useFrequencyState';

// 6. Утилиты и константы
import { formatDate, getDaysInMonth } from './utils/dateUtils';
import { DEFAULT_COLOR, MAX_NAME_LENGTH } from './constants/validation';

// 7. Стили (если есть)
import './styles/custom.css';
```

---

### 3.3 Комментарии

**Правило:** Все комментарии ТОЛЬКО на русском языке

```tsx
// ✅ ХОРОШО - комментарии на русском
export function HabitRow({ habit }: Props) {
  // Локальное состояние для оптимизации ввода
  const [localName, setLocalName] = useState(habit.name);
  
  // Обновляем привычку при потере фокуса
  const handleBlur = () => {
    if (localName !== habit.name) {
      updateHabit(habit.id, { name: localName });
    }
  };
  
  return (
    <div>
      {/* Иконка привычки с fallback */}
      <Icon name={habit.icon || 'circle'} />
      
      {/* Поле ввода названия */}
      <input
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}

// ❌ ПЛОХО - комментарии на английском
// Local state for input optimization
const [localName, setLocalName] = useState(habit.name);

// Update habit on blur
const handleBlur = () => { };
```

**Типы комментариев:**

```tsx
// ✅ Однострочный комментарий для пояснения
const maxRetries = 3; // Максимум 3 попытки

/**
 * ✅ Многострочный JSDoc комментарий для функций/компонентов
 * 
 * Расчёт силы привычки по алгоритму EMA (Exponential Moving Average).
 * 
 * @param habit - Привычка для расчёта
 * @param date - Дата для расчёта силы
 * @returns Значение силы от 0 до 100
 */
export function calculateStrength(habit: Habit, date: string): number {
  // ...
}

// ✅ TODO комментарии
// TODO: Добавить валидацию email
// FIXME: Исправить баг с пустым именем
// NOTE: Важно сохранять порядок элементов

// ✅ Разделительные комментарии
// ==================== ZUSTAND STORE ====================
const habits = useHabitsStore((state) => state.habits);

// ==================== ВЫЧИСЛЕНИЯ ====================
const percentage = (completed / total) * 100;
```

---

### 3.4 TypeScript

**Правило:** Явная типизация, никаких `any`

```tsx
// ✅ ХОРОШО - явные типы
interface Props {
  habit: Habit;
  onUpdate: (id: string, updates: Partial<Habit>) => void;
  isNewlyAdded?: boolean;
}

function HabitRow({ habit, onUpdate, isNewlyAdded = false }: Props) {
  const [localValue, setLocalValue] = useState<string>(habit.name);
  
  return <div>{localValue}</div>;
}

// ❌ ПЛОХО - any и неявные типы
function HabitRow(props: any) { // ❌ any
  const [localValue, setLocalValue] = useState(props.habit.name); // ❌ неявный тип
  
  return <div>{localValue}</div>;
}
```

**Union types:**

```tsx
// ✅ ХОРОШО
type FrequencyType = 'daily' | 'weekly' | 'monthly';
type Status = 'idle' | 'loading' | 'success' | 'error';

// ❌ ПЛОХО
type FrequencyType = string; // Слишком широкий тип
```

---

### 3.5 Форматирование

**Основные правила:**

```tsx
// ✅ Отступы - 2 пробела
function MyComponent() {
  return (
    <div>
      <span>text</span>
    </div>
  );
}

// ✅ Максимальная длина строки - 100 символов
const longText = 'Очень длинная строка которая не помещается в одну строку и ' +
  'поэтому разбита на несколько строк для читаемости';

// ✅ Пустые строки для группировки
function Component() {
  // Группа 1: Store
  const habits = useHabitsStore((state) => state.habits);
  const addHabit = useHabitsStore((state) => state.addHabit);
  
  // Группа 2: Local state
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  
  // Группа 3: Computed
  const count = habits.length;
  
  return <div>{count}</div>;
}

// ✅ Trailing comma в многострочных структурах
const config = {
  name: 'My App',
  version: '1.0.0',
  author: 'Me', // ← запятая
};

const items = [
  'item1',
  'item2',
  'item3', // ← запятая
];
```

---

## 🧩 4. Component Patterns

### 4.1 Композиция (Composition)

**✅ DO: Используй композицию для гибкости**

```tsx
// ✅ ХОРОШО - композитный API
<Modal.Root isOpen={isOpen} onClose={onClose}>
  <Modal.Backdrop />
  <Modal.Content>
    <Modal.Header>
      <h2>Заголовок</h2>
      <Modal.CloseButton />
    </Modal.Header>
    
    <div className="p-6">
      Контент
    </div>
    
    <Modal.Footer>
      <Button onClick={onClose}>Отмена</Button>
      <Button onClick={onSave}>Сохранить</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal.Root>

// ❌ ПЛОХО - монолитный компонент с props
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Заголовок"
  content="Контент"
  showCloseButton={true}
  footer={<div>...</div>}
/>
```

---

### 4.2 Render Props

**✅ DO: Используй для гибкого рендеринга**

```tsx
// ✅ ХОРОШО - render prop для кастомизации
interface DataListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
}

function DataList<T>({ data, renderItem, emptyState }: DataListProps<T>) {
  if (data.length === 0) {
    return <>{emptyState || 'Нет данных'}</>;
  }
  
  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
}

// Использование
<DataList
  data={habits}
  renderItem={(habit) => <HabitRow habit={habit} />}
  emptyState={<div>Добавьте первую привычку</div>}
/>
```

---

### 4.3 Custom Hooks для логики

**✅ DO: Выноси сложную логику в хуки**

```tsx
// ✅ ХОРОШО - логика в хуке
function useFrequencyState(props: FrequencyEditorProps) {
  const [localValues, setLocalValues] = useState({
    daily: {},
    weekly: { count: props.frequencyCount || 1 },
    // ...
  });
  
  const handleTypeChange = (type: FrequencyType) => {
    props.onTypeChange?.(type);
  };
  
  const handleCountChange = (value: number) => {
    setLocalValues(prev => ({
      ...prev,
      [props.frequencyType]: { ...prev[props.frequencyType], count: value },
    }));
  };
  
  return {
    localValues,
    handleTypeChange,
    handleCountChange,
  };
}

// Использование в компоненте
function FrequencyEditor(props: FrequencyEditorProps) {
  const {
    localValues,
    handleTypeChange,
    handleCountChange,
  } = useFrequencyState(props);
  
  return (
    <div>
      {/* Чистый UI без логики */}
      <input
        value={localValues[props.frequencyType].count}
        onChange={(e) => handleCountChange(Number(e.target.value))}
      />
    </div>
  );
}
```

---

### 4.4 Controlled vs Uncontrolled

**✅ DO: Controlled для важных данных**

```tsx
// ✅ ХОРОШО - controlled input для формы
function HabitNameInput() {
  const name = useHabitsStore((state) => state.addHabitForm.name);
  const updateName = useHabitsStore((state) => state.updateAddHabitFormName);
  
  return (
    <input
      value={name}
      onChange={(e) => updateName(e.target.value)}
    />
  );
}
```

**✅ DO: Uncontrolled для простых случаев**

```tsx
// ✅ ХОРОШО - uncontrolled для одноразового ввода
function QuickAddForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    const value = inputRef.current?.value;
    if (value) {
      addHabit({ name: value });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="" />
      <button type="submit">Добавить</button>
    </form>
  );
}
```

---

### 4.5 Barrel Exports

**✅ DO: Используй index.ts для группировки экспортов**

```tsx
// /components/habits/add/index.ts
/**
 * Модульные компоненты для AddHabitModal
 * 
 * Barrel export для всех подкомпонентов модального окна.
 * Дата создания: 19 ноября 2024
 */

export { FrequencyModal } from './FrequencyModal';
export { FrequencyModalTrigger } from './FrequencyModalTrigger';
export { HabitBasicInfoStep } from './HabitBasicInfoStep';
export { HabitMeasurableStep } from './HabitMeasurableStep';
export { HabitDetailsStep } from './HabitDetailsStep';
export { HabitTypePicker } from './HabitTypePicker';
export { RemindersSection } from './RemindersSection';
export { NotesSection } from './NotesSection';

// Использование
import {
  HabitBasicInfoStep,
  HabitMeasurableStep,
  HabitDetailsStep,
} from './components/habits/add';
```

**❌ DON'T: Не экспортируй всё через index.ts в корне**

```tsx
// ❌ ПЛОХО - index.ts в корне /components
export * from './habits/HabitRow';
export * from './habits/AddHabitModal';
export * from './calendar/CalendarGrid';
// ... сотни экспортов

// Проблема: медленные импорты, сложно найти источник
```

---

### 4.6 Компоненты высшего порядка (HOC)

**⚠️ ОСТОРОЖНО: Используй HOC только если нет других вариантов**

```tsx
// ⚠️ HOC - используй редко
function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithLoadingComponent(props: P & { isLoading: boolean }) {
    const { isLoading, ...restProps } = props;
    
    if (isLoading) {
      return <div>Загрузка...</div>;
    }
    
    return <Component {...(restProps as P)} />;
  };
}

// ✅ ЛУЧШЕ - используй кастомный хук
function useLoadingState<T>(
  fetchFn: () => Promise<T>
): { data: T | null; isLoading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetchFn()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);
  
  return { data, isLoading, error };
}
```

---

## 🎯 5. Best Practices

### 5.1 Оптимизация ре-рендеров

**✅ DO: Используй React.memo для дорогих компонентов**

```tsx
// ✅ ХОРОШО - мемоизация компонента
export const HabitRow = React.memo(function HabitRow({ habit, onUpdate }: Props) {
  return (
    <div>
      {habit.name}
    </div>
  );
});

// Для правильной работы memo:
// 1. Props должны быть примитивами или стабильными ссылками
// 2. Или используй кастомную функцию сравнения
export const HabitRow = React.memo(
  function HabitRow({ habit }: Props) { /* ... */ },
  (prevProps, nextProps) => prevProps.habit.id === nextProps.habit.id
);
```

**✅ DO: Используй useCallback для стабильных функций**

```tsx
// ✅ ХОРОШО - стабильная ссылка на функцию
function ParentComponent() {
  const habits = useHabitsStore((state) => state.habits);
  const updateHabit = useHabitsStore((state) => state.updateHabit);
  
  // updateHabit уже стабилен (из Zustand)
  // Но если создаёшь свою функцию:
  const handleUpdate = useCallback((id: string, name: string) => {
    updateHabit(id, { name });
  }, [updateHabit]);
  
  return habits.map(habit => (
    <HabitRow
      key={habit.id}
      habit={habit}
      onUpdate={handleUpdate} // Стабильная ссылка
    />
  ));
}
```

**✅ DO: Используй useMemo для дорогих вычислений**

```tsx
// ✅ ХОРОШО - мемоизация вычислений
function ProgressChart() {
  const habits = useHabitsStore((state) => state.habits);
  const selectedMonth = useHabitsStore((state) => state.selectedMonth);
  
  // Дорогое вычисление - мемоизируем
  const chartData = useMemo(() => {
    return habits.map(habit => ({
      name: habit.name,
      strength: calculateStrength(habit, selectedMonth),
      completion: calculateCompletion(habit, selectedMonth),
    }));
  }, [habits, selectedMonth]);
  
  return <Chart data={chartData} />;
}
```

---

### 5.2 Условный рендеринг

**✅ DO: Используй ранний возврат**

```tsx
// ✅ ХОРОШО - ранний возврат
function HabitDetails({ habitId }: Props) {
  const habit = useHabitsStore((state) => 
    state.habits.find(h => h.id === habitId)
  );
  
  // Ранний возврат для отсутствующих данных
  if (!habit) {
    return <div>Привычка не найдена</div>;
  }
  
  if (habit.isArchived) {
    return <div>Привычка архивирована</div>;
  }
  
  // Основная логика
  return (
    <div>
      <h2>{habit.name}</h2>
      {/* ... */}
    </div>
  );
}

// ❌ ПЛОХО - вложенные тернарники
function HabitDetails({ habitId }: Props) {
  const habit = useHabitsStore((state) => 
    state.habits.find(h => h.id === habitId)
  );
  
  return (
    <>
      {!habit ? (
        <div>Привычка не найдена</div>
      ) : habit.isArchived ? (
        <div>Привычка архивирована</div>
      ) : (
        <div>
          <h2>{habit.name}</h2>
          {/* ... */}
        </div>
      )}
    </>
  );
}
```

**✅ DO: Используй логическое И для простых условий**

```tsx
// ✅ ХОРОШО - логическое И
function HabitRow({ habit }: Props) {
  return (
    <div>
      <span>{habit.name}</span>
      
      {habit.isNew && (
        <span className="badge">Новая</span>
      )}
      
      {habit.description && (
        <p>{habit.description}</p>
      )}
    </div>
  );
}

// ❌ ПЛОХО - ненужный тернарник
{habit.isNew ? <span className="badge">Новая</span> : null}
```

---

### 5.3 Списки и ключи

**✅ DO: Используй стабильные уникальные ключи**

```tsx
// ✅ ХОРОШО - id как ключ
function HabitsList() {
  const habits = useHabitsStore((state) => state.habits);
  
  return (
    <div>
      {habits.map(habit => (
        <HabitRow
          key={habit.id} // ✅ Уникальный стабильный ключ
          habit={habit}
        />
      ))}
    </div>
  );
}

// ❌ ПЛОХО - индекс как ключ (только если список никогда не меняется)
{habits.map((habit, index) => (
  <HabitRow
    key={index} // ❌ Проблемы при перестановке/удалении
    habit={habit}
  />
))}

// ❌ ПЛОХО - случайный ключ
{habits.map(habit => (
  <HabitRow
    key={Math.random()} // ❌ Каждый рендер новый ключ!
    habit={habit}
  />
))}
```

---

### 5.4 Обработка событий

**✅ DO: Используй функции-стрелки в JSX только для передачи параметров**

```tsx
// ✅ ХОРОШО - нужна стрелка для передачи параметров
function HabitsList() {
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  const habits = useHabitsStore((state) => state.habits);
  
  return (
    <div>
      {habits.map(habit => (
        <button
          key={habit.id}
          onClick={() => deleteHabit(habit.id)} // Нужно передать id
        >
          Удалить {habit.name}
        </button>
      ))}
    </div>
  );
}

// ✅ ХОРОШО - передача функции напрямую
function MyComponent() {
  const openModal = useHabitsStore((state) => state.openAddHabitModal);
  
  return (
    <button onClick={openModal}> {/* Прямая передача */}
      Добавить привычку
    </button>
  );
}

// ❌ ПЛОХО - ненужная стрелка
<button onClick={() => openModal()}> {/* Лишняя обёртка */}
  Добавить
</button>
```

---

### 5.5 Prop drilling

**✅ DO: Используй Zustand store вместо prop drilling**

```tsx
// ✅ ХОРОШО - данные из store
function DeepNestedComponent() {
  const habit = useHabitsStore((state) => 
    state.habits.find(h => h.id === 'some-id')
  );
  
  return <div>{habit?.name}</div>;
}

// ❌ ПЛОХО - prop drilling через 5 уровней
function Level1() {
  const habit = useHabitsStore((state) => state.habits[0]);
  return <Level2 habit={habit} />;
}

function Level2({ habit }: { habit: Habit }) {
  return <Level3 habit={habit} />;
}

function Level3({ habit }: { habit: Habit }) {
  return <Level4 habit={habit} />;
}

function Level4({ habit }: { habit: Habit }) {
  return <Level5 habit={habit} />;
}

function Level5({ habit }: { habit: Habit }) {
  return <div>{habit.name}</div>; // Наконец-то!
}
```

---

## ⚡ 6. Performance Optimization

### 6.1 Lazy Loading компонентов

**✅ DO: Ленивая загрузка для больших компонентов**

```tsx
// ✅ ХОРОШО - lazy loading
import { lazy, Suspense } from 'react';

const HabitStatisticsModal = lazy(() => 
  import('./components/habits/HabitStatisticsModal')
);

function App() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <HabitStatisticsModal />
    </Suspense>
  );
}
```

---

### 6.2 Виртуализация списков

**✅ DO: Используй виртуализацию для длинных списков**

```tsx
// ✅ ХОРОШО - виртуализация (если список очень длинный)
import { FixedSizeList } from 'react-window';

function LongHabitsList() {
  const habits = useHabitsStore((state) => state.habits);
  
  if (habits.length < 50) {
    // Для коротких списков виртуализация не нужна
    return habits.map(habit => <HabitRow key={habit.id} habit={habit} />);
  }
  
  return (
    <FixedSizeList
      height={600}
      itemCount={habits.length}
      itemSize={40}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <HabitRow habit={habits[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

### 6.3 Debounce для поиска

**✅ DO: Используй debounce для живого поиска**

```tsx
// ✅ ХОРОШО - debounce для оптимизации
import { useMemo } from 'react';
import { debounce } from 'lodash';

function SearchInput() {
  const setSearchQuery = useHabitsStore((state) => state.setSearchQuery);
  
  // Мемоизируем debounced функцию
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    [setSearchQuery]
  );
  
  return (
    <input
      type="text"
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Поиск..."
    />
  );
}
```

---

## 🚨 7. Error Handling

### 7.1 Error Boundaries

**✅ DO: Оборачивай компоненты в Error Boundary**

```tsx
// ✅ ХОРОШО - Error Boundary
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Ошибка в компоненте:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Что-то пошло не так</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Использование
function App() {
  return (
    <ErrorBoundary>
      <HabitsTable />
    </ErrorBoundary>
  );
}
```

---

### 7.2 Try-Catch в actions

**✅ DO: Обрабатывай ошибки в actions**

```tsx
// ✅ ХОРОШО - обработка ошибок в store action
export const createHabitsSlice = (set, get) => ({
  addHabit: (habit: Habit) => {
    try {
      // Валидация
      if (!habit.name.trim()) {
        throw new Error('Название привычки не может быть пустым');
      }
      
      if (habit.name.length > MAX_NAME_LENGTH) {
        throw new Error(`Максимальная длина названия: ${MAX_NAME_LENGTH}`);
      }
      
      // Добавление
      set((state) => ({
        habits: [...state.habits, habit],
      }));
      
      // Логирование успеха
      logger.info('Привычка добавлена', { habitId: habit.id });
      
    } catch (error) {
      // Логирование ошибки
      logger.error('Ошибка при добавлении привычки', error);
      
      // Показ пользователю
      toast.error(error.message);
      
      // Пробрасываем дальше (если нужно)
      throw error;
    }
  },
});
```

---

### 7.3 Валидация данных

**✅ DO: Валидируй данные перед использованием**

```tsx
// ✅ ХОРОШО - валидация
function HabitForm() {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  
  const validate = (): boolean => {
    const newErrors: string[] = [];
    
    if (!name.trim()) {
      newErrors.push('Название обязательно');
    }
    
    if (name.length > MAX_NAME_LENGTH) {
      newErrors.push(`Максимум ${MAX_NAME_LENGTH} символов`);
    }
    
    if (name.length < MIN_NAME_LENGTH) {
      newErrors.push(`Минимум ${MIN_NAME_LENGTH} символа`);
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };
  
  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    
    // Сохранение
    addHabit({ name });
  };
  
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, i) => (
            <p key={i} className="error">{error}</p>
          ))}
        </div>
      )}
      
      <button onClick={handleSubmit}>Сохранить</button>
    </div>
  );
}
```

---

## 🧪 8. Testing Guidelines

### 8.1 Unit тесты для утилит

```tsx
// ✅ ХОРОШО - тест для утилиты
import { formatDate, getDaysInMonth } from './dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('форматирует дату в формате DD.MM.YYYY', () => {
      const date = new Date('2025-11-20');
      expect(formatDate(date)).toBe('20.11.2025');
    });
    
    it('корректно обрабатывает однозначные числа', () => {
      const date = new Date('2025-01-05');
      expect(formatDate(date)).toBe('05.01.2025');
    });
  });
  
  describe('getDaysInMonth', () => {
    it('возвращает 31 для января', () => {
      expect(getDaysInMonth(0, 2025)).toBe(31);
    });
    
    it('возвращает 28 для февраля невисокосного года', () => {
      expect(getDaysInMonth(1, 2025)).toBe(28);
    });
    
    it('возвращает 29 для февраля високосного года', () => {
      expect(getDaysInMonth(1, 2024)).toBe(29);
    });
  });
});
```

---

### 8.2 Integration тесты для компонентов

```tsx
// ✅ ХОРОШО - тест для компонента
import { render, screen, fireEvent } from '@testing-library/react';
import { HabitRow } from './HabitRow';

describe('HabitRow', () => {
  const mockHabit = {
    id: '1',
    name: 'Тестовая привычка',
    icon: 'circle',
    checked: false,
  };
  
  it('отображает название привычки', () => {
    render(<HabitRow habit={mockHabit} onUpdate={jest.fn()} />);
    expect(screen.getByText('Тестовая привычка')).toBeInTheDocument();
  });
  
  it('вызывает onUpdate при клике на чекбокс', () => {
    const onUpdate = jest.fn();
    render(<HabitRow habit={mockHabit} onUpdate={onUpdate} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onUpdate).toHaveBeenCalledWith('1', { checked: true });
  });
});
```

---

### 8.3 Тесты для store

```tsx
// ✅ ХОРОШО - тест для Zustand store
import { renderHook, act } from '@testing-library/react';
import { useHabitsStore } from './habitsStore';

describe('habitsStore', () => {
  beforeEach(() => {
    // Сброс store перед каждым тестом
    useHabitsStore.setState({
      habits: [],
      categories: [],
    });
  });
  
  it('добавляет привычку', () => {
    const { result } = renderHook(() => useHabitsStore());
    
    act(() => {
      result.current.addHabit({
        id: '1',
        name: 'Тест',
        icon: 'circle',
      });
    });
    
    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe('Тест');
  });
  
  it('обновляет привычку', () => {
    const { result } = renderHook(() => useHabitsStore());
    
    act(() => {
      result.current.addHabit({ id: '1', name: 'Старое имя' });
      result.current.updateHabit('1', { name: 'Новое имя' });
    });
    
    expect(result.current.habits[0].name).toBe('Новое имя');
  });
});
```

---

## 📚 Дополнительные ресурсы

### Внутренние документы:
- **`BUSINESS_LOGIC.md`** - Бизнес-логика приложения
- **`COMMON_TASKS.md`** - Пошаговые инструкции для задач
- **`ZUSTAND_QUICKSTART.md`** - Быстрый старт с Zustand
- **`FileStructure.md`** - Структура файлов проекта

### Внешние ресурсы:
- [React Docs](https://react.dev/) - Официальная документация React
- [Zustand Docs](https://github.com/pmndrs/zustand) - Документация Zustand
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Руководство TypeScript
- [React Patterns](https://reactpatterns.com/) - Паттерны React

---

## ✅ Checklist для code review

Перед отправкой кода на ревью, проверь:

### Код:
- [ ] Все комментарии на русском языке
- [ ] Используются правильные naming conventions
- [ ] Нет `any` типов без причины
- [ ] Нет дублирования кода (DRY принцип)
- [ ] Сложная логика вынесена в хуки/утилиты
- [ ] Компоненты не больше 200 строк
- [ ] Используется Zustand store, а не prop drilling

### TypeScript:
- [ ] Все типы явно указаны
- [ ] Нет `@ts-ignore` без комментария
- [ ] Используются union types вместо string
- [ ] Интерфейсы без префикса `I`

### Performance:
- [ ] Дорогие компоненты обёрнуты в `React.memo`
- [ ] Функции стабильны (`useCallback` если нужно)
- [ ] Вычисления мемоизированы (`useMemo` если нужно)
- [ ] Нет лишних ре-рендеров

### UX:
- [ ] Есть обработка ошибок
- [ ] Есть состояния загрузки
- [ ] Есть пустые состояния (empty states)
- [ ] Есть валидация форм

### Документация:
- [ ] Обновлён `FileStructure.md` если добавлены файлы
- [ ] Обновлена документация если изменена логика
- [ ] Добавлены JSDoc комментарии для сложных функций

---

**Дата создания:** 20 ноября 2025  
**Авторы:** Команда разработки  
**Версия:** 1.0.0

**Вопросы?** Читай `/docs/README.md` или спрашивай в команде! 🚀
