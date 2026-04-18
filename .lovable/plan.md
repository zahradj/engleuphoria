

# Plan — Fix Classroom Tools + Paddle Legal Pages

## Part 1: Fix Whiteboard / Slides / Web Content / Pen Tool

**Diagnosis**: The classroom uses `EnhancedWhiteboard` (modern variant). The pen tool fails because `useEnhancedWhiteboard.ts` initializes the canvas size only once on mount. When the whiteboard tab is hidden then shown, `canvas.offsetWidth` returns 0, and the `globalCompositeOperation = "destination-out"` from the eraser is not reset properly, so subsequent pen strokes draw nothing visible. Slides panel + embed (web content) tool also rely on the same canvas being live.

**Fixes (`src/hooks/classroom/useEnhancedWhiteboard.ts`)**:
1. Use `ResizeObserver` to keep the canvas sized to its container; redraw white background on resize without wiping strokes.
2. Reset `globalCompositeOperation = "source-over"` and `globalAlpha = 1` at the start of every `handleMouseDown` so pen always works after using eraser/highlighter.
3. Guard against zero-size init (defer until container has dimensions).

**Fixes (`src/components/classroom/modern/EnhancedWhiteboard.tsx`)**:
- Remove the `transform: scale()` zoom on the canvas element (it breaks coordinate math); apply zoom via a wrapper div instead, or recompute `getCanvasCoordinates` to account for it.
- Ensure the canvas container has explicit `min-h-[400px]` so it has measurable size on first render.

**Embed / Web Content tool**: Verify the embed dialog (`EmbedLinkDialog`) is wired into the active toolbar. If the modern toolbar lacks the embed button, add a "Web Content" button that opens the dialog and renders embedded iframes as overlays on the canvas.

**Slides panel**: Confirm `ModernLessonSlidesPanel` arrow keys + thumbnail click still navigate; no logic changes expected — only verify after whiteboard fix.

## Part 2: Paddle Legal Pages

**Create three new pages** under `src/pages/legal/`:
1. `TermsOfServicePage.tsx` → route `/terms-of-service`
2. `PrivacyPolicyPage.tsx` → route `/privacy-policy`
3. `RefundPolicyPage.tsx` → route `/refund-policy`

**Shared layout**: One `LegalPageLayout.tsx` wrapper with:
- `NavHeader` at top
- Glassmorphic content card, max-width 800px, Inter typography
- Section anchors, last-updated date
- `FooterSection` at bottom

**Content** uses the user-provided drafts plus the Hub-specific clauses from project memory:
- ToS: User accounts, content ownership, prohibited conduct, **Hub system definition** (Playground 30m / Academy 60m / Success 60m).
- Privacy: Supabase auth/data, Paddle payments, camera/mic usage during live lessons, optional session recording for quality.
- Refund: **5-day (120-hour) cancellation rule**, trial lessons non-refundable, credit-only refund model.

**Routing (`src/App.tsx`)**: Add three public `<Route>` entries with lazy `Suspense` loading, matching existing patterns.

**Footer update (`src/components/landing/FooterSection.tsx`)**: Add a new "Legal" column with the 3 links so they appear on every landing/marketing page (Paddle requirement).

## Files Touched

**Whiteboard fixes** (3):
- `src/hooks/classroom/useEnhancedWhiteboard.ts`
- `src/components/classroom/modern/EnhancedWhiteboard.tsx`
- `src/components/classroom/modern/EnhancedWhiteboardToolbar.tsx` (add embed/web-content button if missing)

**Legal pages** (5 new + 2 edits):
- `src/pages/legal/LegalPageLayout.tsx` (new)
- `src/pages/legal/TermsOfServicePage.tsx` (new)
- `src/pages/legal/PrivacyPolicyPage.tsx` (new)
- `src/pages/legal/RefundPolicyPage.tsx` (new)
- `src/App.tsx` (add 3 routes)
- `src/components/landing/FooterSection.tsx` (add Legal column)

## Outcome

- Pen, eraser, highlighter, shapes, embed (web content), and slide navigation all work reliably in the classroom — no more dead canvas after tab switch or eraser use.
- Three Paddle-compliant legal pages live at the exact URLs Paddle requires, linked from every page footer, with Engleuphoria's Hub-specific rules baked in.

