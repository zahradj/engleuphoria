import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle, Clock, Calendar, User, PlayCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface TimeSlot {
  id?: string;
  time: string;
  duration: number;
  isAvailable: boolean;
  isBooked: boolean;
  lessonId?: string;
  lessonTitle?: string;
  studentName?: string;
  studentId?: string;
  slotType: 'available' | 'booked' | 'lesson' | 'blocked';
}

interface SlotManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  time: string;
  slot: TimeSlot;
  onSlotDeleted: () => void;
  onJoinLesson?: (slot: TimeSlot) => void;
}

export const SlotManagementModal = ({
  isOpen,
  onClose,
  date,
  time,
  slot,
  onSlotDeleted,
  onJoinLesson
}: SlotManagementModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getSlotTypeInfo = () => {
    switch (slot.slotType) {
      case 'lesson':
        return {
          icon: <PlayCircle className="h-5 w-5 text-primary" />,
          title: "Scheduled Lesson",
          description: "This is a confirmed lesson with a student",
          color: "primary",
          canDelete: false
        };
      case 'booked':
        return {
          icon: <User className="h-5 w-5 text-blue-600" />,
          title: "Booked Slot",
          description: "This slot has been booked by a student",
          color: "secondary",
          canDelete: false
        };
      case 'available':
        return {
          icon: <Clock className="h-5 w-5 text-success" />,
          title: "Available Slot",
          description: "Students can book this time slot",
          color: "success",
          canDelete: true
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-muted-foreground" />,
          title: "Time Slot",
          description: "Calendar time slot",
          color: "secondary",
          canDelete: true
        };
    }
  };

  const deleteSlot = async () => {
    if (!slot.id) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('teacher_availability')
        .delete()
        .eq('id', slot.id);

      if (error) {
        if (error.message.includes('maintain at least')) {
          toast({
            title: "❌ Cannot Delete Slot",
            description: "You need to maintain at least 5 available slots per week. Add more slots before removing this one.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "🗑️ Slot Deleted",
        description: `Availability slot at ${formatTime12Hour(time)} has been removed.`,
      });

      onSlotDeleted();
      onClose();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast({
        title: "Error",
        description: "Failed to delete slot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleJoinLesson = () => {
    if (onJoinLesson) {
      onJoinLesson(slot);
      onClose();
    }
  };

  const slotInfo = getSlotTypeInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {slotInfo.icon}
            Manage Time Slot
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Slot details */}
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Time Slot Details</span>
                <Badge variant={slotInfo.color as any}>
                  {slotInfo.title}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime12Hour(time)} ({slot.duration} minutes)</span>
                </div>
                
                {slot.slotType === 'lesson' && slot.lessonTitle && (
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{slot.lessonTitle}</span>
                  </div>
                )}
                
                {slot.studentName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Student: {slot.studentName}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {slotInfo.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Join lesson button for lessons */}
            {slot.slotType === 'lesson' && onJoinLesson && (
              <Button 
                onClick={handleJoinLesson}
                className="w-full"
                size="lg"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Join Lesson
              </Button>
            )}

            {/* Delete button for available slots */}
            {slotInfo.canDelete && (
              <div className="space-y-3">
                {slot.slotType === 'available' && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive">Delete Availability Slot</p>
                      <p className="text-destructive/80">
                        This will remove your availability for this time. Students will no longer be able to book this slot.
                      </p>
                    </div>
                  </div>
                )}
                
                <Button 
                  variant="destructive" 
                  onClick={deleteSlot}
                  disabled={isDeleting}
                  className="w-full"
                  size="lg"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive-foreground mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Slot
                    </>
                  )}
                </Button>
              </div>
            )}

            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};