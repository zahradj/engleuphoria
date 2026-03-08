

# Make Light Mode Primary & Enhance Landing Page

## Problem
The landing page defaults to dark mode. The user wants light mode as the primary/default experience, plus modern visual enhancements.

## Changes

### 1. Default to Light Mode
**`src/hooks/useThemeMode.ts`** — Change default from `'system'` to `'light'` so first-time visitors see the Pearl (light) theme.

### 2. Hero Section Enhancement
**`src/components/landing/HeroSection.tsx`**
- Add a soft animated **gradient mesh** background for light mode (warm pastels: peach, lavender, mint)
- Add **text shimmer animation** on the headline for light mode (trending "aurora text" effect)
- Improve portal buttons with **frosted glass cards** and subtle gradient borders instead of plain pills
- Add a **typing/rotating text** effect for the subheadline cycling through taglines
- Improve the social proof ribbon with real avatar-style gradient circles

### 3. Bento Grid Enhancement
**`src/components/landing/BentoGridSection.tsx`**
- Add **animated gradient mesh borders** on hover (trending "border beam" effect on all cards, not just mastery)
- Add **micro-interaction counters** that animate numbers inside cards
- Improve light mode card styling with softer shadows and warm accent glows

### 4. How It Works — Timeline Redesign
**`src/components/landing/HowItWorksSection.tsx`**
- Replace grid with a **vertical timeline** layout on mobile, horizontal on desktop
- Add **connecting animated line** with gradient pulse traveling between steps
- Add **step reveal animation** with staggered entrance

### 5. Pricing Section Polish
**`src/components/landing/PricingSection.tsx`**
- Add **glassmorphism cards** with warm gradient backgrounds in light mode
- Add **animated "Most Popular" pulse ring** on the popular card
- Improve hover states with scale + gradient border reveal

### 6. Testimonials — Auto-Scroll Carousel
**`src/components/landing/TestimonialsSection.tsx`**
- Add **infinite auto-scroll** marquee for testimonials on mobile
- Improve card design with **photo avatars** and gradient accent bars

### 7. Trust Bar — Icon Animations
**`src/components/landing/TrustBarSection.tsx`**
- Add subtle **icon float animations** (trending micro-motion)
- Improve light mode with warm gradient icon backgrounds

### 8. Activity Marquee Enhancement
**`src/components/landing/ActivityMarquee.tsx`**
- Add **gradient text highlights** on key metrics (names, achievements)
- Improve light mode badge styling with warm shadows

### 9. CSS Enhancements
**`src/index.css`**
- Add `animate-gradient-mesh` keyframes for the hero background
- Add `animate-text-shimmer` for aurora headline effect
- Add `animate-pulse-ring` for pricing popular card

### Summary

| File | Change |
|------|--------|
| `useThemeMode.ts` | Default to `'light'` |
| `HeroSection.tsx` | Gradient mesh bg, text shimmer, glass portal cards, rotating tagline |
| `BentoGridSection.tsx` | Border beams on all cards, warmer light styling |
| `HowItWorksSection.tsx` | Timeline redesign with animated connecting line |
| `PricingSection.tsx` | Glass cards, pulse ring on popular |
| `TestimonialsSection.tsx` | Auto-scroll, improved avatars |
| `TrustBarSection.tsx` | Floating icon micro-animations |
| `ActivityMarquee.tsx` | Gradient text highlights |
| `index.css` | New keyframe animations |

