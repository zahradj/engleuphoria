import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Drop-in replacement for `useNavigate` that auto-prefixes the current language.
 * 
 * Usage:
 * ```ts
 * const navigate = useLocalizedNavigate();
 * navigate('/dashboard'); // becomes /en/dashboard (or /fr/dashboard, etc.)
 * ```
 * 
 * Pass `{ raw: true }` as second argument to skip prefixing (for external URLs).
 */
export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  return useCallback(
    (to: string | number, options?: { replace?: boolean; state?: unknown; raw?: boolean }) => {
      if (typeof to === 'number') {
        navigate(to);
        return;
      }

      const { raw, ...navOptions } = options || {};

      // Only prefix absolute paths that don't already have a lang prefix
      if (!raw && to.startsWith('/')) {
        const currentLang = lang || i18n.language || 'en';
        const langPrefixPattern = /^\/(en|es|ar|fr|tr)(\/|$)/;
        if (!langPrefixPattern.test(to)) {
          navigate(`/${currentLang}${to}`, navOptions);
          return;
        }
      }

      navigate(to, navOptions);
    },
    [navigate, lang, i18n.language]
  );
}
