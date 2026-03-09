

## Code Quality Fix Plan

### Summary
Four targeted fixes: two lifecycle bugs in the video service, two stale file deletions.

---

### 1. Fix connection-state race in `EnhancedVideoService.joinRoom()`

**File:** `src/services/video/enhancedVideoService.ts`

- Add class field: `private connectionSimTimeout: ReturnType<typeof setTimeout> | null = null`
- Add class field: `private isDisposed = false`
- In `joinRoom()` line 91-94: store timeout handle, guard callback with `!this.isDisposed` check
- In `leaveRoom()`: clear timeout at start of method
- In `dispose()`: clear timeout, set `isDisposed = true`

### 2. Fix async teardown in `dispose()`

**File:** `src/services/video/enhancedVideoService.ts`  
**File:** `src/services/videoService.ts` (base class)

- Change base class abstract signature from `abstract dispose(): void` to `abstract dispose(): void | Promise<void>`
- Make `EnhancedVideoService.dispose()` async, `await this.leaveRoom()`
- Add idempotent guard using `isDisposed` flag — early return if already disposed
- Also update callers that may need to handle the promise (current callers in cleanup callbacks don't await anyway, so no behavior change)

### 3. Delete stale duplicate admin page

**File to delete:** `pages/AdminDashboard.tsx`

No imports reference this file (it's outside `src/`). Safe to remove.

### 4. Delete stale security snippet

**File to delete:** `src/App.tsx.security-update`

Already confirmed `clearInsecureRoleStorage()` is called in `src/main.tsx` line 23.

---

### Technical Details

**`enhancedVideoService.ts` changes (lines shown for reference):**

```typescript
// New fields (after line 14):
private connectionSimTimeout: ReturnType<typeof setTimeout> | null = null;
private isDisposed = false;

// joinRoom() timeout (replace lines 91-94):
this.connectionSimTimeout = setTimeout(() => {
  if (!this.isDisposed) {
    this.callbacks.onConnectionStatusChanged?.(true);
  }
}, 2000);

// leaveRoom() (add at start, before line 284):
private clearConnectionTimeout(): void {
  if (this.connectionSimTimeout !== null) {
    clearTimeout(this.connectionSimTimeout);
    this.connectionSimTimeout = null;
  }
}
// Call this.clearConnectionTimeout() at top of leaveRoom()

// dispose() (replace lines 303-306):
async dispose(): Promise<void> {
  if (this.isDisposed) return;
  this.isDisposed = true;
  this.clearConnectionTimeout();
  await this.leaveRoom();
  this.initialized = false;
}
```

**`videoService.ts` base class (line 41):**
```typescript
abstract dispose(): void | Promise<void>;
```

**Files changed:** 4 total
1. `src/services/video/enhancedVideoService.ts` — race fix + async dispose
2. `src/services/videoService.ts` — allow async dispose signature
3. `pages/AdminDashboard.tsx` — deleted
4. `src/App.tsx.security-update` — deleted

