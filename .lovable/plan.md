## Step 2: Playable Preview Toggle

Right now both creators have a static "live preview" pane on the right that shows the current slide visually but does not let you actually *play* it (no answer checking, no navigation, no audio playback the way a student experiences it). Users want to flip the preview into a true playable mode — like a mini lesson player — without leaving the editor.

### What gets built

1. **Preview Mode Toggle (shared `PreviewModeToggle.tsx`)**
   - A small segmented control in the Right Preview column header with two options: **Editor View** (current static slide preview, scoped to the active slide) and **Play Mode** (interactive, deck-aware playback starting from the active slide).
   - State stored per-creator (`useState`), defaults to Editor View.
   - Shared in `src/components/creator-studio/shared/PreviewModeToggle.tsx` so both creators reuse it.

2. **Playable Preview Pane (shared `PlayablePreviewPane.tsx`)**
   - Wraps the existing `SlideRenderer` (Playground) / Academy slide renderer in a deck container with:
     - Prev / Next slide navigation buttons + slide counter (`3 / 12`).
     - Working answer interactions (uses the renderer's existing onAnswer hooks — no new logic, just routes feedback to a local state).
     - "Restart deck" button.
     - Auto-advance on correct answer (optional toggle; off by default to let creators inspect slides).
     - Audio playback enabled (voice + sfx) using the existing `playSlideAudio` util.
   - When the user toggles back to Editor View, the pane reverts to the static single-slide preview already present.

3. **Wire-up in `PlaygroundCreator.tsx`**
   - Replace the existing static-only right column (around lines 448–460) with `<PlayablePreviewPane mode={previewMode} slides={slides} startIndex={currentIndex} />`.
   - Add `<PreviewModeToggle value={previewMode} onChange={setPreviewMode} hub="playground" />` in that column header.
   - Keep the existing fullscreen "Preview" button (`FullPreview`) untouched — it already plays the whole deck fullscreen.

4. **Wire-up in `AcademyCreator.tsx`**
   - Same pattern around line 475 ("Live Preview" header).
   - Pass Academy's `t` (theme) prop through to the renderer.
   - Hub-tinted toggle (indigo/purple for Academy, orange/yellow for Playground).

5. **No DB / no edge function changes.** Pure client-side UX.

### Files

- New: `src/components/creator-studio/shared/PreviewModeToggle.tsx`
- New: `src/components/creator-studio/shared/PlayablePreviewPane.tsx`
- Edit: `src/pages/PlaygroundCreator.tsx` (right preview column + state)
- Edit: `src/pages/AcademyCreator.tsx` (right preview column + state)

### Out of scope (saved for later steps)

- Master Asset Vault (Step 3).
- AI Slide-from-Prompt generator (Step 4).
- Collaborative comments (Step 5).
- Changing the existing FullPreview fullscreen modal — it already works.

Approve and I will implement.