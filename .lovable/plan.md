

# Fix Light Mode & Enhance Landing Page

## Problem 1: Light mode not working across sections

**Root Cause:** `useThemeMode` is a standalone hook (not a Context). Each component calling `useThemeMode()` gets its own independent `useState`. When the toggle calls `toggleTheme()`, it updates localStorage and the `dark` class on `<html>`, but all other components (Hero, Bento, Pricing, etc.) keep their stale `resolvedTheme` value and never re-render.

**Fix:** Convert `useThemeMode` from a plain hook to a **React Context + Provider** pattern so all 16+ consumers share the same state and re-render together when the theme changes.

### Changes:
1. **`src/hooks/useThemeMode.ts`** -- Rewrite to export a `ThemeModeProvider` context and a `useThemeMode` consumer hook. The provider manages state, listens to `localStorage` and `prefers-color-scheme`, and all children react to changes.
2. **`src/App.tsx`** -- Wrap the app tree with `<ThemeModeProvider>`.
3. **All 16 consumer files remain unchanged** -- they already call `useThemeMode()` which will now read from context instead of local state.

## Problem 2: Enhance landing page look

The current landing page is well-structured but can be elevated with:

### Visual Enhancements:
1. **HeroSection** -- Add a subtle animated gradient mesh background, improve the portal buttons with micro-interactions (scale + glow on hover), add a floating particle/dot grid behind the headline for depth.
2. **BentoGridSection** -- Add subtle gradient borders on hover (not just glow), improve card content spacing, add number counters or micro-animations inside cards.
3. **NavHeader** -- Add a smooth gradient underline on active nav items, improve the scrolled state with a more refined glass effect.
4. **PricingSection** -- Add a "Most Popular" badge with animation, improve card hover states with gradient border reveals.
5. **TestimonialsSection** -- Add a subtle auto-scrolling carousel effect or staggered entrance animations.
6. **FooterSection** -- Add a gradient divider line above the footer, improve the oversized logo with a subtle parallax effect.

### Files to modify:
| File | Change |
|------|--------|
| `src/hooks/useThemeMode.ts` | Convert to Context provider pattern |
| `src/App.tsx` | Wrap with ThemeModeProvider |
| `src/components/landing/HeroSection.tsx` | Enhanced visuals, animated dot grid, improved portal buttons |
| `src/components/landing/BentoGridSection.tsx` | Gradient border hover, improved spacing |
| `src/components/landing/NavHeader.tsx` | Active item indicators, refined glass |
| `src/components/landing/PricingSection.tsx` | Popular badge, gradient border hover |
| `src/components/landing/TestimonialsSection.tsx` | Improved entrance animations |
| `src/components/landing/FooterSection.tsx` | Gradient divider, parallax logo |

