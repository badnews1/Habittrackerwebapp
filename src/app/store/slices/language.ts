import { StateCreator } from 'zustand';
import type { AppStore } from '../types';

/**
 * Поддерживаемые языки приложения
 */
export type Language = 'en' | 'ru';

/**
 * Слайс для управления языком приложения
 */
export interface LanguageSlice {
  /** Текущий язык приложения */
  currentLanguage: Language;
  
  /** Установить язык */
  setLanguage: (language: Language) => void;
}

/**
 * Создание слайса управления языком
 */
export const createLanguageSlice: StateCreator<
  AppStore,
  [],
  [],
  LanguageSlice
> = (set) => ({
  // Состояние
  currentLanguage: 'en', // Английский по умолчанию
  
  // Действия
  setLanguage: (language) =>
    set(() => {
      // Сохраняем выбор в localStorage для персистентности
      localStorage.setItem('app-language', language);
      return { currentLanguage: language };
    }),
});