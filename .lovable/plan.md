## Multi-Style Story Engine

Extend the existing Story Creator + Viewer (which today supports only `classic` and `immersive`) into a true multi-format reader: classic storybook, western comic, Japanese manga (RTL), and Korean-style webtoon. The choice drives both the AI generation (panels + style modifiers + speech-bubble dialogue) and the runtime layout.

---

### 1. Creator UI — `StoryCreator.tsx`

Replace the current "Reader Layout" 2-tile picker with a richer **Visual & Layout Style** picker (4 cards, with mini wireframe previews):

| Key             | Label                  | Reading | Output |
|-----------------|------------------------|---------|--------|
| `classic`       | Classic Storybook      | LTR     | 1 image per page |
| `comic_western` | Western Comic Book     | LTR     | 3–5 panels per page (CSS grid) |
| `manga_rtl`     | Japanese Manga (B&W)   | RTL     | 3–5 panels per page (CSS grid) |
| `webtoon`       | Vertical Webtoon       | Vertical scroll | 6–10 panels, single column |

The key is passed to the edge function as `visual_style` and persisted into `ai_metadata.visual_style`. The legacy `story_layout` value is mapped from it for backward compatibility (`classic` → `classic`; everything else → `immersive`).

### 2. Edge Function — `supabase/functions/ai-core/index.ts` `handleGenerateStory`

Accept new field `visual_style` (default `classic`). Derive:

- **Style modifier** appended to every `image_prompt`:
  - `comic_western`: `, in the style of a modern western comic book, vibrant colors, dynamic ink lines, halftone shading`
  - `manga_rtl`: `, in the style of Japanese manga, black and white, screentone shading, high contrast, dramatic angles`
  - `webtoon`: `, in the style of a modern colorful webtoon manhwa, digital art, soft cel shading, bright lighting`
  - `classic`: `, in the style of a warm children's storybook illustration, soft watercolor`

- **JSON schema branch** in the system + user prompts:
  - `classic` keeps today's shape: `slides[].narrative + image_prompt`.
  - The other three switch each slide to:
    ```json
    { "page_number": 1,
      "panels": [
        { "image_prompt": "...", "dialogue": [{ "speaker": "Mia", "text": "..." }],
          "caption": "optional narration", "size": "wide|tall|square|full" }
      ]
    }
    ```
  - Panel counts: comic 3–5, manga 3–5, webtoon 6–10 (single column).
  - Vocabulary/grammar grounding rules unchanged.

- **Persistence**: `persistLesson` is called with `extraMetadata = { visual_style, story_layout: derivedLayout, linked_lesson_id, linked_lesson_title }`. Each slide's `interactive_data.panels` carries the panel array (so the existing `slides` column needs no schema change).

### 3. Viewer — `StoryBookViewer.tsx`

Add `visualStyle: 'classic' | 'comic_western' | 'manga_rtl' | 'webtoon'` prop. Routing inside the viewer:

- `classic` → existing `ImmersiveCard` / `ClassicSplit`.
- `comic_western` → new `ComicPage` component: CSS grid `grid-cols-6` with panel `col-span` derived from `panel.size` (full=6, wide=4, tall=2 row-span-2, square=3). LTR. Speech bubbles overlaid.
- `manga_rtl` → same `ComicPage` wrapped in `<div dir="rtl">` and `grid-flow-row-dense`. Reading order flows R→L. Bubbles use a slightly different tail style + monochrome filter on images via `style={{ filter: 'grayscale(1) contrast(1.05)' }}`.
- `webtoon` → new `WebtoonScroller`: replaces page navigation with one vertical `flex flex-col` column (`max-w-md mx-auto`), all panels stacked, snap scrolling. Page dots & edge arrows hidden; exit + narration float as a sticky top-right pill.

### 4. Speech bubbles

New tiny `SpeechBubble` subcomponent: absolutely positioned over the panel image (`absolute` with deterministic placement based on bubble index — 1st top-left, 2nd bottom-right, 3rd top-right, 4th bottom-left), white rounded-2xl bubble with a CSS `::after` triangular tail, inline speaker tag in bold-uppercase. Captions render as a yellow narration box pinned to the panel bottom.

### 5. Reader routing — `LessonReaderPage.tsx`

Read `lesson.ai_metadata.visual_style` (fallback to derived value from `story_layout`) and pass it to `<StoryBookViewer visualStyle=... />`. Update `normalizeSlidesToStoryPages` to also surface `interactive_data.panels` onto each `StoryPage` as `page.panels`.

### 6. Backward compatibility

- Existing stories without `visual_style` default to `classic` and continue to render exactly as today.
- `StoryPage.panels` is optional; comic/manga/webtoon viewers fall back to a single full-bleed panel built from `page.imageUrl + page.text` if `panels` is missing.

### Files to edit

- `src/components/creator-studio/steps/StoryCreator.tsx` — replace layout picker with 4-style picker; pass `visual_style`; tweak persisted metadata.
- `supabase/functions/ai-core/index.ts` — extend `handleGenerateStory` (style modifier, branched JSON schema, panel-aware response).
- `src/components/creator-studio/persistLesson.ts` — no schema change; extra metadata already supported.
- `src/components/student/story-viewer/StoryBookViewer.tsx` — add `visualStyle`, `ComicPage`, `WebtoonScroller`, `SpeechBubble`, RTL handling, panel-aware `StoryPage`.
- `src/pages/student/LessonReaderPage.tsx` — pass `visualStyle` and propagate `panels` in normalizer.

### Out of scope

- Image generation pipeline itself (panels go through whatever existing `image_generation_prompt` flow already uses).
- Editing existing stories' visual style (would require a re-generation; not added in this pass).
