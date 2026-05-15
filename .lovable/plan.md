
# Three fixes for the classroom + boot loop

## 1. Match student star strip to the teacher's

`src/components/student/classroom/StudentClassroomHeader.tsx` (lines 105-124) currently:
- Hides the star row below `lg`
- Uses tiny `h-4 w-4` stars with a number stamped on top
- Uses `fill-muted` / no glow

Update it to match `src/components/teacher/classroom/ClassroomTopBar.tsx` (lines 172-188):
- Always visible (drop the `hidden lg:flex`)
- `h-7 w-7`
- Earned stars get `drop-shadow-[0_0_4px_hsl(var(--classroom-reward)/0.6)] scale-110`
- Remove the `1..10` number overlay
- Same pill container (`px-4 py-1.5`, gap-1.5)

## 2. Remove the three text overlays from the slide stage

These show on the student stage and clutter the slide:

- **"Teacher is presenting" pill** → delete the whole `role === 'student'` badge block at `src/components/classroom/stage/MainStage.tsx` lines 114-125.
- **"However / Furthermore / Nevertheless" target words** → remove the `<TargetWordsOverlay …/>` line at `src/components/student/classroom/StudentMainStage.tsx:195` (keep teacher's intact unless you want it gone there too — confirm below).
- **"Pro Tip: Use transition words…" Smart Summary tip** → remove the `<SmartSummaryTip …/>` line at `src/components/student/classroom/StudentMainStage.tsx:196`.

Files left untouched (`TargetWordsOverlay.tsx`, `SmartSummaryTip.tsx`) — just unmounted on the student side.

## 3. Boot loop / "site keeps loading" — root cause + fix

Symptom in console: every page load logs `Auth initialization timeout (6s) - forcing loading = false with fallback role`. That message only fires when `supabase.auth.getSession()` (or the awaited `fetchUserFromDatabase` after it) has not resolved within 6 s — so the spinner sits on `HomeGate` for the full 6 s every time.

Diagnosis from the code in `src/contexts/AuthContext.tsx`:

- `initializeAuth` registers the auth listener, then does `await supabase.auth.getSession()` and **then** `await fetchUserFromDatabase(...)` before flipping `setLoading(false)`. If either step is slow (cold edge, stalled token refresh, slow `users` row fetch), the whole UI is blocked.
- `fetchUserFromDatabase` does **two sequential awaits**: a `users` `.single()` then `fetchUserRoleFromDatabase` (which itself does two queries). On a fresh connection this routinely exceeds 6 s.
- Even when there is no session at all, the listener's `INITIAL_SESSION` is short-circuited but `getSession()` is still awaited — so a single slow auth network call freezes the app.
- The 6 s safety timeout exists but it just sets a fallback user; the real boot path is still pending in the background, and `HomeGate` already navigated, causing the "keeps loading" feel.

Fix:

1. **Stop blocking render on the DB fetch.** In `initializeAuth`, after `getSession()`:
   - If no session → `setUser(null); setLoading(false)` immediately.
   - If session → `setUser(await createFallbackUser(currentSession.user))` (synchronous from auth metadata), `setLoading(false)`, **then** kick off `fetchUserFromDatabase` in the background and `setUser(dbUser)` when it resolves. This is the same pattern already used inside the `SIGNED_IN` listener branch but missing from initial load.
2. **Race `getSession` against a 1.5 s timeout** so a stalled auth network call can't freeze boot. On timeout, fall through to "no session" and let the listener catch up when it arrives.
3. **Parallelize role + profile** inside `fetchUserFromDatabase` (`Promise.all`) to roughly halve the worst-case wait when it does run.
4. **Lower the visible spinner threshold** in `HomeGate` — show `LandingPage` after 800 ms even if auth is still loading and no session has surfaced yet (logged-out users should never see a 6 s spinner).
5. Keep the existing 6 s safety timeout as the last line of defense, but log it as an error (not warn) so it's noticeable in prod.

After the change: logged-out users hit `LandingPage` in <1 s, logged-in users see their dashboard immediately with a fallback role and the real role swaps in transparently.

## Files

Edit only:
- `src/components/student/classroom/StudentClassroomHeader.tsx`
- `src/components/classroom/stage/MainStage.tsx`
- `src/components/student/classroom/StudentMainStage.tsx`
- `src/contexts/AuthContext.tsx`
- `src/components/auth/HomeGate.tsx`

No DB migration, no edge function, no new files.

## Quick question before I build

For the "However / Furthermore / Nevertheless" words and the "Pro Tip" line — do you want them removed **for the teacher too**, or only for the student? I'll default to **student-only** if you don't reply.
