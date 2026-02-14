import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { determineStudentLevel, getStudentDashboardRoute, StudentLevel } from '@/hooks/useStudentLevel';

export function usePlacementTest() {
  const { user } = useAuth();

  const calculateScore = (answers: number[], correctIndices: number[]): number => {
    const correct = answers.filter((a, i) => a === correctIndices[i]).length;
    return Math.round((correct / correctIndices.length) * 100);
  };

  const completeTest = async (age: number, score: number): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');

    const level: StudentLevel = determineStudentLevel(age);

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

    return getStudentDashboardRoute(level);
  };

  return { calculateScore, completeTest, determineStudentLevel };
}
