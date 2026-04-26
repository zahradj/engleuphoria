## "One Room, One Session" — verification + safety net

### Findings (the architecture is already correct)
After tracing the Co-Play flow end-to-end, the requested architecture is **already implemented**:

1. **Teacher is the sole session creator.** `createHyperbeamSession()` is called from exactly one place: `TeacherControlDock.tsx` line 100 (the teacher's "Co-Play" button). The student bundle never imports or calls it.
2. **Teacher broadcasts the embed URL.** `TeacherControlDock` calls `onEmbedUrl(embedUrl)` → `TeacherClassroom` runs `updateSharedDisplay({ embeddedUrl: url })` → `useClassroomSync` writes to the shared `classroom_sessions` row keyed by `roomId` via `classroomSyncService.updateSession(...)`. Supabase Realtime `postgres_changes` propagates the row to the student.
3. **Student is a pure receiver.** `StudentClassroom` reads `embeddedUrl` from the same `useClassroomSync` hook (line 474) and passes it straight into `<MainStage embeddedUrl={embeddedUrl} … />`, which forwards it to `<MultiplayerWebStage embedUrl={…} role="student" />`. Same string the teacher minted → same Hyperbeam VM.
4. **`updateSharedDisplay` is teacher-gated** (`useClassroomSync.ts` line 327: `if (role !== 'teacher') return;`), so even a misclick from a student client cannot overwrite the shared URL.
5. **Control / admin token.** Teacher passes `adminToken` into `MultiplayerWebStage` and sets `disableInput: false`; student gets `disableInput: !controlEnabled`, where `controlEnabled` is the teacher's "Unlock Student Interaction" toggle (`iframeUnlocked`). Already correct.

So the symptom "teacher and student see different screens" cannot be caused by independent VMs from the current code path. The most likely real causes are:
- The teacher mints a **second** VM (clicks Co-Play twice / re-launches), and the student is still mounted on the previous URL momentarily until realtime catches up.
- Hyperbeam itself rate-limits on the second mint and the teacher silently falls back to a regular `<iframe>` (see `TeacherControlDock` line 107–116) — at that point the two sides see the same URL but it's not a synced cloud browser, so each renders the page locally.
- Realtime didn't deliver the row update to the student tab (network blip / RLS / channel not subscribed).

### Safety net (single small edit to make regressions impossible & loud)

**File:** `src/components/classroom/stage/MultiplayerWebStage.tsx`

Change `createHyperbeamSession` to require an explicit `callerRole` and throw if anything other than the teacher tries to mint a VM:

```ts
export async function createHyperbeamSession(
  startUrl?: string,
  callerRole: 'teacher' | 'student' = 'teacher',
): Promise<{ embedUrl: string; sessionId: string; adminToken?: string }> {
  if (callerRole !== 'teacher') {
    throw new Error(
      '[Co-Play] createHyperbeamSession() may only be called by the teacher. ' +
      'Students must mount the embedUrl broadcast by the teacher.',
    );
  }
  console.log('[Co-Play] Teacher minting a new Hyperbeam VM…', { startUrl });
  // …existing supabase.functions.invoke('hyperbeam-session', …) body unchanged…
}
```

And in `TeacherControlDock.tsx` (the only caller), pass `'teacher'` explicitly:
```ts
const { embedUrl } = await createHyperbeamSession(startNormalized, 'teacher');
```

### Diagnostic logging (so the user can confirm it's working)
Add two tiny `console.log` lines to make the broadcast/receive cycle visible in DevTools:
1. **Teacher** — in `TeacherClassroom.handleEmbedLink` flow (`updateSharedDisplay({ embeddedUrl: url })`), log:
   `[Co-Play] Teacher broadcasting embedUrl to room <roomId>: <url>`
2. **Student** — in `useClassroomSync` where the session row updates with a new `embeddedUrl`, log:
   `[Co-Play] Student received embedUrl from teacher broadcast: <url>`

If the user reports the bug again, comparing those two log lines on the two browsers immediately tells us whether (a) the teacher minted twice, (b) the broadcast didn't arrive, or (c) the student mounted before the URL synced.

### What I am NOT changing
- `hyperbeam-session` edge function — already correct, it mints exactly one VM per call.
- `useClassroomSync.updateSharedDisplay` — already teacher-gated.
- `MultiplayerWebStage` mount logic — already serialized via `initPromiseRef` from the previous fix.
- The `controlEnabled` / `adminToken` pass-through — already correct.

### Acceptance
- Teacher pastes a URL → clicks Co-Play → console shows `Teacher minting…` then `Teacher broadcasting…`.
- Within ~1s the student's console shows `Student received embedUrl…` with the **same** URL.
- Both windows render the same cloud browser stream (clicks, scrolls, and typing on either side are visible to the other once "Unlock Student Interaction" is on).
- If anything ever calls `createHyperbeamSession()` from a student context, the call now throws a clear, debuggable error instead of silently spinning up a second VM.