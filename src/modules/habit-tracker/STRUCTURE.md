# 📁 Структура модуля Habit Tracker

> **Дата создания:** 22 ноября 2025  
> **Последнее обновление:** 22 ноября 2025

---

## 🌳 Дерево файлов

```
/modules/habit-tracker/
│
├── 📄 index.ts                          ← Public API модуля
├── 📄 README.md                         ← Документация модуля
├── 📄 STRUCTURE.md                      ← Этот файл
│
├── 📁 features/                         ← Фичи модуля
│   │
│   ├── 📁 habits/                       ← Управление привычками (CRUD)
│   │   ├── 📁 components/               ← HabitsTable, HabitRow, модалки
│   │   ├── 📁 hooks/                    ← useHabitsFilter, useHabitActions
│   │   ├── 📁 utils/                    ← Утилиты для привычек
│   │   ├── 📁 types/                    ← Habit, HabitType, AddHabitFormData
│   │   ├── 📁 store/                    ← habits.slice, addHabitForm.slice, manageModal.slice
│   │   ├── 📁 constants/                ← HABIT_TYPES, UNITS
│   │   └── 📄 index.ts                  ← Public API фичи
│   │
│   ├── 📁 statistics/                   ← Статистика привычек
│   │   ├── 📁 components/               ← ProgressSection, MonthlyCircle, DailyProgressBars
│   │   ├── 📁 utils/                    ← Расчёты статистики
│   │   ├── 📁 store/                    ← goals.slice
│   │   ├── 📁 constants/                ← Константы статистики
│   │   └── 📄 index.ts
│   │
│   ├── 📁 calendar/                     ← Календарь привычек
│   │   ├── 📁 components/               ← CalendarHeader, CalendarGrid, MonthYearPicker
│   │   ├── 📁 utils/                    ← dateUtils, calendarUtils
│   │   ├── 📁 store/                    ← calendar.slice
│   │   └── 📄 index.ts
│   │
│   ├── 📁 strength/                     ← Сила привычки (EMA)
│   │   ├── 📁 components/               ← StrengthProgressBar, StrengthChart
│   │   ├── 📁 hooks/                    ← useStrengthUpdater
│   │   ├── 📁 utils/                    ← strengthCalculator, strengthHistory
│   │   ├── 📁 constants/                ← EMA_ALPHA, STRENGTH_LEVELS
│   │   └── 📄 index.ts
│   │
│   ├── 📁 categories/                   ← Категории привычек
│   │   ├── 📁 components/               ← CategoryPicker
│   │   ├── 📁 hooks/                    ← useCategoriesManager
│   │   ├── 📁 utils/                    ← categoryUtils
│   │   ├── 📁 store/                    ← categories.slice
│   │   ├── 📁 constants/                ← DEFAULT_CATEGORIES
│   │   └── 📄 index.ts
│   │
│   ├── 📁 frequency/                    ← Частота выполнения
│   │   ├── 📁 components/               ← FrequencyEditor, FrequencyButton, FrequencyInput + 7 секций
│   │   ├── 📁 hooks/                    ← useFrequencyState
│   │   ├── 📁 types/                    ← FrequencyEditorProps, LocalFrequencyValues
│   │   ├── 📁 utils/                    ← frequencyValidation
│   │   └── 📄 index.ts
│   │
│   └── 📁 notifications/                ← Уведомления
│       ├── 📁 components/               ← HabitsNotificationManager
│       ├── 📁 services/                 ← NotificationService, notificationScheduler
│       ├── 📁 utils/                    ← notificationUtils
│       └── 📄 index.ts
│
├── 📁 pages/                            ← Страницы модуля
│   └── 📄 HabitTrackerPage.tsx          ← Главная страница (TODO)
│
└── 📁 shared/                           ← Переиспользуемое внутри модуля
    └── (создаётся по мере необходимости)
```

---

## 📊 Статистика структуры

### Фичи модуля: **7**

1. **Habits** - CRUD привычек
2. **Statistics** - Статистика и прогресс
3. **Calendar** - Календарь привычек
4. **Strength** - Сила привычки (EMA)
5. **Categories** - Категории привычек
6. **Frequency** - Частота выполнения
7. **Notifications** - Уведомления

### Слои в каждой фиче:

- 📦 `components/` - UI компоненты
- 🔧 `hooks/` - React хуки (если нужны)
- 🛠️ `utils/` - Утилиты и хелперы
- 🎯 `types/` - TypeScript типы (если нужны)
- 📊 `store/` - Zustand слайсы (если нужны)
- 🔢 `constants/` - Константы (если нужны)
- 🔌 `services/` - Сервисы (если нужны)
- 📄 `index.ts` - Public API фичи

---

## 🔄 План миграции

### Порядок миграции фич (от простого к сложному):

1. ✅ **Notifications** (самая маленькая - 2 файла)
2. ✅ **Categories** (маленькая - ~5 файлов)
3. ✅ **Frequency** (средняя - ~6 файлов)
4. ✅ **Calendar** (средняя - ~8 файлов)
5. ✅ **Strength** (средняя - ~7 файлов)
6. ✅ **Statistics** (большая - ~10 файлов)
7. ✅ **Habits** (самая большая - ~20 файлов)

---

## 📝 Правила импортов

### Внутри модуля (относительные пути):

```typescript
// /modules/habit-tracker/pages/HabitTrackerPage.tsx
import { HabitsTable } from '../features/habits';
import { CalendarHeader } from '../features/calendar';
import { ProgressSection } from '../features/statistics';
```

### Из других частей приложения (алиасы):

```typescript
import { Button } from '@/shared/components/button';
import { useStore } from '@/core/store';
import { Checkbox } from '@/components/ui/checkbox';
```

### Импорт модуля из App.tsx:

```typescript
// App.tsx
import { HabitTrackerPage } from '@/modules/habit-tracker';
```

---

## 🚫 Что НЕ переносим в модуль

### Остаются в `/components/`:

- ✅ `/components/ui/*` - Shadcn UI (защищено Figma)
- ✅ `/components/figma/*` - Figma компоненты (защищено)
- ✅ `/components/dev/*` - Dev tools (защищено)

### Переносим в `/shared/`:

- ✅ `/components/common/*` - общие UI компоненты (Button, Modal, ColorPicker)
- ✅ `/hooks/*` - переиспользуемые хуки (если используются в других модулях)
- ✅ `/utils/*` - общие утилиты (если используются в других модулях)

---

## 🎯 Статус миграции

### Этап 1: Создание структуры

- [x] ✅ Создана папка `/modules/habit-tracker/`
- [x] ✅ Созданы папки для всех 7 фич
- [x] ✅ Созданы `index.ts` для Public API
- [x] ✅ Создана документация модуля

### Этап 2: Миграция файлов (TODO)

- [x] ✅ Notifications (мигрировано: 22 ноября 2025)
- [x] ✅ Categories (мигрировано: 22 ноября 2025)
- [x] ✅ Frequency (мигрировано: 22 ноября 2025)
- [x] ✅ Calendar (мигрировано: 22 ноября 2025)
- [ ] 🚧 Strength
- [x] ✅ Statistics (мигрировано: 22 ноября 2025)
- [x] ✅ Habits (мигрировано: 22 ноября 2025)

### Этап 3: Финализация (TODO)

- [ ] 📄 Создание HabitTrackerPage
- [ ] 🔄 Обновление App.tsx
- [ ] 🗑️ Удаление старых папок
- [ ] 📚 Обновление документации

---

**Последнее обновление:** 22 ноября 2025