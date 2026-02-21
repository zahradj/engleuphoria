

# Remove Split Layout from Auth Pages

## What Changes

Remove the two-panel (branding + form) layout and return to a single centered layout. The left branding panel with floating icons, social proof stats, and gradient background will be removed entirely.

## Result

A clean, single-panel centered design where the glassmorphic form card sits in the middle of the screen with subtle background orbs. The header (back link, logo, theme toggle) and all form functionality (Google login, animations, password strength) remain unchanged.

## Technical Details

**File:** `src/components/auth/AuthPageLayout.tsx`

Changes:
- Remove the `grid-cols-1 lg:grid-cols-2` grid wrapper
- Delete the entire left branding panel (lines 59-119): gradient background, floating icons, mesh overlay, social proof stats
- Remove unused imports: `Globe`, `Sparkles`, `Users`, `BookOpen`, and the `floatingItems` array
- Remove the `logoDark` import (no longer needed for the left panel; mobile header already has its own logo)
- Make the right panel the full-width root: `min-h-screen` centered layout with the existing gradient background and orbs
- The mobile logo in the header becomes the primary logo on all screen sizes (remove `lg:hidden` class)
- Keep all existing form card styling (glassmorphism, animations, glow border)
