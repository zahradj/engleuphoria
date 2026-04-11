

# Scaffolded Mastery + Anti-3D Image Pipeline + Phonetic Mimic Engine

## Overview
Three interconnected upgrades to transform lesson quality: (1) replace the current 4-phase skeleton with a 5-phase "Epic Arc" mastery structure, (2) inject Anti-3D negative prompts into all image generation, and (3) build a phonetic accuracy feedback engine for the Mimic phase.

---

## Part 1: Anti-3D Image Generation Refactor

**Problem**: The `slideSkeletonEngine.ts` MIDJOURNEY_WRAPPERS explicitly request "3D claymation, Octane Render, Unreal Engine 5" for Playground and "Cyberpunk neon, digital 3D render" for Academy. The `ai-image-generation` edge function has no negative constraints.

**Changes**:

1. **`supabase/functions/ai-image-generation/index.ts`** — Add a new `flat2d` style and accept a `negativePrompt` parameter. When style is `flat2d`, prepend: *"Professional 2D flat vector illustration, clean bold lines, solid colors with subtle layering, white background, isolated object"* and append negative constraint: *"No 3D, no render, no depth, no shadows, no gradients, no photorealism, no fuzzy textures."*

2. **`src/services/slideSkeletonEngine.ts`** — Replace `MIDJOURNEY_WRAPPERS`:
   - **Playground**: `"Minimalist 2D flat vector, friendly character design, solid pastel colors, clean bold outlines, white background, Engleuphoria Navy accents"`
   - **Academy**: `"Professional 2D illustration, clean geometric style, bold colors, modern infographic aesthetic, white background"`
   - **Professional**: Keep current editorial photography style (already appropriate)

3. **`src/services/imageGeneration.ts`** — Add `flat2d` to the `ImageGenerationOptions.style` union. Update `getStylePrompt` to include the flat vector description.

4. **`src/services/massImageGenerationService.ts`** — Pass `style: 'flat2d'` (for Playground/Academy) instead of `'cinematic'`.

5. **Content Creator UI** — In the AI Wizard (`AILessonWizard.tsx`), rename "Generate Images" button to **"Generate Flat 2.0 Vectors"** for Playground/Academy hubs. Add a visual indicator showing the active style preset.

---

## Part 2: Scaffolded 5-Phase Lesson Structure

**Problem**: Current skeleton uses a 4-phase loop (Hook → Discovery → Active Play → Recap). Missing the critical Warm-Up/Song phase and Brain Break/Cool-Off phase.

**Changes**:

1. **`src/services/slideSkeletonEngine.ts`** — Expand `SlidePhase` type to `'warmup' | 'prime' | 'mimic' | 'produce' | 'cooloff'` and rebuild the 12-slide sequences:

```text
Playground (12 slides, 30 min):
1. Warm-Up: AI Song / Tap the Beat         (60s)
2. Warm-Up: Hello Chant animation           (60s)
3. Prime: Word #1 — Visual only, no text    (120s)
4. Prime: Word #2 — Visual only, no text    (120s)
5. Mimic: Voice record word #1              (150s)
6. Mimic: Voice record word #2              (150s)
7. Produce: Mystery silhouette #1           (150s)
8. Produce: Drag & Drop activity            (180s)
9. Produce: Pop the Word Bubble             (150s)
10. Cool-Off: Breathing Balloon / mini-game (60s)
11. Recap: Accessory celebration            (90s)
12. Recap: Goodbye wave                     (60s)
```

   Academy and Professional get equivalent restructuring with age-appropriate activities.

2. **`src/services/slidePromptTemplates.ts`** — Update `MASTER_SLIDE_PROMPT_TEMPLATE` to reflect the 5-phase structure and enforce: "Every unit must include a Prime slide (recognition) and a Mimic slide (phonetic accuracy) before any Production or Quiz slide."

3. **Slide Builder UI** — Add a **"Phase"** badge on each slide thumbnail in the filmstrip showing which mastery phase it belongs to (color-coded: Warm-Up=amber, Prime=blue, Mimic=green, Produce=purple, Cool-Off=teal).

4. **Science Check sidebar** — Add a `LessonStructureValidator` component that checks the slide sequence. If a Mimic slide is missing before a Produce slide, show a warning: *"Warning: Students may struggle without a Mimic phase before Production."*

---

## Part 3: Phonetic Mimic Engine

**Problem**: Voice recording exists (`useSpeechRecognition`, `speech-to-text` edge function) but only does word recognition — no phoneme-level accuracy scoring.

**Changes**:

1. **New Edge Function: `supabase/functions/phonetic-analysis/index.ts`**
   - Accepts: `{ studentAudio: base64, targetWord: string, targetPhonemes: string[] }`
   - Uses Lovable AI (Gemini) to analyze the transcription against the target phonemes
   - Returns: `{ masteryScore: number, phonemeBreakdown: [{phoneme, accuracy, feedback}], overallFeedback: string }`
   - Scoring: 85%+ = Gold Star, 50-84% = Soft Correction, <50% = Replay Prime

2. **New component: `src/components/lesson/MimicPhaseSlide.tsx`**
   - Shows the Flat 2.0 vector image + phoneme target
   - Record button using existing Web Audio / `useAudioProcessing`
   - After recording, calls `phonetic-analysis` function
   - Displays a clean waveform visualization (green glow when matching)
   - Wizard feedback: substitution → mouth cross-section tip, omission → pulsing letter, distortion → "try again" prompt

3. **New component: `src/components/lesson/PrimePhaseSlide.tsx`**
   - Image-only view (no text labels)
   - Auto-plays TTS pronunciation via existing `ttsService`
   - Color-coded glow: nouns = blue border, verbs = green border

4. **New component: `src/components/lesson/ProducePhaseSlide.tsx`**
   - Shows silhouette/blurred version of the image
   - Student types or selects the correct word
   - Progressive reveal on correct answer

5. **New component: `src/components/lesson/WarmUpSlide.tsx`**
   - Integrates with existing ElevenLabs music service for the intro song
   - "Tap the Beat" simple rhythm mini-game

6. **New component: `src/components/lesson/CoolOffSlide.tsx`**
   - Breathing balloon animation or bubble-pop mini-game
   - No language pressure, purely motor/relaxation

7. **Update `LessonRenderer`** — Map the new phase types to these new slide components.

---

## Part 4: Phoneme Target Field

Add a **"Phoneme Target"** input field to the slide editor properties panel in the Content Creator. This field maps to existing `phoneme_tag` data and ensures every slide has an explicit phonetic focus (e.g., `/l/`, `/æ/`). Pre-populate from the `PHONEME_MAP` data.

---

## Technical Summary

| Area | Files Modified | Files Created |
|------|---------------|---------------|
| Anti-3D Images | `ai-image-generation/index.ts`, `slideSkeletonEngine.ts`, `imageGeneration.ts`, `massImageGenerationService.ts`, `AILessonWizard.tsx` | — |
| 5-Phase Structure | `slideSkeletonEngine.ts`, `slidePromptTemplates.ts` | `LessonStructureValidator.tsx` |
| Mimic Engine | — | `phonetic-analysis/index.ts`, `MimicPhaseSlide.tsx`, `PrimePhaseSlide.tsx`, `ProducePhaseSlide.tsx`, `WarmUpSlide.tsx`, `CoolOffSlide.tsx` |
| Phoneme Field | Slide editor properties panel | — |

No database migrations required — leverages existing `student_phonics_progress` and `phoneme_tag` columns.

