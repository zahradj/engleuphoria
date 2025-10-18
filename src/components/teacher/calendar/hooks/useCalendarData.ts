import { useState, useEffect } from "react";
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

export const useCalendarData = (teacherId: string, weekDays: Date[]) => {
  const [weeklySlots, setWeeklySlots] = useState<{ [key: string]: ScheduleSlot[] }>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadWeeklySlots = async () => {
    if (!teacherId || weekDays.length === 0) return;
    
    setIsLoading(true);
    try {
      const startDate = weekDays[0].toISOString();
      const endDate = new Date(weekDays[6]);
      endDate.setDate(endDate.getDate() + 1);
      const endDateStr = endDate.toISOString();
      
      const { data, error } = await supabase
        .from('teacher_availability')
        .select('*')
        .eq('teacher_id', teacherId)
        .gte('start_time', startDate)
        .lt('start_time', endDateStr);

      if (error) throw error;

      const slotsMap: { [key: string]: ScheduleSlot[] } = {};
      
      weekDays.forEach(day => {
        const dateStr = day.toISOString().split('T')[0];
        slotsMap[dateStr] = [];
      });

      data?.forEach(slot => {
        const slotDate = new Date(slot.start_time);
        const dateStr = slotDate.toISOString().split('T')[0];
        if (!slotsMap[dateStr]) slotsMap[dateStr] = [];
        
        const timeStr = slotDate.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        slotsMap[dateStr].push({
          id: slot.id,
          time: timeStr,
          duration: slot.duration,
          lessonType: slot.lesson_type,
          isAvailable: slot.is_available,
          studentId: slot.student_id,
          lessonTitle: slot.lesson_title,
          studentName: undefined,
          lessonCode: slot.lesson_id ? `#${slot.lesson_id.slice(-6).toUpperCase()}` : undefined
        });
      });

      setWeeklySlots(slotsMap);
    } catch (error) {
      console.error('Error loading weekly slots:', error);
      toast({
        title: "Error",
        description: "Failed to load weekly schedule",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeeklySlots();
  }, [teacherId, weekDays]);

  return {
    weeklySlots,
    isLoading,
    reloadSlots: loadWeeklySlots
  };
};