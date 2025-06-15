
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { lessonService, CreateLessonData } from "@/services/lessonService";

interface ScheduleLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  onLessonScheduled: () => void;
}

export const ScheduleLessonModal = ({
  isOpen,
  onClose,
  teacherId,
  onLessonScheduled
}: ScheduleLessonModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    studentId: '',
    scheduledAt: '',
    duration: 60,
    cost: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const lessonData: CreateLessonData = {
        title: formData.title,
        teacher_id: teacherId,
        student_id: formData.studentId,
        scheduled_at: formData.scheduledAt,
        duration: formData.duration,
        cost: formData.cost
      };

      await lessonService.createLesson(lessonData);
      
      toast({
        title: "Lesson Scheduled",
        description: "The lesson has been successfully scheduled!",
      });

      onLessonScheduled();
      onClose();
      setFormData({
        title: '',
        studentId: '',
        scheduledAt: '',
        duration: 60,
        cost: 10
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule lesson. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., English Conversation Practice"
              required
            />
          </div>

          <div>
            <Label htmlFor="studentId">Student ID</Label>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              placeholder="Enter student UUID"
              required
            />
          </div>

          <div>
            <Label htmlFor="scheduledAt">Date & Time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              min="15"
              max="180"
              required
            />
          </div>

          <div>
            <Label htmlFor="cost">Cost (€)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
              min="0"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Scheduling..." : "Schedule Lesson"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
