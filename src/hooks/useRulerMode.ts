import { useEffect } from 'react';

type Guide = { id: string; type: 'horizontal' | 'vertical'; position: number };

/**
 * Комплексный хук для управления Ruler Mode (направляющие и клавиатура)
 */
export function useRulerMode(
  draggingGuide: string | null,
  setDraggingGuide: (value: string | null) => void,
  setAddingGuideType: (type: 'horizontal' | 'vertical' | null) => void,
  setRulerMode: (value: boolean | ((prev: boolean) => boolean)) => void,
  setGuides: (guides: Guide[] | ((prev: Guide[]) => Guide[])) => void
) {
  // Keyboard shortcut (R key)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        setAddingGuideType(null);
        setRulerMode(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setAddingGuideType, setRulerMode]);

  // Guide dragging
  useEffect(() => {
    if (!draggingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      setGuides(prev => prev.map(guide => {
        if (guide.id === draggingGuide) {
          return {
            ...guide,
            position: guide.type === 'horizontal' ? e.clientY : e.clientX
          };
        }
        return guide;
      }));
    };

    const handleMouseUp = () => {
      setDraggingGuide(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingGuide, setGuides, setDraggingGuide]);
}
