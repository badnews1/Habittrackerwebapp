import { useEffect, RefObject } from 'react';

/**
 * Хук для определения кликов вне указанного элемента
 * Позволяет закрывать выпадающие меню и модальные окна при клике снаружи
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