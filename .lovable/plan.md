## Goal

Make **target_phonics** a **required, CEFR-tiered** output across every hub & every level — and surface it consistently in the unified `GenerateLessonModal` (which already replaces the per-hub sidebar input).

> Note: in the previous turn the per-hub sidebar phonics inputs were intentionally consolidated into the shared `GenerateLessonModal` (single source of truth, identical UI for all 3 hubs). This plan keeps that consolidation — Phase 2 is satisfied by the shared modal, with a hub-aware label tweak.

---

## Phase 1 — CEFR-tiered phonics rules in the AI prompts

### 1a. `supabase/functions/plan-lesson-blueprint/index.ts`

Replace the current hub-only `phonicsGuidance` with a **level-first, hub-second** matrix. Keep returning the same JSON shape (`target_phonics: { focus, sound_ipa, grapheme, example_words[] }`).

```text
Tier A — Pre-A1 / A1  → Synthetic phonics: single phonemes, CVC blends, simple
                         digraphs (sh, ch, th). e.g. "Short A /æ/", "Digraph /ʃ/".
Tier B — A2 / B1      → Minimal pairs, tricky consonant clusters, silent letters.
                         e.g. "Minimal pair /ɪ/ vs /iː/ (ship/sheep)", "Silent K".
Tier C — B2 / C1 / C2 → Suprasegmentals: word stress, sentence stress, intonation,
                         linking, elision, weak forms.
                         e.g. "Noun↔verb stress shift (RE-cord vs re-CORD)",
                         "Elision in connected speech".
```

Hub stays as a tone hint only (kid-friendly label vs. business-style label) — the **tier rule wins** if it conflicts.

Prompt change:
- Build `phonicsGuidance` from `cefr_level` first, then append a one-line hub flavoring.
- Add to system prompt: `"target_phonics is REQUIRED for every level — never return empty."`
- Pre-A1 override block (added in the previous turn) is preserved and runs after the tier rule.

### 1b. Modal Auto-Fill (`GenerateLessonModal.tsx`)

The Auto-Fill prompt currently only varies on Pre-A1. Extend it with the same 3-tier rule so the small "✨ Auto-Fill" suggestion matches what `plan-lesson-blueprint` produces:

- Inject a `phonicsTierHint` string (Tier A/B/C as above) into the system message based on `level`.
- Keep `target_phonics` non-empty even when level is Pre-A1 (Tier A wording).

### 1c. `supabase/functions/generate-ppp-slides/index.ts`

Already consumes `target_phonics` for Playground only. Extend the **Academy** and **Success** branches so that when `target_phonics` is supplied:

- Inject a short "PRONUNCIATION LAYER" block into the Academy/Success system prompts mirroring the existing Playground `phonicsBlock`, instructing 1–2 dedicated pronunciation slides (e.g., a `multiple` minimal-pairs drill for Academy; a `multiple`/`drag` word-stress drill for Success).
- No change to slide-type allow-lists for Academy/Success (their `multiple`/`fill` types already cover this).

## Phase 2 — Shared modal + hub-aware label

`GenerateLessonModal.tsx` is already the single phonics input shared by all 3 hubs (the deprecated sidebar inputs were removed last turn). Add only a **dynamic label**:

- `playground` → `🔊 Target Phonics / Sound`
- `academy` → `🔊 Pronunciation Focus`
- `success` → `🎙 Pronunciation / Intonation Focus`

Placeholder per hub already varies — keep it.

## Phase 3 — Blueprint hydration

Already wired end-to-end:

- `CurriculumMap.tsx` ships `target_phonics` via `location.state` when navigating to the hub creator.
- `PlaygroundCreator`, `AcademyCreator`, `SuccessCreator` each parse `st.bp.target_phonics` (string or `{ focus }`) into `blueprint.target_phonics` on mount.
- `<GenerateLessonModal defaultPhonics={blueprint?.target_phonics} />` already reflects this on open.

Verification only — no code change needed unless smoke-tests show a missing field.

## Verification

- [ ] Calling `plan-lesson-blueprint` with `cefr_level=B1, hub=academy` returns a minimal-pairs phonics object (not silent / not Playground-style).
- [ ] Calling it with `cefr_level=C1, hub=success` returns a suprasegmental focus (word stress / intonation / elision).
- [ ] Modal Auto-Fill at A2/B1 suggests minimal pairs; at B2+ suggests stress/intonation; at Pre-A1/A1 suggests CVC phonics.
- [ ] Modal label updates per hub.
- [ ] After "Draft Lesson Blueprint" from Curriculum Map, opening the modal in any hub shows the suggested phonics pre-filled.
- [ ] Academy/Success generated decks now include a pronunciation drill slide when `target_phonics` is supplied.
