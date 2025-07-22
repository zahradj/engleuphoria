import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { lessonService } from "@/services/lessonService";
import { useToast } from "@/hooks/use-toast";

interface LessonCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    id: string;
    title: string;
    scheduled_at: string;
    student_name?: string;
    teacher_name?: string;
  };
  userRole: 'teacher' | 'student';
  onComplete?: () => void;
}

export function LessonCompletionModal({
  isOpen,
  onClose,
  lesson,
  userRole,
  onComplete
}: LessonCompletionModalProps) {
  const [status, setStatus] = useState<'completed' | 'cancelled'>('completed');
  const [failureReason, setFailureReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const failureReasons = [
    { value: 'teacher_absent', label: 'Teacher No-Show', description: 'Teacher did not join the lesson' },
    { value: 'technical_problem', label: 'Technical Issues', description: 'Internet, audio, or camera problems from teacher' },
    { value: 'student_cancelled', label: 'Student Cancellation', description: 'Student cancelled or did not show up' },
    { value: 'mutual_agreement', label: 'Mutual Agreement', description: 'Both parties agreed to cancel' }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const reason = status === 'cancelled' ? (failureReason === 'other' ? customReason : failureReason) : undefined;
      
      const result = await lessonService.processLessonCompletion(lesson.id, status, reason);
      
      toast({
        title: "Lesson Status Updated",
        description: status === 'completed' 
          ? `Student charged €${result.student_charged}, teacher paid €${result.teacher_paid}` 
          : `No charges applied. ${reason ? `Reason: ${reason}` : ''}`,
        variant: status === 'completed' ? "default" : "destructive",
      });

      onComplete?.();
      onClose();
    } catch (error) {
      console.error('Error processing lesson completion:', error);
      toast({
        title: "Error",
        description: "Failed to process lesson completion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPaymentInfo = () => {
    if (status === 'completed') {
      return (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-green-800">Payment Processing</h4>
          </div>
          <div className="space-y-1 text-sm text-green-700">
            <p>• Student will be charged: €10</p>
            <p>• Teacher will receive: €4</p>
            <p>• Platform fee: €6</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-800">No Charges Applied</h4>
          </div>
          <div className="space-y-1 text-sm text-blue-700">
            <p>• Student will not be charged</p>
            <p>• Teacher will not be paid</p>
            <p>• Free reschedule or refund available</p>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Complete Lesson
          </DialogTitle>
          <DialogDescription>
            Mark the lesson status and process payment for: <strong>{lesson.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lesson Details */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{lesson.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(lesson.scheduled_at).toLocaleString()}
                </p>
                {lesson.student_name && lesson.teacher_name && (
                  <p className="text-sm text-muted-foreground">
                    {lesson.teacher_name} → {lesson.student_name}
                  </p>
                )}
              </div>
              <Badge variant="outline">25 min lesson</Badge>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Lesson Status</Label>
            <RadioGroup value={status} onValueChange={(value) => setStatus(value as 'completed' | 'cancelled')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Completed Successfully
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cancelled" id="cancelled" />
                <Label htmlFor="cancelled" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Cancelled/Failed
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Failure Reason Selection */}
          {status === 'cancelled' && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Reason for Cancellation</Label>
              <RadioGroup value={failureReason} onValueChange={setFailureReason}>
                {failureReasons.map((reason) => (
                  <div key={reason.value} className="flex items-start space-x-2">
                    <RadioGroupItem value={reason.value} id={reason.value} />
                    <div className="flex-1">
                      <Label htmlFor={reason.value} className="font-medium">
                        {reason.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{reason.description}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <div className="flex-1">
                    <Label htmlFor="other" className="font-medium">Other</Label>
                    {failureReason === 'other' && (
                      <Textarea
                        placeholder="Please specify the reason..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Payment Information */}
          {getPaymentInfo()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || (status === 'cancelled' && !failureReason)}
          >
            {loading ? 'Processing...' : 'Complete Lesson'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}