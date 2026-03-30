

## Plan: Add App Version Tracking and Update Prompt

### Current State

- `package.json` version is `0.0.0` — never updated
- `manifest.json` has no version field
- The service worker (`sw.js`) handles cache versioning (`engleuphoria-v4`) and auto-reloads on `controllerchange`, but there is no user-facing version display or "update available" prompt
- The `usePWA` hook tracks install/online state but not version or update status
- Icons in `manifest.json` still use `placeholder.svg`

### What This Plan Adds

1. **Semantic version** set to `1.0.0` across `package.json` and injected at build time via Vite's `define` config
2. **"Update available" toast** — when the service worker detects a new version, users see a non-intrusive prompt to reload
3. **Version display** in the app (e.g., settings/footer area) so users can confirm they're on the latest build
4. **Service worker improvement** — listen for the `waiting` state and prompt the user instead of silently auto-reloading

### Files to Change

| File | Action | What |
|---|---|---|
| `package.json` | Modify | Set `"version": "1.0.0"` |
| `vite.config.ts` | Modify | Add `define: { __APP_VERSION__: JSON.stringify(pkg.version) }` |
| `src/vite-env.d.ts` | Modify | Declare `__APP_VERSION__` global |
| `src/main.tsx` | Modify | Detect SW `waiting` state; post `SKIP_WAITING` message instead of blind reload |
| `public/sw.js` | Modify | Listen for `SKIP_WAITING` message to call `self.skipWaiting()` on demand |
| `src/hooks/usePWA.ts` | Modify | Add `appVersion` and `updateAvailable` + `applyUpdate()` to the hook |
| `src/components/mobile/UpdatePrompt.tsx` | Create | Toast/banner component: "A new version is available — tap to update" |
| `src/components/mobile/AppVersion.tsx` | Create | Small version badge component (`v1.0.0`) for settings/profile pages |

### Technical Details

**Build-time version injection** — `vite.config.ts` reads `package.json` version and exposes it as `__APP_VERSION__`. No runtime API calls needed.

**Update flow**:
1. New service worker installs → enters `waiting` state
2. `usePWA` detects `registration.waiting` → sets `updateAvailable = true`
3. `UpdatePrompt` renders a toast with "Update now" button
4. On tap, posts `{ type: 'SKIP_WAITING' }` to the waiting SW
5. SW calls `self.skipWaiting()` → takes control → `controllerchange` fires → page reloads

**Service worker `SKIP_WAITING` listener** (added to `sw.js`):
```js
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

This replaces the current unconditional `self.skipWaiting()` in the install handler, giving users control over when the update applies.

