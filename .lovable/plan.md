

## Plan: Smart Sequence Engine — Interleaved Review, Mastery Milestone, and Vocabulary Vault

This plan adds the missing "smart" layers on top of the existing 3-lesson cycle: spaced repetition logic, the end-of-unit Mastery Milestone (Review + Integrated Quiz), a Vocabulary Vault tracker, and the certification sticker system.

---

### What Already Exists (No Changes)

- 3-lesson cycle (Discovery/Ladder/Bridge) with `cycle_type` in `curriculum_lessons`
- `mastery_check_passed` on `interactive_lesson_progress`
- `is_review` flag on `curriculum_lessons`
- `student_phonics_progress` with mastery trigger
- `UnitRoadmap.tsx` with 3-star system and mastery gate
- `MapOfSounds.tsx` with phoneme grid
- `curriculum-expert-agent` with 80% focus ratios and review lesson mode

---

### Step 1 — Vocabulary Vault (Database + UI)

**Migration**: Create `student_vocabulary_progress` table:
- `id`, `student_id` (references auth.users), `word`, `unit_id`, `first_seen_at`, `times_reviewed` (int), `last_reviewed_at`, `mastered` (boolean)

**Trigger**: When a lesson is completed, insert/update vocabulary entries from the lesson's `vocabulary_list` JSON column.

**UI**: New `VocabularyVault.tsx` component showing all learned words grouped by unit, with mastery badges. Integrate into `StudentPanel.tsx`.

---

### Step 2 — Interleaved Review in AI Prompt

**File**: `supabase/functions/curriculum-expert-agent/index.ts`

Update `ECA_CURRICULUM_STRUCTURE_PROMPT` to add:

```text
INTERLEAVED REVIEW RULE:
Every Lesson 1 (Discovery) of a NEW unit MUST include 2 vocabulary words 
from the PREVIOUS unit in its warm-up activities to ensure long-term retention.
Include a "reviewWords" field in the lesson JSON with 2 words from the prior unit.
```

Also add the **Balanced Skill Output** requirement — every lesson must specify tasks for all 4 skills:
- `listeningTask`: a decoding task
- `speakingTask`: a "Record & Compare" task
- `readingTask`: a CVC word blending task
- `writingTask`: a tracing or typing task

---

### Step 3 — Mastery Milestone (End-of-Unit Review + Quiz)

**AI Prompt**: Add a new mode `mastery_milestone` to the edge function that generates a two-part session:

**Part 1 — Systematic Review** (10 min):
- Rapid-fire review of 15 vocabulary words (5 per lesson)
- 3 grammar pattern checks
- Phoneme identification under time pressure

**Part 2 — Integrated Quiz** (20 min):
- Listening: Minimal pair testing (e.g., "Pin" vs "Pen")
- Speaking: Student must initiate a conversation using Lesson 3's target question
- Reading: CVC word decoding check
- Writing: Fill-in missing letter
- Grammar: Sentence unscrambling

**Scoring**: Calculate percentage across all skills. Store in a new `mastery_milestone_results` table with `student_id`, `unit_id`, `score`, `passed` (>=80%), `skill_scores` (JSON), `completed_at`.

**Data Lock Logic**: If score >= 80%, set `mastery_check_passed = true` on the Bridge lesson progress, unlock next unit, turn Map of Sounds island Gold. If < 80%, flag the weakest skill and auto-suggest a Reinforcement Lesson targeting that skill.

---

### Step 4 — Quiz Icon on UnitRoadmap

**File**: `src/components/student/curriculum/UnitRoadmap.tsx`

After the 3 lesson stars, add a 4th icon: a trophy/quiz badge that appears at the end of each unit's path. States:
- Grey/locked: lessons not all completed
- Blue/available: all 3 lessons done, quiz not taken
- Gold: quiz passed (>=80%)
- Red flag: quiz failed, reinforcement needed

---

### Step 5 — Unit Mastery Sticker / Certificate

**Migration**: Create `student_achievements` table: `id`, `student_id`, `unit_id`, `achievement_type` (enum: 'unit_mastery', 'phoneme_mastery'), `earned_at`, `sticker_name`.

When a student passes the Mastery Milestone (>=80%), insert an achievement record and display a celebratory sticker on their profile/dashboard.

**UI**: Add an `Achievements` section to the student dashboard showing earned stickers.

---

### Step 6 — Bridge Retrieval Pop Quiz

Update the AI prompt so that every Lesson 1 of a new unit begins with a 5-minute "Bridge Retrieval" pop quiz — 5 quick questions from the previous unit to activate spaced repetition before introducing new content. Add `bridgeRetrieval` field to the lesson JSON.

---

### Summary of Changes

| Area | Action |
|------|--------|
| Migration | `student_vocabulary_progress`, `mastery_milestone_results`, `student_achievements` tables |
| Edge Function | Interleaved review rule, balanced skills, mastery milestone mode, bridge retrieval |
| `UnitRoadmap.tsx` | Quiz icon at end of unit path |
| New: `VocabularyVault.tsx` | Word tracker with mastery badges |
| New: `MasteryMilestone.tsx` | Review + Quiz UI component |
| New: `Achievements.tsx` | Sticker display on student dashboard |
| `StudentPanel.tsx` | Integrate Vocabulary Vault and Achievements |

### Files to Create
- `src/components/student/curriculum/VocabularyVault.tsx`
- `src/components/student/curriculum/MasteryMilestone.tsx`
- `src/components/student/curriculum/Achievements.tsx`
- Database migration (3 new tables + vocabulary trigger)

### Files to Modify
- `src/components/student/curriculum/UnitRoadmap.tsx` — add quiz icon
- `supabase/functions/curriculum-expert-agent/index.ts` — interleaved review, balanced skills, milestone mode
- `src/components/student/StudentPanel.tsx` — integrate new widgets

