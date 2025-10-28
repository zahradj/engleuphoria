import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { useCancelReschedule } from '@/hooks/useCancelReschedule';
import { AlertCircle, Calendar as CalendarIcon, Clock, DollarSign } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LessonManagementModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'cancel' | 'reschedule';
  lesson: {
    id: string;
    title: string;
    scheduled_at: string;
    teacher_name: string;
    lesson_price: number;
  };
  onSuccess?: () => void;
}

const CANCELLATION_REASONS = [
  'Schedule conflict',
  'Illness',
  'Family emergency',
  'Technical issues',
  'Other'
];

export function LessonManagementModal({
  open,
  onClose,
  mode,
  lesson,
  onSuccess
}: LessonManagementModalProps) {
  const {
    loading,
    cancelLesson,
    rescheduleLesson,
    canCancel,
    canReschedule,
    getRefundInfo
  } = useCancelReschedule();

  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [newDate, setNewDate] = useState<Date>();
  const [newTime, setNewTime] = useState('');

  const handleSubmit = async () => {
    if (mode === 'cancel') {
      const finalReason = selectedReason === 'Other' ? reason : selectedReason;
      const success = await cancelLesson(lesson.id, finalReason);
      if (success) {
        onSuccess?.();
        onClose();
      }
    } else if (mode === 'reschedule') {
      if (!newDate || !newTime) return;
      
      const [hours, minutes] = newTime.split(':');
      const newDateTime = new Date(newDate);
      newDateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const success = await rescheduleLesson(
        lesson.id,
        newDateTime.toISOString(),
        reason
      );
      if (success) {
        onSuccess?.();
        onClose();
      }
    }
  };

  const refundInfo = getRefundInfo(lesson.scheduled_at, lesson.lesson_price);
  const hoursUntil = (new Date(lesson.scheduled_at).getTime() - new Date().getTime()) / (1000 * 60 * 60);

  const canProceed = mode === 'cancel' 
    ? canCancel(lesson.scheduled_at)
    : canReschedule(lesson.scheduled_at);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === 'cancel' ? 'Cancel Lesson' : 'Reschedule Lesson'}
          </DialogTitle>
          <DialogDescription>
            {lesson.title} with {lesson.teacher_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Lesson Info */}
          <div className="bg-surface-soft p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-text-muted" />
              <span className="text-text">
                {new Date(lesson.scheduled_at).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-text-muted" />
              <span className="text-text">
                {hoursUntil.toFixed(1)} hours until lesson
              </span>
            </div>
          </div>

          {/* Policy Warning */}
          {!canProceed && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {mode === 'cancel' 
                  ? 'Cancellations must be made at least 6 hours in advance for a refund.'
                  : 'Rescheduling must be done at least 4 hours in advance.'}
              </AlertDescription>
            </Alert>
          )}

          {mode === 'cancel' && canProceed && (
            <>
              {/* Refund Info */}
              <div className="bg-success-bg border border-success-border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-success">Refund Amount</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span className="text-lg font-bold text-success">
                      {refundInfo.refundAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                {refundInfo.penalty > 0 && (
                  <p className="text-xs text-success-foreground mt-1">
                    Cancellation fee: ${refundInfo.penalty.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Cancellation Reason */}
              <div className="space-y-2">
                <Label>Reason for Cancellation *</Label>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {CANCELLATION_REASONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedReason === 'Other' && (
                <div className="space-y-2">
                  <Label>Additional Details</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide more details..."
                    rows={3}
                  />
                </div>
              )}
            </>
          )}

          {mode === 'reschedule' && canProceed && (
            <>
              {/* New Date Selection */}
              <div className="space-y-2">
                <Label>Select New Date</Label>
                <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              {/* New Time Selection */}
              <div className="space-y-2">
                <Label>Select New Time</Label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md"
                />
              </div>

              {/* Optional Reason */}
              <div className="space-y-2">
                <Label>Reason (Optional)</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you rescheduling?"
                  rows={2}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !canProceed || 
              loading || 
              (mode === 'cancel' && !selectedReason) ||
              (mode === 'reschedule' && (!newDate || !newTime))
            }
            variant={mode === 'cancel' ? 'destructive' : 'default'}
          >
            {loading ? 'Processing...' : mode === 'cancel' ? 'Confirm Cancellation' : 'Confirm Reschedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
