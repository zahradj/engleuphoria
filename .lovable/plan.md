

## Swap Logo by Light/Dark Mode + Remove White Background

### Problem
The auth page logo always uses `logo-dark.png` (black logo) with a white `bg-white` background behind it, regardless of the page's light/dark mode. The user wants:
- **Light mode** → black logo, no white background
- **Dark mode** → white logo, no white background

The user has uploaded both versions: `EnglEphoria_2.png` (black) and `EnglEphoria_in_white-2.png` (white).

### Plan

1. **Copy uploaded logos** to `src/assets/`:
   - `user-uploads://EnglEphoria_2.png` → `src/assets/logo-black.png`
   - `user-uploads://EnglEphoria_in_white-2.png` → `src/assets/logo-white.png`

2. **Update `AuthPageLayout.tsx`**:
   - Import both logos + `useThemeMode` hook
   - Use `resolvedTheme` to pick the correct logo: `resolvedTheme === 'dark' ? logoWhite : logoBlack`
   - Remove `bg-white dark:bg-white` from the `<img>` tag — make the background transparent

### Files Changed

| File | Action |
|---|---|
| `src/assets/logo-black.png` | Copy from uploads (black logo) |
| `src/assets/logo-white.png` | Copy from uploads (white logo) |
| `src/components/auth/AuthPageLayout.tsx` | Import both logos, swap based on `resolvedTheme`, remove white background |

