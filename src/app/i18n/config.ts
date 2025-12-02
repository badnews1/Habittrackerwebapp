import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Импорт переводов
import commonEn from '@/shared/locales/en/common';
import commonRu from '@/shared/locales/ru/common';
import habitsEn from '@/shared/locales/en/habits';
import habitsRu from '@/shared/locales/ru/habits';
import validationEn from '@/shared/locales/en/validation';
import validationRu from '@/shared/locales/ru/validation';
import statsEn from '@/shared/locales/en/stats';
import statsRu from '@/shared/locales/ru/stats';
import appEn from '@/shared/locales/en/app';
import appRu from '@/shared/locales/ru/app';
import uiEn from '@/shared/locales/en/ui';
import uiRu from '@/shared/locales/ru/ui';
import tagsEn from '@/shared/locales/en/tags';
import tagsRu from '@/shared/locales/ru/tags';
import sectionsEn from '@/shared/locales/en/sections';
import sectionsRu from '@/shared/locales/ru/sections';
import debugEn from '@/shared/locales/en/debug';
import debugRu from '@/shared/locales/ru/debug';
import unitsEn from '@/shared/locales/en/units';
import unitsRu from '@/shared/locales/ru/units';

/**
 * Конфигурация i18next для мультиязычности приложения
 * 
 * Поддерживаемые языки:
 * - en (English) - по умолчанию
 * - ru (Русский)
 */
i18n
  .use(initReactI18next) // Интеграция с React
  .init({
    resources: {
      en: {
        common: commonEn,
        habits: habitsEn,
        validation: validationEn,
        stats: statsEn,
        app: appEn,
        ui: uiEn,
        tags: tagsEn,
        sections: sectionsEn,
        debug: debugEn,
        units: unitsEn,
      },
      ru: {
        common: commonRu,
        habits: habitsRu,
        validation: validationRu,
        stats: statsRu,
        app: appRu,
        ui: uiRu,
        tags: tagsRu,
        sections: sectionsRu,
        debug: debugRu,
        units: unitsRu,
      },
    },
    lng: 'en', // Язык по умолчанию
    fallbackLng: 'en', // Fallback язык, если перевод не найден
    ns: ['common', 'habits', 'validation', 'stats', 'app', 'ui', 'tags', 'sections', 'debug', 'units'], // Namespaces
    defaultNS: 'common', // Namespace по умолчанию
    
    interpolation: {
      escapeValue: false, // React уже экранирует
    },
    
    react: {
      useSuspense: false, // Отключаем Suspense для простоты
    },
  });

export default i18n;