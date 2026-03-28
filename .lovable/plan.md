

## Sync About Hero with NavHeader + Revamp Hero Visuals

### Problem
The MissionHeader component on the About page uses its own local `activeGroup` state for the rotating mascot icons. This state is **not connected** to the global `HeroThemeContext`, so the NavHeader logo and "Get Started Free" button colors never change when the About hero rotates. Additionally, the hero section currently shows generic icon circles instead of the actual character images used on the homepage.

### Plan

#### 1. Connect MissionHeader to Global Theme Context
- Import `useHeroTheme` in `MissionHeader.tsx`
- Replace the local `activeGroup` / `setActiveGroup` state with `activeIndex` / `setActiveIndex` from the context
- The auto-rotation interval will call `setActiveIndex` instead, which updates the global context
- This instantly syncs the NavHeader logo gradient and CTA button colors

#### 2. Replace Icon Circles with Hero Character Images
- Import `hero-kid.png`, `hero-teen.png`, `hero-adult.png` into MissionHeader
- Replace the orbiting icon circles with a **carousel/crossfade** of the actual character images (same assets used on homepage and PhilosophyPanels)
- The active character image fades in with a themed color glow behind it
- Non-active groups shown as small thumbnail dots or mini-avatars below
- Each image gets a radial glow matching the group's color (orange/indigo/emerald)

#### 3. Visual Polish
- Add a subtle floating animation to the active character image
- Keep the dots navigation at the bottom, connected to the global context
- Maintain the existing left-column content (headline, stats, description) unchanged

### Files Changed

| File | Action |
|---|---|
| `src/components/about/MissionHeader.tsx` | Replace local state with `useHeroTheme`, swap icon circles for hero character image carousel with color glows |

