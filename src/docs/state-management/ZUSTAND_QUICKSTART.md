# 🚀 Zustand - Быстрый старт

> **Дата обновления:** 22 ноября 2025  
> Краткая шпаргалка по работе с Zustand в проекте

---

## 📦 Импорт

```typescript
import { useHabitsStore } from '@/core/store';
```

---

## 🎯 Базовое использование

### Получить данные

```typescript
function MyComponent() {
  const habits = useHabitsStore(state => state.habits);
  const categories = useHabitsStore(state => state.categories);
  
  return <div>{habits.length} привычек</div>;
}
```

### Получить actions

```typescript
function AddButton() {
  const addHabit = useHabitsStore(state => state.addHabit);
  
  return (
    <button onClick={() => addHabit({ name: 'Пробежка', type: 'binary' })}>
      Добавить
    </button>
  );
}
```

### Получить всё сразу

```typescript
function MyComponent() {
  const { habits, addHabit, deleteHabit } = useHabitsStore();
  
  // Используй habits, addHabit, deleteHabit
}
```

---

## 🔥 Частые операции

### Добавить привычку

```typescript
const addHabit = useHabitsStore(state => state.addHabit);

addHabit({
  name: 'Медитация',
  description: '',
  type: 'binary',
  frequency: { type: 'daily' },
  icon: '🧘',
  category: 'Здоровье',
});
```

### Обновить привычку

```typescript
const updateHabit = useHabitsStore(state => state.updateHabit);

updateHabit('habit-123', { 
  name: 'Новое название',
  icon: '🎯'
});
```

### Удалить привычку

```typescript
const deleteHabit = useHabitsStore(state => state.deleteHabit);

deleteHabit('habit-123');
```

### Переключить выполнение

```typescript
const toggleCompletion = useHabitsStore(state => state.toggleCompletion);

toggleCompletion('habit-123', '2025-11-20');
```

---

## 🎨 Модальные окна

### Открыть/закрыть модалку

```typescript
const { 
  isAddHabitModalOpen,
  openAddHabitModal,
  closeAddHabitModal 
} = useHabitsStore();

// Открыть
<button onClick={openAddHabitModal}>Добавить</button>

// Показать
{isAddHabitModalOpen && <Modal onClose={closeAddHabitModal} />}
```

### Все модальные окна

```typescript
const {
  // Добавление привычки
  isAddHabitModalOpen,
  openAddHabitModal,
  closeAddHabitModal,
  
  // Управление привычками
  isManageHabitsModalOpen,
  openManageHabitsModal,
  closeManageHabitsModal,
  
  // Удаление
  showDeleteDialog,
  openDeleteDialog,
  closeDeleteDialog,
  
  // Числовой ввод
  numericInputModal,
  openNumericInputModal,
  closeNumericInputModal,
  
  // Выбор месяца/года
  isMonthYearPickerOpen,
  openMonthYearPicker,
  closeMonthYearPicker,
} = useHabitsStore();
```

---

## 📅 Работа с датами

```typescript
const { 
  selectedMonth, 
  selectedYear, 
  setSelectedDate 
} = useHabitsStore();

// Изменить месяц/год
setSelectedDate(10, 2025); // Ноябрь 2025
```

---

## 🎯 Категории

```typescript
const { 
  categories,
  addCategory,
  deleteCategory,
  updateCategoryColor 
} = useHabitsStore();

// Добавить категорию
addCategory('Работа');

// Удалить категорию
deleteCategory('Спорт');

// Изменить цвет
updateCategoryColor('Здоровье', 'bg-green-200 text-green-800 border-green-300');
```

---

## 🎲 UI состояние

```typescript
const {
  currentSection,
  setCurrentSection,
  isSidebarOpen,
  toggleSidebar,
} = useHabitsStore();

// Изменить секцию
setCurrentSection('statistics');

// Открыть сайдбар
toggleSidebar(true);
```

---

## ↩️ Undo система

```typescript
const {
  previousHabitsState, // null если нет Undo
  clearAllCompletions,
  undoClearAllCompletions,
} = useHabitsStore();

// Очистить все галочки
clearAllCompletions();

// Отменить (если можно)
if (previousHabitsState) {
  undoClearAllCompletions();
}
```

---

## ⚡ Оптимизация

### ❌ Неоптимально

```typescript
// Подписка на ВЕСЬ store - ререндер при любом изменении
const store = useHabitsStore();
```

### ✅ Оптимально

```typescript
// Подписка только на нужные поля
const habits = useHabitsStore(state => state.habits);
const addHabit = useHabitsStore(state => state.addHabit);
```

### ✅ Селектор с мемоизацией

```typescript
const activeHabits = useHabitsStore(state => 
  state.habits.filter(h => !h.archived)
);
```

### ⭐ useShallow для множественных селекторов

**❌ Неоптимально (много подписок):**
```typescript
// 27 отдельных подписок на store!
const form = useHabitsStore((state) => state.addHabitForm);
const setFormName = useHabitsStore((state) => state.setFormName);
const setFormIcon = useHabitsStore((state) => state.setFormIcon);
const setFormCategory = useHabitsStore((state) => state.setFormCategory);
// ... ещё 23 селектора
```

**✅ Оптимально (одна подписка с useShallow):**
```typescript
import { useShallow } from 'zustand/react/shallow';

const {
  form,
  setFormName,
  setFormIcon,
  setFormCategory,
  // ... все остальные
} = useHabitsStore(
  useShallow((state) => ({
    form: state.addHabitForm,
    setFormName: state.setFormName,
    setFormIcon: state.setFormIcon,
    setFormCategory: state.setFormCategory,
    // ... все остальные
  }))
);
```

**Преимущества:**
- ✅ Одна подписка вместо множества
- ✅ Shallow comparison (меньше ре-рендеров)
- ✅ Лучшая читаемость кода

**Когда использовать:**
- Когда компонент использует 5+ селекторов
- В больших модальных окнах (AddHabitModal, ManageHabitsModal)
- Когда нужна оптимизация производительности

---

## 🐛 Отладка

### В консоли браузера

```javascript
// Получить весь store
useHabitsStore.getState()

// Изменить напрямую (только для отладки!)
useHabitsStore.setState({ habits: [] })
```

---

## 📝 Полный список доступных данных

```typescript
interface HabitsState {
  // ДАННЫЕ
  habits: Habit[];
  categories: Category[];
  dailyGoals: { [date: string]: number };
  defaultDailyGoal: string;
  
  // UI
  currentSection: string;
  isSidebarOpen: boolean;
  selectedMonth: number;
  selectedYear: number;
  
  // МОДАЛКИ
  showDeleteDialog: string | null;
  newlyAddedHabitId: string | null;
  numericInputModal: { habitId: string; date: string } | null;
  isMonthYearPickerOpen: boolean;
  editingGoal: string | null;
  isManageHabitsModalOpen: boolean;
  isAddHabitModalOpen: boolean;
  
  // UNDO
  previousHabitsState: Habit[] | null;
  actionsAfterClear: number;
}
```

---

## 📚 Дополнительно

**Архитектура store:** `/docs/STORE_ARCHITECTURE.md`  
**Код store:** `/core/store/index.ts`  
**Слайсы:** `/core/store/slices/`
