/**
 * Slice для управления разделами привычек
 * 
 * Разделы позволяют организовать привычки по времени дня (Утро, День, Вечер).
 * Дефолтный раздел "Другие" защищён от удаления.
 * 
 * @module core/store/slices/sections
 * @created 24 ноября 2025
 */

import { StateCreator } from 'zustand';
import { HabitsState } from '../types';

export interface SectionsSlice {
  /** Разделы */
  sections: string[];
  
  /** Actions */
  addSection: (name: string) => void;
  deleteSection: (name: string) => void;
}

export const createSectionsSlice: StateCreator<
  HabitsState,
  [],
  [],
  SectionsSlice
> = (set) => ({
  sections: ['Другие', 'Утро', 'День', 'Вечер'],
  
  /**
   * Добавить новый раздел
   * Автоматически добавляется в конец списка (после дефолтных)
   */
  addSection: (name: string) => {
    set((state) => {
      // Проверка на дубликат (case-insensitive, trim)
      const normalized = name.trim();
      const exists = state.sections.some(
        s => s.toLowerCase() === normalized.toLowerCase()
      );
      
      if (exists) {
        console.warn(`[Sections] Раздел "${name}" уже существует`);
        return state;
      }
      
      return {
        sections: [...state.sections, normalized],
      };
    });
  },
  
  /**
   * Удалить раздел
   * 
   * - Защита: нельзя удалить "Другие"
   * - Все привычки из этого раздела переносятся в "Другие"
   */
  deleteSection: (name: string) => {
    set((state) => {
      // Защита от удаления "Другие"
      if (name === 'Другие') {
        console.warn('[Sections] Нельзя удалить раздел "Другие"');
        return state;
      }
      
      return {
        // Удалить раздел из списка
        sections: state.sections.filter(s => s !== name),
        
        // Переместить все привычки из этого раздела в "Другие"
        habits: state.habits.map(h => 
          h.section === name ? { ...h, section: 'Другие' } : h
        ),
      };
    });
  },
});
