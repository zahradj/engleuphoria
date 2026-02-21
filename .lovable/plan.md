

# Add "Help & Guidelines" Tab to Teacher Dashboard

## Overview

Create a new "Help & Guidelines" tab in the Teacher Dashboard containing the complete Teacher Onboarding Guide with clean formatting, section icons, and a "Contact Admin" button.

---

## Changes

### 1. New Component: `TeacherGuideTab`

**File to create:** `src/components/teacher/dashboard/TeacherGuideTab.tsx`

A self-contained component that renders the full onboarding guide using Card components and Lucide icons for each section:

| Section | Icon | Content |
|---------|------|---------|
| The "Smart" Dashboard | `LayoutDashboard` | Red dot indicator, Student Context Card explanation |
| The 25/55 Minute Rule | `Clock` | Buffer system table (25-min / 55-min teaching windows) |
| The Interactive Classroom | `Monitor` | Shared Canvas, Sparkle icon, Zen Mode features |
| Post-Class Workflow | `ClipboardCheck` | Lesson wrap-up steps (mastered goals, areas for improvement, submit) |
| Cancellation & Attendance | `ShieldCheck` | 24-hour rule, late cancellations, no-show policy (10-min wait) |
| Tips for Success | `Lightbulb` | Academy (teens) and Professional (adults) tips |

At the bottom: a "Contact Admin" button that opens `mailto:f.zahra.djaanine@engleuphoria.com?subject=Teacher%20Support%20Request`.

### 2. Add Tab to Navigation

**File to modify:** `src/components/teacher/dashboard/TeacherTopNav.tsx`

- Add `'help'` to the `TabType` union
- Add a new nav item: `{ id: 'help', label: 'Help', icon: HelpCircle }`

### 3. Wire Tab in Dashboard Shell

**File to modify:** `src/components/teacher/dashboard/TeacherDashboardShell.tsx`

- Update the `TabType` union to include `'help'`
- Import `TeacherGuideTab`
- Add `case 'help': return <TeacherGuideTab />;` in the `renderContent` switch

### 4. Export

**File to modify:** `src/components/teacher/dashboard/index.ts`

- Add `export { TeacherGuideTab } from './TeacherGuideTab';`

---

## Technical Details

- No database changes required
- No new dependencies -- uses existing `lucide-react` icons and shadcn `Card`, `Button`, `Separator` components
- The guide content is hardcoded in the component (static content, no CMS needed)
- The "Contact Admin" button uses a standard `<a href="mailto:...">` wrapped in a shadcn `Button`

