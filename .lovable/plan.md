
# Add Circling Purple Light to Auth Page Corners

## What Changes

Add animated light purple orbs that slowly orbit/circle in the corners of the login and signup pages, creating an elegant ambient glow effect.

## Visual Result

Two soft purple glowing orbs positioned in the top-right and bottom-left corners of the page. Each orb will continuously rotate in a circular path using `framer-motion`, giving a calm, bioluminescent feel that matches the project's visual identity.

## Technical Details

**File:** `src/components/auth/AuthPageLayout.tsx`

- Replace the current static background orbs (lines 52-55) with `motion.div` elements that use `framer-motion`'s `animate` prop to orbit in a circular path via CSS `rotate` + `translateX` keyframes
- Each orb will be a soft purple gradient (`purple-400/20` to `violet-300/15`) with heavy `blur-3xl` for a diffused glow
- Top-right orb: orbits clockwise over ~12 seconds
- Bottom-left orb: orbits counter-clockwise over ~16 seconds (offset timing for organic feel)
- Uses `repeat: Infinity` for continuous looping
- No new dependencies or files needed
