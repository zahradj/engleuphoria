import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type StudentLevel = 'playground' | 'academy' | 'professional';

interface StudentLevelData {
  studentLevel: StudentLevel | null;
  onboardingCompleted: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStudentLevel(): StudentLevelData {
  const { user } = useAuth();
  const [studentLevel, setStudentLevel] = useState<StudentLevel | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentLevel = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('student_profiles')
        .select('student_level, onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching student level:', fetchError);
        setError(fetchError.message);
        return;
      }

      if (data) {
        setStudentLevel(data.student_level as StudentLevel);
        setOnboardingCompleted(data.onboarding_completed ?? false);
      }
    } catch (err) {
      console.error('Unexpected error fetching student level:', err);
      setError('Failed to fetch student level');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentLevel();
  }, [user?.id]);

  return {
    studentLevel,
    onboardingCompleted,
    loading,
    error,
    refetch: fetchStudentLevel
  };
}

/**
 * Determines the student level based on age
 * - Playground: ages < 12
 * - Academy: ages 12-17
 * - Professional: ages 18+
 */
export function determineStudentLevel(age: number): StudentLevel {
  if (age < 12) return 'playground';
  if (age >= 12 && age < 18) return 'academy';
  return 'professional';
}

/**
 * Evaluates student level with score and age
 * Score can be used for CEFR placement, age determines UI track
 */
export function evaluateStudentLevel(score: number, age: number): StudentLevel {
  // Score reserved for future CEFR level determination
  // Age determines the dashboard/UI track
  if (age < 12) return 'playground';
  if (age >= 12 && age < 18) return 'academy';
  return 'professional';
}

/**
 * Maps student level to the corresponding route
 */
export function getStudentDashboardRoute(level: StudentLevel): string {
  switch (level) {
    case 'playground':
      return '/playground';
    case 'academy':
      return '/academy';
    case 'professional':
      return '/hub';
    default:
      return '/playground';
  }
}
