# Playground Placement Test — Image Cards & Gamified Animations

Upgrade the kids' picture quiz to use real images instead of emojis, with playful but non-punishing animations, smoother question transitions, and a calmer background.

## What changes

**Files touched:**
- `src/components/placement/PlaygroundPlacementPhase.tsx` — full UI overhaul
- `src/components/student/PlacementGatekeeper.tsx` — tone down the background only when the active hub is Playground
- `public/placement/` — new folder containing the image set (committed, not generated at runtime)

## 1. Image library (40 PNGs, one per answer option)

Generate a single batch of square (512×512) flat-illustration PNGs with transparent background and bright kid-friendly colors. Subjects:

```
animals    : dog, cat, rabbit, bird
colors     : blue-square, green-square, red-square, yellow-square
fruits     : banana, apple, grapes, orange
sky        : moon, star, cloud, sun
food       : pizza, milk, cookie, bread
actions    : standing, running, jumping, sleeping
counting   : one-apple, two-apples, three-apples, four-apples
sentences  : happy-dog (×4 — same image for the 4 grammar variants)
ice-cream  : ice-cream-cone (×4 for the verb-form question)
clocks     : clock-1, clock-2, clock-3, clock-4
```

Use the existing `ai-image-generation` edge function (Gemini) or `generate-playground-images` to produce them, then commit to `/public/placement/{name}.png`. No runtime fetching — instant load, zero cost per session.

## 2. Schema change

Replace `{ emoji, label }` with `{ image: string; label: string }` in `PICTURE_QUESTIONS`. The 10 questions stay the same; only the option representation changes. The grammar/verb questions where all four options shared the same emoji also share the same image — text differentiates them.

## 3. Card redesign

Each option becomes an Image Card:
- `aspect-square`, `rounded-2xl`, `shadow-md`, white background `bg-white`
- Image fills the card via `object-cover`
- Label sits in a clean white pill (`bg-white/95 rounded-full px-3 py-1 text-slate-800 font-semibold text-sm`) anchored to the bottom of the card with a small margin
- Border softens to `border border-slate-200` instead of the current translucent white-on-color

## 4. Framer Motion gamification

```tsx
<motion.button
  initial={{ opacity: 0, scale: 0.8, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 300, damping: 22 }}
  whileHover={{ scale: 1.05, y: -5 }}
  whileTap={{ scale: 0.95 }}
>
```

- Stagger entrance (cards pop in one by one, ~80ms apart)
- Hover lift + scale (desktop)
- Tap squish (mobile feels tactile)
- Question container wrapped in `<AnimatePresence mode="wait">` with horizontal slide:
  - Exit: `{ x: '-100%', opacity: 0 }`
  - Enter: `{ x: '100%' } → { x: 0 }`

## 5. Non-punishing feedback

- Remove all rose/red "wrong" styling
- On click: selected card gets `ring-4 ring-orange-400` glow + a `Sparkles` pop badge regardless of correctness
- Keep correctness logging in `results` for the placement algorithm
- Replace incorrect feedback wording: instead of "This is X" with amber tone, show neutral encouragement: "Nice try! Let's keep going ✨" — the right answer is silently logged, no shaming
- Slightly faster auto-advance (1.1s instead of 1.6s) since there's no error to read

## 6. Calmer background

Currently the welcome/quiz wrapper uses `bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400` (very saturated). Soften it for the playground hub only:

- Change to `bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-50` (pastel)
- Drop the two ambient blob opacities from `0.30 / 0.20` to `0.15 / 0.10`
- Header text in the test panel switches from `text-white` to `text-slate-800` for contrast on the new lighter card surface
- Star progress: change inactive `text-white/20` → `text-amber-200`, active stays gold

Academy/Professional themes remain unchanged.

## Technical details

- The `TestResult` interface and the parent `PlacementGatekeeper` flow stay identical — only visuals change. No DB migration, no scoring changes.
- Image paths use Vite's `/public` serving (`/placement/cat.png`) so they're cached by the browser/SW after first visit.
- Total added weight: ~40 PNGs × ~25 KB (flat illustrations) ≈ 1 MB, lazy-loaded per question via `loading="lazy"` so the first question only fetches 4.
- Accessibility: `<img alt={label}>` and `aria-label` on the button, plus a `role="img"` fallback for the rare `aria-pressed` state.

## Out of scope

- Audio/sound effects (memory says sound system exists; can wire later if you want)
- The non-Playground TestPhase (this plan only touches the kids' picture quiz)
- New questions or scoring algorithm changes
