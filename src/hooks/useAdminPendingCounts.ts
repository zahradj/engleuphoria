import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminPendingCounts {
  profileApprovals: number;
  applications: number;
  loading: boolean;
  refetch: () => void;
}

/**
 * Live counts for admin "action required" items:
 * - profileApprovals: teacher_profiles awaiting bio/video sign-off
 * - applications: teacher_applications still in the hiring pipeline
 */
export const useAdminPendingCounts = (pollMs = 60_000): AdminPendingCounts => {
  const [profileApprovals, setProfileApprovals] = useState(0);
  const [applications, setApplications] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCounts = useCallback(async () => {
    try {
      const [{ count: profileCount }, { count: appCount }] = await Promise.all([
        supabase
          .from('teacher_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('profile_complete', true)
          .eq('profile_approved_by_admin', false),
        supabase
          .from('teacher_applications')
          .select('*', { count: 'exact', head: true })
          .in('status', ['submitted', 'under_review', 'pending', 'interview_scheduled']),
      ]);
      setProfileApprovals(profileCount ?? 0);
      setApplications(appCount ?? 0);
    } catch (err) {
      console.warn('useAdminPendingCounts: fetch failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
    const id = setInterval(fetchCounts, pollMs);
    return () => clearInterval(id);
  }, [fetchCounts, pollMs]);

  return { profileApprovals, applications, loading, refetch: fetchCounts };
};
