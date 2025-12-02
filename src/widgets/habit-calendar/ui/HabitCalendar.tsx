/**
 * Виджет календаря привычек
 * 
 * Композитный виджет, объединяющий:
 * - Список привычек (entity: HabitNameCell)
 * - Календарную сетку (feature: HabitCheckbox)
 * - Прогресс-бары (entity: HabitProgressCell)
 * 
 * С группировкой по разделам через вертикальные цветные полосы.
 * 
 * @module widgets/habit-calendar/ui/HabitCalendar
 * @created 2 декабря 2025 - рефакторинг из трёх отдельных компонентов
 */

import React from 'react';
import { Plus } from '@/shared/assets/icons/system';
import { 
  HabitNameCell,
  HabitProgressCell,
  groupHabitsBySection,
  getSectionOrder,
  getSectionColor,
  isHabitCompletedForDate,
  getMonthlyGoalFromFrequency,
  type Habit,
  type DateConfig,
  type Section,
} from '@/entities/habit';
import { useTranslatedSectionName } from '@/entities/section';
import { HabitCheckbox } from '@/features/habit-checkbox';
import { CalendarDayHeader } from '@/shared/ui/calendar-day-header';
import { useHabitsStore } from '@/app/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty';
import type { ColorVariant } from '@/shared/constants/colors';
import { useTranslation } from 'react-i18next';

interface HabitCalendarProps {
  /** Список привычек для отображения */
  habits: Habit[];
  /** Конфигурация даты с информацией о месяце */
  dateConfig: DateConfig;
  /** Callback при клике на иконку статистики */
  onStatsClick?: (habitId: string) => void;
}

/**
 * Виджет календаря привычек с группировкой по разделам
 * 
 * Структура:
 * 1. Заголовок с днями недели
 * 2. Группы привычек по разделам (вертикальная полоса слева)
 * 3. Каждая привычка: название + календарь + прогресс
 * 
 * Empty state: когда нет привычек - кнопка добавления
 */
export function HabitCalendar({
  habits,
  dateConfig,
  onStatsClick,
}: HabitCalendarProps) {
  const { monthDays, formatDate, getDayName, selectedMonth, selectedYear } = dateConfig;
  
  // Получаем actions и данные из store
  const toggleCompletion = useHabitsStore(state => state.toggleCompletion);
  const updateHabit = useHabitsStore(state => state.updateHabit);
  const openNumericInputModal = useHabitsStore(state => state.openNumericInputModal);
  const openAddHabitModal = useHabitsStore(state => state.openAddHabitModal);
  const sections = useHabitsStore(state => state.sections);
  
  // Группировка привычек по разделам
  const groupedHabits = React.useMemo(
    () => groupHabitsBySection(habits),
    [habits]
  );
  
  // Упорядоченные разделы (стандартные первыми, затем кастомные)
  const orderedSections = React.useMemo(
    () => getSectionOrder(Array.from(groupedHabits.keys()), sections),
    [groupedHabits, sections]
  );
  
  // Адаптивные размеры в зависимости от количества дней
  const daysCount = monthDays.length;
  const calendarGap = daysCount === 28 ? 'gap-[7px]' : daysCount === 29 ? 'gap-[6px]' : daysCount === 30 ? 'gap-[5px]' : 'gap-1';
  const progressWidth = daysCount === 28 ? '283px' : daysCount === 30 ? '279px' : '280px';
  const headerPadding = daysCount === 28 ? 'px-[18px]' : daysCount === 29 ? 'px-[17.5px]' : daysCount === 30 ? 'px-[17px]' : 'px-[16.5px]';

  const { t } = useTranslation();

  return (
    <Card>
      <div className="pl-2 pr-4 py-4">
        {habits.length === 0 ? (
          // Empty state
          <Empty>
            <EmptyHeader>
              <EmptyTitle>{t('habits:habit.noHabits')}</EmptyTitle>
              <EmptyDescription>
                {t('habits:habit.createFirstHabit')}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={openAddHabitModal}>
                <Plus className="w-3.5 h-3.5" />
                {t('habits:habit.addHabit')}
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <>
            {/* Заголовок с днями недели */}
            <div className="mb-4 flex items-center" style={{ height: '24px', transform: 'translateY(5px)' }}>
              {/* Название колонки */}
              <div className="w-[262px] flex-shrink-0 text-center">
                <span 
                  className="text-[11px] text-text-primary tracking-wider uppercase"
                  style={{ fontWeight: 600 }}
                >
                  {t('habits:habit.title')}
                </span>
              </div>
              
              {/* Календарный заголовок */}
              <div className={`flex-1 ${headerPadding}`}>
                <CalendarDayHeader
                  monthDays={monthDays}
                  getDayName={getDayName}
                />
              </div>
              
              {/* Заголовок прогресса */}
              <div 
                className="flex-shrink-0 text-center"
                style={{ width: progressWidth }}
              >
                <span 
                  className="tracking-wider uppercase"
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)' 
                  }}
                >
                  {t('stats:stats.monthProgressTitle')}
                </span>
              </div>
            </div>

            {/* Группы привычек по разделам */}
            <div className="space-y-4">
              {orderedSections.map((section) => {
                const sectionHabits = groupedHabits.get(section) || [];
                const sectionColor = getSectionColor(section, sections);
                
                return (
                  <SectionGroup
                    key={section}
                    section={section}
                    color={sectionColor}
                  >
                    <div className="space-y-0.5">
                      {sectionHabits.map((habit) => {
                        // Считаем прогресс для HabitProgressCell
                        const completedCount = monthDays.filter(dayData => 
                          isHabitCompletedForDate(habit, formatDate(dayData.date))
                        ).length;
                        
                        const goalValue = getMonthlyGoalFromFrequency(
                          habit.frequency, 
                          daysCount, 
                          selectedMonth, 
                          selectedYear
                        );
                        
                        return (
                          <div key={habit.id} className="flex items-center gap-0">
                            {/* 1. Название привычки (entity) */}
                            <HabitNameCell habit={habit} width="262px" />
                            
                            {/* 2. Календарные чекбоксы (feature) */}
                            <div className={`flex ${calendarGap} flex-1`}>
                              {monthDays.map((dayData, dayIndex) => {
                                const dateStr = formatDate(dayData.date);
                                return (
                                  <HabitCheckbox
                                    key={`${habit.id}-${dayIndex}`}
                                    habit={habit}
                                    dayData={dayData}
                                    dayIndex={dayIndex}
                                    dateStr={dateStr}
                                    onToggleCompletion={toggleCompletion}
                                    onUpdateHabit={updateHabit}
                                    onOpenNumericInput={openNumericInputModal}
                                  />
                                );
                              })}
                            </div>
                            
                            {/* 3. Прогресс-бар (entity) */}
                            <HabitProgressCell
                              habitId={habit.id}
                              completedCount={completedCount}
                              goalValue={goalValue}
                              width={progressWidth}
                              onStatsClick={onStatsClick}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </SectionGroup>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

/**
 * Компонент группы привычек с вертикальной полосой раздела
 * 
 * Локальный компонент виджета (не экспортируется)
 */
interface SectionGroupProps {
  section: string;
  color: ColorVariant;
  children: React.ReactNode;
}

function SectionGroup({ section, color, children }: SectionGroupProps) {
  const getTranslatedSectionName = useTranslatedSectionName();
  
  return (
    <div className="flex gap-0">
      {/* Вертикальная полоса с названием раздела */}
      <div className="flex-shrink-0 w-[32px] relative flex items-center">
        {/* Вертикальное название раздела (слева) */}
        <div className="flex-1 flex items-center justify-center h-full">
          <span 
            className="section-label writing-mode-vertical"
            style={{ 
              color: `var(--palette-${color}-bg)`,
              transform: 'rotate(180deg)',
            }}
          >
            {getTranslatedSectionName(section)}
          </span>
        </div>
        
        {/* Цветная полоса (справа) */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-[3px] rounded-l"
          style={{ backgroundColor: `var(--palette-${color}-bg)` }}
        />
      </div>

      {/* Список привычек раздела */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}