

## Plan: Refine the Curriculum Engine — Stars, Mastery Gate, and Review Lessons

Most of the infrastructure you described is already built (3-lesson cycle, Map of Sounds, Unit Roadmap, AI Wizard prompts). This plan focuses on the **gaps**: the star-based progress visualization, the Mastery Check gate at Lesson 3, and the Review Lesson mechanism.

---

### What Already Exists (No Changes Needed)

- Database: `curriculum_lessons` has `cycle_type`, `phonics_focus`, `vocabulary_list`, `grammar_pattern`, `skills_focus`
- `student_phonics_progress` table with mastery tracking trigger
- `MapOfSounds.tsx` with phoneme grid and gold mastery indicators
- `LessonCyclePreview.tsx` (Teacher Guide view)
- `curriculum-expert-agent` with the "Slowly-Slowly" 3-lesson cycle prompt
- `CurriculumGeneratorWizard` saving cycle metadata to DB

---

### Step 1 — Star-Based Unit Progress (UnitRoadmap Enhancement)

**File**: `src/components/student/curriculum/UnitRoadmap.tsx`

Replace the current dot/circle icons with a **3-star system**:
- Empty star = lesson not completed
- Filled gold star = lesson completed
- When all 3 stars are filled, the entire unit card turns gold with a trophy icon (already partially implemented)

This is a visual-only change to the existing component.

---

### Step 2 — Mastery Check Gate (Database + UI)

**Migration**: Add a `mastery_check_passed` boolean column to `interactive_lesson_progress` for Bridge lessons (Lesson 3).

**Logic**: When a student completes Lesson 3 (Bridge):
- Check if the student can independently produce the target question pattern (e.g., "What is it?")
- If passed → unit marked complete, next unit unlocked
- If failed → flag for "Review Lesson" before advancing

**UI**: Add a mastery gate indicator on the UnitRoadmap — a lock icon on the next unit if the previous unit's Bridge lesson mastery check hasn't passed.

**Files**:
- `src/components/student/curriculum/UnitRoadmap.tsx` — add gate logic between units
- New migration for `mastery_check_passed` column

---

### Step 3 — Review Lesson Flagging

**Migration**: Add `is_review` boolean to `curriculum_lessons` (default false).

When the AI Wizard detects a mastery check failure, it suggests inserting a "Review Lesson" — a condensed recap of the unit's phonics, vocabulary, and grammar before allowing progression.

**AI Prompt Update**: Add to the `curriculum-expert-agent` Edge Function:
- "If a student fails the Mastery Check at Lesson 3, generate a Review Lesson that revisits the unit's phoneme, 5 core nouns, and question pattern in a single 30-minute session."

**Files**:
- `supabase/functions/curriculum-expert-agent/index.ts` — add review lesson generation mode
- `src/components/student/curriculum/UnitRoadmap.tsx` — show review lesson node when flagged

---

### Step 4 — Sharpen AI Focus Ratios

**File**: `supabase/functions/curriculum-expert-agent/index.ts`

Update the `ECA_CURRICULUM_STRUCTURE_PROMPT` to explicitly encode the 80% focus ratios:

```text
Lesson 1 (Discovery): 80% Phonics/Noun accuracy, 20% basic recognition
Lesson 2 (Ladder): 80% Sentence building/Grammar, 20% vocabulary reinforcement  
Lesson 3 (Bridge): 80% Student production/Speaking, 20% teacher guidance
```

Also add the Mastery Check instruction: "At the end of every Lesson 3, include a `masteryCheck` field with the target question the student must independently produce."

---

### Step 5 — Map of Sounds Integration with Unit Completion

When all 3 lessons in a unit are completed AND mastery check is passed:
- The corresponding phoneme in the Map of Sounds turns Gold
- This is already partially wired via the `update_phonics_on_lesson_complete` trigger, but needs refinement to only set `mastered` after Lesson 3 passes

**File**: Migration to update the trigger logic to check `mastery_check_passed` before advancing to `mastered` level.

---

### Summary of Changes

| Area | Action |
|------|--------|
| `UnitRoadmap.tsx` | Stars instead of dots, mastery gate between units |
| Migration | Add `mastery_check_passed` to progress, `is_review` to lessons |
| Edge Function | Add 80% focus ratios, mastery check field, review lesson mode |
| Phonics trigger | Gate `mastered` level behind mastery check |

### Files to Modify
- `src/components/student/curriculum/UnitRoadmap.tsx`
- `supabase/functions/curriculum-expert-agent/index.ts`

### Files to Create
- Database migration (mastery_check_passed + is_review columns)

