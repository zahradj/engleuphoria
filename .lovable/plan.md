

## Sync Auth Page Logo with Tri-Color Theme Gradient

### Problem
The logo text "EnglEuphoria" on the auth pages (line 77 of `AuthPageLayout.tsx`) uses a static `text-foreground` color instead of the synchronized tri-color gradient that rotates on the homepage and other pages.

### Change
In `src/components/auth/AuthPageLayout.tsx`, update the logo `<span>` on line 77 to use a dynamic gradient matching the active demographic theme — identical to how the title on line 209-211 already works.

**Before:**
```tsx
<span className="text-xl font-bold text-foreground">EnglEuphoria</span>
```

**After:**
```tsx
<motion.span
  className="text-xl font-bold bg-clip-text text-transparent"
  animate={{
    backgroundImage: `linear-gradient(to right, ${theme.cssFrom}, ${theme.cssTo})`,
  }}
  transition={{ duration: 0.8 }}
  style={{
    backgroundImage: `linear-gradient(to right, ${theme.cssFrom}, ${theme.cssTo})`,
    WebkitBackgroundClip: 'text',
  }}
>
  EnglEuphoria
</motion.span>
```

### Files Changed

| File | Action |
|---|---|
| `src/components/auth/AuthPageLayout.tsx` | Replace static logo text color with animated theme-synced gradient |

