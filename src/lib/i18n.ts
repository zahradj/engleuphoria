import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { englishTranslations } from '@/translations/english';
import { spanishTranslations } from '@/translations/spanish';
import { arabicTranslations } from '@/translations/arabic';
import { frenchTranslations } from '@/translations/french';

const resources = {
  en: {
    translation: englishTranslations,
  },
  es: {
    translation: spanishTranslations,
  },
  ar: {
    translation: arabicTranslations,
  },
  fr: {
    translation: frenchTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;