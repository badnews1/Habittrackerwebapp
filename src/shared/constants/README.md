# 📚 Константы приложения - Руководство

**Дата создания:** 19 ноября 2024
**Последнее обновление:** 21 ноября 2025 (миграция в /shared/)

## 🎯 Назначение

Эта папка содержит централизованные константы для всего приложения, обеспечивая единообразие и лёгкость сопровождения.

## 📦 Структура файлов

### `colors.ts` - Цветовая палитра
**Что содержит:**
- `TAG_COLORS` - 20 базовых цветов Tailwind для тегов привычек (светлые bg-*-200), исключая neutral и slate
- `COLOR_DISPLAY_MAP` - маппинг светлых цветов (bg-*-200) в яркие (bg-*-500)
- `HABIT_STATUS_COLORS` - цвета для статусов (completed, frozen, incomplete, future)

**Пример использования:**
```typescript
import { 
  TAG_COLORS, 
  COLOR_DISPLAY_MAP, 
  getVibrantColor,
  BUTTON_COLORS,
  INPUT_COLORS,
  MODAL_COLORS,
  TEXT_COLORS
} from '@/shared/constants/colors';

// Получить яркий цвет из светлого
const lightColor = 'bg-blue-200 text-blue-800 border-blue-300';
const vibrantColor = getVibrantColor(lightColor); // 'bg-blue-500'

// Получить цвет силы по значению
import { getStrengthColor } from '@/shared/constants/colors';
const strengthData = getStrengthColor(75); // { color: 'bg-green-500', textColor: 'text-green-700', ... }

// Использовать цвета кнопок
<button className={`${BUTTON_COLORS.primary.bg} ${BUTTON_COLORS.primary.text} ${BUTTON_COLORS.primary.bgHover}`}>
  Сохранить
</button>

// Использовать цвета инпутов
<input 
  className={`${INPUT_COLORS.base.bg} ${INPUT_COLORS.base.border} ${INPUT_COLORS.base.borderFocus}`}
/>

// Использовать цвета модальных окон
<div className={`${MODAL_COLORS.overlay.bg} ${MODAL_COLORS.overlay.backdrop}`}>
  <div className={`${MODAL_COLORS.container.bg} ${MODAL_COLORS.container.border}`}>
    <h2 className={MODAL_COLORS.header.text}>Заголовок</h2>
  </div>
</div>

// Использовать цвета текста
<p className={TEXT_COLORS.muted}>Вспомогательный текст</p>
<p className={TEXT_COLORS.danger}>Ошибка!</p>
```

---

### `styles.ts` - 🆕 Централизованные стили
**Что содержит:**
- **`MODAL_STYLES`** - стили модальных окон (backdrop, content, sizes)
- **`Z_INDEX`** - слои наложения (modal: z-50, dialog: z-[60], nested: z-[70])
- **`TRANSITIONS`** - анимации и переходы (default, fast, slow, smooth)
- **`INPUT_STYLES`** - стили полей ввода (standard, compact, numericLarge, noSpinButtons)

**Пример использования:**
```typescript
import { MODAL_STYLES, Z_INDEX, INPUT_STYLES } from '@/shared/constants/styles';

// Модальное окно
<div className={MODAL_STYLES.backdrop}>
  <div className={getModalContentClasses('md')}>
    Контент
  </div>
</div>

// Z-index
<div className={Z_INDEX.modal}> {/* z-50 */}

// Input поля
<input className={INPUT_STYLES.standard} />
<input className={`${INPUT_STYLES.numericLarge} ${INPUT_STYLES.noSpinButtons}`} />
```

**📚 Документация:**
- [`INPUT_STYLES_EXAMPLES.md`](/docs/INPUT_STYLES_EXAMPLES.md) - Примеры использования input стилей
- [`MODAL_SYSTEM.md`](/docs/MODAL_SYSTEM.md) - Документация системы модальных окон

---

### `validation.ts` - Правила валидации
**Что содержит:**
- `TEXT_LENGTH_LIMITS` - ограничения длины полей (habitName: 25, tagName: 15, description: 200)
- `NUMERIC_LIMITS` - диапазоны числовых значений
- `VALIDATION_PATTERNS` - regex паттерны для валидации
- `VALIDATION_MESSAGES` - сообщения об ошибках
- Утилитные функции: `validateHabitName()`, `validateTagName()`, и т.д.

**Пример использования:**
```typescript
import { TEXT_LENGTH_LIMITS, validateHabitName, VALIDATION_MESSAGES } from '@/shared/constants/validation';

// Использование ограничения длины
<input maxLength={TEXT_LENGTH_LIMITS.habitName.max} />

// Валидация
const result = validateHabitName('Утренняя зарядка');
if (!result.isValid) {
  console.error(result.error); // Выведет сообщение об ошибке
}
```

---

### `strength.ts` - ⭐ Константы силы привычки (EMA)
**Что содержит:**
- `EMA_PERIOD` = 32 - период EMA (~1 месяц)
- `EMA_ALPHA` = 1/32 - коэффициент EMA для формулы

**Создано:** 20 ноября 2025  
**Цель:** Централизация константы периода EMA, устранение дублирования

**Пример использования:**
```typescript
import { EMA_PERIOD, EMA_ALPHA } from '@/shared/constants/strength';

// Применение EMA
const newStrength = currentStrength * (1 - EMA_ALPHA) + completionValue * EMA_ALPHA;

// Или напрямую с периодом
const alpha = 1 / EMA_PERIOD;
const newStrength = currentStrength * (1 - alpha) + completionValue * alpha;
```

**Используется в:**
- `/utils/strengthCalculator.ts` - инкрементальный расчёт
- `/utils/strengthHistory.ts` - построение истории
- `/components/habits/HabitStatisticsModal.tsx` - график

---

### `icons.ts` - Маппинг иконок
**Что содержит:**
- `ICON_MAP` - маппинг строковых ключей в компоненты иконок Lucide
- `ICON_OPTIONS` - опции для IconPicker
- `DEFAULT_ICON_KEY` - иконка по умолчанию
- `ICONS_PER_PAGE` - количество иконок на странице

**Пример использования:**
```typescript
import { ICON_MAP, ICON_OPTIONS, DEFAULT_ICON_KEY } from '@/shared/constants/icons';

// Получить компонент иконки
const IconComponent = ICON_MAP['dumbbell']; // Dumbbell
<IconComponent className="w-5 h-5" />

// Использовать в пикере
<IconPicker options={ICON_OPTIONS} />
```

---

### `units.ts` - Единицы измерения
**Что содержит:**
- `UNIT_OPTIONS` - 22 единицы измерения для привычек
- `DEFAULT_UNIT` - единица по умолчанию ('разы')

**Пример использования:**
```typescript
import { UNIT_OPTIONS, DEFAULT_UNIT } from '@/shared/constants/units';

// Использовать в селекте
<select>
  {UNIT_OPTIONS.map(unit => (
    <option key={unit} value={unit}>{unit}</option>
  ))}
</select>
```

---

### `ui.ts` - UI константы
**Что содержит:**
- `PAGINATION` - константы пагинации (colorsPerPage, iconsPerPage)
- `COMPONENT_SIZES` - размеры компонентов (icon, button, input)
- `BORDER_RADIUS` - радиусы скругления
- `BORDER_WIDTH` - толщины границ
- `SHADOWS` - тени
- `TRANSITION_DURATION` - длительности переходов
- `SPACING` - отступы (gap, padding, margin)
- `BREAKPOINTS` - брейкпоинты для responsive дизайна

**Пример использования:**
```typescript
import { PAGINATION, COMPONENT_SIZES, BREAKPOINTS } from '@/shared/constants/ui';

// Пагинация
const colors = CATEGORY_COLORS.slice(0, PAGINATION.colorsPerPage);

// Размеры
<Icon className={COMPONENT_SIZES.icon.medium} /> // w-5 h-5

// Responsive
if (window.innerWidth < BREAKPOINTS.md) {
  // Мобильная версия
}
```

---

### `index.ts` - Централизованный экспорт
Позволяет импортировать все константы из одного места:

```typescript
// Вместо множественных импортов:
import { CATEGORY_COLORS } from '@/shared/constants/colors';
import { Z_INDEX } from '@/shared/constants/ui';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants/validation';

// Можно использовать один:
import { CATEGORY_COLORS, Z_INDEX, TEXT_LENGTH_LIMITS } from '@/shared/constants';
```

---

## 🔄 Миграция

### История:
- **19 ноября 2024** - создание папки `/constants/`
- **20 ноября 2025** - добавление `strength.ts`
- **21 ноября 2025** - миграция в `/shared/constants/` (feature-based рефакторинг)

### Что было заменено:

1. **COLOR_DISPLAY_MAP** - был дублирован в:
   - ❌ `ColorPicker.tsx` (удалено)
   - ❌ `CategoryPicker.tsx` (удалено)
   - ✅ Теперь в `shared/constants/colors.ts`

2. **CATEGORY_COLORS** - был в:
   - ❌ `types/category.ts` (теперь реэкспортирует из constants)
   - ✅ Перенесён в `shared/constants/colors.ts`

3. **COLORS_PER_PAGE** - был дублирован в:
   - ❌ `ColorPicker.tsx` (заменено на `PAGINATION.colorsPerPage`)
   - ❌ `ManageHabitsModal.tsx` (заменено на `PAGINATION.colorsPerPage`)
   - ✅ Теперь `PAGINATION.colorsPerPage` в `shared/constants/ui.ts`

---

## 💡 Лучшие практики

### ✅ DO (Делайте так):

```typescript
// Импортируйте константы вместо хардкода
import { Z_INDEX, TEXT_LENGTH_LIMITS } from '@/shared/constants';

<div style={{ zIndex: Z_INDEX.modal }}> {/* ✅ */}
<input maxLength={TEXT_LENGTH_LIMITS.habitName.max} /> {/* ✅ */}
```

### ❌ DON'T (Не делайте так):

```typescript
// Не хардкодьте значения
<div style={{ zIndex: 60 }}> {/* ❌ */}
<input maxLength={25} /> {/* ❌ */}
```

### Преимущества централизации:

1. **Единственный источник правды** - изменение в одном месте применяется везде
2. **Лёгкость сопровождения** - легко найти и обновить значения
3. **Предотвращение дублирования** - нет копипасты констант
4. **Типобезопасность** - TypeScript проверит использование констант
5. **Документация** - все константы задокументированы в одном месте

---

## 📝 Когда добавлять новые константы?

Добавляйте константу, если:
- ✅ Значение используется в 2+ местах
- ✅ Значение может измениться в будущем
- ✅ Это часть дизайн-системы (цвета, размеры, отступы)
- ✅ Это бизнес-правило (ограничения, лимиты)

НЕ добавляйте, если:
- ❌ Значение уникально для одного компонента
- ❌ Значение вычисляется динамически
- ❌ Значение является частью локальной логики

---

## 🔍 Поиск использования

Используйте поиск по проекту для поиска мест, где используются константы:

```bash
# Найти все использования Z_INDEX
grep -r "Z_INDEX" src/

# Найти все использования CATEGORY_COLORS
grep -r "CATEGORY_COLORS" src/
```

---

**Версия:** 2.0  
**Последнее обновление:** 21 ноября 2025 (миграция в /shared/)