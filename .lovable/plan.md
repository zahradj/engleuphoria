
# Language Toggle, Smooth Scroll Navigation, and Animated Counters

## Overview

Three enhancements to the landing page: (1) integrate the existing `LanguageSwitcher` into the NavHeader, (2) add smooth scroll-to-section navigation for all major sections, and (3) add an animated counter in the social proof ribbon that counts up when visible.

---

## 1. Language Toggle in NavHeader

**File:** `src/components/landing/NavHeader.tsx`

The `LanguageSwitcher` component already exists with all 5 languages (EN, AR, FR, ES, Turkish). It just needs to be imported and placed in the header.

- **Desktop**: Add the `LanguageSwitcher` between the `ThemeModeToggle` and "Login" button, re-styled with transparent/glassmorphic styling to match the dark nav (`variant="ghost"` with white text)
- **Mobile drawer**: Add it in the theme section of the drawer, next to the `ThemeModeToggle`
- Override the default outline styling to use `text-white/80 hover:text-white hover:bg-white/10 border-white/20` so it blends with the dark header

---

## 2. Smooth Scroll-to-Section Navigation

### Add section IDs to all landing sections:

| File | ID to add |
|------|-----------|
| `HeroSection.tsx` | `id="hero"` (already at top) |
| `BentoGridSection.tsx` | `id="features"` |
| `IntelligenceSection.tsx` | `id="intelligence"` |
| `HowItWorksSection.tsx` | `id="how-it-works"` |
| `PricingSection.tsx` | Already has `id="pricing"` |
| `TestimonialsSection.tsx` | `id="testimonials"` |
| `ContactSection.tsx` | Already has `id="contact"` |

### Update NavHeader navigation links:

- Replace the "About" `<Link>` with a scroll button targeting `#features`
- Add a "How It Works" scroll button targeting `#how-it-works`
- Keep the existing "Pricing" scroll button (already works)
- Extract a reusable `scrollToSection(id)` helper function that uses `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`
- Update all mobile drawer nav items to use the same scroll functions and close the drawer after click

---

## 3. Animated Counter in Social Proof Ribbon

**File:** `src/components/landing/HeroSection.tsx`

- Create a custom `useCountUp` hook (inline in the file) that:
  - Takes a target number and animation duration
  - Uses `useEffect` + `requestAnimationFrame` to animate from 0 to target
  - Triggers only when the element is in view (using `useInView` from framer-motion)
- Replace the static "30+ countries" text with animated counters:
  - "2,500+" students (counts up from 0 to 2500)
  - "30+" countries (counts up from 0 to 30)
- Display format: two stats separated by a divider dot, e.g., "2,500+ students from 30+ countries"
- Numbers animate with an easing curve over ~2 seconds when the ribbon scrolls into view

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/components/landing/NavHeader.tsx` | Add LanguageSwitcher + scroll nav links |
| Modify | `src/components/landing/HeroSection.tsx` | Animated counter in social proof ribbon |
| Modify | `src/components/landing/BentoGridSection.tsx` | Add `id="features"` to section |
| Modify | `src/components/landing/HowItWorksSection.tsx` | Add `id="how-it-works"` to section |
| Modify | `src/components/landing/TestimonialsSection.tsx` | Add `id="testimonials"` to section |
| Modify | `src/components/landing/IntelligenceSection.tsx` | Add `id="intelligence"` to section |

---

## Technical Notes

- The `LanguageSwitcher` component uses `react-i18next` which is already installed and configured with translations for all 5 languages
- The animated counter uses `framer-motion`'s `useInView` hook (already a dependency) combined with `requestAnimationFrame` for smooth number animation -- no new dependencies needed
- The `scrollToSection` helper adds `scroll-margin-top` via Tailwind's `scroll-mt-20` class on each section to account for the fixed header height
- All section `<section>` tags get a `scroll-mt-20` class to offset the sticky nav when scrolling
