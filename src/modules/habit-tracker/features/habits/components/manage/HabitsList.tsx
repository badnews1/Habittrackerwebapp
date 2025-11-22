/**
 * Список привычек для модального окна управления
 * 
 * Функционал:
 * - Рендеринг отфильтрованных привычек
 * - Передача всех handlers в HabitItem
 * - Scroll container для длинных списков
 * 
 * Оптимизация: React.memo для предотвращения лишних ререндеров
 * 
 * @module modules/habit-tracker/features/habits/components/manage/HabitsList
 * @migrated 22 ноября 2025
 */

import React from 'react';
import { HabitItem } from './HabitItem';
import type { Habit, HabitType, FrequencyConfig, Reminder, MeasurableSettings } from '../../types';

interface HabitsListProps {
  filteredHabits: Habit[];
  localHabits: Habit[];
  expandedHabitId: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  monthYearKey: string;
  // Handlers для HabitItem
  onUpdateName: (id: string, name: string) => void;
  onUpdateDescription: (id: string, description: string) => void;
  onUpdateIcon: (id: string, icon: string) => void;
  onUpdateCategory: (id: string, category: string) => void;
  onUpdateReminders: (id: string, reminders: Reminder[]) => void;
  onUpdateType: (id: string, type: HabitType) => void;
  onUpdateFrequency: (id: string, frequency: FrequencyConfig) => void;
  onUpdateMeasurableSettings: (id: string, settings: MeasurableSettings) => void;
  onDeleteClick: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onToggleExpand: (id: string) => void;
}

export const HabitsList: React.FC<HabitsListProps> = React.memo(({
  filteredHabits,
  localHabits,
  expandedHabitId,
  scrollContainerRef,
  monthYearKey,
  onUpdateName,
  onUpdateDescription,
  onUpdateIcon,
  onUpdateCategory,
  onUpdateReminders,
  onUpdateType,
  onUpdateFrequency,
  onUpdateMeasurableSettings,
  onDeleteClick,
  onMove,
  onToggleExpand,
}) => {
  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6">
      <div className="space-y-3">
        {filteredHabits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            index={localHabits.findIndex(h => h.id === habit.id)}
            onUpdateName={(id, name) => onUpdateName(id, name)}
            onUpdateDescription={(id, description) => onUpdateDescription(id, description)}
            onUpdateIcon={(id, icon) => onUpdateIcon(id, icon)}
            onUpdateCategory={(id, category) => onUpdateCategory(id, category)}
            onUpdateReminders={(id, reminders) => onUpdateReminders(id, reminders)}
            onUpdateType={(id, type) => onUpdateType(id, type)}
            onUpdateFrequency={(id, frequency) => onUpdateFrequency(id, frequency)}
            onUpdateMeasurableSettings={(id, settings) => onUpdateMeasurableSettings(id, settings)}
            onDelete={(id) => onDeleteClick(id)}
            onMove={onMove}
            isExpanded={expandedHabitId === habit.id}
            onToggleExpand={() => onToggleExpand(habit.id)}
            monthYearKey={monthYearKey}
            scrollContainerRef={scrollContainerRef}
          />
        ))}
      </div>
    </div>
  );
});

HabitsList.displayName = 'HabitsList';
