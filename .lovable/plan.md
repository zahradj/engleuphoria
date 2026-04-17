

# Fix: Hub-Locked Teacher Discovery

## Root Cause

The `FindTeacher` page does **not** use the student's actual level (`useStudentLevel`) to filter teachers. It defaults to showing "All" teachers because:

1. Every navigation link (`TeachersTab`, `StudentQuickActions`, `PlaygroundDashboard`) routes to `/find-teacher` **without** a `?hub=` param
2. `FindTeacher` defaults `hubFilter` to `'all'` when no URL param is present
3. The hub filter tabs (All / Playground / Academy / Success) are always visible, letting students browse other hubs
4. The only teacher in the DB has `hub_role='academy_success_mentor'` — correctly not a Playground teacher, but visible because filter is "all"

## Solution

### 1. Auto-lock FindTeacher to student's hub

Import `useStudentLevel` in `FindTeacher.tsx`. On mount, if the student has a known level, force-set `hubFilter` to that level and **hide the hub tabs entirely**. Students should only see teachers matching their hub.

```
Student Level → Hub Filter → Visible hub_roles
────────────────────────────────────────────────
playground    → playground  → playground_specialist
academy       → academy     → academy_mentor, academy_success_mentor
professional  → professional→ success_mentor, academy_success_mentor
```

### 2. Update all navigation links to pass hub param

Update these files to append `?hub={studentLevel}`:
- `src/components/student/TeachersTab.tsx` — 4 navigate calls
- `src/components/student/dashboard/StudentQuickActions.tsx` — 1 navigate call

### 3. Hide hub filter tabs for students

Remove or hide the `<Tabs>` component in `FindTeacher.tsx` since students are locked to their hub. The hub name can be shown as a static header badge instead (e.g., "🎪 Playground Teachers").

### 4. Fix getStudentLevel in FindTeacher

Currently `getStudentLevel()` derives level from `hubFilter` state for the booking modal. Replace this with the actual `useStudentLevel()` hook value so the booking modal always gets the correct 30/60 min duration.

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/student/FindTeacher.tsx` | Import `useStudentLevel`, auto-lock hub filter, hide tabs, fix booking level |
| `src/components/student/TeachersTab.tsx` | Pass `?hub={hubId}` on all navigate calls |
| `src/components/student/dashboard/StudentQuickActions.tsx` | Pass `?hub=` on navigate call |

## Expected Result

- Playground student opens Find Teacher → sees **only** `playground_specialist` teachers
- Academy student → sees only `academy_mentor` + `academy_success_mentor` teachers
- Success student → sees only `success_mentor` + `academy_success_mentor` teachers
- No ability to switch hub tabs — locked to student's level
- Booking modal auto-sets correct duration (30 vs 60 min)

