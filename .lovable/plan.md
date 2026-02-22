

# Sync All Missing Features Into Production

## Current Status

The preview environment already has the Spatial UI, Bento Grid, custom cursor, dark/light mode, purple auth orbs, and film grain working correctly. The likely issue is one of two things:

1. **Published site not updated** -- Frontend changes only go live when you click "Update" in the publish dialog (top-right corner). Backend changes (database, edge functions) deploy automatically, but UI changes do not.
2. **Language resets on navigation/refresh** -- The i18next language detector plugin was never installed, so selecting French or Arabic reverts to English when you navigate or refresh.

## What Needs To Be Done

### Step 1: Fix Language Persistence (the core missing feature)

Install and configure `i18next-browser-languagedetector` so that:
- Selected language is saved to localStorage
- On next visit, the saved language is automatically loaded
- Browser language is detected on first visit

Changes:
- **src/lib/i18n.ts**: Import and use the `LanguageDetector` plugin, configure detection order as `['localStorage', 'navigator']`
- **src/components/common/LanguageSwitcher.tsx**: Add localStorage save on language change (the detector handles this, but we ensure consistency)

### Step 2: Sync LanguageSwitcher with i18n properly

The `LanguageSwitcher` already calls `i18n.changeLanguage()` which is correct. With the detector plugin, localStorage persistence will happen automatically.

### Step 3: Publish the Frontend

After the code fix, you need to click the **Publish** button (top-right) and then **Update** to push all accumulated UI changes to the live site at engleuphoria.lovable.app.

---

## Technical Details

**i18n.ts change:**
```text
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)    // <-- add this line
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',      // remove "lng: 'en'" so detector takes priority
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
```

**New dependency:** `i18next-browser-languagedetector`

No URL-based routing changes (the simpler localStorage approach is sufficient and avoids a large routing refactor).

