# 📝 Примеры использования INPUT_STYLES

**Дата создания:** 20 ноября 2025

---

## 📚 Доступные варианты

```typescript
INPUT_STYLES = {
  base: string;          // Базовые стили
  standard: string;      // Стандартный input
  compact: string;       // Компактный input
  numericLarge: string;  // Большой числовой input
  noSpinButtons: string; // Утилита для удаления стрелок
}
```

---

## 🎯 Примеры использования

### 1. Стандартная форма (INPUT_STYLES.standard)

```tsx
import { INPUT_STYLES } from '../../../constants/styles';

<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className={INPUT_STYLES.standard}
  placeholder="Введите название..."
/>
```

**Когда использовать:**
- Формы добавления/редактирования
- Основные поля ввода
- Стандартные размеры паддингов

**Примеры в коде:**
- `HabitBasicInfoStep.tsx` - поле названия привычки
- `HabitMeasurableStep.tsx` - поле цели
- `HabitMeasurableSettingsSection.tsx` - редактирование цели

---

### 2. Компактный input (INPUT_STYLES.compact)

```tsx
import { INPUT_STYLES } from '../../../constants/styles';

<input
  type="text"
  value={editedName}
  onChange={(e) => setEditedName(e.target.value)}
  className={INPUT_STYLES.compact}
  placeholder="Редактировать..."
/>
```

**Когда использовать:**
- Inline редакторы
- Поля внутри dropdown/popover
- Когда нужно сэкономить место

**Примеры в коде:**
- `HabitNameEditor.tsx` - inline редактор названия
- `CategoryPicker.tsx` - добавление новой категории

---

### 3. Большой числовой input (INPUT_STYLES.numericLarge + noSpinButtons)

```tsx
import { INPUT_STYLES } from '../../constants/styles';

<input
  ref={inputRef}
  type="number"
  value={value}
  onChange={handleChange}
  className={`${INPUT_STYLES.numericLarge} ${INPUT_STYLES.noSpinButtons}`}
  placeholder=""
  step="any"
/>
```

**Когда использовать:**
- Модальные окна с числовым вводом
- Фокус на одном большом числе
- Центрированный ввод

**Примеры в коде:**
- `NumericInputModal.tsx` - ввод значения измеримой привычки

---

### 4. Комбинирование с дополнительными классами

#### Пример 1: Стандартный + padding-right для счётчика

```tsx
import { INPUT_STYLES } from '../../../constants/styles';

<div className="relative">
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className={`${INPUT_STYLES.standard} pr-12`}
    maxLength={50}
  />
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
    {50 - name.length}
  </span>
</div>
```

#### Пример 2: Компактный + flex-1 для растягивания

```tsx
import { INPUT_STYLES } from '../../../constants/styles';

<div className="flex gap-2">
  <input
    type="text"
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    className={`flex-1 ${INPUT_STYLES.compact}`}
    placeholder="Новая категория..."
  />
  <button>Добавить</button>
</div>
```

---

### 5. Числовые поля с валидацией

```tsx
import { INPUT_STYLES } from '../../../constants/styles';

<input
  type="text"
  inputMode="decimal"
  value={targetValue}
  onChange={(e) => {
    const value = e.target.value;
    // Разрешаем только числа и десятичную точку
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTargetValue(value);
    }
  }}
  className={INPUT_STYLES.standard}
  placeholder="Например: 2 или 1.5"
/>
```

**Особенности:**
- `type="text"` + `inputMode="decimal"` для мобильной клавиатуры
- Кастомная валидация через regex
- Позволяет вводить десятичные числа

---

## 🚫 Антипаттерны

### ❌ НЕ переопределяй базовые стили

```tsx
// ❌ ПЛОХО - переопределяет border из стандартного стиля
<input className={`${INPUT_STYLES.standard} border-red-500`} />

// ✅ ХОРОШО - создай отдельный вариант если нужен другой border
const errorInput = `${INPUT_STYLES.base} border-2 border-red-500 ...`;
<input className={errorInput} />
```

### ❌ НЕ дублируй классы из константы

```tsx
// ❌ ПЛОХО - дублирует классы
<input className={`${INPUT_STYLES.standard} px-3 py-2 border rounded`} />

// ✅ ХОРОШО - используй как есть
<input className={INPUT_STYLES.standard} />
```

### ❌ НЕ используй для специальных случаев

```tsx
// ❌ ПЛОХО - пытаемся натянуть стандарт на специальный дизайн
<input 
  className={`${INPUT_STYLES.standard} bg-transparent border-none`}
  style={{ fontSize: 26, width: '3ch' }}
/>

// ✅ ХОРОШО - создай кастомный стиль для специального случая
<input 
  className="bg-transparent border-none outline-none text-gray-900"
  style={{ fontSize: 26, width: '3ch' }}
/>
```

---

## 🎨 Создание новых вариантов

Если существующие варианты не подходят, создай новый в `/constants/styles.ts`:

```typescript
export const INPUT_STYLES = {
  // ... существующие варианты ...
  
  // ✅ Новый вариант с описанием
  // Применение: Где будет использоваться
  error: 'w-full px-3 py-2 border-2 border-red-500 rounded focus:outline-none focus:border-red-700 transition-colors text-sm',
} as const;
```

**Рекомендации:**
1. Добавь комментарий с описанием
2. Укажи где планируешь использовать
3. Следуй существующим паттернам (focus:outline-none, transition-colors)
4. Обнови документацию в этом файле

---

## 📊 Сравнение вариантов

| Вариант | Padding | Border | Rounded | Font Size | Применение |
|---------|---------|--------|---------|-----------|------------|
| `standard` | px-3 py-2 | border (1px) | rounded | text-sm | Формы |
| `compact` | px-2 py-1.5 | border (1px) | rounded | text-sm | Inline |
| `numericLarge` | px-4 py-3 | border-2 (2px) | rounded-xl | text-2xl | Модалки |

---

## 🔧 Миграция существующего кода

### Было:
```tsx
<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900 transition-colors text-sm placeholder:text-gray-400"
  placeholder="Введите название..."
/>
```

### Стало:
```tsx
import { INPUT_STYLES } from '../../../constants/styles';

<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className={INPUT_STYLES.standard}
  placeholder="Введите название..."
/>
```

**Преимущества:**
- ✅ Короче и читабельнее
- ✅ Единый источник стилей
- ✅ Легче изменять глобально
- ✅ TypeScript автодополнение

---

## 📝 Чеклист использования

При создании нового input поля:

- [ ] Проверь существующие варианты в `INPUT_STYLES`
- [ ] Выбери подходящий или создай новый
- [ ] Импортируй `INPUT_STYLES` из констант
- [ ] Используй шаблонную строку если нужны дополнительные классы
- [ ] Не переопределяй базовые стили (border, padding, etc)
- [ ] Документируй если создаёшь новый вариант

---

**Последнее обновление:** 20 ноября 2025
