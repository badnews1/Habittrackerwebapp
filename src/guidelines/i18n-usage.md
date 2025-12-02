# 🌍 Использование мультиязычности (i18n)

## 📖 Быстрый старт

### 1. Импорт хука `useTranslation`

```typescript
import { useTranslation } from 'react-i18next';
```

### 2. Использование в компоненте

```typescript
export function MyComponent() {
  const { t } = useTranslation('common'); // или 'habits', 'validation', 'stats'
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

## 📚 Namespaces (пространства имён)

### `common` - общие переводы
- Базовые действия: save, cancel, delete, edit, add, close
- Навигация
- Секции
- Теги
- Частота
- Дни недели
- Месяцы
- Уведомления

```typescript
const { t } = useTranslation('common');
t('common.save')            // "Save" / "Сохранить"
t('sections.health')        // "Health" / "Здоровье"
t('weekdays.short.monday')  // "Mon" / "Пн"
```

### `habits` - переводы для привычек
- Типы привычек
- Цели
- Единицы измерения
- Выполнение
- Частота
- Сила привычки
- Напоминания
- Статистика
- Фильтры
- Управление

```typescript
const { t } = useTranslation('habits');
t('habit.addHabit')         // "Add Habit" / "Добавить привычку"
t('type.binary')            // "Binary" / "Бинарная"
t('units.kilometers')       // "kilometers" / "километров"
```

### `validation` - сообщения валидации
```typescript
const { t } = useTranslation('validation');
t('required')                      // "This field is required" / "Это поле обязательно"
t('habitName.minLength', { min: 3 }) // "Habit name must be at least 3 characters"
```

### `stats` - статистика
```typescript
const { t } = useTranslation('stats');
t('title')                  // "Statistics" / "Статистика"
t('metrics.completedToday') // "Completed Today" / "Выполнено сегодня"
```

## 🔧 Интерполяция (вставка переменных)

```typescript
// В JSON:
"timesPerWeek": "{{count}} times per week"

// В коде:
t('frequency.timesPerWeek', { count: 5 }) // "5 times per week"
```

## 🎯 Множественные namespace

```typescript
// Если нужно использовать несколько namespace:
const { t } = useTranslation(['common', 'habits']);

t('common:common.save')   // из common namespace
t('habits:habit.addHabit') // из habits namespace
```

## 🌐 Переключение языка

### Через хук
```typescript
import { useLanguage } from '@/features/language-switcher';

export function MyComponent() {
  const { currentLanguage, toggleLanguage, changeLanguage } = useLanguage();
  
  // Переключение EN ↔ RU
  toggleLanguage();
  
  // Установка конкретного языка
  changeLanguage('en');
  changeLanguage('ru');
}
```

### Через компонент
```typescript
import { LanguageToggle } from '@/features/language-switcher';

// Готовая кнопка переключения (уже добавлена в AppSidebar)
<LanguageToggle />
```

## 📁 Структура файлов переводов

```
/shared/locales/
  ├── en/
  │   ├── common.json      # Общие переводы
  │   ├── habits.json      # Переводы для привычек
  │   ├── validation.json  # Сообщения валидации
  │   └── stats.json       # Статистика
  └── ru/
      ├── common.json
      ├── habits.json
      ├── validation.json
      └── stats.json
```

## ✅ Правила использования

1. **Всегда используйте переводы** вместо хардкода текста
2. **Выбирайте правильный namespace** для контекста
3. **Добавляйте новые ключи** в оба языка (EN и RU)
4. **Используйте интерполяцию** для динамических значений
5. **Группируйте** связанные переводы в объекты (например, `app.language.en`)

## 🚫 Плохие примеры

```typescript
// ❌ ПЛОХО - хардкод текста
<button>Save</button>

// ❌ ПЛОХО - неправильный namespace
const { t } = useTranslation('habits');
t('common.save') // Ключ 'common.save' не существует в 'habits' namespace
```

## ✅ Хорошие примеры

```typescript
// ✅ ХОРОШО
const { t } = useTranslation('common');
<button>{t('common.save')}</button>

// ✅ ХОРОШО - правильный namespace
const { t: tCommon } = useTranslation('common');
const { t: tHabits } = useTranslation('habits');

<button>{tCommon('common.save')}</button>
<h1>{tHabits('habit.addHabit')}</h1>
```

## 🆕 Добавление новых переводов

1. Откройте соответствующий JSON файл (например, `/shared/locales/en/common.json`)
2. Добавьте новый ключ в нужное место
3. Добавьте перевод для всех поддерживаемых языков (EN + RU)

```json
// /shared/locales/en/common.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my new feature"
  }
}

// /shared/locales/ru/common.json
{
  "myFeature": {
    "title": "Моя функция",
    "description": "Это моя новая функция"
  }
}
```

## 🔄 Автоматическая синхронизация

- Язык автоматически сохраняется в **localStorage** через Zustand store
- При перезагрузке приложения восстанавливается последний выбранный язык
- i18next автоматически синхронизируется с store

## 🎨 Пример полного компонента

```typescript
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/features/language-switcher';

export function ExampleComponent() {
  const { t } = useTranslation('common');
  const { currentLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>Current language: {currentLanguage}</p>
      
      <button>{t('common.save')}</button>
      <button>{t('common.cancel')}</button>
    </div>
  );
}
```
