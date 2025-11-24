import { useEffect, RefObject } from 'react';

/**
 * Универсальный хук для определения кликов вне указанного элемента
 * 
 * @description
 * Позволяет закрывать выпадающие меню, модальные окна и другие элементы при клике снаружи.
 * Использует фазу захвата событий для надёжного определения клика вне элемента.
 * Поддерживает вложенные dropdown через систему уникальных ID (data-dropdown-id).
 * Игнорирует клики внутри модальных окон уровня dialog/nested (ConfirmDialog),
 * но НЕ игнорирует клики в основных модалах (level="modal").
 * 
 * @param ref - React ref элемента, за которым нужно следить
 * @param handler - Функция-обработчик, вызываемая при клике снаружи
 * @param enabled - Флаг активации хука (по умолчанию true)
 * 
 * @example
 * ```tsx
 * const MyDropdown = () => {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const dropdownRef = useRef<HTMLDivElement>(null);
 *   
 *   useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);
 *   
 *   return (
 *     <div ref={dropdownRef}>
 *       {isOpen && <div>Dropdown content</div>}
 *     </div>
 *   );
 * };
 * ```
 * 
 * @since 19 ноября 2024
 * @updated 21 ноября 2025 - мигрирован в /shared/hooks
 * @updated 23 ноября 2025 - добавлена поддержка вложенных dropdown через уникальные ID
 * @updated 23 ноября 2025 - добавлена умная логика игнорирования кликов в модалах по уровню
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Проверяем, что клик не по ref элементу
      if (ref.current && !ref.current.contains(target)) {
        const clickedElement = target as HTMLElement;
        
        // Игнорируем клики внутри модалов уровня dialog/nested (ConfirmDialog)
        // Но НЕ игнорируем клики в модалах уровня modal (основные формы)
        const clickedInsideModal = clickedElement.closest?.('[data-modal="true"]') as HTMLElement | null;
        if (clickedInsideModal) {
          const modalLevel = clickedInsideModal.getAttribute('data-modal-level');
          // Игнорируем только dialog и nested уровни
          if (modalLevel === 'dialog' || modalLevel === 'nested') {
            return;
          }
        }
        
        // Получаем ID нашего dropdown из data-dropdown-id
        const ourDropdownId = ref.current.getAttribute('data-dropdown-id');
        
        // Находим ближайший dropdown-content, если клик был внутри какого-то dropdown
        const clickedDropdownContent = clickedElement.closest?.('[data-dropdown-content]') as HTMLElement | null;
        
        if (clickedDropdownContent) {
          // Получаем ID кликнутого dropdown-content
          const clickedDropdownId = clickedDropdownContent.getAttribute('data-dropdown-id');
          
          // Если ID совпадают, это НАШЕ выпадающее меню - не закрываем
          if (clickedDropdownId === ourDropdownId) {
            return;
          }
          
          // Если ID разные, проверяем - не является ли кликнутый dropdown ВЛОЖЕННЫМ дочерним
          // Ищем триггер кликнутого dropdown в НАШЕМ dropdown-content (не в ref!)
          if (clickedDropdownId && ourDropdownId) {
            // Находим наш dropdown-content
            const ourDropdownContent = document.querySelector(`[data-dropdown-content][data-dropdown-id="${ourDropdownId}"]`);
            if (ourDropdownContent) {
              // Ищем триггер вложенного dropdown внутри нашего content
              const nestedTrigger = ourDropdownContent.querySelector(`[data-dropdown-id="${clickedDropdownId}"]`);
              if (nestedTrigger) {
                // Нашли триггер вложенного dropdown внутри нашего content - не закрываем
                return;
              }
            }
          }
          
          // Это другой dropdown (не вложенный) - закрываем
          handler();
        } else {
          // Клик был вне любого dropdown-content - закрываем
          handler();
        }
      }
    };

    // Используем фазу захвата для надёжного определения клика снаружи
    document.addEventListener('mousedown', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [ref, handler, enabled]);
}