# 🖱️ /shared/hooks/use-click-outside

> **Назначение:** Обнаружение кликов вне элемента  
> **Статус:** ✅ Мигрировано (21 ноября 2025)  
> **Последнее обновление:** 21 ноября 2025

---

## 📦 Содержимое

### `useClickOutside.ts`
Универсальный React хук для определения кликов вне указанного элемента.

**Параметры:**
- `ref: RefObject<HTMLElement>` - React ref элемента, за которым нужно следить
- `handler: () => void` - Функция-обработчик, вызываемая при клике снаружи
- `enabled?: boolean` - Флаг активации хука (по умолчанию: `true`)

**Особенности:**
- ✅ Использует фазу захвата событий (`capture: true`) для надёжного определения
- ✅ Поддерживает включение/отключение через параметр `enabled`
- ✅ Автоматическая очистка обработчиков при размонтировании
- ✅ TypeScript типизация

---

## 💡 Использование

### Базовый пример - Закрытие dropdown

```typescript
import { useRef, useState } from 'react';
import { useClickOutside } from '@/shared/hooks/use-click-outside';

const MyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Закрывать dropdown при клике снаружи
  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div className="dropdown-content">
          Dropdown content
        </div>
      )}
    </div>
  );
};
```

### С условной активацией

```typescript
import { useRef, useState } from 'react';
import { useClickOutside } from '@/shared/hooks/use-click-outside';

const ConditionalDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Закрывать только если не "закреплён"
  useClickOutside(
    dropdownRef,
    () => setIsOpen(false),
    isOpen && !isPinned // enabled только если открыт и не закреплён
  );
  
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      <button onClick={() => setIsPinned(!isPinned)}>
        {isPinned ? 'Unpin' : 'Pin'}
      </button>
      {isOpen && <div>Content</div>}
    </div>
  );
};
```

### Модальное окно

```typescript
import { useRef } from 'react';
import { useClickOutside } from '@/shared/hooks/use-click-outside';

const Modal = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Закрывать модалку при клике на backdrop
  useClickOutside(modalRef, onClose, isOpen);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-backdrop">
      <div ref={modalRef} className="modal-content">
        <h2>Modal Title</h2>
        <p>Modal content</p>
      </div>
    </div>
  );
};
```

---

## 📥 История миграции

- **Откуда:** `/hooks/useClickOutside.ts`
- **Когда:** 21 ноября 2025
- **Обновлено импортов:** 2 файла
  1. `/components/shared/filters/HabitsFilterDropdown.tsx`
  2. `/hooks/useDropdown.ts`

---

## ✅ Преимущества

- ✅ Универсальная логика для всех dropdown/modal компонентов
- ✅ Надёжное определение через capture phase
- ✅ Гибкое управление через параметр `enabled`
- ✅ Типобезопасность через TypeScript
- ✅ Автоматическая очистка обработчиков
- ✅ Минимальный overhead - только один слушатель событий

---

## 🔄 Связанные хуки

- `/shared/hooks/use-dropdown/` - использует этот хук для закрытия dropdown
- `/hooks/useHabitsFilter.ts` - использует через HabitsFilterDropdown

---

## ⚠️ Важные детали

### Почему capture phase?

Используется `{ capture: true }` для надёжного определения кликов:
- ✅ Срабатывает раньше bubble phase
- ✅ Корректно работает с `stopPropagation()`
- ✅ Предотвращает конфликты с другими обработчиками

### Зависимости в useEffect

Хук корректно обрабатывает изменения `ref`, `handler` и `enabled`:
- При изменении `handler` - переподписывается на события
- При изменении `enabled` - включает/отключает слушатель
- При изменении `ref` - следит за новым элементом
