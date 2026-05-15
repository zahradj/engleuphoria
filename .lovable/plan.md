## Root cause found

1. The placement test is not actually generated today. It uses hardcoded arrays in `TestPhase.tsx` and `comprehensive/content.ts`.
2. The Academy placement test can still show Playground questions because `TestPhase` chooses the question bank only from `age < 12`, not from the current hub. So a student entering a younger age in the Academy flow gets the repeated “Which animal says Meow?” bank.
3. Images are not generated because the current placement questions almost never include `image_url`, and there is no placement-specific call to `ai-image-generation`.
4. ElevenLabs is only wired for questions that already have `audio_script`; most placement questions are plain MCQs, so there is no audio generation for them.
5. The 4-skill phase is still static and not hub/level-aware.

## Implementation plan

### 1. Add a real placement-test model
Create a shared placement-test content structure with:
- `hub`: `playground | academy | professional`
- `levelBand`: CEFR band such as `A1-A2`, `A2-B1`, `B1-B2`, `B2-C1`
- MCQ questions covering grammar, vocabulary, functional language, reading, listening, and visual comprehension
- `imagePrompt` for visual questions
- `audioScript` for listening questions
- expert teacher metadata: skill, CEFR target, difficulty, feedback

### 2. Fix hub resolution at the root
Update `AIPlacementTest` so the active test hub is resolved from the intended student hub/profile/route context first, then age second.
- Academy placement should use Academy-style questions even if the age input would otherwise trigger Playground.
- Playground remains child-friendly.
- Professional remains adult/business-oriented.

### 3. Generate hub-level placement tests through Gemini only
Add a Supabase Edge Function, for example `generate-placement-test`, that:
- uses `GEMINI_API_KEY` directly or the Gemini-only `aiFetch` helper
- never calls Lovable AI Gateway
- requests a validated JSON placement test for the selected hub, age, goal, and interests
- uses high `maxOutputTokens`
- strips markdown fences and robustly extracts JSON
- detects truncated/malformed responses
- validates the schema before returning it
- falls back to an expert-authored local bank if Gemini fails, so students never see a broken or empty test

### 4. Stop repeated questions
Replace the tiny static banks with a larger expert-authored fallback bank per hub and level.
- Playground: visual/simple A1-A2 questions
- Academy: teen-appropriate A1-B2 progression
- Professional: adult/professional A2-C1 progression
- Shuffle/select a balanced set per test attempt while keeping CEFR progression.
- Prevent duplicate question text in one attempt.

### 5. Add generated images to placement questions
For any placement item with `imagePrompt`, render `VocabularyImage` or a placement-specific image component that calls `ai-image-generation`.
- Style: flat 2D, hub-specific visual tone
- Persist/cache by prompt where possible
- Use Gemini image generation through the existing `ai-image-generation` edge function
- Replace `/placeholder.svg` in the writing prompt with generated visual prompts.

### 6. Use ElevenLabs for placement audio
For all listening items, use the existing `elevenlabs-tts` edge function.
- Keep the direct binary `fetch` pattern already used in `TestPhase`
- Add audio scripts to generated/fallback listening questions
- Add listening prompts to the 4-skill phase, not just the MCQ phase

### 7. Make the 4-skill phase hub/level-aware
Pass `hub`, `age`, `goal`, and `interests` into `ComprehensivePhase`.
- Academy gets teen-realistic listening/reading/writing/speaking tasks.
- Professional gets adult workplace/travel/social tasks.
- Playground either gets a shorter kid-appropriate version or remains MCQ-only depending on age/hub.

### 8. Verify the fix
After implementation, verify:
- Academy placement no longer shows the “Meow” Playground bank unless the hub is actually Playground.
- MCQ questions vary and are not repeated.
- Image-generation network calls hit `ai-image-generation`.
- Audio calls hit `elevenlabs-tts`.
- No runtime feature calls go to `ai.gateway.lovable.dev`.
- Placement result still persists to `student_profiles` and routes to `/dashboard/my-path`.