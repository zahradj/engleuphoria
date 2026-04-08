

## Plan: Living Roadmap — Time-Aware Theme System

Adds a timezone-synced "Living Roadmap" that shifts visuals between Day (6AM–6PM) and Night (6PM–6AM) modes, plus a spotlight effect for the lesson player.

---

### Step 1 — Time-of-Day Hook

**New file**: `src/hooks/useTimeOfDay.ts`

A lightweight hook that reads `new Date().getHours()` and returns `'day' | 'night'` (day = 6–17, night = 18–5). Re-checks every 60 seconds via `setInterval`. Also exposes `isDaytime` boolean and `currentHour`.

---

### Step 2 — Living Roadmap Visuals

**Modify**: `src/components/student/curriculum/UnitRoadmap.tsx`

- Import `useTimeOfDay`
- Wrap the Card in a container with conditional classes:
  - **Day**: `bg-gradient-to-b from-sky-50 to-amber-50` with warm border accents. Add subtle SVG/emoji ambient elements (birds, sun icon in header).
  - **Night**: `bg-gradient-to-b from-indigo-950 to-slate-900` with glow effects on completed stars (`drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]`). Add moon icon, firefly-like animated dots.
- Gold-completed unit cards get a lantern glow at night (`shadow-[0_0_20px_rgba(251,191,36,0.3)]`).
- Add a small Sun/Moon indicator in the card header showing current mode.

---

### Step 3 — Map of Sounds Night Glow

**Modify**: `src/components/student/curriculum/MapOfSounds.tsx`

- Import `useTimeOfDay`
- At night: mastered phonemes get a constellation-style glow effect (subtle animated `box-shadow` pulse). Card background shifts to deep blues.
- At day: standard bright palette, no changes from current.

---

### Step 4 — Lesson Player Spotlight Effect

**Modify**: `src/components/lesson-player/LessonPlayerContainer.tsx`

- Add a `spotlightActive` state that dims the shell background and adds a radial gradient "focus ring" around the main content card when active.
- The spotlight can be toggled by the teacher or auto-enabled during interactive slides.
- CSS: overlay `bg-black/40` with a `radial-gradient(circle at center, transparent 300px, rgba(0,0,0,0.5) 300px)` effect.

---

### Step 5 — Ambient Animations in Tailwind

**Modify**: `tailwind.config.ts`

Add keyframes and animation classes:
- `firefly`: subtle floating glow dots for night mode
- `sway`: gentle tree/element swaying for day mode
- `lantern-glow`: pulsing warm glow for night unit cards

---

### Summary

| Area | Action |
|------|--------|
| New hook | `useTimeOfDay.ts` — returns day/night based on local time |
| UnitRoadmap | Day/night gradient backgrounds, ambient icons, star glow at night |
| MapOfSounds | Constellation glow on mastered phonemes at night |
| LessonPlayer | Spotlight/focus ring effect on content card |
| Tailwind config | `firefly`, `sway`, `lantern-glow` animation keyframes |

### Files to Create
- `src/hooks/useTimeOfDay.ts`

### Files to Modify
- `src/components/student/curriculum/UnitRoadmap.tsx`
- `src/components/student/curriculum/MapOfSounds.tsx`
- `src/components/lesson-player/LessonPlayerContainer.tsx`
- `tailwind.config.ts`

