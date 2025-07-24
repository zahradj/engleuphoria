import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useAutoHideTaskbar } from "@/hooks/useAutoHideTaskbar";
import { CalendarHeader } from "./CalendarHeader";
import { WeekGrid } from "./WeekGrid";
import { CalendarLegend } from "./CalendarLegend";

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

interface WeeklyScheduleGridProps {
  teacherId: string;
}

export const WeeklyScheduleGrid = ({ teacherId }: WeeklyScheduleGridProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [weeklySlots, setWeeklySlots] = useState<{ [key: string]: ScheduleSlot[] }>({});
  const [selectedDuration, setSelectedDuration] = useState<25 | 55>(25);
  const [isLoading, setIsLoading] = useState(false);
  const { handleCalendarInteraction } = useAutoHideTaskbar();
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate time slots from 6 AM to 10 PM
  const timeSlots = Array.from({ length: 32 }, (_, i) => {
    const totalMinutes = 6 * 60 + i * 30; // Start at 6 AM, 30-minute intervals
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  // Get week days starting from Monday
  const getWeekDays = (date: Date) => {
    const days = [];
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Monday start
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);

  const loadWeeklySlots = async () => {
    if (!teacherId) return;
    
    setIsLoading(true);
    try {
      const startDate = weekDays[0].toISOString().split('T')[0];
      const endDate = weekDays[6].toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('teacher_availability')
        .select(`
          *,
          student:student_id(full_name)
        `)
        .eq('teacher_id', teacherId)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;

      const slotsMap: { [key: string]: ScheduleSlot[] } = {};
      
      weekDays.forEach(day => {
        const dateStr = day.toISOString().split('T')[0];
        slotsMap[dateStr] = [];
      });

      data?.forEach(slot => {
        const dateStr = slot.date;
        if (!slotsMap[dateStr]) slotsMap[dateStr] = [];
        
        slotsMap[dateStr].push({
          id: slot.id,
          time: slot.start_time,
          duration: slot.duration,
          lessonType: slot.lesson_type,
          isAvailable: slot.is_available,
          studentId: slot.student_id,
          lessonTitle: slot.lesson_title,
          studentName: slot.student?.full_name,
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
  }, [currentWeek, teacherId]);

  const handleTimeSlotClick = async (time: string, date: Date, event: React.MouseEvent) => {
    // Trigger calendar interaction auto-hide
    handleCalendarInteraction(true);
    
    // Clear previous timeout and set new one
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      handleCalendarInteraction(false);
    }, 2000);

    const dateStr = date.toISOString().split('T')[0];
    const existingSlot = weeklySlots[dateStr]?.find(slot => slot.time === time);

    if (event.ctrlKey || event.metaKey) {
      // Direct booking mode
      toast({
        title: "Direct Booking",
        description: "Direct booking feature coming soon",
      });
      return;
    }

    try {
      if (existingSlot?.id && existingSlot.isAvailable) {
        // Delete existing slot
        const { error } = await supabase
          .from('teacher_availability')
          .delete()
          .eq('id', existingSlot.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Time slot closed",
        });
      } else {
        // Create new slot
        const [hours, minutes] = time.split(':').map(Number);
        const endTime = `${(hours + Math.floor((minutes + selectedDuration) / 60)).toString().padStart(2, '0')}:${((minutes + selectedDuration) % 60).toString().padStart(2, '0')}`;

        const { error } = await supabase
          .from('teacher_availability')
          .insert({
            teacher_id: teacherId,
            date: dateStr,
            start_time: time,
            end_time: endTime,
            duration: selectedDuration,
            lesson_type: 'free_slot',
            is_available: true
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: `${selectedDuration}-minute slot opened`,
        });
      }

      await loadWeeklySlots();
    } catch (error) {
      console.error('Error toggling slot:', error);
      toast({
        title: "Error",
        description: "Failed to toggle time slot",
        variant: "destructive"
      });
    }
  };

  const getSlotForTimeAndDate = (time: string, dateStr: string): ScheduleSlot | undefined => {
    return weeklySlots[dateStr]?.find(slot => slot.time === time);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <CalendarHeader
          weekDays={weekDays}
          selectedDuration={selectedDuration}
          onDurationChange={setSelectedDuration}
          onNavigateWeek={navigateWeek}
          onTodayClick={goToToday}
        />
        
        <WeekGrid
          weekDays={weekDays}
          timeSlots={timeSlots}
          weeklySlots={weeklySlots}
          selectedDuration={selectedDuration}
          onTimeSlotClick={handleTimeSlotClick}
        />

        <CalendarLegend />
      </CardContent>
    </Card>
  );
};