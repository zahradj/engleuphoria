import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Users, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useAutoHideTaskbar } from "@/hooks/useAutoHideTaskbar";

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

  const getSlotClassName = (slot?: ScheduleSlot) => {
    if (!slot || !slot.isAvailable) {
      return "h-8 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors";
    }
    
    if (slot.studentId) {
      return "h-8 border border-red-200 bg-red-100 text-red-800 cursor-pointer transition-colors hover:bg-red-200";
    }
    
    if (slot.lessonType === 'direct_booking') {
      return "h-8 border border-orange-200 bg-orange-100 text-orange-800 cursor-pointer transition-colors hover:bg-orange-200";
    }
    
    return "h-8 border border-green-200 bg-green-100 text-green-800 cursor-pointer transition-colors hover:bg-green-200";
  };

  const renderSlotContent = (slot?: ScheduleSlot) => {
    if (!slot || !slot.isAvailable) {
      return null;
    }

    if (slot.studentId && slot.studentName) {
      return (
        <div className="px-2 py-1 text-xs font-medium">
          <div className="font-semibold">{slot.lessonCode || `#${slot.id?.slice(-6).toUpperCase()}`}</div>
          <div className="text-xs opacity-80">{slot.studentName}</div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <Plus className="h-3 w-3 opacity-60" />
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          
          <div className="flex items-center gap-4">
            <Select
              value={selectedDuration.toString()}
              onValueChange={(value) => setSelectedDuration(Number(value) as 25 | 55)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 min</SelectItem>
                <SelectItem value="55">55 min</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium min-w-[200px] text-center">
                {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-auto">
          <div className="min-w-[800px]">
            {/* Header with days */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-3 bg-gray-50 font-medium text-sm">Time</div>
              {weekDays.map((day, index) => (
                <div key={index} className="p-3 bg-gray-50 text-center">
                  <div className="font-medium text-sm">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {day.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots grid */}
            <div className="divide-y divide-gray-200">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8">
                  <div className="p-3 text-sm font-medium text-gray-600 bg-gray-50 border-r border-gray-200">
                    {time}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const slot = getSlotForTimeAndDate(time, dateStr);
                    
                    return (
                      <div
                        key={`${time}-${dayIndex}`}
                        className={getSlotClassName(slot)}
                        onClick={(e) => handleTimeSlotClick(time, day, e)}
                        title={slot?.isAvailable ? `${time} - ${slot.duration}min` : `Click to open ${selectedDuration}min slot`}
                      >
                        {renderSlotContent(slot)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
              <span>Available to open</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Open for booking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
              <span>Direct booking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span>Booked by student</span>
            </div>
            <div className="text-gray-600 ml-4">
              Tip: Click to toggle slots • Ctrl+Click for direct booking
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};