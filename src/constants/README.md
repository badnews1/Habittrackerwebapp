# 📚 Константы приложения - Руководство

**Дата создания:** 19 ноября 2024

## 🎯 Назначение

Эта папка содержит централизованные константы для всего приложения, обеспечивая единообразие и лёгкость сопровождения.

## 📦 Структура файлов

### `colors.ts` - Цветовая палитра
**Что содержит:**
- `CATEGORY_COLORS` - 20 цветов для категорий привычек
- `COLOR_DISPLAY_MAP` - маппинг светлых цветов (bg-*-200) в яркие (bg-*-500)
- `HABIT_STATUS_COLORS` - цвета для статусов (completed, frozen, incomplete, future)
- `STRENGTH_CHART_COLORS` - цвета для графиков силы привычки
- `STRENGTH_THRESHOLDS` - пороговые значения силы (weak, medium, strong)
- `PROGRESS_BAR_COLORS` - цвета прогресс-баров
- **`BUTTON_COLORS`** - цвета кнопок (primary, secondary, danger, warning, ghost, close)
- **`INPUT_COLORS`** - цвета форм и инпутов (base, label, counter, error)
- **`MODAL_COLORS`** - цвета модальных окон (overlay, container, header, footer)
- **`BORDER_COLORS`** - цвета границ (light, medium, dark, focus, hover, dashed)
- **`BACKGROUND_COLORS`** - цвета фона (white, gray50-200, transparent)
- **`TEXT_COLORS`** - цвета текста (primary, secondary, muted, disabled, success, danger)
- **`ICON_COLORS`** - цвета иконок (default, hover, disabled, danger)
- Утилитные функции: `getVibrantColor()`, `getStrengthColor()`

**Пример использования:**
```typescript
import { 
  CATEGORY_COLORS, 
  COLOR_DISPLAY_MAP, 
  getVibrantColor,
  BUTTON_COLORS,
  INPUT_COLORS,
  MODAL_COLORS,
  TEXT_COLORS
} from '../constants/colors';

// Получить яркий цвет из светлого
const lightColor = 'bg-blue-200 text-blue-800 border-blue-300';
const vibrantColor = getVibrantColor(lightColor); // 'bg-blue-500'

// Получить цвет силы по значению
import { getStrengthColor } from '../constants/colors';
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
import { MODAL_STYLES, Z_INDEX, INPUT_STYLES } from '../constants/styles';

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
- `TEXT_LENGTH_LIMITS` - ограничения длины полей (habitName: 25, description: 200)
- `NUMERIC_LIMITS` - диапазоны числовых значений
- `VALIDATION_PATTERNS` - regex паттерны для валидации
- `VALIDATION_MESSAGES` - сообщения об ошибках
- Утилитные функции: `validateHabitName()`, `validateCategoryName()`, и т.д.

**Пример использования:**
```typescript
import { TEXT_LENGTH_LIMITS, validateHabitName, VALIDATION_MESSAGES } from '../constants/validation';

// Использование ограничения длины
<input maxLength={TEXT_LENGTH_LIMITS.habitName.max} />

// Валидация
const result = validateHabitName('Утренняя зарядка');
if (!result.isValid) {
  console.error(result.error); // Выведет сообщение об ошибке
}
```

---

### `strength.ts` - ⭐ НОВОЕ: Константы силы привычки (EMA)
**Что содержит:**
- `EMA_PERIOD` = 32 - период EMA (~1 месяц)
- `EMA_ALPHA` = 1/32 - коэффициент EMA для формулы

**Создано:** 20 ноября 2025  
**Цель:** Централизация константы периода EMA, устранение дублирования

**Пример использования:**
```typescript
import { EMA_PERIOD, EMA_ALPHA } from '../constants/strength';

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

### `index.ts` - Централизованный экспорт
Позволяет импортировать все константы из одного места:

```typescript
// Вместо множественных импортов:
import { CATEGORY_COLORS } from '../constants/colors';
import { Z_INDEX } from '../constants/ui';
import { TEXT_LENGTH_LIMITS } from '../constants/validation';

// Можно использовать один:
import { CATEGORY_COLORS, Z_INDEX, TEXT_LENGTH_LIMITS } from '../constants';
```

---

## 🔄 Миграция

### Что было заменено:

1. **COLOR_DISPLAY_MAP** - был дублирован в:
   - ❌ `ColorPicker.tsx` (удалено)
   - ❌ `CategoryPicker.tsx` (удалено)
   - ✅ Теперь в `constants/colors.ts`

2. **CATEGORY_COLORS** - был в:
   - ❌ `types/category.ts` (теперь реэкспортирует из constants)
   - ✅ Перенесён в `constants/colors.ts`

3. **COLORS_PER_PAGE** - был дублирован в:
   - ❌ `ColorPicker.tsx` (заменено на `PAGINATION.colorsPerPage`)
   - ❌ `ManageHabitsModal.tsx` (заменено на `PAGINATION.colorsPerPage`)
   - ✅ Теперь `PAGINATION.colorsPerPage` в `constants/ui.ts`

---

## 💡 Лучшие практики

### ✅ DO (Делайте так):

```typescript
// Импортируйте константы вместо хардкода
import { Z_INDEX, TEXT_LENGTH_LIMITS } from '../constants';

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

**Версия:** 1.0  
**Последнее обновление:** 19 ноября 2024