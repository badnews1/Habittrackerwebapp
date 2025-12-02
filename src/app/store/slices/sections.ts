/**
 * Slice для управления разделами привычек
 * 
 * Разделы позволяют организовать привычки по времени дня (morning, day, evening).
 * Дефолтный раздел "other" защищён от удаления.
 * 
 * @module app/store/slices/sections
 * @created 24 ноября 2025
 * @updated 2 декабря 2025 - миграция на Section[] с цветами
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import { StateCreator } from 'zustand';
import { HabitsState } from '../types';
import type { Section } from '@/entities/habit';
import type { ColorVariant } from '@/shared/constants/colors';

export interface SectionsSlice {
  /** Разделы с цветами */
  sections: Section[];
  
  /** Actions */
  addSection: (name: string, color: ColorVariant) => void;
  updateSectionColor: (name: string, color: ColorVariant) => void;
  deleteSection: (name: string) => void;
}

export const createSectionsSlice: StateCreator<
  HabitsState,
  [],
  [],
  SectionsSlice
> = (set) => ({
  // ⚠️ Не инициализируем здесь - инициализация происходит в initialState.ts
  // Это нужно чтобы избежать дублирования и конфликтов с persist middleware
  
  /**
   * Добавить новый раздел с цветом
   * Автоматически добавляется в конец списка (после дефолтных)
   */
  addSection: (name: string, color: ColorVariant) => {
    set((state) => {
      // Проверка на дубликат (case-insensitive, trim)
      const normalized = name.trim();
      const exists = state.sections.some(
        s => s.name.toLowerCase() === normalized.toLowerCase()
      );
      
      if (exists) {
        console.warn(`[Sections] Раздел "${name}" уже существует`);
        return state;
      }
      
      return {
        sections: [...state.sections, { name: normalized, color }],
      };
    });
  },
  
  /**
   * Обновить цвет раздела
   */
  updateSectionColor: (name: string, color: ColorVariant) => {
    set((state) => ({
      sections: state.sections.map(s =>
        s.name === name ? { ...s, color } : s
      ),
    }));
  },
  
  /**
   * Удалить раздел
   * 
   * - Защита: нельзя удалить "other"
   * - Все привычки из этого раздела переносятся в "other"
   */
  deleteSection: (name: string) => {
    set((state) => {
      // Защита от удаления "other"
      if (name === DEFAULT_SECTION) {
        console.warn('[Sections] Нельзя удалить раздел "other"');
        return state;
      }
      
      return {
        // Удалить раздел из списка
        sections: state.sections.filter(s => s.name !== name),
        
        // Переместить все привычки из этого раздела в "other"
        habits: state.habits.map(h => 
          h.section === name ? { ...h, section: DEFAULT_SECTION } : h
        ),
      };
    });
  },
});
