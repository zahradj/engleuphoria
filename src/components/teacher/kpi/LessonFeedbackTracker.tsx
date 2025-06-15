
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Star,
  MessageSquare,
  Lock,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PendingLesson {
  id: string;
  title: string;
  scheduled_at: string;
  student_name: string;
  student_id: string;
  feedback_submitted: boolean;
  duration: number;
}

interface FeedbackForm {
  feedback_content: string;
  student_performance_rating: number;
  lesson_objectives_met: boolean;
  homework_assigned: string;
  parent_communication_notes: string;
}

export function LessonFeedbackTracker() {
  const [pendingLessons, setPendingLessons] = useState<PendingLesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<PendingLesson | null>(null);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    feedback_content: '',
    student_performance_rating: 5,
    lesson_objectives_met: true,
    homework_assigned: '',
    parent_communication_notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingLessons();
  }, []);

  const loadPendingLessons = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          scheduled_at,
          feedback_submitted,
          duration,
          student_id,
          student:users!student_id(full_name)
        `)
        .eq('teacher_id', user.id)
        .eq('status', 'completed')
        .eq('feedback_submitted', false)
        .order('scheduled_at', { ascending: false });

      if (error) {
        console.error('Error loading pending lessons:', error);
        return;
      }

      const formattedLessons = data?.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        scheduled_at: lesson.scheduled_at,
        student_name: lesson.student?.full_name || 'Unknown Student',
        student_id: lesson.student_id,
        feedback_submitted: lesson.feedback_submitted,
        duration: lesson.duration
      })) || [];

      setPendingLessons(formattedLessons);
    } catch (error) {
      console.error('Error loading pending lessons:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedLesson) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Submit feedback
      const { error: feedbackError } = await supabase
        .from('lesson_feedback_submissions')
        .insert({
          lesson_id: selectedLesson.id,
          teacher_id: user.id,
          student_id: selectedLesson.student_id,
          ...feedbackForm
        });

      if (feedbackError) {
        console.error('Error submitting feedback:', feedbackError);
        toast({
          title: "Error",
          description: "Failed to submit feedback. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Update lesson status
      const { error: lessonError } = await supabase
        .from('lessons')
        .update({ 
          feedback_submitted: true,
          quality_rating: feedbackForm.student_performance_rating
        })
        .eq('id', selectedLesson.id);

      if (lessonError) {
        console.error('Error updating lesson:', lessonError);
      }

      toast({
        title: "Feedback Submitted!",
        description: "Payment for this lesson has been unlocked.",
      });

      // Reset form and close dialog
      setFeedbackForm({
        feedback_content: '',
        student_performance_rating: 5,
        lesson_objectives_met: true,
        homework_assigned: '',
        parent_communication_notes: ''
      });
      setDialogOpen(false);
      loadPendingLessons();

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="text-blue-500" />
          Pending Lesson Feedback
          <Badge className="bg-red-100 text-red-800">
            {pendingLessons.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingLessons.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
            <h3 className="text-lg font-medium mb-2">All caught up!</h3>
            <p className="text-gray-600">No pending feedback submissions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingLessons.map((lesson) => (
              <div key={lesson.id} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{lesson.title}</h4>
                      <Lock size={16} className="text-red-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Student: {lesson.student_name}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} />
                      {formatDate(lesson.scheduled_at)} • {lesson.duration} min
                    </p>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => setSelectedLesson(lesson)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Submit Feedback
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Submit Lesson Feedback</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium">{selectedLesson?.title}</p>
                          <p className="text-sm text-gray-600">Student: {selectedLesson?.student_name}</p>
                        </div>

                        <div>
                          <Label htmlFor="feedback">Lesson Summary & Student Progress</Label>
                          <Textarea
                            id="feedback"
                            placeholder="Describe what was covered in the lesson and how the student performed..."
                            value={feedbackForm.feedback_content}
                            onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedback_content: e.target.value }))}
                            className="mt-1"
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label htmlFor="rating">Student Performance Rating</Label>
                          <div className="flex items-center gap-2 mt-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setFeedbackForm(prev => ({ ...prev, student_performance_rating: rating }))}
                                className={`p-1 ${feedbackForm.student_performance_rating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              >
                                <Star size={24} fill="currentColor" />
                              </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              {feedbackForm.student_performance_rating}/5
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="homework">Homework Assigned</Label>
                          <Input
                            id="homework"
                            placeholder="What homework was assigned?"
                            value={feedbackForm.homework_assigned}
                            onChange={(e) => setFeedbackForm(prev => ({ ...prev, homework_assigned: e.target.value }))}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="parent_notes">Parent Communication Notes</Label>
                          <Textarea
                            id="parent_notes"
                            placeholder="Any notes to share with parents..."
                            value={feedbackForm.parent_communication_notes}
                            onChange={(e) => setFeedbackForm(prev => ({ ...prev, parent_communication_notes: e.target.value }))}
                            className="mt-1"
                            rows={2}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="objectives_met"
                            checked={feedbackForm.lesson_objectives_met}
                            onChange={(e) => setFeedbackForm(prev => ({ ...prev, lesson_objectives_met: e.target.checked }))}
                          />
                          <Label htmlFor="objectives_met">Lesson objectives were met</Label>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={handleSubmitFeedback}
                            disabled={isSubmitting || !feedbackForm.feedback_content.trim()}
                            className="flex-1"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send size={16} className="mr-2" />
                                Submit & Unlock Payment
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
