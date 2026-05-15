## Phase 1 Stabilization — Plan

### 1. Unblock the End Class button (icon overlap)

The new floating group I added in the previous turn — slide-grid toggle + force-sync — is positioned `fixed top-3 right-3 z-[110]`, which sits directly on top of the **End Class** button in `ClassroomTopBar`. Confirmed by reading both files.

**Fix:** Move both icons out of the fixed overlay and **into the ClassroomTopBar itself**, placed in the right-hand action cluster just before the `|` divider that precedes End Class. The realtime status dot stays as a small inline indicator next to them.

- `TeacherClassroom.tsx`: remove the `fixed top-3 right-3` block; pass `onToggleSlideNav`, `slideNavOpen`, `onForceSync`, and `realtimeConnected` as props to `ClassroomTopBar`.
- `ClassroomTopBar.tsx`: render two ghost icon-buttons (`LayoutGrid`, `RefreshCw`) + a 2.5px status dot in the right action group, before the divider preceding End Class.

Result: icons are visible and reachable, End Class is no longer covered.

### 2. Storybook title not generating

Two issues:

a. **Credits exhausted** — edge function logs show `AI gateway error 402 {"type":"payment_required","message":"Not enough credits"}` from `generate-storybook`. The function already returns a 402 message; the editor needs to surface it as a clear toast instead of a silent failure. Update `StorybookEditor.generate()` to read the structured error and toast `"Add credits in Workspace → Usage to generate stories."` when status is 402.

b. **Title sometimes missing** even on success — the system prompt does not explicitly instruct the model to write a title; `title` is only listed in the JSON schema. Gemini occasionally returns it empty. Fixes:
- Add an explicit line in the system prompt: `"Always return a short, vivid story title (3-7 words) in the 'title' field. Never leave it blank."`
- Strengthen client fallback: `title: (data?.title?.trim()) || slide.title || prompt.slice(0,60)` and trim before saving.

Files: `supabase/functions/generate-storybook/index.ts`, `src/components/creator-studio/shared/StorybookEditor.tsx`.

### 3. Verification pass (no code changes — confirm and report)

For each of the user's checklist items I will:
- **502 / classroom crash**: re-read `UnifiedClassroomPage.tsx`, `LessonsListCard.tsx`, and the booking-resolver chain to confirm the previous hook-order fix and realtime invalidation are still in place; check console + edge logs for fresh 5xx.
- **50/50 video split + faint hub background**: re-read `CommunicationZone.tsx` and the hub `bg-gradient-*` in `TeacherClassroom.tsx` / `StudentClassroom.tsx` to confirm both video tiles share the same `aspect-[4/3] w-full` wrapper and the hub-tinted background is applied.
- **Hub color injection in Creator Studio**: re-read `supabase/functions/generate-storybook/index.ts` and `_shared/hubProfiles.ts` to confirm hub-specific palette tokens (purple for academy, orange/yellow for playground) are passed into the image-prompt assembly.

I'll report findings in chat after the build step; if any verification reveals a regression, I'll list it but **not** auto-fix it in this plan — that becomes a follow-up task you can approve.

### Out of scope

- Live test-run of the Creator Studio (requires credits to be topped up).
- Any RLS / migration changes from the security findings.
- Any change to the stars or annotation sync from the previous turn.
