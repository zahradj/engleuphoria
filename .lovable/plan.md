

## Plan: Convert AI-Generated Lessons to Canvas Slides on Load

### Problem
The "Hello, Pip!" lesson exists in the database with rich content, but its `content` field is an **object** (with keys like `slides`, `presentation`, `practice`, `production`, `cefrLevel`) — not an array of canvas slides. The `handleSelectLesson` function checks `Array.isArray(lesson.content)`, which fails, so it creates a blank slide.

### Solution
Update `handleSelectLesson` in `AdminLessonEditor.tsx` to detect the AI-generated lesson format (object with a `slides` array inside) and convert each text-based slide into a canvas slide with auto-positioned elements.

### Conversion Logic

When `lesson.content` is an object with `lesson.content.slides` array, transform each slide into the canvas format:

1. **Title slides** → Create a large text element for the title, centered on the 1920x1080 canvas
2. **Vocabulary slides** → Create text elements for the word, IPA, definition, and example sentence, plus a placeholder image area. Pull vocabulary data from `lesson.content.presentation.vocabulary` matching the slide title
3. **Grammar slides** → Create text elements with the grammar rule from `lesson.content.presentation.grammar_rule`
4. **Practice/drill slides** → Create quiz-type canvas elements from `lesson.content.practice.exercises`
5. **Game slides** → Create an activity element with the game description from `lesson.content.practice.game_mechanic`
6. **Production slides** → Create text elements with the creative task
7. **All slides** → Include `teacherNotes` from the slide data

Each generated canvas slide gets:
- A title text element (top, large font)
- Content elements positioned in a clean layout
- The Pip character element on introductory/game slides
- Teacher notes preserved in the slide's `teacherNotes` field

### File Changes

| File | Change |
|---|---|
| `AdminLessonEditor.tsx` | Update `handleSelectLesson` to detect object-format content and call a converter function. Add `convertAILessonToCanvasSlides()` helper that maps the AI content structure to `Slide[]` with `canvasElements`. |

### Detail

The converter function will:
```
convertAILessonToCanvasSlides(content: object) → Slide[]
```

- Iterate over `content.slides[]`
- For each slide, create a `Slide` with `canvasElements: CanvasElementData[]`
- Position elements using a simple template per slide type:
  - Title: centered text at y=100, full width
  - Body content: text at y=300, left-aligned with padding
  - Vocabulary word: large text center, definition below, example below that
  - Quiz: quiz element with options from `content.practice.exercises`
- Set `lessonTitle` from the lesson title
- Set `level` from `content.cefrLevel` or `lesson.difficulty_level`

This means when you select "Hello, Pip!" from the curriculum browser, all 40 slides will load into the canvas with editable text, vocabulary cards, grammar rules, and quiz activities — ready to refine visually.

