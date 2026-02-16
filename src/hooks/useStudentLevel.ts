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
 */
export function determineStudentLevel(age: number): StudentLevel {
  if (age < 12) return 'playground';
  if (age >= 12 && age < 18) return 'academy';
  return 'professional';
}

/**
 * IRT-inspired evaluation: weighs age + correctCount + avgComplexity
 * - Kid promotion: age < 12, score > 4, avgComplexity > 0.8 → academy (advanced)
 * - Adult foundational: age > 18, score < 2 → professional (foundational)
 * - Default: age-based level
 */
export function evaluateStudentLevel(
  age: number,
  correctCount: number,
  totalQuestions: number,
  avgComplexity: number = 0.5
): { level: StudentLevel; track: string } {
  const defaultLevel = determineStudentLevel(age);

  // Promotion: High-performing kid who answered hard questions correctly
  if (age < 12 && correctCount > 4 && avgComplexity > 0.8) {
    return { level: 'academy', track: 'advanced' };
  }

  // Foundational: Struggling adult gets simplified content
  if (age > 18 && correctCount < 2) {
    return { level: 'professional', track: 'foundational' };
  }

  return { level: defaultLevel, track: 'standard' };
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
