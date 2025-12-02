/**
 * Виджет месячной статистики привычек
 * 
 * Отображает детальную статистику за месяц с круговой диаграммой
 * и подключением к глобальному состоянию.
 * 
 * @module widgets/habit-monthly-stats
 * @created 1 декабря 2025
 * @updated 1 декабря 2025 - обёрнут в Card компонент
 * @refactored 2 декабря 2025 - добавлена структура CardHeader + CardContent + кнопка
 */

import { useHabitsStore } from '@/app/store';
import { getDaysInMonth, formatDate } from '@/shared/lib/date';
import { MonthlyStats } from '@/entities/habit';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function HabitMonthlyStats() {
  const { t } = useTranslation('stats');
  
  // Получаем данные из store
  const habits = useHabitsStore(state => state.habits);
  const selectedMonth = useHabitsStore(state => state.selectedMonth);
  const selectedYear = useHabitsStore(state => state.selectedYear);

  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  // Обработчик клика по кнопке "Детальная статистика"
  const handleDetailsClick = () => {
    console.log('Открытие детальной статистики');
    // TODO: Здесь будет логика открытия модального окна или перехода на страницу детальной статистики
  };

  return (
    <Card>
      {/* Заголовок виджета */}
      <CardHeader className="text-center">
        <CardTitle 
          className="tracking-wider uppercase" 
          style={{ fontSize: '11px', fontWeight: 600 }}
        >
          {t('stats.monthlyTitle')}
        </CardTitle>
      </CardHeader>

      {/* Круговая диаграмма и текст */}
      <CardContent>
        <MonthlyStats
          habits={habits}
          dateConfig={{
            monthDays,
            formatDate,
            selectedMonth,
            selectedYear,
          }}
        />
      </CardContent>

      {/* Кнопка "Детальная статистика" */}
      <div className="flex justify-center pb-6">
        <Button onClick={handleDetailsClick}>
          {t('stats.detailedStats')}
        </Button>
      </div>
    </Card>
  );
}