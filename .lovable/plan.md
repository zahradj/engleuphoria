

# Landing Page V4: "Spatial Glass & Kinetic Typography" Polish

## Overview

This is an iterative refinement pass over the existing landing page, upgrading six areas: (1) global font swap to Outfit, (2) hero section with kinetic gradient text and updated copy, (3) Bento grid with 32px super-ellipse cards and floating motion, (4) interactive hover-expand skill radar in Bento, (5) pricing card "border beam" and holographic badge effects, and (6) floating bottom-center mood toggle with aura glow.

---

## 1. Global Font: Swap to "Outfit"

### Modify: `index.html`
- Replace the current Plus Jakarta Sans Google Fonts link with Outfit (weights 400-800):
  `https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap`
- Keep Space Grotesk as secondary display font

### Modify: `tailwind.config.ts`
- Update `fontFamily.jakarta` to `['Outfit', 'system-ui', 'sans-serif']`
- Update `fontFamily.display` to `['Outfit', 'Space Grotesk', 'system-ui', 'sans-serif']`
- Add new keyframes:
  - `border-beam`: a translateX(-100%) to translateX(100%) for the border light effect on the Mastery card
  - `shimmer`: a background-position shift for the holographic badge effect
  - `gradient-text`: a background-position shift for kinetic text gradient animation

---

## 2. Hero Section: Kinetic Typography + Updated Copy

### Modify: `src/components/landing/HeroSection.tsx`

**Copy updates:**
- Headline: "English Mastery, Accelerated."
- The word "Accelerated." gets an animated moving gradient (using `background-size: 200%` and CSS `animation: gradient-text 3s ease infinite` to shift the gradient position back and forth)
- Subheadline: "One platform. Three worlds. Unlimited potential. Welcome to the future of fluency."

**Orb adjustments:**
- Dark mode: Keep current deep blues/purples but shift slightly more charcoal/navy for the "deep space" feel
- Light mode: Softer pastels as currently implemented, but add subtle corner "ink bleed" gradients (absolutely-positioned blurred divs in corners with soft color washes -- sky blue top-left, peach bottom-right, mint top-right)

**Pill buttons remain the same** (already glassmorphic with hover glows).

---

## 3. Bento Grid: Super-Ellipse Cards + Floating Motion

### Modify: `src/components/landing/BentoGridSection.tsx`

**Card style updates:**
- Increase corner radius from `rounded-3xl` (24px) to a custom `rounded-[32px]` for the super-ellipse look
- Update glassmorphism values per the user's spec:
  - Dark: `rgba(15, 23, 42, 0.6)` background with `border: 1px solid rgba(255, 255, 255, 0.1)`
  - Light: `rgba(255, 255, 255, 0.7)` background with `border: 1px solid rgba(0, 0, 0, 0.05)`
- Add Framer Motion "floating" effect: wrap each card's motion.div with a subtle `animate={{ y: [0, -4, 0] }}` with staggered durations (3-5s) and `repeat: Infinity` for a gentle idle float

**New "Live Skills" interactive card (replace or enhance Card 2 -- AI Skill Radar):**
- On hover over the radar card, expand the radar polygon's `skillValues` for one skill (e.g., "Professional Vocabulary" mapped to the "Vocabulary" axis) from 0.8 to 0.95
- Add a text overlay on hover: "AI-Adjusted Curriculum: Your path evolves as you do."
- Use `whileHover` on the card to trigger a state change that adjusts the radar polygon points
- Implementation: add a `hovered` state to the SkillRadar component, pass it as a prop from the card's `onMouseEnter`/`onMouseLeave`, and conditionally use boosted skill values when hovered

**3D-style decorative icons per world** (shown as emoji/icon compositions in the Bento cards):
- Add small floating decorative elements within relevant cards using absolutely-positioned, animated spans:
  - "Playground" reference: A stylized "A" block emoji (🔤) + rocket (🚀) floating near the Daily Feed or Gamified Learning card
  - "Academy" reference: A controller emoji (🎮) + "XP" text badge near the Gamified Learning card
  - "Professional" reference: A pen emoji (🖊) or globe (🌍) near the mentors card
- These are small, subtle decorative touches (opacity 0.3-0.5, floating animation) -- not full 3D renders

---

## 4. Pricing: Border Beam + Holographic Badge

### Modify: `src/components/landing/PricingSection.tsx`

**Border Beam on Mastery card:**
- Replace the current rotating `conic-gradient` border with a "border beam" effect
- Implementation: a small glowing dot/rectangle that travels along the card border using CSS animation
- Use a pseudo-element (`::before`) with a small gradient segment, animated via `translateX` from -100% to 100% along the top edge, then cycle through all four sides
- Simplified approach: a single light traveling along the top border using the `border-beam` keyframe (translateX -100% to 100%) on a narrow pseudo-element positioned at the top of the card

**Holographic shimmer on savings badge:**
- Replace the current static gradient badge with a shimmer effect
- Apply `background-size: 200% 100%` with `animation: shimmer 2s ease-in-out infinite` that shifts the `background-position` from `100% 0` to `0% 0` and back
- Colors: a multi-stop gradient with white highlight in the middle (`from-orange-500 via-white/40 to-amber-500`) for the holographic look

**Price flip animation:**
- When toggling between Playground & Academy vs Professional, wrap the price number in a `<motion.span>` with `key={price}` so AnimatePresence triggers a flip:
  - Exit: `rotateX: 90, opacity: 0`
  - Enter: from `rotateX: -90` to `rotateX: 0, opacity: 1`
  - Duration: 0.3s

---

## 5. Floating Bottom-Center Mood Toggle

### Modify: `src/components/landing/NavHeader.tsx`
- Remove the ThemeModeToggle from the desktop nav bar actions (it will move to a floating position)

### Modify: `src/pages/LandingPage.tsx`
- Add a fixed-position floating toggle at the bottom-center of the screen
- Position: `fixed bottom-6 left-1/2 -translate-x-1/2 z-50`
- The toggle sits inside a glassmorphic pill container with an aura glow:
  - Dark mode: The pill has a soft purple aura (`shadow-[0_0_30px_rgba(99,102,241,0.3)]`)
  - Light mode: The pill has a warm amber aura (`shadow-[0_0_30px_rgba(251,191,36,0.3)]`)
- Reuse the existing `ThemeModeToggle` component inside this floating container
- Keep the toggle in the mobile drawer as well (it stays there for mobile)

### Modify: `src/components/landing/NavHeader.tsx` (mobile drawer)
- Keep the theme toggle in the mobile drawer unchanged

---

## 6. LandingPage `<main>` Background

### Modify: `src/pages/LandingPage.tsx`
- Make the `<main>` background theme-aware: `bg-[#FAFAFA] dark:bg-[#09090B]`
- Currently it's hardcoded to `bg-[#09090B]`

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Modify | `index.html` | Swap to Outfit font |
| Modify | `tailwind.config.ts` | Update font families, add border-beam/shimmer/gradient-text keyframes |
| Modify | `src/components/landing/HeroSection.tsx` | Kinetic gradient text, updated copy, light-mode ink bleeds |
| Modify | `src/components/landing/BentoGridSection.tsx` | 32px corners, floating motion, interactive radar hover, decorative icons |
| Modify | `src/components/landing/PricingSection.tsx` | Border beam, holographic badge shimmer, price flip animation |
| Modify | `src/components/landing/NavHeader.tsx` | Remove desktop theme toggle (moves to floating) |
| Modify | `src/pages/LandingPage.tsx` | Add floating mood toggle, theme-aware main bg |

---

## Technical Notes

- The border beam effect uses a single pseudo-element with `translateX` animation along the top edge -- simpler and more performant than a full 4-side traveling light
- The kinetic text gradient uses `background-size: 200% auto` with `animation: gradient-text` shifting `background-position` -- pure CSS, no JS
- The price flip uses `framer-motion`'s `AnimatePresence` with `mode="wait"` and `rotateX` transforms for a card-flip feel
- The interactive radar hover uses the existing `SkillRadar` component with a new `hoveredSkill` prop that boosts one value in the polygon points
- Floating decorative emoji icons use `position: absolute` with `animate-float` (existing keyframe) at low opacity
- The floating mood toggle is rendered in `LandingPage.tsx` so it persists across all landing sections without being tied to the nav scroll state
- No new dependencies needed

