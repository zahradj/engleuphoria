

## Add Dark/Light Mode Toggle Across All Pages

### Problem
The `ThemeModeToggle` component (sun/moon button with ripple animation) only appears on the auth pages. The homepage, About, Teach With Us, and all dashboard pages (Admin, Teacher, Student) have no way to switch between light and dark mode.

### Plan

**1. NavHeader (Landing, About, For Teachers pages)**
Add `ThemeModeToggle` next to the `LanguageSwitcher` in both the desktop right section and the mobile drawer.

- **Desktop**: Insert toggle between `LanguageSwitcher` and the "Log In" button (line ~126)
- **Mobile drawer**: Add a "Theme" row next to the "Language" row (line ~228)

**2. ScrollHeader (Teacher & Admin dashboards)**
This sticky header appears on scroll for dashboard pages. Add `ThemeModeToggle` next to the `Logo` in the flex container (line ~46-50).

**3. AdminHeader**
Add `ThemeModeToggle` in the right-side controls area, next to the Search button (line ~19).

**4. StudentSidebar**
Add `ThemeModeToggle` at the bottom of the sidebar, near the logout button area.

**5. TeacherDashboardShell top navigation**
Add `ThemeModeToggle` in the top navigation bar area.

### Files Changed

| File | Action |
|---|---|
| `src/components/landing/NavHeader.tsx` | Import + add toggle in desktop nav and mobile drawer |
| `src/components/navigation/ScrollHeader.tsx` | Import + add toggle next to logo |
| `src/components/admin/AdminHeader.tsx` | Import + add toggle in header controls |
| `src/components/student/StudentSidebar.tsx` | Import + add toggle near bottom |
| `src/components/teacher/dashboard/TeacherDashboardShell.tsx` | Import + add toggle in top nav |

