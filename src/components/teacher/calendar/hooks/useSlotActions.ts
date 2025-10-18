import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface ScheduleSlot {
  id?: string;
  time: string;
  duration: 25 | 55;
  lessonType: 'free_slot' | 'direct_booking';
  isAvailable: boolean;
  studentId?: string;
  lessonTitle?: string;
  studentName?: string;
  lessonCode?: string;
}

export const useSlotActions = (
  teacherId: string, 
  onSlotChange: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);

  const createSlot = async (
    date: Date, 
    time: string, 
    duration: 25 | 55
  ) => {
    setIsLoading(true);
    try {
      const [hours, minutes] = time.split(':').map(Number);
      
      const startDateTime = new Date(date);
      startDateTime.setHours(hours, minutes, 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + duration);

      const { error } = await supabase
        .from('teacher_availability')
        .insert({
          teacher_id: teacherId,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          duration: duration,
          lesson_type: 'free_slot',
          is_available: true
        });

      if (error) throw error;
      
      toast({
        title: "✅ Slot Created",
        description: `${duration}-minute slot opened at ${time}`,
      });

      onSlotChange();
    } catch (error) {
      console.error('Error creating slot:', error);
      toast({
        title: "Error",
        description: "Failed to create time slot",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSlot = async (slot: ScheduleSlot) => {
    if (!slot.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('teacher_availability')
        .delete()
        .eq('id', slot.id);

      if (error) throw error;
      
      toast({
        title: "🗑️ Slot Deleted",
        description: "Time slot closed",
      });

      onSlotChange();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast({
        title: "Error",
        description: "Failed to delete time slot",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBulkSlots = async (
    dates: Date[], 
    times: string[], 
    duration: 25 | 55
  ) => {
    setIsLoading(true);
    try {
      const slots = [];
      
      for (const date of dates) {
        for (const time of times) {
          const [h, m] = time.split(':').map(Number);
          const startDateTime = new Date(date);
          startDateTime.setHours(h, m, 0, 0);
          
          const endDateTime = new Date(startDateTime);
          endDateTime.setMinutes(endDateTime.getMinutes() + duration);

          slots.push({
            teacher_id: teacherId,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            duration,
            lesson_type: 'free_slot',
            is_available: true
          });
        }
      }

      const { error } = await supabase
        .from('teacher_availability')
        .insert(slots);

      if (error) throw error;

      toast({
        title: "✅ Bulk Slots Created",
        description: `Created ${slots.length} slots of ${duration} minutes`,
      });

      onSlotChange();
    } catch (error) {
      console.error('Error creating bulk slots:', error);
      toast({
        title: "Error",
        description: "Failed to create bulk slots",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createSlot,
    deleteSlot,
    createBulkSlots
  };
};