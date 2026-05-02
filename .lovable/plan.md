## Landing page premium upgrades — Phase 2

Focused, high-impact additions on top of the mobile + i18n work already shipped. No backend changes; pure UI/UX upgrades to the public landing page.

---

### 1. Interactive "Who are you?" hero selector

Add a 3-tab segmented control directly under the hero headline that instantly re-themes the hero (image, gradient, sub-headline, CTA copy) — replacing the passive 5-second auto-rotation with user intent.

- Tabs: **Parent** · **Student** · **Professional** (i18n keys: `lp.hero.who.parent|student|pro`)
- Maps directly to existing `GROUP_THEMES` in `HeroThemeContext` (kids → Parent, teen → Student, adult → Professional). The context already drives the headline gradient, hero image, glow color, dots, badge, nav logo, sticky CTA — so one click flips the entire page chrome.
- Each tab gets a tailored sub-headline (e.g. Parent: "Give your child the gift of fluency, safely."; Pro: "Boost your career with Business English."). New keys per locale.
- Auto-rotation pauses permanently after first manual selection (stored in `sessionStorage`), so we keep the showcase effect for first-time scrollers but respect intent.
- Pill-style segmented control with sliding active background using `framer-motion` `layoutId`; animates on tab change.

### 2. Trust Band (grayscale logo strip)

Slim band immediately under the hero, above `TrustBarSection`, with grayscale SVG logos that pop to color on hover.

- Logos: **CEFR-aligned** · **Stripe** (already a partner) · **Cambridge English style guide** · **WCAG AA** · **GDPR**. Use inline SVG badges (no third-party logo licensing risk — text-and-shape compositions).
- Marquee on mobile (auto-scroll), static centered row on desktop.
- One-line localized eyebrow: "Trusted standards & partners" (`lp.trust.standards`).

### 3. Skill Tracker radar/spider chart

Replace the static "85% Speaking, 72% Listening" bullets in the Personalized Path / Bento area with an actual SVG **radar chart** showing 6 axes: Speaking, Listening, Reading, Writing, Vocabulary, Grammar.

- Pure SVG component `SkillRadarChart.tsx` — no chart library; ~120 lines.
- Animates on scroll-into-view (axes draw, then polygon fills with hub-themed gradient).
- Three preset profiles cycle every 4s (Beginner → Intermediate → Advanced) so the chart visibly *grows*, communicating progress.
- Uses semantic tokens from `index.css` (no hardcoded colors); polygon fill uses the active hero gradient via CSS variables.

### 4. Gamification badge mock-up (flat, on-brand)

Per the **Flat 2.0 Anti-3D constraint** in project memory, no 3D/glowing graphics. Instead, a polished flat composition that *shows* the student UI:

- A floating phone-frame mock-up at the side of `GamificationSection` containing:
  - A "Grammar Wizard" badge sticker (claymorphic flat — matches Vocabulary Vault style)
  - A live streak counter "🔥 23-day streak"
  - A mini XP bar filling on scroll
- Built as a single React component using Tailwind + framer-motion entrance animations. No assets needed.

### 5. Video testimonials carousel

Upgrade `TestimonialsSection` to support short looping vertical videos alongside text reviews.

- Add a `videoSrc?: string` field to each testimonial entry. When present, render a 9:16 muted-autoplay-loop video card with a tap-to-unmute button; when absent, fall back to current text card.
- The four existing testimonials stay text-only (we don't have real video assets); add **2 placeholder slots** ready for the user to drop their own MP4s into `/public/testimonials/`. A friendly "Add your video here" empty state shows in the meantime so the layout is visible.
- Reel-style aspect ratio on mobile; on desktop, the video sits beside the quote.

### 6. RTL polish pass

- Audit `HowItWorksSection` step arrows and `PricingSection` checkmark alignment — apply `rtl:rotate-180` and `text-end` where missing.
- Verify the new Hero selector tabs and Skill Radar legend mirror correctly.

---

### Files

**New**
- `src/components/landing/HeroAudienceSelector.tsx`
- `src/components/landing/TrustLogosBand.tsx`
- `src/components/landing/SkillRadarChart.tsx`
- `src/components/landing/GamificationPhoneMock.tsx`

**Edited**
- `src/components/landing/HeroSection.tsx` — mount selector under headline, gate auto-rotation
- `src/components/landing/GamificationSection.tsx` — 2-column layout with phone mock on the right
- `src/components/landing/PersonalizedPathSection.tsx` — embed `SkillRadarChart`
- `src/components/landing/TestimonialsSection.tsx` — video-aware card
- `src/pages/LandingPage.tsx` — insert `<TrustLogosBand />` between Hero and `TrustBarSection`
- `src/components/landing/index.ts` — re-exports
- `src/components/landing/HowItWorksSection.tsx` — RTL polish
- `src/components/landing/PricingSection.tsx` — RTL polish
- `src/translations/{english,spanish,arabic,french,turkish,italian}/dashboardUI.ts` — new keys: `lp.hero.who.*`, `lp.hero.subFor.*`, `lp.trust.standards`, `lp.skills.{speaking,listening,reading,writing,vocabulary,grammar}`, `lp.game.streakLabel`, `lp.game.xpLabel`, `lp.testimonials.tapUnmute`, `lp.testimonials.addYourVideo`

### Out of scope (call out explicitly)

- **Looping split-screen hero video** — requires real teacher/student footage. Not generating synthetic faces; will revisit when you provide footage or approve AI video generation.
- **Real video testimonials** — same reason. We're shipping the player + slots; you drop the MP4s in.
- Auth, routing, DB — untouched.
