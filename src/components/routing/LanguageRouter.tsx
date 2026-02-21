import { useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGS = ['en', 'es', 'ar', 'fr', 'tr'];

/**
 * Reads /:lang from the URL, syncs it with i18next,
 * and renders child routes via <Outlet />.
 */
export function LanguageRouter() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // If lang param is invalid, redirect to the current i18n language
  useEffect(() => {
    if (lang && !SUPPORTED_LANGS.includes(lang)) {
      const currentLang = i18n.language || 'en';
      const rest = location.pathname.replace(`/${lang}`, '') || '/';
      navigate(`/${currentLang}${rest}${location.search}${location.hash}`, { replace: true });
    }
  }, [lang, i18n.language, location, navigate]);

  return <Outlet />;
}

/**
 * Redirects bare paths (e.g., "/" or "/login") to "/:lang/..." 
 * based on detected/stored i18n language.
 */
export function LanguageRedirect() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lang = SUPPORTED_LANGS.includes(i18n.language) ? i18n.language : 'en';
    const path = location.pathname === '/' ? '' : location.pathname;
    navigate(`/${lang}${path}${location.search}${location.hash}`, { replace: true });
  }, [i18n.language, location, navigate]);

  return null;
}
