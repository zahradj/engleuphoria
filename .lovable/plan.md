
# Both steps are already shipped

The two prompts in this message were implemented in earlier turns. Verified just now:

## Step 1 — Smart Contextual Dictionary ✅
- `src/components/lesson-player/DictionaryContext.tsx` — selection capture + state
- `src/components/lesson-player/DictionaryPopover.tsx` — floating Radix popover with image, definition, translation, loading skeleton, click-outside dismiss
- `src/components/lesson-player/RichText.tsx` — `onMouseUp` listener captures word + surrounding sentence
- `supabase/functions/fetch-dictionary-definition/index.ts` — cache lookup → Gemini translation → flat-vector icon → write-back
- `public.dictionary_cache` table exists with `(word, context, language, translation, image_url)`

## Step 2 — Partitioned Marketplace (DZ vs INTL) ✅
- `public.market_region` enum + columns on `users`, `teacher_profiles`, `class_bookings`, `classroom_sessions`, `teacher_applications`
- `current_market_region()` helper, market-scoped teacher discovery RLS, booking trigger that rejects cross-market bookings
- `src/lib/marketRegion.ts` — hostname → `'DZ' | 'INTL'`
- `src/contexts/MarketRegionContext.tsx` — provider mounted in `App.tsx`
- `src/components/common/WrongMarketBanner.tsx` — wrong-domain warning
- `src/components/payments/{CheckoutPanel,LocalPaymentPanel,IntlPaymentPanel}.tsx`
- All 6 user insert/upsert sites stamp `market_region` on signup
- `FindTeacher` displays DZD or EUR based on viewer's region

---

## What I'd suggest as next steps (pick any, or skip)

1. **Wire real local payment providers** — CIB / Edahabia / BaridiMob behind `LocalPaymentPanel` (currently a UI shell with placeholder buttons).
2. **Domain setup** — add `engleuphoria.dz` (or `dz.engleuphoria.com`) in Project Settings → Domains so the DZ market actually has its own URL.
3. **Admin "switch market" tool** — let admins flip an existing user's `market_region` from the admin dashboard (today it's only set on signup).
4. **Dictionary popover polish** — add target-language picker per student (today it uses `users.preferred_language`), or a "save to Vocabulary Vault" button right inside the popover.

Tell me which (if any) you want, and I'll do it. Otherwise we're done.
