

## Fix Hero Images: Replace with Illustrated SVG Characters + Pop-up Animation

### Problem
The AI-generated PNG images are large files that load slowly and don't look polished. The current crossfade animation is underwhelming.

### Solution
Replace the heavy PNG images with lightweight **illustrated SVG character compositions** built directly in JSX (no external files needed). Each character is a stylized, minimal illustration using the group's color palette. Add a satisfying **pop-up scale + bounce** entrance animation.

### Changes

#### 1. `HeroSection.tsx` — Replace images with inline SVG illustrations + pop-up animation

**Remove** the three PNG imports (`hero-kid.png`, `hero-teen.png`, `hero-adult.png`). Instead, create three simple illustrated character components inline:

- **Kids**: Colorful cartoon child with tablet, rounded shapes, orange/amber palette
- **Teens**: Stylized teen with headphones and laptop, indigo/violet palette
- **Adults**: Professional figure with briefcase, emerald/charcoal palette

Each rendered as a styled `div` composition using Tailwind classes and simple geometric shapes (circles for heads, rounded rectangles for bodies, gradient accents) — **zero external image loading**.

**Animation change**: Replace the current fade+slide with a dramatic **pop-up spring animation**:
```typescript
initial={{ opacity: 0, scale: 0.3, y: 60 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.8, y: -30 }}
transition={{ type: 'spring', stiffness: 200, damping: 20 }}
```

This gives a satisfying "pop in from below" with a subtle overshoot bounce.

#### 2. Delete unused assets
Remove `src/assets/hero-kid.png`, `src/assets/hero-teen.png`, `src/assets/hero-adult.png`.

### Files Changed

| File | Action |
|---|---|
| `src/components/landing/HeroSection.tsx` | Replace PNG images with inline SVG illustrations, add spring pop-up animation |
| `src/assets/hero-kid.png` | Delete |
| `src/assets/hero-teen.png` | Delete |
| `src/assets/hero-adult.png` | Delete |

