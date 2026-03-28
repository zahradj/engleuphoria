

## Apply Theme-Aware Logo Swap Across All Pages

### Problem
The auth pages already swap between white/black logos based on light/dark mode, but the rest of the platform still uses static logo assets — `logoDark` on NavHeader and TeachWithUsPage, `logoWhite` on FooterSection, and `logoImage` with CSS invert on AnimatedLogo. The user wants the same rule everywhere: **white logo in light mode, black logo in dark mode**, with no white background behind the logo.

### Changes

**1. `src/components/landing/NavHeader.tsx`**
- Import both `logoBlack` and `logoWhite` (replace single `logoDark` import)
- Swap `src={logoDark}` to `src={resolvedTheme === 'dark' ? logoBlack : logoWhite}`
- Remove `bg-white/90 dark:bg-white/10` from the `<img>` class

**2. `src/components/landing/FooterSection.tsx`**
- Import `logoBlack` alongside existing `logoWhite`
- Replace `src={logoWhite}` with `src={isDark ? logoWhite : logoBlack}`
- Remove the `brightness-0` filter hack (`${!isDark ? 'brightness-0' : ''}`)

**3. `src/pages/TeachWithUsPage.tsx`**
- Import both `logoBlack` and `logoWhite`, add `useThemeMode` hook
- Replace static `src={logoDark}` with `src={resolvedTheme === 'dark' ? logoBlack : logoWhite}`

**4. `src/components/auth/ThemedSignupForm.tsx`**
- Already imports both logos — just invert the logic to match the new convention
- Change `src={isDarkMode ? logoWhite : logoDark}` → `src={isDarkMode ? logoBlack : logoWhite}`

**5. `src/components/ui/AnimatedLogo.tsx`**
- Import both `logoBlack` and `logoWhite`, add `useThemeMode` hook
- Replace static `src={logoImage}` with theme-conditional logo
- Remove the `filter brightness-0 invert` CSS hack

### Files Changed

| File | Action |
|---|---|
| `src/components/landing/NavHeader.tsx` | Import both logos, swap by theme, remove bg |
| `src/components/landing/FooterSection.tsx` | Import both logos, swap by theme, remove brightness hack |
| `src/pages/TeachWithUsPage.tsx` | Import both logos + useThemeMode, swap by theme |
| `src/components/auth/ThemedSignupForm.tsx` | Invert logo logic to match convention |
| `src/components/ui/AnimatedLogo.tsx` | Import both logos + useThemeMode, remove CSS invert hack |

