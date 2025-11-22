/**
 * VersionIndicator - индикатор версии приложения
 * 
 * @description
 * Показывает текущую версию приложения в нижнем левом углу экрана.
 * Компактный компонент с минималистичным дизайном.
 * 
 * Особенности:
 * - Фиксированная позиция (bottom-left)
 * - Моноширинный шрифт
 * - Светло-серый цвет для ненавязчивости
 * - Tooltip с подсказкой при наведении
 * - Высокий z-index для видимости
 * 
 * @since Ноябрь 2024
 * @updated 21 ноября 2025 - мигрирован в /shared/components
 */

import React from 'react';

export const VersionIndicator: React.FC = () => {
  const APP_VERSION = '1.2.4'; // Added color picker for categories
  
  return (
    <div 
      className="fixed bottom-2 left-2 text-[10px] text-gray-300 font-mono z-50"
      title="Версия приложения"
    >
      v{APP_VERSION}
    </div>
  );
};
