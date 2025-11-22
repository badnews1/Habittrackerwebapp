# Generic CategoryPicker

> **Создано:** 22 ноября 2025  
> **Модуль:** `@/shared/components/category-picker`

---

## 📋 Описание

Универсальный UI компонент для управления категориями любого типа.

**Используется в модулях:**
- `habit-tracker` - категории привычек
- `task-manager` *(будущее)* - категории задач
- `finance` *(будущее)* - категории транзакций

---

## 🎯 Возможности

✅ Выбор категории из списка  
✅ Добавление новых категорий  
✅ Удаление категорий с подтверждением  
✅ Изменение цвета категорий через ColorPicker  
✅ Отображение количества использований  
✅ Внутреннее и внешнее управление состоянием  

---

## 📦 Экспорты

```typescript
export { CategoryPicker } from './CategoryPicker';
export type { 
  BaseCategory,           // Базовый интерфейс категории
  CategoryPickerProps,    // Props компонента
  GetCategoryUsageCount   // Тип callback для usage
} from './CategoryPicker';
```

---

## 🔧 API

### BaseCategory

```typescript
interface BaseCategory {
  name: string;   // Название категории
  color: string;  // Цвет в формате Tailwind (например: 'bg-blue-500')
}
```

### CategoryPickerProps

```typescript
interface CategoryPickerProps<T extends BaseCategory> {
  // Основные пропсы
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: T[];
  
  // CRUD операции
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onUpdateCategoryColor: (categoryName: string, color: string) => void;
  
  // Usage count
  getCategoryUsageCount: (categoryName: string) => number;
  
  // Опциональные
  isOpen?: boolean;        // Внешнее управление dropdown
  onToggle?: () => void;   // Callback переключения
  placeholder?: string;    // Placeholder (по умолчанию: 'Без категории')
  deleteMessageSingular?: string;  // Текст для единственного числа (по умолчанию: 'элементе')
  deleteMessagePlural?: string;    // Текст для множественного числа (по умолчанию: 'элементах')
}
```

---

## 📖 Примеры использования

### Простой пример (внутреннее управление состоянием)

```typescript
import { CategoryPicker } from '@/shared/components/category-picker';

<CategoryPicker
  selectedCategory={item.category}
  onSelectCategory={handleSelect}
  categories={categories}
  onAddCategory={handleAdd}
  onDeleteCategory={handleDelete}
  onUpdateCategoryColor={handleColorUpdate}
  getCategoryUsageCount={(name) => items.filter(i => i.category === name).length}
/>
```

### С кастомными сообщениями

```typescript
<CategoryPicker
  // ... остальные пропсы
  placeholder="Без типа"
  deleteMessageSingular="задаче"
  deleteMessagePlural="задачах"
/>
```

### Внешнее управление состоянием

```typescript
const [isOpen, setIsOpen] = useState(false);

<CategoryPicker
  // ... остальные пропсы
  isOpen={isOpen}
  onToggle={() => setIsOpen(!isOpen)}
/>
```

---

## 🏗️ Использование в модулях

### Создание специфичной обёртки

Каждый модуль создаёт свою обёртку с подключением к store:

```typescript
// /modules/habit-tracker/features/categories/components/HabitCategoryPicker.tsx

import { CategoryPicker } from '@/shared/components/category-picker';
import { useHabitsStore } from '@/core/store';

interface HabitCategoryPickerProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function HabitCategoryPicker({ selectedId, onSelect }: HabitCategoryPickerProps) {
  const categories = useHabitsStore(state => state.categories);
  const habits = useHabitsStore(state => state.habits);
  const addCategory = useHabitsStore(state => state.addCategory);
  const deleteCategory = useHabitsStore(state => state.deleteCategory);
  const recolorCategory = useHabitsStore(state => state.recolorCategory);
  
  return (
    <CategoryPicker
      selectedCategory={selectedId || ''}
      onSelectCategory={onSelect}
      categories={categories}
      onAddCategory={addCategory}
      onDeleteCategory={deleteCategory}
      onUpdateCategoryColor={recolorCategory}
      getCategoryUsageCount={(name) => habits.filter(h => h.category === name).length}
      placeholder="Без категории"
      deleteMessageSingular="привычке"
      deleteMessagePlural="привычках"
    />
  );
}
```

---

## 🎨 UI Структура

```
┌─────────────────────────────────────┐
│ [🔴] [Категория ▼]                 │  ← Кнопка цвета + Dropdown
└─────────────────────────────────────┘
         │
         └──> Dropdown открыт:
              ┌─────────────────────────┐
              │ Без категории           │ ← Опция очистки
              ├─────────────────────────┤
              │ Здоровье         (5) [×]│ ← Категория + usage + удалить
              │ Работа           (3) [×]│
              │ Спорт           (12) [×]│
              ├─────────────────────────┤
              │ [+] Добавить категорию  │ ← Добавление новой
              └─────────────────────────┘
```

---

## 🔗 Зависимости

- `@/shared/constructors/modal` - Modal конструктор
- `@/shared/components/button` - Button компонент
- `@/shared/components/popovers` - ColorPicker
- `@/shared/components/modals` - ConfirmDialog
- `@/shared/hooks/use-dropdown` - Управление dropdown
- `@/shared/constants` - Цвета, стили, лимиты
- `@/shared/icons` - Иконки

---

## 📝 Примечания

1. **Generic тип**: Компонент работает с любым типом категории, расширяющим `BaseCategory`
2. **Независимость данных**: Каждый модуль хранит свои категории в своём store slice
3. **Переиспользование UI**: Один компонент для всех модулей
4. **TypeScript**: Полная типобезопасность через generics
