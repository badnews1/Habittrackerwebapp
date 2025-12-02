/**
 * Страница управления привычками
 * 
 * Композиция виджетов для управления списком привычек.
 * Страница следует принципам FSD - тонкий слой композиции виджетов.
 * Header рендерится в App.tsx для единообразия всех страниц.
 * 
 * @module pages/habit-manage/ui/HabitManagePage
 * @created 1 декабря 2025
 */

import React from 'react';
import { HabitManageList } from '@/widgets/habit-manage-list';

export const HabitManagePage: React.FC = () => {
  return (
    <HabitManageList />
  );
};
