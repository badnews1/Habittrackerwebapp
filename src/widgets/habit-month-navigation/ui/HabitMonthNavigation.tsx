/**
 * Виджет навигации по месяцам
 * 
 * Отображает название текущего месяца, слоган и кнопку для открытия пикера месяца/года.
 * 
 * @module widgets/habit-month-navigation
 * @created 30 ноября 2025 - выделено из features/habit-calendar/CalendarHeader
 */

import { useHabitsStore } from '@/app/store';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from '@/shared/assets/icons/system';
import { useTranslation } from 'react-i18next';

export function HabitMonthNavigation() {
  const { t } = useTranslation('common');
  
  // Получаем данные из store
  const selectedMonth = useHabitsStore(state => state.selectedMonth);
  const openMonthYearPicker = useHabitsStore(state => state.openMonthYearPicker);

  const getMonthName = (month: number) => {
    const months = [
      t('months.full.january'),
      t('months.full.february'),
      t('months.full.march'),
      t('months.full.april'),
      t('months.full.may'),
      t('months.full.june'),
      t('months.full.july'),
      t('months.full.august'),
      t('months.full.september'),
      t('months.full.october'),
      t('months.full.november'),
      t('months.full.december'),
    ];
    return months[month];
  };

  return (
    <div className="flex-shrink-0 h-[86px] flex flex-col justify-end items-center relative" style={{ width: '262px', top: '-43px' }}>
      <Button 
        onClick={openMonthYearPicker}
        variant="ghost"
        className="text-text-primary hover:text-text-secondary p-0 h-auto"
      >
        <h1 className="text-[36px] text-text-primary">{getMonthName(selectedMonth).toUpperCase()}</h1>
      </Button>
      <div className="text-center text-[8px] text-text-secondary tracking-wider mb-1 whitespace-pre">
        —  S M A L L   S T E P S,   B I G   W I N S  —
      </div>
    </div>
  );
}