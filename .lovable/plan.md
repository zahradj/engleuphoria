

# Fix Language Persistence

## What's Wrong
The `i18next-browser-languagedetector` plugin is missing. Without it, `lng: 'en'` in `i18n.ts` forces English on every page load, ignoring whatever language the user selected.

## Changes Required

### 1. Install dependency
Add `i18next-browser-languagedetector` to the project.

### 2. Update `src/lib/i18n.ts`
- Import and register `LanguageDetector` plugin (before `initReactI18next`)
- Remove `lng: 'en'` so the detector controls the initial language
- Keep `fallbackLng: 'en'` as the safety net
- Configure detection with `lookupLocalStorage: 'i18nextLng'`

```text
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)       // detect saved language
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',         // no more lng: 'en'
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
```

### 3. No changes needed to LanguageSwitcher
It already calls `i18n.changeLanguage()` which, with the detector plugin active, automatically saves to localStorage.

### 4. Publish
After the code change, click **Publish** (top-right) then **Update** to push all frontend changes live.

## Result
- Selected language persists across page navigation and browser refresh
- First-time visitors see their browser's language (if supported) or English
- No routing changes needed

