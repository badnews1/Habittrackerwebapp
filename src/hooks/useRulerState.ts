import { useState } from 'react';

type Guide = { id: string; type: 'horizontal' | 'vertical'; position: number };
type RulerMenuPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * Управление состоянием Ruler Mode (направляющие для разработки)
 */
export function useRulerState() {
  const [showGrid, setShowGrid] = useState(false);
  const [rulerMode, setRulerMode] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [draggingGuide, setDraggingGuide] = useState<string | null>(null);
  const [addingGuideType, setAddingGuideType] = useState<'horizontal' | 'vertical' | null>(null);
  const [showGuidesList, setShowGuidesList] = useState(false);
  const [rulerMenuPosition, setRulerMenuPosition] = useState<RulerMenuPosition>('top-right');

  return {
    showGrid,
    setShowGrid,
    rulerMode,
    setRulerMode,
    guides,
    setGuides,
    draggingGuide,
    setDraggingGuide,
    addingGuideType,
    setAddingGuideType,
    showGuidesList,
    setShowGuidesList,
    rulerMenuPosition,
    setRulerMenuPosition,
  };
}
