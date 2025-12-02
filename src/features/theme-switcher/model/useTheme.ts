/**
 * Feature: Theme Switcher
 * 
 * Zustand store для управления темой приложения (светлая/тёмная).
 * Тема сохраняется в localStorage и применяется через класс 'dark' на html элементе.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  /** Текущая тема */
  theme: Theme;
  /** Переключить тему на противоположную */
  toggleTheme: () => void;
  /** Установить конкретную тему */
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          applyTheme(newTheme);
          return { theme: newTheme };
        }),
      
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: 'habit-tracker-theme',
      // После загрузки из localStorage применяем тему
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

/**
 * Применяет тему к html элементу
 */
function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
