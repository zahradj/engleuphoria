

# Plan — Lock Playground Schedule to 30 min + Fix Logo

## Problem
1. **Schedule (`/teacher` → Schedule tab)** uses `ClassScheduler` → `useAvailabilityManager` with a hardcoded default of **60 min** and a free 30/60 toggle in `SlotControlPanel`. This ignores `useTeacherHubRole`, so a Playground teacher can still create 60-min slots — violating the hub rule (Playground = 30 min only, Academy/Success = 60 min only).
2. **Logo** in `TeacherTopNav` and `ScrollHeader` uses the text-only `<Logo>` component ("Engleuphoria" gradient text). Every other page (`NavHeader`, `ProfessionalNav`, `TeachWithUsPage`, `HubLogo`, classroom top bar) uses the actual brand image (`logo-black.png` / `logo-white.png`) with theme-aware switching.

## Solution

### A. Lock schedule to hub-allowed duration
- **`useAvailabilityManager.ts`** — accept an optional `allowedDurations` arg; initialize `slotDuration` to `allowedDurations[0]`; clamp `setSlotDuration` so it can never be set to a non-allowed value.
- **`ClassScheduler.tsx`** — call `useTeacherHubRole(teacherId)`, derive `hubSpecialty` from `hubKind` automatically (Playground → `Playground`, academy → `Academy`, professional → `Professional`), pass `allowedDurations` into the manager and down to `SlotControlPanel`.
- **`SlotControlPanel.tsx`** — accept `allowedDurations` prop. If only one duration is allowed, replace the 30/60 toggle with a read-only "locked" pill ("🎪 Playground · 30-min slots only" or "📘 Academy · 60-min slots only"). Hide the unused option entirely.
- **`WeeklyCalendarGrid`** stays the same (it already renders based on `slotDuration`).

### B. Enhance Schedule visuals (consistent with new dashboard hero)
- **`SchedulerHeader.tsx`** — refresh with the same gradient/aurora treatment as `TeacherWelcomeHero`: rounded-3xl card, soft primary/accent blurs, hub badge, larger stat chips for Open / Booked counts. Keep it light — no extra dependencies.

### C. Fix the logo (single source of truth)
- **`Logo.tsx`** — replace the text rendering with the brand image. Use `useThemeMode` to swap `logo-black.png` (light) / `logo-white.png` (dark), exactly like `HubLogo` and `NavHeader`. Keep the same `size` API (`small | medium | large | xlarge` → fixed heights) and `onClick`/`className` behavior so every existing call site (TeacherTopNav, ScrollHeader, etc.) automatically gets the proper image logo. Drop the unused `variant` prop or leave it as a no-op.

This single change fixes the logo on the Playground teacher dashboard **and** anywhere else `<Logo>` is used, matching the rest of the site.

## Files to Modify
| File | Change |
|------|--------|
| `src/components/Logo.tsx` | Replace text with theme-aware brand image (logo-black/logo-white) |
| `src/components/teacher/scheduler/useAvailabilityManager.ts` | Accept `allowedDurations`, default to first allowed, clamp setter |
| `src/components/teacher/scheduler/ClassScheduler.tsx` | Use `useTeacherHubRole`, pass allowed durations + auto hubSpecialty |
| `src/components/teacher/scheduler/SlotControlPanel.tsx` | Conditionally show duration toggle; show locked pill when 1 option |
| `src/components/teacher/scheduler/SchedulerHeader.tsx` | Polished hero-style card, hub badge, stat chips |

## Expected Result
- Playground teachers on `/teacher` → **Schedule** can only create **30-min** slots; the 60-min option is gone, replaced by a clear "Playground · 30-min only" badge.
- Academy / Success teachers (Professional Hub) get the same treatment locked to **60 min**.
- The "Engleuphoria" text wordmark is replaced everywhere `<Logo>` is used (top nav, scroll header) by the official brand image, matching landing/professional/teach-with-us pages.
- The Schedule tab gets a refreshed, on-brand header that matches the new dashboard aesthetic.

