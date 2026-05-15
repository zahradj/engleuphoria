## Localized Meta-Instructions for Placement Tests

The chosen approach: **keep static `questionBanks.ts`** as the source of questions, and add a localized "task instruction" line above each question. Edge function still gets the new schema for future dynamic use.

### Globalization rule (enforced everywhere)
- **Localized**: only the small task instruction ("Listen and choose…", "Fill in the blank", "Choose the correct word…") + shell buttons (Submit / Next / Play Audio).
- **Strictly English**: question text, options, correct answer, audio script, image prompt.

---

### 1. `questionBanks.ts` — add `taskInstructionKey`

Extend `BankQuestion` with an optional `taskInstructionKey: string` (an i18n key, not the translated string). Default mapping when unset, derived from `resolveSkill`:

| skill | i18n key |
|---|---|
| listening | `placement.task.listening` |
| vocabulary | `placement.task.vocabulary` |
| grammar | `placement.task.grammar` |
| reading | `placement.task.reading` |

Tag the existing pool entries with the right `skill` field where ambiguous (most are already inferable; no question text changes).

### 2. Translations — add `placement.task.*` keys to all 6 dictionaries

Add to `english/spanish/arabic/french/turkish/italian.ts` translation files:

```
placement.task.listening    → "Listen and choose the correct picture/answer."
placement.task.vocabulary   → "Look at the picture and choose the correct word."
placement.task.grammar      → "Choose the correct word to complete the sentence."
placement.task.reading      → "Read carefully and choose the best answer."
placement.action.playAudio  → "Play Audio"
placement.action.playAgain  → "Play Again"
placement.action.loading    → "Loading…"
placement.action.next       → "Next Question"
placement.action.submit     → "Submit"
placement.progress.question → "Question"
placement.progress.cefr     → "CEFR Assessment"
```

Translations provided per language by Gemini-quality strings (Arabic RTL already handled by i18n.ts).

### 3. `TestPhase.tsx` — render localized instruction + i18n shell

- Import `useTranslation`.
- Above the question `ChatBubble`, render a small chip-style line with `t(currentQuestion.taskInstructionKey ?? defaultKeyForSkill(skill))`. RTL-aware via `dir="auto"`.
- Replace hard-coded English strings: `'Question'`, `'CEFR Assessment'`, `'Play Audio'`, `'Play Again'`, `'Loading…'`, `'Listen first, then choose your answer.'` with `t(...)` calls.
- Question text + options remain hard-coded English from the bank. **No changes** to TTS/image/answer logic.

### 4. `PlaygroundTest.tsx` / `AcademyTest.tsx` / `SuccessTest.tsx`

These are thin wrappers around `TestPhase`; no logic changes needed beyond what `TestPhase` picks up. Verify they don't override progress labels with hard-coded English; if they do, swap to `t(...)`.

### 5. Edge Function `generate-placement-test/index.ts` — schema upgrade

Even though the frontend uses the static bank today, harden the function for future dynamic use:

- Accept `userLocale` (BCP-47 root: `en|es|ar|fr|tr|it`) in the request body. Default `en`.
- Inject into all three system prompts a shared block:
  ```
  GLOBALIZATION RULE:
  - task_instruction_localized: ONE short instruction translated to {userLocale} ONLY.
  - question_text, options, correct_answer, audio_script: STRICTLY ENGLISH.
  - image_prompt: English, must start with the anti-cheat sentence and include
    "CRITICAL: DO NOT include any text, letters, or words in the image. DO NOT reveal the literal answer."
  - audio_script: null when skill is not 'listening' / 'professional_listening'.
  ```
- Update `PlacementQuestion` TS interface with new `task_instruction_localized: string` field.
- Image prompt anti-cheat sentence updated to the user's exact wording.
- Response shape unchanged otherwise (`{ hub, questions, provider }`).

### 6. Smart media (already correct — verify only)

`TestPhase` already routes by `resolveSkill`: `vocabulary→VocabularyImage`, `listening→ElevenLabs button`, `grammar/reading→text-only`. No change needed; just confirm after edits.

---

### Out of scope (untouched)
- Auth, dashboards, Creator Studio.
- `questionBanks.ts` question/option/audio/image content (stays English).
- TTS pipeline, image-generation pipeline.
- Switching frontend to call the edge function (explicit user choice).

### Files touched
- `src/components/placement/questionBanks.ts` — add `taskInstructionKey?` field, tag skills where missing.
- `src/components/placement/TestPhase.tsx` — render localized instruction, i18n shell strings.
- `src/components/placement/{PlaygroundTest,AcademyTest,SuccessTest}.tsx` — minor i18n sweeps if any hard-coded labels remain.
- `src/translations/{english,spanish,arabic,french,turkish,italian}.ts` — add `placement.*` keys.
- `supabase/functions/generate-placement-test/index.ts` — accept `userLocale`, enforce new JSON schema with `task_instruction_localized`, updated anti-cheat sentence.

### Memory update
After implementation, append a `mem://features/onboarding/placement-test-localization` memory: "Placement task instructions are the only translated text; questions/options/audio stay English. Edge function schema includes `task_instruction_localized` + anti-cheat image prompt rule."
