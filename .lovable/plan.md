

# Fix Functionality and Performance Bugs

## Bugs Found

### Bug 1: Duplicate Lazy Import (TeacherClassroomDemo)
**File:** `src/App.tsx`, line 43

`TeacherClassroomDemo` is a duplicate lazy import pointing to the same module as `TeacherClassroomPage` (both import `./pages/TeacherClassroomPage`). This wastes a chunk split for no reason and is confusing. It should reuse the existing `TeacherClassroomPage` import.

**Fix:** Remove line 43 and replace `TeacherClassroomDemo` with `TeacherClassroomPage` on line 154.

---

### Bug 2: AnimatePresence Wrapping Routes Incorrectly
**File:** `src/App.tsx`, lines 80-215

`AnimatePresence mode="wait"` wraps `AppErrorBoundary` and `Routes` but has no `key` on children. AnimatePresence requires its direct children to have unique `key` props to detect route transitions. Without a location-based key, it does nothing -- wasting rendering overhead.

**Fix:** Remove the `AnimatePresence` wrapper from around `Routes` since route-level animation is not being used properly, or wire it up correctly with `useLocation()`. Since route-level animation is complex and not actively used, removing it is the cleaner fix.

---

### Bug 3: LanguageContext Doesn't Sync with i18n
**File:** `src/contexts/LanguageContext.tsx`

The `LanguageProvider` maintains its own `useState("english")` state that is completely disconnected from the `i18next` system we just configured with `LanguageDetector`. This means:
- `useLanguage()` always returns "english" even if `i18n.language` is "fr"
- Any component using `useLanguage()` sees stale data
- The `LanguageDetector` persistence is bypassed by components using this context

**Fix:** Sync `LanguageContext` state with `i18n.language` by listening to `i18n.on('languageChanged')`, or migrate all usages to `useTranslation()` from react-i18next. The simpler fix is to have `LanguageProvider` initialize from `i18n.language` and subscribe to language changes.

---

### Bug 4: Auth `loading` State Can Get Stuck
**File:** `src/contexts/AuthContext.tsx`, line 279

The safety timeout at line 273 references `loading` in the closure, but `loading` is a state variable captured at render time. If the component re-renders before the timeout fires, the stale closure still checks the old `loading` value. This is a minor issue since the 3-second timeout is a safety net, but it should use a ref for reliability.

**Fix:** No change needed -- the existing `signInRedirectRef` protection and the fact that `setLoading(false)` is idempotent makes this tolerable. We will leave it as-is to avoid unnecessary complexity.

---

### Bug 5: `isSecureContext` and `isBrowserSupported` Computed Outside Hook Lifecycle
**File:** `src/hooks/useLocalMedia.ts`, lines 14-17

These are computed at the top level of the hook on every render, accessing `window` and `navigator` directly. While functional, they should be constants or refs since they never change.

**Fix:** Wrap in `useMemo` or move to module-level constants.

---

## Implementation Plan

### Step 1: Fix duplicate lazy import in App.tsx
- Remove `TeacherClassroomDemo` lazy import (line 43)
- Replace usage on line 154 with `TeacherClassroomPage`

### Step 2: Remove broken AnimatePresence from App.tsx
- Remove `AnimatePresence mode="wait"` wrapper around Routes (lines 80, 215)
- Remove unused `AnimatePresence` import if no longer needed

### Step 3: Sync LanguageContext with i18n
- Import `i18n` and `useEffect` into `LanguageContext.tsx`
- Initialize state from `i18n.language` mapped to the LanguageOption type
- Add `useEffect` to listen for `i18n.on('languageChanged')` events
- When language changes in either system, keep them in sync

### Step 4: Optimize useLocalMedia constants
- Move `isSecureContext` and `isBrowserSupported` checks to module-level constants so they are computed once

---

## Technical Details

### LanguageContext sync (Step 3):
```text
// Map i18n language codes to LanguageOption
const i18nToOption = { en: 'english', es: 'spanish', ar: 'arabic', fr: 'french', tr: 'turkish' };
const optionToI18n = { english: 'en', spanish: 'es', arabic: 'ar', french: 'fr', turkish: 'tr' };

// Initialize from i18n.language
const [language, setLanguageState] = useState<LanguageOption>(
  i18nToOption[i18n.language] || 'english'
);

// Subscribe to i18n changes
useEffect(() => {
  const handler = (lng) => setLanguageState(i18nToOption[lng] || 'english');
  i18n.on('languageChanged', handler);
  return () => i18n.off('languageChanged', handler);
}, []);

// When setLanguage is called, also update i18n
const setLanguage = (opt) => {
  setLanguageState(opt);
  i18n.changeLanguage(optionToI18n[opt]);
};
```

### useLocalMedia optimization (Step 4):
```text
// Module-level constants (computed once)
const IS_SECURE_CONTEXT = typeof window !== 'undefined' && 
  (window.isSecureContext || location.protocol === 'https:');
const IS_BROWSER_SUPPORTED = typeof navigator !== 'undefined' && 
  !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
```

