

## Plan: Engineering Quality Hardening Pass (Incremental)

Most foundational work already exists from the prior pass. This plan addresses the gaps.

### What already exists (no changes needed)
- `.github/workflows/ci.yml` — lint, tsc, strict tsc, vitest, hygiene
- `tsconfig.strict.json` — strictNullChecks for video + utils
- `src/utils/logger.ts` — dev-only debug/info, always warn/error
- `scripts/hygiene-check.mjs` — stale artifact detection
- `docs/TS_MIGRATION.md`, `docs/ARCHITECTURE_BOUNDARIES.md`, `docs/DEPENDENCY_MAINTENANCE.md`
- `.github/dependabot.yml`

### Changes to implement

| # | File | Action |
|---|------|--------|
| 1 | `package.json` | Add `typecheck`, `typecheck:strict`, `test:unit` scripts |
| 2 | `.github/workflows/ci.yml` | Update to use new script names; add coverage gate step |
| 3 | `vitest.config.ts` | Add coverage thresholds (60% lines/functions/branches) |
| 4 | `.github/CODEOWNERS` | Create: assign owners for video, auth, payments |
| 5 | `.github/PULL_REQUEST_TEMPLATE.md` | Create: checklist (tests, risk, rollback, screenshots) |
| 6 | `docs/ENGINEERING_GOVERNANCE.md` | Create: CI policy, logging policy, hygiene policy, branch protection recs, preview deploy guidance, coverage ratcheting strategy |

### Details

**A. package.json script additions**

Add alongside existing scripts:
```
"typecheck": "tsc --noEmit",
"typecheck:strict": "tsc -p tsconfig.strict.json --noEmit",
"test:unit": "vitest run"
```

Keep existing `test`, `test:watch`, `test:coverage` as-is. `test:unit` is an alias CI will use.

**B. CI workflow update**

Replace hardcoded commands with script references and add coverage:
```yaml
- run: npm run lint
- run: npm run typecheck
- run: npm run typecheck:strict
- run: npm run test:unit -- --coverage
- run: npm run hygiene:check
```

Coverage will fail CI if below thresholds (configured in vitest.config.ts).

**C. vitest.config.ts — coverage thresholds**

Add to existing coverage config:
```ts
thresholds: {
  lines: 60,
  functions: 60,
  branches: 60,
}
```

This is the initial modest baseline. The governance doc will describe ratcheting.

**D. CODEOWNERS**

```
# Video subsystem
src/services/video/** @team-video

# Auth & security
src/contexts/AuthContext.tsx @team-auth
src/hooks/useRoleBasedSecurity.ts @team-auth
src/hooks/useAdminAuth.ts @team-auth

# Payments
src/services/lessonPricingService.ts @team-payments
src/services/locationService.ts @team-payments

# CI & config
.github/** @team-infra
tsconfig*.json @team-infra
vitest.config.ts @team-infra
```

Uses placeholder team names; owner can replace with real GitHub handles.

**E. PR template**

Standard checklist: description, type of change, tests, risk assessment, rollback notes, screenshots for UI.

**F. Engineering Governance doc**

Single consolidated doc covering:
1. CI policy — what runs, what blocks merge
2. Branch protection recommendations — require PR, 1 approval, status checks, up-to-date branch, squash-merge preference
3. Coverage ratcheting — start at 60%, increase by 5% per quarter
4. Logging policy — use `logger.*`, no raw `console.*` in services
5. Hygiene policy — what the script checks, how to fix findings
6. Preview deploy guidance — Lovable auto-deploys previews; no extra config needed
7. Strict TS migration roadmap — references `docs/TS_MIGRATION.md`

### Files changed: 6 total
- 2 modified (`package.json`, `.github/workflows/ci.yml`, `vitest.config.ts`)
- 3 created (`CODEOWNERS`, PR template, governance doc)

### Intentionally deferred
- Actual coverage may be below 60% given minimal existing tests; if so, threshold will be set to current level and documented
- CODEOWNERS uses placeholder team names
- Branch protection settings require manual GitHub repo configuration (documented)

