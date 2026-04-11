

# Expand Practice Layers to 4+ Interactive Activities Each

## Overview
Each of the three practice layers (Phonics, Vocabulary, Grammar) currently has 1-2 activities in the skeleton sequences. We will expand each layer to 4+ distinct interactive activity types, create the missing layer-specific components, wire them into the `DynamicSlideRenderer`, and update the skeleton sequences to accommodate the richer activity set.

---

## The 12 New Activities (4 per layer)

### Layer 1: Phonics Foundation (4 activities)
| Activity | Component | Description |
|----------|-----------|-------------|
| `phonics_slider` | `PhonicsSlider.tsx` | Student holds record button, waveform compared to master sound |
| `phoneme_tap` | `PhonemeTap.tsx` | Grid of phoneme cards — tap the one matching the audio played |
| `sound_sort` | `SoundSort.tsx` | Drag words into buckets by their target sound (e.g., short /a/ vs short /i/) |
| `mouth_mirror` | `MouthMirror.tsx` | 2D mouth cross-section animation — student watches articulation + records voice to match |

### Layer 2: Vocabulary Bridge (4 activities)
| Activity | Component | Description |
|----------|-----------|-------------|
| `sound_to_letter` | `SoundToLetter.tsx` | Word displayed with tappable letters — tap the letter containing the target phoneme |
| `word_builder` | `WordBuilder.tsx` | Drag individual letters to build the target word from a scrambled set |
| `picture_label` | `PictureLabel.tsx` | Flat 2.0 image shown — student types or selects the correct word label |
| `odd_one_out` | `OddOneOut.tsx` | Four Flat 2.0 images shown — student taps the one that doesn't share the target sound |

### Layer 3: Grammar Extension (4 activities)
| Activity | Component | Description |
|----------|-----------|-------------|
| `grammar_blocks` | `GrammarBlocks.tsx` | Slot-based sentence builder — drag blocks (Article, Noun, Verb) into correct slots |
| `sentence_scramble` | Reuses `AcademySentenceUnscramble.tsx` | Reorder jumbled words into a correct sentence |
| `article_picker` | `ArticlePicker.tsx` | Given a noun + image, choose "a" or "an" (connected to vowel phoneme logic) |
| `sentence_transform` | `SentenceTransform.tsx` | Transform a statement into a question or negative form by rearranging/adding blocks |

---

## File Changes

### 1. New Activity Components (10 new files)
Create in `src/components/lesson-player/activities/`:
- `PhonicsSlider.tsx`, `PhonemeTap.tsx`, `SoundSort.tsx`, `MouthMirror.tsx`
- `SoundToLetter.tsx`, `WordBuilder.tsx`, `PictureLabel.tsx`, `OddOneOut.tsx`
- `GrammarBlocks.tsx`, `ArticlePicker.tsx`, `SentenceTransform.tsx`

Each follows the existing pattern: accepts `slide`, `onCorrect`, `onIncorrect` props. Uses Flat 2.0 styling (rounded corners, navy accents, white backgrounds). Includes immediate feedback with animation (green glow / red shake) and XP reward trigger.

### 2. Update `DynamicSlideRenderer.tsx`
Import all 11 new components. Add activity type mappings in the `renderActivity()` switch for each hub:
- Playground: all phonics + vocabulary activities
- Academy: all vocabulary + grammar activities + phonics
- Professional: grammar activities + vocabulary expansion

### 3. Update `slideSkeletonEngine.ts`
Expand each hub's sequence to include the three practice layers with varied activities. The 12-slide structure adjusts to use practice sub-layers:

**Playground (12 slides):**
```
1.  warmup  — tap_the_beat
2.  warmup  — hello chant
3.  prime   — visual priming word #1
4.  prime   — visual priming word #2
5.  mimic   — phonics_slider (Phonics Layer)
6.  mimic   — phoneme_tap (Phonics Layer)
7.  produce — sound_to_letter (Vocab Layer)
8.  produce — word_builder (Vocab Layer)
9.  produce — grammar_blocks (Grammar Layer)
10. produce — article_picker (Grammar Layer)
11. cooloff — celebration
12. cooloff — goodbye
```

Each sequence rotates through the 4 activities per layer across lessons (using a `practiceVariant` index) so students experience all 4+ activities across consecutive sessions — no two lessons feel the same.

**Academy (12 slides):**
```
1.  warmup  — challenge intro
2.  warmup  — speed_quiz
3.  prime   — vocabulary deep-dive #1
4.  prime   — vocabulary deep-dive #2
5.  mimic   — sound_sort (Phonics)
6.  mimic   — mouth_mirror (Phonics)
7.  produce — picture_label (Vocab)
8.  produce — odd_one_out (Vocab)
9.  produce — sentence_scramble (Grammar)
10. produce — sentence_transform (Grammar)
11. cooloff — achievement unlock
12. cooloff — next mission teaser
```

**Professional (12 slides):** similar pattern with age-appropriate grammar activities.

### 4. Add `practiceLayer` field to `SlideSkeleton`
Add `practiceLayer?: 'phonics' | 'vocabulary' | 'grammar'` to the `SlideSkeleton` interface. This feeds the Success Hub's layer-level tracking.

### 5. Update `getSafeZone()` function
Add safe zone rules for the new activity types (e.g., `sound_sort` needs bottom space for buckets, `grammar_blocks` needs bottom space for the formula bar).

---

## Technical Summary

| Area | Files Modified | Files Created |
|------|---------------|---------------|
| Activities | — | 11 new components in `activities/` |
| Renderer | `DynamicSlideRenderer.tsx` | — |
| Skeleton Engine | `slideSkeletonEngine.ts` | — |

No database changes required.

