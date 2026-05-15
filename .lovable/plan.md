## Plan: Smart Placement Test overhaul

### 1. Enforce strict age routing everywhere
- Update all age-to-hub rules to the exact brackets:
  - Age < 4: block with `You must be at least 4 years old to join!`
  - 4–9: Playground
  - 10–17: Academy
  - 18+: Success / Professional
- Replace stale `< 12`, `<= 12`, `<= 10`, and `>= 17` placement/signup thresholds where they affect student hub assignment.
- Update `/ai-placement-test` traffic-cop routing so entered age sends students only to:
  - `/placement/playground`
  - `/placement/academy`
  - `/placement/success`

### 2. Keep the 3 isolated funnels, but make them genuinely hub-locked
- Keep the three route components as the public funnel boundaries:
  - `PlaygroundTest.tsx` locks `forcedHub="playground"`
  - `AcademyTest.tsx` locks `forcedHub="academy"`
  - `SuccessTest.tsx` locks `forcedHub="professional"`
- Remove the outdated “FROZEN” comments.
- Ensure forced funnels start the correct assessment after demographics state is available, and never fall back to the wrong hub.
- I will not delete shared helper logic unnecessarily; the actual route funnels remain isolated, while reusable internals can remain shared to avoid duplicating bugs.

### 3. Fix the infinite image-generation loop at the root
- Update the placement image rendering so image generation is keyed by a stable prompt/question identity.
- Cache generated image URLs locally by prompt/question key before calling `ai-image-generation`.
- Do not fetch again if the current question image already exists in local cache/state.
- Stabilize `VocabularyImage` dependencies so derived values do not accidentally retrigger generation.

### 4. Implement smart media rendering by question skill
- Normalize placement question skill/type into clear buckets:
  - Listening: show ElevenLabs audio controls only; no image generation.
  - Vocabulary/visual: show Gemini image only.
  - Grammar/reading: clean text-only MCQ/fill-in UI; no image/audio calls.
- Update `TestPhase` rendering conditions so the presence of `imagePrompt` alone cannot override skill rules.
- Ensure listening uses the existing `elevenlabs-tts` Edge Function and keeps the binary-safe direct fetch pattern.

### 5. Add anti-cheating image prompt constraints
- Inject this exact rule into every placement-test image prompt before it reaches `ai-image-generation`:
  `CRITICAL SYSTEM RULE: This image is for a test. DO NOT include any text, letters, or words in the image. DO NOT reveal the literal answer. Create a generalized, ambiguous visual context only.`
- Also strengthen the `generate-placement-test` Gemini prompts so newly generated placement questions output safe, non-answer-revealing image prompts.

### 6. Wire dynamic Gemini placement generation where it is currently unused
- The `generate-placement-test` Edge Function exists but is not currently invoked by the frontend.
- Add a frontend fetch path in the placement test to request Gemini-generated, hub-specific questions first.
- Fall back to the expert-authored local bank if Gemini fails, so students never get stuck.
- Map generated fields into the existing `BankQuestion` shape.

### 7. Validate the fix
- Run targeted checks for the changed files and inspect console/network behavior for repeated `ai-image-generation` calls.
- Confirm age routing and smart media rules are active for Playground, Academy, and Success funnels.