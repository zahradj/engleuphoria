

# Fix Remaining Functionality and Performance Bugs

## Bugs Found

### Bug 1: `clearAllCaches` Destroys User Preferences (Critical)
**File:** `src/utils/productionCleanup.ts` and `src/main.tsx`

The `clearAllCaches` function runs on every app start when the cache version changes. It wipes **all localStorage** except Supabase auth tokens. This destroys:
- `i18nextLng` -- the language persistence we just set up
- `theme-mode` -- the user's dark/light mode preference
- `cache_version` itself (temporarily, before being re-set after the async clear)

**Fix:** Add `i18nextLng` and `theme-mode` to the preserved keys list alongside auth tokens.

---

### Bug 2: Landing Page Shows Black Screen During Auth Load
**File:** `src/pages/LandingPage.tsx`, lines 26-28

The landing page returns `null` while `useAuth()` is loading. Since the page background is dark (`bg-[#09090B]`), users see a completely black screen for several seconds before any content appears. The landing page is public and doesn't need auth -- it only checks auth to redirect logged-in users.

**Fix:** Show the landing page content immediately and only redirect after auth finishes loading with a confirmed user. Move the auth redirect check below the main render, using a separate effect or deferred check.

---

### Bug 3: Unused `productionMonitor` Import
**File:** `src/main.tsx`, line 9

`productionMonitor` is imported but never referenced in code (only a console.log message mentions it by name string). This pulls an unnecessary module into the main bundle.

**Fix:** Remove the unused import. The monitor module self-registers on `window` if needed, or users can import it directly in the console.

---

## Implementation Plan

### Step 1: Fix `clearAllCaches` to preserve user preferences
**File:** `src/utils/productionCleanup.ts`
- Add `i18nextLng`, `theme-mode`, and `cache_version` to the preserved keys list
- Change from auth-only preservation to a general "user preferences" preservation approach

### Step 2: Fix black screen on landing page
**File:** `src/pages/LandingPage.tsx`
- Remove the `if (loading) return null` block
- Instead, conditionally render the redirect only when `!loading && user` is true
- The page content renders immediately while auth loads in the background

### Step 3: Remove unused import
**File:** `src/main.tsx`
- Remove `productionMonitor` import (line 9)

---

## Technical Details

### Step 1 -- Preserved keys:
```text
const preservedKeys = [
  'supabase.auth.token',
  'sb-auth-token',
  'i18nextLng',
  'theme-mode',
  'cache_version',
];
const keysToRemove = Object.keys(localStorage).filter(
  key => !preservedKeys.some(pk => key.includes(pk))
);
```

### Step 2 -- Landing page fix:
```text
export default function LandingPage() {
  const { user, loading } = useAuth();
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  // Redirect logged-in users (only after auth finishes loading)
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render landing page immediately -- no black screen
  return (
    <main className={...}>
      ...
    </main>
  );
}
```

