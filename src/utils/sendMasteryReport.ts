import { supabase } from '@/integrations/supabase/client';

interface MasteryReportParams {
  studentId: string;
  unitId: string;
  milestoneResultId: string;
}

export async function sendMasteryReport({ studentId, unitId, milestoneResultId }: MasteryReportParams) {
  // 1. Fetch student profile for parent email and name
  const { data: profile } = await supabase
    .from('student_profiles')
    .select('parent_email, display_name')
    .eq('user_id', studentId)
    .single();

  if (!profile?.parent_email) {
    console.warn('No parent email found for student, skipping mastery report email');
    return { sent: false, reason: 'no_parent_email' };
  }

  // 2. Fetch unit info
  const { data: unit } = await supabase
    .from('curriculum_units')
    .select('title, cefr_level')
    .eq('id', unitId)
    .single();

  // 3. Fetch milestone result
  const { data: milestone } = await supabase
    .from('mastery_milestone_results')
    .select('score, passed, skill_scores, weakest_skill')
    .eq('id', milestoneResultId)
    .single();

  if (!milestone?.passed) {
    return { sent: false, reason: 'not_passed' };
  }

  // 4. Fetch vocabulary for this unit
  const { data: vocabData } = await supabase
    .from('student_vocabulary_progress')
    .select('word')
    .eq('student_id', studentId)
    .eq('unit_id', unitId);

  const vocabularyWords = (vocabData || []).map((v: any) => v.word);

  // 5. Fetch phonics progress
  const { data: phonicsData } = await supabase
    .from('student_phonics_progress')
    .select('phoneme, mastery_level')
    .eq('student_id', studentId);

  const masteredPhonemes = (phonicsData || [])
    .filter((p: any) => p.mastery_level === 'mastered')
    .map((p: any) => p.phoneme);

  const phonicsSummary = masteredPhonemes.length > 0
    ? `Your child mastered the ${masteredPhonemes.join(', ')} sound${masteredPhonemes.length > 1 ? 's' : ''} in this unit!`
    : 'Your child is developing their phonics skills.';

  // 6. Build skill scores from milestone data
  const rawSkillScores = milestone.skill_scores as Record<string, number> | null;
  const skillScores = rawSkillScores
    ? Object.entries(rawSkillScores).map(([name, score]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        score: Math.round(Number(score)),
        status: Number(score) >= 90 ? 'mastered' : Number(score) >= 80 ? 'excellent' : Number(score) >= 60 ? 'developing' : 'needs_review',
        observation: Number(score) >= 90 ? 'Excellent performance!' : Number(score) >= 80 ? 'Strong understanding.' : Number(score) >= 60 ? 'Good progress, continuing to develop.' : 'We will revisit this area.',
      }))
    : [];

  // 7. Send the email
  const { error } = await supabase.functions.invoke('send-transactional-email', {
    body: {
      templateName: 'unit-mastery-report',
      recipientEmail: profile.parent_email,
      idempotencyKey: `mastery-report-${milestoneResultId}`,
      templateData: {
        studentName: profile.display_name || 'Your child',
        unitName: unit?.title || 'Unit',
        overallScore: Math.round(Number(milestone.score)),
        phonicsSummary,
        vocabularyCount: vocabularyWords.length,
        vocabularyWords,
        grammarPattern: '',
        realWorldWin: '',
        homeActivity: '',
        skillScores,
      },
    },
  });

  if (error) {
    console.error('Failed to send mastery report email:', error);
    return { sent: false, reason: 'send_error', error };
  }

  return { sent: true };
}
