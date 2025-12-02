/**
 * Прогресс-бар силы привычки с градиентом
 * 
 * UI-компонент для отображения силы привычки (EMA).
 * Использует плавный цветовой градиент от красного к зелёному.
 * 
 * @module entities/habit/ui/stats
 * @created 30 ноября 2025 - мигрировано из features/statistics
 * @refactored 1 декабря 2025 - адаптация к темной теме (градиенты оставлены без изменений)
 */

import React from 'react';
import { ProgressBar } from '@/shared/ui/progress-bar';

interface StrengthProgressBarProps {
  /** Значение силы привычки (0-100) */
  strength: number;
  /** Показывать ли текстовую подпись с процентами */
  showLabel?: boolean;
  /** Размер прогресс-бара */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Вычисляет цвет для заданного значения силы привычки
 * 
 * Использует плавный градиент:
 * - 0-25%: Красный → Оранжевый
 * - 25-50%: Оранжевый → Жёлтый
 * - 50-75%: Жёлтый → Светло-зелёный
 * - 75-100%: Светло-зелёный → Зелёный
 * 
 * @param value - Значение силы (0-100)
 * @returns RGB цвет в формате "rgb(r, g, b)"
 */
function getStrengthColor(value: number): string {
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
}

/**
 * Прогресс-бар для отображения силы привычки
 * 
 * @example
 * ```tsx
 * // С подписью
 * <StrengthProgressBar strength={75} showLabel />
 * 
 * // Без подписи, большой размер
 * <StrengthProgressBar strength={50} showLabel={false} size="lg" />
 * ```
 */
export const StrengthProgressBar: React.FC<StrengthProgressBarProps> = ({ 
  strength, 
  showLabel = true,
  size = 'md'
}) => {
  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-end" style={{ fontSize: '12px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>{strength}%</span>
        </div>
      )}
      
      <ProgressBar
        value={strength}
        size={size}
        variant="gradient"
        colorFunction={getStrengthColor}
        showBackgroundGradient
        gradientColors={{
          from: '#ef4444',
          via: '#eab308',
          to: '#22c55e'
        }}
        animationDuration={700}
        backgroundColor="var(--border-light)"
      />
    </div>
  );
};
