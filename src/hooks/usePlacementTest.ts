import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { evaluateStudentLevel, getStudentDashboardRoute, determineStudentLevel } from '@/hooks/useStudentLevel';
import type { TestResult } from '@/components/placement/TestPhase';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

/**
 * Strict CEFR scoring band — based on the number of correct answers out of 15.
 *  0–3   → A1 (Beginner)
 *  4–6   → A2 (Elementary)
 *  7–9   → B1 (Intermediate)
 *  10–12 → B2 (Upper Intermediate)
 *  13–15 → C1 (Advanced)
 *
 * For shorter quizzes (e.g. the kids' Playground bank) we proportionally scale
 * the score to the same 15-point band so the function always returns a level.
 */
export function calculateCefrLevel(correctCount: number, totalQuestions: number): CefrLevel {
  const scaled = totalQuestions === 15
    ? correctCount
    : Math.round((correctCount / Math.max(totalQuestions, 1)) * 15);

  if (scaled <= 3) return 'A1';
  if (scaled <= 6) return 'A2';
  if (scaled <= 9) return 'B1';
  if (scaled <= 12) return 'B2';
  return 'C1';
}

export function cefrLevelLabel(cefr: CefrLevel): string {
  switch (cefr) {
    case 'A1': return 'A1 (Beginner)';
    case 'A2': return 'A2 (Elementary)';
    case 'B1': return 'B1 (Intermediate)';
    case 'B2': return 'B2 (Upper Intermediate)';
    case 'C1': return 'C1 (Advanced)';
  }
}

export function usePlacementTest() {
  const { user } = useAuth();

  const completeTest = async (
    age: number,
    results: TestResult[],
    interests: string[] = []
  ): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');

    const correctCount = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const score = Math.round((correctCount / Math.max(total, 1)) * 100);
    const avgComplexity = results.reduce((acc, r) => acc + r.difficulty, 0) / Math.max(total, 1);

    const cefrLevel = calculateCefrLevel(correctCount, total);
    const { level, track } = evaluateStudentLevel(age, correctCount, total, avgComplexity);

    const completedAt = new Date().toISOString();
    const upsertData: Record<string, unknown> = {
      user_id: user.id,
      student_level: level,
      hub_type: level, // MyPathPage / dashboard router read hub_type
      cefr_level: cefrLevel,
      onboarding_completed: true,
      placement_test_score: score,
      placement_test_completed_at: completedAt,
    };

    if (interests.length > 0) {
      upsertData.interests = interests;
    }

    // Use upsert so this works even if the signup row was never created
    // (prevents a silent no-op that re-triggers the placement gatekeeper loop).
    const { error } = await supabase
      .from('student_profiles')
      .upsert(upsertData as any, { onConflict: 'user_id' });

    if (error) {
      console.error('[usePlacementTest] Failed to persist placement result:', error);
      throw error;
    }

    // Verify the write actually landed before we navigate away — guarantees
    // the gatekeeper / guards see placement_test_completed_at on next read.
    const { data: verify } = await supabase
      .from('student_profiles')
      .select('placement_test_completed_at, cefr_level')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!verify?.placement_test_completed_at) {
      console.error('[usePlacementTest] Placement write did not persist:', verify);
      throw new Error('Could not save your placement result. Please try again.');
    }

    // After placement, hand the student off to the My Path reveal page —
    // the dashboard router is no longer the immediate destination.
    return '/dashboard/my-path';
  };

  return { completeTest, determineStudentLevel, calculateCefrLevel };
}
