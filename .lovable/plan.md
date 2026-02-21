
# Referral System: "Give One, Get One" Viral Loop

## Overview

Build a complete referral system with three parts: (1) database tables for referral tracking, (2) a "Referral Center" tab on the Student Dashboard with sharing tools, and (3) an "Ambassador" section on the landing page.

---

## 1. Database Migration

Add referral infrastructure to the existing schema. Per project guidelines, we do NOT reference `auth.users` directly -- we reference the public `users` table instead.

### New columns on `users` table:
- `referral_code TEXT UNIQUE` -- auto-generated 8-char alphanumeric code
- `referred_by UUID REFERENCES public.users(id)` -- who referred this user

### New `referrals` table:
```text
referrals
---------
id            UUID PK
referrer_id   UUID -> users(id)
friend_id     UUID -> users(id)
status        TEXT DEFAULT 'pending'  ('pending' | 'completed')
reward_given  BOOLEAN DEFAULT false
created_at    TIMESTAMPTZ
completed_at  TIMESTAMPTZ
```

### Database function: `complete_referral(friend_uuid)`
- Called after a student's first package purchase
- Finds the referral record where `friend_id = friend_uuid` and `status = 'pending'`
- Updates status to `'completed'`, sets `completed_at` and `reward_given`
- Adds +1 credit to the referrer's `student_credits.total_credits`
- Adds +1 credit to the friend's `student_credits.total_credits`
- Creates a notification for the referrer

### Trigger: `auto_generate_referral_code`
- BEFORE INSERT on `users` -- generates `referral_code` if NULL using `lower(substring(md5(random()::text), 1, 8))`

### RLS Policies on `referrals`:
- Students can read their own referrals (where `referrer_id = auth.uid()` OR `friend_id = auth.uid()`)
- Insert allowed for authenticated users (system-level inserts happen via `SECURITY DEFINER` functions)
- Admins can read all

### Backfill existing users:
- UPDATE `users` SET `referral_code = lower(substring(md5(random()::text || id::text), 1, 8))` WHERE `referral_code IS NULL`

---

## 2. Referral Center Tab (Student Dashboard)

### New file: `src/components/student/tabs/ReferralTab.tsx`

**Layout:**
- **Hero card** at top: "Give a Lesson, Get a Lesson!" with gift emoji, explanatory text
- **Referral code display** with a "Copy Link" button that copies `{origin}/signup?ref={code}`
- **Share buttons**: WhatsApp (pre-filled message with link) and LinkedIn (share URL)
- **Stats tracker**: "Friends joined: X | Credits earned: Y" -- fetched from `referrals` table where `referrer_id = auth.uid()`

**Data fetching:**
- Query `users` table for the current user's `referral_code`
- Query `referrals` where `referrer_id = auth.uid()` to get counts (total invited, completed)
- Use existing `student_credits` to show total bonus credits earned

### Sidebar update: `src/components/student/StudentSidebar.tsx`
- Add a new menu item: `{ id: 'referrals', label: 'Invite Friends', icon: Gift, badge: 'New' }`
- Place it after "Progress" and before "Profile"

### Dashboard routing: `src/pages/StudentDashboard.tsx`
- Add `referrals: () => <ReferralTab />` to `tabComponents`
- Import `ReferralTab`

---

## 3. Capture Referral Code on Signup

### Modify: `src/components/auth/SimpleAuthForm.tsx`
- On mount, read `ref` query parameter from the URL
- Store it in component state
- After successful signup, if a `ref` code exists:
  - Look up the referrer by `referral_code` in the `users` table
  - Insert a row into `referrals` with `referrer_id` = found user, `friend_id` = new user, `status = 'pending'`
  - Update the new user's `referred_by` column

---

## 4. Auto-Complete Referral on First Purchase

### Modify the existing `add_credits_on_purchase` trigger function
- After adding credits, check if the student has a pending referral
- If so, call `complete_referral(student_id)` to award bonus credits to both parties

Alternatively, create a separate trigger on `credit_purchases` (or wherever purchases are recorded) that calls `complete_referral`.

---

## 5. Landing Page Ambassador Section

### New file: `src/components/landing/AmbassadorSection.tsx`

**Design:**
- Dark background matching the landing page (`bg-slate-950`)
- Glassmorphic card with gradient accent
- Headline: "Join the Engleuphoria Ambassador Program"
- Copy: "Education is better with friends. Share the future of AI learning and earn free sessions for every successful referral."
- CTA button: "Start Sharing" -- links to `/signup` (or `/student-dashboard` if logged in)
- Small visual: three overlapping avatar circles suggesting community

### Update: `src/components/landing/index.ts`
- Export `AmbassadorSection`

### Update: `src/pages/LandingPage.tsx`
- Add `<AmbassadorSection />` between `TrustBarSection` and `ContactSection`

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| Migration | SQL | Add `referral_code`, `referred_by` to `users`; create `referrals` table; `complete_referral()` function; RLS; backfill |
| Create | `src/components/student/tabs/ReferralTab.tsx` | Referral Center with share tools and stats |
| Create | `src/components/landing/AmbassadorSection.tsx` | Landing page ambassador section |
| Modify | `src/components/student/StudentSidebar.tsx` | Add "Invite Friends" menu item |
| Modify | `src/pages/StudentDashboard.tsx` | Add referrals tab routing |
| Modify | `src/components/auth/SimpleAuthForm.tsx` | Capture `?ref=` code on signup and create referral record |
| Modify | `src/components/landing/index.ts` | Export AmbassadorSection |
| Modify | `src/pages/LandingPage.tsx` | Add AmbassadorSection to page |

---

## Technical Notes

- The `complete_referral` function is `SECURITY DEFINER` so it can update credits for both users regardless of who calls it
- Referral codes are 8-character lowercase hex strings derived from `md5(random())` -- collision-resistant for the expected user volume
- The WhatsApp share uses `https://wa.me/?text=...` with URL-encoded message
- The LinkedIn share uses `https://www.linkedin.com/sharing/share-offsite/?url=...`
- No new dependencies required -- uses existing Supabase client, lucide-react icons, and Tailwind styling
