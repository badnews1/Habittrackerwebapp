import { Move, Close, ChevronDown, Delete } from '../icons';

interface Guide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
}

interface RulerControlsProps {
  showGrid: boolean;
  setShowGrid: (value: boolean | ((prev: boolean) => boolean)) => void;
  rulerMode: boolean;
  setRulerMode: (value: boolean) => void;
  guides: Guide[];
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
  draggingGuide: string | null;
  setDraggingGuide: (value: string | null) => void;
  addingGuideType: 'horizontal' | 'vertical' | null;
  setAddingGuideType: (value: 'horizontal' | 'vertical' | null | ((prev: 'horizontal' | 'vertical' | null) => 'horizontal' | 'vertical' | null)) => void;
  showGuidesList: boolean;
  setShowGuidesList: (value: boolean | ((prev: boolean) => boolean)) => void;
  rulerMenuPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  setRulerMenuPosition: (value: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => void;
}

export function RulerControls({
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
}: RulerControlsProps) {
  
  // Get position styles based on menu position
  const getPositionStyles = () => {
    const baseStyles = { position: 'fixed' as const };
    switch (rulerMenuPosition) {
      case 'top-left':
        return { ...baseStyles, left: '16px', top: '16px' };
      case 'top-right':
        return { ...baseStyles, right: '16px', top: '16px' };
      case 'bottom-left':
        return { ...baseStyles, left: '16px', bottom: '16px' };
      case 'bottom-right':
        return { ...baseStyles, right: '16px', bottom: '16px' };
    }
  };

  // Cycle through positions
  const cyclePosition = () => {
    const positions: Array<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'> = 
      ['top-left', 'bottom-left', 'top-right', 'bottom-right'];
    const currentIndex = positions.indexOf(rulerMenuPosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    setRulerMenuPosition(positions[nextIndex]);
  };

  return (
    <>
      {/* Modular Grid Overlay */}
      {showGrid && (
        <div 
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px'
          }}
        />
      )}

      {/* Adding Guide Overlay - moved BEFORE menu */}
      {addingGuideType && (
        <div 
          className="fixed inset-0 z-[75] cursor-crosshair"
          style={{
            background: 'rgba(59, 130, 246, 0.05)'
          }}
          onClick={(e) => {
            const position = addingGuideType === 'vertical' ? e.clientX : e.clientY;
            setGuides(prev => [...prev, {
              id: Date.now().toString(),
              type: addingGuideType,
              position
            }]);
            setAddingGuideType(null);
          }}
        >
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-none">
            <div style={{ fontSize: '14px', fontWeight: 600 }}>
              {addingGuideType === 'vertical' ? 'Размещение вертикальной направляющей' : 'Размещение горизонтальной направляющей'}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 400, marginTop: '4px', opacity: 0.9 }}>
              Кликните для установки
            </div>
          </div>
        </div>
      )}

      {/* Ruler Mode Menu - now AFTER overlay with higher z-index */}
      {rulerMode && (
        <div 
          className="z-[100] bg-white rounded-2xl border border-gray-200 shadow-xl p-3 w-[240px]"
          style={getPositionStyles()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Add guides section */}
          <div className={showGuidesList && guides.length > 0 ? "mb-3" : ""}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setAddingGuideType(prev => prev === 'vertical' ? null : 'vertical')}
                  className={`w-8 h-8 rounded-lg border transition-colors ${
                    addingGuideType === 'vertical' 
                      ? 'bg-blue-50 border-blue-500 text-blue-600' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className="w-px h-4 bg-blue-500"></div>
                  </div>
                </button>
                <button
                  onClick={() => setAddingGuideType(prev => prev === 'horizontal' ? null : 'horizontal')}
                  className={`w-8 h-8 rounded-lg border transition-colors ${
                    addingGuideType === 'horizontal' 
                      ? 'bg-blue-50 border-blue-500 text-blue-600' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className="h-px w-4 bg-blue-500"></div>
                  </div>
                </button>
                <button
                  onClick={() => setShowGrid(prev => !prev)}
                  className={`w-8 h-8 rounded-lg border transition-colors ${
                    showGrid 
                      ? 'bg-blue-50 border-blue-500 text-blue-600' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1 h-1 bg-blue-500"></div>
                      <div className="w-1 h-1 bg-blue-500"></div>
                      <div className="w-1 h-1 bg-blue-500"></div>
                      <div className="w-1 h-1 bg-blue-500"></div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setShowGuidesList(prev => !prev)}
                  className="w-8 h-8 rounded-lg border bg-gray-50 hover:bg-gray-100 border-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showGuidesList ? 'rotate-180' : ''}`} />
                  </div>
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={cyclePosition}
                  className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  title="Сменить позицию меню"
                >
                  <Move className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button
                  onClick={() => {
                    setAddingGuideType(null);
                    setRulerMode(false);
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Close className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Guides list */}
          {showGuidesList && guides.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-gray-500 uppercase tracking-wider" style={{ fontSize: '8px', fontWeight: 600 }}>
                  Активные ({guides.length})
                </div>
                <button
                  onClick={() => setGuides([])}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  style={{ fontSize: '10px', fontWeight: 500 }}
                >
                  Удалить все
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-1">
                {guides.map(guide => (
                  <div
                    key={guide.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      {guide.type === 'vertical' ? (
                        <div className="w-px h-4 bg-blue-500"></div>
                      ) : (
                        <div className="h-px w-4 bg-blue-500"></div>
                      )}
                    </div>
                    <input
                      type="number"
                      value={Math.round(guide.position)}
                      onChange={(e) => {
                        const newPos = Number(e.target.value);
                        if (!isNaN(newPos)) {
                          setGuides(prev => prev.map(g => 
                            g.id === guide.id ? { ...g, position: newPos } : g
                          ));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                      }}
                      className="flex-1 bg-transparent border-none outline-none text-gray-900"
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    />
                    <div className="text-gray-400" style={{ fontSize: '10px', fontWeight: 400 }}>
                      px
                    </div>
                    <button
                      onClick={() => setGuides(prev => prev.filter(g => g.id !== guide.id))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Delete className="w-3 h-3 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showGuidesList && guides.length === 0 && (
            <div className="text-center py-6 text-gray-400" style={{ fontSize: '11px', fontWeight: 400 }}>
              Нет направляющих
            </div>
          )}
        </div>
      )}

      {/* Guides Overlay */}
      {(showGrid || rulerMode) && guides.map(guide => (
        <div
          key={guide.id}
          className={rulerMode ? "fixed z-[55] cursor-move hover:opacity-80 transition-opacity" : "fixed z-[55]"}
          style={{
            ...(guide.type === 'horizontal' 
              ? { 
                  top: `${guide.position}px`, 
                  left: 0, 
                  right: 0, 
                  height: '1px',
                  background: '#3b82f6',
                  pointerEvents: rulerMode ? 'auto' : 'none'
                }
              : { 
                  left: `${guide.position}px`, 
                  top: 0, 
                  bottom: 0, 
                  width: '1px',
                  background: '#3b82f6',
                  pointerEvents: rulerMode ? 'auto' : 'none'
                }
            )
          }}
          onMouseDown={(e) => {
            if (rulerMode) {
              e.preventDefault();
              setDraggingGuide(guide.id);
            }
          }}
          onDoubleClick={() => {
            if (rulerMode) {
              setGuides(prev => prev.filter(g => g.id !== guide.id));
            }
          }}
        />
      ))}
    </>
  );
}
