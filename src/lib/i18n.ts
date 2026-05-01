import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { englishTranslations } from '@/translations/english';
import { spanishTranslations } from '@/translations/spanish';
import { arabicTranslations } from '@/translations/arabic';
import { frenchTranslations } from '@/translations/french';
import { turkishTranslations } from '@/translations/turkish';
import { italianTranslations } from '@/translations/italian';

const resources = {
  en: { translation: englishTranslations },
  es: { translation: spanishTranslations },
  ar: { translation: arabicTranslations },
  fr: { translation: frenchTranslations },
  tr: { translation: turkishTranslations },
  it: { translation: italianTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'ar', 'fr', 'tr', 'it'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
