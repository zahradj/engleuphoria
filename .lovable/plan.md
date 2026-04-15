

# Classroom Button Always Active + Teacher Dashboard Purple Circle Logo

## What's Changing

**1. Remove time restriction on "Join Classroom" button** — both teacher and student sides should allow joining at any time, not just 15 minutes before.

**2. Replace text Logo in teacher nav with purple circle logo** — swap the `<Logo>` text component in `ProfessionalNav.tsx` with the circular image logo (`HubLogo`-style) themed in purple to match the teacher dashboard aesthetic.

---

## Technical Details

### Files to Modify

**`src/components/teacher/professional/CommandCenter.tsx`** (~line 243)
- Remove the `canJoin` time gate: change `const canJoin = minutesUntil <= 15 && minutesUntil > -lesson.duration` to always be `true`
- Button is always enabled and styled with hub color
- Keep the countdown text as informational only

**`src/components/student/JoinLessonHero.tsx`** (~line 93-97)
- Remove `showHero` gate that hides the hero when `minutesUntil > 15`
- Always show the Join button when a lesson exists

**`src/components/student/ClassroomQuickJoin.tsx`**
- Remove any time-based visibility restrictions

**`src/components/teacher/professional/ProfessionalNav.tsx`** (line 61)
- Replace `<Logo size="small" />` with the circular logo image (using `logo-white.png` on a purple gradient circle, similar to `HubLogo` but with purple colors like `#7C3AED` → `#9333EA`)
- Add "EnglEuphoria" text beside it with a purple gradient, matching the dashboard theme

No database changes needed.

