

# Landing Page V3: "Dark Glass & Bioluminescence" Redesign

## Overview

A comprehensive visual overhaul of the entire landing page, transforming it into a "Spatial SaaS" experience with a cursor-reactive hero orb, redesigned Bento grid with animated feature cards, a live activity marquee for social proof, and a polished pricing section with animated gradient borders.

---

## 1. Font & Global Style Update

### Modify: `index.html`
- Replace the current Google Fonts import (Fredoka, Comic Neue, Space Grotesk) with **Plus Jakarta Sans** (weights 400-800) for body and headlines
- Keep Space Grotesk as a secondary option for display headings

### Modify: `tailwind.config.ts`
- Add `'jakarta': ['Plus Jakarta Sans', 'system-ui', 'sans-serif']` to `fontFamily`
- Update `'display'` to use Plus Jakarta Sans as primary
- Add a `marquee` keyframe for the infinite scroll animation:
  - `"0%": { transform: "translateX(0)" }` to `"100%": { transform: "translateX(-50%)" }`
- Add a `glow-pulse` keyframe for the CTA button pulse effect
- Add a `gradient-rotate` keyframe for the animated gradient border on the Mastery card (rotating a conic-gradient)

---

## 2. Hero Section: "The Magnetic Orb"

### Rewrite: `src/components/landing/HeroSection.tsx`

**Remove**: The current Tri-Portal expanding panels layout.

**New structure**:
1. **Background Orb**: A large CSS mesh-gradient circle (300-400px) centered behind the headline, using layered radial gradients with Electric Indigo (#6366F1), Neon Mint (#10B981), and Liquid Gold (#F59E0B). Uses `onMouseMove` on the section to slightly offset the orb position via CSS `translate` with `framer-motion`'s `useMotionValue` and `useTransform` for smooth parallax (capped at ~20px movement).
2. **Headline**: "Fluency is no longer a slow process." -- massive, bold (text-6xl to text-8xl), white.
3. **Subheadline**: "Meet Engleuphoria. The English academy designed for absolute mastery. Choose your world." (Note: no mention of AI per user instruction)
4. **Three glassmorphic pill buttons** in a row:
   - "Playground (Ages 5-12)" -- hover glows Neon Mint (#10B981) via `shadow-[0_0_30px_rgba(16,185,129,0.4)]`
   - "Academy (Teens)" -- hover glows Electric Indigo (#6366F1)
   - "Professional (Adults)" -- hover glows Liquid Gold (#F59E0B)
   - Each links to `/student-signup`
   - Style: `bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4`
5. **Social proof ribbon** stays (reuse existing `SocialProofRibbon` component)

**Mobile**: Orb scales down, pills stack vertically.

---

## 3. Bento Box Feature Grid

### Rewrite: `src/components/landing/BentoGridSection.tsx`

**New 3x3 asymmetric grid layout** using `grid-cols-4` with span variations:

- **Card 1 (col-span-2, row-span-1): "The 55-Minute Rule"**
  - An animated circular SVG timer (ring stroke-dashoffset animation counting down from 55:00)
  - Text: "Optimized sessions with built-in buffer times for maximum focus."
  - Glassmorphic dark card: `bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl`

- **Card 2 (col-span-2, row-span-2): "AI Skill Radar"**
  - Reuse the existing radar chart SVG from `IntelligenceSection` (the polygon + animated data points)
  - Neon glow effect on the polygon stroke
  - Text: "Real-time tracking of your vocabulary, grammar, and fluency."

- **Card 3 (col-span-1, row-span-1): "Top 3% Mentors"**
  - Stacked teacher avatar images (reuse existing Unsplash URLs) with a subtle infinite vertical slide animation
  - Small text: "Handpicked. Certified. Passionate."

- **Card 4 (col-span-1, row-span-1): "Daily Feed"**
  - A small mockup of a mobile phone frame (CSS border-radius + border) containing two mini feed cards (reuse the `feedCards` data style from IntelligenceSection)
  - Subtle floating animation on the phone

- **Card 5 (col-span-2, row-span-1): CTA card**
  - Keep existing "Start Your Free Trial" CTA with gradient background

- **Card 6 (col-span-1): "Gamified Learning"**
  - Keep existing small card

- **Card 7 (col-span-1): "Live Classes"**
  - Keep existing small card

**All cards**: `rounded-3xl` (24px), glassmorphic dark-mode, subtle `hover:scale-[1.02] hover:-translate-y-1` lift.

**Mobile**: Cards stack as single column with auto height.

---

## 4. Live Activity Marquee (Social Proof)

### Create: `src/components/landing/ActivityMarquee.tsx`

**Structure**: An infinitely scrolling horizontal row of semi-transparent pill badges, positioned between the Bento grid and the Intelligence section.

**Badges** (hardcoded, rotating set):
- "Sarah (Madrid) just hit C1 Business English."
- "Leo (12) just unlocked the 'Grammar Wizard' badge."
- "David (CEO) booked a 55-min Negotiation Masterclass."
- "Amira (Algiers) completed her IELTS Prep module."
- "Tom (London) earned 500 XP this week."
- "Yuki (Tokyo) just booked her 10th session."

**Implementation**:
- Two identical sets of badges rendered side-by-side in a flex row
- Parent container uses `animation: marquee 30s linear infinite`
- Each badge: `bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-slate-300 whitespace-nowrap`
- Faint glowing border on hover
- Fade masks on left/right edges using `mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)`

---

## 5. Pricing Section: "Dark Glass" Redesign

### Modify: `src/components/landing/PricingSection.tsx`

**Toggle changes**:
- Simplify to a 2-option toggle: `[Playground & Academy]` | `[Professional]`
- Large, satisfying pill toggle with a sliding indicator dot/bar
- Kids and Teens still share the same pricing (15 EUR base), just presented under one label

**Card design updates**:
- Keep the 3-card layout (Explorer/5, Achiever/10, Mastery/20)
- **Mastery card**: Add an animated gradient border using a pseudo-element with `conic-gradient` rotating via CSS animation (the `gradient-rotate` keyframe). The card itself stays dark glass, the border shimmers.
- **Savings pill**: Replace plain "Save EUR X" with a vibrant neon pill: `bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full px-3 py-1 text-xs font-bold` with a fire emoji prefix
- **CTA button text**: Change from "Buy X Credits" to "Start Your Journey"
- **CTA pulse**: Add a subtle `animate-pulse` or custom `glow-pulse` animation (box-shadow pulsing) on the Mastery card's CTA button

---

## 6. Landing Page Section Order Update

### Modify: `src/pages/LandingPage.tsx`

Insert the new `ActivityMarquee` component:
```
NavHeader
HeroSection
BentoGridSection
ActivityMarquee    <-- NEW
IntelligenceSection
HowItWorksSection
PricingSection
TestimonialsSection
TrustBarSection
AmbassadorSection
ContactSection
FooterSection
```

### Modify: `src/components/landing/index.ts`
- Add export for `ActivityMarquee`

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Modify | `index.html` | Add Plus Jakarta Sans font |
| Modify | `tailwind.config.ts` | Add jakarta font family, marquee/glow keyframes |
| Rewrite | `src/components/landing/HeroSection.tsx` | Magnetic Orb hero with pill CTAs |
| Rewrite | `src/components/landing/BentoGridSection.tsx` | Asymmetric Bento grid with animated cards |
| Create | `src/components/landing/ActivityMarquee.tsx` | Infinite scrolling social proof badges |
| Modify | `src/components/landing/PricingSection.tsx` | 2-way toggle, animated gradient border, neon pills |
| Modify | `src/pages/LandingPage.tsx` | Add ActivityMarquee to section order |
| Modify | `src/components/landing/index.ts` | Export ActivityMarquee |

---

## Technical Notes

- The cursor-reactive orb uses `framer-motion`'s `useMotionValue` + `useTransform` with `onMouseMove` on the hero section -- no new dependencies needed
- The marquee uses pure CSS animation with duplicated content (no JS timers)
- The animated gradient border on the Mastery card uses a `before:` pseudo-element with `conic-gradient` and CSS `@keyframes` rotation -- lightweight, GPU-accelerated
- The radar chart in the Bento grid is extracted from the existing `IntelligenceSection` SVG code and reused as a standalone sub-component
- All glassmorphic cards follow the "Dark Glass" formula: `bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl`
- No 3D libraries needed -- the orb is a layered CSS mesh gradient (multiple radial-gradients composited), not a Three.js object
- The pricing toggle simplification (2-way instead of 3-way) keeps the internal data model unchanged -- Kids and Teens still resolve to the same price, just presented under one label "Playground & Academy"

