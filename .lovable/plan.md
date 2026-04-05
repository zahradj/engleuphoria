

## Plan: Integrate Master Orchestrator System into Lesson Engine

### What Changes

The user's "Master Orchestrator" prompt defines a refined, psychologically-grounded lesson architecture with updated visual styles, new activity types, and stricter image prompt rules per hub. The current codebase partially implements this but has mismatches in animation types, activity types, image prompts, and persona details. This plan aligns all layers.

### 1. Update Types (`types.ts`)

Add new animation and activity types from the Master Orchestrator spec:
- **AnimationType**: Add `'float'`, `'glitch'`, `'slide_fast'`, `'neon_pulse'`
- **ActivityType**: Add `'drag_and_drop_image'`, `'match_sound_to_picture'`, `'pop_the_word_bubble'`, `'sentence_unscramble'`, `'speed_quiz'`, `'case_study_analysis'`, `'business_email_reply'`, `'vocabulary_expansion'`
- **GeneratedSlide**: Add `visuals` field with `image_prompt`, `animation_style`, `layout` (`'split' | 'centered' | 'bento'`), and `interaction` field with `type` and `data`

### 2. Update Hub Configs (`hubConfig.ts`)

Align each hub with the Master Orchestrator's persona and constraints:

| Hub | Tone Update | Media | Animations | Activities | Image Prompt Suffix |
|---|---|---|---|---|---|
| **Playground** | "Enthusiastic, magical, adventurous. Pip the Penguin as guide." | `cartoon` | `bounce`, `float`, `wiggle` | `drag_and_drop_image`, `match_sound_to_picture`, `pop_the_word_bubble` | "High-quality 3D character illustration, vibrant colors, soft clay textures, isolated on white/transparent background" |
| **Academy** | "Relatable, dynamic, hacker-cool." | `3d_render` | `glitch`, `slide_fast`, `neon_pulse` | `fill_in_blanks`, `sentence_unscramble`, `speed_quiz` | "Digital 3D render, holographic elements, neon lighting, trending artstation style" |
| **Professional** | "Executive, concise, high-stakes." | `real_photography` | `none` | `case_study_analysis`, `business_email_reply`, `vocabulary_expansion` | "Hyper-realistic professional photography, cinematic lighting, corporate setting, 8k resolution" |

### 3. Update Lesson Generator (`generatePPPLesson.ts`)

Restructure slide generation to follow the Master Orchestrator's strict 5-type sequence while keeping the expanded 20-24 slide count:

- **Every slide** gets a `visuals` object with hub-specific `image_prompt` (using the new suffix rules) and `layout` field
- **Every activity slide** gets an `interaction` object with `type` and `data` (question/options/correct_answer)
- **Image prompts** must be contextually relevant (e.g., "Ordering Food" = restaurant scene, never generic)
- **Tone enforcement**: Professional hub never uses "Fun" or "Awesome" — uses "Efficient", "Effective", "Strategic"
- Update `buildMediaPrompt()` to use the new Master Orchestrator image prompt templates per hub

### 4. Update Animation Variants (`DynamicSlideRenderer.tsx`)

Add Framer Motion variants for new animation types:
- `float`: gentle up/down oscillation (y: [0, -6, 0], duration: 3s, infinite)
- `glitch`: rapid x/opacity flicker with skew transform
- `slide_fast`: x: 100 → 0 with aggressive spring (stiffness: 300)
- `neon_pulse`: boxShadow pulse with neon glow color cycling

### 5. Add New Activity Components

Create 3 new activity components to match the Master Orchestrator spec:

| Component | Hub | Description |
|---|---|---|
| `PlaygroundPopBubble.tsx` | Playground | Floating word bubbles that kids tap/click to pop — correct words earn points |
| `AcademySentenceUnscramble.tsx` | Academy | Draggable word tiles to reorder into correct sentence, neon aesthetic |
| `ProBusinessEmail.tsx` | Professional | Email scenario with reply textarea, AI-evaluated feedback |

Wire these into `DynamicSlideRenderer.tsx`'s switch statement.

### Files Changed

| File | Change |
|---|---|
| `ai-wizard/types.ts` | Add new animation/activity types, `visuals` and `interaction` fields to `GeneratedSlide` |
| `ai-wizard/hubConfig.ts` | Update all 3 hub configs with Master Orchestrator personas, prompts, activities, animations |
| `ai-wizard/generatePPPLesson.ts` | Update `buildMediaPrompt`, tone, image prompts, add `visuals`/`interaction` to every slide |
| `lesson-player/DynamicSlideRenderer.tsx` | Add `float`, `glitch`, `slide_fast`, `neon_pulse` variants; wire new activity components |
| `lesson-player/activities/PlaygroundPopBubble.tsx` | New: tap-to-pop word bubble game |
| `lesson-player/activities/AcademySentenceUnscramble.tsx` | New: drag-to-reorder sentence builder |
| `lesson-player/activities/ProBusinessEmail.tsx` | New: email reply with professional feedback |

