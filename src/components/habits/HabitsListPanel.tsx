/**
 * Панель списка привычек с кнопками управления
 * 
 * Мигрирован на Zustand - берет actions напрямую из store
 * 
 * @module components/habits/HabitsListPanel
 */

import React from 'react';
import { Plus, Settings } from '../icons';
import { Habit } from '../../types/habit';
import { DateConfig } from '../../types/habitsTableProps';
import { HabitRow } from './HabitRow';
import { useHabitsStore } from '../../stores/habitsStore';

interface HabitsListPanelProps {
  habits: Habit[];
  newlyAddedHabitId: string | null;
  onClearNewlyAdded: () => void;
  dateConfig: DateConfig;
}

export function HabitsListPanel({
  habits,
  newlyAddedHabitId,
  onClearNewlyAdded,
  dateConfig,
}: HabitsListPanelProps) {
  // Получаем actions из store
  const openAddHabitModal = useHabitsStore(state => state.openAddHabitModal);
  const openManageHabitsModal = useHabitsStore(state => state.openManageHabitsModal);
  const moveHabit = useHabitsStore(state => state.moveHabit);
  const updateHabit = useHabitsStore(state => state.updateHabit);

  const { selectedMonth, selectedYear } = dateConfig;

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 py-4 pl-4 pr-4 w-[262px]">
      {habits.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-8 text-center px-8">
            <p className="text-gray-400 mb-2 text-sm whitespace-nowrap">У вас пока нет привычек</p>
            <p className="text-gray-300 text-xs">Добавьте первую привычку, чтобы начать отслеживать прогресс</p>
          </div>
          <button
            onClick={openAddHabitModal}
            className="px-4 rounded-lg border border-dashed border-gray-300 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', paddingTop: '17.5px', paddingBottom: '17.5px' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Добавить привычку
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between" style={{ height: '24px', transform: 'translateY(5px)' }}>
            <div className="flex-1" />
            <span className="text-[11px] text-gray-900 tracking-wider uppercase" style={{ fontWeight: 600 }}>
              Ежедневные привычки
            </span>
            <div className="flex-1 flex justify-end">
            </div>
          </div>

          {/* Habit Names */}
          <div className="space-y-0.5">
            {habits.map((habit, index) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                index={index}
                onMoveHabit={moveHabit}
                onUpdateHabit={updateHabit}
                isNewlyAdded={habit.id === newlyAddedHabitId}
                onEditComplete={onClearNewlyAdded}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            ))}
          </div>

          {/* Separator */}
          <div className="my-2 border-t border-gray-200" />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={openAddHabitModal}
              className="flex-1 h-6 px-3 rounded-md border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
              title="Добавить привычку"
            >
              <Plus className="w-3.5 h-3.5" />
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Добавить привычку</span>
            </button>
            <button
              onClick={openManageHabitsModal}
              className="h-6 w-6 rounded-md border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all flex items-center justify-center"
              title="Настройки привычек"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
