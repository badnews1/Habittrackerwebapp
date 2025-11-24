# Dropdown Constructor

Универсальный композитный конструктор для создания dropdown меню.

## 📦 Структура

```
dropdown/
├── Dropdown.tsx       # Основной компонент
├── index.ts          # Barrel exports
└── README.md         # Документация
```

## 🎯 Назначение

Устраняет дублирование логики в компонентах:
- **CategoryPicker** (~120 строк dropdown логики)
- **IconPicker** (~80 строк)
- **UnitPicker** (~80 строк)
- **TargetTypePicker** (~60 строк)
- **HabitTypePicker** (~60 строк)

**Экономия: ~400 строк кода**

## ⌨️ Клавиатурная навигация

Полная поддержка клавиатурной навигации:
- **Escape** - закрыть dropdown (или очистить search если есть текст)
- **Click outside** - закрыть dropdown
- **ArrowDown** - переход к следующему элементу (с циклом)
- **ArrowUp** - переход к предыдущему элементу (с циклом)
- **Home** - переход к первому элементу
- **End** - переход к последнему элементу
- **При открытии** - фокус автоматически переходит на Search (если есть) ИЛИ на первый элемент
- **При закрытии** - фокус возвращается на триггер

**Клавиатурная навигация из Search (круговая):**
- ✅ **ArrowDown из Search** → переход к первому Item в результатах
- ✅ **ArrowUp из Search** → переход к последнему Item в результатах
- ✅ **ArrowUp на первом Item** → возврат к Search (круговая навигация)
- ✅ **Escape (с текстом)** → очистить search, dropdown остаётся открытым
- ✅ **Escape (пустой search)** → закрыть dropdown

**Пример круговой навигации:**
```
[Search: "кило"___________]  ← Фокус здесь
          ↓ ArrowDown
  📏 Расстояние
    км  ← Первый результат
    м
  ⚖️ Вес
    кг
    г  ← Последний результат
          ↑ ArrowUp (на первом Item)
[Search: "кило"___________]  ← Возврат к Search!
```

**Визуальный feedback:**
- Активный элемент подсвечивается через `focus:bg-gray-100`
- Disabled элементы имеют `opacity-50` и не фокусируемы (`tabIndex={-1}`)

**Focus management:**
- ✅ **Search имеет приоритет:** Если в Content есть Search, фокус автоматически переходит на него при открытии
- ✅ **Fallback на первый Item:** Если Search нет, фокус переходит на первый активный Item
- ✅ **Возврат фокуса:** При закрытии фокус возвращается на Trigger
- ✅ **Мгновенный ввод:** Пользователь может сразу начать печатать в Search без дополнительных действий
- ✅ **Круговая навигация:** Search ↔ Items (бесшовный переход туда и обратно)

**Accessibility (A11y):**
- ✅ ARIA атрибуты (`role="menu"`, `role="menuitem"`, `aria-disabled`)
- ✅ Корректный `tabIndex`: 0 для активных элементов, -1 для disabled
- ✅ Визуальный focus indicator
- ✅ Клавиатурная навигация стрелками (включая круговую из/в Search)
- ✅ Focus management (автофокус и возврат)
- ✅ Умное поведение Escape (очистка search → закрытие dropdown)

**Ограничения:** Focus trap не реализован (Tab/Shift+Tab могут выйти за пределы dropdown). Для production-ready решения с полным focus trap рекомендуется использовать shadcn/ui DropdownMenu.

## 🌐 Portal рендеринг

**Content рендерится через `createPortal(element, document.body)`:**

✅ **Преимущества:**
- Не обрезается родительским `overflow: hidden`
- Не ограничивается `z-index` стеком родителей
- Работает в любом месте DOM дерева

⚙️ **Позиционирование:**
- `position: fixed` вместо `absolute`
- Динамический расчёт координат через `getBoundingClientRect()`
- Поддержка всех направлений (up/down) и выравниваний (left/right/center)
- Автоматический пересчёт при изменении контента

⚠️ **Нюансы:**
- Content не скроллится вместе с родителем (fixed позиционирование)
- При скролле страницы dropdown остаётся на месте относительно viewport
- Для динамического обновления позиции при скролле нужен дополнительный обработчик

## 📱 Responsive maxHeight (Dynamic)

**Dropdown автоматически рассчитывает maxHeight на основе доступного пространства во viewport:**

### **Логика расчёта:**
```typescript
// Рассчитываем доступное пространство
const availableSpace = direction === 'down'
  ? window.innerHeight - triggerRect.bottom - spacing - padding
  : triggerRect.top - spacing - padding;

// Минимум 8rem (128px), максимум 15rem (240px)
const calculatedHeight = Math.max(128, Math.min(availableSpace, 240));
```

### **Параметры:**
- **Минимум:** `8rem` (128px) - не будет слишком маленьким
- **Максимум:** `15rem` (240px) - не будет огромным
- **Padding:** `16px` - отступ от края viewport
- **Направление:** Учитывается `up` / `down`

### **Преимущества:**
✅ Никогда не вылезет за viewport  
✅ Адаптируется к любым устройствам (mobile/tablet/desktop)  
✅ Учитывает позицию триггера на странице  
✅ Работает одинаково хорошо для dropdown вверху/внизу экрана  

### **Примеры:**

**Mobile (iPhone SE 667px высота):**
- Dropdown внизу экрана → maxHeight ~150px (помещается)
- Dropdown вверху экрана → maxHeight 240px (полный размер)

**Desktop (1080px высота):**
- Dropdown везде → maxHeight 240px (полный размер)

**Edge case (триггер почти у края):**
- Доступно 100px → maxHeight 128px (минимум)
- Включается скролл автоматически

## 🎯 closeOnSelect (Multi-select поддержка)

**Контроль закрытия dropdown при клике на Item:**

### **Глобальная настройка (Root):**
```tsx
// По умолчанию: closeOnSelect={true} (закрывается после клика)
<Dropdown.Root closeOnSelect={false}>
  <Dropdown.Item>Item 1</Dropdown.Item> {/* НЕ закрывает */}
  <Dropdown.Item>Item 2</Dropdown.Item> {/* НЕ закрывает */}
</Dropdown.Root>
```

### **Индивидуальное переопределение (Item):**
```tsx
<Dropdown.Root closeOnSelect={false}>
  <Dropdown.Item>Вариант 1</Dropdown.Item> {/* НЕ закрывает */}
  <Dropdown.Item>Вариант 2</Dropdown.Item> {/* НЕ закрывает */}
  <Dropdown.Separator />
  <Dropdown.Item closeOnClick={true}>Готово</Dropdown.Item> {/* ЗАКРЫВАЕТ! */}
</Dropdown.Root>
```

### **Use-cases:**

**1. Multi-select пикеры:**
```tsx
// Выбор нескольких категорий для привычки
<Dropdown.Root closeOnSelect={false}>
  <Dropdown.Item selected={categories.includes('sport')}>Спорт</Dropdown.Item>
  <Dropdown.Item selected={categories.includes('food')}>Питание</Dropdown.Item>
  {/* Пользователь кликает несколько → dropdown остаётся открытым */}
</Dropdown.Root>
```

**2. Settings панели:**
```tsx
<Dropdown.Root closeOnSelect={false}>
  <Dropdown.Item><Switch /> Показывать завершённые</Dropdown.Item>
  <Dropdown.Item><Switch /> Показывать архивные</Dropdown.Item>
  {/* Переключаем настройки без закрытия */}
</Dropdown.Root>
```

**3. Кнопки действий:**
```tsx
<Dropdown.Root closeOnSelect={false}>
  <Dropdown.Item>Действие 1</Dropdown.Item>
  <Dropdown.Item>Действие 2</Dropdown.Item>
  <Dropdown.Separator />
  <Dropdown.Item closeOnClick={true}>Применить</Dropdown.Item>
  <Dropdown.Item closeOnClick={true} variant="danger">Отмена</Dropdown.Item>
</Dropdown.Root>
```

**Логика:**
- `closeOnClick` на Item **переопределяет** `closeOnSelect` из Root
- `closeOnClick={undefined}` → используется значение из Root
- По умолчанию: `closeOnSelect={true}` (backward compatibility)

## 📁 Group + Label (Визуальная группировка)

**Группировка элементов для улучшения UX в больших списках.**

### **Use-case #1: UnitPicker (22 единицы) - КРИТИЧНО!**

**❌ БЕЗ группировки (UX катастрофа):**
```tsx
// Плоский список из 22 элементов:
<Dropdown.Content>
  <Dropdown.Item>км</Dropdown.Item>
  <Dropdown.Item>м</Dropdown.Item>
  <Dropdown.Item>миля</Dropdown.Item>
  <Dropdown.Item>кг</Dropdown.Item>
  <Dropdown.Item>г</Dropdown.Item>
  {/* ... ещё 17 элементов ... */}
</Dropdown.Content>
// 😵 Пользователь теряется! Где найти "кг"?
```

**✅ С группировкой (идеально):**
```tsx
<Dropdown.Content>
  <Dropdown.Group label="📏 Расстояние">
    <Dropdown.Item value="km">км</Dropdown.Item>
    <Dropdown.Item value="m">м</Dropdown.Item>
    <Dropdown.Item value="mile">миля</Dropdown.Item>
    <Dropdown.Item value="yard">ярд</Dropdown.Item>
    <Dropdown.Item value="foot">фут</Dropdown.Item>
  </Dropdown.Group>
  
  <Dropdown.Group label="⚖️ Вес">
    <Dropdown.Item value="kg">кг</Dropdown.Item>
    <Dropdown.Item value="g">г</Dropdown.Item>
    <Dropdown.Item value="pound">фунт</Dropdown.Item>
    <Dropdown.Item value="ounce">унция</Dropdown.Item>
  </Dropdown.Group>
  
  <Dropdown.Group label="⏱️ Время">
    <Dropdown.Item value="hour">час</Dropdown.Item>
    <Dropdown.Item value="min">мин</Dropdown.Item>
    <Dropdown.Item value="sec">сек</Dropdown.Item>
  </Dropdown.Group>
  
  <Dropdown.Group label="🔢 Прочее">
    <Dropdown.Item value="times">раз</Dropdown.Item>
    <Dropdown.Item value="pages">стр</Dropdown.Item>
    <Dropdown.Item value="liter">л</Dropdown.Item>
    <Dropdown.Item value="ml">мл</Dropdown.Item>
    <Dropdown.Item value="kcal">ккал</Dropdown.Item>
    <Dropdown.Item value="pcs">шт</Dropdown.Item>
    <Dropdown.Item value="percent">%</Dropdown.Item>
  </Dropdown.Group>
</Dropdown.Content>
// ✅ Структурировано! Легко найти нужное!
```

### **Use-case #2: CategoryPicker (группы по темам)**

```tsx
<Dropdown.Content>
  <Dropdown.Group label="💪 Здоровье">
    <Dropdown.Item icon={Dumbbell}>Спорт</Dropdown.Item>
    <Dropdown.Item icon={Apple}>Питание</Dropdown.Item>
    <Dropdown.Item icon={Moon}>Сон</Dropdown.Item>
  </Dropdown.Group>
  
  <Dropdown.Separator />
  
  <Dropdown.Group label="🧠 Развитие">
    <Dropdown.Item icon={Book}>Обучение</Dropdown.Item>
    <Dropdown.Item icon={Code}>Программирование</Dropdown.Item>
    <Dropdown.Item icon={Brain}>Медитация</Dropdown.Item>
  </Dropdown.Group>
  
  <Dropdown.Group label="💼 Работа">
    <Dropdown.Item icon={Briefcase}>Проекты</Dropdown.Item>
    <Dropdown.Item icon={Mail}>Email</Dropdown.Item>
  </Dropdown.Group>
</Dropdown.Content>
```

### **Use-case #3: Actions Menu (группы действий)**

```tsx
<Dropdown.Content>
  <Dropdown.Group label="Основные">
    <Dropdown.Item icon={Edit}>Редактировать</Dropdown.Item>
    <Dropdown.Item icon={Copy}>Дублировать</Dropdown.Item>
    <Dropdown.Item icon={Pin}>Закрепить</Dropdown.Item>
  </Dropdown.Group>
  
  <Dropdown.Separator />
  
  <Dropdown.Group label="Опасные действия">
    <Dropdown.Item icon={Archive}>Архивировать</Dropdown.Item>
    <Dropdown.Item icon={Trash} variant="danger">Удалить</Dropdown.Item>
  </Dropdown.Group>
</Dropdown.Content>
```

### **Два режима использования:**

**1. Prop-based (простой):**
```tsx
<Dropdown.Group label="Расстояние">
  <Dropdown.Item>км</Dropdown.Item>
  <Dropdown.Item>м</Dropdown.Item>
</Dropdown.Group>
```

**2. Композитный (кастомный - с иконками):**
```tsx
<Dropdown.Group>
  <Dropdown.Label icon={Ruler}>Расстояние</Dropdown.Label>
  <Dropdown.Item>км</Dropdown.Item>
  <Dropdown.Item>м</Dropdown.Item>
</Dropdown.Group>
```

### **Дизайн (стиль Джонни Айва):**
- Заголовок: `text-xs text-gray-500 font-medium px-2 py-1.5`
- Минималистично, без рамок
- Только текст и отступы

### **Accessibility:**
- `role="group"` для группировки
- `aria-labelledby` связывает Group с Label
- `role="presentation"` для Label (не участвует в навигации)
- Label НЕ фокусируемый (только Items)

### **Преимущества:**
✅ **UX:** Визуально структурирует большие списки (22 единицы в UnitPicker!)  
✅ **Навигация:** Пользователь быстрее находит нужный элемент  
✅ **Контекст:** Заголовки групп добавляют смысл  
✅ **Accessibility:** Screen readers озвучивают группы  
✅ **Консистентность:** Единообразный дизайн во всех пикерах  
✅ **Best Practice:** Radix UI, shadcn/ui, Material UI - все имеют группировку  

---

## 🔍 Search + Empty (Поиск и фильтрация)

**Поиск элементов в больших списках - КРИТИЧНО для usability!**

### **Проблема: IconPicker невозможен без поиска**

**❌ БЕЗ поиска (1000+ иконок lucide-react):**
```tsx
// Пользователь будет скроллить вечность! 😵
<Dropdown.Content>
  <Dropdown.Item>ArrowUp</Dropdown.Item>
  <Dropdown.Item>ArrowDown</Dropdown.Item>
  {/* ... еще 998 иконок ... */}
</Dropdown.Content>
```

**✅ С поиском (идеально):**
```tsx
<Dropdown.Content>
  <Dropdown.Search placeholder="Поиск иконок..." />
  <Dropdown.Item value="heart" keywords={['сердце', 'любовь']}>Heart</Dropdown.Item>
  <Dropdown.Item value="star" keywords={['звезда', 'избранное']}>Star</Dropdown.Item>
  {/* Пользователь вводит "серд" → сразу находит Heart */}
</Dropdown.Content>
```

---

### **Компоненты:**

#### **1. Dropdown.Search (поисковый input)**

```tsx
<Dropdown.Search placeholder="Поиск..." />
```

**Фичи:**
- ✅ Input с иконкой поиска (lucide-react Search)
- ✅ Кнопка очистки X (появляется когда есть текст)
- ✅ Минималистичный дизайн (стиль Джонни Айва)
- ✅ Controlled: внутреннее состояние `useState`
- ✅ Accessibility: `aria-label="Поиск"`

**Дизайн:**
```css
/* Стили Search */
px-4 py-2                        /* Отступы обёртки */
w-full px-4 py-2 text-sm         /* Input */
bg-gray-100 border-gray-300      /* Светлый фон */
rounded-lg                       /* Скруглённые углы */
focus:border-gray-500            /* Фокус */
```

---

#### **2. Dropdown.Empty (EmptyState)**

```tsx
{filteredItems.length === 0 && (
  <Dropdown.Empty>Ничего не найдено</Dropdown.Empty>
)}
```

**Показывается когда:**
- Поиск активен И результатов нет

**Дизайн:**
```css
px-4 py-2 text-sm text-gray-500  /* Серый текст, отступы */
```

---

#### **3. keywords prop (расширенный поиск)**

```tsx
<Dropdown.Item 
  value="kg" 
  keywords={['килограмм', 'вес', 'weight', 'kilogram']}
>
  кг
</Dropdown.Item>
```

**Поиск работает по:**
1. `children` (текст "кг")
2. `value` ("kg")
3. `keywords` (["килограмм", "вес", "weight", "kilogram"])

**Use-cases:**
- Синонимы: "кг" = "клограмм"
- Перевод: "км" = "kilometer"
- Теги: "спорт" = ["фитнес", "тренировка", "workout"]

---

### **Режим использования: Ручной (Manual)**

**Для максимальной гибкости - фильтрация вручную:**

```tsx
const [search, setSearch] = useState('');

// Фильтрация
const filtered = items.filter(item => {
  if (!search) return true;
  const query = search.toLowerCase();
  return (
    item.name.toLowerCase().includes(query) ||
    item.keywords?.some(kw => kw.toLowerCase().includes(query))
  );
});

// Группировка отфильтрованных
const grouped = filtered.reduce((acc, item) => {
  if (!acc[item.group]) acc[item.group] = [];
  acc[item.group].push(item);
  return acc;
}, {});

<Dropdown.Content>
  {/* Controlled Search - ОБЯЗАТЕЛЬНЫ value и onChange */}
  <Dropdown.Search 
    value={search}
    onChange={setSearch}
    placeholder="Поиск..." 
  />
  
  {filtered.length === 0 ? (
    <Dropdown.Empty>Ничего не найдено</Dropdown.Empty>
  ) : (
    groups.map(group => {
      const groupItems = grouped[group.key];
      if (!groupItems?.length) return null; // Скрываем пустые группы
      
      return (
        <Dropdown.Group key={group.key} label={group.label}>
          {groupItems.map(item => (
            <Dropdown.Item 
              key={item.id}
              keywords={item.keywords}
            >
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Group>
      );
    })
  )}
</Dropdown.Content>
```

**API Search компонента:**

```tsx
interface DropdownSearchProps {
  /** Текущее значение поиска (controlled) */
  value?: string;
  /** Callback при изменении значения */
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Использование:
<Dropdown.Search 
  value={search}           // ← Обязательный prop
  onChange={setSearch}     // ← Обязательный prop
  placeholder="Поиск..." 
/>
```

**Плюсы:**
- ✅ Максимальная гибкость
- ✅ Кастомная логика фильтрации
- ✅ Контроль над EmptyState
- ✅ Поддержка Group структуры
- ✅ Скрытие пустых групп
- ✅ Стандартный паттерн React (как обычный input)

---

### **Use-cases:**

#### **1. UnitPicker (22 единицы) - ОЧЕНЬ ПОЛЕЗНО**

```tsx
const units = [
  { id: 'km', name: 'км', group: 'Расстояние', keywords: ['километр', 'kilometer'] },
  { id: 'kg', name: 'кг', group: 'Вес', keywords: ['килограмм', 'kilogram', 'вес'] },
  // ... 20 единиц ...
];

<Dropdown.Content>
  <Dropdown.Search placeholder="Поиск единиц..." />
  {/* Фильтрация + группировка */}
</Dropdown.Content>
// Ввёл "кило" → нашёл "км" и "кг"!
```

---

#### **2. IconPicker (1000+ иконок) - КРИТИЧНО!**

```tsx
const icons = [
  { name: 'Heart', keywords: ['сердце', 'любовь', 'лайк'] },
  { name: 'Star', keywords: ['звезда', 'избранное', 'рейтинг'] },
  // ... 998 иконок ...
];

<Dropdown.Content>
  <Dropdown.Search placeholder="Поиск иконок..." />
  {/* БЕЗ поиска IconPicker непригоден! */}
</Dropdown.Content>
```

---

#### **3. CategoryPicker (multi-select с поиском)**

```tsx
<Dropdown.Root closeOnSelect={false}>
  <Dropdown.Content>
    <Dropdown.Search placeholder="Поиск категорий..." />
    {/* Multi-select: можно выбрать несколько */}
  </Dropdown.Content>
</Dropdown.Root>
```

---

#### **4. Country/City пикеры (100+ элементов)**

```tsx
// 195 стран без поиска? Нет, спасибо!
<Dropdown.Content>
  <Dropdown.Search placeholder="Поиск страны..." />
  {/* Поиск обязателен для больших справочников */}
</Dropdown.Content>
```

---

### **Дизайн (стиль Джонни Айва):**

```tsx
// Search
<div className="px-4 py-2">
  <div className="relative">
    <input className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg" />
    {/* Clear button (X) справа */}
  </div>
</div>

// Empty
<div className="px-4 py-2 text-sm text-gray-500">
  Ничего не найдено
</div>
```

**Минималистично, чисто, элегантно!**

---

### **Клавиатурная навигация:**

- **Escape** (в Search) → очистить поиск (если есть текст) ИЛИ закрыть dropdown
- **ArrowDown** (в Search) → перейти к первому результату
- **ArrowUp** (в результатах) → вернуться в Search (опционально)
- **Enter** (в Search) → выбрать первый результат (опционально)

---

### **Преимущества:**

✅ **IconPicker возможен:** 1000+ иконок → с поиском usable!  
✅ **UnitPicker улучшен:** 22 единицы → быстрый доступ  
✅ **Индустриальный стандарт:** Radix Select, shadcn Combobox, Material Autocomplete  
✅ **keywords поддержка:** Поиск по синонимам/переводам  
✅ **Гибкость:** Ручной режим для кастомной логики  
✅ **EmptyState:** Feedback когда нет результатов  
✅ **Минималистичный дизайн:** Стиль Джонни Айва  

---

## 📅 История изменений

- **22 ноября 2025** - Исправлен импорт иконок: Search + X теперь из `/shared/icons` (централизация) ⭐
- **22 ноября 2025** - Добавлена иконка Search слева от input (индустриальный стандарт, UX улучшение) ⭐
- **22 ноября 2025** - Добавлена круговая клавиатурная навигация Search ↔ Items (ArrowDown/Up, умный Escape) ⭐
- **22 ноября 2025** - Добавлен автофокус на Search при открытии dropdown (мгновенный ввод, UX улучшение)
- **22 ноября 2025** - Исправлен критический баг в Search: сделан controlled компонентом (value + onChange props)
- **22 ноября 2025** - Добавлен Search компонент с поддержкой keywords для фильтрации больших списков
- **22 ноября 2025** - Добавлена группировка элементов (Dropdown.Group + Dropdown.Label) для больших списков
- **22 ноября 2025** - Добавлен динамический responsive maxHeight (min 8rem, max 15rem в зависимости от viewport)
- **22 ноября 2025** - Добавлен closeOnSelect для multi-select пикеров (Root.closeOnSelect + Item.closeOnClick)
- **22 ноября 2025** - Добавлен Portal для Content (fixed позиционирование, решена проблема overflow: hidden)
- **22 ноября 2025** - Исправлен `aria-expanded` в Trigger (теперь динамический на основе isOpen)
- **22 ноября 2025** - Исправлен критический баг: добавлен `tabIndex` для Item (элементы не фокусировались)
- **22 ноября 2025** - Добавлена навигация стрелками (ArrowUp/Down, Home/End)
- **22 ноября 2025** - Добавлен базовый focus management (фокус на первый элемент, возврат на триггер)
- **22 ноября 2025** - Создан композитный Dropdown конструктор