import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock } from "lucide-react";

interface QuickSetupModalProps {
  teacherId: string;
  onSlotsCreated: () => void;
  children: React.ReactNode;
}

export const QuickSetupModal = ({ teacherId, onSlotsCreated, children }: QuickSetupModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [duration, setDuration] = useState<25 | 55>(25);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const daysOfWeek = [
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 6, label: "Saturday" },
    { id: 0, label: "Sunday" }
  ];

  const handleDayToggle = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const createBulkSlots = async () => {
    if (selectedDays.length === 0) {
      toast({
        title: "Select Days",
        description: "Please select at least one day of the week.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const slots = [];
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Create slots for the next 4 weeks
      for (let week = 0; week < 4; week++) {
        const weekStart = new Date(nextWeek.getTime() + week * 7 * 24 * 60 * 60 * 1000);
        const mondayOfWeek = new Date(weekStart);
        mondayOfWeek.setDate(mondayOfWeek.getDate() - mondayOfWeek.getDay() + 1);

        selectedDays.forEach(dayOfWeek => {
          const slotDate = new Date(mondayOfWeek);
          slotDate.setDate(mondayOfWeek.getDate() + (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

          // Generate time slots between start and end time
          const [startHour, startMin] = startTime.split(':').map(Number);
          const [endHour, endMin] = endTime.split(':').map(Number);
          
          let currentTime = new Date(slotDate);
          currentTime.setHours(startHour, startMin, 0, 0);
          
          const endDateTime = new Date(slotDate);
          endDateTime.setHours(endHour, endMin, 0, 0);

          while (currentTime < endDateTime) {
            const slotEnd = new Date(currentTime);
            slotEnd.setMinutes(slotEnd.getMinutes() + duration);

            if (slotEnd <= endDateTime) {
              slots.push({
                teacher_id: teacherId,
                start_time: currentTime.toISOString(),
                end_time: slotEnd.toISOString(),
                duration: duration,
                lesson_type: 'free_slot',
                is_available: true,
                is_booked: false
              });
            }

            currentTime.setMinutes(currentTime.getMinutes() + 30); // 30-minute intervals
          }
        });
      }

      const { error } = await supabase
        .from('teacher_availability')
        .insert(slots);

      if (error) throw error;

      toast({
        title: "Slots Created",
        description: `Successfully created ${slots.length} availability slots for the next 4 weeks.`,
      });

      setIsOpen(false);
      onSlotsCreated();
      
      // Reset form
      setSelectedDays([]);
      setStartTime("09:00");
      setEndTime("17:00");
      setDuration(25);
      
    } catch (error) {
      console.error('Error creating bulk slots:', error);
      toast({
        title: "Error",
        description: "Failed to create slots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quick Availability Setup
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Select Days</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {daysOfWeek.map(day => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.id}`}
                    checked={selectedDays.includes(day.id)}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <Label htmlFor={`day-${day.id}`} className="text-sm">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start-time" className="text-sm font-medium">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="end-time" className="text-sm font-medium">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Lesson Duration</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value) as 25 | 55)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 minutes</SelectItem>
                <SelectItem value="55">55 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Button 
                onClick={createBulkSlots} 
                disabled={isCreating || selectedDays.length === 0}
                className="flex-1"
              >
                <Clock className="h-4 w-4 mr-2" />
                {isCreating ? "Creating..." : "Create Slots"}
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};