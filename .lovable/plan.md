

## Plan: Professional Hub Separation — Academy, Playground, Map of Sounds, and Lesson Layout Upgrade

This plan refactors the three student hubs into distinct, polished interfaces while preserving the shared systematic curriculum DNA. Each hub gets its own design language, and shared components (Map of Sounds, Lesson Player) adapt per-hub context.

---

### Step 1 — Academy Hub: "Core School" Apple-Style Redesign

**Modify**: `src/components/student/dashboards/AcademyDashboard.tsx`

Full visual overhaul to a clean, professional EdTech aesthetic:

- **Typography**: Switch from current neon/cyberpunk style to Inter font family with generous whitespace
- **Color system**: `#1A237E` (Deep Navy) for headers, `#4CAF50` (Forest Green) for success states, white/slate backgrounds — replace all purple/cyan neon gradients
- **Layout**: Remove dark-mode-first design. Use a light, minimal sidebar with navy icons. Clean card borders with subtle shadows instead of glow effects
- **Unit Roadmap integration**: Add a minimalist "Unit Path" section with lock/unlock icons using the existing `UnitRoadmap` data
- **Leaderboard**: Restyle with navy/white palette, remove neon glow effects
- **Schedule**: Clean table-style layout with green accent for upcoming sessions
- **Overall**: Zero visual noise — no gradients, no glow, no neon. Professional flat cards with 8px radius

---

### Step 2 — Playground Hub: "Flat 2.0" with Time-Sync Polish

**Modify**: `src/components/student/dashboards/PlaygroundDashboard.tsx`

Enhance the existing Playground with the "Flat 2.0" design language:

- **Corners**: Increase border-radius to 24px on all interactive cards
- **Time-Sync integration**: Import `useTimeOfDay` and apply:
  - **Day Mode** (6AM–6PM): Sky blues (`#87CEEB`), bright energy colors, vibrant icons
  - **Night Mode** (6PM–6AM): Deep purples (`#2D1B69`), glowing icons with subtle amber glow
- **Interactive Stage**: Add a prominent "Sound Lab" button in the right panel that links to `MapOfSounds`
- **Star Meter**: Add a bottom progress bar with smooth `transition-all duration-700` animation that fills as tasks complete
- **Feedback**: Snappy scale animations on task completion (using Framer Motion `whileTap={{ scale: 0.95 }}`)
- **Overall**: Keep playful but elevate to sophisticated — remove Fredoka font dependency from main layout, use rounded modern sans-serif

---

### Step 3 — Academy Lesson Layout: 2-Column "Learning Stage"

**New file**: `src/components/student/academy/AcademyLessonLayout.tsx`

A dedicated lesson view component for Academy students:

- **Left column (75%)**: "Learning Stage" — centered hero area for vocabulary images, sentence building, and interactive content. Uses the existing `DynamicSlideRenderer`
- **Right column (25%)**: "Teacher Sidebar" — displays:
  - Current lesson objectives (from curriculum data)
  - The II Wizard's script/prompts panel
  - A "Student Success" toggle (marks engagement level)
- **Color**: Navy headers, green success indicators, white content area
- **Responsive**: Collapses to single column on mobile

---

### Step 4 — Map of Sounds: Professional Tile Grid

**Modify**: `src/components/student/curriculum/MapOfSounds.tsx`

Upgrade to match the "Professional Flat 2.0" style:

- **Tiles**: Replace current cards with minimalist square tiles (equal size grid)
- **States**: Unseen = light gray, In-progress = outlined, Mastered = gold fill with subtle shadow
- **Night mode**: Mastered tiles get a soft amber `box-shadow` glow (already partially implemented — refine the effect)
- **Hub adaptation**: Accept an optional `hub` prop. Academy uses navy/green palette. Playground uses amber/purple palette
- **Placement**: Ensure the component is prominently placed in both Academy and Playground dashboards

---

### Step 5 — Design Tokens: Hub Color Constants

**New file**: `src/constants/hubDesignTokens.ts`

Centralized design tokens for each hub:

```text
academy:  { primary: '#1A237E', success: '#4CAF50', bg: '#FAFBFC', text: '#1E293B', radius: '8px' }
playground: { primary: '#FF9F1C', success: '#4CAF50', bg: { day: '#E3F2FD', night: '#1A1040' }, text: '#1A1A2E', radius: '24px' }
professional: { primary: '#059669', success: '#059669', bg: '#F8FAFC', text: '#1E293B', radius: '8px' }
```

Import these tokens in all hub-specific components to ensure palette consistency.

---

### Step 6 — Tailwind Config: Inter Font + Academy Utilities

**Modify**: `tailwind.config.ts`

- Add `'inter': ['Inter', 'system-ui', 'sans-serif']` to `fontFamily`
- Add academy-specific color aliases: `academy-navy: '#1A237E'`, `academy-green: '#4CAF50'`

---

### Summary

| Area | Action |
|------|--------|
| AcademyDashboard | Full redesign: Apple-style, navy/green, Inter font, zero noise |
| PlaygroundDashboard | Flat 2.0 polish: 24px radius, time-sync day/night, Star Meter |
| AcademyLessonLayout | New 2-column lesson view (75% stage + 25% teacher sidebar) |
| MapOfSounds | Professional tile grid, hub-aware palette, refined night glow |
| Design tokens | New `hubDesignTokens.ts` for centralized palette management |
| Tailwind | Add Inter font, academy color aliases |

### Files to Create
- `src/components/student/academy/AcademyLessonLayout.tsx`
- `src/constants/hubDesignTokens.ts`

### Files to Modify
- `src/components/student/dashboards/AcademyDashboard.tsx`
- `src/components/student/dashboards/PlaygroundDashboard.tsx`
- `src/components/student/curriculum/MapOfSounds.tsx`
- `tailwind.config.ts`

