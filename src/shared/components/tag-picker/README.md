# 🏷️ TagPicker - Универсальный компонент выбора тегов

> **Статус:** Production-ready ✅  
> **Дата создания:** 23 ноября 2025  
> **Последнее обновление:** 23 ноября 2025  

---

## 📋 Обзор

`TagPicker` - это универсальный компонент для выбора тегов с поддержкой:
- ✅ Множественного выбора (мультиселект)
- ✅ Добавления новых тегов с цветами
- ✅ Удаления тегов с подтверждением
- ✅ Защиты от дубликатов (case-insensitive + trim)
- ✅ Полной keyboard navigation (Arrow keys, Home/End, Enter/Space, Escape)
- ✅ Автофокуса на input при добавлении тега
- ✅ Вложенного ColorPicker для выбора цвета
- ✅ Отображения количества привязанных объектов

**Построен на:** Dropdown конструктор + ColorPicker + Modal конструктор

---

## 🎯 Ключевые особенности

### 1. **Защита от дубликатов**

```typescript
// ✅ Case-insensitive + trim-aware проверка
const tagAlreadyExists = newTag.trim() && tags.some(
  tag => tag.name.trim().toLowerCase() === newTag.trim().toLowerCase()
);

// Защита от legacy данных с лишними пробелами
const existingTagNames = tags.map(t => t.name.trim().toLowerCase());
```

### 2. **Keyboard Navigation**

```typescript
// ✅ Кнопки тегов с role="menuitem" для автоматической навигации
<button
  role="menuitem"
  aria-checked={isSelected}
  onClick={handleToggle}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }}
>
  {/* Tag content */}
</button>
```

**Поддерживаемые клавиши:**
- `ArrowUp/ArrowDown` - навигация между тегами
- `Home/End` - переход к первому/последнему тегу
- `Enter/Space` - выбор тега
- `Escape` - закрытие dropdown

### 3. **Input Guards (критически важно!)**

Проблема: Когда пользователь вводит текст в input, Dropdown пытается применить keyboard navigation и фокус перескакивает на кнопки.

**Решение:** Двойная защита в Dropdown конструкторе

#### Guard #1: Keyboard Navigation

```typescript
// В Dropdown.handleKeyDown
const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  // ✅ Игнорируем события клавиатуры, если фокус в input/textarea/select
  const target = e.target as HTMLElement;
  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  ) {
    return; // ← Ранний выход, keyboard navigation не срабатывает
  }

  // ... остальная логика keyboard navigation
}
```

#### Guard #2: Focus Management

```typescript
// В Dropdown useEffect focus management
useEffect(() => {
  if (isOpen && contentRef.current) {
    // ✅ Проверяем: находится ли фокус в input/textarea/select
    const activeElement = document.activeElement;
    if (
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.tagName === 'SELECT'
    ) {
      return; // ← Не трогаем фокус, пользователь вводит данные
    }

    // ... автофокус на menuitem
  }
}, [isOpen, children]);
```

### 4. **Автофокус на Input**

```typescript
// ✅ useEffect для автофокуса при открытии формы добавления тега
useEffect(() => {
  if (isAddingTag && newTagInputRef.current) {
    // Небольшая задержка для корректного рендера
    setTimeout(() => {
      newTagInputRef.current?.focus();
    }, 0);
  }
}, [isAddingTag]);

// ✅ Дополнительная защита через autoFocus атрибут
<input
  ref={newTagInputRef}
  autoFocus
  onKeyDown={(e) => {
    e.stopPropagation(); // Предотвращаем обработку клавиш в Dropdown
    // ...
  }}
/>
```

### 5. **Вложенный Dropdown (ColorPicker)**

TagPicker содержит вложенный ColorPicker (тоже Dropdown). Используется паттерн `data-dropdown-id` для предотвращения конфликтов:

```typescript
// В Dropdown конструкторе
const dropdownId = useId(); // Уникальный ID

<div 
  ref={contentRef}
  data-dropdown-id={dropdownId} // ← Идентификация вложенности
  onClick={(e) => {
    const target = e.target as HTMLElement;
    const clickedDropdown = target.closest('[data-dropdown-id]');
    
    // Если клик внутри вложенного dropdown → не закрываем родительский
    if (clickedDropdown?.getAttribute('data-dropdown-id') !== dropdownId) {
      return;
    }
  }}
>
```

---

## 📦 API

### Props

```typescript
interface TagPickerProps {
  // Данные
  tags: Tag[];                    // Список доступных тегов
  selectedTags: string[];         // Выбранные теги (массив имён)
  
  // Коллбэки
  onSelectTags: (tags: string[]) => void;   // Изменение выбора
  onAddTag: (name: string, color: string) => void;   // Добавление тега
  onDeleteTag: (name: string) => void;      // Удаление тега
  
  // Опционально
  getUsageCount?: (tagName: string) => number;  // Количество использований
  
  // UI
  placeholder?: string;           // Плейсхолдер триггера (по умолчанию "Выберите теги...")
  disabled?: boolean;             // Отключение компонента
}

interface Tag {
  name: string;   // Название тега
  color: string;  // Цвет (Tailwind: red, blue, green и т.д.)
}
```

### Возвращаемое значение

Компонент не возвращает значение, управление состоянием происходит через коллбэки.

---

## 💡 Примеры использования

### Базовое использование

```typescript
import { TagPicker } from '@/shared/components/tag-picker';
import { useState } from 'react';

function MyComponent() {
  const [tags, setTags] = useState([
    { name: 'Работа', color: 'blue' },
    { name: 'Здоровье', color: 'green' },
    { name: 'Учеба', color: 'purple' },
  ]);
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleAddTag = (name: string, color: string) => {
    setTags([...tags, { name, color }]);
  };

  const handleDeleteTag = (name: string) => {
    setTags(tags.filter(t => t.name !== name));
    setSelectedTags(selectedTags.filter(t => t !== name));
  };

  return (
    <TagPicker
      tags={tags}
      selectedTags={selectedTags}
      onSelectTags={setSelectedTags}
      onAddTag={handleAddTag}
      onDeleteTag={handleDeleteTag}
      placeholder="Выберите категории..."
    />
  );
}
```

### С подсчётом использований

```typescript
import { TagPicker } from '@/shared/components/tag-picker';

function HabitForm() {
  const habits = useHabitsStore(state => state.habits);
  const tags = useHabitsStore(state => state.tags);
  const selectedTags = useHabitsStore(state => state.addHabitForm.selectedTags);
  
  const addTag = useHabitsStore(state => state.addTag);
  const deleteTag = useHabitsStore(state => state.deleteTag);
  const updateFormField = useHabitsStore(state => state.updateAddHabitFormField);

  // Подсчёт количества привычек с этим тегом
  const getTagUsageCount = (tagName: string) => {
    return habits.filter(h => h.tag === tagName).length;
  };

  return (
    <TagPicker
      tags={tags}
      selectedTags={selectedTags}
      onSelectTags={(tags) => updateFormField('selectedTags', tags)}
      onAddTag={addTag}
      onDeleteTag={deleteTag}
      getUsageCount={getTagUsageCount}
      placeholder="Добавьте теги..."
    />
  );
}
```

### Интеграция с Zustand Store

```typescript
// В store slice (tags.ts)
export const createTagsSlice: StateCreator<HabitsState> = (set, get) => ({
  tags: [],
  
  addTag: (name: string, color: string) => {
    const existingTagNames = get().tags.map(t => t.name.trim().toLowerCase());
    const normalizedName = name.trim();
    
    // ✅ Защита от дубликатов
    if (existingTagNames.includes(normalizedName.toLowerCase())) {
      return;
    }
    
    set((state) => ({
      tags: [...state.tags, { name: normalizedName, color }],
    }));
  },
  
  deleteTag: (name: string) => {
    set((state) => ({
      tags: state.tags.filter(t => t.name !== name),
      // Удаляем тег из всех привычек
      habits: state.habits.map(h => 
        h.tag === name ? { ...h, tag: undefined } : h
      ),
    }));
  },
});

// В компоненте
function MyComponent() {
  const tags = useHabitsStore(state => state.tags);
  const selectedTags = useHabitsStore(state => state.addHabitForm.selectedTags);
  const addTag = useHabitsStore(state => state.addTag);
  const deleteTag = useHabitsStore(state => state.deleteTag);
  const updateFormField = useHabitsStore(state => state.updateAddHabitFormField);

  return (
    <TagPicker
      tags={tags}
      selectedTags={selectedTags}
      onSelectTags={(tags) => updateFormField('selectedTags', tags)}
      onAddTag={addTag}
      onDeleteTag={deleteTag}
    />
  );
}
```

---

## 🏗️ Архитектурные решения

### 1. **Почему Dropdown конструктор?**

- ✅ **Portal рендеринг** - dropdown не обрезается родительскими контейнерами
- ✅ **Встроенная keyboard navigation** - ArrowUp/Down, Home/End, Enter/Space
- ✅ **Click outside** - автоматическое закрытие при клике вне
- ✅ **Focus management** - автоматический возврат фокуса на триггер
- ✅ **Typeahead** - быстрый поиск по первой букве
- ✅ **Accessibility** - ARIA атрибуты из коробки

### 2. **Почему два guard'а в Dropdown?**

**Проблема:** useEffect в Dropdown зависит от `children`. Когда форма добавления тега появляется/исчезает, children меняется → useEffect срабатывает → пытается сфокусироваться на первый menuitem → фокус перескакивает с input на кнопку.

**Решение:**
- **Guard #1 (handleKeyDown)** - защита от keyboard navigation во время ввода
- **Guard #2 (useEffect)** - защита от перехвата фокуса при изменении children

### 3. **Почему autoFocus + useEffect?**

**autoFocus** не всегда срабатывает надёжно (race condition с re-render), поэтому используем комбинацию:
- `autoFocus` атрибут - первая линия защиты
- `useEffect` с `setTimeout` - гарантированный фокус после рендера

### 4. **Почему trim() в проверке дубликатов?**

Защита от legacy данных - пользователь мог создать тег с лишними пробелами раньше. При проверке нового тега мы trim'им все существующие теги:

```typescript
const existingTagNames = tags.map(t => t.name.trim().toLowerCase());
```

### 5. **Почему role="menuitem"?**

`role="menuitem"` активирует встроенную keyboard navigation из Dropdown конструктора:
- Dropdown.handleKeyDown ищет элементы с `[role="menuitem"]`
- Автоматическая навигация стрелками
- Автофокус при открытии
- Enter/Space для активации

---

## 🎨 UI/UX паттерны

### 1. **Визуальная обратная связь**

```typescript
// ✅ Чекбокс в кнопке тега для мультиселекта
<div className="flex items-center gap-2">
  <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
    isSelected 
      ? `bg-${tag.color}-500 border-${tag.color}-500` 
      : 'border-gray-300 bg-white'
  }`}>
    {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
  </div>
  
  {/* Tag badge */}
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs bg-${tag.color}-100 text-${tag.color}-700`}>
    {tag.name}
  </span>
</div>

// ✅ Индикатор использования
{usageCount !== undefined && usageCount > 0 && (
  <span className="text-xs text-gray-400 ml-auto">
    {usageCount}
  </span>
)}
```

### 2. **Валидация в реальном времени**

```typescript
// ✅ Проверка дубликата при вводе
const tagAlreadyExists = newTag.trim() && tags.some(
  tag => tag.name.trim().toLowerCase() === newTag.trim().toLowerCase()
);

// ✅ Визуальное предупреждение
{tagAlreadyExists && (
  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
    <AlertCircle className="w-3 h-3" />
    Тег с таким названием уже существует
  </p>
)}

// ✅ Отключение кнопки
<Button
  variant="primary"
  onClick={handleAddTag}
  disabled={!newTag.trim() || tagAlreadyExists} // ← Disabled при дубликате
>
  Добавить
</Button>
```

### 3. **Подтверждение удаления**

```typescript
// ✅ Modal с информацией об использовании
<Modal.Root
  isOpen={!!deletingTag}
  onClose={() => setDeletingTag(null)}
>
  <Modal.Content size="sm">
    <Modal.Header>
      <h3>Удалить тег?</h3>
    </Modal.Header>
    
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Вы действительно хотите удалить тег <strong>"{deletingTag?.name}"</strong>?
      </p>
      
      {deletingTag && deletingTag.usageCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            ⚠️ Этот тег используется в <strong>{deletingTag.usageCount}</strong> {/* ... */}
          </p>
        </div>
      )}
    </div>
  </Modal.Content>
</Modal.Root>
```

---

## 🐛 Troubleshooting

### Проблема: Фокус перескакивает с input на кнопки при вводе

**Причина:** Dropdown пытается применить keyboard navigation или автофокус на menuitem.

**Решение:** Проверьте наличие двух guard'ов в Dropdown конструкторе:

1. Guard в `handleKeyDown`:
```typescript
const target = e.target as HTMLElement;
if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
  return;
}
```

2. Guard в useEffect:
```typescript
const activeElement = document.activeElement;
if (activeElement?.tagName === 'INPUT' || ...) {
  return;
}
```

### Проблема: Input не получает фокус при открытии формы

**Причина:** autoFocus не всегда срабатывает из-за race condition.

**Решение:** Комбинация autoFocus + useEffect:

```typescript
useEffect(() => {
  if (isAddingTag && newTagInputRef.current) {
    setTimeout(() => {
      newTagInputRef.current?.focus();
    }, 0);
  }
}, [isAddingTag]);

<input autoFocus ref={newTagInputRef} />
```

### Проблема: Dropdown закрывается при клике на вложенный ColorPicker

**Причина:** Click outside handler родительского dropdown срабатывает.

**Решение:** Используйте `data-dropdown-id` для идентификации вложенности (уже реализовано в Dropdown конструкторе).

### Проблема: Дубликаты тегов с разным регистром

**Причина:** Проверка дубликатов не учитывает регистр.

**Решение:** Используйте `.toLowerCase()` + `.trim()`:

```typescript
const existingTagNames = tags.map(t => t.name.trim().toLowerCase());
const normalizedName = newTag.trim();

if (existingTagNames.includes(normalizedName.toLowerCase())) {
  return; // Дубликат!
}
```

---

## ✅ Чеклист для новых компонентов с Dropdown + Input

Если вы создаёте компонент с Dropdown, который содержит input/textarea:

- [ ] Добавлены guard'ы в Dropdown конструктор (handleKeyDown + useEffect)
- [ ] Input имеет `autoFocus` атрибут
- [ ] Добавлен useEffect с автофокусом и `setTimeout`
- [ ] Input имеет `onKeyDown` с `e.stopPropagation()`
- [ ] Контейнер формы имеет `onKeyDown` с `e.stopPropagation()`
- [ ] Если есть вложенный Dropdown - используется `data-dropdown-id`
- [ ] Keyboard navigation работает на кнопках (`role="menuitem"`, `onKeyDown` для Enter/Space)
- [ ] Валидация в реальном времени
- [ ] Визуальная обратная связь (disabled кнопки, сообщения об ошибках)

---

## 📚 Связанная документация

- **Dropdown конструктор:** `/shared/constructors/dropdown/README.md`
- **Modal конструктор:** `/shared/constructors/modal/`
- **ColorPicker:** `/shared/components/popovers/color-picker/ColorPicker.tsx`
- **useClickOutside hook:** `/shared/hooks/use-click-outside/README.md`

---

## 📝 История изменений

### 23 ноября 2025
- ✅ **Создание компонента** - полная реализация TagPicker
- ✅ **Keyboard navigation** - добавлен `role="menuitem"` к кнопкам тегов
- ✅ **Input guards** - защита от конфликтов keyboard navigation
- ✅ **Автофокус** - комбинация autoFocus + useEffect
- ✅ **Валидация дубликатов** - case-insensitive + trim + защита от legacy данных
- ✅ **Вложенный ColorPicker** - интеграция с data-dropdown-id
- ✅ **Визуальное предупреждение** - добавлено сообщение об ошибке при попытке добавить дубликат
- ✅ **Документация** - создан README.md с полным описанием паттернов

---

**Авторы:** AI Assistant  
**Лицензия:** MIT  
**Статус:** Production-ready ✅