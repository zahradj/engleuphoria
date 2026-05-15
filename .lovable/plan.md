# Internal AI Debugging Pipeline

Build a 4-part automated error capture + AI analysis system. **Placement Test components will not be touched.**

## 1. Database — `system_errors` table

Migration creates:

```text
system_errors
- id            uuid pk default gen_random_uuid()
- created_at    timestamptz default now()
- error_message text not null
- stack_trace   text
- component_name text
- route         text                 (helpful context, cheap to add)
- user_id       uuid                 (nullable, for triage)
- ai_analysis   text
- ai_model      text                 (which Gemini model produced it)
- analyzed_at   timestamptz
- status        text default 'open'  check in ('open','analyzing','analyzed','resolved')
```

RLS:
- Enable RLS.
- INSERT: allow `anon` + `authenticated` (error boundary must log even when logged out). No SELECT for them.
- SELECT / UPDATE: only `has_role(auth.uid(),'admin')` (uses existing `user_roles` + `has_role` per project security rules).
- Index on `(status, created_at desc)` for the analyzer + console.

## 2. `GlobalErrorBoundary.tsx`

- Class component (React error boundaries must be class-based).
- Wraps `<App />` routing in `src/main.tsx` (outside `BrowserRouter` so route-level crashes are caught).
- `componentDidCatch(error, info)` → fire-and-forget `supabase.from('system_errors').insert({...})` with `error.message`, `error.stack`, `info.componentStack`, `window.location.pathname`, current `auth.uid()` if available.
- Fallback UI: glassmorphic card, "Oops, we hit a snag!" + Reload button. Uses semantic tokens, not raw colors.
- Never throws if insert fails (swallow + console.warn).

## 3. Edge Function — `analyze-system-bug`

Path: `supabase/functions/analyze-system-bug/index.ts`, `verify_jwt = false` (called by pg_cron / admin).

Flow:
1. Service-role Supabase client.
2. `select * from system_errors where status='open' order by created_at limit 10`.
3. For each: mark `status='analyzing'`, call Gemini, then update `ai_analysis`, `ai_model`, `analyzed_at`, `status='analyzed'`.
4. CORS headers on every response (incl. errors).

Per project memory **Runtime AI Gemini-Only**: Lovable AI Gateway is forbidden at runtime. Call Gemini directly via `GEMINI_API_KEY` (already used elsewhere in this project, e.g. `ai-image-generation`). Model: `gemini-2.5-flash` for cost; system prompt exactly as specified ("Senior React/Supabase Developer…").

Trigger: invoked manually from Dev Console "Analyze now" button. (We can add pg_cron later if you want it fully autonomous — say the word.)

## 4. `/dev-console` route

- New page `src/pages/DevConsole.tsx`.
- Wrapped in existing `ImprovedProtectedRoute` requiring `role='admin'` (uses `user_roles` table, never client-side flags — per security rules).
- UI: list of `system_errors` rows, newest first, filter by status. Each row expandable to show `stack_trace` + rendered `ai_analysis` (markdown with code block). Buttons: "Analyze now" (invokes edge function), "Mark resolved" (updates row).
- Realtime subscription on `system_errors` so new crashes appear live.
- Route registered in `src/App.tsx` alongside other admin routes.

## Out of scope (explicit)
- No changes to any file under `src/components/placement/**`, `AIPlacementTest.tsx`, `PlaygroundTest.tsx`, `AcademyTest.tsx`, `SuccessTest.tsx`, `TestPhase.tsx`, `questionBanks.ts`, `VocabularyImage.tsx`, or `generate-placement-test` edge function.

## Technical notes
- Secrets needed: `GEMINI_API_KEY` (confirm it exists; if not, I'll request it before deploying the function).
- Types file (`src/integrations/supabase/types.ts`) regenerates automatically after migration approval.
- Follows project rules: glassmorphism UI, semantic tokens, role checks via `has_role()`, no service-role key in frontend.