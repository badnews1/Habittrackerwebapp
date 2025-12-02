import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHabitsStore } from '@/app/store';
import type { Language } from '@/app/store/slices/language';

/**
 * Хук для работы с языком приложения
 * 
 * Синхронизирует язык между:
 * - Zustand store (источник истины)
 * - i18next (для переводов)
 * - localStorage (персистентность)
 * 
 * @returns Объект с текущим языком и функцией переключения
 */
export function useLanguage() {
  const { i18n } = useTranslation();
  const currentLanguage = useHabitsStore((state) => state.currentLanguage);
  const setLanguage = useHabitsStore((state) => state.setLanguage);

  // Синхронизируем i18next с store при монтировании
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  /**
   * Переключение языка
   */
  const toggleLanguage = () => {
    const newLanguage: Language = currentLanguage === 'en' ? 'ru' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  /**
   * Установка конкретного языка
   */
  const changeLanguage = (language: Language) => {
    setLanguage(language);
    i18n.changeLanguage(language);
  };

  return {
    currentLanguage,
    toggleLanguage,
    changeLanguage,
  };
}
