# 🗂️ План реализации фичи "Разделы привычек"

**Дата создания:** 24 ноября 2025  
**Статус:** ⏳ В планировании

---

## 🎯 Цель

Добавить систему разделов для привычек (Утро, День, Вечер, Другие + кастомные), чтобы пользователи могли организовать привычки по времени дня.

---

## 📋 Требования

### Базовые требования:
- ✅ Разделы хранятся глобально в Zustand Store (как теги)
- ✅ У каждой привычки есть поле `section: string`
- ✅ Единичный выбор раздела (не мультиселект)
- ✅ Раздел выбирается на первом шаге добавления привычки (перед тегами)
- ✅ Раздел можно менять в модальном окне редактирования

### Дефолтные разделы:
- ✅ **"Другие"** — дефолтное значение, всегда первый в списке, нельзя удалить
- ✅ **"Утро"**, **"День"**, **"Вечер"** — можно удалить

### Порядок отображения:
```
1. Другие (дефолт)
2. Утро
3. День
4. Вечер
5. [Кастомные разделы по алфавиту]
6. [+ кнопка добавления]
```

### UI компонент:
- ✅ Dropdown как у TagPicker
- ✅ **БЕЗ** ColorPicker
- ✅ **БЕЗ** эмодзи иконок
- ✅ **ТОЛЬКО** текст (названия разделов)
- ✅ Единичный выбор (radio-style)

### Валидация:
- ✅ Пустое название — запрещено
- ✅ Дубликаты — запрещены (показать предупреждение)
- ✅ Trim пробелов в начале/конце
- ✅ Нормализация множественных пробелов → один пробел

### Удаление раздела:
- ✅ "Другие" — нельзя удалить (защищён)
- ✅ "Утро", "День", "Вечер" — можно удалить
- ✅ При удалении — показать ConfirmDialog с предупреждением
- ✅ Все привычки из удаляемого раздела → переносятся в "Другие"

### Сообщение при удалении:
```
Заголовок: "Удалить раздел?"
Текст: 
Раздел "[Название]" используется в [N] привычках.

Все привычки из этого раздела будут перенесены в "Другие".

Продолжить?
```

---

## 🏗️ Архитектура

### Структура файлов:

```
/shared/components/section-picker/
├── SectionPicker.tsx          ← новый компонент
├── README.md                  ← документация
└── index.ts                   ← экспорты

/core/store/slices/
├── sections.ts                ← новый слайс

/core/store/
├── types.ts                   ← обновить (добавить Section типы)
├── initialState.ts            ← обновить (добавить sections)
└── index.ts                   ← обновить (экспорт actions)

/modules/habit-tracker/features/habits/components/add/
├── HabitBasicInfoStep.tsx     ← обновить (добавить SectionPicker)

/modules/habit-tracker/features/habits/components/manage/
├── HabitItem.tsx              ← обновить (добавить секцию с SectionPicker)

/docs/
├── FileStructure.md           ← обновить
└── HISTORY.md                 ← добавить запись
```

---

## 📝 Детальный чеклист реализации

### Этап 1: Типы и Store (20 минут)

#### ☐ 1.1. Обновить `/core/store/types.ts`

```typescript
// Добавить в AppState:
export interface AppState {
  // ... существующие поля
  
  // Разделы привычек
  sections: string[];
  
  // Actions: Разделы
  addSection: (name: string) => void;
  deleteSection: (name: string) => void;
}

// Обновить Habit interface:
export interface Habit {
  // ... существующие поля
  section: string; // "Другие" | "Утро" | "День" | "Вечер" | кастомное
}
```

**Проверить:**
- [ ] Импорты корректные
- [ ] TypeScript не ругается на новые поля

---

#### ☐ 1.2. Обновить `/core/store/initialState.ts`

```typescript
export const initialState: AppState = {
  // ... существующие поля
  
  // Разделы (дефолтные)
  sections: ['Другие', 'Утро', 'День', 'Вечер'],
};
```

**Проверить:**
- [ ] Порядок правильный (Другие первый)
- [ ] Нет лишних полей

---

#### ☐ 1.3. Создать `/core/store/slices/sections.ts`

```typescript
/**
 * Slice для управления разделами привычек
 * 
 * Разделы позволяют организовать привычки по времени дня (Утро, День, Вечер).
 * Дефолтный раздел "Другие" защищён от удаления.
 * 
 * @module core/store/slices/sections
 * @created 24 ноября 2025
 */

import { StateCreator } from 'zustand';
import { AppState } from '../types';

export interface SectionsSlice {
  // Разделы
  sections: string[];
  
  // Actions
  addSection: (name: string) => void;
  deleteSection: (name: string) => void;
}

export const createSectionsSlice: StateCreator<
  AppState,
  [],
  [],
  SectionsSlice
> = (set) => ({
  sections: ['Другие', 'Утро', 'День', 'Вечер'],
  
  /**
   * Добавить новый раздел
   * Автоматически добавляется в конец списка (после дефолтных)
   */
  addSection: (name: string) => {
    set((state) => {
      // Проверка на дубликат (case-insensitive, trim)
      const normalized = name.trim();
      const exists = state.sections.some(
        s => s.toLowerCase() === normalized.toLowerCase()
      );
      
      if (exists) {
        console.warn(`[Sections] Раздел "${name}" уже существует`);
        return state;
      }
      
      return {
        sections: [...state.sections, normalized],
      };
    });
  },
  
  /**
   * Удалить раздел
   * 
   * - Защита: нельзя удалить "Другие"
   * - Все привычки из этого раздела переносятся в "Другие"
   */
  deleteSection: (name: string) => {
    set((state) => {
      // Защита от удаления "Другие"
      if (name === 'Другие') {
        console.warn('[Sections] Нельзя удалить раздел "Другие"');
        return state;
      }
      
      return {
        // Удалить раздел из списка
        sections: state.sections.filter(s => s !== name),
        
        // Переместить все привычки из этого раздела в "Другие"
        habits: state.habits.map(h => 
          h.section === name ? { ...h, section: 'Другие' } : h
        ),
      };
    });
  },
});
```

**Проверить:**
- [ ] Импорты корректные
- [ ] Защита "Другие" работает
- [ ] Перенос привычек при удалении
- [ ] Проверка дубликатов (case-insensitive)
- [ ] Комментарии на русском

---

#### ☐ 1.4. Обновить `/core/store/index.ts`

```typescript
// Импортировать слайс
import { createSectionsSlice } from './slices/sections';

// Добавить в combine()
export const useHabitsStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createHabitsSlice(...a),
      ...createCategoriesSlice(...a),
      ...createGoalsSlice(...a),
      ...createTagsSlice(...a),
      ...createSectionsSlice(...a), // ← добавить
      ...createModalSlice(...a),
      ...createInternalSlice(...a),
      ...createManageHabitsModalSlice(...a),
      ...createAddHabitFormSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: 'habits-storage',
      // ...
    }
  )
);
```

**Проверить:**
- [ ] Импорт правильный
- [ ] Слайс добавлен в combine
- [ ] TypeScript не ругается

---

#### ☐ 1.5. Миграция существующих привычек

**В `initialState.ts` или в `migrations`:**

```typescript
// При загрузке store проверить, что у всех привычек есть section
// Если нет — установить "Другие"
habits: state.habits.map(h => ({
  ...h,
  section: h.section || 'Другие',
}))
```

**Проверить:**
- [ ] Существующие привычки получили раздел "Другие"
- [ ] Новые привычки создаются с section = "Другие"

---

### Этап 2: Компонент SectionPicker (40 минут)

#### ☐ 2.1. Создать `/shared/components/section-picker/SectionPicker.tsx`

**Основа:**
- Скопировать структуру из `TagPicker.tsx`
- Удалить ColorPicker
- Удалить эмодзи/иконки
- Изменить на единичный выбор (radio-style)

**⚠️ КРИТИЧЕСКИ ВАЖНО: Input Guards**

SectionPicker использует Dropdown конструктор, который должен иметь **Input Guards** из TagPicker (добавлены 23 ноября):

1. **Guard #1** в `handleKeyDown` - игнорировать keyboard navigation если фокус в INPUT/TEXTAREA/SELECT
2. **Guard #2** в `useEffect` - не перехватывать фокус если пользователь вводит данные

Если guard'ы отсутствуют → фокус будет перескакивать с input на кнопки при вводе!

**Проверить перед реализацией:**
- [ ] `/shared/constructors/dropdown/Dropdown.tsx` содержит Input Guards
- [ ] Guard #1: `if (target.tagName === 'INPUT' || ...) return;` в handleKeyDown
- [ ] Guard #2: `if (activeElement?.tagName === 'INPUT' || ...) return;` в useEffect

**Ключевые отличия от TagPicker:**

| Функция | TagPicker | SectionPicker |
|---------|-----------|---------------|
| Выбор | Множественный (`selectedTags: string[]`) | Единичный (`selectedSection: string`) |
| Placeholder | "Без тега" | "Другие" |
| ColorPicker | ✅ Есть | ❌ Нет |
| Иконки | ✅ Tag icon | ❌ Нет иконок |
| Защита от удаления | ❌ Нет | ✅ "Другие" нельзя удалить |
| Кнопка очистки | "Без тега" | Кнопка "Другие" |

**Интерфейсы:**

```typescript
export interface SectionPickerProps {
  /** Выбранный раздел */
  selectedSection: string;
  /** Callback выбора раздела */
  onSelectSection: (section: string) => void;
  /** Список разделов */
  sections: string[];
  /** Callback добавления раздела */
  onAddSection: (name: string) => void;
  /** Callback удаления раздела */
  onDeleteSection: (name: string) => void;
  /** Функция для получения количества привычек в разделе */
  getSectionUsageCount: (sectionName: string) => number;
  /** Открыт ли dropdown */
  isOpen: boolean;
  /** Toggle функция */
  onToggle: () => void;
}
```

**Структура компонента:**

```typescript
/**
 * Generic компонент выбора раздела
 * 
 * Универсальный UI компонент для управления разделами.
 * Используется для организации привычек по времени дня.
 * 
 * @module shared/components/section-picker
 * @created 24 ноября 2025
 */

import React, { useState, useEffect, useRef } from 'react';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';
import { Button } from '@/shared/components/button';
import { INPUT_STYLES } from '@/shared/constants/styles';
import { Dropdown } from '@/shared/constructors/dropdown';
import { ChevronDown, Plus, Close } from '@/shared/icons';
import { ConfirmDialog } from '@/shared/components/modals';
import { AlertCircle } from '@/shared/icons';

// Интерфейсы...

function SectionPickerContent({ ... }) {
  // Состояние для добавления нового раздела
  const [isAdding, setIsAdding] = useState(false);
  const [newSection, setNewSection] = useState('');
  const [deletingSection, setDeletingSection] = useState<{ name: string; usageCount: number } | null>(null);
  
  // Валидация
  const normalized = newSection.trim().replace(/\s+/g, ' ');
  const alreadyExists = normalized && sections.some(
    s => s.toLowerCase() === normalized.toLowerCase()
  );
  
  // Добавить раздел
  const handleAdd = () => {
    if (!normalized || alreadyExists) return;
    onAddSection(normalized);
    onSelectSection(normalized); // Автоматически выбрать новый раздел
    setNewSection('');
    setIsAdding(false);
  };
  
  // Удалить раздел (с подтверждением)
  const handleDelete = (e: React.MouseEvent, sectionName: string) => {
    e.stopPropagation();
    
    // Защита от удаления "Другие"
    if (sectionName === 'Другие') return;
    
    const usageCount = getSectionUsageCount(sectionName);
    setDeletingSection({ name: sectionName, usageCount });
  };
  
  const confirmDelete = () => {
    if (!deletingSection) return;
    onDeleteSection(deletingSection.name);
    
    // Если это был выбранный раздел, переключить на "Другие"
    if (selectedSection === deletingSection.name) {
      onSelectSection('Другие');
    }
    
    setDeletingSection(null);
  };
  
  return (
    <>
      <Dropdown.Content direction="down" width="full" maxHeight="300px" className="p-3">
        {/* Подсказка */}
        <div className="text-xs text-gray-500 mb-2">
          Выберите раздел:
        </div>
        
        {/* Список разделов (кнопки radio-style) */}
        <div className="flex flex-col gap-1 mb-3">
          {sections.map((section) => {
            const isSelected = selectedSection === section;
            const isProtected = section === 'Другие';
            
            return (
              <button
                key={section}
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => onSelectSection(section)}
                className={`group relative px-3 py-2 rounded text-sm text-left transition-all ${
                  isSelected 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{section}</span>
                  
                  {/* Кнопка удаления (только для неprotected) */}
                  {!isProtected && (
                    <span 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDelete(e, section)}
                      title="Удалить раздел"
                    >
                      <Close className="w-3 h-3 hover:text-red-600 transition-colors" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          
          {/* Кнопка добавления */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-500 hover:bg-gray-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить раздел</span>
          </button>
        </div>
        
        {/* Форма добавления */}
        {isAdding && (
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newSection}
                  autoFocus
                  onChange={(e) => setNewSection(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') handleAdd();
                    if (e.key === 'Escape') {
                      setNewSection('');
                      setIsAdding(false);
                    }
                  }}
                  placeholder="Название раздела..."
                  className={`w-full ${INPUT_STYLES.standard} pr-12`}
                  maxLength={TEXT_LENGTH_LIMITS.tagName.max}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                  {TEXT_LENGTH_LIMITS.tagName.max - newSection.length}
                </span>
              </div>
              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!newSection.trim() || alreadyExists}
                className="text-sm !py-2 px-4"
              >
                Добавить
              </Button>
            </div>
            
            {/* Предупреждение о дубликате */}
            {alreadyExists && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Раздел с таким названием уже существует
              </p>
            )}
          </div>
        )}
      </Dropdown.Content>
      
      {/* ConfirmDialog для удаления */}
      {deletingSection && (
        <ConfirmDialog
          title="Удалить раздел?"
          message={
            `Раздел "${deletingSection.name}" используется в ${deletingSection.usageCount} ${
              deletingSection.usageCount === 1 ? 'привычке' : 'привычках'
            }.\n\nВсе привычки из этого раздела будут перенесены в "Другие".\n\nПродолжить?`
          }
          confirmText="Удалить"
          cancelText="Отмена"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingSection(null)}
        />
      )}
    </>
  );
}

export function SectionPicker({ ... }: SectionPickerProps) {
  return (
    <div className="relative" data-picker="section">
      <div className="relative">
        <Dropdown.Root 
          closeOnSelect={true} // ← единичный выбор, закрывать сразу
          isOpen={isOpen} 
          onOpenChange={(open) => !open && onToggle()}
          enableTypeahead={false}
        >
          {/* Триггер */}
          <Dropdown.Trigger 
            onClick={onToggle}
            className="w-full px-3 py-2 border border-gray-200 rounded cursor-pointer hover:border-gray-300 transition-colors text-sm text-left flex items-center justify-between"
          >
            <span className="text-gray-900">{selectedSection}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Dropdown.Trigger>
          
          <SectionPickerContent {...contentProps} />
        </Dropdown.Root>
      </div>
    </div>
  );
}
```

**Проверить:**
- [ ] Компонент компилируется без ошибок
- [ ] Единичный выбор работает (radio-style)
- [ ] "Другие" нельзя удалить
- [ ] ConfirmDialog показывается при удалении
- [ ] Валидация (пустое название, дубликаты)
- [ ] Автоматический выбор нового раздела после создания
- [ ] Переключение на "Другие" при удалении выбранного раздела
- [ ] Keyboard navigation (Enter, Escape)

---

#### ☐ 2.2. Создать `/shared/components/section-picker/README.md`

```markdown
# 🗂️ SectionPicker

Универсальный компонент для выбора раздела привычки.

## Использование

\`\`\`tsx
import { SectionPicker } from '@/shared/components/section-picker';

<SectionPicker
  selectedSection={habit.section}
  onSelectSection={(section) => setHabit({ ...habit, section })}
  sections={store.sections}
  onAddSection={store.addSection}
  onDeleteSection={store.deleteSection}
  getSectionUsageCount={(name) => habits.filter(h => h.section === name).length}
  isOpen={isOpen}
  onToggle={() => setIsOpen(!isOpen)}
/>
\`\`\`

## Props

- `selectedSection` — выбранный раздел
- `onSelectSection` — callback выбора
- `sections` — список разделов из store
- `onAddSection` — добавить новый раздел
- `onDeleteSection` — удалить раздел
- `getSectionUsageCount` — количество привычек в разделе
- `isOpen` — состояние dropdown
- `onToggle` — переключение dropdown

## Особенности

- **Единичный выбор** (radio-style)
- **Без ColorPicker** (только текст)
- **Защита от удаления** "Другие"
- **Валидация** (пустое название, дубликаты)
- **ConfirmDialog** при удалении

## Дата создания

24 ноября 2025
```

**Проверить:**
- [ ] Примеры кода корректные
- [ ] Описание полное

---

#### ☐ 2.3. Создать `/shared/components/section-picker/index.ts`

```typescript
export { SectionPicker } from './SectionPicker';
export type { SectionPickerProps } from './SectionPicker';
```

**Проверить:**
- [ ] Экспорты работают

---

### Этап 3: Интеграция в AddHabitModal (15 минут)

#### ☐ 3.1. Обновить `/modules/habit-tracker/features/habits/components/add/HabitBasicInfoStep.tsx`

**Добавить после "Название привычки", перед "Теги":**

```typescript
import { SectionPicker } from '@/shared/components/section-picker';

// В компоненте:
const sections = useHabitsStore(state => state.sections);
const addSection = useHabitsStore(state => state.addSection);
const deleteSection = useHabitsStore(state => state.deleteSection);
const habits = useHabitsStore(state => state.habits);

const [isSectionPickerOpen, setIsSectionPickerOpen] = useState(false);

// В render:
{/* Раздел */}
<div>
  <label className="block text-sm text-gray-700 mb-1.5">
    Раздел
  </label>
  <SectionPicker
    selectedSection={formData.section || 'Другие'}
    onSelectSection={(section) => onChange({ section })}
    sections={sections}
    onAddSection={addSection}
    onDeleteSection={deleteSection}
    getSectionUsageCount={(name) => habits.filter(h => h.section === name).length}
    isOpen={isSectionPickerOpen}
    onToggle={() => setIsSectionPickerOpen(!isSectionPickerOpen)}
  />
</div>
```

**Позиция в layout:**
```
1. Иконка
2. Название привычки
3. Раздел ← ЗДЕСЬ (новое)
4. Теги
5. Тип привычки
```

**Проверить:**
- [ ] SectionPicker отображается на шаге 1
- [ ] Дефолтное значение "Другие"
- [ ] Выбор раздела сохраняется в formData
- [ ] Layout не сломан

---

#### ☐ 3.2. Обновить типы formData

Убедиться, что в `addHabitForm.ts` есть поле `section`:

```typescript
export interface AddHabitFormData {
  // ... существующие поля
  section: string;
}

// В initialFormData:
section: 'Другие',
```

**Проверить:**
- [ ] Поле section добавлено
- [ ] Дефолтное значение "Другие"

---

### Этап 4: Интеграция в ManageHabitsModal (15 минут)

#### ☐ 4.1. Обновить `/modules/habit-tracker/features/habits/components/manage/HabitItem.tsx`

**Добавить секцию "Раздел" после "Иконка и название":**

```typescript
import { SectionPicker } from '@/shared/components/section-picker';

// В компоненте:
const sections = useHabitsStore(state => state.sections);
const addSection = useHabitsStore(state => state.addSection);
const deleteSection = useHabitsStore(state => state.deleteSection);
const habits = useHabitsStore(state => state.habits);

const [isSectionPickerOpen, setIsSectionPickerOpen] = useState(false);

// В render (после иконки/названия):
{/* Раздел */}
<div>
  <label className="block text-xs text-gray-500 mb-1">
    Раздел
  </label>
  <SectionPicker
    selectedSection={editedHabit.section || 'Другие'}
    onSelectSection={(section) => setEditedHabit({ ...editedHabit, section })}
    sections={sections}
    onAddSection={addSection}
    onDeleteSection={deleteSection}
    getSectionUsageCount={(name) => habits.filter(h => h.section === name).length}
    isOpen={isSectionPickerOpen}
    onToggle={() => setIsSectionPickerOpen(!isSectionPickerOpen)}
  />
</div>
```

**Проверить:**
- [ ] SectionPicker отображается в ManageHabitsModal
- [ ] Изменение раздела сохраняется
- [ ] Layout не сломан

---

### Этап 5: Обновление создания привычки (10 минут)

#### ☐ 5.1. Проверить создание новой привычки

В `habits.ts` слайсе, в функции `addHabit`:

```typescript
addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'skipped' | 'strengthHistory'>) => {
  const newHabit: Habit = {
    ...habit,
    id: generateId(),
    createdAt: new Date().toISOString(),
    completions: {},
    skipped: {},
    strengthHistory: [],
    section: habit.section || 'Другие', // ← убедиться что есть fallback
  };
  
  set((state) => ({
    habits: [...state.habits, newHabit],
  }));
}
```

**Проверить:**
- [ ] Новые привычки создаются с section
- [ ] Fallback на "Другие" работает

---

### Этап 6: Тестирование (20 минут)

#### ☐ 6.1. Тест добавления раздела
- [ ] Открыть AddHabitModal
- [ ] Нажать на SectionPicker
- [ ] Нажать "+ Добавить раздел"
- [ ] Ввести название "Ночь"
- [ ] Нажать "Добавить"
- [ ] Проверить что раздел появился в списке
- [ ] Проверить что раздел автоматически выбран

#### ☐ 6.2. Тест валидации
- [ ] Попробовать добавить раздел с пустым названием (кнопка disabled)
- [ ] Попробовать добавить дубликат "Утро" (показывается предупреждение)
- [ ] Попробовать добавить "  Утро  " (должен показать дубликат)
- [ ] Добавить раздел с множественными пробелами "День    Отдыха" → "День Отдыха"

#### ☐ 6.3. Тест удаления раздела
- [ ] Создать кастомный раздел "Тест"
- [ ] Создать привычку в разделе "Тест"
- [ ] Попробовать удалить раздел "Тест"
- [ ] Проверить что показывается ConfirmDialog
- [ ] Подтвердить удаление
- [ ] Проверить что привычка переместилась в "Другие"

#### ☐ 6.4. Тест защиты "Другие"
- [ ] Открыть SectionPicker
- [ ] Навести на "Другие"
- [ ] Проверить что НЕТ кнопки удаления (Close icon)
- [ ] Попробовать вызвать deleteSection('Другие') через консоль
- [ ] Проверить что в консоли warning

#### ☐ 6.5. Тест удаления дефолтных
- [ ] Удалить раздел "Утро" (должно работать)
- [ ] Удалить раздел "День" (должно работать)
- [ ] Удалить раздел "Вечер" (должно работать)

#### ☐ 6.6. Тест порядка разделов
- [ ] Добавить кастомный раздел "Аааа"
- [ ] Добавить кастомный раздел "Ябло"
- [ ] Проверить порядок: Другие → Утро → День → Вечер → Аааа → Ябло

#### ☐ 6.7. Тест редактирования
- [ ] Открыть ManageHabitsModal
- [ ] Изменить раздел привычки с "Утро" на "Вечер"
- [ ] Сохранить
- [ ] Проверить что раздел изменился

#### ☐ 6.8. Тест persist
- [ ] Добавить кастомный раздел "Персист Тест"
- [ ] Обновить страницу (F5)
- [ ] Проверить что раздел сохранился в store

#### ☐ 6.9. Тест фокуса в input (Input Guards)
- [ ] Открыть SectionPicker
- [ ] Нажать "+ Добавить раздел"
- [ ] Проверить что input получил автофокус
- [ ] Начать вводить текст "Ночь"
- [ ] **КРИТИЧЕСКИ ВАЖНО:** Проверить что фокус НЕ перескакивает на кнопки разделов при вводе
- [ ] Нажать Enter - раздел должен добавиться
- [ ] Открыть форму снова, начать вводить и нажать Escape - форма должна закрыться

---

### Этап 7: Документация (15 минут)

#### ☐ 7.1. Обновить `/docs/FileStructure.md`

**Добавить в раздел `/shared/components/`:**

```markdown
### `/shared/components/section-picker/`

Универсальный компонент выбора раздела привычки.

**Файлы:**
- `SectionPicker.tsx` - основной компонент (единичный выбор, без ColorPicker)
- `README.md` - документация и примеры использования
- `index.ts` - экспорты

**Использов��ние:**
```tsx
<SectionPicker
  selectedSection={habit.section}
  onSelectSection={handleSelect}
  sections={store.sections}
  onAddSection={store.addSection}
  onDeleteSection={store.deleteSection}
  getSectionUsageCount={...}
  isOpen={isOpen}
  onToggle={toggleDropdown}
/>
```

**Особенности:**
- Единичный выбор раздела (radio-style)
- Дефолтные разделы: Другие, Утро, День, Вечер
- "Другие" защищён от удаления
- ConfirmDialog при удалении раздела с привычками
- Валидация: пустое название и дубликаты запрещены
```

**Добавить в раздел `/core/store/slices/`:**

```markdown
- `sections.ts` - управление разделами привычек (Утро, День, Вечер, кастомные)
```

**Проверить:**
- [ ] Добавлены все новые файлы
- [ ] Описания полные
- [ ] Примеры корректные

---

#### ☐ 7.2. Обновить `/docs/HISTORY.md`

```markdown
## 24 ноября 2025

### ✨ Фича: Разделы привычек

**Реализовано:**
- Система разделов для организации привычек по времени дня
- Дефолтные разделы: "Другие" (по умолчанию), "Утро", "День", "Вечер"
- Возможность создавать кастомные разделы
- Защита раздела "Другие" от удаления
- Автоматический перенос привычек в "Другие" при удалении раздела

**Новые компоненты:**
- `/shared/components/section-picker/SectionPicker.tsx` - компонент выбора раздела
  - Единичный выбор (radio-style)
  - Без ColorPicker и эмодзи иконок
  - ConfirmDialog при удалении раздела с привычками
  - Валидация (дубликаты, пустое название)

**Store изменения:**
- `/core/store/slices/sections.ts` - новый слайс для управления разделами
  - `addSection(name)` - добавить раздел
  - `deleteSection(name)` - удалить раздел с переносом привычек в "Другие"
- `/core/store/types.ts` - добавлено поле `section: string` в `Habit`
- `/core/store/initialState.ts` - дефолтные разделы

**Интеграция:**
- `AddHabitModal` - выбор раздела на шаге 1 (перед тегами)
- `ManageHabitsModal` - редактирование раздела привычки

**Валидация:**
- Пустое название раздела запрещено
- Дубликаты запрещены (case-insensitive, с trim)
- Нормализация множественных пробелов

**UX улучшения:**
- Автоматический выбор нового раздела после создания
- Переключение на "Другие" при удалении выбранного раздела
- Keyboard navigation (Enter для добавления, Escape для отмены)
```

**Проверить:**
- [ ] Запись добавлена с правильной датой
- [ ] Описание полное
- [ ] Форматирование корректное

---

#### ☐ 7.3. Обновить `/shared/components/section-picker/README.md`

(уже создан в Этапе 2.2)

**Проверить:**
- [ ] Примеры кода актуальные
- [ ] API описан полностью

---

### Этап 8: Финальная проверка (10 минут)

#### ☐ 8.1. Code Review чеклист
- [ ] Все комментарии на русском
- [ ] TypeScript типы корректные
- [ ] Нет console.log (кроме logger)
- [ ] Нет дублирования кода
- [ ] Названия переменных понятные
- [ ] Функции небольшие и читаемые

#### ☐ 8.2. Accessibility чеклист
- [ ] `role="menuitemradio"` для radio-style выбора
- [ ] `aria-checked` для выбранного раздела
- [ ] Keyboard navigation работает
- [ ] Focus management правильный

#### ☐ 8.3. Performance чеклист
- [ ] Нет лишних ререндеров
- [ ] useCallback/useMemo где нужно (если есть)
- [ ] Dropdown закрывается быстро

#### ☐ 8.4. UI/UX чеклист
- [ ] Анимации плавные
- [ ] Hover эффекты работают
- [ ] Кнопки реагируют на клики
- [ ] ConfirmDialog центрирован
- [ ] Текст читаемый (контраст)
- [ ] Responsive (если нужно)

---

## ✅ Критерии готовности (Definition of Done)

- [ ] Все этапы выполнены
- [ ] Все тесты пройдены
- [ ] Документация обновлена
- [ ] Нет TypeScript ошибок
- [ ] Нет console warnings
- [ ] Code review пройден
- [ ] Accessibility проверен
- [ ] Привычки создаются с разделом
- [ ] Разделы сохраняются в localStorage
- [ ] "Другие" нельзя удалить
- [ ] Привычки переносятся при удалении раздела

---

## 🚧 Известные ограничения / TODO для будущего

- [ ] Группировка привычек по разделам в основном интерфейсе (следующая фича)
- [ ] Переименование разделов
- [ ] Статистика по разделам
- [ ] Фильтр по разделам в HabitsFilterDropdown

---

## 📊 Оценка времени

| Этап | Оценка | Статус |
|------|--------|--------|
| 1. Типы и Store | 20 мин | ⏳ |
| 2. SectionPicker | 40 мин | ⏳ |
| 3. AddHabitModal | 15 мин | ⏳ |
| 4. ManageHabitsModal | 15 мин | ⏳ |
| 5. Создание привычки | 10 мин | ⏳ |
| 6. Тестирование | 20 мин | ⏳ |
| 7. Документация | 15 мин | ⏳ |
| 8. Финальная проверка | 10 мин | ⏳ |
| **ИТОГО** | **~2.5 часа** | ⏳ |

---

**Дата создания:** 24 ноября 2025  
**Последнее обновление:** 24 ноября 2025