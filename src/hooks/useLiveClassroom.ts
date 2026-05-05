import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface ClassroomState {
  id: string;
  session_id: string;
  lesson_id: string | null;
  teacher_id: string;
  current_slide_index: number;
  active_media_state: { playing: boolean; position: number };
  student_rewards: number;
}

export interface StrokePayload {
  prevX: number; prevY: number; x: number; y: number;
  color: string; width: number; senderId: string;
}
export interface LaserPayload { x: number; y: number; senderId: string }

interface Options {
  sessionId: string;
  userId: string;
  role: 'teacher' | 'student';
  // When teacher and the row doesn't exist yet, we'll auto-create with these defaults.
  bootstrapLessonId?: string | null;
}

interface Peer { userId: string; role: 'teacher' | 'student' }

export function useLiveClassroom({ sessionId, userId, role, bootstrapLessonId }: Options) {
  const [state, setState] = useState<ClassroomState | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const handlersRef = useRef<{
    stroke: ((p: StrokePayload) => void)[];
    clear: (() => void)[];
    laser: ((p: LaserPayload) => void)[];
    reward: (() => void)[];
  }>({ stroke: [], clear: [], laser: [], reward: [] });

  // Bootstrap: ensure row exists (teacher creates), fetch initial state
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: existing } = await supabase
        .from('classroom_states')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();
      if (cancelled) return;
      if (existing) {
        setState(existing as any);
      } else if (role === 'teacher') {
        const { data: created, error } = await supabase
          .from('classroom_states')
          .insert({
            session_id: sessionId,
            teacher_id: userId,
            lesson_id: bootstrapLessonId ?? null,
            current_slide_index: 0,
          })
          .select('*')
          .single();
        if (!cancelled && created && !error) setState(created as any);
      }
    })();
    return () => { cancelled = true; };
  }, [sessionId, role, userId, bootstrapLessonId]);

  // Realtime channel
  useEffect(() => {
    if (!sessionId) return;
    const channel = supabase.channel(`live-classroom:${sessionId}`, {
      config: { presence: { key: userId }, broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'classroom_states',
        filter: `session_id=eq.${sessionId}`,
      }, (payload) => {
        const next = (payload.new as any) ?? null;
        if (next) setState(next);
      })
      .on('broadcast', { event: 'stroke' }, ({ payload }) => {
        handlersRef.current.stroke.forEach(h => h(payload as StrokePayload));
      })
      .on('broadcast', { event: 'clear' }, () => {
        handlersRef.current.clear.forEach(h => h());
      })
      .on('broadcast', { event: 'laser' }, ({ payload }) => {
        handlersRef.current.laser.forEach(h => h(payload as LaserPayload));
      })
      .on('broadcast', { event: 'reward' }, () => {
        handlersRef.current.reward.forEach(h => h());
      })
      .on('presence', { event: 'sync' }, () => {
        const st = channel.presenceState() as Record<string, Array<{ role: 'teacher' | 'student' }>>;
        const list: Peer[] = [];
        Object.entries(st).forEach(([uid, metas]) => {
          metas.forEach(m => list.push({ userId: uid, role: m.role }));
        });
        setPeers(list);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await channel.track({ role });
        }
      });

    return () => {
      setIsConnected(false);
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [sessionId, userId, role]);

  const setSlideIndex = useCallback(async (index: number) => {
    if (role !== 'teacher' || !state) return;
    setState(s => s ? { ...s, current_slide_index: index } : s);
    await supabase
      .from('classroom_states')
      .update({ current_slide_index: index })
      .eq('session_id', sessionId);
  }, [role, sessionId, state]);

  const sendStroke = useCallback((p: Omit<StrokePayload, 'senderId'>) => {
    channelRef.current?.send({ type: 'broadcast', event: 'stroke', payload: { ...p, senderId: userId } });
  }, [userId]);

  const sendLaser = useCallback((p: Omit<LaserPayload, 'senderId'>) => {
    channelRef.current?.send({ type: 'broadcast', event: 'laser', payload: { ...p, senderId: userId } });
  }, [userId]);

  const clearStrokes = useCallback(() => {
    channelRef.current?.send({ type: 'broadcast', event: 'clear', payload: {} });
    handlersRef.current.clear.forEach(h => h());
  }, []);

  const sendReward = useCallback(async () => {
    if (role !== 'teacher' || !state) return;
    channelRef.current?.send({ type: 'broadcast', event: 'reward', payload: {} });
    handlersRef.current.reward.forEach(h => h());
    const next = (state.student_rewards ?? 0) + 1;
    setState(s => s ? { ...s, student_rewards: next } : s);
    await supabase
      .from('classroom_states')
      .update({ student_rewards: next })
      .eq('session_id', sessionId);
  }, [role, state, sessionId]);

  const onStroke = useCallback((h: (p: StrokePayload) => void) => {
    handlersRef.current.stroke.push(h);
    return () => { handlersRef.current.stroke = handlersRef.current.stroke.filter(x => x !== h); };
  }, []);
  const onClear = useCallback((h: () => void) => {
    handlersRef.current.clear.push(h);
    return () => { handlersRef.current.clear = handlersRef.current.clear.filter(x => x !== h); };
  }, []);
  const onLaser = useCallback((h: (p: LaserPayload) => void) => {
    handlersRef.current.laser.push(h);
    return () => { handlersRef.current.laser = handlersRef.current.laser.filter(x => x !== h); };
  }, []);
  const onReward = useCallback((h: () => void) => {
    handlersRef.current.reward.push(h);
    return () => { handlersRef.current.reward = handlersRef.current.reward.filter(x => x !== h); };
  }, []);

  const isTeacher = role === 'teacher' && state?.teacher_id === userId;

  return {
    state, peers, isConnected, isTeacher,
    setSlideIndex, sendStroke, sendLaser, clearStrokes, sendReward,
    onStroke, onClear, onLaser, onReward,
  };
}
