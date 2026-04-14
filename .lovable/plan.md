

# Glassmorphism Dashboard Overhaul — Match Homepage Vibe

## Summary
Transform all three Hub dashboards (Playground, Academy, Success Hub) from plain/flat cards to a premium glassmorphic design with bold hub-specific color coding, matching the homepage's frosted-glass aesthetic. Add a welcoming Hero section with a glowing "Join Classroom" button and hub-aware sidebar icon colors.

## What Changes

### 1. Add Hub-Specific Glass Utility Classes to `src/index.css`
Add new CSS classes for hub-colored glassmorphism:
- `.glass-playground` — frosted glass with orange/yellow tinted border and shadow
- `.glass-academy` — frosted glass with indigo/purple tinted border and shadow
- `.glass-professional` — frosted glass with emerald/teal tinted border and shadow
- Each class uses `backdrop-blur-md`, `bg-white/70` (light) or `bg-white/5` (dark), and the hub's primary color at 20% opacity for borders
- Add `.glass-card-hub` base class with large soft shadows for the "floating" effect
- Add a `.glow-pulse` keyframe animation for the Join Classroom button

### 2. Redesign `PlaygroundDashboard.tsx` — Glassmorphic Fun Theme
- Replace all plain card backgrounds (`bg-white/80`, `bg-white/60`, solid gradients) with `glass-playground` frosted glass cards
- Add a **Hero Welcome Section** at the top: large "Welcome to the Playground, {name}!" heading inside a gradient-to-transparent glass panel with the EnglEuphoria logo
- The "Join Classroom" button gets a glowing orange-to-yellow gradient with `animate-pulse` subtle effect
- Quick action cards, progress card, and pet widget all become floating glass cards with orange-tinted borders
- Top bar becomes fully glassmorphic with hub-colored border accent
- Dark mode: deeper amber-tinted glass (`bg-amber-900/20` + `backdrop-blur`)

### 3. Redesign `AcademyDashboard.tsx` — Glassmorphic Academic Theme
- Replace all `Card` components with glass-styled wrappers using indigo/purple 20% border tint
- Hero section: "Welcome back, {name}" with gradient text + glowing indigo-to-purple "Join Classroom" button
- Schedule, Continue Learning, Leaderboard cards all get frosted glass treatment
- Streak card wrapped in glass panel
- Dark mode: midnight indigo-tinted glass

### 4. Redesign `HubDashboard.tsx` — Glassmorphic Professional Theme
- All cards become glass cards with emerald/teal border accents
- Hero section: "Good morning, {name}" with executive glass panel + glowing green-to-teal "Join Classroom" button
- Stats grid, resources, skills radar all wrapped in glass
- Dark mode: forest green-tinted glass

### 5. Update `StudentSidebar.tsx` — Hub-Colored Icons
- Read the current `studentLevel` (via hook or prop) to determine active hub
- Apply hub-specific icon colors: orange icons for Playground, indigo for Academy, green for Success Hub
- Active menu item highlight uses the hub's primary color instead of generic purple
- Logo area at the top of sidebar shows `HubLogo` component

### 6. Update `JoinLessonHero.tsx` — Glowing CTA Button
- Add the `glow-pulse` animation to the "Join Classroom" button using hub-specific glow color
- When no lesson is upcoming, the empty state still shows a prominent glass-styled "Book Your First Lesson" CTA with subtle glow
- Increase button size and add `shadow-[0_0_30px_...]` with hub color for the "first thing the eye hits" effect

### 7. Font Consistency
- Ensure all dashboard text uses `font-sans` (Inter) which is already the project default
- Headings use `font-bold` or `font-semibold` consistently

## Technical Details

**Files to modify:**
- `src/index.css` — add glass-playground/academy/professional classes + glow-pulse keyframe
- `src/components/student/dashboards/PlaygroundDashboard.tsx` — glassmorphic card wrappers, hero section
- `src/components/student/dashboards/AcademyDashboard.tsx` — glassmorphic cards, hero section
- `src/components/student/dashboards/HubDashboard.tsx` — glassmorphic cards, hero section
- `src/components/student/StudentSidebar.tsx` — hub-aware icon coloring
- `src/components/student/JoinLessonHero.tsx` — glowing button animation

**No new dependencies.** Uses existing `framer-motion`, tailwind utilities, and the glass/glow classes already partially defined in `index.css`.

**No database changes.**

**Color constants** (from the user's spec, matching `hubTheme.ts`):
- Playground: `#FE6A2F` (Orange), `#FEAF15` (Golden Yellow)
- Academy: `#174EA6` (Deep Blue), `#B75EED` (Purple)
- Success Hub: `#0D652D` (Emerald), `#3DD39B` (Teal)

