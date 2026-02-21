import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Returns the current language prefix for building localized links.
 * Usage: `const langPrefix = useLangPrefix(); navigate(`${langPrefix}/dashboard`);`
 */
export function useLangPrefix(): string {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  return `/${lang || i18n.language || 'en'}`;
}
