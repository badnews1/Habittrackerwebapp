# 🛠️ Типичные задачи: Пошаговые инструкции

**Дата создания:** 20 ноября 2025  
**Версия:** 1.0

> **Цель:** Быстрые инструкции для частых задач с указанием конкретных файлов и строк кода.

---

## 📋 Содержание

1. [Добавить новое поле в привычку](#1-добавить-новое-поле-в-привычку)
2. [Добавить новую единицу измерения](#2-добавить-новую-единицу-измерения)
3. [Добавить новый тип частоты](#3-добавить-новый-тип-частоты)
4. [Добавить новую категорию](#4-добавить-новую-категорию)
5. [Изменить формулу EMA (силы привычки)](#5-изменить-формулу-ema-силы-привычки)
6. [Добавить новый action в store](#6-добавить-новый-action-в-store)
7. [Добавить новую валидацию](#7-добавить-новую-валидацию)
8. [Добавить новую константу](#8-добавить-новую-константу)
9. [Создать новое модальное окно](#9-создать-новое-модальное-окно)
10. [Добавить новый UI компонент](#10-добавить-новый-ui-компонент)

---

## 1. Добавить новое поле в привычку

**Пример:** Добавить поле `tags: string[]` для меток привычки

### Шаг 1: Обновить интерфейс Habit

📁 **Файл:** `/types/habit.ts`

```typescript
export interface Habit {
  id: string;
  name: string;
  // ... существующие поля
  
  /** Метки для фильтрации и группировки */
  tags?: string[];  // ← ДОБАВИТЬ
}
```

### Шаг 2: Обновить интерфейс HabitData (для создания)

📁 **Файл:** `/types/habit.ts`

```typescript
export interface HabitData {
  name: string;
  description: string;
  // ... существующие поля
  
  tags?: string[];  // ← ДОБАВИТЬ
}
```

### Шаг 3: Добавить в форму создания привычки

📁 **Файл:** `/components/habits/add/AddHabitForm.tsx`

**A) Добавить локальное состояние:**
```typescript
const [tags, setTags] = useState<string[]>([]);
```

**B) Добавить поле в JSX:**
```tsx
{/* Метки */}
<div>
  <label className="text-sm text-[var(--text-secondary)] mb-2">
    Метки
  </label>
  <input
    type="text"
    value={tags.join(', ')}
    onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
    placeholder="Здоровье, спорт, утро"
    className={INPUT_CLASSES.default}
  />
</div>
```

**C) Добавить в данные при сохранении:**
```typescript
const habitData: HabitData = {
  name,
  description,
  // ... существующие поля
  tags,  // ← ДОБАВИТЬ
};
```

### Шаг 4: Обновить action addHabit в store

📁 **Файл:** `/stores/habitsStore/slices/habits.ts`

```typescript
addHabit: (habitData) => {
  const newHabit: Habit = {
    id: Date.now().toString(),
    name: habitData.name,
    // ... существующие поля
    tags: habitData.tags || [],  // ← ДОБАВИТЬ
  };
  
  // ... остальной код
}
```

### Шаг 5: Отобразить в карточке привычки

📁 **Файл:** `/components/habits/HabitRow.tsx`

```tsx
{/* Отображение меток */}
{habit.tags && habit.tags.length > 0 && (
  <div className="flex gap-1 mt-1">
    {habit.tags.map(tag => (
      <span
        key={tag}
        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
      >
        {tag}
      </span>
    ))}
  </div>
)}
```

### Шаг 6: Добавить в модалку редактирования (если нужно)

📁 **Файл:** `/components/habits/manage/EditHabitForm.tsx`

Повторить шаги 3B и 3C, но использовать `habit.tags` как начальное значение.

### ✅ Готово!

**Тестирование:**
1. Создай новую привычку с метками
2. Проверь что метки сохраняются в localStorage
3. Проверь что метки отображаются в карточке
4. Проверь что метки можно редактировать

---

## 2. Добавить новую единицу измерения

**Пример:** Добавить единицу "подъёмы" для тренировок

### Шаг 1: Добавить в список единиц

📁 **Файл:** `/constants/units.ts`

```typescript
export const UNIT_OPTIONS = [
  // Counting units
  'разы',
  'штуки',
  'баллы',
  'подъёмы',  // ← ДОБАВИТЬ сюда (в соответствующую категорию)
  
  // ... остальные единицы
] as const;
```

### Шаг 2: Добавить склонение

📁 **Файл:** `/utils/unitUtils.ts` → функция `declineUnit()`

```typescript
const declensions: Record<string, [string, string, string]> = {
  'разы': ['раз', 'раза', 'раз'],
  'подъёмы': ['подъём', 'подъёма', 'подъёмов'],  // ← ДОБАВИТЬ
  // ... остальные
};
```

**Формат:** `[форма1, форма2, форма5]`
- Форма 1: 1, 21, 31... (один подъём)
- Форма 2: 2-4, 22-24... (два подъёма)
- Форма 5: 5-20, 25-30... (пять подъёмов)

### Шаг 3: Добавить сокращение для календаря

📁 **Файл:** `/utils/unitUtils.ts` → функция `getShortUnit()`

```typescript
const shortUnits: Record<string, string> = {
  'разы': 'раз',
  'подъёмы': 'подъ',  // ← ДОБАВИТЬ (до 4 символов)
  // ... остальные
};
```

### ✅ Готово!

**Тестирование:**
1. Создай измеримую привычку с новой единицей
2. Проверь склонение: "1 подъём", "2 подъёма", "5 подъёмов"
3. Проверь отображение в календаре: "5 подъ"
4. Проверь форматирование больших чисел: "10000 подъ" → "10k подъ"

---

## 3. Добавить новый тип частоты

**Пример:** Добавить тип "каждую N неделю" (`every_n_weeks`)

### ⚠️ Сложность: ВЫСОКАЯ

**Затронутые файлы:** 8+ файлов  
**Время:** 30-60 минут

### Шаг 1: Добавить тип в интерфейс

📁 **Файл:** `/types/habit.ts`

```typescript
export type FrequencyType =
  | 'daily'
  | 'every_n_days'
  | 'every_n_weeks'      // ← ДОБАВИТЬ
  | 'n_times_week'
  | 'n_times_month'
  | 'n_times_in_m_days'
  | 'by_days_of_week';
```

### Шаг 2: Обновить FrequencyConfig

📁 **Файл:** `/types/habit.ts`

```typescript
export interface FrequencyConfig {
  type: FrequencyType;
  count?: number;
  period?: number;       // ← Используется для weeks тоже
  daysOfWeek?: number[];
}
```

### Шаг 3: Добавить дефолтные значения

📁 **Файл:** `/types/frequency.ts`

```typescript
export const DEFAULT_FREQUENCY_VALUES: FrequencyDefaultValues = {
  every_n_days: { period: 5 },
  every_n_weeks: { period: 2 },  // ← ДОБАВИТЬ (каждые 2 недели по умолчанию)
  // ... остальные
} as const;
```

### Шаг 4: Обновить интерфейс LocalFrequencyValues

📁 **Файл:** `/types/frequency.ts`

```typescript
export interface LocalFrequencyValues {
  every_n_days: { period: number | undefined };
  every_n_weeks: { period: number | undefined };  // ← ДОБАВИТЬ
  // ... остальные
}
```

### Шаг 5: Добавить в FrequencyEditor

📁 **Файл:** `/components/habits/add/FrequencyEditor.tsx`

**A) Добавить опцию в select:**
```tsx
<option value="every_n_weeks">Каждую N неделю</option>
```

**B) Добавить conditional rendering для ввода:**
```tsx
{frequencyType === 'every_n_weeks' && (
  <div className="mt-3">
    <label className="text-sm text-[var(--text-secondary)] mb-2">
      Каждую
    </label>
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="1"
        max="52"
        value={frequencyPeriod || ''}
        onChange={(e) => onFrequencyPeriodChange(Number(e.target.value))}
        className={INPUT_CLASSES.default}
      />
      <span className="text-sm text-[var(--text-secondary)]">неделю</span>
    </div>
  </div>
)}
```

### Шаг 6: Добавить логику расчёта месячной цели

📁 **Файл:** `/utils/habitUtils.ts` → функция `getMonthlyGoalFromFrequency()`

```typescript
switch (frequency.type) {
  case 'every_n_weeks': {
    // Каждую N неделю
    const weeks = frequency.period || 1;
    const weeksInMonth = daysInMonth / 7;
    return Math.floor(weeksInMonth / weeks);
  }
  
  // ... остальные cases
}
```

### Шаг 7: Добавить форматирование для отображения

📁 **Файл:** `/utils/habitUtils.ts` → функция `formatFrequency()`

```typescript
switch (frequency.type) {
  case 'every_n_weeks': {
    const weeks = frequency.period || 1;
    return `Каждую ${weeks} ${declineWeeks(weeks)}`;  // "Каждую 2 недели"
  }
  
  // ... остальные cases
}
```

### Шаг 8: Добавить функцию склонения (если нужно)

📁 **Файл:** `/utils/declineWords.ts`

```typescript
export function declineWeeks(num: number): string {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'недель';
  if (lastDigit === 1) return 'неделю';
  if (lastDigit >= 2 && lastDigit <= 4) return 'недели';
  return 'недель';
}
```

### Шаг 9: Добавить валидацию

📁 **Файл:** `/utils/frequencyValidation.ts`

```typescript
case 'every_n_weeks': {
  if (!frequency.period || frequency.period < 1 || frequency.period > 52) {
    return 'Укажите период от 1 до 52 недель';
  }
  break;
}
```

### ✅ Готово!

**Тестирование:**
1. Создай привычку с "Каждую 2 неделю"
2. Проверь отображение в карточке
3. Проверь расчёт месячной цели
4. Проверь валидацию (0 недель, 100 недель)

---

## 4. Добавить новую категорию

**Пример:** Добавить категорию "Работа" с серым цветом

### Шаг 1: Добавить в дефолтные категории

📁 **Файл:** `/utils/initializeCategories.ts`

```typescript
export const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Здоровье', color: 'bg-green-200 text-green-800 border-green-300' },
  { id: '2', name: 'Спорт', color: 'bg-blue-200 text-blue-800 border-blue-300' },
  { id: '3', name: 'Чтение', color: 'bg-purple-200 text-purple-800 border-purple-300' },
  { id: '4', name: 'Работа', color: 'bg-gray-200 text-gray-800 border-gray-300' },  // ← ДОБАВИТЬ
  // ... остальные
];
```

### Шаг 2: Проверить что цвет есть в списке

📁 **Файл:** `/constants/colors.ts`

```typescript
export const CATEGORY_COLORS = [
  'bg-gray-200 text-gray-800 border-gray-300',  // ✅ Уже есть
  // ... остальные
];
```

### ✅ Готово!

**Автоматическая инициализация:**
- Категория появится автоматически при первом запуске приложения
- Если пользователь уже запускал приложение, категория НЕ добавится (localStorage уже заполнен)

**Для добавления существующим пользователям:**
📁 **Файл:** `/stores/habitsStore/slices/categories.ts` → добавь миграцию

```typescript
// В initialState.ts или в migrations
if (!categories.find(c => c.name === 'Работа')) {
  categories.push({
    id: Date.now().toString(),
    name: 'Работа',
    color: 'bg-gray-200 text-gray-800 border-gray-300',
  });
}
```

---

## 5. Изменить формулу EMA (силы привычки)

**Пример:** Изменить период с N=32 на N=64 дня

### ⚠️ КРИТИЧНО: Влияет на всю логику приложения!

### Шаг 1: Изменить константу N

📁 **Файл:** `/utils/strengthCalculator.ts` → функция `recalculateStrength()`

```typescript
export const recalculateStrength = (habit: Habit, changedDate?: string): Habit => {
  const N = 64; // ← ИЗМЕНИТЬ (было 32)
  
  // ... остальной код
```

### Шаг 2: Обновить документацию

📁 **Файл:** `/docs/BUSINESS_LOGIC.md`

```markdown
### Формула EMA

N = 64 дня (период ~2 месяца)  <!-- ИЗМЕНИТЬ -->
α = 1/N = 1/64 ≈ 0.015625       <!-- ИЗМЕНИТЬ -->
```

### Шаг 3: Пересчитать примеры

```markdown
День 64 (полное выполнение): Сила ≈ 63%   <!-- ОБНОВИТЬ -->
День 128 (полное выполнение): Сила ≈ 86%  <!-- ОБНОВИТЬ -->
День 192 (полное выполнение): Сила ≈ 95%  <!-- ОБНОВИТЬ -->
```

### ⚠️ Последствия изменения N:

| N | Скорость роста | Описание |
|---|----------------|----------|
| 16 | Очень быстро | Сила растёт за 2 недели, но неустойчива |
| 32 | Быстро (текущая) | Баланс: за месяц набирается ~63% |
| 64 | Медленно | Требуется 2 месяца для стабильности |
| 128 | Очень медленно | Привычка формируется полгода |

**Рекомендация:** N=32 — научно обоснованный период формирования привычки.

### ✅ Готово!

**Тестирование:**
1. Очисти localStorage (для чистого теста)
2. Создай привычку и выполняй N дней подряд
3. Проверь что сила ≈ 63% на N-й день
4. Проверь пересчёт при изменении старых галочек

---

## 6. Добавить новый action в store

**Пример:** Добавить action `archiveHabit(habitId)` для архивации

### Шаг 1: Добавить поле в интерфейс Habit (если нужно)

📁 **Файл:** `/types/habit.ts`

```typescript
export interface Habit {
  id: string;
  name: string;
  // ... существующие поля
  archived?: boolean;  // ← ДОБАВИТЬ
}
```

### Шаг 2: Обновить типы store

📁 **Файл:** `/stores/habitsStore/types.ts`

```typescript
export interface HabitsState {
  // ... state
  habits: Habit[];
  
  // ... actions
  archiveHabit: (habitId: string) => void;  // ← ДОБАВИТЬ
}
```

### Шаг 3: Создать action в slice

📁 **Файл:** `/stores/habitsStore/slices/habits.ts`

```typescript
export const createHabitsSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<
    HabitsState,
    | 'addHabit'
    | 'deleteHabit'
    | 'archiveHabit'  // ← ДОБАВИТЬ в Pick
  >
> = (set, get) => ({
  
  // ... существующие actions
  
  archiveHabit: (habitId: string) => {
    habitLogger.info('Archive habit', habitId);
    
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === habitId
          ? { ...habit, archived: true }
          : habit
      ),
    }));
  },
});
```

### Шаг 4: Использовать в компоненте

📁 **Файл:** `/components/habits/HabitRow.tsx`

```typescript
import { useHabitsStore } from '../../stores/habitsStore';

function HabitRow({ habit }: { habit: Habit }) {
  const archiveHabit = useHabitsStore((state) => state.archiveHabit);
  
  const handleArchive = () => {
    archiveHabit(habit.id);
  };
  
  return (
    <button onClick={handleArchive}>
      Архивировать
    </button>
  );
}
```

### ✅ Готово!

**Тестирование:**
1. Архивируй привычку
2. Проверь что `archived: true` в localStorage
3. Проверь что привычка скрывается в списке (если нужна фильтрация)

---

## 7. Добавить новую валидацию

**Пример:** Проверка что название привычки не дублируется

### Шаг 1: Добавить функцию валидации

📁 **Файл:** `/constants/validation.ts`

```typescript
/**
 * Проверяет что название привычки уникально
 */
export function validateUniqueHabitName(
  name: string,
  existingHabits: Habit[],
  currentHabitId?: string
): string | null {
  const normalizedName = name.trim().toLowerCase();
  
  const isDuplicate = existingHabits.some(
    (habit) =>
      habit.id !== currentHabitId &&
      habit.name.trim().toLowerCase() === normalizedName
  );
  
  if (isDuplicate) {
    return 'Привычка с таким названием уже существует';
  }
  
  return null;
}
```

### Шаг 2: Использовать в форме

📁 **Файл:** `/components/habits/add/AddHabitForm.tsx`

```typescript
import { validateUniqueHabitName } from '../../../constants/validation';
import { useHabitsStore } from '../../../stores/habitsStore';

function AddHabitForm() {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  
  const habits = useHabitsStore((state) => state.habits);
  
  const handleNameChange = (value: string) => {
    setName(value);
    
    // Валидация длины (существующая)
    if (value.length > MAX_HABIT_NAME_LENGTH) {
      setNameError('Слишком длинное название');
      return;
    }
    
    // Валидация уникальности (новая)
    const uniqueError = validateUniqueHabitName(value, habits);
    setNameError(uniqueError);
  };
  
  const handleSubmit = () => {
    // Проверяем перед сохранением
    if (nameError) {
      return;
    }
    
    // ... сохранение
  };
  
  return (
    <div>
      <input
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        className={nameError ? INPUT_CLASSES.error : INPUT_CLASSES.default}
      />
      {nameError && (
        <p className="text-xs text-red-500 mt-1">{nameError}</p>
      )}
    </div>
  );
}
```

### Шаг 3: Добавить в список констант (опционально)

📁 **Файл:** `/constants/validation.ts`

```typescript
export const VALIDATION_MESSAGES = {
  HABIT_NAME_TOO_LONG: 'Название слишком длинное',
  HABIT_NAME_DUPLICATE: 'Привычка с таким названием уже существует',
  // ... остальные
};
```

### ✅ Готово!

**Тестирование:**
1. Создай привычку "Зарядка"
2. Попробуй создать ещё одну "Зарядка" → должна быть ошибка
3. Попробуй создать "зарядка" (lowercase) → должна быть ошибка
4. Проверь что при редактировании своё название не считается дубликатом

---

## 8. Добавить новую константу

**Пример:** Добавить константу для максимального количества категорий

### Шаг 1: Определить где хранить константу

**Категории констант:**
- **UI:** размеры, отступы, анимации → `/constants/ui.ts`
- **Цвета:** палитра, категории → `/constants/colors.ts`
- **Валидация:** лимиты, правила → `/constants/validation.ts`
- **Стили:** классы, z-index → `/constants/styles.ts`
- **Иконки:** список иконок → `/constants/icons.ts`
- **Единицы:** измерения → `/constants/units.ts`

### Шаг 2: Добавить константу

📁 **Файл:** `/constants/validation.ts`

```typescript
/**
 * Максимальное количество категорий
 */
export const MAX_CATEGORIES = 20;
```

### Шаг 3: Экспортировать из index.ts

📁 **Файл:** `/constants/index.ts`

```typescript
export {
  MAX_HABIT_NAME_LENGTH,
  MAX_CATEGORIES,  // ← ДОБАВИТЬ
  // ... остальные
} from './validation';
```

### Шаг 4: Использовать в коде

📁 **Файл:** `/components/categories/AddCategoryButton.tsx`

```typescript
import { MAX_CATEGORIES } from '../../constants';

function AddCategoryButton() {
  const categories = useHabitsStore((state) => state.categories);
  
  const canAddCategory = categories.length < MAX_CATEGORIES;
  
  return (
    <button disabled={!canAddCategory}>
      {canAddCategory ? 'Добавить категорию' : `Максимум ${MAX_CATEGORIES} категорий`}
    </button>
  );
}
```

### ✅ Готово!

**Преимущества централизации:**
- ✅ Одно место для изменения
- ✅ Легко найти все константы
- ✅ TypeScript автодополнение
- ✅ Переиспользование

---

## 9. Создать новое модальное окно

**Пример:** Создать модалку "Экспорт данных"

### Шаг 1: Создать компонент модалки

📁 **Файл:** `/components/modals/ExportDataModal.tsx`

```typescript
import { X } from 'lucide-react';
import { MODAL_STYLES, MODAL_WIDTHS } from '../../constants/styles';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  if (!isOpen) return null;
  
  const handleExport = () => {
    // Логика экспорта
    console.log('Exporting data...');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${MODAL_STYLES.container} ${MODAL_WIDTHS.medium}`}>
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">Экспорт данных</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Контент */}
        <div className="mb-6">
          <p className="text-[var(--text-secondary)]">
            Экспортировать все привычки и данные в JSON файл?
          </p>
        </div>
        
        {/* Кнопки */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] rounded-lg"
          >
            Отмена
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Экспортировать
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Шаг 2: Добавить state в store

📁 **Файл:** `/stores/habitsStore/types.ts`

```typescript
export interface HabitsState {
  // ... modals state
  isAddHabitModalOpen: boolean;
  isExportModalOpen: boolean;  // ← ДОБАВИТЬ
  
  // ... modal actions
  openExportModal: () => void;   // ← ДОБАВИТЬ
  closeExportModal: () => void;  // ← ДОБАВИТЬ
}
```

### Шаг 3: Создать actions в modals slice

📁 **Файл:** `/stores/habitsStore/slices/modals.ts`

```typescript
export const createModalsSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<HabitsState, 'isExportModalOpen' | 'openExportModal' | 'closeExportModal'>
> = (set) => ({
  isExportModalOpen: false,
  
  openExportModal: () => {
    set({ isExportModalOpen: true });
  },
  
  closeExportModal: () => {
    set({ isExportModalOpen: false });
  },
});
```

### Шаг 4: Добавить в initialState

📁 **Файл:** `/stores/habitsStore/initialState.ts`

```typescript
export const initialState = {
  // ... modals
  isAddHabitModalOpen: false,
  isExportModalOpen: false,  // ← ДОБАВИТЬ
};
```

### Шаг 5: Подключить в AppModals

📁 **Файл:** `/components/modals/AppModals.tsx`

```typescript
import { ExportDataModal } from './ExportDataModal';

export function AppModals() {
  const isExportModalOpen = useHabitsStore((state) => state.isExportModalOpen);
  const closeExportModal = useHabitsStore((state) => state.closeExportModal);
  
  return (
    <>
      {/* Существующие модалки */}
      <AddHabitModal />
      
      {/* Новая модалка */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={closeExportModal}
      />
    </>
  );
}
```

### Шаг 6: Использовать в компоненте

📁 **Файл:** `/components/layout/Navbar.tsx`

```typescript
import { useHabitsStore } from '../../stores/habitsStore';

function Navbar() {
  const openExportModal = useHabitsStore((state) => state.openExportModal);
  
  return (
    <button onClick={openExportModal}>
      Экспорт данных
    </button>
  );
}
```

### ✅ Готово!

**Тестирование:**
1. Кликни кнопку "Экспорт данных"
2. Проверь что модалка открывается
3. Проверь кнопку "Отмена" (закрывает)
4. Проверь кнопку "Экспортировать" (выполняет действие и закрывает)
5. Проверь клик вне модалки (должна закрываться)

---

## 10. Добавить новый UI компонент

**Пример:** Создать компонент Badge (значок)

### Шаг 1: Создать компонент

📁 **Файл:** `/components/ui/badge.tsx`

```typescript
import { cn } from './utils';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        BADGE_VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
```

### Шаг 2: Экспортировать из index

📁 **Файл:** `/components/ui/index.ts`

```typescript
export { Badge } from './badge';
export type { BadgeVariant } from './badge';
```

### Шаг 3: Использовать в коде

📁 **Файл:** `/components/habits/HabitRow.tsx`

```typescript
import { Badge } from '../ui';

function HabitRow({ habit }: { habit: Habit }) {
  return (
    <div>
      <span>{habit.name}</span>
      
      {habit.strength >= 67 && (
        <Badge variant="success">Сильная</Badge>
      )}
      
      {habit.type === 'measurable' && (
        <Badge variant="default">Измеримая</Badge>
      )}
    </div>
  );
}
```

### ✅ Готово!

**Лучшие практики:**
- ✅ Используй `cn()` для условных классов
- ✅ Экспортируй типы вместе с компонентом
- ✅ Создавай варианты через Record для типобезопасности
- ✅ Добавь `className` prop для расширения стилей

---

## 🔍 Поиск по задачам

**Как найти где что находится:**

### Типы и интерфейсы:
```bash
/types/habit.ts       # Habit, HabitData, FrequencyConfig
/types/frequency.ts   # FrequencyType, FrequencyEditorProps
```

### Бизнес-логика:
```bash
/utils/strengthCalculator.ts  # Расчёт силы (EMA)
/utils/habitUtils.ts           # Проверка выполнения, прогресс, форматирование
/utils/unitUtils.ts            # Склонение единиц, форматирование
/utils/dateUtils.ts            # Работа с датами
```

### Store (состояние):
```bash
/stores/habitsStore/slices/habits.ts      # CRUD привычек
/stores/habitsStore/slices/modals.ts      # Модальные окна
/stores/habitsStore/slices/ui.ts          # UI (sidebar, date)
/stores/habitsStore/slices/categories.ts  # Категории
```

### Компоненты:
```bash
/components/habits/          # Компоненты привычек
/components/modals/          # Модальные окна
/components/calendar/        # Календарь
/components/ui/              # UI kit
```

### Константы:
```bash
/constants/units.ts       # Единицы измерения
/constants/colors.ts      # Цвета категорий, статусов
/constants/validation.ts  # Лимиты, правила валидации
/constants/ui.ts          # Размеры, отступы
/constants/styles.ts      # Классы, z-index
```

---

## 📚 Связанные документы

- **`/docs/BUSINESS_LOGIC.md`** - Подробное описание всей бизнес-логики
- **`/guidelines/FileStructure.md`** - Полная структура проекта
- **`/docs/MODAL_SYSTEM.md`** - Система модальных окон
- **`/docs/ZUSTAND_QUICKSTART.md`** - Работа со store
- **`/constants/README.md`** - Документация по константам

---

## ✅ Чек-лист перед коммитом

Перед тем как закончить задачу, проверь:

- [ ] Обновлены типы TypeScript?
- [ ] Добав��ены комментарии на русском?
- [ ] Обновлена документация (если нужно)?
- [ ] Проверена работа в UI?
- [ ] Проверено сохранение в localStorage?
- [ ] Проверена валидация?
- [ ] Нет ошибок в консоли?
- [ ] Работает на разных экранах (мобильный/десктоп)?

---

**Вопросы?** Смотри код или спрашивай! 🚀
