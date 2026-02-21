

# Landing Page V5: Spatial Cursor, Clip-Path Hero, Perspective Pricing & Full Theme Polish

## Overview

This pass adds five premium interaction layers: (1) a custom ring cursor with context-aware colors and magnetic lag, (2) a hero mesh gradient visible through the headline text via CSS `background-clip`, (3) perspective 3D tilt on pricing cards, (4) smooth scrolling via CSS `scroll-behavior: smooth` and scroll-reveal animations on all sections, and (5) full dual-mood theming for the 6 remaining sections that are still hardcoded dark-only (IntelligenceSection, HowItWorksSection, TestimonialsSection, TrustBarSection, AmbassadorSection, ContactSection, FooterSection).

---

## 1. Custom Adaptive Cursor

### Create: `src/components/landing/CustomCursor.tsx`

A new component rendered once in `LandingPage.tsx`, hidden on mobile (`hidden md:block`).

**How it works:**
- Tracks `mousemove` on `document` using `useEffect`
- Renders a `position: fixed` 20px ring (`border: 2px solid`, `border-radius: 50%`, `mix-blend-mode: difference`) with `pointer-events: none`
- Uses `framer-motion`'s `motion.div` with `animate={{ x: mouseX, y: mouseY }}` and a spring transition (`damping: 25, stiffness: 200`) for the "magnetic lag" feel
- Default color: white ring
- Detects hover context via data attributes: elements with `data-cursor="playground"` turn the ring Neon Mint (#10B981) and scale it to 40px; `data-cursor="academy"` turns it Electric Indigo (#6366F1); `data-cursor="professional"` turns it Liquid Gold (#F59E0B)
- The cursor ring color and size transitions use `transition: all 0.2s ease`
- Hides the default cursor globally via `cursor: none` on `body` (desktop only, using a media query in CSS)

**Data attributes to add:**
- HeroSection pill buttons: add `data-cursor="playground"`, `data-cursor="academy"`, `data-cursor="professional"` respectively
- Pricing toggle buttons get matching data attributes
- All other interactive elements (links, buttons) scale the ring slightly on hover (32px) without changing color

### Modify: `src/index.css`
- Add `@media (min-width: 768px) { body.custom-cursor { cursor: none; } }` -- the class is toggled by the CustomCursor component on mount/unmount

### Modify: `src/pages/LandingPage.tsx`
- Import and render `<CustomCursor />` inside `<main>`

### Modify: `src/components/landing/index.ts`
- Export `CustomCursor`

---

## 2. Hero: Mesh Gradient Through Text (Clip-Path)

### Modify: `src/components/landing/HeroSection.tsx`

**Headline change:**
- The entire headline "English Mastery, Accelerated." uses `background-clip: text` with the moving mesh gradient as the text fill
- Instead of only "Accelerated." having the gradient, the full headline becomes transparent text revealing the animated gradient underneath
- The mesh gradient itself uses the existing `animate-gradient-text` keyframe with expanded color stops (indigo, emerald, amber, violet)
- The subheadline stays as solid color text (slate-900 / white)

**Light-mode ink bleeds enhancement:**
- Add a fourth ink bleed blob (violet) at the bottom-left corner for richer depth
- Slightly increase blur values for a more diffused, organic feel

**Persuasive world copy (below pills):**
- Add three small taglines below the pill buttons, one per world, fading in sequentially:
  - Playground: "Stop 'teaching' them. Let them play their way to fluency."
  - Academy: "Don't just pass exams. Master the language of the global internet."
  - Professional: "Your expertise is global. Now, make your voice match your ambition."
- These render as small, italic text snippets (`text-sm italic text-slate-500`) with a staggered fade-in

---

## 3. Pricing Cards: Perspective 3D Tilt

### Modify: `src/components/landing/PricingSection.tsx`

**3D tilt effect ("Apple Card"):**
- Wrap the pricing cards grid container with `style={{ perspective: '1200px' }}`
- Each card gets an `onMouseMove` handler that calculates the mouse position relative to the card center
- Apply `transform: rotateY(Xdeg) rotateX(Ydeg)` where X and Y are capped at 5 degrees max
- On `onMouseLeave`, reset to `rotateY(0) rotateX(0)` with a smooth spring transition
- Implementation: use `framer-motion`'s `useMotionValue` + `useTransform` for each card, or a simpler `useState` approach with inline `style={{ transform }}` and `transition: transform 0.3s ease`

**No changes to pricing data or layout** -- this is purely an interaction layer on top of the existing cards.

---

## 4. Scroll Reveal & Smooth Scroll

### Modify: `src/index.css`
- Add `html { scroll-behavior: smooth; }` for native smooth scrolling (replaces the need for Lenis library -- simpler and no new dependency)

### Modify: `src/components/common/AnimatedSection.tsx`
- This component already exists and provides scroll-triggered fade-in animations
- No changes needed -- it already uses `whileInView` with `once: true`

### Wrap remaining sections with scroll-reveal:
The Hero, Bento, and Pricing sections already have `whileInView` animations. The following sections need scroll-reveal wrapping at the section level (add `motion.div` wrappers with `initial={{ opacity: 0, y: 30 }}` and `whileInView={{ opacity: 1, y: 0 }}`):

- **IntelligenceSection**: Already has `whileInView` -- no change needed
- **HowItWorksSection**: Already has `whileInView` -- no change needed
- **TestimonialsSection**: Already has `whileInView` -- no change needed
- **TrustBarSection**: Already has `whileInView` -- no change needed
- **AmbassadorSection**: Needs a `motion.div` wrapper with scroll-reveal
- **ContactSection**: Already has `whileInView` -- no change needed
- **FooterSection**: Already has `whileInView` -- no change needed

### Teacher/Student Photo Grayscale:
- In `BentoGridSection.tsx`, update the teacher avatar `<img>` tags to include `grayscale filter hover:grayscale-0 transition-all duration-500`
- This applies to the 4 teacher avatars in the "Top 3% Mentors" card

---

## 5. Full Dual-Mood Theming for Remaining Sections

Currently, `IntelligenceSection`, `HowItWorksSection`, `TestimonialsSection`, `TrustBarSection`, `AmbassadorSection`, `ContactSection`, and `FooterSection` all hardcode dark backgrounds (`bg-slate-950`, `bg-slate-900`, etc.). They need the same dual-mood treatment.

### Modify: `src/components/landing/IntelligenceSection.tsx`
- Import `useThemeMode`
- Section background: `bg-[#FAFAFA] dark:bg-slate-950`
- Radial glow: `from-indigo-500/3 dark:from-indigo-500/5`
- Badge: light = `bg-indigo-100 text-indigo-600`, dark = current
- Headline: `text-slate-900 dark:text-white`
- Gradient text span: stays (works on both)
- Subtext: `text-slate-500 dark:text-slate-400`
- Radar grid strokes: conditional based on `isDark`
- Radar data points: `fill={isDark ? 'white' : '#1e293b'}`
- Feed cards: light = `bg-white border-slate-200`, dark = current glassmorphic
- Feed card text: `text-slate-900 dark:text-white` for titles, `text-slate-500 dark:text-slate-400` for subtitles
- Floating label: light = `bg-white/70 border-slate-200 text-slate-600`, dark = current

### Modify: `src/components/landing/HowItWorksSection.tsx`
- Import `useThemeMode`
- Section background: `bg-[#FAFAFA] dark:bg-slate-950`
- Background radial glow: `bg-amber-500/5 dark:bg-amber-500/10`
- Headline: `text-slate-900 dark:text-white`
- Subtext: `text-slate-500 dark:text-slate-400`
- Step icon containers: outer gradient stays, inner bg = `bg-white dark:bg-slate-900`
- Step number badge: `bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700`
- Step titles: `text-slate-900 dark:text-white`
- Step descriptions: `text-slate-500 dark:text-slate-400`
- Connection line: slightly more visible in light mode

### Modify: `src/components/landing/TestimonialsSection.tsx`
- Import `useThemeMode`
- Section background: `bg-[#FAFAFA] dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900`
- Top fade overlay: conditional
- Headline: `text-slate-900 dark:text-white`
- Testimonial cards: light = `bg-white border-slate-200 shadow-sm`, dark = current `bg-white/5 border-white/10`
- Quote icon circle: stays gradient (works on both)
- Testimonial text: `text-slate-600 dark:text-slate-300`
- Author name: `text-slate-900 dark:text-white`
- Author role: `text-slate-500 dark:text-slate-400`
- Avatar circle: light = `bg-indigo-50 border-slate-200`, dark = current

### Modify: `src/components/landing/TrustBarSection.tsx`
- Import `useThemeMode`
- Section background: `bg-[#FAFAFA] dark:bg-slate-950`
- Cards: light = `bg-white border-slate-200 shadow-sm`, dark = current `bg-white/5 border-white/10`
- Title: `text-slate-900 dark:text-white`
- Description: `text-slate-500 dark:text-slate-400`

### Modify: `src/components/landing/AmbassadorSection.tsx`
- Import `useThemeMode`
- Section background: `bg-[#FAFAFA] dark:bg-slate-950`
- Background blurs: `bg-violet-600/5 dark:bg-violet-600/10`
- Headline: `text-slate-900 dark:text-white`
- Subtext: `text-slate-500 dark:text-slate-400`
- Social proof avatars border: `border-[#FAFAFA] dark:border-slate-950`
- Add scroll-reveal `motion.div` wrapper

### Modify: `src/components/landing/ContactSection.tsx`
- Import `useThemeMode`
- Background gradient: conditional light/dark
- Decorative blobs: subtler in light mode
- Badge: light = `bg-slate-100 text-slate-700`, dark = current
- Headline: `text-slate-900 dark:text-white`
- Subtext: `text-slate-500 dark:text-slate-400`
- Form card: light = `bg-white border-slate-200 shadow-lg`, dark = current `bg-white/5 border-white/10`
- Input fields: light = `bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400`, dark = current
- Labels: `text-slate-700 dark:text-white/80`
- Submit button: stays gradient (works on both)

### Modify: `src/components/landing/FooterSection.tsx`
- Import `useThemeMode`
- Footer background: `bg-[#FAFAFA] dark:bg-slate-950`
- Border top: `border-slate-200 dark:border-white/10`
- Brand name gradient: stays (works on both)
- Description text: `text-slate-500 dark:text-slate-400`
- Social icons: light = `bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200`, dark = current
- Section headings: `text-slate-900 dark:text-white`
- Links: `text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white`
- Bottom bar border: `border-slate-200 dark:border-white/10`
- Copyright text: `text-slate-400 dark:text-slate-500`

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/landing/CustomCursor.tsx` | Adaptive ring cursor with context-aware colors |
| Modify | `src/index.css` | Add `cursor: none` media query, `scroll-behavior: smooth` |
| Modify | `src/pages/LandingPage.tsx` | Add CustomCursor, add data-cursor support |
| Modify | `src/components/landing/index.ts` | Export CustomCursor |
| Modify | `src/components/landing/HeroSection.tsx` | Full headline gradient clip-path, world taglines, ink bleed enhancement |
| Modify | `src/components/landing/BentoGridSection.tsx` | Teacher photo grayscale, data-cursor attributes |
| Modify | `src/components/landing/PricingSection.tsx` | Perspective 3D tilt on cards, data-cursor on toggle |
| Modify | `src/components/landing/IntelligenceSection.tsx` | Full dual-mood theming |
| Modify | `src/components/landing/HowItWorksSection.tsx` | Full dual-mood theming |
| Modify | `src/components/landing/TestimonialsSection.tsx` | Full dual-mood theming |
| Modify | `src/components/landing/TrustBarSection.tsx` | Full dual-mood theming |
| Modify | `src/components/landing/AmbassadorSection.tsx` | Full dual-mood theming + scroll reveal |
| Modify | `src/components/landing/ContactSection.tsx` | Full dual-mood theming |
| Modify | `src/components/landing/FooterSection.tsx` | Full dual-mood theming |

---

## Technical Notes

- The custom cursor uses `framer-motion` spring physics for the lag effect -- no new dependencies
- `mix-blend-mode: difference` makes the ring visible on both dark and light backgrounds automatically
- The `cursor: none` is scoped to desktop via media query and only on the landing page (class toggled on mount)
- The 3D tilt on pricing cards is capped at 5 degrees to remain subtle and not cause motion sickness
- `scroll-behavior: smooth` is a CSS-only solution -- no Lenis library needed, avoiding bundle bloat
- The grayscale-to-color photo effect uses Tailwind's built-in `grayscale` and `hover:grayscale-0` utilities
- All dual-mood changes follow the same pattern: import `useThemeMode`, derive `isDark`, apply Tailwind `dark:` variants where possible and conditional inline styles where needed (e.g., SVG strokes)
- No new dependencies required for any of these changes

