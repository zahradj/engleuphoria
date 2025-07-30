import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Repeat, CalendarPlus, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface TimeSlotActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  time: string;
  teacherId: string;
  selectedDuration: 30 | 60;
  onSlotCreated: () => void;
}

export const TimeSlotActionModal = ({
  isOpen,
  onClose,
  date,
  time,
  teacherId,
  selectedDuration,
  onSlotCreated
}: TimeSlotActionModalProps) => {
  const [slotType, setSlotType] = useState<'single' | 'weekly'>('single');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const formatTime12Hour = (time24: string) => {
    if (!time24 || typeof time24 !== 'string') {
      return '12:00 AM'; // Default fallback
    }
    
    const timeParts = time24.split(':');
    if (timeParts.length < 2) {
      return '12:00 AM'; // Default fallback for invalid format
    }
    
    const hours = parseInt(timeParts[0], 10) || 0;
    const minutes = parseInt(timeParts[1], 10) || 0;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const createSlots = async () => {
    if (!time || typeof time !== 'string') {
      toast({
        title: "Invalid Time",
        description: "Please select a valid time slot.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const timeParts = time.split(':');
      if (timeParts.length < 2) {
        throw new Error('Invalid time format');
      }
      
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error('Invalid time values');
      }
      
      const slots = [];

      if (slotType === 'single') {
        // Create single slot
        const startDateTime = new Date(date);
        startDateTime.setHours(hours, minutes, 0, 0);
        
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + selectedDuration);

        slots.push({
          teacher_id: teacherId,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          duration: selectedDuration,
          lesson_type: 'free_slot',
          is_available: true,
          is_booked: false
        });
      } else {
        // Create weekly recurring slots for next 4 weeks
        const dayOfWeek = date.getDay();
        const today = new Date();
        
        for (let week = 0; week < 4; week++) {
          const slotDate = new Date(date);
          slotDate.setDate(date.getDate() + (week * 7));
          
          // Skip past dates
          if (slotDate < today) continue;
          
          const startDateTime = new Date(slotDate);
          startDateTime.setHours(hours, minutes, 0, 0);
          
          const endDateTime = new Date(startDateTime);
          endDateTime.setMinutes(endDateTime.getMinutes() + selectedDuration);

          slots.push({
            teacher_id: teacherId,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            duration: selectedDuration,
            lesson_type: 'free_slot',
            is_available: true,
            is_booked: false
          });
        }
      }

      const { error } = await supabase
        .from('teacher_availability')
        .insert(slots);

      if (error) {
        throw error;
      }

      const slotCount = slots.length;
      const typeText = slotType === 'single' ? 'slot' : `weekly slots (${slotCount} total)`;
      
      toast({
        title: "✅ Availability Created!",
        description: `${typeText.charAt(0).toUpperCase() + typeText.slice(1)} created at ${formatTime12Hour(time)} for ${selectedDuration} minutes.`,
      });

      onSlotCreated();
      onClose();
    } catch (error) {
      console.error('Error creating slots:', error);
      toast({
        title: "Error",
        description: "Failed to create availability slots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      onClose();
      setSlotType('single');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            🗓️ Click & Set Your Availability
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header message */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Just one click to control your schedule!
            </p>
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium">
                You clicked: <span className="text-primary">{format(date, 'EEEE')}</span>, <span className="text-primary">{format(date, 'MMM d')}</span> at <span className="text-primary">{formatTime12Hour(time)}</span>
              </p>
            </div>
          </div>

          {/* Options */}
          <div>
            <p className="text-sm font-medium mb-3">What would you like to do?</p>
            <RadioGroup value={slotType} onValueChange={(value) => setSlotType(value as 'single' | 'weekly')}>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <RadioGroupItem value="single" id="single" className="mt-1" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="single" className="flex items-center gap-2 font-medium cursor-pointer">
                      <CalendarPlus className="h-4 w-4" />
                      🔘 Create Single Slot
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Open this time for booking once
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <RadioGroupItem value="weekly" id="weekly" className="mt-1" />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="weekly" className="flex items-center gap-2 font-medium cursor-pointer">
                      <Repeat className="h-4 w-4" />
                      🔁 Create Weekly Slot
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Repeat this slot every week (next 4 weeks)
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Preview */}
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 text-success-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Preview:</span>
            </div>
            <p className="text-sm text-success-foreground/80 mt-1">
              {slotType === 'single' 
                ? `Single ${selectedDuration}-minute slot on ${format(date, 'MMM d')} at ${formatTime12Hour(time)}`
                : `Weekly ${selectedDuration}-minute slots every ${format(date, 'EEEE')} at ${formatTime12Hour(time)} for 4 weeks`
              }
            </p>
          </div>

          {/* Info tips */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>✅ Your availability will instantly appear in the calendar.</p>
            <p>❌ To remove a slot later, just click it again and choose Delete Slot.</p>
          </div>

          {/* Smart tip */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-2">
              <div className="text-primary">🧠</div>
              <div>
                <p className="text-sm font-medium text-primary">Smart Tip:</p>
                <p className="text-xs text-primary/80">
                  Students can only see and book the slots you open. Keep control of your time with a few quick clicks!
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              onClick={createSlots} 
              disabled={isCreating}
              className="flex-1"
              size="lg"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Create {slotType === 'single' ? 'Slot' : 'Weekly Slots'}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClose} disabled={isCreating}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};