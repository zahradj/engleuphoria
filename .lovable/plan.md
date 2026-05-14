## Goal
Patch TTS in `HomeworkPlayer.tsx` and `SoloVocabCard.tsx` to call the `elevenlabs-tts` Edge Function first and only fall back to `window.speechSynthesis` on failure.

## Files
1. `src/components/student/homework/HomeworkPlayer.tsx` — `supabase` already imported. Rewrite the `speak` function (lines ~58–62 area) to async/await pattern: invoke `elevenlabs-tts` with `{ text, voiceId: "Xb7hH8MSUJpSbSDYk0k2" }`, build a Blob (`audio/mpeg`), play via `new Audio(url).play()`. On error/no data → `catch` block runs the existing `SpeechSynthesisUtterance` fallback.
2. `src/components/creator-studio/shared/SoloVocabCard.tsx` — Add `import { supabase } from '@/integrations/supabase/client';`. Convert `playAudio` to `async`, same try/edge-function/catch/native pattern.

## Constraints
- No other logic touched (preserves 3-activity homework sequence and 50/50 SoloVocabCard layout).
- Keep callsites unchanged; both functions remain fire-and-forget compatible.
- Use exact pattern from the user's snippet.

## Verification
- Type-check passes (auto build).
- Manually confirm no other `speechSynthesis` references in these two files remain outside the catch block.