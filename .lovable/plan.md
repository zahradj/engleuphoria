

# Landing Page V6: Cinematic Hero, Parallax Depth, Ripple Theme Transition & Signature Footer

## Overview

This pass adds six cinematic upgrades: (1) a breathing "Euphoria Ring" and grainy film texture to the hero, with updated copy, (2) parallax Z-axis layering on the Bento grid with cursor-following micro-glow behind cards, (3) a "Mentor Spotlight" visual in the IntelligenceSection showing a teacher portrait with overlapping skill radar, (4) a circle-ripple theme transition effect originating from the toggle button, (5) dark-mode text glow and light-mode ink drop-shadow on key headings, and (6) an oversized "ENGLEUPHORIA" signature in the footer.

**Copy note:** The user's suggested subtext "The AI-Human Academy where language meets intuition" contains "AI" which violates the brand guidelines. It will be adapted to: "The Human-First Academy where language meets intuition."

---

## 1. Cinematic Hero: Euphoria Ring + Film Grain + New Copy

### Modify: `src/components/landing/HeroSection.tsx`

**The "Euphoria Ring":**
- Add a slowly breathing, glowing ring (200px diameter) centered behind the headline text
- Implementation: a `motion.div` with `border: 2px solid` using a gradient border (indigo-to-emerald), a large `box-shadow` glow, and `animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}` with `repeat: Infinity, duration: 4`
- The ring sits behind the text (z-index below content) as a decorative element
- Dark mode: indigo/violet glow ring; Light mode: softer amber/emerald glow ring

**Grainy Film Texture:**
- Add an SVG-based noise overlay covering the entire hero section
- Implementation: a `position: absolute` div with an inline SVG `<filter>` using `<feTurbulence>` and `<feColorMatrix>` to create subtle film grain
- Opacity: 0.03 (dark mode) / 0.02 (light mode) -- barely perceptible but adds tactile depth
- `pointer-events: none` and `mix-blend-mode: overlay`

**Copy updates:**
- Headline: "Find Your Voice in a Global World." (replaces "English Mastery, Accelerated.")
- Subheadline: "The Human-First Academy where language meets intuition." (note: "AI-Human" adapted to "Human-First" per brand rules)
- The gradient clip-path text effect remains on the full headline

---

## 2. Parallax Bento Grid + Cursor Micro-Glow

### Modify: `src/components/landing/BentoGridSection.tsx`

**Parallax Z-axis layering:**
- Track `scroll` position via `useScroll` from framer-motion on the Bento section
- Apply different `translateY` offsets to cards based on their visual "depth":
  - "Foreground" cards (Gamified Learning, Daily Feed): `useTransform(scrollYProgress, [0,1], [0, -30])` -- move faster
  - "Background" cards (CTA, 55-Min Rule): `useTransform(scrollYProgress, [0,1], [0, -10])` -- move slower
  - Radar card stays roughly centered as the anchor
- This creates a subtle depth illusion as the user scrolls

**Cursor micro-glow ("flashlight under ice"):**
- Add an `onMouseMove` handler to each Bento card
- Track mouse position relative to the card
- Render a `radial-gradient` as a pseudo-layer (`position: absolute, pointer-events: none`) centered at the cursor position within the card
- Gradient: `radial-gradient(300px circle at {x}px {y}px, rgba(99,102,241,0.06), transparent 70%)`
- On mouse leave, fade out the glow
- Implementation: use a state variable `{ x, y }` per card via a shared handler, render a div with `style={{ background: radial-gradient(...) }}`

---

## 3. Mentor Spotlight with Radar Overlay

### Modify: `src/components/landing/IntelligenceSection.tsx`

**Replace the current standalone radar with a composite "Mentor Spotlight":**
- Show a large circular teacher portrait (250px) using one of the existing Unsplash teacher avatar URLs, scaled up
- Overlay the existing skill radar SVG on top of the portrait at reduced opacity (0.5-0.6)
- The radar polygon and data points render on top of the photo, creating the "data + human" partnership visual
- Add a text caption below: "Data-driven insights. Mentor-led inspiration."
- The portrait has a subtle border glow matching the radar gradient colors
- Grayscale by default with `hover:grayscale-0` transition for the "sophisticated" effect

---

## 4. Circle Ripple Theme Transition

### Modify: `src/components/ui/ThemeModeToggle.tsx`

**Ripple effect on theme switch:**
- When the toggle is clicked, before changing the theme, capture the button's position on screen
- Create a full-screen `position: fixed` overlay div that starts as a circle at the button's position with `clip-path: circle(0px at Xpx Ypx)`
- Animate the clip-path to `circle(150vmax at Xpx Ypx)` over 0.6s using CSS transitions
- The overlay has the target theme's background color (dark = `#09090B`, light = `#FAFAFA`)
- After the animation completes, toggle the actual theme and remove the overlay
- Implementation: use a `useState` for the ripple state, a `useRef` for the button position, and a `useEffect` to clean up after the transition
- This creates a dramatic "painting the screen" effect from the toggle point

### Modify: `src/pages/LandingPage.tsx`
- Pass a callback from LandingPage to ThemeModeToggle (or use the existing toggleTheme) -- no change needed since the ripple is self-contained in ThemeModeToggle

---

## 5. Theme-Aware Typography Effects

### Modify: `src/index.css`

**Add utility classes for text effects:**
- `.text-glow`: `text-shadow: 0 0 10px currentColor, 0 0 20px currentColor` (for dark mode headings)
- `.text-ink`: `text-shadow: 0 1px 2px rgba(0,0,0,0.15)` (for light mode headings -- crisp ink drop-shadow)

### Modify: `src/components/landing/HeroSection.tsx`
- Apply `text-glow` class to headline in dark mode, `text-ink` class in light mode
- Conditional via `className={isDark ? 'text-glow' : 'text-ink'}`

### Modify: `src/components/landing/BentoGridSection.tsx`
- Apply the same text effect to the section title "Why EnglEuphoria?"

### Modify: `src/components/landing/IntelligenceSection.tsx`
- Apply to the section headline

---

## 6. Signature Oversized Footer

### Modify: `src/components/landing/FooterSection.tsx`

**Below the existing footer content, add:**
- A full-width div containing "ENGLEUPHORIA" in massive text (`text-[120px] md:text-[200px] lg:text-[280px]`)
- `font-display font-extrabold uppercase leading-none`
- The text overflows the bottom of the viewport: `overflow-hidden` on the container, text shifted down so only the top ~60% is visible
- Color: very faint -- `text-slate-200/10` (dark) / `text-slate-900/[0.03]` (light) -- ghostly watermark feel
- Below the text, a small tagline centered: "The last English platform you will ever need." in `text-sm text-slate-500`
- `user-select: none` and `pointer-events: none` since it is decorative

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/components/landing/HeroSection.tsx` | Euphoria Ring, film grain overlay, new copy, text glow/ink |
| Modify | `src/components/landing/BentoGridSection.tsx` | Parallax scroll offsets, cursor micro-glow, text effects |
| Modify | `src/components/landing/IntelligenceSection.tsx` | Mentor Spotlight with radar overlay, text effects |
| Modify | `src/components/ui/ThemeModeToggle.tsx` | Circle ripple theme transition |
| Modify | `src/components/landing/FooterSection.tsx` | Oversized signature logo + tagline |
| Modify | `src/index.css` | text-glow and text-ink utility classes |

---

## Technical Notes

- The film grain uses an inline SVG filter (`feTurbulence`) rather than an image file -- zero network requests, tiny DOM footprint
- The parallax effect uses framer-motion's `useScroll` + `useTransform` which are GPU-accelerated and performant
- The cursor micro-glow uses a single absolutely-positioned div per card with `pointer-events: none` -- no extra DOM nodes on mouse move, just a style update
- The circle ripple transition uses CSS `clip-path` which is hardware-accelerated in all modern browsers
- The mentor spotlight portrait reuses existing Unsplash URLs already loaded in the page, so no additional network requests
- The oversized footer text uses pure CSS text sizing with `overflow: hidden` -- no images or canvas needed
- All new features respect the dual-mood theme system and the no-AI brand rule
- No new dependencies required

