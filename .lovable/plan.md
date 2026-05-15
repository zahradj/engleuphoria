## Problem

On `/academy-creator`, vocabulary slides do not show as a 50/50 card with the image on the right. Instead the image sits in a small centered strip *above* the text.

Why: `AcademyCreator.tsx` renders every non-phonics / non-storybook slide through `UniversalMediaShell` (which stacks a hero image on top) wrapping `SlideRenderer` (which renders `VocabSlide` — text only). So the vocab slide ends up as **image stacked above text**, never the intended 2-column split.

The correct premium 50/50 component already exists: `src/components/lesson/VocabSlideSplit.tsx` (text LEFT, image RIGHT, hub-themed). It's just never wired into the Academy creator preview.

## Fix (frontend, presentation only)

**File:** `src/pages/AcademyCreator.tsx` — `renderSlide` block (around lines 803–825).

Add a branch for `vocab` (and `vocab_solo`) so they bypass `UniversalMediaShell` and render through `VocabSlideSplit` directly:

```tsx
} else if (sType === 'vocab' || sType === 'vocab_solo') {
  const s = slide as any;
  return (
    <VocabSlideSplit
      hub="academy"
      word={s.word}
      phonetic_spelling={s.phonetic_spelling}
      definition={s.definition}
      example_sentence={s.example}
      image_url={s.image_url}
      audio_url={s.audio_url || s.voice?.audio_url}
    />
  );
} else {
  // existing UniversalMediaShell + SlideRenderer fallback
}
```

Add the import:
```ts
import VocabSlideSplit from '@/components/lesson/VocabSlideSplit';
```

## Notes / scope guardrails

- Pure UI/presentation change. No edits to AI prompts, edge functions, or data shape.
- `VocabSlideSplit` already handles its own ElevenLabs audio playback, so we drop the `UniversalMediaShell` wrapper for vocab slides to avoid a duplicate image and duplicate audio button.
- `SuccessCreator` (if/when present) can get the same one-line branch with `hub="success"` later — out of scope unless you confirm.
- `PlaygroundCreator` keeps using `SoloVocabCard` per the existing hub-personas memory.

## Verification

After the edit, on `/academy-creator?lessonId=…` open any `vocab` slide in the preview pane and confirm:
1. Card is one row, two equal columns at `md:` and up.
2. Word + phonetic + definition + example + Listen button on the LEFT.
3. Generated image fills the RIGHT half (or shows the "Image generating…" placeholder if missing).
4. No duplicate hero image strip above the card.