

# Fix Playground Dashboard Visibility and Logo Integration

## Problem Analysis

The Playground Dashboard changes are not visible because of a **layout nesting conflict**: `PlaygroundDashboard` renders its own full-page layout (with `min-h-screen`, its own sidebar, floating decorations, and gradient backgrounds), but it is embedded inside `StudentDashboard.tsx` which wraps it in another layout with its own sidebar (`StudentSidebar`), header (`MinimalStudentHeader`), padding, and a pink/purple gradient background. The parent layout's background and padding override the Playground's visual identity.

Additionally, the `HubLogo` component currently shows hub labels like "Playground" / "Academy" / "Success Hub" — not the actual "EnglEuphoria" brand logo style from the homepage.

## Plan

### 1. Redesign HubLogo to Match Homepage Style
Update `src/components/student/HubLogo.tsx` to replicate the homepage NavHeader logo pattern:
- Logo icon with a gradient background (hub-specific colors instead of the homepage carousel)
- Gradient text reading "EnglEuphoria" (not "Playground"/"Academy"/"Success Hub")
- Hub sub-label displayed as a small badge or subtitle below
- White logo on light mode, black logo on dark mode (matching current logic)
- Hub-specific gradient pairs: Playground = orange-to-yellow, Academy = indigo-to-purple, Professional = emerald-to-teal

### 2. Fix PlaygroundDashboard Layout Integration
Update `PlaygroundDashboard.tsx` to work correctly within the parent `StudentDashboard` shell:
- Remove `min-h-screen` (parent already handles full height)
- Remove the conflicting `PlaygroundSidebar` (parent `StudentSidebar` already handles navigation)
- Keep the hub-specific gradient backgrounds, floating decorations, and all content widgets
- Use `min-h-full` or let it flow naturally within the parent container

### 3. Update StudentDashboard Shell for Hub Theming
Update `StudentDashboard.tsx` so the outer wrapper adapts its background to the active hub:
- Playground: warm amber/orange gradient
- Academy: cool blue/purple gradient (existing)
- Professional: green/teal gradient
- Replace the hardcoded `from-pink-50 via-purple-50 to-blue-50` with hub-aware backgrounds

### 4. Apply Same Fixes to Academy and Hub Dashboards
Ensure `AcademyDashboard.tsx` and `HubDashboard.tsx` also use the updated `HubLogo` component consistently and don't conflict with the parent shell layout.

### Technical Details
- **Files to modify**: `HubLogo.tsx`, `PlaygroundDashboard.tsx`, `AcademyDashboard.tsx`, `HubDashboard.tsx`, `StudentDashboard.tsx`
- **No new dependencies** — uses existing `framer-motion`, `useThemeMode`, and logo assets
- **No database changes**

