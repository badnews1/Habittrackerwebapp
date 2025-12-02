/**
 * Конфигурация роутинга приложения
 * 
 * Определяет все маршруты приложения:
 * - / - главная страница трекера привычек
 * - /manage - страница управления привычками
 * 
 * @module app/router
 * @created 1 декабря 2025
 * @updated 2 декабря 2025 - удалены демо-страницы
 */

import { Routes, Route } from 'react-router-dom';
import { HabitTrackerPage } from '@/pages/habit-tracker';
import { HabitManagePage } from '@/pages/habit-manage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HabitTrackerPage />} />
      <Route path="/manage" element={<HabitManagePage />} />
    </Routes>
  );
};
