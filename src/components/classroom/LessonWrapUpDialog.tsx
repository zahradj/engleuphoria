import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Star, ClipboardCheck } from 'lucide-react';
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
          quick_notes: quickNotes
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

      toast({
        title: 'Feedback Saved ✓',
        description: 'Lesson wrap-up has been recorded and the student\'s learning path updated.',
        className: 'bg-emerald-900 border-emerald-700'
      });

      onOpenChange(false);
      // Reset
      setMasteredWords([]);
      setAreasForImprovement([]);
      setQuickNotes('');
      setRating(0);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      toast({ title: 'Error', description: 'Failed to save feedback.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
            Lesson Wrap-Up
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Words Mastered */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Words Mastered</p>
            <div className="flex flex-wrap gap-2">
              {vocabularyWords.map(word => (
                <button
                  key={word}
                  onClick={() => toggleWord(word)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    masteredWords.includes(word)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {masteredWords.includes(word) ? '✓ ' : ''}{word}
                </button>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Areas for Improvement</p>
            <div className="space-y-2">
              {IMPROVEMENT_AREAS.map(area => (
                <label key={area} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={areasForImprovement.includes(area)}
                    onCheckedChange={() => toggleArea(area)}
                    className="border-gray-600 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                  />
                  <span className="text-sm text-gray-300">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Notes */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Quick Notes</p>
            <Textarea
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              placeholder="Any observations about the lesson..."
              className="bg-gray-800 border-gray-700 text-sm min-h-[60px]"
            />
          </div>

          {/* Performance Rating */}
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Performance Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {submitting ? 'Saving...' : 'Save Feedback'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
