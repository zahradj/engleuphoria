
# Phase 11: Academy Dashboard "Creator Space" + Hub Dashboard "Executive Suite"

## Executive Summary

Both dashboards already have strong foundations built in Phase 10. This phase adds the **three missing interactive features** the user requested that don't yet exist in the codebase, plus verifies that the "Traffic Controller" routing is properly wired.

---

## Audit: What Already Exists

### Academy Dashboard (`AcademyDashboard.tsx`)
- Dark mode with purple/cyan neon palette — done
- Card-based layout with sidebar nav — done
- `DailyChallengeCard` (social-post style challenge) — done
- `DailyStreakCard` — done
- Global Leaderboard with Weekly/Monthly/All-Time tabs and rank-change indicators — done
- `SocialLounge` (Discord-style channels) — done

### Hub Dashboard (`HubDashboard.tsx`)
- Clean Apple-style white/slate-gray with Emerald accents — done
- `SkillsRadarChart` (Speaking, Listening, Reading, Writing, Grammar, Vocabulary) — done
- `BusinessMilestonesCard` — done
- Resources section with downloadable PDFs — done
- "Next Session" card with Join button — done

### DashboardRouter (`DashboardRouter.tsx`)
- Routes `systemId: 'kids' | 'teen' | 'adult'` to the correct dashboard — done
- Integrated into `StudentPanel` and the student routes — done

---

## What Needs to Be Built

### Gap 1 — Academy: "Record a Clip" with AI Confidence Score

**New component**: `src/components/student/academy/RecordClipWidget.tsx`

This widget will:
- Display a microphone button with a pulsing recording animation (Framer Motion)
- Use the browser's `MediaRecorder` API to capture a short voice clip (max 30 seconds)
- Show a waveform-style animation while recording
- On stop, display a simulated "AI Confidence Score" breakdown card:
  - Pronunciation: e.g. 82%
  - Fluency: e.g. 74%
  - Grammar: e.g. 91%
  - Overall Confidence: e.g. 82%
- Show a progress ring for the overall score with a color-coded badge (green = 80+, yellow = 60–79, red < 60)
- Include a "Try Again" button and encouraging feedback message

The widget integrates into `AcademyDashboard.tsx` in the left column, placed between the "Continue Learning" card and the bottom section.

### Gap 2 — Academy: Skill XP Progress Bars (Slang, Grammar, Fluency)

**New component**: `src/components/student/academy/SkillXPBars.tsx`

A compact card showing three animated progress bars:
- Slang (e.g., 340 XP / 500 XP to next level)
- Grammar (e.g., 580 XP / 800 XP)
- Fluency (e.g., 210 XP / 500 XP)

Each bar uses Framer Motion for a smooth fill animation on mount. Replaces the "Stars" concept entirely with "XP" for teens.

Integrated into the Academy Dashboard right sidebar, above the Leaderboard card.

### Gap 3 — Hub: Learning Velocity Line Chart

**New component**: `src/components/student/hub/LearningVelocityChart.tsx`

A Recharts `LineChart` showing:
- X-axis: last 7 days (Mon → Sun)
- Two lines:
  - "Hours Studied" (actual) — emerald green
  - "Daily Goal" (target) — dashed slate
- Fill area under the "Hours Studied" line
- Tooltip showing exact hours for each day
- Summary metric below: "You've studied X hrs this week. Goal: Y hrs."

Integrated into the Hub Dashboard main content column, beneath the `SkillsRadarChart`.

### Gap 4 — Hub: Calendar Integration Buttons ("Add to Calendar")

**Enhancement** to the existing "Next Session" card in `HubDashboard.tsx`:
- Add two small icon buttons: "Add to Google Calendar" and "Add to Outlook"
- Google Calendar link: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...`
- Outlook link: `https://outlook.live.com/calendar/0/deeplink/compose?subject=...&startdt=...`
- Both open in a new tab

### Gap 5 — Hub: Weekly Briefing AI Card

**New component**: `src/components/student/hub/WeeklyBriefingCard.tsx`

A card styled like an executive report with:
- Header: "📊 Your Weekly Briefing"
- Main insight: e.g., "You improved your professional tone by 15% this week."
- Focus area recommendation: "Next focus: Negotiation Vocabulary"
- Three supporting data points displayed as mini stat pills:
  - Sessions this week: 4
  - Avg session score: 87%
  - Streak: 12 days
- Visual trend arrow (up/down) for improvement metric
- Subtle gradient background (emerald → teal)

Integrated into the Hub Dashboard right sidebar, at the top.

### Gap 6 — Traffic Controller Validation

**Check and fix** `DashboardRouter.tsx`:

The router currently maps `systemId` values (`'kids'`, `'teen'`, `'adult'`). The `student_profiles.student_level` column stores `'playground'`, `'academy'`, `'professional'`. The mapping between them happens somewhere upstream (in `AuthContext` or profile-loading hooks). We need to confirm the bridge is correct and, if not, add a fallback mapping inside `DashboardRouter` that also accepts the `student_level` string directly.

---

## Technical Details

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/student/academy/RecordClipWidget.tsx` | Voice recording + AI Confidence Score display |
| `src/components/student/academy/SkillXPBars.tsx` | XP progress bars for Slang, Grammar, Fluency |
| `src/components/student/hub/LearningVelocityChart.tsx` | Line chart: hours studied vs. goal (7-day view) |
| `src/components/student/hub/WeeklyBriefingCard.tsx` | Executive AI insight card for adults |

### Files to Modify

| File | Change |
|------|--------|
| `src/components/student/dashboards/AcademyDashboard.tsx` | Import and place `RecordClipWidget` (left column) + `SkillXPBars` (right sidebar above leaderboard) |
| `src/components/student/dashboards/HubDashboard.tsx` | Import and place `LearningVelocityChart` (main column) + `WeeklyBriefingCard` (right sidebar top) + enhance "Next Session" card with calendar buttons |
| `src/components/student/dashboards/DashboardRouter.tsx` | Expand type handling to also accept `'playground' | 'academy' | 'professional'` as aliases, ensuring the correct dashboard is always served |

### No Database Migration Required

All new features use:
- Client-side state for the recording flow
- Mock/computed data for the Confidence Score (no external AI call — presented as "AI-analyzed" with a realistic delay using `setTimeout`)
- Existing `student_profiles` data for XP and skill levels
- Recharts (already installed) for the Learning Velocity chart
- Computed values from existing `weeklyActivity` data for the Hub velocity chart

---

## Design Specifications

### Academy — RecordClipWidget
- Dark background (`bg-[#1a1a2e]`) with purple/cyan neon border
- Recording button: large pulsing red circle when active, purple gradient when idle
- Confidence Score ring: `stroke-dashoffset` SVG circle animated to the score value
- Font: inherit from AcademyDashboard (system sans, neon accents)

### Academy — SkillXPBars
- Three rows with skill name, current XP / next level XP, and animated bar
- Bar colors: Slang = magenta (`#E879F9`), Grammar = cyan (`#22D3EE`), Fluency = yellow (`#FBBF24`)
- Dark card background matching the dashboard

### Hub — LearningVelocityChart
- Recharts `AreaChart` with two datasets
- "Studied" line: solid emerald (`#10B981`), filled area at 20% opacity
- "Goal" line: dashed slate (`#94A3B8`)
- White/light background card matching the Hub's Apple aesthetic
- Responsive with `ResponsiveContainer`

### Hub — WeeklyBriefingCard
- Gradient background: `from-emerald-50 to-teal-50` (light) / `from-emerald-900/30 to-teal-900/30` (dark)
- Bold improvement percentage with upward arrow icon in green
- Focus recommendation in a pill badge
- Clean Inter/system font, compact padding
