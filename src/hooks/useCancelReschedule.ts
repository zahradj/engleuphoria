import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CancelRescheduleResult {
  loading: boolean;
  cancelLesson: (lessonId: string, reason: string) => Promise<boolean>;
  rescheduleLesson: (lessonId: string, newDateTime: string, reason?: string) => Promise<boolean>;
  canCancel: (scheduledAt: string) => boolean;
  canReschedule: (scheduledAt: string) => boolean;
  getRefundInfo: (scheduledAt: string, cost: number) => { refundAmount: number; penalty: number };
}

const CANCEL_POLICY_HOURS = 6;
const RESCHEDULE_POLICY_HOURS = 4;

export function useCancelReschedule(): CancelRescheduleResult {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getHoursUntilLesson = (scheduledAt: string): number => {
    const lessonTime = new Date(scheduledAt);
    const now = new Date();
    return (lessonTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  };

  const canCancel = (scheduledAt: string): boolean => {
    const hoursUntil = getHoursUntilLesson(scheduledAt);
    return hoursUntil >= CANCEL_POLICY_HOURS;
  };

  const canReschedule = (scheduledAt: string): boolean => {
    const hoursUntil = getHoursUntilLesson(scheduledAt);
    return hoursUntil >= RESCHEDULE_POLICY_HOURS;
  };

  const getRefundInfo = (scheduledAt: string, cost: number) => {
    const hoursUntil = getHoursUntilLesson(scheduledAt);
    
    if (hoursUntil >= 24) {
      return { refundAmount: cost, penalty: 0 };
    } else if (hoursUntil >= CANCEL_POLICY_HOURS) {
      const refundAmount = cost * 0.5;
      return { refundAmount, penalty: cost - refundAmount };
    } else {
      return { refundAmount: 0, penalty: cost };
    }
  };

  const cancelLesson = async (lessonId: string, reason: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Get lesson details first
      const { data: lesson, error: fetchError } = await supabase
        .from('lessons')
        .select('scheduled_at, lesson_price, student_id, teacher_id')
        .eq('id', lessonId)
        .single();

      if (fetchError || !lesson) {
        throw new Error('Failed to fetch lesson details');
      }

      if (!canCancel(lesson.scheduled_at)) {
        toast({
          title: 'Cannot Cancel',
          description: `Lessons must be cancelled at least ${CANCEL_POLICY_HOURS} hours in advance`,
          variant: 'destructive'
        });
        return false;
      }

      // Update lesson status
      const { error: updateError } = await supabase
        .from('lessons')
        .update({
          status: 'cancelled',
          cancellation_reason: reason
        })
        .eq('id', lessonId);

      if (updateError) throw updateError;

      // Process refund if applicable
      const refundInfo = getRefundInfo(lesson.scheduled_at, lesson.lesson_price || 0);
      
      toast({
        title: 'Lesson Cancelled',
        description: `Refund: $${refundInfo.refundAmount.toFixed(2)}`,
      });

      return true;
    } catch (error) {
      console.error('Error cancelling lesson:', error);
      toast({
        title: 'Cancellation Failed',
        description: 'Unable to cancel lesson. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rescheduleLesson = async (
    lessonId: string,
    newDateTime: string,
    reason?: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: lesson, error: fetchError } = await supabase
        .from('lessons')
        .select('scheduled_at, reschedule_count')
        .eq('id', lessonId)
        .single();

      if (fetchError || !lesson) {
        throw new Error('Failed to fetch lesson details');
      }

      if (!canReschedule(lesson.scheduled_at)) {
        toast({
          title: 'Cannot Reschedule',
          description: `Lessons must be rescheduled at least ${RESCHEDULE_POLICY_HOURS} hours in advance`,
          variant: 'destructive'
        });
        return false;
      }

      const rescheduleHistory = {
        old_date: lesson.scheduled_at,
        new_date: newDateTime,
        reason: reason || 'Student requested',
        timestamp: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('lessons')
        .update({
          scheduled_at: newDateTime,
          reschedule_count: (lesson.reschedule_count || 0) + 1,
          reschedule_history: supabase.rpc('jsonb_array_append', {
            target: lesson.reschedule_count || [],
            new_value: rescheduleHistory
          })
        })
        .eq('id', lessonId);

      if (updateError) throw updateError;

      toast({
        title: 'Lesson Rescheduled',
        description: `Your lesson has been moved to ${new Date(newDateTime).toLocaleString()}`,
      });

      return true;
    } catch (error) {
      console.error('Error rescheduling lesson:', error);
      toast({
        title: 'Rescheduling Failed',
        description: 'Unable to reschedule lesson. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    cancelLesson,
    rescheduleLesson,
    canCancel,
    canReschedule,
    getRefundInfo
  };
}
