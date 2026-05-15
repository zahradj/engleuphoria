
# Partitioned Marketplace: DZ vs INTL

Run two markets from one codebase. Students and teachers tagged `DZ` only see and book each other; `INTL` users only see `INTL`. Pricing and payment UI follow the user's market.

Good news from exploration:
- `teacher_profiles` already has `hourly_rate_dzd` and `hourly_rate_eur`.
- `class_bookings` already has a `currency` column.
- No `market_region` column exists yet on any table — we add it.

---

## 1. Database: add `market_region`

New enum and columns (all default `'INTL'`, NOT NULL once backfilled):

- `public.market_region` enum: `'DZ' | 'INTL'`
- Add `market_region market_region` to:
  - `public.users`
  - `public.teacher_profiles`
  - `public.class_bookings`
  - `public.classroom_sessions`
  - (and `public.teacher_applications` so applicants are tagged at intake)
- Backfill: existing rows → `'INTL'`.
- Add a trigger on `class_bookings` so a booking inherits the student's `market_region` and rejects bookings where the teacher's `market_region` differs.

### RLS — the invisible wall

Add a SECURITY DEFINER helper `public.current_market_region()` returning the caller's `users.market_region`.

Update SELECT policies on:
- `teacher_profiles` (public/discovery policy) → require `market_region = current_market_region()`.
- `class_bookings` → already owner-scoped; add `market_region = current_market_region()` to be defensive.
- `users` (public discovery surface, if any) → same rule.

Admins keep full access via the existing `is_user_admin()` check.

---

## 2. Domain-driven market context

New `src/lib/marketRegion.ts`:

```ts
export type MarketRegion = 'DZ' | 'INTL';
export function detectMarketRegion(): MarketRegion {
  const host = window.location.hostname.toLowerCase();
  if (host.endsWith('.dz') || host.startsWith('dz.') || host === 'dz.engleuphoria.com') return 'DZ';
  return 'INTL';
}
```

New `MarketRegionContext` mounted in `App.tsx` above `AuthContext`. Exposes `{ region, currency, locale }`.

`AuthContext` signup paths (`StudentSignUp`, `TeacherSignUp`, `StudentApplication`, `TeacherApplication`) write `market_region: detectMarketRegion()` into the new user/teacher_profile/teacher_application row. Existing signed-in users keep whatever is stored on their `users.market_region` — the DB is the source of truth, the domain is only used at registration and as a sanity check.

If a signed-in user lands on the "wrong" domain (e.g. DZ user on `.com`), show a one-time banner with a link to the correct domain.

---

## 3. Partitioned data fetching

Update queries to filter by region. Even though RLS enforces it, explicit filters keep the UI honest:

- `src/pages/student/FindTeacher.tsx` — `.eq('market_region', region)` on the teacher_profiles query.
- `src/hooks/useTeacherMatchmaker.ts` — same filter.
- `src/services/teacherProfileService.ts` — pass region through.
- `src/services/bookingValidationService.ts` — reject mismatched bookings client-side with a clear error.
- `src/pages/student/BookLesson.tsx` — only show slots for same-region teachers; pass `market_region` into the insert.

Admin views are unchanged (admins see both markets) and gain a "Market" column + filter on the teacher and booking tables.

---

## 4. Localized pricing & checkout

New `src/lib/pricing.ts`:

```ts
const RATES = {
  DZ:   { currency: 'DZD', symbol: 'DA',  field: 'hourly_rate_dzd' },
  INTL: { currency: 'EUR', symbol: '€',   field: 'hourly_rate_eur' },
} as const;
```

- Pricing components read `region` from context and pick `hourly_rate_dzd` or `hourly_rate_eur` plus formatter.
- BookLesson stores `currency` and the matching `price_paid` on the booking.
- Checkout UI conditionally renders:
  - `DZ` → local payment panel (CIB / Edahabia / bank transfer placeholder component `LocalPaymentPanel.tsx` — copy from existing payment UI shell, swap providers).
  - `INTL` → existing Stripe/PayPal panel.
- Hide payment options that don't belong to the active region — never show both.

---

## Technical details

Files created
- `supabase/migrations/<ts>_market_region_partitioning.sql`
- `src/lib/marketRegion.ts`
- `src/lib/pricing.ts`
- `src/contexts/MarketRegionContext.tsx`
- `src/components/payments/LocalPaymentPanel.tsx`
- `src/components/payments/IntlPaymentPanel.tsx`
- `src/components/common/WrongMarketBanner.tsx`

Files edited
- `src/App.tsx` (mount provider)
- `src/contexts/AuthContext.tsx` (write region on signup; expose region)
- `src/pages/StudentSignUp.tsx`, `src/pages/TeacherSignUp.tsx`, `src/pages/StudentApplication.tsx`, `src/pages/TeacherApplication.tsx`
- `src/pages/student/FindTeacher.tsx`, `src/pages/student/BookLesson.tsx`
- `src/hooks/useTeacherMatchmaker.ts`, `src/hooks/useTeacherStatus.ts`, `src/hooks/useTeacherHub.ts`
- `src/services/teacherProfileService.ts`, `src/services/bookingValidationService.ts`
- Admin tables: `TeacherManagement.tsx`, `TeacherApplicationReview.tsx`, `AdminOverview.tsx`

Migration outline
```sql
CREATE TYPE public.market_region AS ENUM ('DZ','INTL');
ALTER TABLE public.users              ADD COLUMN market_region public.market_region NOT NULL DEFAULT 'INTL';
ALTER TABLE public.teacher_profiles   ADD COLUMN market_region public.market_region NOT NULL DEFAULT 'INTL';
ALTER TABLE public.class_bookings     ADD COLUMN market_region public.market_region NOT NULL DEFAULT 'INTL';
ALTER TABLE public.classroom_sessions ADD COLUMN market_region public.market_region NOT NULL DEFAULT 'INTL';
ALTER TABLE public.teacher_applications ADD COLUMN market_region public.market_region NOT NULL DEFAULT 'INTL';

CREATE FUNCTION public.current_market_region() RETURNS public.market_region
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT market_region FROM public.users WHERE id = auth.uid()
$$;

-- update teacher_profiles discovery SELECT policy to require
--   market_region = public.current_market_region() OR public.is_user_admin()

CREATE FUNCTION public.enforce_booking_market() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE s_region public.market_region; t_region public.market_region;
BEGIN
  SELECT market_region INTO s_region FROM public.users WHERE id = NEW.student_id;
  SELECT market_region INTO t_region FROM public.users WHERE id = NEW.teacher_id;
  IF s_region <> t_region THEN RAISE EXCEPTION 'Cross-market bookings are not allowed'; END IF;
  NEW.market_region := s_region;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_class_bookings_market BEFORE INSERT OR UPDATE
  ON public.class_bookings FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_market();
```

## Domain setup (out-of-code, user action)

Add a custom domain like `engleuphoria.dz` (or `dz.engleuphoria.com`) in Project Settings → Domains, pointing at the same project. Both domains serve the same app; the partition is purely runtime.

## Out of scope for this plan
- Building real local-payment provider integrations (CIB, Edahabia gateways). Plan ships a UI shell + placeholder; we can wire a provider as a follow-up.
- Migrating existing users between markets (admin can flip `users.market_region` manually).
