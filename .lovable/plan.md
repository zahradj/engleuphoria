
# Plan — Mobile/Phone Version of Engleuphoria

"Everything" is huge — Engleuphoria has 3 hubs, student/teacher/admin dashboards, classroom, scheduler, lesson player, content creator. Some mobile infrastructure already exists (`MobileOptimizedLayout`, `MobileNavigation`, `MobileHeader`, `useIsMobile`, `MobileAwarePage`) but isn't applied consistently. I'll roll it out across the platform in phases, prioritizing what students and teachers actually use on phones.

## Phase 1 — Mobile Student Experience (highest impact)
- **Landing & auth**: Audit `/`, `/student-signup`, `/auth` for single-column layout, large tap targets (≥44px), readable type
- **Hub dashboards** (`/playground`, `/academy`, `/hub`): Stacked cards, swipeable unit carousel, sticky bottom nav (Home / Lessons / Book / Profile)
- **Lesson player / Focus Reader**: Full-screen, swipe between slides, bottom-bar controls, large CTAs for activities (drag-drop, MCQ, mimic)
- **Booking flow** (`/find-teacher` → profile → slot picker): Vertical teacher cards, day-tab calendar (replaces grid), sticky "Confirm Booking" bar
- **Profile & Vault**: Stacked sections, bento-grid → 2-column on phone

## Phase 2 — Mobile Teacher Experience
- **Teacher dashboard**: Collapsible cards, bottom nav (Dashboard / Schedule / Students / Profile)
- **Schedule/availability**: Replace weekly grid with vertical day-by-day list with chip slots (grid is unusable on 430px)
- **Next Lesson card**: Sticky bottom "Enter Classroom" CTA when session is live

## Phase 3 — Mobile Classroom (most complex)
- Tabbed mobile UI: **[Whiteboard] [Slides] [Chat] [Video]** — one tool fills screen at a time
- Floating PiP for student/teacher video while on whiteboard or slides
- Touch-optimized whiteboard: bigger tool buttons, color sheet, palm-rejection
- Bottom sheet for tools, settings, observation tags

## Phase 4 — Admin & Content Creator
- Show "Best experienced on desktop — open on a computer for full editing" notice on phones
- Allow read-only viewing of admin dashboards (student list, teacher queue) but redirect heavy CRUD to desktop

## Phase 5 — Installable PWA (Add to Home Screen)
- Install `vite-plugin-pwa`, configure manifest with Engleuphoria branding (orange/purple/green hub colors), generate 192/512 icons from existing logo
- Add iOS meta tags to `index.html`, splash screens
- Service worker with offline fallback for last-viewed lesson; **denylist `/~oauth`** so OAuth always hits network
- Create `/install` page with "Add to Home Screen" instructions for iOS Safari + Android Chrome
- Show install prompt banner once per user (dismissible)

## Cross-cutting changes
- Wrap top-level routes in `MobileAwarePage` so mobile/desktop layouts auto-switch via `useIsMobile()`
- Audit Tailwind classes: replace `flex` with `flex-col md:flex-row`, `grid-cols-3` with `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`, hide desktop sidebars on `<md`
- Add safe-area insets (`env(safe-area-inset-bottom)`) to bottom nav for iPhone notch
- Respect `useMobileOptimizations()` to reduce animations on mobile / low battery

## Files Touched (high-level)

**New**:
- `src/components/mobile/MobileBottomNav.tsx` (student + teacher variants)
- `src/components/mobile/MobileTeacherNav.tsx`
- `src/components/classroom/mobile/MobileClassroomLayout.tsx`
- `src/components/teacher/scheduler/MobileScheduleList.tsx`
- `src/pages/InstallPage.tsx`
- `public/manifest.json`, `public/icons/icon-192.png`, `public/icons/icon-512.png`
- `vite.config.ts` (PWA plugin)

**Edited**:
- All hub dashboards (`PlaygroundDashboard`, `AcademyDashboard`, `ProfessionalHub`)
- `LessonReaderPage`, lesson player slide components
- `FindTeacherPage`, teacher profile, booking dialog
- `TeacherDashboard`, `NextLessonCard`, scheduler components
- `ClassroomLayout`, `EnhancedWhiteboard`, video panels, chat panel
- `AdminDashboard`, content creator pages (add desktop-only notice)
- `App.tsx` (PWA registration + `/install` route)
- `index.html` (PWA meta tags, theme-color per hub)

## Outcome
A platform that works beautifully on phones for students (browse → book → learn) and teachers (check schedule → enter class), with a mobile-optimized classroom, plus installable as a PWA so users can tap the icon on their home screen and launch like a native app. Admin/creator tools intentionally stay desktop-first.

## Question Before Building
Should I do **all 5 phases at once** (large change, hits everything), or should I start with **Phase 1 + Phase 5 (Student + PWA)** so you can ship a usable mobile app to students immediately, then layer in teacher/classroom/admin in follow-ups? I'd recommend the phased approach — please confirm or tell me to do it all.
