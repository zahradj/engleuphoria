

## Fix: GitHub CI Failures

### Root Cause

The CI step `npm run test:unit -- --coverage` requires the `@vitest/coverage-v8` package to generate coverage reports, but it is **not installed** as a dependency. Vitest 4 requires this as a separate package. Without it, the coverage step crashes immediately, failing the entire job before subsequent steps can run.

### Fix

**1. Add `@vitest/coverage-v8` as a dev dependency**

Install `@vitest/coverage-v8` in `devDependencies` in `package.json`. This is the only package needed to unblock CI.

### Files

| File | Action |
|---|---|
| `package.json` | Add `@vitest/coverage-v8` to devDependencies |

### Technical Note

All other CI steps (lint, typecheck, typecheck:strict, hygiene:check) should pass based on code review -- the recent changes to the content creator pipeline don't affect files under strict typecheck scope (`src/services/video/**/*`, `src/utils/**/*`), and no stale files exist.

