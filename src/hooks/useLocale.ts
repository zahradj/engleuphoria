import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Locale } from 'date-fns';
import { enUS, es, ar, fr, tr } from 'date-fns/locale';

const localeMap: Record<string, Locale> = {
  en: enUS,
  es: es,
  ar: ar,
  fr: fr,
  tr: tr,
};

/**
 * Returns the date-fns Locale object matching the current i18n language.
 * Use this with date-fns `format()` and react-day-picker's `locale` prop.
 */
export function useDateLocale() {
  const { i18n } = useTranslation();
  return useMemo(() => localeMap[i18n.language] || enUS, [i18n.language]);
}
