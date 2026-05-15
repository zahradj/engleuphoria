import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EntryCountdown } from './EntryCountdown';
import { LiveActivityOverlay } from './LiveActivityOverlay';
import { GenerateActivityButton } from './GenerateActivityButton';
import { useToast } from '@/hooks/use-toast';

interface Props {
  bookingId: string;
  role: 'teacher' | 'student';
  hubType?: 'playground' | 'academy' | 'professional';
}

const HUB_RING: Record<string, string> = {
  playground: 'hsl(28 95% 58%)', // orange
  academy: 'hsl(265 70% 47%)',   // purple
  professional: 'hsl(160 84% 32%)', // emerald
};

/**
 * Top-level live-classroom lifecycle controller.
 * - Subscribes to classroom_states.status for this booking
 * - Shows EntryCountdown when status flips to 'live'
 * - Auto-redirects student to /feedback/:bookingId when status='ended'
 * - Renders the LiveActivityOverlay (both roles) and GenerateActivityButton (teacher only, top-right)
 */
export const ClassroomLifecycle: React.FC<Props> = ({ bookingId, role, hubType = 'academy' }) => {
  const [status, setStatus] = useState<'waiting' | 'live' | 'ended' | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initial fetch + realtime subscription on classroom_states
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('classroom_states')
        .select('status')
        .eq('session_id', bookingId)
        .maybeSingle();
      if (!cancelled && data) setStatus((data as any).status ?? 'waiting');
    })();

    const channel = supabase
      .channel(`classroom-lifecycle:${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classroom_states',
          filter: `session_id=eq.${bookingId}`,
        },
        (payload) => {
          const next = (payload.new as any)?.status;
          if (!next) return;
          setStatus((prev) => {
            if (next === 'live' && prev !== 'live') setShowCountdown(true);
            if (next === 'ended' && role === 'student') {
              toast({ title: 'Lesson ended', description: 'Heading to your feedback…' });
              setTimeout(() => navigate(`/feedback/${bookingId}`), 800);
            }
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [bookingId, role, navigate, toast]);

  // Teacher flips status → 'live' on first mount (idempotent)
  useEffect(() => {
    if (role !== 'teacher' || !status || status !== 'waiting') return;
    (async () => {
      await supabase
        .from('classroom_states')
        .update({ status: 'live', started_at: new Date().toISOString() })
        .eq('session_id', bookingId);
    })();
  }, [role, status, bookingId]);

  return (
    <>
      <EntryCountdown
        active={showCountdown}
        seconds={30}
        onComplete={() => setShowCountdown(false)}
        hubColor={HUB_RING[hubType] ?? HUB_RING.academy}
      />
      {role === 'teacher' && (
        <div className="fixed top-4 right-4 z-[60]">
          <GenerateActivityButton bookingId={bookingId} />
        </div>
      )}
      <LiveActivityOverlay bookingId={bookingId} isTeacher={role === 'teacher'} />
    </>
  );
};

export default ClassroomLifecycle;
