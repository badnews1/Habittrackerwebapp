# 📊 Statistics Feature

> **Модуль:** habit-tracker  
> **Дата создания:** 22 ноября 2025  
> **Статус:** ✅ Готово (6/6 компонентов)

---

## 📋 Описание

Фича Statistics отвечает за отображение статистики выполнения привычек: прогресс-бары, круговые индикаторы, графики и визуализацию силы привычки.

---

## 🎯 Ответственность

### Основные функции
- ✅ Отображение прогресса за месяц (линейные прогресс-бары)
- ✅ Дневные прогресс-бары для заголовка календаря
- ✅ Круговой индикатор месячного прогресса
- ✅ Детальная статистика с редактируемой целью
- ✅ Прогресс-бар силы привычки с градиентом
- ✅ График прогресса с топ-10 привычек

### Что НЕ входит в Statistics
- ❌ Логика выполнения привычек (это в habits)
- ❌ Календарная сетка (это в calendar)
- ❌ Расчёты силы привычки (это в /utils/)

---

## 📦 Структура

```
/modules/habit-tracker/features/statistics/
  /components/
    ProgressSection.tsx         # Секция прогресса привычек за месяц
    DailyProgressBars.tsx       # Дневные прогресс-бары для заголовка
    MonthlyCircle.tsx           # Круговой индикатор месячного прогресса
    MonthlyStats.tsx            # Детальная статистика с редактируемой целью
    StrengthProgressBar.tsx     # Прогресс-бар силы привычки с градиентом
    StrengthChart.tsx           # График прогресса с топ-10 привычек
  index.ts                      # Public API
  README.md                     # Этот файл
```

**Итого:** 6 компонентов

---

## 📥 Public API

```typescript
// Импорт компонентов
import {
  ProgressSection,
  DailyProgressBars,
  MonthlyCircle,
  MonthlyStats,
  StrengthProgressBar,
  StrengthChart
} from '@/modules/habit-tracker/features/statistics';
```

---

## 🔧 Компоненты

### 1. ProgressSection

**Описание:** Секция прогресса выполнения привычек за месяц с линейными прогресс-барами.

**Props:**
```typescript
interface ProgressSectionProps {
  habits: Habit[];
  dateConfig: DateConfig;
}
```

**Возможности:**
- ✅ Прогресс-бар для каждой привычки
- ✅ Отображение процента выполнения
- ✅ Показ выполнено/цель (X/Y формат)
- ✅ Общий прогресс-бар внизу
- ✅ Адаптивная ширина в зависимости от длины месяца

---

### 2. DailyProgressBars

**Описание:** Дневные прогресс-бары для заголовка календаря (вертикальные столбики).

**Props:**
```typescript
interface DailyProgressBarsProps {
  monthDays: { date: Date; day: number }[];
  habits: Habit[];
  dailyGoals: { [date: string]: number };
  formatDate: (date: Date) => string;
}
```

**Возможности:**
- ✅ Вертикальные прогресс-бары для каждого дня
- ✅ Учёт пропущенных привычек (крестики)
- ✅ Процент выполнения под каждым баром
- ✅ Высота 119px с адаптивными gap

---

### 3. MonthlyCircle

**Описание:** Круговой индикатор месячного прогресса (используется в боковой панели).

**Props:**
```typescript
interface MonthlyCircleProps {
  habits: Habit[];
  monthDays: { date: Date; day: number }[];
  formatDate: (date: Date) => string;
  dailyGoals: { [date: string]: number };
  selectedMonth: number;
  selectedYear: number;
}
```

**Возможности:**
- ✅ SVG круговая диаграмма
- ✅ Процент прогресса крупным шрифтом
- ✅ Выполнено/Цель в центре круга
- ✅ Адаптивный размер шрифта (12px/14px)

---

### 4. MonthlyStats

**Описание:** Детальная статистика за месяц с круговым индикатором и редактируемой целью.

**Props:**
```typescript
interface MonthlyStatsProps {
  habits: Habit[];
  dateConfig: DateConfig;
  goalConfig: GoalConfig;
  undoConfig: UndoConfig;
  hasAnyCompletions: boolean;
}
```

**Возможности:**
- ✅ Круговая диаграмма с процентом
- ✅ Статистика: Выполнено / Не выполнено / Цель
- ✅ Редактируемая дневная цель (input)
- ✅ Подсказка при наведении на иконку "?"
- ✅ Кнопка "Снять все отметки" с Undo
- ✅ Адаптивный layout

---

### 5. StrengthProgressBar

**Описание:** Прогресс-бар силы привычки с цветовым градиентом.

**Props:**
```typescript
interface StrengthProgressBarProps {
  strength: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**Возможности:**
- ✅ Градиентная заливка: Красный → Оранжевый → Жёлтый → Светло-зелёный → Зелёный
- ✅ Размеры: sm (h-1.5), md (h-2), lg (h-3)
- ✅ Опциональный label с процентом
- ✅ Плавная анимация (700ms ease-out)

**Алгоритм цвета:**
- 0-25%: Красный → Оранжевый
- 25-50%: Оранжевый → Жёлтый
- 50-75%: Жёлтый → Светло-зелёный
- 75-100%: Светло-зелёный → Зелёный

---

### 6. StrengthChart

**Описание:** Area Chart прогресса выполнения привычек за месяц + топ-10 список.

**Props:**
```typescript
interface StrengthChartProps {
  habits: Habit[];
  dateConfig: DateConfig;
  goalConfig: GoalConfig;
}
```

**Возможности:**
- ✅ Area Chart (recharts) с градиентной заливкой
- ✅ Заголовок с днями недели и числами
- ✅ Процент выполнения под каждым днём
- ✅ Количество выполненных привычек
- ✅ Редактируемая дневная цель (клик на цифру)
- ✅ Топ-10 привычек по проценту выполнения
- ✅ Всегда 10 строк (пустые если привычек меньше)

---

## 🔗 Зависимости

### Внутренние (модуль habit-tracker)
```typescript
// Нет прямых зависимостей от других фич
```

### Shared
```typescript
import { Close, Undo } from '@/shared/icons';
```

### Утилиты
```typescript
import { isHabitCompletedForDate, getMonthlyGoalFromFrequency } from '@/modules/habit-tracker/features/habits/utils';
```

### Типы
```typescript
import { Habit } from '@/modules/habit-tracker/types';
import { DateConfig, GoalConfig, UndoConfig } from '@/modules/habit-tracker/features/habits/types';
```

### Библиотеки
```typescript
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
```

---

## 📊 Статус миграции

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| ProgressSection | ✅ Готово | Мигрирован 22.11.2025 |
| DailyProgressBars | ✅ Готово | Мигрирован 22.11.2025 |
| MonthlyCircle | ✅ Готово | Мигрирован 22.11.2025 |
| MonthlyStats | ✅ Готово | Мигрирован 22.11.2025 |
| StrengthProgressBar | ✅ Готово | Мигрирован 22.11.2025 |
| StrengthChart | ✅ Готово | Мигрирован 22.11.2025 |

**Итого:** 6/6 (100%) ✅

---

## 🎨 Дизайн

### ProgressSection
- Ширина: 280-283px (зависит от длины месяца)
- Высота прогресс-бара: h-2
- Цвета: bg-gray-900 (заполнение), bg-white (фон)
- Шрифты: 8px (проценты и счётчик)

### DailyProgressBars
- Ширина столбика: w-2
- Высота: 119px
- Margin слева: 17px
- Адаптивные gap: 7px/6px/5px/4px

### MonthlyCircle
- Размер SVG: 100x100px
- Толщина stroke: 7px
- Цвета: #171717 (прогресс), #f3f4f6 (фон)
- Закруглённые концы (strokeLinecap="round")

### MonthlyStats
- Ширина: 262px фиксированная
- Круг: 100x100px, stroke 7px
- Статистика: fontSize 26px, fontWeight 300
- Кнопки: rounded-xl, uppercase

### StrengthProgressBar
- Градиент фона: opacity-20
- Анимация: duration-700 ease-out
- Размеры: h-1.5 / h-2 / h-3

### StrengthChart
- Высота chart: 230px
- Градиент заливки: #171717, opacity 0.2→0
- Stroke: #171717, width 2px
- Топ-10: высота строки h-6, fontSize 12px

---

## 🧪 Примеры использования

### Пример 1: ProgressSection в HabitsTable

```typescript
import { ProgressSection } from '@/modules/habit-tracker/features/statistics';

function HabitsTable() {
  const habits = useHabitsStore(state => state.habits);
  const dateConfig = {
    selectedMonth,
    selectedYear,
    monthDays,
    formatDate,
    getDayName,
  };

  return (
    <div className="flex gap-4">
      {/* ... Calendar ... */}
      <ProgressSection
        habits={habits}
        dateConfig={dateConfig}
      />
    </div>
  );
}
```

### Пример 2: DailyProgressBars в CalendarHeader

```typescript
import { DailyProgressBars } from '@/modules/habit-tracker/features/statistics';

export function CalendarHeader() {
  const habits = useHabitsStore(state => state.habits);
  const dailyGoals = useHabitsStore(state => state.dailyGoals);
  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  return (
    <header>
      <div className="flex items-end gap-4">
        <div>ЯНВАРЬ</div>
        <DailyProgressBars
          monthDays={monthDays}
          habits={habits}
          dailyGoals={dailyGoals}
          formatDate={formatDate}
        />
      </div>
    </header>
  );
}
```

### Пример 3: StrengthProgressBar в модальном окне

```typescript
import { StrengthProgressBar } from '@/modules/habit-tracker/features/statistics';

export function HabitStatisticsModal({ habit }) {
  return (
    <Modal.Content>
      <h3>Сила привычки</h3>
      <StrengthProgressBar 
        strength={habit.strength} 
        size="lg" 
        showLabel={true}
      />
    </Modal.Content>
  );
}
```

### Пример 4: MonthlyStats с редактируемой целью

```typescript
import { MonthlyStats } from '@/modules/habit-tracker/features/statistics';

function Dashboard() {
  const goalConfig = {
    dailyGoals,
    editingGoal,
    defaultDailyGoal,
    onSetDailyGoals: useHabitsStore.getState().setDailyGoals,
    onSetEditingGoal: useHabitsStore.getState().setEditingGoal,
    onSetDefaultDailyGoal: useHabitsStore.getState().handleDefaultDailyGoalChange,
  };

  const undoConfig = {
    canUndo: previousHabitsState !== null,
    onClearAllCompletions: useHabitsStore.getState().clearAllCompletions,
    onUndoClearAllCompletions: useHabitsStore.getState().undoClearAllCompletions,
  };

  return (
    <MonthlyStats
      habits={habits}
      dateConfig={dateConfig}
      goalConfig={goalConfig}
      undoConfig={undoConfig}
      hasAnyCompletions={hasAnyCompletions}
    />
  );
}
```

---

## 🚀 Roadmap

### Текущая версия (v1.0)
- ✅ Базовая визуализация статистики
- ✅ Прогресс-бары и графики
- ✅ Редактируемые цели
- ✅ Сила привычки с градиентом

### Будущие улучшения
- 🔄 Анимация при изменении прогресса
- 🔄 Экспорт статистики в CSV/PDF
- 🔄 Сравнение статистики разных месяцев
- 🔄 Прогнозирование выполнения целей

---

## 📝 История изменений

### 22 ноября 2025 (v1.0)
- ✅ Создана фича statistics
- ✅ Мигрированы 6 компонентов из `/components/statistics/`
- ✅ Создан Public API (index.ts)
- ✅ Написана полная документация
- ✅ Обновлены импорты в HabitsTable.tsx, HabitStatisticsModal.tsx, CalendarHeader.tsx
- ✅ Удалена старая папка `/components/statistics/`

---

## 🤝 Связь с другими фичами

```
statistics
  ↑ используется в
  ├─ habits (HabitStatisticsModal, HabitsTable)
  ├─ calendar (CalendarHeader)
  └─ App.tsx (через habits)
```

**Обратные зависимости:**
- `HabitsTable.tsx` → использует ProgressSection, MonthlyStats, StrengthChart
- `HabitStatisticsModal.tsx` → использует StrengthProgressBar
- `CalendarHeader.tsx` → использует DailyProgressBars

---

**Версия документа:** 1.0  
**Последнее обновление:** 22 ноября 2025