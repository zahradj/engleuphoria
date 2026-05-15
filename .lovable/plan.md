# Classroom Enhancement Pack v2

A focused, hub-aware upgrade to the live 1-on-1 classroom (`UnifiedClassroomPage` → `TeacherClassroom` / `StudentClassroom`) that lifts visual polish, engagement, teacher control, and the AI Co-Pilot **without** disturbing the realtime sync engine, slide player, or booking logic.

Applies universally across all three hubs (Playground / Academy / Success) via a single hub-theme token system.

---

## 1. Hub-Aware Classroom Theming (universal)

New file: `src/components/classroom/shared/useHubClassroomTheme.ts`

A single hook that returns CSS variables + Tailwind class fragments for the active `hubType`:
- Playground → orange/yellow primary, soft warm glass, playful radius (rounded-3xl)
- Academy → purple/blue primary, deep mesh-gradient glass, rounded-2xl
- Success → emerald/mint primary, sleek graphite glass, rounded-xl

Wired into:
- `ClassroomLayout.tsx` (background mesh + glass surfaces)
- `JoyfulClassroomHeader.tsx` (gradient bar + presence dot)
- `CenterStage.tsx` / `StudentMainStage.tsx` (slide frame ring + glow)
- `StarRewardsLine.tsx` (XP color)

No hard-coded colors — everything resolves through the hub token map and existing semantic tokens in `index.css`.

## 2. Student Engagement Layer

New file: `src/components/classroom/engagement/LiveReactionBar.tsx`
- Floating bottom-right reaction dock (👍 ❤️ 🎉 🤔 ❓)
- Broadcasts to a Realtime channel `classroom:{bookingId}:reactions`
- Animated emoji floats up over the slide for 1.5s on both sides

New file: `src/components/classroom/engagement/XPStreakIndicator.tsx`
- Compact pill in the student header showing current session XP + streak count
- Pulses on increment, hub-themed gradient

Mounted inside `StudentClassroom.tsx` (reaction bar + indicator) and `TeacherClassroom.tsx` (sees student reactions floating, plus a small mirror indicator).

## 3. Teacher HUD Polish

Edit: `src/components/teacher/classroom/ClassroomTopBar.tsx` and `InteractionToolsGrid.tsx`
- Reorganize the observation tag buttons (memory: Teacher Observation Tags) into a compact glassmorphic strip with hub gradient
- Add a "Spotlight Slide" toggle (already-existing prop wiring) with a clear active state
- Add a session timer pill that turns amber at <5 min and red at <1 min (uses existing `scheduled_at` + `duration`)

No business-logic changes — purely presentational + the timer pill component.

## 4. Floating Co-Pilot Upgrade

Edit: `src/components/classroom/FloatingCoPilot.tsx`
- Replace static layout with hub-themed glass card (uses the new theme hook)
- Add 3 quick-action chips above the input: "Explain mistake", "Give example", "Simpler phrasing"
- Each chip pre-fills the prompt and auto-submits to the existing AI tutor SSE stream
- Persist last 5 suggestions per session (in-memory) with a collapsible history

## 5. Security follow-ups (mandatory)

Address pending Supabase findings from the scanner:
- Drop `user_roles` "Temp allow updates" UPDATE policy; add admin-only UPDATE; restrict INSERT to `role IN ('student')`
- Replace `ai_lessons_ppp` UPDATE/DELETE policies with `created_by = auth.uid() OR has_role(auth.uid(),'admin')`
- Skip `realtime.messages` finding — modifying the `realtime` schema is forbidden by project rules; will be noted, not migrated

---

## Technical details

- Theme hook returns: `{ ringClass, gradientBg, accentText, accentBg, primaryHsl, glowShadow }`
- All gradients use HSL tokens (Playground `var(--playground-primary)`, etc.) — fall back to existing semantic tokens if a hub var is missing
- Reactions broadcast uses Supabase Realtime broadcast channel (no DB write) to keep latency low
- XP increments piggyback on the existing rewards line event bus — no new tables
- All new files are <120 lines; edits to existing files preserve glassmorphism classes per workspace rules

## Out of scope (intentionally)

- Whiteboard, video pipeline, slide engine internals
- Booking / cancellation logic
- New tables or schema changes (besides the security fixes)
- Routing changes

