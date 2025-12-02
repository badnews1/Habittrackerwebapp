/**
 * Главный компонент приложения Habit Tracker
 * 
 * Мигрирован на Zustand для централизованного управления состоянием.
 * Все данные (привычки, категории, цели) и UI состояние теперь хранятся в store.
 * 
 * @module App
 * @see /app/store/index.ts
 */

import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '@/app/i18n'; // Инициализация i18n
import { AppRouter } from '@/app/router';
import { HabitsNotificationManager } from '@/features/habit-notifications';
import { NotificationPermissionBanner } from '@/features/notifications-permission';
import { AppModals } from '@/app/providers';
import type { DateConfig } from '@/entities/habit';
import { getDaysInMonth, formatDate, getLocalizedDayName } from '@/shared/lib/date';
import { useHabitsStore } from '@/app/store';
import { recalculateStrength } from '@/entities/habit/lib/strength/strengthCalculator';
import type { Habit, Tag } from '@/entities/habit';
import { AppSidebar } from '@/widgets/app-sidebar';
import { AppHeader } from '@/widgets/app-header';
import { CheckSquare, ArrowLeft, Plus, Settings } from '@/shared/assets/icons/system';
import { useTheme } from '@/features/theme-switcher';
import { useLanguage } from '@/features/language-switcher';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function App() {
  // ==================== I18N ====================
  const { t } = useTranslation('common');

  // ==================== THEME ====================
  // Инициализация темы из localStorage
  useTheme();

  // ==================== LANGUAGE ====================
  // Инициализация языка из store
  useLanguage();

  // ==================== ZUSTAND STORE ====================
  // Получаем все данные и actions из централизованного store
  const {
    // Данные
    habits,
    tags,
    
    // UI состояние
    selectedMonth,
    selectedYear,
    
    // Модальные окна
    numericInputModal,
    statsModal,
    isMonthYearPickerOpen,
    isAddHabitModalOpen,
    
    // Actions: UI
    setSelectedDate,
    
    // Actions: Модальные окна
    openAddHabitModal,
    closeAddHabitModal,
    openNumericInputModal,
    closeNumericInputModal,
    openStatsModal,
    closeStatsModal,
    openMonthYearPicker,
    closeMonthYearPicker,
    
    // Actions: Привычки
    addHabit,
    deleteHabit,
    updateHabit,
    toggleCompletion,
    
    // Actions: Теги
    addTag,
    deleteTag,
    updateTagColor,
    
    // Actions: Внутренние
    updateHabitsStrength,
  } = useHabitsStore();

  // ==================== EFFECTS ====================
  
  // Обновляем силу привычек при загрузке приложения (новый день)
  useEffect(() => {
    updateHabitsStrength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Только при монтировании

  // ==================== COMPUTED VALUES ====================
  
  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  // ==================== MODAL HANDLERS ====================
  
  // Обработчик сохранения числового значения для измеримой привычки
  const handleNumericInputSave = (habitId: string, date: string, value: number) => {
    const habit = habits.find(h => h.id === habitId);
    
    if (habit) {
      const newCompletions = { ...habit.completions };
      const newSkipped = { ...habit.skipped };
      
      newCompletions[date] = value;
      
      // Если привычка была заморожена на этот день, снимаем заморозку
      if (newSkipped[date]) {
        delete newSkipped[date];
      }
      
      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        skipped: newSkipped,
      };
      
      // Пересчитываем силу привычки с передачей даты изменения
      const habitWithStrength = recalculateStrength(updatedHabit, date);
      updateHabit(habitId, habitWithStrength);
    }
  };

  // Обработчик пропуска (skip) для измеримой привычки
  const handleNumericInputSkip = (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    
    if (habit) {
      const newCompletions = { ...habit.completions };
      const newSkipped = { ...habit.skipped };
      
      // Если уже был пропуск - удаляем, иначе добавляем
      if (newSkipped[date]) {
        delete newCompletions[date];
        delete newSkipped[date];
      } else {
        newCompletions[date] = 0;
        newSkipped[date] = true;
      }
      
      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        skipped: newSkipped,
      };
      
      // Пересчитываем силу привычки с передачей даты изменения
      const habitWithStrength = recalculateStrength(updatedHabit, date);
      updateHabit(habitId, habitWithStrength);
    }
  };

  // Обработчик выбора месяца/года
  const handleMonthYearSelect = (month: number, year: number) => {
    setSelectedDate(month, year);
    closeMonthYearPicker();
  };

  // ==================== GROUPED PROPS ====================
  
  // Group related props for HabitsTable
  const dateConfig: DateConfig = {
    selectedMonth,
    selectedYear,
    monthDays,
    formatDate,
    getDayName: (date: Date) => getLocalizedDayName(date, t), // Wrapper с передачей t
  };

  // ==================== RENDER ====================
  
  return (
    <BrowserRouter>
      <AppContent
        habits={habits}
        numericInputModal={numericInputModal}
        statsModal={statsModal}
        isMonthYearPickerOpen={isMonthYearPickerOpen}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        isAddHabitModalOpen={isAddHabitModalOpen}
        monthDays={monthDays}
        onNumericInputClose={closeNumericInputModal}
        onNumericInputSave={handleNumericInputSave}
        onNumericInputSkip={handleNumericInputSkip}
        onStatsClose={closeStatsModal}
        onMonthYearSelect={handleMonthYearSelect}
        onMonthYearClose={closeMonthYearPicker}
        onAddHabitClose={closeAddHabitModal}
        onAddHabit={addHabit}
      />
    </BrowserRouter>
  );
}

// Компонент контента для использования useLocation
function AppContent({
  habits,
  numericInputModal,
  statsModal,
  isMonthYearPickerOpen,
  selectedMonth,
  selectedYear,
  isAddHabitModalOpen,
  monthDays,
  onNumericInputClose,
  onNumericInputSave,
  onNumericInputSkip,
  onStatsClose,
  onMonthYearSelect,
  onMonthYearClose,
  onAddHabitClose,
  onAddHabit,
}: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { t: tHabits } = useTranslation('habits');
  const { t: tApp } = useTranslation('app');
  const isHomePage = location.pathname === '/';
  const isManagePage = location.pathname === '/manage';
  
  // Получаем openAddHabitModal из store для кнопки в хеддере
  const openAddHabitModal = useHabitsStore(state => state.openAddHabitModal);

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Notification Manager */}
      <HabitsNotificationManager habits={habits} />
      
      {/* Боковое меню */}
      <AppSidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-[50px] overflow-y-auto overflow-x-auto">
        {/* Header - единообразный для всех страниц */}
        {isHomePage && (
          <AppHeader
            leftElement={<CheckSquare className="w-5 h-5 text-text-primary" />}
            title={tApp('app.habitTracker')}
            rightElement={
              <div className="flex items-center gap-2">
                <Button
                  onClick={openAddHabitModal}
                  variant="default"
                  size="sm"
                  title={tHabits('habit.addHabit')}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    {tHabits('habit.addHabit')}
                  </span>
                </Button>
                <Button
                  onClick={() => navigate('/manage')}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-md"
                  title={t('navigation.manage')}
                >
                  <Settings className="w-3.5 h-3.5" />
                </Button>
              </div>
            }
          />
        )}
        
        {isManagePage && (
          <AppHeader
            leftElement={
              <button
                onClick={() => navigate('/')}
                className="p-1 hover:bg-bg-hover rounded-lg transition-colors"
                aria-label={t('common.back')}
              >
                <ArrowLeft className="w-4 h-4 text-text-secondary" />
              </button>
            }
            title={tHabits('manage.title')}
          />
        )}
        
        <div className="pl-5 pr-5 pb-12 pt-6">
          {/* Router */}
          <DndProvider backend={HTML5Backend}>
            <AppRouter />
          </DndProvider>
        </div>

        {/* All Modals */}
        <AppModals
          numericInputModal={numericInputModal}
          statsModal={statsModal}
          habits={habits}
          onNumericInputClose={onNumericInputClose}
          onNumericInputSave={onNumericInputSave}
          onNumericInputSkip={onNumericInputSkip}
          onStatsClose={onStatsClose}
          isMonthYearPickerOpen={isMonthYearPickerOpen}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthYearSelect={onMonthYearSelect}
          onMonthYearClose={onMonthYearClose}
          isAddHabitModalOpen={isAddHabitModalOpen}
          onAddHabitClose={onAddHabitClose}
          onAddHabit={onAddHabit}
          daysInMonth={monthDays.length}
        />
      </main>
      
      <NotificationPermissionBanner />
    </div>
  );
}