import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StudentSkill {
  skill: string;
  skillLabel: string;
  current: number;
  target: number;
  cefrEquivalent: string;
  nextFocus: string | null;
}

const SKILL_LABELS: Record<string, string> = {
  professional_vocabulary: 'Professional Vocabulary',
  fluency: 'Fluency',
  grammar_accuracy: 'Grammar Accuracy',
  business_writing: 'Business Writing',
  listening: 'Listening',
};

const SKILL_NAMES = Object.keys(SKILL_LABELS);

const scoreToCefr = (score: number): string => {
  if (score >= 8) return 'C1';
  if (score >= 6) return 'B2';
  if (score >= 4) return 'B1';
  if (score >= 2) return 'A2';
  return 'A1';
};

const nextCefr = (cefr: string): string => {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const idx = levels.indexOf(cefr);
  return idx < levels.length - 1 ? levels[idx + 1] : 'C2';
};

const NEXT_FOCUS_MAP: Record<string, string> = {
  professional_vocabulary: 'Industry-Specific Terminology',
  fluency: 'Spontaneous Conversation Practice',
  grammar_accuracy: 'Complex Sentence Structures',
  business_writing: 'Email Etiquette',
  listening: 'Conference Call Comprehension',
};

export const useStudentSkills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAndSeed = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_skills')
        .select('*')
        .eq('student_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        setSkills(
          data.map((row: any) => ({
            skill: row.skill_name,
            skillLabel: SKILL_LABELS[row.skill_name] || row.skill_name,
            current: Number(row.current_score),
            target: Number(row.target_score),
            cefrEquivalent: row.cefr_equivalent || scoreToCefr(Number(row.current_score)),
            nextFocus: row.next_focus,
          }))
        );
      } else {
        // Seed from placement test baseline
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('placement_test_score, placement_test_total')
          .eq('user_id', user.id)
          .maybeSingle();

        const baseScore = profile?.placement_test_score && profile?.placement_test_total
          ? (profile.placement_test_score / profile.placement_test_total) * 10
          : 3;

        // Add slight variance per skill
        const variance = [0, 0.5, -0.5, -1, 0.5];
        const seedRows = SKILL_NAMES.map((name, i) => {
          const score = Math.max(0, Math.min(10, Math.round((baseScore + variance[i]) * 10) / 10));
          return {
            student_id: user.id,
            skill_name: name,
            current_score: score,
            target_score: Math.min(10, score + 2),
            cefr_equivalent: scoreToCefr(score),
            next_focus: NEXT_FOCUS_MAP[name],
          };
        });

        const { error: insertError } = await supabase
          .from('student_skills')
          .insert(seedRows);

        if (!insertError) {
          setSkills(
            seedRows.map((row) => ({
              skill: row.skill_name,
              skillLabel: SKILL_LABELS[row.skill_name],
              current: row.current_score,
              target: row.target_score,
              cefrEquivalent: row.cefr_equivalent,
              nextFocus: row.next_focus,
            }))
          );
        }
      }
    } catch (err) {
      console.error('useStudentSkills error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAndSeed();
  }, [fetchAndSeed]);

  return { skills, loading, refresh: fetchAndSeed, scoreToCefr, nextCefr };
};
