import { useEffect, RefObject } from 'react';

/**
 * Универсальный хук для определения кликов вне указанного элемента
 * 
 * @description
 * Позволяет закрывать выпадающие меню, модальные окна и другие элементы при клике снаружи.
 * Использует фазу захвата событий для надёжного определения клика вне элемента.
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
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    // Используем фазу захвата для надёжного определения клика снаружи
    document.addEventListener('mousedown', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [ref, handler, enabled]);
}
