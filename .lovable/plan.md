## Placement Test: Branding + Listening Comprehension

Two combined upgrades to the placement test experience across all hubs (Playground, Academy, Professional).

---

### Part 1 — Logo Branding

Inject the Engleuphoria wordmark into the test header so every quiz screen carries the brand identity.

**Files touched:**
- `src/components/placement/AIPlacementTest.tsx` — replace the small "AI / The Guide" header with a centered `<Logo size="medium" />` (or `small` on mobile via `h-8 sm:h-10` sizing).
- `src/components/placement/PlaygroundPlacementPhase.tsx` — add a centered logo above the star progress row.

Logo placement is above the progress bar inside the existing glassmorphic test container. The `<Logo>` component already auto-switches to the white wordmark on dark backgrounds (placement uses a dark gradient), so no variant override is needed. Mobile scaling uses `h-7 sm:h-9` so it does not push questions below the fold.

---

### Part 2 — Listening Comprehension (ElevenLabs)

Add a `listening_match` question type to the CEFR placement set. When a question has an `audio_script`, the renderer shows a prominent **Play Audio** button and locks the answer choices until the student has clicked play at least once.

**Schema change** (`src/components/placement/TestPhase.tsx`):
```ts
interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: number;
  targetLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  feedback: { correct: string; incorrect: string };
  audio_script?: string;        // NEW — TTS source text
  type?: 'standard' | 'listening_match'; // NEW — discriminator
}
```

**New questions added to `CEFR_MASTER_QUESTIONS`** (2 listening items, one B1 and one B2):
- B1 listening_match: "What is the speaker doing?" with script *"I'm just heading to the supermarket to pick up some bread and milk for breakfast tomorrow."* → options like `Going shopping / Cooking dinner / Cleaning the kitchen / Watching TV`.
- B2 listening_match: "Which conclusion best matches what you heard?" with a 2-sentence script that requires inference.

**Audio playback flow:**
1. Click `Play Audio` button → state flips to `isPlaying = true`, label becomes `Loading…`.
2. POST `audio_script` to existing `elevenlabs-tts` edge function via `supabase.functions.invoke('elevenlabs-tts', { body: { text: audio_script } })`.
3. Function returns raw `audio/mpeg`. Convert to `Blob` → `URL.createObjectURL` → `new Audio(url).play()`.
4. On `audio.onended`, reset `isPlaying = false` and set `hasPlayedOnce = true`.
5. Cache the blob URL per question so replays do not re-bill ElevenLabs.

**UX lock:**
- `<motion.button>` answer tiles get `disabled` + `opacity-40 cursor-not-allowed` until `hasPlayedOnce === true` for listening questions.
- Tooltip / helper text appears below the audio button: *"Listen first, then choose your answer."*

**Audio button styling** (matches the existing violet/fuchsia/pink gradient already used in the progress bar):
```tsx
<button
  className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500
             text-white rounded-2xl px-6 py-3 font-semibold flex items-center
             gap-2 shadow-lg shadow-fuchsia-500/30 hover:scale-[1.02]
             transition disabled:opacity-60"
>
  {isPlaying ? '⏳ Loading…' : '🔊 Play Audio'}
</button>
```

---

### Technical Section

- **No DB migration needed.** Questions stay client-side in `TestPhase.tsx` (existing pattern). The `audio_script` field is optional and additive.
- **No new edge function.** Re-uses the existing deployed `elevenlabs-tts` function which already returns `audio/mpeg` and uses the configured `ELEVENLABS_API_KEY` secret.
- **Per-question state reset:** `hasPlayedOnce` and the cached blob URL reset whenever `currentQIndex` advances.
- **Cleanup:** `useEffect` cleanup revokes blob URLs on unmount to avoid memory leaks.
- **Accessibility:** audio button gets `aria-label="Play listening prompt"`; locked answer buttons get `aria-disabled="true"`.
- **Playground hub:** the kid-mode (`PlaygroundPlacementPhase`) is picture-only and does NOT receive listening_match questions in this pass — only the logo upgrade. Reason: the existing `audioPrompt` strings are already used as on-screen captions; introducing TTS for 4–9 year-olds requires kid-friendly voice tuning we can do in a follow-up.

---

### Files to be edited
1. `src/components/placement/AIPlacementTest.tsx` — header swap to Logo.
2. `src/components/placement/PlaygroundPlacementPhase.tsx` — add Logo above progress.
3. `src/components/placement/TestPhase.tsx` — extend `Question` interface, add 2 listening items, add audio player + lock UI.

No new files, no new edge functions, no DB changes.