# 📅 Calendar Feature

> **Модуль:** habit-tracker  
> **Дата создания:** 22 ноября 2025  
> **Статус:** ✅ Готово (4/4 компонентов)

---

## 📋 Описание

Фича Calendar отвечает за отображение календарной сетки привычек, навигацию по месяцам и годам, а также визуализацию дней недели.

---

## 🎯 Ответственность

### Основные функции
- ✅ Отображение заголовка календаря с текущим месяцем
- ✅ Навигация по месяцам и годам через MonthYearPicker
- ✅ Отображение дней недели и чисел месяца
- ✅ Календарная сетка с чекбоксами выполнения привычек
- ✅ Кнопка "Отметить всё за день"

### Что НЕ входит в Calendar
- ❌ Логика выполнения привычек (это в habits)
- ❌ Статистика и прогресс (это в statistics)
- ❌ Работа с датами (это в shared/utils/date)

---

## 📦 Структура

```
/modules/habit-tracker/features/calendar/
  /components/
    CalendarHeader.tsx          # Шапка календаря с названием месяца
    CalendarDayHeader.tsx       # Заголовок с днями недели и числами
    CalendarGrid.tsx            # Сетка календаря с чекбоксами
    MonthYearPicker.tsx         # Модальное окно выбора периода
  index.ts                      # Public API
  README.md                     # Этот файл
```

**Итого:** 4 компонента

---

## 📥 Public API

```typescript
// Импорт компонентов
import {
  CalendarHeader,
  CalendarDayHeader,
  CalendarGrid,
  MonthYearPicker
} from '@/modules/habit-tracker/features/calendar';
```

---

## 🔧 Компоненты

### 1. CalendarHeader

**Описание:** Шапка календаря с названием месяца, слоганом и дневными прогресс-барами.

**Использование:**
```typescript
import { CalendarHeader } from '@/modules/habit-tracker/features/calendar';

<CalendarHeader />
```

**Возможности:**
- ✅ Отображение названия месяца (кликабельно)
- ✅ Открытие MonthYearPicker при клике
- ✅ Интеграция с DailyProgressBars из statistics
- ✅ Чтение данных из Zustand store

**Store зависимости:**
- `selectedMonth` - текущий месяц
- `selectedYear` - текущий год
- `habits` - список привычек
- `dailyGoals` - дневные цели
- `openMonthYearPicker` - action открытия выбора периода

---

### 2. CalendarDayHeader

**Описание:** Заголовок календаря с днями недели и числами месяца.

**Props:**
```typescript
interface CalendarDayHeaderProps {
  monthDays: { date: Date; day: number }[];
  getDayName: (date: Date) => string;
}
```

**Использование:**
```typescript
import { CalendarDayHeader } from '@/modules/habit-tracker/features/calendar';

<CalendarDayHeader
  monthDays={monthDays}
  getDayName={getDayName}
/>
```

**Возможности:**
- ✅ Отображение дней недели (ПН, ВТ, СР...)
- ✅ Отображение чисел месяца (1, 2, 3...)
- ✅ Выделение сегодняшнего дня (точка снизу)
- ✅ Адаптивные отступы в зависимости от длины месяца

---

### 3. CalendarGrid

**Описание:** Основная сетка календаря с чекбоксами для отметки выполнения привычек.

**Props:**
```typescript
interface CalendarGridProps {
  habits: Habit[];
  dateConfig: DateConfig;
}
```

**Использование:**
```typescript
import { CalendarGrid } from '@/modules/habit-tracker/features/calendar';

<CalendarGrid
  habits={habits}
  dateConfig={dateConfig}
/>
```

**Возможности:**
- ✅ Отображение CalendarDayHeader
- ✅ Сетка HabitCheckboxCell для каждой привычки
- ✅ Кнопка "Отметить всё за день" внизу
- ✅ Адаптивные отступы в зависимости от длины месяца
- ✅ Чтение actions из Zustand store

**Store зависимости:**
- `toggleCompletion` - переключение выполнения привычки
- `updateHabit` - обновление привычки
- `toggleAllForDay` - отметить всё за день
- `openNumericInputModal` - открыть модалку ввода числа

**Зависимости от других фич:**
- `HabitCheckboxCell` из `@/modules/habit-tracker/features/habits`

---

### 4. MonthYearPicker

**Описание:** Модальное окно выбора месяца и года для навигации по календарю.

**Props:**
```typescript
interface MonthYearPickerProps {
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}
```

**Использование:**
```typescript
import { MonthYearPicker } from '@/modules/habit-tracker/features/calendar';

{isMonthYearPickerOpen && (
  <MonthYearPicker
    selectedMonth={selectedMonth}
    selectedYear={selectedYear}
    onSelect={handleMonthYearSelect}
    onClose={closeMonthYearPicker}
  />
)}
```

**Возможности:**
- ✅ Выбор года (10 лет вперёд)
- ✅ Выбор месяца (12 месяцев)
- ✅ Подсветка текущего выбора
- ✅ Кнопки "Отмена" и "Применить"
- ✅ Использует Modal конструктор из shared

**Зависимости:**
- `Modal` из `@/shared/constructors/modal`
- `Button` из `@/shared/components/button`
- `MODAL_STYLES` из `@/shared/constants/styles`

---

## 🔗 Зависимости

### Внутренние (модуль habit-tracker)
```typescript
import { HabitCheckboxCell } from '@/modules/habit-tracker/features/habits';
import { DailyProgressBars } from '@/components/statistics/DailyProgressBars'; // TODO: мигрировать
```

### Shared
```typescript
import { getDaysInMonth, formatDate } from '@/shared/utils/date';
import { Modal } from '@/shared/constructors/modal';
import { Button } from '@/shared/components/button';
import { MODAL_STYLES } from '@/shared/constants/styles';
```

### Store
```typescript
import { useHabitsStore } from '@/core/store';
```

### Типы
```typescript
import { Habit } from '@/modules/habit-tracker/types';
import { DateConfig } from '@/modules/habit-tracker/features/habits/types';
```

---

## 📊 Статус миграции

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| CalendarHeader | ✅ Готово | Мигрирован 22.11.2025 |
| CalendarDayHeader | ✅ Готово | Мигрирован 22.11.2025 |
| CalendarGrid | ✅ Готово | Мигрирован 22.11.2025 |
| MonthYearPicker | ✅ Готово | Мигрирован 22.11.2025 |

**Итого:** 4/4 (100%) ✅

---

## 🎨 Дизайн

### CalendarHeader
- Размер заголовка: `text-[36px]`
- Слоган: `text-[8px]` с tracking
- Hover эффект на кнопке месяца
- Позиционирование: relative с `top: -43px`

### CalendarDayHeader
- Дни недели: `text-[7px]`, uppercase
- Числа: `text-[7px]`
- Сегодня: bold + точка снизу (серая)
- Адаптивные gap в зависимости от длины месяца

### CalendarGrid
- Фон: `bg-gray-50`
- Скругление: `rounded-2xl`
- Отступы: `p-4`
- Разделитель между привычками и кнопкой "всё за день"

### MonthYearPicker
- Grid года: 5 столбцов
- Grid месяцев: 3 столбца
- Выбранный элемент: `bg-gray-900 text-white`
- Невыбранный: `bg-gray-50 hover:bg-gray-100`

---

## 🧪 Примеры использования

### Пример 1: Интеграция в App.tsx

```typescript
import { CalendarHeader } from '@/modules/habit-tracker/features/calendar';

export default function App() {
  return (
    <main>
      <CalendarHeader />
      {/* Остальной контент */}
    </main>
  );
}
```

### Пример 2: Использование CalendarGrid

```typescript
import { CalendarGrid } from '@/modules/habit-tracker/features/calendar';
import { getDaysInMonth, formatDate, getDayName } from '@/shared/utils/date';

function HabitsTable() {
  const habits = useHabitsStore(state => state.habits);
  const selectedMonth = useHabitsStore(state => state.selectedMonth);
  const selectedYear = useHabitsStore(state => state.selectedYear);

  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  const dateConfig = {
    selectedMonth,
    selectedYear,
    monthDays,
    formatDate,
    getDayName,
  };

  return (
    <CalendarGrid
      habits={habits}
      dateConfig={dateConfig}
    />
  );
}
```

### Пример 3: MonthYearPicker в модальной системе

```typescript
import { MonthYearPicker } from '@/modules/habit-tracker/features/calendar';

function AppModals() {
  const isMonthYearPickerOpen = useHabitsStore(state => state.isMonthYearPickerOpen);
  const selectedMonth = useHabitsStore(state => state.selectedMonth);
  const selectedYear = useHabitsStore(state => state.selectedYear);
  const setSelectedDate = useHabitsStore(state => state.setSelectedDate);
  const closeMonthYearPicker = useHabitsStore(state => state.closeMonthYearPicker);

  const handleSelect = (month: number, year: number) => {
    setSelectedDate(month, year);
    closeMonthYearPicker();
  };

  return (
    <>
      {isMonthYearPickerOpen && (
        <MonthYearPicker
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onSelect={handleSelect}
          onClose={closeMonthYearPicker}
        />
      )}
    </>
  );
}
```

---

## 🚀 Roadmap

### Текущая версия (v1.0)
- ✅ Базовая функциональность календаря
- ✅ Навигация по месяцам и годам
- ✅ Интеграция с Zustand store
- ✅ Адаптивные отступы

### Будущие улучшения
- 🔄 Миграция DailyProgressBars в statistics фичу
- 🔄 Добавить анимации переходов между месяцами
- 🔄 Keyboard navigation (стрелки для переключения месяцев)
- 🔄 Поддержка touch gestures для мобильных устройств

---

## 📝 История изменений

### 22 ноября 2025 (v1.0)
- ✅ Создана фича calendar
- ✅ Мигрированы 4 компонента из `/components/calendar/`
- ✅ Создан Public API (index.ts)
- ✅ Написана полная документация
- ✅ Обновлены импорты в App.tsx, HabitsTable.tsx, AppModals.tsx
- ✅ Удалена старая папка `/components/calendar/`

---

## 🤝 Связь с другими фичами

```
calendar
  ↓ использует
  ├─ habits (HabitCheckboxCell)
  ├─ statistics (DailyProgressBars) // TODO: мигрировать
  └─ shared (Modal, Button, utils/date)
```

**Обратные зависимости:**
- `App.tsx` → использует CalendarHeader
- `HabitsTable.tsx` → использует CalendarGrid
- `AppModals.tsx` → использует MonthYearPicker

---

**Версия документа:** 1.0  
**Последнее обновление:** 22 ноября 2025