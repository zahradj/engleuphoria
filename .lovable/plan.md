## Goal

Make Engleuphoria feel like ONE product across Playground / Academy / Success by collapsing 3 parallel slide systems into:

**ONE Slide Engine + ONE Creator + 3 Hub Themes**

Plus fix two concrete bugs:
1. Classroom is locked to Academy purple regardless of lesson hub.
2. Academy & Success creators can't insert images.

---

## Architecture (target)

```text
SlideEngine (single)
 ├── SlideShell        — layout: Header / MainContent / ActivityPanel
 ├── ActivityRegistry  — MCQ, Drag&Drop, Match, Quiz, Speak, etc.
 ├── Navigation        — prev/next/progress (shared)
 └── HubThemeProvider  — injects tokens (bg, slideBg, primary, radius, fontScale, vibe)

UnifiedCreator (single, /content-creator)
 ├── HubModeSwitch     — Playground | Academy | Success
 ├── SlideTypePalette  — filtered by hub-permitted activities
 ├── EditorCanvas      — same SlideShell as the player
 └── MediaPicker       — AI generate (Gemini) | Library | URL paste

Classroom (single)
 └── reads lesson.hub → fallback user.activeHub → applies HubTheme
```

Three hub themes are pure data (no duplicated components):

```ts
playground: { bg, slideBg:#fff, primary:#FE6A2F, radius:'20px', fontScale:'large',   vibe:'playful' }
academy:    { bg:#0f172a, slideBg:#1e293b, primary:#6B21A8, radius:'14px', fontScale:'medium', vibe:'focused' }
success:    { bg:#f8fafc, slideBg:#fff,   primary:#059669, radius:'10px', fontScale:'compact',vibe:'professional' }
```

---

## Work plan

### Phase 1 — Theme unification (foundation)
1. Create `src/lib/hubThemes.ts` — single source of truth (3 token objects above), reconciling `hubTheme.ts`, `hubConfig.ts`, `hubTheme.ts (creator)`, `phaseTheme.ts`, `SlideHubContext.tsx`. Keep names but re-export from one file.
2. Add `<HubThemeProvider hub={...}>` that sets CSS vars (`--hub-bg`, `--hub-slide-bg`, `--hub-primary`, `--hub-radius`, `--hub-font-scale`).
3. Replace all hard-coded hub colors in slide/classroom components with these CSS vars.

### Phase 2 — Unified Slide Engine
4. Promote `SlideShell` to enforce 3 zones: `<Header/> <MainContent/> <ActivityPanel/>`. Add `ActivityPanel` slot (currently missing — this is what makes slides feel "alive").
5. Make `DynamicSlideRenderer` fully theme-driven: button padding/radius/font sizes derived from theme.vibe, not from hub-specific JSX branches.
6. Audit `slides/` and `activities/` folders — delete any hub-duplicated components; keep one component per slide type, styled by tokens.

### Phase 3 — Classroom fix
7. `UnifiedClassroomPage` / `TeacherClassroomPage` / `StudentClassroomPage` / `AcademyClassroom`: 
   - Resolve hub: `lesson.hub ?? booking.hub ?? userActiveHub ?? 'academy'`.
   - Wrap classroom in `<HubThemeProvider>`.
   - Remove the hardcoded purple frame.
8. Delete `AcademyClassroom.tsx` if redundant after unification (route → `UnifiedClassroomPage`).

### Phase 4 — Unified Creator + image upload fix
9. Build `UnifiedCreator` from `PlaygroundCreator` (richest one, 1385 lines) as the base. Add `hub` prop driven by HubModeSwitch.
10. Extract `MediaPicker` component reused by all slide types in all hubs:
    - **AI generate** → calls existing `ai-image-generation` edge function
    - **Library** → lists previously generated assets from `lesson-slides` bucket
    - **URL paste** → validates and embeds
11. Replace `AcademyCreator` and `SuccessCreator` routes with thin wrappers that mount `UnifiedCreator` with a preset hub (or redirect). Then delete the duplicated 1140 + 1223 lines.
12. Fix root cause of "no image insert" in Academy/Success: their `EditorCanvas`/slide-type registry was missing the image action — now solved by sharing `MediaPicker`.

### Phase 5 — Cleanup & verify
13. Remove dead exports from `hubTheme.ts`, `hubConfig.ts`, `phaseTheme.ts`, `SlideHubContext.tsx` after the consolidation.
14. Smoke test: open one lesson per hub in classroom → verify theme. Insert image in each creator hub → verify upload.
15. Update memory: "One Slide Engine + Three Themes" rule, "lesson.hub drives classroom theme".

---

## What gets deleted
- `src/pages/AcademyCreator.tsx` (1223 lines) → wrapper
- `src/pages/SuccessCreator.tsx` (1140 lines) → wrapper  
- `src/pages/PlaygroundCreator.tsx` (1385 lines) → becomes `UnifiedCreator`
- `src/pages/AcademyClassroom.tsx` (168 lines) → routes to `UnifiedClassroomPage`
- Hub-specific slide variants in `lesson-player/slides/` (if any duplicates exist)

Net: ~3000 lines removed, ~600 lines added. One source of truth for theme, engine, and creator.

---

## Risks & mitigations
- **Risk**: Existing lessons authored in Playground may render differently after token migration.  
  **Mitigation**: Keep Playground tokens identical to current hardcoded values; visual diff one lesson per hub before deleting old creators.
- **Risk**: Classroom hub resolution fails for legacy bookings without `hub` field.  
  **Mitigation**: Fallback chain ends at user's active hub, then `'academy'` default.
- **Risk**: Image upload regression in Playground.  
  **Mitigation**: `MediaPicker` is extracted FROM Playground's working code, not rewritten.

No DB migrations required — `lessons.hub` and `bookings.hub` already exist per memory.