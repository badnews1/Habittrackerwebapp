import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Импорт переводов через Public API (barrel export)
import {
  commonEn,
  habitsEn,
  validationEn,
  statsEn,
  appEn,
  uiEn,
  tagsEn,
  sectionsEn,
  unitsEn,
  iconsEn,
  commonRu,
  habitsRu,
  validationRu,
  statsRu,
  appRu,
  uiRu,
  tagsRu,
  sectionsRu,
  unitsRu,
  iconsRu,
} from '@/shared/locales';

/**
 * Конфигурация i18next для мультиязычности приложения
 * 
 * Поддерживаемые языки:
 * - en (English) - по умолчанию
 * - ru (Русский)
 * 
 * Namespaces:
 * - common: Общие переводы (кнопки, действия, plurals для единиц)
 * - habits: Переводы связанные с привычками
 * - validation: Сообщения валидации форм
 * - stats: Статистика и аналитика
 * - app: Общие элементы приложения (навигация, заголовки)
 * - ui: UI компоненты
 * - tags: Теги и метки
 * - sections: Секции и разделы
 * - units: Единицы измерения и их категории
 * - icons: Названия иконок
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
        units: unitsEn,
        icons: iconsEn,
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
        units: unitsRu,
        icons: iconsRu,
      },
    },
    lng: 'en', // Язык по умолчанию
    fallbackLng: 'en', // Fallback язык, если перевод не найден
    ns: ['common', 'habits', 'validation', 'stats', 'app', 'ui', 'tags', 'sections', 'units', 'icons'], // Namespaces
    defaultNS: 'common', // Namespace по умолчанию
    
    interpolation: {
      escapeValue: false, // React уже экранирует
    },
    
    react: {
      useSuspense: false, // Отключаем Suspense для простоты
    },
  });

export default i18n;