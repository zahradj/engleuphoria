import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type HubRole =
  | 'playground_specialist'
  | 'academy_mentor'
  | 'success_mentor'
  | 'academy_success_mentor'
  | null;

export type HubKind = 'playground' | 'academy' | 'professional';

/**
 * Single source of truth for a teacher's hub assignment.
 * Returns the raw hub_role plus a normalized hub kind and the
 * allowed slot durations for that hub.
 *
   * - Playground specialists: 30-minute slots only
   * - Academy / Success / Combined: 60-minute slots only
 */
export const useTeacherHubRole = (teacherId: string | undefined) => {
  const [hubRole, setHubRole] = useState<HubRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!teacherId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from('teacher_profiles')
        .select('hub_role')
        .eq('user_id', teacherId)
        .maybeSingle();
      if (!cancelled) {
        setHubRole(((data as any)?.hub_role ?? null) as HubRole);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [teacherId]);

  const isPlayground = hubRole === 'playground_specialist';
  const hubKind: HubKind = isPlayground
    ? 'playground'
    : hubRole === 'success_mentor'
      ? 'professional'
      : 'academy';

  const allowedDurations: (30 | 60)[] = isPlayground ? [30] : [60];

  return { hubRole, hubKind, allowedDurations, isPlayground, loading };
};
