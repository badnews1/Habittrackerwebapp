/**
 * Переиспользуемый компонент Line Chart
 * 
 * Универсальный линейный график для отображения любых временных рядов
 * или последовательностей данных. Полностью настраиваемый и не зависит
 * от предметной области.
 * 
 * Особенности:
 * - Линейный график с опциональной сеткой
 * - Настраиваемые оси с метками
 * - Настраиваемые цвета и высота
 * - Опциональный tooltip
 * - Скрытые точки с activeDot при наведении
 * - Настраиваемый domain для оси Y
 * 
 * @module shared/ui
 * @created 30 ноября 2025
 */

import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export interface LineChartDataPoint {
  /** Метка для оси X (день, дата и т.д.) */
  label: string | number;
  /** Значение для оси Y */
  value: number;
}

export interface LineChartProps {
  /** Данные для отображения */
  data: LineChartDataPoint[];
  /** Высота графика в пикселях */
  height?: number;
  /** Цвет линии (hex или rgb) */
  color?: string;
  /** Название значения для tooltip */
  valueLabel?: string;
  /** Метка для оси Y */
  yAxisLabel?: string;
  /** Показывать ли сетку */
  showGrid?: boolean;
  /** Диапазон значений оси Y [min, max] */
  domain?: [number, number];
  /** Показывать ли tooltip при наведении */
  showTooltip?: boolean;
  /** Толщина линии */
  strokeWidth?: number;
  /** Показывать ли точки на линии */
  showDots?: boolean;
  /** Кастомный форматтер для значения в tooltip */
  tooltipFormatter?: (value: number) => [string, string];
  /** Кастомный форматтер для метки в tooltip */
  labelFormatter?: (label: string) => string;
  /** Отступы графика */
  margin?: { top?: number; right?: number; left?: number; bottom?: number };
}

/**
 * Line Chart с настраиваемыми параметрами
 * 
 * Рендерит красивый линейный график с возможностью детальной настройки.
 * Можно использовать для любых временных рядов или последовательностей данных.
 * 
 * @example
 * ```tsx
 * <LineChart
 *   data={[
 *     { label: '1 янв', value: 45 },
 *     { label: '2 янв', value: 52 },
 *     { label: '3 янв', value: 68 },
 *   ]}
 *   height={200}
 *   color="#3b82f6"
 *   valueLabel="Продажи"
 *   yAxisLabel="₽"
 *   showGrid={true}
 * />
 * ```
 */
export function LineChart({
  data,
  height = 192,
  color = '#3b82f6',
  valueLabel = 'Value',
  yAxisLabel = '',
  showGrid = true,
  domain,
  showTooltip = true,
  strokeWidth = 2,
  showDots = false,
  tooltipFormatter,
  labelFormatter,
  margin = { top: 5, right: 10, left: -20, bottom: 5 },
}: LineChartProps) {
  // Дефолтный форматтер для tooltip
  const defaultTooltipFormatter = (value: number): [string, string] => {
    return [`${value}${yAxisLabel}`, valueLabel];
  };

  // Дефолтный форматтер для метки (без перевода, так как это дефолт)
  const defaultLabelFormatter = (label: string): string => {
    return label;
  };

  return (
    <div 
      style={{ 
        width: '100%', 
        height: `${height}px`, 
        minHeight: `${height}px`, 
        minWidth: '100px' 
      }}
    >
      <ResponsiveContainer width="100%" height={height} minHeight={height}>
        <RechartsLineChart data={data} margin={margin}>
          {/* Сетка */}
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          )}
          
          {/* Ось X */}
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          
          {/* Ось Y */}
          <YAxis 
            domain={domain}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            tickLine={{ stroke: '#e5e7eb' }}
            label={yAxisLabel ? { 
              value: yAxisLabel, 
              position: 'insideLeft', 
              style: { fontSize: 11, fill: '#9ca3af' } 
            } : undefined}
          />
          
          {/* Tooltip */}
          {showTooltip && (
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px' 
              }}
              formatter={tooltipFormatter || defaultTooltipFormatter}
              labelFormatter={labelFormatter || defaultLabelFormatter}
            />
          )}
          
          {/* Линия */}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={strokeWidth}
            dot={showDots}
            activeDot={{ r: 4, fill: color }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
