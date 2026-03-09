
## Plan: Structural Quality Improvements — 8 Objectives

### Codebase findings

**Current state:**
- `tsconfig.app.json`: `strict: false`, `strictNullChecks` absent (inherits false from `tsconfig.json`)
- Vitest installed (`vitest.config.ts` present); only one existing unit test file: `src/test/hooks/useProgressTracking.test.tsx`
- No `test`, `test:watch`, `test:coverage` scripts in `package.json`
- No `hygiene:check` script
- No `.github/workflows/` directory at all
- No `src/utils/logger.ts` — raw `console.log` scattered across 121 files in `src/`; highest-impact are `src/services/video/` (~9 files) and `src/hooks/useLocalMedia.ts`
- `src/services/enhancedVideoService.ts` is already flagged as a "legacy export file for backward compatibility" re-exporting from `src/services/video/`
- `src/services/audioService.ts` and `src/services/audioPlaceholderService.ts` are placeholders/stubs
- No `docs/ARCHITECTURE_BOUNDARIES.md`, `docs/TS_MIGRATION.md`, or `docs/DEPENDENCY_MAINTENANCE.md`
- Security: roles come from `user_roles` table via `fetchUserRoleFromDatabase()` in `AuthContext`. `clearInsecureRoleStorage()` runs at startup. `localStorage.getItem("role")` does NOT appear anywhere in `src/`. Two legacy pages (`TeacherSignUp.tsx`, `StudentSignUp.tsx`) do `localStorage.setItem('userType', ...)` but only as demo-mode fallback; `clearInsecureRoleStorage()` already deletes that key at startup.
- `src/hooks/useRoleBasedSecurity.ts` uses `user.role` from AuthContext (which was fetched server-side) — it reads the cached role, not localStorage
- `ImprovedProtectedRoute` reads `(user as any).role` — same cached server-validated role
- The stale files (`pages/AdminDashboard.tsx`, `src/App.tsx.security-update`) were deleted in the prior session

---

### Files to create/modify

| # | File | Action |
|---|------|--------|
| 1 | `.github/workflows/ci.yml` | Create: lint + tsc + vitest + hygiene gate |
| 2 | `package.json` | Add scripts: `test`, `test:watch`, `test:coverage`, `hygiene:check` |
| 3 | `tsconfig.strict.json` | Create: extends app tsconfig, adds `strictNullChecks: true`; includes only `src/services/video`, `src/utils` |
| 4 | `docs/TS_MIGRATION.md` | Create: phase plan, what's enabled, what remains, checklist |
| 5 | `src/utils/logger.ts` | Create: `logger.debug/info/warn/error` — debug/info dev-only, warn/error always |
| 6 | `src/services/video/enhancedVideoService.ts` | Replace `console.*` with `logger.*` |
| 7 | `src/services/video/jitsiApiLoader.ts` | Replace `console.*` with `logger.*` |
| 8 | `src/services/video/advancedVideoFeatures.ts` | Replace `console.*` with `logger.*` |
| 9 | `src/services/video/reconnectionManager.ts` | Replace `console.*` with `logger.*` |
| 10 | `src/hooks/useLocalMedia.ts` | Replace `console.*` with `logger.*` |
| 11 | `src/services/video/enhancedVideoService.test.ts` | Create: Vitest tests for join/leave race, idempotent cleanup, stale callbacks |
| 12 | `docs/ARCHITECTURE_BOUNDARIES.md` | Create: defines service directory conventions |
| 13 | `src/services/enhancedVideoService.ts` | Add header comment clarifying adapter role |
| 14 | `src/services/audioPlaceholderService.ts` | Add header comment clarifying placeholder role |
| 15 | `src/services/audioService.ts` | Add header comment clarifying stub role |
| 16 | `scripts/hygiene-check.mjs` | Create: detects stale artifacts (`.bak`, `.old`, `.tmp`, `.security-update`, duplicate files outside `src/`) |
| 17 | `src/hooks/useRoleBasedSecurity.ts` | Add comments documenting that `user.role` comes from server-validated AuthContext |
| 18 | `docs/DEPENDENCY_MAINTENANCE.md` | Create: monthly audit routine, triage process |
| 19 | `.github/dependabot.yml` | Create: npm ecosystem, weekly schedule |
| 20 | `src/test/setup.ts` | Add `vitest/globals` types entry to `tsconfig.app.json` (needed for vitest globals) |
| 21 | `tsconfig.app.json` | Add `"types": ["vitest/globals"]` |

---

### Objective 1 — CI quality gates

**`.github/workflows/ci.yml`:**
```yaml
name: CI
on:
  push:
    branches: ["**"]
  pull_request:
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run test
      - run: npm run hygiene:check
```

**`package.json` additions:**
```json
"test":           "vitest run",
"test:watch":     "vitest",
"test:coverage":  "vitest run --coverage",
"hygiene:check":  "node scripts/hygiene-check.mjs"
```

---

### Objective 2 — TypeScript strictness (Hybrid)

Approach: keep `tsconfig.app.json` unchanged to avoid build breaks. Add a separate `tsconfig.strict.json` that includes only `src/services/video` and `src/utils`, with `strictNullChecks: true`. CI checks this file separately.

**`tsconfig.strict.json`:**
```json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true
  },
  "include": [
    "src/services/video/**/*",
    "src/utils/**/*"
  ]
}
```

CI gets an extra step: `npx tsc -p tsconfig.strict.json --noEmit`

**`docs/TS_MIGRATION.md`** documents:
- Phase 1 (now): strict config covers `src/services/video/` + `src/utils/`
- Phase 2: extend to `src/services/`, `src/hooks/`
- Phase 3: enable globally in `tsconfig.app.json`
- Migration checklist for each phase

---

### Objective 3 — Logger utility

**`src/utils/logger.ts`** — minimal, zero-dependency:
```typescript
const IS_DEV = import.meta.env.DEV;

export const logger = {
  debug: (...args: unknown[]) => { if (IS_DEV) console.debug('[DEBUG]', ...args); },
  info:  (...args: unknown[]) => { if (IS_DEV) console.info('[INFO]',  ...args); },
  warn:  (...args: unknown[]) => { console.warn('[WARN]',  ...args); },
  error: (...args: unknown[]) => { console.error('[ERROR]', ...args); },
};
```

**Migrate high-impact files** (all `console.log/warn/error` → `logger.*`):
- `src/services/video/enhancedVideoService.ts` (~20 calls → debug/warn/error)
- `src/services/video/jitsiApiLoader.ts` (~8 calls)
- `src/services/video/advancedVideoFeatures.ts` (~10 calls)
- `src/services/video/reconnectionManager.ts` (~6 calls)
- `src/hooks/useLocalMedia.ts` (~12 calls)

---

### Objective 4 — Video service lifecycle tests

**`src/services/video/__tests__/enhancedVideoService.test.ts`** covering:

1. **Join/leave race condition** — `joinRoom()` timeout callback does NOT fire after `leaveRoom()` has been called  
   Strategy: use `vi.useFakeTimers()`, call `joinRoom()`, immediately call `leaveRoom()`, advance timer — assert callback was NOT called

2. **Cleanup idempotency** — `dispose()` called twice does not throw or repeat teardown  
   Strategy: call `dispose()` twice, assert `leaveRoom` cleanup executed exactly once via spy

3. **No stale callbacks after dispose** — `onConnectionStatusChanged` not called after `dispose()`  
   Strategy: inject callback spy, dispose, advance fake timers, assert spy not called

All mocks: `window.JitsiMeetExternalAPI`, `navigator.mediaDevices.getUserMedia`, `JitsiApiLoader`, fake timers via Vitest's `vi.useFakeTimers()`. Tests are deterministic (no real `setTimeout` waits).

---

### Objective 5 — Architecture boundaries

**`docs/ARCHITECTURE_BOUNDARIES.md`:**
- `src/services/` — active, production-ready services  
- `src/services/video/` — video subsystem (active)  
- `src/services/ai/` — AI content services (active)  
- Adapter pattern: `src/services/enhancedVideoService.ts` — backward-compat re-export  
- Placeholder/stub: `src/services/audioService.ts`, `src/services/audioPlaceholderService.ts`
- Convention: new files with placeholder intent must include `@placeholder` JSDoc tag

Add file-header comments:
- `src/services/enhancedVideoService.ts` — already has `// Legacy export file for backward compatibility`; enhance comment
- `src/services/audioPlaceholderService.ts` — add `@placeholder` header
- `src/services/audioService.ts` — add `@stub` header

---

### Objective 6 — Repository hygiene check

**`scripts/hygiene-check.mjs`** (Node.js ESM, no dependencies):
- Walks entire project (excluding `node_modules`, `.git`, `dist`)
- Reports files matching: `*.bak`, `*.old`, `*.tmp`, `*.security-update`, `*.orig`
- Reports files outside `src/` that duplicate a file inside `src/` (by filename)
- Exits with code 1 if any findings found (so CI gate fails)
- Exits with code 0 if clean

---

### Objective 7 — Security hardening comments

No code logic changes needed — the security model is correct:
- `fetchUserRoleFromDatabase()` queries `user_roles` table — server-authoritative
- `clearInsecureRoleStorage()` runs at startup
- `localStorage.getItem('role')` is absent from active code
- `ImprovedProtectedRoute` uses `user.role` from AuthContext (server-fetched)

Changes:
- `src/hooks/useRoleBasedSecurity.ts` — add `// SECURITY:` comment block explaining that `user.role` here is the server-validated value set by AuthContext, not client-side storage
- `src/hooks/useAdminAuth.ts` — add summary comment at top of function

---

### Objective 8 — Dependency maintenance

**`docs/DEPENDENCY_MAINTENANCE.md`:** monthly update routine, `npm audit` triage table, PR process

**`.github/dependabot.yml`:**
```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
    groups:
      radix-ui:
        patterns: ["@radix-ui/*"]
      react-ecosystem:
        patterns: ["react", "react-dom", "react-*"]
```

---

### Risk notes

- Vitest fake-timer tests interact with `window.JitsiMeetExternalAPI` — requires mock setup; tests will live in `src/services/video/__tests__/` and be picked up by existing `vitest.config.ts` pattern
- `tsconfig.strict.json` is type-check only (no build), so it cannot break the Vite build even if it surfaces new errors — the migration doc explains this
- Logger migration in video/classroom files: pure find-replace of `console.log` → `logger.debug`, `console.warn` → `logger.warn`, `console.error` → `logger.error` — no logic changes
- `package.json` is currently missing `test` script; adding it will make `npm test` work for the first time

### Files changed: 21 total
3 created in docs/, 2 in .github/, 1 in scripts/, 1 in src/utils/, 1 in src/services/video/__tests__/, 1 in tsconfig.strict.json — plus targeted edits to 5 existing source files and 3 service files for logger migration
