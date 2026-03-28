

## Refactor About Us Page — Theme Compatibility

### Problem
The About page is hardcoded to a dark-only design (`bg-slate-950`, `text-white` everywhere) with its own inline navigation. The homepage uses the `ThemeModeProvider` + `useThemeMode()` hook for light/dark toggling and reuses `NavHeader` with the `HeroThemeContext`. The About page shares none of this infrastructure.

### Plan

#### 1. Wrap About Page in Theme Providers
- Wrap `AboutPage` in `HeroThemeProvider` (so NavHeader logo/CTA colors work)
- Replace the inline `<nav>` with the shared `NavHeader` component from landing
- Page will inherit `ThemeModeProvider` from the app root (already wrapping routes)

#### 2. Refactor `AboutPage.tsx`
- Remove the hardcoded dark nav block (lines 10-33)
- Import and render `<NavHeader />` instead
- Change root container from `bg-slate-950` to theme-aware classes: `bg-white dark:bg-[#09090B]`

#### 3. Refactor `MissionHeader.tsx`
- Replace hardcoded dark gradients with theme-aware variants using `useThemeMode()`
- Light mode: soft gradient backgrounds (white/slate-50 base), dark text
- Dark mode: keep existing violet/emerald/slate-900 gradients
- Floating mascot circles and labels remain color-coded per group

#### 4. Refactor `PhilosophyPanels.tsx`
- Add `useThemeMode()` hook
- Light mode: white/slate-50 backgrounds, dark text, colored accent borders
- Dark mode: keep existing dark slate backgrounds with gradient overlays
- Panel text: `text-slate-900 dark:text-white`, body: `text-slate-600 dark:text-white/70`

#### 5. Refactor `TeamGrid.tsx`
- Light mode: `bg-white` / `bg-slate-50` section background, dark text
- Dark mode: keep `bg-slate-950/900` gradients
- Founder card: light glassmorphism in light mode, current dark glass in dark mode
- Name highlight: keep `text-violet-500` (works in both modes)

#### 6. Refactor `AboutCTA.tsx`
- The gradient CTA banner works in both modes (colored background with white text) — minimal changes needed
- Ensure button styles remain readable in both contexts

### Files Changed

| File | Action |
|---|---|
| `src/pages/AboutPage.tsx` | Remove inline nav, add `HeroThemeProvider` + `NavHeader`, theme-aware root |
| `src/components/about/MissionHeader.tsx` | Add `useThemeMode`, dual-theme backgrounds and text |
| `src/components/about/PhilosophyPanels.tsx` | Add `useThemeMode`, dual-theme panels |
| `src/components/about/TeamGrid.tsx` | Add `useThemeMode`, dual-theme card and section |
| `src/components/about/AboutCTA.tsx` | Minor adjustments for theme consistency |

