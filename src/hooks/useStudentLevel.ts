import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { resolveHub, normalizeHub, getHubRoute, type HubLevel } from '@/lib/hubResolver';

export type StudentLevel = 'playground' | 'academy' | 'professional';

interface StudentLevelData {
  studentLevel: StudentLevel | null;
  onboardingCompleted: boolean;
  loading: boolean;
  error: string | null;
  /** Where the resolved level came from in this render */
  source: 'metadata' | 'db' | 'fallback' | null;
  refetch: () => Promise<void>;
}

/**
 * Metadata-first, non-blocking student level hook.
 *  - Seeds from auth metadata immediately so UI never hangs.
 *  - Confirms / syncs against student_profiles in the background.
 *  - On RLS or missing-row failures, keeps the metadata value and
 *    silently upserts a healed row.
 */
export function useStudentLevel(): StudentLevelData {
  const { user } = useAuth();

  // Seed synchronously from metadata so we never start in a "null + loading" state.
  const seed = (() => {
    if (!user) return { level: null as StudentLevel | null, source: null as StudentLevelData['source'] };
    const { level, source } = resolveHub({ metadata: (user as any).user_metadata });
    return { level: level as StudentLevel, source };
  })();

  const [studentLevel, setStudentLevel] = useState<StudentLevel | null>(seed.level);
  const [source, setSource] = useState<StudentLevelData['source']>(seed.source);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [loading, setLoading] = useState<boolean>(!!user); // background confirm only
  const [error, setError] = useState<string | null>(null);
  const healAttemptedRef = useRef(false);

  const fetchStudentLevel = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('student_profiles')
        .select('student_level, onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('🔴 [useStudentLevel] DB fetch failed (keeping metadata fallback):', fetchError);
        setError(fetchError.message);
        // Self-heal: try a background upsert so future reads succeed.
        if (!healAttemptedRef.current) {
          healAttemptedRef.current = true;
          const metaLevel = normalizeHub((user as any).user_metadata?.hub_type)
            || normalizeHub((user as any).user_metadata?.preferred_hub)
            || 'playground';
          supabase.from('student_profiles').upsert(
            { user_id: user.id, student_level: metaLevel, onboarding_completed: false },
            { onConflict: 'user_id' }
          ).then(({ error: healErr }) => {
            if (healErr) console.error('🔴 [useStudentLevel] Self-heal upsert failed:', healErr);
            else console.log('🟢 [useStudentLevel] Self-heal upsert OK →', metaLevel);
          });
        }
        return; // keep metadata-seeded value
      }

      if (data?.student_level) {
        const dbLevel = normalizeHub(data.student_level);
        if (dbLevel) {
          setStudentLevel(dbLevel as StudentLevel);
          setSource('db');
        }
        setOnboardingCompleted(data.onboarding_completed ?? false);
      } else if (!healAttemptedRef.current) {
        // Row missing — heal it from metadata in the background.
        healAttemptedRef.current = true;
        const metaLevel = normalizeHub((user as any).user_metadata?.hub_type)
          || normalizeHub((user as any).user_metadata?.preferred_hub)
          || 'playground';
        const { error: healErr } = await supabase.from('student_profiles').upsert(
          { user_id: user.id, student_level: metaLevel, onboarding_completed: false },
          { onConflict: 'user_id' }
        );
        if (healErr) console.error('🔴 [useStudentLevel] Heal-missing-row failed:', healErr);
        else console.log('🟢 [useStudentLevel] Healed missing student_profiles row →', metaLevel);
      }
    } catch (err) {
      console.error('🔴 [useStudentLevel] Unexpected error:', err);
      setError('Failed to fetch student level');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // Re-seed when user changes
    const { level, source: src } = resolveHub({ metadata: (user as any).user_metadata });
    setStudentLevel((prev) => prev ?? (level as StudentLevel));
    setSource((prev) => prev ?? src);

    fetchStudentLevel();

    // Hard escape hatch — never stay loading past 3s.
    const safetyTimeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.warn('⏱️ [useStudentLevel] 3s safety timeout — using metadata fallback.');
          return false;
        }
        return prev;
      });
    }, 3000);

    return () => clearTimeout(safetyTimeout);
  }, [user?.id, fetchStudentLevel]);

  return {
    studentLevel,
    onboardingCompleted,
    loading,
    error,
    source,
    refetch: fetchStudentLevel,
  };
}

/**
 * Determines the student level based on age
 */
export function determineStudentLevel(age: number): StudentLevel {
  if (age < 12) return 'playground';
  if (age >= 12 && age < 18) return 'academy';
  return 'professional';
}

/**
 * IRT-inspired evaluation: weighs age + correctCount + avgComplexity
 */
export function evaluateStudentLevel(
  age: number,
  correctCount: number,
  totalQuestions: number,
  avgComplexity: number = 0.5
): { level: StudentLevel; track: string } {
  const defaultLevel = determineStudentLevel(age);
  if (age < 12 && correctCount > 4 && avgComplexity > 0.8) {
    return { level: 'academy', track: 'advanced' };
  }
  if (age > 18 && correctCount < 2) {
    return { level: 'professional', track: 'foundational' };
  }
  return { level: defaultLevel, track: 'standard' };
}

/**
 * Maps student level to the corresponding route. Delegates to the shared resolver
 * so all routing stays in sync.
 */
export function getStudentDashboardRoute(level: StudentLevel | string | null | undefined): string {
  const normalized = normalizeHub(level as string) ?? 'playground';
  return getHubRoute(normalized as HubLevel);
}
