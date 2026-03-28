

## Dynamic Color-Coded Hero Section

### What Changes

The hero section carousel currently rotates through 3 images with no visual differentiation between student groups. This upgrade makes each group instantly recognizable with its own color palette and generates clean, transparent-background character images.

### Color Palette per Group (from brand guidelines)

```text
┌─────────────┬─────────────────────────────┬────────────┐
│ Group       │ Colors                      │ Accent     │
├─────────────┼─────────────────────────────┼────────────┤
│ Playground  │ #FF9F1C → #FFBF00           │ Orange/    │
│ (Kids <12)  │ warm gradients              │ Amber      │
├─────────────┼─────────────────────────────┼────────────┤
│ Academy     │ #6366F1 → #A855F7           │ Indigo/    │
│ (Teens)     │ electric blue/purple glow   │ Violet     │
├─────────────┼─────────────────────────────┼────────────┤
│ Professional│ #10B981 → #1E293B           │ Emerald/   │
│ (Adults)    │ deep navy + slate gold      │ Charcoal   │
└─────────────┴─────────────────────────────┴────────────┘
```

### Plan

#### 1. Generate 3 New Hero Images (AI Image API)
- **Kids**: Happy child with tablet, illustrated style, transparent/white background, no text
- **Teens**: Confident teenager with headphones and laptop, clean background, no text
- **Adults**: Professional in business setting, clean background, no text
- All images: PNG format, no background clutter, no writing/watermarks

#### 2. Rewrite `HeroSection.tsx` — Color Transitions
- Define a `GROUP_THEMES` config object mapping each slide index to its color scheme:
  - `gradient` (CTA button, headline accent)
  - `accentBg` (trust badge, stat icon backgrounds)
  - `glowColor` (decorative blurs)
  - `dotColor` (selector dots active color)
  - `label` and `tagline` per group
- When `activeImage` changes, all colors smoothly transition (CSS `transition-colors duration-700`)
- The headline accent span changes gradient per group
- CTA button gradient updates per group
- Background decorative blurs change hue per group
- Floating badge borders/accents tint to match active group

#### 3. Update Image Container
- Use `object-contain` instead of `object-cover` so transparent-background images display cleanly
- Remove the heavy gradient overlay on the image (no longer needed with clean backgrounds)
- Add a subtle colored glow/shadow behind each image matching its group color

#### 4. Slide Labels
- Add a visible label chip on the image area showing the active group name (e.g., "Kids 5–12", "Teens 13–17", "Adults 18+") styled in the group's color

### Files Changed

| File | Action |
|---|---|
| `src/assets/hero-kid.png` | Replace — new transparent-bg image via AI generation |
| `src/assets/hero-teen.png` | Create — new transparent-bg teen image |
| `src/assets/hero-adult.png` | Replace — new transparent-bg image via AI generation |
| `src/components/landing/HeroSection.tsx` | Rewrite carousel with per-group color theming and smooth transitions |

