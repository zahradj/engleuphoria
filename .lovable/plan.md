# Cycle 2 — The Adaptive Dashboard

A unified, hub-themed `/dashboard/:hub` experience built on the existing `StudentDashboard` shell. One Hero (Dual-Engine Progress) + four rooms (Recap, Vocabulary & Phonics, Speaking Studio, Graded Library), all driven by a single **Active Theme** signal.

Hub theming uses existing tokens — Playground orange, Academy purple, Success emerald — so the same components re-skin per route.

---

## What already exists (reused, not rebuilt)

- `student_xp`, `student_learning_streaks`, `learning_streaks` — XP + streaks
- `post_class_feedback` — teacher recap source
- `student_vocabulary_progress`, `student_phonics_progress` — Vocab Vault + Phonics
- `library_assets`, `lesson_library_view` — Graded Library
- `curriculum_lessons` + `student_curriculum_progress` — current unit (Active Theme fallback)
- `elevenlabs-tts` edge function — Phonics "Listen" buttons
- `SpeakingPractice` page — replaced (not extended) per your direction

---

## Phase 0 — Active Theme resolver (the spine)

A single hook `useActiveTheme(studentId)` that returns:
```ts
{ theme: string, source: 'feedback' | 'curriculum', tags: string[], unitId, recapId }
```
Logic: read latest `post_class_feedback` within 7 days → if present, use its `theme` / `tags`. Else fall back to the student's active `curriculum_lessons.unit` topic. Cached in React Query (5-min stale).

Every Phase 1–4 widget consumes this hook. One source of truth, no drift.

---

## Phase 1 — Hero: Dual-Engine Progress + Recap Card

Top of dashboard, hub-themed gradient card.

**Left half — Academic Engine**
- "Welcome back, {name}!" greeting
- **CEFR bar** showing position between current and next level (e.g. A2 → B1). Reads from a new `student_cefr_progress` table (% per level, advanced only by teacher feedback or milestone test).
- Subtitle: "Active Theme this week: {theme}"

**Right half — Dopamine Engine**
- 🔥 Streak count from `student_learning_streaks`
- ⭐ XP total from `student_xp` with golden coin
- Tiny "+10 today" delta

**Below Hero — Last Class Recap card**
- Pulled from latest `post_class_feedback`: "What you nailed", "What we'll work on", "Your homework theme"
- CTA buttons: "Start Vocab" → Phase 2, "Record Homework" → Phase 3

### XP earning rules (server-enforced via edge function `award-xp`)
| Action | XP |
|---|---|
| Phonics word listened | +10 |
| Vocab quiz pass | +25 |
| Speaking homework submitted | +50 |
| Library story read | +30 |
| Live class attended | +100 |

Streak increments on first XP event of a new calendar day (student timezone), resets on missed day.

---

## Phase 2 — Smart Vocabulary & Phonics Room

Route: `/dashboard/:hub/vocab` (replaces random flashcards in Vocab Vault).

- Reads `useActiveTheme()` → fetches 10–15 words tagged with that theme from `student_vocabulary_progress` joined to a new `vocabulary_bank` lookup (theme, word, ipa, definition, example).
- Each word card: word, IPA, "🔊 Listen" button (calls `elevenlabs-tts` with cached audio per word in Storage bucket `phonics-audio`).
- After 10 words listened → auto-launches a 5-question mini-quiz (multiple choice + audio match). Pass = +25 XP, words promoted in Vocab Vault sticker progress.
- Existing Vocabulary Vault sticker UI stays; this page is the *theme-filtered entry point*.

---

## Phase 3 — Speaking Studio (rebuilt)

Route: `/dashboard/:hub/speaking`. Replaces current `SpeakingPractice.tsx`.

- Gemini generates a custom prompt from `useActiveTheme()` via a new edge function `generate-speaking-prompt` (theme + CEFR level → 1-min prompt).
- In-browser MediaRecorder → uploads webm to new Storage bucket `student-speaking` at `{user_id}/{theme}/{timestamp}.webm`.
- Inserts row in new `speaking_submissions` table (student_id, teacher_id, theme, audio_path, prompt, duration_sec, status='pending').
- Teacher dashboard gets a "Pending Homework" badge (existing teacher feedback flow consumes it).
- Award +50 XP on submit.

---

## Phase 4 — Graded Library (smart filter)

Route: `/dashboard/:hub/library`. Refactors `LessonLibraryPage`.

- Filter pipeline: hub → CEFR level (from `student_cefr_progress`) → age bracket (from `users.age`) → optional theme match.
- Playground: only A1/A2 picture-heavy stories. Academy: A2–B2. Success: B1–C2 articles.
- Theme-matched assets get a "🎯 Matches your week" ribbon and float to top.
- Reading completion (scroll-to-end + 30s dwell) → +30 XP, logged in `library_reads` (new table).

---

## Database (one migration)

New tables:
- `student_cefr_progress` — student_id, level (A1–C2), percent_to_next (0–100), last_updated, updated_by_teacher_id
- `vocabulary_bank` — id, theme, word, ipa, definition, example, hub_scope[]
- `speaking_submissions` — id, student_id, teacher_id, theme, audio_path, prompt, duration_sec, status, created_at, teacher_feedback
- `library_reads` — student_id, asset_id, read_at, completed
- `xp_events` — student_id, action, xp, ref_id, created_at (audit trail powering daily XP delta)

Add columns:
- `post_class_feedback.theme` (text), `post_class_feedback.tags` (text[]) — if not already present

Storage buckets: `phonics-audio` (public, cached), `student-speaking` (private, RLS by user_id).

All tables get RLS: students read/write own rows; teachers read their assigned students; admin bypass.

---

## Edge functions (new)

1. `award-xp` — validates action, writes to `xp_events`, upserts `student_xp`, ticks `student_learning_streaks`. Single source of truth for XP/streak mutations.
2. `generate-speaking-prompt` — Gemini direct via `aiFetch`, takes `{theme, cefr_level, hub}`, returns prompt string.
3. `resolve-active-theme` — server helper used by hook (also callable from teacher dashboards for previews).

ElevenLabs TTS for vocab pronunciation reuses the existing `elevenlabs-tts` function with a cache key per `(word, voiceId)` in `phonics-audio` bucket.

---

## Routing additions (`src/App.tsx`)

Inside each `/dashboard/:hub/*` block, mount nested routes:
- `/` → new `<DashboardHero />` + recap + room launchers
- `/vocab` → `<VocabularyRoom />`
- `/speaking` → `<SpeakingStudio />`
- `/library` → `<GradedLibraryRoom />`

Hub-aware via existing `useStudentLevel()`. No URL params for roles (per Core memory).

---

## Hub theming

Single `<DashboardShell hub>` wrapper applies the right token set:
- Playground: `--primary: #FE6A2F`, accent `#FEFBDD`, kid-friendly icons, larger tap targets
- Academy: `--primary: #6B21A8`, accent `#F5F3FF`
- Success: `--primary: #059669`, accent `#F0FDFA`

All gradients/strokes flow from CSS vars — no per-component color literals.

---

## Out of scope (Cycle 3 candidates)

- Parent-visible CEFR certificates (only the bar ships now)
- Peer leaderboards
- Push notifications for streak risk
- Teacher-side UI for grading speaking submissions beyond a simple "pending" badge

---

## Files (high level)

**Create**
- `src/hooks/useActiveTheme.ts`, `useStudentXP.ts`, `useStudentStreak.ts`, `useCEFRProgress.ts`
- `src/components/dashboard/hero/DashboardHero.tsx`, `CEFRBar.tsx`, `XPStreakWidget.tsx`, `RecapCard.tsx`
- `src/components/dashboard/rooms/VocabularyRoom.tsx`, `SpeakingStudio.tsx`, `GradedLibraryRoom.tsx`
- `src/components/dashboard/DashboardShell.tsx` (hub-themed wrapper)
- `supabase/functions/award-xp/index.ts`, `generate-speaking-prompt/index.ts`, `resolve-active-theme/index.ts`
- One migration for the 5 new tables + 2 buckets + RLS

**Edit**
- `src/App.tsx` — nested dashboard routes
- `src/pages/StudentDashboard.tsx` — render `<DashboardShell>` + outlet
- `src/pages/student/SpeakingPractice.tsx` — redirect to new `/dashboard/:hub/speaking`
- `src/pages/dashboard/LessonLibraryPage.tsx` — pipe through smart filter
