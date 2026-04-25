## Fix Hyperbeam instance leak in MultiplayerWebStage

### Problem
Console error: `[Hyperbeam:ERR] found instance leak, hb.destroy() must be called before reusing div`. A new `Hyperbeam()` call mounts into the container `<div>` while a previous instance (or a previous in-flight init) is still attached. Existing cleanup only destroys `hbRef.current`, which is `null` while the first init is still awaiting — so when the effect re-runs, the second init starts on a dirty div and triggers the leak warning. Likely triggered by React StrictMode double-invoke and/or the effect re-running when `role` (or memo identity) flips.

### Fix (single file: `src/components/classroom/stage/MultiplayerWebStage.tsx`)

1. **Track the in-flight init as a promise**, not just the resolved instance:
   - Add `const initPromiseRef = useRef<Promise<HyperbeamEmbed | null> | null>(null);` alongside `hbRef`.
2. **Serialize mount/unmount** in the embed-URL effect:
   - At the top of the effect, capture the previous promise: `const prev = initPromiseRef.current;`
   - Build a new promise that: `await prev` first → if `prev` resolved to an instance, `destroy()` it → then call `Hyperbeam(container, embedUrl, …)` and return the new instance.
   - Assign this new promise to `initPromiseRef.current` and store the resolved instance into `hbRef.current` only after it resolves and the effect hasn't been cancelled.
3. **Robust cleanup**: cleanup function sets `cancelled = true` and chains another `.then()` on `initPromiseRef.current` that destroys whatever resolves (covers both already-resolved and in-flight cases). Clear `hbRef.current = null`.
4. **Tighten dependency array**: keep only `[embedUrl]`. Move the `role` / `adminToken` / initial `controlEnabled` reads into refs (`roleRef`, `adminTokenRef`, `controlEnabledRef`) updated in a separate `useEffect`, so re-mounts only happen when the URL itself changes. The existing live-toggle effect for `controlEnabled` already handles input gating without remount.
5. **Remove the stale `joinState === 'joining'` read** inside the async block (it captures an old closure value); rely solely on the `onConnectionStateChange` callback to drive `setJoinState`.
6. **Guard against unmounted container**: before calling `Hyperbeam(...)`, re-check `containerRef.current && !cancelled`.

### What stays the same
- The `controlEnabled` live-toggle effect (lines 101–109).
- The `navigateTo` effect (lines 112–115).
- The `coBrowserController` subscription (lines 118–142).
- All UI / overlay rendering.
- `createHyperbeamSession` and `navigateActiveTabTo` helpers.

### Acceptance
- Re-entering the classroom or toggling the stage no longer logs `found instance leak`.
- Switching `embedUrl` (e.g. teacher launches a new Co-Play session) cleanly tears down the old cloud browser before mounting the new one.
- Toggling "Unlock Student Interaction" does NOT remount the iframe (no flicker, no rejoin).
- StrictMode double-invoke in dev does not produce the leak warning.