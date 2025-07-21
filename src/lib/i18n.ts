
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
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
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

// Set document direction for RTL languages
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
