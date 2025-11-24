# 🛠️ Типичные задачи: Пошаговые инструкции

**Дата обновления:** 23 ноября 2025

---

> **Цель:** Быстрые инструкции для частых задач с указанием конкретных файлов и строк кода.
>
> **Важно:** Задачи специфичные для habit-tracker перенесены в `/modules/habit-tracker/docs/HABIT_TASKS.md`

---

## 📋 Содержание

1. [Добавить новый action в store](#1-добавить-новый-action-в-store)
2. [Добавить новую валидацию](#2-добавить-новую-валидацию)
3. [Добавить новую константу](#3-добавить-новую-константу)
4. [Создать новое модальное окно](#4-создать-новое-модальное-окно)
5. [Добавить новый UI компонент](#5-добавить-новый-ui-компонент)

---

## 1. Добавить новый action в store

**Пример:** Добавить action `archiveHabit(habitId)` для архивации

### Шаг 1: Добавить поле в интерфейс (если нужно)

📁 **Файл:** `/modules/habit-tracker/types/index.ts`

```typescript
export interface Habit {
  id: string;
  name: string;
  // ... существующие поля
  archived?: boolean;  // ← ДОБАВИТЬ
}
```

### Шаг 2: Обновить типы store

📁 **Файл:** `/core/store/types.ts`

```typescript
export interface HabitsState {
  // ... state
  habits: Habit[];
  
  // ... actions
  archiveHabit: (habitId: string) => void;  // ← ДОБАВИТЬ
}
```

### Шаг 3: Создать action в slice

📁 **Файл:** `/core/store/slices/habits.ts`

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

📁 **Файл:** `/modules/habit-tracker/features/habits/components/HabitRow.tsx`

```typescript
import { useHabitsStore } from '@/core/store';

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

## 2. Добавить новую валидацию

**Пример:** Проверка что название привычки не дублируется

### Шаг 1: Добавить функцию валидации

📁 **Файл:** `/shared/constants/validation.ts`

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

📁 **Файл:** `/modules/habit-tracker/features/habits/components/add/AddHabitForm.tsx`

```typescript
import { validateUniqueHabitName } from '@/shared/constants/validation';
import { useHabitsStore } from '@/core/store';

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

📁 **Файл:** `/shared/constants/validation.ts`

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

## 3. Добавить новую константу

**Пример:** Добавить константу для максимального количества тегов

### Шаг 1: Определить где хранить константу

**Категории констант:**
- **UI:** размеры, отступы, анимации → `/shared/constants/ui.ts`
- **Цвета:** палитра, теги → `/shared/constants/colors.ts`
- **Валидация:** лимиты, правила → `/shared/constants/validation.ts`
- **Стили:** классы, z-index → `/shared/constants/styles.ts`
- **Иконки:** список иконок → `/shared/constants/icons.ts`
- **Единицы:** измерения → `/modules/habit-tracker/shared/constants/units.ts`

### Шаг 2: Добавить константу

📁 **Файл:** `/shared/constants/validation.ts`

```typescript
/**
 * Максимальное количество тегов
 */
export const MAX_TAGS = 20;
```

### Шаг 3: Экспортировать из index.ts (если есть)

📁 **Файл:** `/shared/constants/index.ts`

```typescript
export {
  MAX_HABIT_NAME_LENGTH,
  MAX_TAGS,  // ← ДОБАВИТЬ
  // ... остальные
} from './validation';
```

### Шаг 4: Использовать в коде

📁 **Файл:** `/shared/components/tag-picker/TagPicker.tsx`

```typescript
import { MAX_TAGS } from '@/shared/constants/validation';

function TagPicker() {
  const tags = useHabitsStore((state) => state.tags);
  
  const canAddTag = tags.length < MAX_TAGS;
  
  return (
    <button disabled={!canAddTag}>
      {canAddTag ? 'Добавить тег' : `Максимум ${MAX_TAGS} тегов`}
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

## 4. Создать новое модальное окно

**Пример:** Создать модалку "Экспорт данных"

### Шаг 1: Создать компонент модалки

📁 **Файл:** `/shared/components/modals/ExportDataModal.tsx`

```typescript
import { X } from '@/shared/icons';
import { MODAL_STYLES, MODAL_WIDTHS } from '@/shared/constants/styles';

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

📁 **Файл:** `/core/store/types.ts`

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

📁 **Файл:** `/core/store/slices/modals.ts`

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

📁 **Файл:** `/core/store/initialState.ts`

```typescript
export const initialState = {
  // ... modals
  isAddHabitModalOpen: false,
  isExportModalOpen: false,  // ← ДОБАВИТЬ
};
```

### Шаг 5: Подключить в HabitTrackerModals (или создать новый менеджер)

📁 **Файл:** `/core/modals/HabitTrackerModals.tsx`

```typescript
import { ExportDataModal } from '@/shared/components/modals/ExportDataModal';
import { useHabitsStore } from '@/core/store';

export function HabitTrackerModals() {
  const isExportModalOpen = useHabitsStore((state) => state.isExportModalOpen);
  const closeExportModal = useHabitsStore((state) => state.closeExportModal);
  
  return (
    <>
      {/* Существующие модалки */}
      <AddHabitModal />
      <ManageHabitsModal />
      
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

📁 **Файл:** `/shared/components/layout/Sidebar.tsx`

```typescript
import { useHabitsStore } from '@/core/store';

function Sidebar() {
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

**См. также:** `/docs/ui-systems/MODAL_SYSTEM.md`

---

## 5. Добавить новый UI компонент

**Пример:** Создать компонент Badge (значок)

### ⚠️ ВАЖНО: Не изменяй `/components/ui/`

Файлы в `/components/ui/` — это защищённые компоненты от Figma/shadcn. **НЕ ПЕРЕНОСИТЬ И НЕ ИЗМЕНЯТЬ!**

### Шаг 1: Создать компонент

📁 **Файл:** `/shared/components/badge.tsx`

```typescript
import { cn } from '@/lib/utils';

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
        'inline-flex items-center px-2 py-0.5 rounded text-xs',
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

📁 **Файл:** `/shared/components/index.ts`

```typescript
export { Badge } from './badge';
export type { BadgeVariant } from './badge';
```

### Шаг 3: Использовать в коде

📁 **Файл:** `/modules/habit-tracker/features/habits/components/HabitRow.tsx`

```typescript
import { Badge } from '@/shared/components';

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
- ❌ **НЕ создавай компоненты в `/components/ui/`** — это защищённая папка!

---

## 🔍 Быстрая авигация

### 🏪 Core Store (Zustand)

```bash
# лавная структура
/core/store/index.ts         # Главный store с persist
/core/store/types.ts         # HabitsState (полный интерфейс)
/core/store/initialState.ts # Начальные значения и DEFAULT_CATEGORIES

# Slices
/core/store/slices/habits.ts     # addHabit(), updateHabit(), toggleCompletion()
/core/store/slices/goals.ts      # updateMonthlyGoal()
/core/store/slices/ui.ts         # setSelectedMonth(), toggleSidebar()
/core/store/slices/modals.ts     # openAddHabitModal(), closeAddHabitModal()
/core/store/slices/internal.ts   # updateAllHabitsStrength()
```

### 🌐 Shared (универсальные утилиты)

```bash
# Утилиты для работы с текстом
/shared/utils/text/textUtils.ts   # declineUnit(), formatNumber(), склонение

# Утилиты для работы с датами
/shared/utils/date/dateUtils.ts   # formatDate(), getDaysInMonth(), getDayName()

# Константы
/shared/constants/colors.ts       # TAG_COLORS, STRENGTH_THRESHOLDS, UI_COLORS
/shared/constants/validation.ts   # VALIDATION_RULES, MAX_HABIT_NAME_LENGTH
/shared/constants/icons.ts        # AVAILABLE_ICONS
/shared/constants/ui.ts           # UI_SIZES, Z_INDEX
/shared/constants/styles.ts       # MODAL_STYLES, INPUT_CLASSES, BUTTON_CLASSES
```

### 🧩 Компоненты

```bash
# Модалки
/components/modals/AppModals.tsx  # Центральный компонент для всех модалок

# UI компоненты (ЗАЩИЩЁННЫЕ!)
/components/ui/                   # shadcn/ui компоненты - НЕ ИЗМЕНЯТЬ!

# Shared компоненты
/shared/components/               # Общие переиспользуемые компоненты
```

### 🎯 Модуль habit-tracker

```bash
# Типы
/modules/habit-tracker/types/index.ts  # Habit, HabitData, FrequencyConfig, Reminder

# Фичи
/modules/habit-tracker/features/habits/          # CRUD привычек
/modules/habit-tracker/features/strength/        # Система силы привычки (EMA)
/modules/habit-tracker/features/frequency/       # Система частоты выполнения
/modules/habit-tracker/features/tags/            # Теги привычек
/modules/habit-tracker/features/calendar/        # Календарь и галочки
/modules/habit-tracker/features/statistics/      # Прогресс и статистика
/modules/habit-tracker/features/notifications/   # Напоминания

# Утилиты
/modules/habit-tracker/features/habits/utils/habitUtils.ts          # Проверка выполнения, прогресс
/modules/habit-tracker/features/strength/utils/strengthCalculator.ts  # Расчёт EMA
/modules/habit-tracker/shared/constants/units.ts                     # 22 единицы измерения
```

---

## 📚 Связанные документы

**Для habit-tracker модуля:**
- `/modules/habit-tracker/docs/HABIT_TASKS.md` - Задачи специфичные для привычек
- `/modules/habit-tracker/docs/BUSINESS_LOGIC.md` - Подробное описание EMA, типов, частоты

**Общая документация:**
- `/docs/README.md` - Главная навигация
- `/docs/FileStructure.md` - Полная структура проекта
- `/docs/getting-started/COMPONENT_PATTERNS.md` - Паттерны кода
- `/docs/state-management/ZUSTAND_QUICKSTART.md` - Работа со store
- `/docs/ui-systems/MODAL_SYSTEM.md` - Система модальных окон
- `/docs/ui-systems/INPUT_STYLES_EXAMPLES.md` - Стили input полей
- `/docs/architecture/STORE_ARCHITECTURE.md` - Архитектура Zustand Store
- `/docs/architecture/UI_SEPARATION_RULES.md` - Правила разделения UI

---

## ✅ Чек-лист перед коммитом

Перед тем как закончить задачу, проверь:

- [ ] Обновлены типы TypeScript?
- [ ] Добавлены комментарии на русском?
- [ ] Обновлена документация (README компонента, /docs/HISTORY.md)?
- [ ] Проверена работа в UI?
- [ ] Проверено сохранение в localStorage?
- [ ] Проверена валидация?
- [ ] Нет ошибок в консоли?
- [ ] Работает на разных экранах (мобильный/десктоп)?

---

**Вопросы?** Смотри код или спрашивай! 🚀