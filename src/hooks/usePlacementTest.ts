import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { evaluateStudentLevel, getStudentDashboardRoute, determineStudentLevel } from '@/hooks/useStudentLevel';
import type { TestResult } from '@/components/placement/TestPhase';

export function usePlacementTest() {
  const { user } = useAuth();

  const completeTest = async (
    age: number,
    results: TestResult[],
    interests: string[] = []
  ): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');

    const correctCount = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctCount / results.length) * 100);
    const avgComplexity = results.reduce((acc, r) => acc + r.difficulty, 0) / results.length;

    const { level, track } = evaluateStudentLevel(age, correctCount, results.length, avgComplexity);

    const updateData: Record<string, unknown> = {
      student_level: level,
      onboarding_completed: true,
      placement_test_score: score,
      placement_test_completed_at: new Date().toISOString(),
    };

    if (interests.length > 0) {
      updateData.interests = interests;
    }

    const { error } = await supabase
      .from('student_profiles')
      .update(updateData)
      .eq('user_id', user.id);

    if (error) throw error;

    console.log(`Placement result: level=${level}, track=${track}, score=${score}%, avgComplexity=${avgComplexity.toFixed(2)}`);

    return getStudentDashboardRoute(level);
  };

  return { completeTest, determineStudentLevel };
}
