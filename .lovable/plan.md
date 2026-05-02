# Placement Test: Branding + Audio Reliability

Two-part upgrade to `src/components/placement/*` — brand polish and an audio playback fix. No backend schema changes.

---

## Part 1 — Branded chat avatar + ambient cursor glow

### 1a. Replace the star avatar with the EnglEuphoria logo
File: `src/components/placement/ChatBubble.tsx`

- Remove the `Sparkles` icon (lucide-react import + usage).
- Import the logo image directly: `import logoMark from '@/assets/logo-white.png'` (we use the image, not the `<Logo />` button — the button wraps a clickable `<button>` that navigates home, which is wrong inside a chat bubble avatar).
- Render inside the existing circular gradient container:
  ```tsx
  <img
    src={logoMark}
    alt="EnglEuphoria guide"
    className="w-6 h-6 object-contain select-none pointer-events-none"
    draggable={false}
  />
  ```
- Keep the `w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500` halo so the white wordmark sits on a branded disc.

### 1b. Hub-aware ambient cursor glow
File: `src/components/placement/AIPlacementTest.tsx`

- Add a `useRef<HTMLDivElement>` on the outermost wrapper.
- Add a `useEffect` that attaches a `mousemove` listener on the wrapper, throttled via `requestAnimationFrame`, that writes:
  ```ts
  el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  ```
  Initialize the vars to `50%` / `50%` so the glow is visible before the first move and on touch devices.
- Add a non-interactive `::before`-style overlay div (absolute, `inset-0`, `pointer-events-none`, `z-0`) with inline style:
  ```ts
  background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(192, 132, 252, 0.18), transparent 70%)'
  ```
  `rgb(192,132,252)` = `violet-400` — a vibrant, lighter violet that pops against the existing `from-slate-900 via-purple-900 to-slate-900` background (Academy hub). The card content gets `relative z-10` so it sits above the glow.
- Cleanup the listener on unmount.

(Single-hub glow is sufficient — placement test currently lives under the Academy/onboarding flow. We hardcode the violet tone now and can lift it into a prop later if Playground/Success ever get their own placement screens.)

---

## Part 2 — Audio playback fix

File: `src/components/placement/TestPhase.tsx` (and a tightening pass on the existing `handlePlayAudio`).

Current state (already partially correct): playback is gated behind a Play button, uses `URL.createObjectURL`, caches per-question, and revokes on unmount. The remaining gaps:

1. **Blob handling is fragile.** `supabase.functions.invoke` returns `data` typed as `unknown`; for our `audio/mpeg` response it usually arrives as a `Blob`, but the fallback `new Blob([data as ArrayBuffer])` silently produces an empty/invalid blob if `data` is actually a JSON error object (e.g. when the edge function returns `{ error: "..." }` with status 500 — `invoke` does not throw on non-2xx in all cases). Fix:
   - After the invoke, explicitly check: if `data` is not a `Blob` and not an `ArrayBuffer`, treat it as an error payload, log it, and throw with the embedded message.
   - If `error` is present, surface `error.message` to the toast instead of a generic string.
2. **Add a `canplaythrough` / load-error path.** Wire `audio.addEventListener('canplaythrough', ...)` to clear an `isLoading` state, and keep `onerror` to toast `"Failed to load audio. Please check your connection or try again."` (matches the prompt's wording).
3. **Wrap `audio.play()` in `.catch`** so a rejected play promise (autoplay policy, decoding failure) toasts the same friendly message and resets `isPlaying`.
4. **Guard against double-clicks** while loading: the button is already `disabled={isPlaying}`; add a separate `isLoading` flag so we can show `Loader2` (already imported) before the audio starts.
5. **Console diagnostics**: log `console.error('[Placement audio]', { questionIndex, voiceId, err })` in every catch path so future failures are debuggable from the browser console.

No changes needed to `supabase/functions/elevenlabs-tts/index.ts` — it already returns the `ArrayBuffer` with `Content-Type: audio/mpeg` and proper CORS headers.

---

## Files to edit

- `src/components/placement/ChatBubble.tsx` — swap Sparkles → logo image.
- `src/components/placement/AIPlacementTest.tsx` — add wrapper ref, mousemove tracker, radial-gradient overlay div.
- `src/components/placement/TestPhase.tsx` — harden `handlePlayAudio` (blob validation, error messaging, loading state, play().catch).

## Acceptance checks

- Guide chat bubbles display the white EnglEuphoria wordmark inside the violet/fuchsia disc; no more 4-point star.
- Moving the mouse over the placement test page produces a soft violet halo that follows the cursor; on touch devices the static centered glow remains.
- Clicking the listening "Play" button either plays the audio or surfaces a toast with the explicit failure reason; nothing autoplays; repeat clicks during load are ignored.
- Browser console shows a single structured `[Placement audio]` log when a failure occurs, including the question index.
