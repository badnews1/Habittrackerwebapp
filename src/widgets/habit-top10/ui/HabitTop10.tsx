/**
 * Виджет топ-10 привычек по проценту выполнения
 * 
 * Отображает рейтинг привычек, отсортированных по проценту выполнения.
 * Обёртка над компонентом TopHabitsRanking из entities с полной структурой Card.
 * 
 * @module widgets/habit-top10
 * @created 30 ноября 2025 - выделено из features/statistics/StrengthChart
 * @updated 1 декабря 2025 - обёрнут в Card компонент
 * @refactored 2 декабря 2025 - добавлена структура CardHeader + CardContent
 */

import type { Habit, DateConfig } from '@/entities/habit';
import { TopHabitsRanking } from '@/entities/habit';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface HabitTop10Props {
  /** Список привычек для отображения рейтинга */
  habits: Habit[];
  /** Конфигурация дат (для расчёта процентов выполнения) */
  dateConfig: DateConfig;
}

/**
 * Виджет топ-10 привычек
 * 
 * Показывает рейтинг лучших привычек по проценту выполнения за месяц.
 * Делегирует логику расчёта компоненту TopHabitsRanking из entities,
 * сам отвечает только за структуру Card и отступы.
 */
export function HabitTop10({
  habits,
  dateConfig,
}: HabitTop10Props) {
  const { t } = useTranslation('stats');
  
  return (
    <Card>
      {/* Заголовок виджета */}
      <CardHeader className="text-center">
        <CardTitle 
          className="tracking-wider uppercase" 
          style={{ fontSize: '11px', fontWeight: 600 }}
        >
          {t('stats.top10Title')}
        </CardTitle>
      </CardHeader>
      
      {/* Список топ-10 привычек */}
      <CardContent>
        <TopHabitsRanking
          habits={habits}
          dateConfig={dateConfig}
        />
      </CardContent>
    </Card>
  );
}