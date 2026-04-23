

# Plan: Hub Color Standardization & Academy Redirect Hardening

## Problem Summary

1. **45 files use the old Academy color `#1A237E` (navy blue)** instead of the correct `#6B21A8` (royal purple). The `hubDesignTokens.ts` file is correct, but the actual components never reference it -- they have hardcoded hex values.
2. **The `emailRedirectTo` in AuthContext points to `/`** (root), which means after email confirmation the user lands on the homepage instead of being routed through the smart Dashboard router.
3. **No `/auth/callback` route exists** to handle Supabase email confirmation redirects and route users to their correct hub.
4. **Student classroom header still uses navy blue** for Academy gradient instead of purple.

---

## Changes

### 1. Replace `#1A237E` with `#6B21A8` across all 45 files

Every instance of `#1A237E` (navy blue) will be replaced with `#6B21A8` (royal purple) across all component files. Similarly, `#3F51B5` (indigo -- the old Academy secondary) will be replaced with `#A855F7` (lighter purple) where it appears as a gradient endpoint.

**Affected areas include:**
- Lesson player activities (LetterHunt, SentenceTransform, MouthMirror, WordBuilder, OddOneOut, etc.)
- Teacher professional components (CurriculumMapView, StudentEntityDashboard, diagnostics)
- Admin components (ContractManagement)
- Classroom components (WarmUpMystery, StudentClassroomHeader)
- All other files using the old navy palette

### 2. Fix StudentClassroomHeader hub gradient

**File**: `src/components/student/classroom/StudentClassroomHeader.tsx`

Change the Academy fallback gradient from `linear-gradient(135deg, #1A237E, #3F51B5)` to `linear-gradient(135deg, #6B21A8, #A855F7)`.

### 3. Update `emailRedirectTo` to use `/dashboard`

**File**: `src/contexts/AuthContext.tsx`

Change the redirect URL from `window.location.origin + '/'` to `window.location.origin + '/dashboard'` so that after email confirmation, users hit the smart router which reads their `student_level` and sends them to the correct hub.

### 4. Create `/auth/callback` route

**New file**: `src/pages/AuthCallback.tsx`

A lightweight page that:
- Extracts the Supabase auth tokens from the URL hash/params
- Calls `supabase.auth.exchangeCodeForSession()` or handles the token exchange
- Redirects to `/dashboard` which then routes to the correct hub

**Modified file**: `src/App.tsx` -- add the `/auth/callback` route.

### 5. Update `emailRedirectTo` to point to `/auth/callback`

**File**: `src/contexts/AuthContext.tsx`

After creating the callback route, update: `emailRedirectTo: window.location.origin + '/auth/callback'`

**File**: `src/components/security/AdvancedAuth.tsx` -- same update.

---

## Technical Details

### Files Created
- `src/pages/AuthCallback.tsx`

### Files Modified
- ~45 component files (batch `#1A237E` to `#6B21A8` replacement)
- `src/contexts/AuthContext.tsx` (emailRedirectTo)
- `src/components/security/AdvancedAuth.tsx` (emailRedirectTo)
- `src/components/student/classroom/StudentClassroomHeader.tsx` (gradient fix)
- `src/App.tsx` (add `/auth/callback` route)

### No Database Migrations Required
The `student_profiles.student_level` field and hub-based routing logic are already in place.

### Verification Checklist
- Playground pages: `#FE6A2F` orange (already correct)
- Academy pages: `#6B21A8` purple (fixing 45 files)
- Success Hub pages: `#059669` green (already correct)
- Email confirmation redirects to `/auth/callback` then to correct hub dashboard
- Student signup with `?hub=academy` stamps `student_level: 'academy'` (already working)

