
import { ReactNode } from 'react';
import { LanguageOption, TranslationKey } from '../translations';

export type TranslationValues = {
  [key in TranslationKey]: string;
};

export type LanguageContextType = {
  language: LanguageOption;
  languageText: TranslationValues;
  setLanguage: (language: LanguageOption) => void;
};

export interface LanguageProviderProps {
  children: ReactNode;
}
