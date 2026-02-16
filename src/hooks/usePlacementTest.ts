import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { evaluateStudentLevel, getStudentDashboardRoute, determineStudentLevel } from '@/hooks/useStudentLevel';

export function usePlacementTest() {
  const { user } = useAuth();

  const calculateScore = (answers: number[], correctIndices: number[]): number => {
    const correct = answers.filter((a, i) => a === correctIndices[i]).length;
    return Math.round((correct / correctIndices.length) * 100);
  };

  const completeTest = async (
    age: number,
    answers: number[],
    correctIndices: number[]
  ): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');

    const correctCount = answers.filter((a, i) => a === correctIndices[i]).length;
    const score = Math.round((correctCount / correctIndices.length) * 100);
    const { level, track } = evaluateStudentLevel(age, correctCount, correctIndices.length);

    const { error } = await supabase
      .from('student_profiles')
      .update({
        student_level: level,
        onboarding_completed: true,
        placement_test_score: score,
        placement_test_completed_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) throw error;

    console.log(`Placement result: level=${level}, track=${track}, score=${score}%`);

    return getStudentDashboardRoute(level);
  };

  return { calculateScore, completeTest, determineStudentLevel };
}
