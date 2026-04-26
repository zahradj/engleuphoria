import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Star, ClipboardCheck, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LessonWrapUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId?: string;
  studentId?: string;
  teacherId?: string;
  vocabularyWords?: string[];
  sharedNotes?: string;
}

const IMPROVEMENT_AREAS = ['Grammar', 'Pronunciation', 'Vocabulary', 'Fluency', 'Listening'];

const SKILL_FIELDS = [
  { key: 'professional_vocabulary', label: 'Professional Vocabulary' },
  { key: 'fluency', label: 'Fluency' },
  { key: 'grammar_accuracy', label: 'Grammar Accuracy' },
  { key: 'business_writing', label: 'Business Writing' },
  { key: 'listening', label: 'Listening' },
] as const;

const scoreToCefr = (score: number): string => {
  if (score >= 8) return 'C1';
  if (score >= 6) return 'B2';
  if (score >= 4) return 'B1';
  if (score >= 2) return 'A2';
  return 'A1';
};

export const LessonWrapUpDialog: React.FC<LessonWrapUpDialogProps> = ({
  open,
  onOpenChange,
  lessonId,
  studentId,
  teacherId,
  vocabularyWords = ['accomplish', 'schedule', 'presentation', 'negotiate', 'deadline'],
  sharedNotes = ''
}) => {
  const { toast } = useToast();
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [areasForImprovement, setAreasForImprovement] = useState<string[]>([]);
  const [quickNotes, setQuickNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showSkillScores, setShowSkillScores] = useState(false);
  const [skillScores, setSkillScores] = useState<Record<string, number>>({
    professional_vocabulary: 5,
    fluency: 5,
    grammar_accuracy: 5,
    business_writing: 5,
    listening: 5,
  });

  // Load existing skill scores when dialog opens
  useEffect(() => {
    if (!open || !studentId) return;
    const loadSkills = async () => {
      const { data } = await supabase
        .from('student_skills')
        .select('skill_name, current_score')
        .eq('student_id', studentId);
      if (data && data.length > 0) {
        const scores: Record<string, number> = {};
        data.forEach((row: any) => {
          scores[row.skill_name] = Number(row.current_score);
        });
        setSkillScores(prev => ({ ...prev, ...scores }));
      }
    };
    loadSkills();
  }, [open, studentId]);

  const toggleWord = (word: string) => {
    setMasteredWords(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    );
  };

  const toggleArea = (area: string) => {
    setAreasForImprovement(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async () => {
    if (!teacherId) return;
    setSubmitting(true);

    try {
      // Insert feedback
      await supabase.from('lesson_feedback_submissions').insert({
        lesson_id: lessonId || null,
        teacher_id: teacherId,
        student_id: studentId || null,
        feedback_content: {
          words_mastered: masteredWords,
          areas_for_improvement: areasForImprovement,
          quick_notes: quickNotes,
          skill_scores: showSkillScores ? skillScores : undefined,
        },
        student_performance_rating: rating,
        lesson_objectives_met: masteredWords.length >= vocabularyWords.length / 2
      });

      // Save shared notes to lesson_completions
      if (lessonId && studentId && sharedNotes) {
        await supabase.from('lesson_completions').upsert({
          lesson_id: lessonId,
          student_id: studentId,
          shared_notes: sharedNotes,
          completed_at: new Date().toISOString()
        }, { onConflict: 'lesson_id,student_id' });
      }

      // Update student_skills table if skill scores were provided
      if (showSkillScores && studentId) {
        for (const field of SKILL_FIELDS) {
          const score = skillScores[field.key];
          const nextFocusMap: Record<string, string> = {
            professional_vocabulary: 'Industry Terminology',
            fluency: 'Conversational Practice',
            grammar_accuracy: 'Advanced Structures',
            business_writing: 'Email Etiquette',
            listening: 'Comprehension Drills',
          };
          await supabase
            .from('student_skills')
            .upsert({
              student_id: studentId,
              skill_name: field.key,
              current_score: score,
              cefr_equivalent: scoreToCefr(score),
              next_focus: nextFocusMap[field.key],
              updated_at: new Date().toISOString(),
            }, { onConflict: 'student_id,skill_name' });
        }
      }

      // Update student mistake_history if improvements noted
      if (studentId && areasForImprovement.length > 0) {
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('mistake_history')
          .eq('user_id', studentId)
          .single();

        const currentHistory = Array.isArray(profile?.mistake_history) ? profile.mistake_history : [];
        const newEntries = areasForImprovement.map(area => ({
          error_type: area,
          timestamp: new Date().toISOString(),
          source: 'teacher_feedback'
        }));

        await supabase
          .from('student_profiles')
          .update({
            mistake_history: [...currentHistory, ...newEntries].slice(-50)
          })
          .eq('user_id', studentId);
      }

      // ───────────────────────────────────────────────────────────────────────
      // CLOSE THE BOOKING + RECORD EARNINGS
      // (lessonId here is actually class_bookings.id — see UnifiedClassroomPage)
      // ───────────────────────────────────────────────────────────────────────
      if (lessonId) {
        // 1. Mark booking completed → student-side UI no longer treats it as live.
        const { data: bookingRow, error: bookingErr } = await supabase
          .from('class_bookings')
          .update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('id', lessonId)
          .select('id, hub_type, price_paid, currency, student_id, teacher_id, status')
          .maybeSingle();

        if (bookingErr) console.error('Failed to close booking:', bookingErr);

        // 2. Mark the live classroom session as ended (room teardown signal).
        await supabase
          .from('classroom_sessions')
          .update({
            session_status: 'ended',
            ended_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', lessonId);

        // 3. Record teacher earnings — idempotent (one payment row per booking).
        if (bookingRow && bookingRow.teacher_id && bookingRow.student_id) {
          const { data: existing } = await supabase
            .from('lesson_payments')
            .select('id')
            .eq('lesson_id', lessonId)
            .maybeSingle();

          if (!existing) {
            // Pull hub-specific payout amount; fall back to academy default.
            const hub = (bookingRow.hub_type as string) || 'academy';
            const { data: payoutRow } = await supabase
              .from('hub_payout_settings')
              .select('payout_amount_eur')
              .eq('hub', hub)
              .maybeSingle();

            const teacherPayout = Number(payoutRow?.payout_amount_eur ?? 7.0);
            const amountCharged = Number(bookingRow.price_paid ?? 0) || teacherPayout;
            const platformProfit = Math.max(amountCharged - teacherPayout, 0);

            const { error: payErr } = await supabase.from('lesson_payments').insert({
              lesson_id: lessonId,
              student_id: bookingRow.student_id,
              teacher_id: bookingRow.teacher_id,
              amount_charged: amountCharged,
              teacher_payout: teacherPayout,
              platform_profit: platformProfit,
              payment_method: 'platform_credit',
            });
            if (payErr) console.error('Failed to insert lesson_payments:', payErr);
          }
        }
      }

      toast({
        title: 'Session Report Saved ✓',
        description: showSkillScores
          ? 'Lesson closed for the student and earnings updated. Skill scores synced to dashboard.'
          : 'Lesson closed for the student and earnings updated.',
        className: 'bg-emerald-600 text-white border-emerald-700'
      });

      onOpenChange(false);
      // Reset
      setMasteredWords([]);
      setAreasForImprovement([]);
      setQuickNotes('');
      setRating(0);
      setShowSkillScores(false);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      toast({ title: 'Error', description: 'Failed to save feedback.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            Session Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Words Mastered */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Words Mastered</p>
            <div className="flex flex-wrap gap-2">
              {vocabularyWords.map(word => (
                <button
                  key={word}
                  onClick={() => toggleWord(word)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    masteredWords.includes(word)
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70 border border-border'
                  }`}
                >
                  {masteredWords.includes(word) ? '✓ ' : ''}{word}
                </button>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Areas for Improvement</p>
            <div className="space-y-2">
              {IMPROVEMENT_AREAS.map(area => (
                <label key={area} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={areasForImprovement.includes(area)}
                    onCheckedChange={() => toggleArea(area)}
                    className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                  />
                  <span className="text-sm text-foreground">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skill Score Assessment Toggle */}
          <div>
            <button
              onClick={() => setShowSkillScores(!showSkillScores)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full ${
                showSkillScores
                  ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/40'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70 border border-border'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              {showSkillScores ? 'Skill Score Assessment (Active)' : 'Add Skill Score Assessment'}
            </button>
          </div>

          {/* Skill Score Sliders */}
          {showSkillScores && (
            <div className="space-y-4 p-3 rounded-lg bg-muted/40 border border-border">
              <p className="text-xs text-muted-foreground mb-1">
                Adjust scores (0–10) based on this session. Changes update the student's Skill Radar.
              </p>
              {SKILL_FIELDS.map(field => (
                <div key={field.key} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{field.label}</span>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-300">
                      {skillScores[field.key].toFixed(1)} · {scoreToCefr(skillScores[field.key])}
                    </span>
                  </div>
                  <Slider
                    value={[skillScores[field.key]]}
                    onValueChange={([val]) => setSkillScores(prev => ({ ...prev, [field.key]: val }))}
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Quick Notes */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Quick Notes</p>
            <Textarea
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              placeholder="Any observations about the lesson..."
              className="text-sm min-h-[60px]"
            />
          </div>

          {/* Performance Rating */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Performance Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/40'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {submitting ? 'Saving...' : 'Submit Session Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
