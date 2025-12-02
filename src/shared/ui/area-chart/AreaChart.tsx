/**
 * Переиспользуемый компонент Area Chart
 * 
 * Универсальный график с градиентной заливкой для отображения
 * любых данных в виде Area Chart. Полностью настраиваемый и
 * не зависит от предметной области.
 * 
 * Особенности:
 * - Градиентная заливка под линией графика
 * - Настраиваемые цвета и высота
 * - Опциональный tooltip
 * - Оси скрыты для минималистичного дизайна
 * - Автоматическое добавление фиктивных точек по краям (опционально)
 * 
 * @module shared/ui
 * @created 30 ноября 2025
 */

import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export interface AreaChartDataPoint {
  /** Метка для оси X (день, дата и т.д.) */
  label: string | number;
  /** Значение для оси Y */
  value: number;
}

export interface AreaChartProps {
  /** Данные для отображения */
  data: AreaChartDataPoint[];
  /** Высота графика в пикселях */
  height?: number;
  /** Цвет линии и градиента (hex) */
  color?: string;
  /** Название значения для tooltip */
  valueLabel?: string;
  /** Показывать ли tooltip при наведении */
  showTooltip?: boolean;
  /** Добавлять ли фиктивные точки по краям для плавного отображения */
  addPaddingPoints?: boolean;
  /** ID для градиента (если нужно несколько графиков на странице) */
  gradientId?: string;
  /** Толщина линии */
  strokeWidth?: number;
  /** Прозрачность заливки градиента (0-1) */
  fillOpacity?: number;
}

/**
 * Area Chart с градиентной заливкой
 * 
 * Рендерит красивый график с настраиваемыми параметрами.
 * Можно использовать для любых временных рядов или последовательностей данных.
 * 
 * @example
 * ```tsx
 * <AreaChart
 *   data={[
 *     { label: 1, value: 5 },
 *     { label: 2, value: 8 },
 *     { label: 3, value: 6 },
 *   ]}
 *   height={200}
 *   color="#3b82f6"
 *   valueLabel="Выполнено"
 * />
 * ```
 */
export function AreaChart({
  data,
  height = 230,
  color = 'var(--accent-dark)',
  valueLabel = 'Значение',
  showTooltip = true,
  addPaddingPoints = true,
  gradientId = 'areaChartGradient',
  strokeWidth = 2,
  fillOpacity = 1,
}: AreaChartProps) {
  // Подготовка данных: добавление фиктивных точек по краям если нужно
  const chartData = (() => {
    if (!addPaddingPoints || data.length === 0) {
      return data;
    }

    const firstLabel = typeof data[0].label === 'number' ? data[0].label : 0;
    const lastLabel = typeof data[data.length - 1].label === 'number' 
      ? data[data.length - 1].label 
      : data.length;

    return [
      { 
        label: typeof firstLabel === 'number' ? firstLabel - 1 : 0, 
        value: data[0].value 
      },
      ...data,
      { 
        label: typeof lastLabel === 'number' ? lastLabel + 1 : data.length + 1, 
        value: data[data.length - 1].value 
      },
    ];
  })();

  return (
    <div 
      style={{ 
        width: '100%', 
        height: `${height}px`, 
        minHeight: `${height}px`, 
        minWidth: '200px',
      }}
    >
      <ResponsiveContainer width="100%" height={height} minHeight={height}>
        <RechartsAreaChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {/* Градиент для заливки */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="label" 
            hide={true}
            type="category"
            scale="point"
            padding={{ left: 0, right: 0 }}
          />
          <YAxis hide={true} />
          
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                fontSize: '11px',
              }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
            />
          )}
          
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={strokeWidth}
            fillOpacity={fillOpacity}
            fill={`url(#${gradientId})`}
            name={valueLabel}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}