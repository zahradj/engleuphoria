## Goal

Make the Slide Studio's hub branding switch live based on the lesson's `hub_type`, expose a manual override for content creators, and route every accent color through CSS variables (`--hub-accent`, `--hub-secondary`, `--hub-bg`) so all interactive UI inside the preview adapts instantly.

## Strategy

`SlideShell` is already the single source of truth for slide chrome (used by both classroom and builder after the previous refactor). We extend it to:

1. Emit CSS variables from one `HUB_TOKENS` map.
2. Pick the per-hub icon (`GraduationCap` / `Briefcase` / `Gamepad2`) and label.
3. Re-color the progress bar and content-card border via `var(--hub-accent)`.

The Slide Studio adds an override toggle that feeds an explicit hub down to `SlideCanvas → SlideShell`, overriding `useHubTheme()`'s lesson-derived value.

## File changes

### 1. `src/components/lesson-player/SlideShell.tsx`
- Replace `HUB_GRADIENT` + `HUB_LABEL` with one `HUB_TOKENS` map: `{ accent, secondary, bg, gradient }` per hub.
  - Playground: `#f97316` / `#fbbf24` / `#431407`
  - Academy: `#a855f7` / `#ec4899` / `#1e1b4b`
  - Professional: `#3b82f6` / `#eab308` / `#0f172a` (replacing the current emerald gradient — the spec says Professional = blue)
- Add `HUB_ICON` map → `Gamepad2 / GraduationCap / Briefcase`.
- Add `HUB_LABEL`: "Playground Hub" / "Academy Hub" / "Professional Hub".
- On the root `<div>`:
  - Add class `slide-container` + the hub key (`playground|academy|professional`) so external CSS can also target it.
  - Set `style` to include `background: tokens.gradient` AND CSS variables: `'--hub-accent', '--hub-secondary', '--hub-bg'` (typed as `React.CSSProperties`).
- Top-bar: render the hub icon (`<HubIcon className="w-4 h-4 text-white/90" />`) before the metadata text and use `HUB_LABEL[hub]` as the first segment of `meta`.
- Progress bar: replace `config.colorPalette.primary` with `var(--hub-accent)` and matching boxShadow.
- Content card: keep white background but add `border-2` using `var(--hub-accent)` at 30% opacity for subtle hub-tint.

### 2. `src/components/creator-studio/steps/slide-studio/SlideStudio.tsx`
- Add `useState<HubType | null>(hubOverride, setHubOverride)` (HubType = `'playground' | 'academy' | 'professional'`).
- Resolve `effectiveHub`: `hubOverride ?? toShellHub(activeLessonData.hub)` (mapping `success → professional`).
- Pass `hubOverride={effectiveHub}` to `<SlideCanvas>` (new optional prop).
- In the lesson header strip, add a compact 3-button pill ("Hub Preview Override") that lets the creator force Playground / Academy / Professional. A "Reset" pill clears the override. Selected pill uses `bg-[var(--hub-accent)] text-white`.

### 3. `src/components/creator-studio/steps/slide-studio/SlideCanvas.tsx`
- Add optional `hubOverride?: PlayerHubType` prop.
- Compute `shellHub = hubOverride ?? toShellHub(hub)` (instead of always deriving from `useHubTheme()`).
- Pass `shellHub` to `<SlideShell hub={shellHub} …>` and to the FrontPageSlide (which accepts the studio hub union — map back: `professional → success`).

## What we deliberately don't add

- No new global CSS file or Tailwind config tokens — everything ships through inline CSS variables on `SlideShell`. That's the safest way to re-skin without breaking the classroom (which uses the same component).
- No change to `useHubTheme` / `hub-surface` — those keep theming the *outer* studio chrome (sidebars, filmstrip). The override only affects the slide preview rectangle.
- No icon swap inside individual interactive components (MCQ, flashcards, etc.) — they already inherit color from the white content card; the user's spec asks them to use `bg-[var(--hub-accent)]`, which works automatically once the variable is published on the shell. No touch needed today.

## Acceptance

- Editing an Academy lesson shows a purple radial-glow shell, a `GraduationCap` icon, and "Academy Hub" in the top-left.
- Clicking the "Professional" override pill instantly recolors the shell to blue, swaps the icon to `Briefcase`, and the progress bar turns blue — without reloading the lesson.
- The classroom view (`StageContent`) for the same slide is unaffected by the studio override (override is local to the studio component tree).
- A descendant component using `className="bg-[var(--hub-accent)]"` picks up the right color in every state.
