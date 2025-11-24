# 🗂️ SectionPicker

Универсальный компонент для выбора раздела привычки.

## Использование

```tsx
import { SectionPicker } from '@/shared/components/section-picker';

<SectionPicker
  selectedSection={habit.section}
  onSelectSection={(section) => setHabit({ ...habit, section })}
  sections={store.sections}
  onAddSection={store.addSection}
  onDeleteSection={store.deleteSection}
  getSectionUsageCount={(name) => habits.filter(h => h.section === name).length}
  isOpen={isOpen}
  onToggle={() => setIsOpen(!isOpen)}
/>
```

## Props

- `selectedSection` — выбранный раздел
- `onSelectSection` — callback выбора
- `sections` — список разделов из store
- `onAddSection` — добавить новый раздел
- `onDeleteSection` — удалить раздел
- `getSectionUsageCount` — количество привычек в разделе
- `isOpen` — состояние dropdown
- `onToggle` — переключение dropdown

## Особенности

- **Единичный выбор** (radio-style)
- **Без ColorPicker** (только текст)
- **Защита от удаления** "Другие"
- **Валидация** (пустое название, дубликаты)
- **ConfirmDialog** при удалении
- **Keyboard navigation** (Enter, Escape)
- **Input Guards** - фокус не перескакивает при вводе

## Дата создания

24 ноября 2025
