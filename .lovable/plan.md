

# Landing Page 2026 Redesign: Tri-Portal Hero + Segmented Pricing + Design Polish

## Overview

Five interconnected upgrades to transform the landing page into a high-conversion, 2026-standard experience: (1) interactive Tri-Portal hero, (2) 3-way audience pricing toggle with Kids added, (3) floating nav polish, (4) Bento grid refinement, and (5) visual atmosphere differentiation.

---

## 1. Tri-Portal Hero Section (Interactive Panels)

### Modify: `src/components/landing/HeroSection.tsx`

**Current state**: Three static portal cards in a grid layout with hover-scale animation.

**New behavior**: Three vertical panels that fill the viewport height. On hover (desktop), the active panel expands to ~50% width while the others shrink to ~25%. On mobile, panels stack vertically as full-width cards.

**Layout details**:
- Full-viewport section (`min-h-[90vh]`) with three `flex` children
- Each panel uses `transition-all duration-700 ease-out` for smooth width changes
- Default: each panel is `flex-1` (33%)
- On hover: active panel gets `flex-[2]`, others stay `flex-1`
- State managed via `hoveredPortal` (`useState<string | null>`)

**Visual atmosphere per panel**:
- **Playground (Kids)**: Soft pastel glow (`from-amber-400/20 to-emerald-400/20`), floating 3D-style decorative elements (stars, rocket emoji overlays via absolutely-positioned animated spans), tagline: "Where English feels like play."
- **Academy (Teens)**: Neon purple accents (`from-violet-500/20 to-indigo-500/20`), XP bar visual element, motion-line SVG decorations, tagline: "Own your future. Speak with confidence."
- **Professional (Adults)**: Minimalist slate-grey glassmorphic blur (`bg-white/5 backdrop-blur-xl`), clean serif-style approach for description text, tagline: "Master the language of leadership."

**CTA on each panel**: "Claim Your Free Assessment" button linking to `/student-signup`

**Mobile fallback**: Below `md` breakpoint, panels stack as full-width cards (similar to current but with the new visual themes applied). No hover interaction needed on mobile.

**Headline**: Keep the existing "Learn English. Your Way." headline and social proof ribbon above the panels.

---

## 2. Segmented Pricing with 3-Way Toggle

### Modify: `src/components/landing/PricingSection.tsx`

**Current state**: 2-option toggle (Academy / Professional) with correct pack prices.

**Changes**:
- Add "Kids" as a third toggle option: `[Kids] [Teens] [Adults]`
- Kids and Teens share the same pricing (unified at 15 EUR/session base)
- Toggle becomes a 3-segment pill with distinct colors:
  - Kids: amber/emerald gradient when active
  - Teens: violet/indigo gradient when active  
  - Adults: emerald/teal gradient when active

**Data update**:
- Change `StudentLevel` type from `'academy' | 'professional'` to `'kids' | 'teens' | 'professional'`
- Kids and Teens both map to the same prices: 75 EUR / 145 EUR / 290 EUR
- Professional stays: 100 EUR / 195 EUR / 390 EUR
- Update pack names per level:
  - Kids/Teens: "Explorer" (5), "Achiever" (10), "Mastery" (20)
  - Professional: "Pro" (5), "Executive" (10), "Global Leader" (20)

**Mastery/20-session card glow**: Keep the existing outer glow on the 20-session pack (already implemented with `shadow-[0_0_40px...]`)

**Mobile**: Cards already stack vertically. Add horizontal scroll-snap (`overflow-x-auto snap-x`) as an alternative swipe option on small screens.

---

## 3. Floating Navigation Polish

### Modify: `src/components/landing/NavHeader.tsx`

**Current state**: Already has a fixed header that transitions from transparent to `bg-slate-950/60 backdrop-blur-2xl` on scroll. Height is `h-16 md:h-20`.

**Enhancements**:
- On scroll, slightly shrink the header height: `h-14 md:h-16` (vs current `h-16 md:h-20`)
- Add a subtle scale transition to the logo on scroll (slightly smaller)
- Add `transition-all duration-500` to the height change (already partially there)
- This is a minimal refinement since the nav is already floating/blurred

---

## 4. Bento Grid Visual Polish

### Modify: `src/components/landing/BentoGridSection.tsx`

**Minor refinements** (the current Bento grid is already well-structured):
- Update the section header to use a bolder typographic contrast: large sans-serif headline stays, add a small-caps serif-styled subtitle using `font-serif tracking-widest uppercase text-xs`
- No structural changes needed -- the grid already follows the Apple-style bento pattern with varying card sizes

---

## 5. Update Pricing Data Files

### Modify: `src/data/pricingPlans.ts`

- Update `lessonPackages` to reflect the new unified Kids/Teens pricing at 15 EUR base and Professional at 20 EUR base
- Add package entries for the new naming convention (Explorer, Achiever, Mastery, Pro, Executive, Global Leader)

### Modify: `src/services/pricingData.ts`

- Update the `getPricingPlans` and `getRegionalPlans` functions to reflect the new 3-tier audience model

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/components/landing/HeroSection.tsx` | Rebuild as interactive Tri-Portal with expanding panels and visual atmosphere |
| Modify | `src/components/landing/PricingSection.tsx` | Add Kids toggle, 3-way segmentation, updated pack names |
| Modify | `src/components/landing/NavHeader.tsx` | Subtle height shrink on scroll |
| Modify | `src/components/landing/BentoGridSection.tsx` | Typography contrast polish |
| Modify | `src/data/pricingPlans.ts` | Updated package data with new names and pricing |
| Modify | `src/services/pricingData.ts` | Updated pricing service for 3-tier model |

---

## Technical Notes

- No new dependencies -- uses existing framer-motion, Tailwind, lucide-react
- The hero panel expand/contract uses CSS flex-grow transitions, not JavaScript width calculations
- Mobile breakpoint (`md:`) switches from flex-row panels to flex-col stacked cards
- The pricing toggle state type changes from a 2-value to 3-value union; Kids and Teens resolve to the same price lookup
- Floating decorative elements (stars, rockets for Kids panel) use `absolute` positioning within the panel with `animate-bounce` or custom keyframes for subtle float
- All sessions are 55 minutes as already stated in the current pricing section

