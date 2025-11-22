# useCategoriesManager

> **Создано:** 22 ноября 2025  
> **Модуль:** `@/shared/hooks/use-categories`

---

## 📋 Описание

Generic React хук для управления категориями любого типа.

**Используется в модулях:**
- `habit-tracker` - управление категориями привычек
- `task-manager` *(будущее)* - управление категориями задач
- `finance` *(будущее)* - управление категориями транзакций

---

## 🎯 Возможности

✅ Локальное состояние категорий  
✅ Добавление новых категорий  
✅ Удаление категорий с callback синхронизации  
✅ Переименование категорий  
✅ Изменение цвета категорий  
✅ Валидация и дедупликация  
✅ TypeScript generics  

---

## 📦 Экспорты

```typescript
export { useCategoriesManager } from './useCategoriesManager';
export type { 
  BaseCategory,      // Базовый интерфейс категории
  CategoryActions    // Интерфейс CRUD операций
} from './useCategoriesManager';
```

---

## 🔧 API

### useCategoriesManager<T>

```typescript
function useCategoriesManager<T extends BaseCategory>(
  initialCategories: T[],
  defaultColor: string,
  onCategoryDelete?: (categoryName: string) => void
)
```

**Параметры:**
- `initialCategories` - Массив категорий для инициализации
- `defaultColor` - Цвет по умолчанию для новых категорий (например: `'bg-blue-500'`)
- `onCategoryDelete` - Опциональный callback при удалении (для синхронизации с элементами)

**Возвращает:**
```typescript
{
  localCategories: T[];                                    // Текущее состояние
  setLocalCategories: (categories: T[]) => void;          // Setter
  handleAddCategory: (category: string) => void;           // Добавить
  handleDeleteCategory: (categoryToDelete: string) => void; // Удалить
  handleUpdateCategoryColor: (name: string, color: string) => void; // Цвет
  handleRenameCategory: (oldName: string, newName: string) => void; // Переименовать
}
```

---

## 📖 Примеры использования

### Базовое использование

```typescript
import { useCategoriesManager } from '@/shared/hooks/use-categories';
import { CATEGORY_COLORS } from '@/shared/constants';

function MyComponent() {
  const categories = useHabitsStore(state => state.categories);
  
  const manager = useCategoriesManager(
    categories,
    CATEGORY_COLORS[0]
  );
  
  return (
    <div>
      {manager.localCategories.map(cat => (
        <div key={cat.name}>
          {cat.name}
          <button onClick={() => manager.handleDeleteCategory(cat.name)}>
            Удалить
          </button>
        </div>
      ))}
      <button onClick={() => manager.handleAddCategory('Новая категория')}>
        Добавить
      </button>
    </div>
  );
}
```

### С синхронизацией элементов при удалении

```typescript
const manager = useCategoriesManager(
  categories,
  CATEGORY_COLORS[0],
  (categoryName) => {
    // Очистить category у всех привычек
    habits.forEach(habit => {
      if (habit.category === categoryName) {
        updateHabit(habit.id, { category: '' });
      }
    });
  }
);
```

### В модальном окне с сохранением

```typescript
function ManageModal() {
  const categories = useHabitsStore(state => state.categories);
  const updateCategories = useHabitsStore(state => state.updateCategories);
  
  const manager = useCategoriesManager(
    categories,
    CATEGORY_COLORS[0]
  );
  
  const handleSave = () => {
    // Сохранить изменения в store
    updateCategories(manager.localCategories);
  };
  
  return (
    <Modal>
      {/* UI */}
      <button onClick={handleSave}>Сохранить</button>
    </Modal>
  );
}
```

---

## 🏗️ Логика работы

### Добавление категории

1. Проверка на дубликаты (case-insensitive)
2. Добавление с дефолтным цветом
3. Возврат нового массива

```typescript
handleAddCategory('Здоровье');
// → Добавляет { name: 'Здоровье', color: 'bg-blue-500' }
```

### Удаление категории

1. Удаление из локального состояния
2. Вызов callback для синхронизации (если передан)

```typescript
handleDeleteCategory('Здоровье');
// → Удаляет категорию + вызывает onCategoryDelete('Здоровье')
```

### Переименование категории

1. Проверка на дубликаты (исключая текущую)
2. Обновление name в категории

```typescript
handleRenameCategory('Здоровье', 'Спорт');
// → { name: 'Здоровье', ... } становится { name: 'Спорт', ... }
```

### Изменение цвета

1. Поиск категории по name
2. Обновление color

```typescript
handleUpdateCategoryColor('Здоровье', 'bg-green-500');
// → Обновляет color для категории 'Здоровье'
```

---

## ⚠️ Важные замечания

### 1. Локальное состояние

Хук работает с **локальным копированием** categories. Изменения не сохраняются в store автоматически!

```typescript
// ❌ Неправильно - изменения потеряются
const manager = useCategoriesManager(categories, defaultColor);
manager.handleAddCategory('Новая');

// ✅ Правильно - сохранить в store
const handleSave = () => {
  updateCategories(manager.localCategories);
};
```

### 2. Case-insensitive дубликаты

Хук предотвращает создание категорий с одинаковыми именами (игнорируя регистр):

```typescript
manager.handleAddCategory('Здоровье');
manager.handleAddCategory('ЗДОРОВЬЕ'); // Будет проигнорировано
manager.handleAddCategory('здоровье'); // Будет проигнорировано
```

### 3. Callback синхронизации

`onCategoryDelete` вызывается **после** удаления из локального состояния:

```typescript
useCategoriesManager(
  categories,
  defaultColor,
  (categoryName) => {
    // Здесь категория уже удалена из localCategories
    // Но ещё не удалена из store (пока не сохранили)
  }
);
```

---

## 🔗 Связанные модули

- `@/shared/components/category-picker` - Generic UI компонент
- `@/shared/constants` - CATEGORY_COLORS
- `@/types/category` - Типы категорий (специфичные для модулей)

---

## 📝 Roadmap

- [ ] Добавить поддержку иконок для категорий
- [ ] Добавить поддержку сортировки
- [ ] Добавить поддержку архивации категорий
