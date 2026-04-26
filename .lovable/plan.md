# Slide Studio "Kids Joyful" Overhaul

Transform the current corporate-looking slide canvas into a playful, classroom-ready experience with reliable background images, a talking mascot, and live mini-game previews driven by a smarter right-hand editor.

---

## 1. Reliable Background Images (Replace Unsplash)

**File:** `src/components/creator-studio/steps/slide-studio/SlideCanvas.tsx`

- Replace the dead `source.unsplash.com` URL with `https://loremflickr.com/1024/768/{visual_keyword},kids` (URL-encoded, comma-separated keywords).
- Build a `<SlideBackground>` subcomponent using a hidden `<img>` with `onLoad` / `onError` to track success.
- On error (or while loading) fall back to a vibrant playful gradient picked deterministically from the slide id, e.g.:
  - `from-blue-300 via-purple-300 to-pink-300`
  - `from-amber-200 via-orange-300 to-rose-300`
  - `from-emerald-200 via-teal-300 to-sky-300`
  - `from-fuchsia-300 via-violet-300 to-indigo-300`
- Honor `slide.custom_image_url` first if provided.
- Apply this background uniformly to all four layouts (`split_left/right`, `center_card`, `full_background`).

---

## 2. Joyful Kids Styling + Mascot Speech Bubble

**Files:** `index.html` (font import), `src/components/creator-studio/steps/slide-studio/SlideCanvas.tsx`, new `src/components/creator-studio/steps/slide-studio/MascotSpeech.tsx`

- Add a Google Fonts link for **Quicksand** + **Nunito** in `index.html` and a Tailwind utility class `font-kids` (via inline style or arbitrary value `font-['Quicksand']`) used on the canvas root.
- Build `<MascotSpeech>`:
  - Large emoji mascot (🦊 default; rotate by phase: warm-up=🦊, presentation=🦉, practice=🐻, production=🤖, review=🐼) sized ~120px, with a gentle `animate-bounce`/`hover:scale-105` transition.
  - White rounded-3xl speech bubble with `shadow-xl`, `border border-white/60`, generous padding, dark slate text, and a CSS triangle tail (pseudo-element via `before:` content) pointing toward the mascot.
  - Renders `slide.content` (or a friendly placeholder).
- Use `<MascotSpeech>` as the default body for `text_image` and as the wrapper for `drawing_prompt` / `flashcard` intros, replacing the small bottom-aligned `<p>`.

---

## 3. Activity Type Dropdown + Adaptive Right Sidebar

**File:** `src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx`

- Reorder so the **Slide Activity Type** dropdown sits **above** the Layout dropdown.
- Relabel options for kids tone:
  - `text_image` → "Story / Reading (Mascot Speech)"
  - `flashcard` → "Flashcard Flip"
  - `drawing_prompt` → "Drawing Canvas"
  - `multiple_choice` → "Multiple Choice Game"
- The existing type-aware editors already cover MCQ (3 wrong + 1 right via radio) and Drawing prompt input — keep them but tune copy for the kids context.
- Slightly enlarge the MCQ editor to enforce minimum 4 options when type is selected (defaults already do this).

---

## 4. Live Mini-Game Previews on Canvas

**File:** `src/components/creator-studio/steps/slide-studio/SlideCanvas.tsx`

- **Flashcard Flip** — Replace the simple two-state button with a real CSS 3D flip card:
  - Outer container `perspective-[1000px]`, inner div `transform-style-preserve-3d transition-transform duration-700` rotated `rotate-y-180` when flipped.
  - Two faces (`backface-hidden`), front = bright gradient with the word, back = white with the definition.
  - Small "Tap to flip" hint chip below.
- **Drawing Canvas** — Render a dashed rounded rectangle "drawing pad" (200px tall, white/70 background) with a pencil ✏️ icon and the prompt rendered inside the mascot speech bubble above. (Free-draw is out of scope here; this is a visual preview only.)
- **Multiple Choice Game** — Upgrade option chips to chunky pill buttons with playful colors (rotating per index: yellow, sky, pink, mint), big rounded corners, and a hover bounce. Teacher view still highlights the correct answer in emerald with a checkmark.
- **Story / Reading** — Mascot + speech bubble as described in §2.

Add minimal CSS helpers (`rotate-y-180`, `backface-hidden`, `transform-style-preserve-3d`, `perspective`) to `src/index.css` since Tailwind v3 doesn't ship them by default.

---

## 5. Technical Notes

- No schema changes needed: `SlideType` already includes `flashcard` and `drawing_prompt`; `MCQData` already supports the 1-correct/N-wrong pattern.
- `bgUrlFor()` becomes async-aware via the `<SlideBackground>` component's `onError`, so no context changes required.
- All edits are confined to:
  - `src/components/creator-studio/steps/slide-studio/SlideCanvas.tsx` (rewrite)
  - `src/components/creator-studio/steps/slide-studio/TeacherControlsPanel.tsx` (reorder + relabel)
  - `src/components/creator-studio/steps/slide-studio/MascotSpeech.tsx` (new)
  - `src/index.css` (3D flip utilities)
  - `index.html` (Quicksand/Nunito font link)

No backend, edge function, or DB changes.
