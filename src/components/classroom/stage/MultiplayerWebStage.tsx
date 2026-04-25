import React, { useEffect, useRef, useState } from 'react';
import Hyperbeam from '@hyperbeam/web';
import { Loader2, Globe, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MultiplayerWebStageProps {
  /** Hyperbeam embed URL. Pass null to show empty state. */
  embedUrl: string | null;
  role: 'teacher' | 'student';
  /** When true, the student receives mouse + keyboard control. Teacher always has control. */
  controlEnabled?: boolean;
  /** Optional URL to navigate the cloud browser to once mounted (teacher only). */
  navigateTo?: string | null;
}

/**
 * Renders a Hyperbeam cloud browser inside the Main Stage. Both teacher and
 * student mount the same `embedUrl` — they see and (if permitted) control the
 * exact same web instance.
 */
export const MultiplayerWebStage: React.FC<MultiplayerWebStageProps> = ({
  embedUrl,
  role,
  controlEnabled = true,
  navigateTo = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hbRef = useRef<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mount / unmount Hyperbeam when the embed URL changes
  useEffect(() => {
    if (!embedUrl || !containerRef.current) return;

    let cancelled = false;
    setStatus('loading');
    setErrorMsg(null);

    (async () => {
      try {
        const hb = await Hyperbeam(containerRef.current!, embedUrl, {
          // Disable input by default for student. Teacher always has it.
          delegateKeyboard: role === 'teacher' ? true : controlEnabled,
        });
        if (cancelled) {
          try { hb.destroy(); } catch (_) {}
          return;
        }
        hbRef.current = hb;
        setStatus('ready');
      } catch (err: any) {
        console.error('[Hyperbeam] mount failed:', err);
        setErrorMsg(String(err?.message ?? err));
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      try { hbRef.current?.destroy?.(); } catch (_) {}
      hbRef.current = null;
    };
  }, [embedUrl]);

  // Toggle student input when controlEnabled flips
  useEffect(() => {
    if (!hbRef.current || role === 'teacher') return;
    try {
      // Hyperbeam exposes a `setControl` style API; gracefully fall back.
      const hb = hbRef.current;
      if (typeof hb.setKeyboardControl === 'function') {
        hb.setKeyboardControl(controlEnabled);
      }
      if (typeof hb.setMouseControl === 'function') {
        hb.setMouseControl(controlEnabled);
      }
      if (typeof hb.setControl === 'function') {
        hb.setControl({ keyboard: controlEnabled, mouse: controlEnabled });
      }
    } catch (err) {
      console.warn('[Hyperbeam] toggle control failed', err);
    }
  }, [controlEnabled, role]);

  // Teacher-driven navigation
  useEffect(() => {
    if (!hbRef.current || role !== 'teacher' || !navigateTo) return;
    try {
      const hb = hbRef.current;
      if (hb.tabs?.update) {
        hb.tabs.update({ url: navigateTo });
      } else if (typeof hb.go === 'function') {
        hb.go(navigateTo);
      }
    } catch (err) {
      console.warn('[Hyperbeam] navigation failed', err);
    }
  }, [navigateTo, role]);

  if (!embedUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground space-y-2">
          <Globe className="w-12 h-12 mx-auto opacity-40" />
          <p className="text-sm font-medium">Co-Play stage is empty</p>
          <p className="text-xs">Teacher: enter a URL in the dock to launch a shared cloud browser.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black">
      <div ref={containerRef} className="w-full h-full" />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Spinning up shared cloud browser…</span>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-6">
          <div className="text-center max-w-md space-y-2">
            <AlertTriangle className="w-8 h-8 mx-auto text-red-400" />
            <p className="text-sm font-medium">Couldn't connect to the cloud browser.</p>
            <p className="text-xs text-white/60 break-all">{errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Helper used by the teacher dock: mints a new Hyperbeam embed URL via the
 * `hyperbeam-session` edge function and returns it.
 */
export async function createHyperbeamSession(startUrl?: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('hyperbeam-session', {
    body: { startUrl },
  });
  if (error) throw error;
  if (!data?.embedUrl) throw new Error('No embedUrl returned');
  return data.embedUrl as string;
}
