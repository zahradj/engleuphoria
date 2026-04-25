import React, { useEffect, useRef, useState } from 'react';
import Hyperbeam, { type HyperbeamEmbed } from '@hyperbeam/web';
import { Loader2, Globe, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { coBrowserController, type CoBrowserNavCommand } from './coBrowserController';
import { useCollapseWatcher } from '@/hooks/useCollapseWatcher';

interface MultiplayerWebStageProps {
  /** Hyperbeam embed URL (broadcast via session.embeddedUrl). Pass null to show empty state. */
  embedUrl: string | null;
  role: 'teacher' | 'student';
  /** When true, the student gets mouse + keyboard input. Teacher always has input. */
  controlEnabled?: boolean;
  /** Optional URL to navigate the cloud browser to (teacher only). */
  navigateTo?: string | null;
  /** Optional admin token (teacher only) so the teacher can manage tabs/roles. */
  adminToken?: string | null;
}

type JoinState = 'idle' | 'joining' | 'connecting' | 'playing' | 'reconnecting' | 'failed' | 'disconnected';

/**
 * Renders a Hyperbeam cloud browser inside the Main Stage. Both teacher and
 * student mount the same broadcast `embedUrl` and join the same shared web
 * instance. The teacher always has input; the student's input is gated by
 * `controlEnabled` (the "Unlock Student Interaction" toggle in the dock).
 */
export const MultiplayerWebStage: React.FC<MultiplayerWebStageProps> = ({
  embedUrl,
  role,
  controlEnabled = false,
  navigateTo = null,
  adminToken = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hbRef = useRef<HyperbeamEmbed | null>(null);
  const initPromiseRef = useRef<Promise<HyperbeamEmbed | null> | null>(null);
  const roleRef = useRef(role);
  const adminTokenRef = useRef(adminToken);
  const controlEnabledRef = useRef(controlEnabled);
  const [joinState, setJoinState] = useState<JoinState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keep latest prop values accessible without re-running the mount effect
  useEffect(() => {
    roleRef.current = role;
    adminTokenRef.current = adminToken;
    controlEnabledRef.current = controlEnabled;
  }, [role, adminToken, controlEnabled]);

  // Warn if the Hyperbeam container ever collapses to 0×0 — common cause of
  // "Hyperbeam playing but invisible" bugs.
  useCollapseWatcher(containerRef, 'hyperbeam-container', !!embedUrl);

  // Mount / unmount Hyperbeam when the embed URL changes.
  // Serialized via initPromiseRef so a new instance never attaches to a div
  // that still holds the previous (or in-flight) instance.
  useEffect(() => {
    if (!embedUrl || !containerRef.current) {
      setJoinState('idle');
      return;
    }

    let cancelled = false;
    setJoinState('joining');
    setErrorMsg(null);

    const container = containerRef.current;
    const prev = initPromiseRef.current;

    const next: Promise<HyperbeamEmbed | null> = (async () => {
      // 1. Wait for any prior init to finish, then destroy it before reusing the div.
      try {
        const prevHb = await prev;
        if (prevHb) {
          try { prevHb.destroy(); } catch (_) { /* noop */ }
        }
      } catch (_) { /* prior init failed — nothing to destroy */ }

      if (cancelled || !container) return null;

      // 2. Mount the new Hyperbeam instance into the (now-clean) container.
      try {
        const currentRole = roleRef.current;
        const hb = await Hyperbeam(container, embedUrl, {
          delegateKeyboard: currentRole === 'teacher' ? true : controlEnabledRef.current,
          disableInput: currentRole === 'teacher' ? false : !controlEnabledRef.current,
          adminToken: currentRole === 'teacher' ? (adminTokenRef.current ?? undefined) : undefined,
          timeout: 30_000,
          onConnectionStateChange: (e) => {
            if (cancelled) return;
            console.log('[Hyperbeam] connection state:', e.state);
            setJoinState(e.state as JoinState);
          },
          onDisconnect: (e) => {
            console.warn('[Hyperbeam] disconnected:', e.type);
            if (!cancelled) {
              setJoinState('disconnected');
              setErrorMsg(`Disconnected (${e.type})`);
            }
          },
          onCloseWarning: (e) => {
            console.warn('[Hyperbeam] close warning:', e.type, e.deadline);
          },
        });

        if (cancelled) {
          try { hb.destroy(); } catch (_) { /* noop */ }
          return null;
        }

        hbRef.current = hb;
        return hb;
      } catch (err: any) {
        console.error('[Hyperbeam] mount failed:', err);
        if (!cancelled) {
          setErrorMsg(String(err?.message ?? err));
          setJoinState('failed');
        }
        return null;
      }
    })();

    initPromiseRef.current = next;

    return () => {
      cancelled = true;
      // Chain teardown onto the in-flight init so we always destroy whatever resolves.
      const teardown = next.then((hb) => {
        if (hb) {
          try { hb.destroy(); } catch (_) { /* noop */ }
        }
        return null;
      });
      initPromiseRef.current = teardown;
      hbRef.current = null;
    };
  }, [embedUrl]);

  // Toggle student input live when the teacher flips "Unlock Student Interaction"
  useEffect(() => {
    if (!hbRef.current || role === 'teacher') return;
    try {
      hbRef.current.disableInput = !controlEnabled;
      hbRef.current.delegateKeyboard = controlEnabled;
    } catch (err) {
      console.warn('[Hyperbeam] toggle student control failed', err);
    }
  }, [controlEnabled, role]);

  // Teacher-driven navigation (initial / programmatic URL changes)
  useEffect(() => {
    if (!hbRef.current || role !== 'teacher' || !navigateTo) return;
    void navigateActiveTabTo(hbRef.current, navigateTo);
  }, [navigateTo, role]);

  // Teacher-driven Back / Forward / Reload / Home from the Control Dock
  useEffect(() => {
    if (role !== 'teacher') return;
    const unsub = coBrowserController.subscribe(async (cmd: CoBrowserNavCommand, payload) => {
      const hb = hbRef.current;
      if (!hb) return;
      try {
        const tabs = await hb.tabs.query({});
        const tabId = tabs?.[0]?.id;
        if (tabId == null) return;
        if (cmd === 'back') {
          await hb.tabs.goBack(tabId);
        } else if (cmd === 'forward') {
          await hb.tabs.goForward(tabId);
        } else if (cmd === 'reload') {
          await hb.tabs.reload(tabId);
        } else if (cmd === 'home') {
          const url = (typeof payload === 'string' ? payload : null) ?? coBrowserController.homeUrl;
          if (url) await hb.tabs.update(tabId, { url });
        }
      } catch (err) {
        console.warn('[Hyperbeam] nav command failed', cmd, err);
      }
    });
    return unsub;
  }, [role]);

  if (!embedUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground space-y-2 px-6">
          <Globe className="w-12 h-12 mx-auto opacity-40" />
          <p className="text-sm font-medium">Co-Play stage is empty</p>
          <p className="text-xs">
            {role === 'teacher'
              ? 'Enter a URL in the dock and click Co-Play to launch a shared cloud browser.'
              : 'Waiting for the teacher to launch a shared activity…'}
          </p>
        </div>
      </div>
    );
  }

  const showOverlay = joinState !== 'playing';

  return (
    <div className="absolute inset-0 h-full w-full bg-muted/40 p-4">
      <div ref={containerRef} id="hyperbeam-container" className="mx-auto h-full w-full max-w-6xl overflow-hidden rounded-lg border border-border bg-black shadow-lg" />

      {/* Live "joined as viewer" badge for the student */}
      {role === 'student' && joinState === 'playing' && (
        <div className="absolute top-3 right-3 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full px-3 py-1 text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
          <span className={`h-1.5 w-1.5 rounded-full ${controlEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
          {controlEnabled ? 'You can interact' : 'Viewing only'}
        </div>
      )}

      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white pointer-events-none">
          <div className="text-center space-y-3 max-w-md px-6 pointer-events-auto">
            {joinState === 'joining' || joinState === 'connecting' ? (
              <>
                <Loader2 className="w-8 h-8 mx-auto animate-spin" />
                <div>
                  <p className="text-sm font-medium">
                    {role === 'teacher' ? 'Joining co-play session…' : 'Joining your teacher\'s shared browser…'}
                  </p>
                  <p className="text-xs text-white/60 mt-1">Spinning up the cloud browser. Usually 2–4 seconds.</p>
                </div>
              </>
            ) : joinState === 'reconnecting' ? (
              <>
                <Wifi className="w-7 h-7 mx-auto text-yellow-300 animate-pulse" />
                <p className="text-sm font-medium">Reconnecting…</p>
              </>
            ) : joinState === 'disconnected' ? (
              <>
                <WifiOff className="w-7 h-7 mx-auto text-white/70" />
                <p className="text-sm font-medium">Disconnected from co-play session</p>
                <p className="text-xs text-white/60">{errorMsg}</p>
              </>
            ) : joinState === 'failed' ? (
              <>
                <AlertTriangle className="w-8 h-8 mx-auto text-red-400" />
                <p className="text-sm font-medium">Couldn't connect to the cloud browser.</p>
                {errorMsg && <p className="text-xs text-white/60 break-all">{errorMsg}</p>}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Navigate the first/active tab in a Hyperbeam embed to a new URL,
 * creating it if no tab exists yet.
 */
async function navigateActiveTabTo(hb: HyperbeamEmbed, url: string): Promise<void> {
  try {
    const tabs = await hb.tabs.query({});
    const first = tabs?.[0];
    if (first?.id != null) {
      await hb.tabs.update(first.id, { url });
    } else {
      await hb.tabs.create({ url, active: true });
    }
  } catch (err) {
    console.warn('[Hyperbeam] navigation failed', err);
  }
}

/**
 * Mints a new Hyperbeam embed URL via the `hyperbeam-session` edge function.
 * Returned URL is what BOTH teacher and student mount to join the same shared
 * web instance.
 */
export async function createHyperbeamSession(startUrl?: string): Promise<{
  embedUrl: string;
  sessionId: string;
  adminToken?: string;
}> {
  const { data, error } = await supabase.functions.invoke('hyperbeam-session', {
    body: { startUrl },
  });

  // supabase-js wraps non-2xx responses in FunctionsHttpError and hides the body.
  // Re-fetch the structured error payload so the UI can show why it failed.
  if (error) {
    let detail: any = null;
    try {
      const ctx: any = (error as any).context;
      if (ctx?.json) detail = await ctx.json();
      else if (ctx?.text) detail = JSON.parse(await ctx.text());
    } catch (_) { /* swallow parse errors */ }

    const status = detail?.status ?? (error as any)?.status;
    if (status === 429 || /too[_ ]many|rate[- ]limit/i.test(detail?.detail ?? '')) {
      throw new Error('Hyperbeam rate-limited (too many cloud-browser sessions in a short period). Please wait ~60 seconds and try again, or use the regular Embed instead.');
    }
    if (detail?.error === 'hyperbeam_failed') {
      throw new Error(`Cloud browser failed (HTTP ${detail.status}). ${detail.detail ?? ''}`.trim());
    }
    throw new Error(detail?.error ?? error.message ?? 'Could not start cloud browser.');
  }

  if (!data?.embedUrl) throw new Error('No embedUrl returned from hyperbeam-session');
  return {
    embedUrl: data.embedUrl as string,
    sessionId: data.sessionId as string,
    adminToken: data.adminToken as string | undefined,
  };
}
