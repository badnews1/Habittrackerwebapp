import React from 'react';

interface StrengthProgressBarProps {
  strength: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StrengthProgressBar: React.FC<StrengthProgressBarProps> = ({ 
  strength, 
  showLabel = true,
  size = 'md'
}) => {
  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  // Вычисляет цвет для заданного значения силы привычки
  // Использует плавный градиент: Красный (0%) → Оранжевый (25%) → Жёлтый (50%) → Светло-зелёный (75%) → Зелёный (100%)
  function getStrengthColor(value: number): string {
    // Красный (0%) -> Оранжевый (25%) -> Жёлтый (50%) -> Светло-зелёный (75%) -> Зелёный (100%)
    if (value <= 25) {
      // Интерполяция от красного (239, 68, 68) к оранжевому (249, 115, 22)
      const ratio = value / 25;
      const r = Math.round(239 + (249 - 239) * ratio);
      const g = Math.round(68 + (115 - 68) * ratio);
      const b = Math.round(68 + (22 - 68) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (value <= 50) {
      // Интерполяция от оранжевого (249, 115, 22) к жёлтому (234, 179, 8)
      const ratio = (value - 25) / 25;
      const r = Math.round(249 + (234 - 249) * ratio);
      const g = Math.round(115 + (179 - 115) * ratio);
      const b = Math.round(22 + (8 - 22) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (value <= 75) {
      // Интерполяция от жёлтого (234, 179, 8) к светло-зелёному (34, 197, 94)
      const ratio = (value - 50) / 25;
      const r = Math.round(234 + (34 - 234) * ratio);
      const g = Math.round(179 + (197 - 179) * ratio);
      const b = Math.round(8 + (94 - 8) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Интерполяция от светло-зелёного (34, 197, 94) к зелёному (16, 185, 129)
      const ratio = (value - 75) / 25;
      const r = Math.round(34 + (16 - 34) * ratio);
      const g = Math.round(197 + (185 - 197) * ratio);
      const b = Math.round(94 + (129 - 94) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-end text-xs">
          <span className="text-gray-500">{strength}%</span>
        </div>
      )}
      
      <div className={`relative ${heightClass} bg-gray-100 rounded-full overflow-hidden`}>
        {/* Бледный градиент на фоне (показывает весь путь) */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20 rounded-full" />
        
        {/* Заполненная часть: один цвет из градиента */}
        <div
          className="relative h-full transition-all duration-700 ease-out rounded-full"
          style={{ 
            width: `${Math.min(100, Math.max(0, strength))}%`,
            backgroundColor: getStrengthColor(strength)
          }}
        />
      </div>
    </div>
  );
};
