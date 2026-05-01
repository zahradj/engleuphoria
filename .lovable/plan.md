## Current State (already in place)

Good news — i18n infrastructure already exists, just incomplete:

- `src/lib/i18n.ts` — i18next + react-i18next + LanguageDetector configured
- `src/main.tsx` — already sets `document.documentElement.dir = 'rtl'` for Arabic on language change
- `src/components/common/LanguageSwitcher.tsx` — dropdown with all 6 flags exists (but lists Turkish without a translation file, and Italian is missing entirely)
- `src/translations/` — `english`, `spanish`, `arabic`, `french` exist; **`turkish` and `italian` are missing**
- Sidebar/header text (`StudioSidebar.tsx`, `StudioHeader.tsx`, `StudioMobileNav.tsx`) is **hardcoded** — not using `useTranslation` yet

## What to Build

### 1. Add the two missing languages
- Create `src/translations/turkish.ts` and `src/translations/italian.ts` (mirroring the existing english structure)
- Add an `italian` entry to `LanguageSwitcher` (Turkish is already listed)
- Register both in `src/lib/i18n.ts` resources map and in `src/translations/index.ts`

### 2. Create a shared `nav` namespace
Add a `nav` block to all 6 translation files with the keys the user listed:
```
nav: { dashboard, slide_studio, master_library, blueprint, logout, settings, language }
```
Translations for each language hand-authored (not machine output) for the ~7 nav strings.

### 3. Wire the Creator Studio chrome to `useTranslation`
Replace hardcoded labels in:
- `src/components/creator-studio/StudioSidebar.tsx` — nav items array + Logout button
- `src/components/creator-studio/StudioMobileNav.tsx` — same labels
- `src/components/creator-studio/StudioHeader.tsx` — header strings

Each becomes `t('nav.master_library')` etc.

### 4. Mount the LanguageSwitcher
Drop `<LanguageSwitcher />` into the **bottom of `StudioSidebar`** (above the Logout button) so it's visible across the entire Content Creator hub. Also confirm it's reachable from `StudioMobileNav`.

### 5. RTL polish for the Studio chrome
The global `dir="rtl"` flip already works (it's in `main.tsx`). To make the Studio sidebar mirror cleanly, swap a handful of directional Tailwind classes to logical ones in just the three chrome files above:
- `ml-*` → `ms-*`, `mr-*` → `me-*`
- `pl-*` → `ps-*`, `pr-*` → `pe-*`
- `left-*` → `start-*`, `right-*` → `end-*`
- `text-left` → `text-start`, `text-right` → `text-end`
- Flip chevron icons under `[dir="rtl"]` via a small CSS rule in `index.css`

Scope is intentionally limited to Sidebar / Header / MobileNav — a full-app RTL pass on every page is out of scope for this PoC.

### 6. Verify i18n init order
Confirm `src/lib/i18n.ts` is imported in `main.tsx` **before** `App` renders (it already is — just adding a sanity check during implementation).

## Out of scope (intentionally)

- Translating page bodies, lesson content, toasts, or admin panels — only the nav chrome is in scope per the prompt's "PoC" wording.
- I18nextProvider wrapping — `react-i18next` v12+ does **not** require it; the `i18n.use(initReactI18next)` call already binds it globally. I'll skip the redundant provider unless you specifically want one.

## Files to create
- `src/translations/turkish.ts`
- `src/translations/italian.ts`

## Files to edit
- `src/lib/i18n.ts` (register tr + it)
- `src/translations/index.ts` (export tr + it)
- `src/translations/english.ts`, `spanish.ts`, `arabic.ts`, `french.ts` (add `nav` block)
- `src/components/common/LanguageSwitcher.tsx` (add Italian)
- `src/components/creator-studio/StudioSidebar.tsx` (translate + mount switcher + logical classes)
- `src/components/creator-studio/StudioHeader.tsx` (translate + logical classes)
- `src/components/creator-studio/StudioMobileNav.tsx` (translate + logical classes)
- `src/index.css` (chevron flip rule for RTL)