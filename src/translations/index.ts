
import { englishTranslations } from './english';
import { spanishTranslations } from './spanish';
import { arabicTranslations } from './arabic';
import { frenchTranslations } from './french';

export type TranslationKey = keyof typeof englishTranslations;

export const translations = {
  english: englishTranslations,
  spanish: spanishTranslations,
  arabic: arabicTranslations,
  french: frenchTranslations
};

export type LanguageOption = keyof typeof translations;
