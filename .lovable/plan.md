
# Plan — Add Engleuphoria Logo Section to Download/Install Page

## Context
The user wants the InstallPage (`/install`) to feature a prominent Engleuphoria logo section that visually reinforces the brand and encourages app installation.

## What's Done
- InstallPage already exists at `/install` with platform-specific instructions for iOS, Android, and one-tap PWA install
- Logo component exists (`src/components/Logo.tsx`) with theme-aware black/white variants
- AnimatedLogo component exists (`src/components/ui/AnimatedLogo.tsx`) with bouncing, shadow, and pulse effects

## What to Build
Add a new **branded hero section** to the InstallPage that includes:

1. **Animated Logo Display** — Use `AnimatedLogo` (size="lg") for visual impact with the existing bounce/scale effect
2. **Logo Branding Header** — Position alongside or above the existing phone icon section to replace the generic icon with branded imagery
3. **Consistent Theme** — Use the existing gradient backdrop styling (`from-orange-500/20 via-purple-500/20 to-emerald-500/20`) that matches hub brand colors

## Implementation
- Edit: `src/pages/InstallPage.tsx`
  - Import `Logo` and/or `AnimatedLogo` components
  - Replace or supplement the generic `<Smartphone>` icon section with branded logo section
  - Add logo above the "Install Engleuphoria" heading
  - Keep platform instructions unchanged

## Files Touched
- `src/pages/InstallPage.tsx` (add imports and logo section)

## Outcome
The `/install` page will display the Engleuphoria logo prominently as part of the hero section, reinforcing brand identity while providing clear PWA installation instructions.
