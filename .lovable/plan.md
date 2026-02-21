

# Dual-Mood Theme System: Dark Glass + Pearl Light Mode

## Overview

Make the entire landing page theme-aware so it responds to the existing dark/light toggle. Currently, all landing components hardcode dark backgrounds (`bg-[#09090B]`, white text, `bg-white/[0.04]` cards). This plan replaces those hardcoded values with Tailwind `dark:` variants, creating two distinct visual moods: "Spatial" (dark) and "Pearl" (light).

---

## 1. CSS Variables Update

### Modify: `src/index.css`

Update the `:root` (light) and `.dark` CSS variables to match the Dual-Mood palettes:

**Light mode (Pearl):**
- `--background`: Off-White/Pearl (`#FAFAFA` / `210 40% 98%`)
- `--foreground`: Slate Black (`#0F172A` / `222 47% 11%`)
- `--card`: 100% white
- `--card-foreground`: Slate Black

**Dark mode (Spatial):**
- `--background`: Midnight Black (`#09090B` / `240 10% 4%`)
- `--foreground`: Pure White (`0 0% 98%`)
- `--card`: `240 10% 6%`

No structural change to the variable system -- just tightened values for the landing page palette.

---

## 2. Hero Section: Dual-Mood Orb + Typography

### Modify: `src/components/landing/HeroSection.tsx`

**Background:**
- Replace `bg-[#09090B]` with `bg-[#FAFAFA] dark:bg-[#09090B]`
- Replace the gradient overlay similarly with light pastels for light mode

**The Orb:**
- Dark mode: Keep current deep blues/purples/gold radial gradients (high contrast)
- Light mode: Switch to soft pastels (sky blue `rgba(56,189,248,0.2)`, peach `rgba(251,146,60,0.15)`, mint `rgba(52,211,153,0.2)`) via conditional class or inline style based on `useThemeMode().resolvedTheme`

**Typography:**
- Headline: `text-slate-900 dark:text-white`
- Gradient text span: stays the same (gradients work on both)
- Subheadline: `text-slate-600 dark:text-slate-400`

**Pill Buttons:**
- Dark: current `bg-white/[0.04] border-white/[0.08]` with white text
- Light: `bg-white/70 border-slate-200 text-slate-800 shadow-sm` with glow colors as deep rich versions (Navy, Amber, Emerald)
- Hover glow colors adjust: dark uses neon rgba, light uses deeper saturated shadows

**Social Proof Ribbon:**
- Dark: current styling
- Light: `bg-white/70 border-slate-200 text-slate-700`

**Scroll Indicator:**
- `text-slate-400/40 dark:text-white/40`

---

## 3. Bento Grid: Dual-Mood Cards

### Modify: `src/components/landing/BentoGridSection.tsx`

**Section background:** `bg-[#FAFAFA] dark:bg-[#09090B]`

**Card style constants:**
- Replace the `GLASS` constant with theme-aware classes:
  - Dark: `dark:bg-white/[0.04] dark:backdrop-blur-xl dark:border-white/[0.08]`
  - Light: `bg-white/70 border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)]`
- Hover behavior:
  - Dark: Keep subtle inner glow (current `group-hover:opacity-100` gradient overlay)
  - Light: Remove gradient overlay, add `hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]` for floating effect

**Typography:**
- Card titles: `text-slate-900 dark:text-white`
- Card descriptions: `text-slate-500 dark:text-slate-400`
- SVG strokes (timer, radar): Keep the gradient colors (they work on both backgrounds)
- Radar grid lines: `rgba(0,0,0,0.06)` in light, `rgba(255,255,255,0.06)` in dark (conditional)

**Ambient blurs:** `bg-indigo-500/5 dark:bg-indigo-500/10` (subtler in light mode)

**Teacher avatars border:** `border-[#FAFAFA] dark:border-[#09090B]`

**CTA card gradient:** Stays the same (gradient works on both)

---

## 4. Activity Marquee: Dual-Mood

### Modify: `src/components/landing/ActivityMarquee.tsx`

- Section background: `bg-[#FAFAFA] dark:bg-[#09090B]`
- Badge style: Light uses `bg-slate-100 border-slate-200 text-slate-600`, dark keeps current
- Fade masks work identically on both backgrounds

---

## 5. Pricing Section: Dual-Mood

### Modify: `src/components/landing/PricingSection.tsx`

**Section background:**
- Dark: Keep `bg-[#09090B]` with faint indigo radial glow
- Light: `bg-[#FAFAFA]` with faint warm-white radial glow (`from-amber-500/3 via-transparent`)

**Toggle:**
- Dark: current `bg-white/[0.04] border-white/[0.08]`, active = `bg-white/10 text-white`
- Light: `bg-slate-100 border-slate-200`, active = `bg-white text-slate-900 shadow-md`

**Cards:**
- Dark: current glassmorphic style
- Light: `bg-white border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.05)]`
- Mastery animated gradient border: stays (works on both)
- Mastery card inner bg: `bg-white dark:bg-[#09090B]`

**Savings badge:**
- Dark: neon gradient glow (current)
- Light: solid bold color `bg-indigo-600 text-white` (no glow needed)

**Feature check icons:**
- Dark: current colors
- Light: `text-indigo-600` for mastery, `text-amber-600` for popular, `text-slate-400` for default

**CTA buttons:**
- Keep gradient buttons (they pop on both backgrounds)
- Default card CTA in light: `bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200`

**Cancellation policy box:**
- Dark: current
- Light: `bg-white border-slate-200`

---

## 6. NavHeader: Dual-Mood Polish

### Modify: `src/components/landing/NavHeader.tsx`

**Scrolled state:**
- Dark: current `bg-slate-950/60 backdrop-blur-2xl border-white/10`
- Light: `bg-white/80 backdrop-blur-2xl border-slate-200 shadow-sm`

**Logo text:** `text-slate-900 dark:text-white`

**Nav links:** `text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white`

**Sign Up button:**
- Dark: `bg-white text-slate-900`
- Light: `bg-slate-900 text-white hover:bg-slate-800`

**Login button:**
- Light: `text-slate-600 hover:text-slate-900 hover:bg-slate-100`

**Mobile drawer:**
- Dark: current `bg-slate-900 border-white/10`
- Light: `bg-white border-slate-200`

---

## 7. ThemeModeToggle: Enhanced Animation

### Modify: `src/components/ui/ThemeModeToggle.tsx`

The toggle already has a 180-degree flip animation with Sun/Moon icons and localStorage persistence. Minor polish:
- Ensure the rotation transition is exactly `duration: 0.3` (currently 0.3s -- already correct)
- The `useThemeMode` hook already saves to localStorage and applies the `dark` class -- no changes needed there

---

## Implementation Approach

Each landing component will import `useThemeMode` only where inline style switching is needed (e.g., the orb gradient colors, SVG strokes). For most elements, standard Tailwind `dark:` prefix classes handle the switch automatically since the `dark` class is already toggled on `<html>` by the existing `useThemeMode` hook.

The background color transition is handled by adding `transition-colors duration-300` to each section's root element, ensuring smooth 0.3s color crossfades with no harsh flashing.

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/index.css` | Tighten light/dark CSS variable values |
| Modify | `src/components/landing/HeroSection.tsx` | Dual-mood orb, text, pills, social proof |
| Modify | `src/components/landing/BentoGridSection.tsx` | Dual-mood cards with light shadows vs dark glow |
| Modify | `src/components/landing/ActivityMarquee.tsx` | Dual-mood badges |
| Modify | `src/components/landing/PricingSection.tsx` | Dual-mood cards, toggle, savings badges |
| Modify | `src/components/landing/NavHeader.tsx` | Dual-mood header, links, buttons, mobile drawer |
| Modify | `src/components/ui/ThemeModeToggle.tsx` | Minor animation polish (if needed) |

---

## Technical Notes

- The `darkMode: ["class"]` config in `tailwind.config.ts` is already set, so `dark:` variants work out of the box
- The `useThemeMode` hook already toggles the `dark` class on `document.documentElement` and persists to localStorage
- The orb gradient colors need runtime switching (not just CSS classes) since they are inline `background` styles -- this uses `resolvedTheme` from the hook
- SVG strokes in the radar/timer use hardcoded colors that work well on both backgrounds (indigo/emerald gradients have sufficient contrast on white and black)
- No new dependencies required
- The `transition-colors duration-300` on section backgrounds ensures smooth mode transitions without flashing

