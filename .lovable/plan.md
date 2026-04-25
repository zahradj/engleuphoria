## Fix: Hyperbeam playing but invisible on the Teacher's stage

### Root cause
On the **teacher** side, the Main Stage column wraps `<MainStage>` in:
```tsx
<div className="flex-1 relative">   {/* TeacherClassroom.tsx ~L517 — block, NOT flex */}
  <MainStage … />
</div>
```
`MainStage`'s outer element is `flex-1 flex items-stretch … relative`. Because its parent is a plain block (`flex-1 relative`), the `flex-1` on `MainStage`'s root does nothing and the element collapses to its content height.

- In **slide mode** the inner `<img>` has intrinsic dimensions, so the column "looks" sized correctly.
- In **web (Hyperbeam) mode** the inner `MultiplayerWebStage` uses only `absolute inset-0`, which has no intrinsic size, so the whole stage container collapses to 0 px tall → Hyperbeam reports `playing` but renders into a 0-height div → blank white screen.

The student side already wraps `<MainStage>` in a flex column (`flex-1 flex flex-col`), which is why the student sees the cloud browser correctly while the teacher does not.

### Fix (2 small edits)

**1. `src/components/classroom/stage/MainStage.tsx` (line 70)**
Change the outer wrapper from a fragile `flex-1` block to one that fills the parent in both flex and non-flex contexts:

- Before: `className="flex-1 flex items-stretch justify-stretch p-1 sm:p-2 relative min-h-0 min-w-0"`
- After: `className="absolute inset-0 flex items-stretch justify-stretch p-1 sm:p-2 min-h-0 min-w-0"`

This guarantees the stage always fills its `relative` parent — matching the dimensions Hyperbeam needs.

**2. `src/components/teacher/classroom/TeacherClassroom.tsx` (line 517)**
Add a minimum height so the column itself never collapses while the SDK is initializing:

- Before: `<div className="flex-1 relative">`
- After: `<div className="flex-1 relative min-h-0 overflow-hidden">`

(`min-h-0` lets the flex parent shrink below content; `overflow-hidden` clips the now-`absolute` child cleanly.)

### What I am NOT changing (and why)
- **TransparentCanvas / overlay**: already `absolute inset-0 z-50` with `pointerEvents: 'none'` whenever drawing is off OR when web mode is active for students. No white background. Not the cause.
- **WebRTC video refs**: the gray tiles at the moment of the bug are a side-effect of the stage collapsing the column layout (CommunicationZone tiles re-flow). The `srcObject` assignment in `CommunicationZone` / RTC hook is intact (logs show "Remote stream received" + connections succeeding). No refactor needed there — the tiles will return to normal once the stage fills its column again. If they remain gray after this fix, I'll inspect the video components separately.
- **MultiplayerWebStage internal sizing**: already `absolute inset-0` with an inner `h-full w-[92%]` container. Once its ancestor has real height, Hyperbeam renders correctly. No need to add `min-h-[500px]` (that would force scroll on small viewports and clash with the 16:9 stage aspect).

### Acceptance
- Teacher launches Co-Play (gamestolearnenglish.com or any URL) → cloud browser is visible on the teacher's stage, same as the student's.
- Console keeps showing `[Hyperbeam] connection state: playing`, but the iframe is now actually drawn.
- Slide mode and Whiteboard mode continue to render exactly as before.
- Drawing overlay remains transparent and click-through over web content.