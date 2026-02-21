
# Support Layer, Pre-Flight Check, and Admin Emergency View

## Overview

Add three major features: (1) a floating Help Center widget on both dashboards with quick fixes and a live support form, (2) a Pre-Flight hardware check screen before entering any classroom, and (3) a connection health indicator inside classrooms plus a "Live Classroom Pulse" emergency view for admins.

---

## 1. Floating Help Center Widget

### New Files

**`src/components/support/FloatingHelpButton.tsx`**
- A fixed-position circular button (bottom-right corner) with a `HelpCircle` icon
- On click, opens a Dialog/Sheet modal with two sections:
  - **Quick Fixes** (accordion-style): "My mic isn't working", "How to book a class", "I can't see the teacher's slides", "My video is laggy", "How to cancel a class"
  - **Live Support Form**: Name (pre-filled from auth), email, category dropdown (Technical / Billing / General), message textarea, "Send" button
- The form inserts into a new `support_tickets` table

**`src/components/support/QuickFixItem.tsx`**
- Reusable accordion item with icon + solution text for each quick fix

### Integration Points
- Import `FloatingHelpButton` into:
  - `src/components/teacher/dashboard/TeacherDashboardShell.tsx` (render at bottom of the component)
  - `src/components/student/dashboard/` or the student layout wrapper
- The button appears on all dashboard pages but NOT inside the classroom (to avoid clutter)

### Database
- New `support_tickets` table: `id`, `user_id`, `user_email`, `user_name`, `category`, `message`, `priority` (default 'normal'), `status` (default 'open'), `created_at`
- RLS: Users can INSERT their own tickets; admins can SELECT all

---

## 2. Connection Health Check (Classroom)

**`src/hooks/useConnectionHealth.ts`**
- A lightweight hook that measures connection quality by:
  - Checking `navigator.connection` API (if available) for `effectiveType` and `downlink`
  - Falling back to a periodic small fetch to the Supabase health endpoint and measuring latency
- Returns: `{ quality: 'good' | 'fair' | 'poor', latencyMs: number, suggestion: string | null }`
- When `quality === 'poor'`, `suggestion` returns: "We noticed a slow connection. Try turning off your video to improve audio quality."

**Modify `src/components/student/classroom/StudentClassroomHeader.tsx`**
- Replace the static `Wifi`/`WifiOff` badge with a dynamic signal strength indicator:
  - Green (`Signal`) for good
  - Yellow (`SignalMedium`) for fair, with a tooltip showing the suggestion
  - Red (`SignalLow`) for poor, with a subtle alert banner below the header

**Modify `src/components/classroom/unified/UnifiedTopBar.tsx`**
- Add a small signal icon next to the "Live" indicator using the same `useConnectionHealth` hook
- Show tooltip on hover with latency info

---

## 3. Pre-Flight Hardware Check

**`src/components/classroom/PreFlightCheck.tsx`**
- A full-screen overlay/page shown before entering the classroom
- Three checks displayed as a vertical checklist:
  1. **Camera**: Requests `getUserMedia({ video: true })`, shows live preview in a small rounded rectangle
  2. **Microphone**: Requests `getUserMedia({ audio: true })`, shows a real-time audio level bar (using `AnalyserNode` from Web Audio API)
  3. **Speaker**: Plays a short test tone or chime, asks user to confirm they heard it via a checkbox
- Each check shows a green checkmark when passed, red X on failure with a troubleshooting hint
- "Join Class" button is disabled until Camera + Microphone pass (speaker is optional but encouraged)
- "Skip Check" link for returning users who want to bypass

**`src/hooks/usePreFlightCheck.ts`**
- Manages the state machine for each device check
- Returns: `{ cameraStatus, micStatus, speakerStatus, videoStream, audioLevel, runCameraCheck, runMicCheck, runSpeakerTest, allPassed }`

### Integration
- **`src/pages/StudentClassroomPage.tsx`**: Add state `preFlightPassed`. Show `PreFlightCheck` when false; show `SessionPrivacyGuard > StudentClassroom` when true
- **`src/pages/TeacherClassroomPage.tsx`**: Same pattern -- show `PreFlightCheck` first, then the classroom

---

## 4. Admin "Live Classroom Pulse" (Emergency View)

**Modify `src/components/admin/SuperAdminControlCenter.tsx`**
- Add a new tab: `{ id: 'pulse', label: 'Classroom Pulse', icon: <HeartPulse> }`
- The Pulse tab shows:
  - A real-time list of all active classroom sessions (reuses existing `fetchLiveSessions`)
  - Each session card includes:
    - Teacher name, student name, room ID, duration elapsed
    - **Connection status badge**: "Connected" (green), "Unstable" (yellow), "Disconnected" (red)
    - A "Notify Teacher" button that inserts a notification into the `notifications` table for the teacher
  - Summary bar at top: "X classes live, Y healthy, Z with issues"

**Modify the `classroom_sessions` table** (migration):
- Add column `connection_health` (text, default 'connected', check in ('connected', 'unstable', 'disconnected'))
- The classroom sync service will periodically update this field based on WebRTC/connection status

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/support/FloatingHelpButton.tsx` | Floating help widget with quick fixes + support form |
| Create | `src/components/support/QuickFixItem.tsx` | Reusable accordion quick-fix item |
| Create | `src/hooks/useConnectionHealth.ts` | Network quality detection hook |
| Create | `src/components/classroom/PreFlightCheck.tsx` | Hardware verification screen |
| Create | `src/hooks/usePreFlightCheck.ts` | Device check state management |
| Modify | `src/components/teacher/dashboard/TeacherDashboardShell.tsx` | Add FloatingHelpButton |
| Modify | `src/components/student/classroom/StudentClassroomHeader.tsx` | Dynamic signal strength indicator |
| Modify | `src/components/classroom/unified/UnifiedTopBar.tsx` | Signal strength icon |
| Modify | `src/pages/StudentClassroomPage.tsx` | Pre-flight gate before classroom entry |
| Modify | `src/pages/TeacherClassroomPage.tsx` | Pre-flight gate before classroom entry |
| Modify | `src/components/admin/SuperAdminControlCenter.tsx` | Add "Classroom Pulse" emergency tab |
| Migration | `support_tickets` table + `connection_health` column | Database support |

---

## Database Migration

```text
1. CREATE TABLE support_tickets (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES public.users(id),
     user_email TEXT NOT NULL,
     user_name TEXT,
     category TEXT DEFAULT 'general' CHECK (category IN ('technical', 'billing', 'general')),
     message TEXT NOT NULL,
     priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
     status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
     created_at TIMESTAMPTZ DEFAULT now()
   );

2. ALTER TABLE classroom_sessions 
   ADD COLUMN connection_health TEXT DEFAULT 'connected' 
   CHECK (connection_health IN ('connected', 'unstable', 'disconnected'));

3. Enable RLS on support_tickets:
   - INSERT: authenticated users can insert where user_id = auth.uid()
   - SELECT: admins can read all; users can read their own
```

---

## No Loading State Changes

The existing Suspense/Skeleton loading states remain as-is. The Pre-Flight check is a deliberate UX gate, not a loading state.
