

## Redesign Sign Up & Sign In Pages — Full Theme Alignment

### Problem
The auth pages use a standalone `AuthPageLayout` with static indigo/purple gradients, generic orbiting blobs, and no connection to the global `HeroThemeContext`. They feel disconnected from the homepage, About, and Teach With Us pages which all share the tri-color demographic theme, `NavHeader`, and the dual light/dark mode system.

### Plan

#### 1. Rebuild `AuthPageLayout.tsx` — Full-Page Immersive Design
- Remove the current small centered card layout
- Use a **split-screen layout**: left panel = branding/visual, right panel = form
- **Left panel**: Shows rotating hero character images (`hero-kid.png`, `hero-teen.png`, `hero-adult.png`) with crossfade animation, themed radial glows (orange/indigo/emerald), and a tagline that changes per demographic
- **Right panel**: The auth form card with glassmorphism
- Wrap in `HeroThemeProvider` so the rotating characters drive the global theme
- Replace the simple header with the full `NavHeader` component (consistent navigation across all pages)
- Auto-rotate through the 3 demographics every 4 seconds using `setActiveIndex` from `useHeroTheme`
- On mobile: stack vertically — hero visual on top (compact), form below
- Theme-aware backgrounds: `bg-white dark:bg-[#09090B]` with `transition-colors duration-300`

#### 2. Update `SimpleAuthForm.tsx` — Theme-Synced Styling
- Replace the static `from-indigo-500 to-purple-600` submit button gradient with dynamic colors from `useHeroTheme().theme`
- Use `style={{ backgroundImage: linear-gradient(to right, ${theme.cssFrom}, ${theme.cssTo}) }}` on the submit button so it rotates with the hero
- Update the Google button border and hover states to be theme-aware
- Update the password strength bar to use the active theme color instead of static `bg-primary`
- Role selector chips: replace the `<select>` dropdown with styled pill buttons (Student / Teacher) with theme-colored active state
- System tag badge (KIDS/TEENS/ADULTS): use the tri-color scheme (orange/indigo/emerald) matching the brand palette
- Subtle top-border glow on the card: sync with current theme color

#### 3. Visual Polish
- Ambient background: dual radial glows behind the hero images that transition colors with the active demographic
- Form card: `bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl` with `rounded-2xl` (32px super-ellipse per brand guidelines)
- Floating decorative elements: small colored dots/circles that match the active theme, orbiting subtly
- Footer text and links: use `text-muted-foreground` with theme-colored hover states

### Files Changed

| File | Action |
|---|---|
| `src/components/auth/AuthPageLayout.tsx` | Complete rebuild — split-screen layout, hero image carousel, `HeroThemeProvider` + `NavHeader` integration |
| `src/components/auth/SimpleAuthForm.tsx` | Dynamic theme-synced button gradients, role pill selector, theme-aware password meter |
| `src/pages/SignUp.tsx` | Wrap with `HeroThemeProvider` |
| `src/pages/Login.tsx` | Wrap with `HeroThemeProvider` |

