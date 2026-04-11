

# Fix: Force Progressive Dependency-Linked Curriculum Generation

## Problem
The curriculum generator sends the spiral skeleton as "context" to the AI, but the AI ignores it and generates random independent units. The fallback structure (used on AI failure) is also completely generic with no spiral logic. There is no validation that the AI output actually follows the dependency tree.

## Root Cause
1. The spiral skeleton is passed as a suggestion in the prompt, not enforced in code
2. The fallback generator creates random theme-based units with no phonics/grammar progression
3. No post-generation validation checks that Unit N references Unit N-1

## Solution: Skeleton-First Generation

Instead of asking the AI to "invent" a progressive structure, **use the hard-coded skeleton as the structural backbone** and only ask the AI to flesh out creative details (titles, vocabulary words, activity descriptions). The skeleton IS the curriculum map — the AI just decorates it.

### 1. Refactor `handleGenerate` in `CurriculumGeneratorWizard.tsx`

- Load the spiral skeleton for the selected age group/level
- Slice it to `config.unitCount` units, each with `config.lessonsPerUnit` lessons
- Send each unit to the AI individually (or in batch) with the skeleton fields pre-filled, asking only for: creative title, 5 vocabulary words, activity descriptions, and objectives
- Merge AI-generated details back into the skeleton structure
- If AI fails, the skeleton itself IS the fallback — it already has phonics goals, grammar goals, skill mixes, cycle types, and dependency links

### 2. Replace `generateFallbackStructure()` in `CurriculumGeneratorWizard.tsx`

- Instead of random themes, map directly from `BEGINNER_KIDS_SKELETON` (or the appropriate skeleton for the selected level)
- Each fallback unit inherits `anchorPhoneme`, `grammarGoal`, `prerequisiteUnit`, `skillsMix` from the skeleton
- Each fallback lesson inherits `cycleType`, `skillTags`, and `activities` from the skeleton

### 3. Add post-generation validation in `CurriculumGeneratorWizard.tsx`

After AI returns data, validate:
- Unit N has `prerequisiteUnit === N-1` (for N > 1)
- Phonics progression follows the skeleton order
- Writing % increases across units
- Lesson 1 of Unit N>1 has `cycleType === 'discovery'` and includes `reviewWords`

If validation fails, override with skeleton values (keep AI-generated titles/vocab but fix the structural fields).

### 4. Update the UI preview to show dependencies

In the generated curriculum preview (the Collapsible list), add visual indicators:
- Show a "← requires Unit N-1" badge on each unit header
- Show the anchor phoneme and grammar goal prominently
- Show skill mix as a mini bar chart or percentage badges
- Color-code cycle types (Discovery=blue, Ladder=amber, Bridge=green) — already done, but make it more prominent

### 5. Update edge function prompt (`curriculum-expert-agent`)

Change the `curriculum_structure` mode prompt to be more constrained:
- Instead of "generate 10 units following this tree", say "here are the exact units with their phonics/grammar goals — generate ONLY the creative content (titles, vocabulary, activity descriptions)"
- This reduces the chance of AI going off-script

## Files Modified
| File | Change |
|------|--------|
| `src/components/content-creator/CurriculumGeneratorWizard.tsx` | Skeleton-first generation, validated fallback, dependency UI |
| `src/data/spiralCurriculumSkeleton.ts` | Add skeletons for teens/adults, add `toGeneratedUnit()` helper |
| `supabase/functions/curriculum-expert-agent/index.ts` | Constrain `curriculum_structure` prompt to decoration-only |

