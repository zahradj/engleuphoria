import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useAutoHideTaskbar } from "@/hooks/useAutoHideTaskbar";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarLegend } from "./CalendarLegend";
import { BulkAvailabilityActions } from "./BulkAvailabilityActions";
import { CheckSquare, Square, MousePointer } from "lucide-react";

interface ScheduleSlot {
  id?: string;
  time: string;
  duration: 30 | 60;
  lessonType: 'free_slot' | 'direct_booking';
  isAvailable: boolean;
  studentId?: string;
  lessonTitle?: string;
  studentName?: string;
  lessonCode?: string;
}

interface MultiSelectWeeklyGridProps {
  teacherId: string;
}

export const MultiSelectWeeklyGrid = ({ teacherId }: MultiSelectWeeklyGridProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [weeklySlots, setWeeklySlots] = useState<{ [key: string]: ScheduleSlot[] }>({});
  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
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
        
        // Extract time from start_time timestamp
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
          studentName: undefined, // Will handle student names separately if needed
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

  const generateSlotKey = (time: string, date: Date): string => {
    const dateStr = date.toISOString().split('T')[0];
    return `${dateStr}-${time}`;
  };

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

    const slotKey = generateSlotKey(time, date);
    const dateStr = date.toISOString().split('T')[0];
    const existingSlot = weeklySlots[dateStr]?.find(slot => slot.time === time);

    if (isMultiSelectMode) {
      // Multi-select mode - add/remove from selection
      setSelectedSlots(prev => 
        prev.includes(slotKey) 
          ? prev.filter(key => key !== slotKey)
          : [...prev, slotKey]
      );
      return;
    }

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
        
        // Create proper timestamp for start_time
        const startDateTime = new Date(date);
        startDateTime.setHours(hours, minutes, 0, 0);
        
        // Calculate end time
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + selectedDuration);

        const { insertAvailabilitySlotsWithFallback } = await import("@/services/availabilityInsert");
        await insertAvailabilitySlotsWithFallback(supabase as any, [{
          teacher_id: teacherId,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          duration: selectedDuration,
          lesson_type: 'free_slot',
          is_available: true
        }]);
        
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

  const handleBulkOpen = async (hours: string[]) => {
    const duration = 30;
    setIsLoading(true);
    try {
      const slots = [];
      
      for (const hour of hours) {
        const [h, m] = hour.split(':').map(Number);
        const startDateTime = new Date(currentWeek);
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

      const { insertAvailabilitySlotsWithFallback } = await import("@/services/availabilityInsert");
      await insertAvailabilitySlotsWithFallback(supabase as any, slots);

      toast({
        title: "Success",
        description: `Created ${slots.length} slots of ${duration} minutes`,
      });

      setSelectedSlots([]);
      await loadWeeklySlots();
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

  const handleBulkClose = async () => {
    setIsLoading(true);
    try {
      const startDate = weekDays[0].toISOString();
      const endDate = new Date(weekDays[6]);
      endDate.setDate(endDate.getDate() + 1);
      const endDateStr = endDate.toISOString();

      const { error } = await supabase
        .from('teacher_availability')
        .delete()
        .eq('teacher_id', teacherId)
        .gte('start_time', startDate)
        .lt('start_time', endDateStr)
        .eq('is_available', true);

      if (error) throw error;

      toast({
        title: "Success",
        description: "All available slots closed for this week",
      });

      await loadWeeklySlots();
    } catch (error) {
      console.error('Error closing slots:', error);
      toast({
        title: "Error",
        description: "Failed to close slots",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyFromPrevious = async () => {
    toast({
      title: "Copy Previous",
      description: "Copy from previous day feature coming soon",
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const getSlotStyle = (time: string, date: Date): string => {
    const slotKey = generateSlotKey(time, date);
    const dateStr = date.toISOString().split('T')[0];
    const slot = weeklySlots[dateStr]?.find(s => s.time === time);
    const isSelected = selectedSlots.includes(slotKey);
    
    if (isSelected && isMultiSelectMode) {
      return "bg-primary text-primary-foreground border-primary";
    }
    
    if (slot?.isAvailable) {
      return slot.duration === 60 
        ? "bg-success text-success-foreground border-success"
        : "bg-success/80 text-success-foreground border-success/80";
    }
    
    if (slot?.studentId) {
      return "bg-warning text-warning-foreground border-warning";
    }
    
    return "bg-muted hover:bg-muted/80 border-border";
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CalendarHeader
                weekDays={weekDays}
                onNavigateWeek={navigateWeek}
                onTodayClick={goToToday}
              />
            </div>
            
            <Toggle
              pressed={isMultiSelectMode}
              onPressedChange={setIsMultiSelectMode}
              className="flex items-center gap-2"
            >
              {isMultiSelectMode ? (
                <>
                  <CheckSquare className="h-4 w-4" />
                  Multi-Select ON
                </>
              ) : (
                <>
                  <Square className="h-4 w-4" />
                  Multi-Select OFF
                </>
              )}
            </Toggle>
          </div>

          {isMultiSelectMode && (
            <div className="mb-4 space-y-2">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <MousePointer className="h-4 w-4" />
                  <span>Click to select a slot, click again to unselect. Then use actions below.</span>
                </div>
              </div>
              {selectedSlots.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span>{selectedSlots.length} slot{selectedSlots.length>1?'s':''} selected</span>
                  <Button variant="outline" size="sm" onClick={() => setSelectedSlots([])}>
                    Clear selection
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Week Grid */}
          <div className="grid grid-cols-8 gap-1 mb-6">
            {/* Header row */}
            <div className="p-2 text-center font-medium text-sm">Time</div>
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="p-2 text-center font-medium text-sm">
                <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-xs text-muted-foreground">
                  {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
            
            {/* Time slots */}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="p-2 text-xs text-center text-muted-foreground font-medium">
                  {time}
                </div>
                {weekDays.map((day) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const slot = weeklySlots[dateStr]?.find(s => s.time === time);
                  
                  return (
                    <button
                      key={`${day.toISOString()}-${time}`}
                      onClick={(e) => handleTimeSlotClick(time, day, e)}
                      className={`
                        p-1 text-xs border rounded-md transition-all duration-200 hover:scale-105
                        ${getSlotStyle(time, day)}
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      disabled={isLoading}
                    >
                      {slot?.isAvailable ? (
                        <div className="space-y-1">
                          <div className="font-medium">{slot.duration}min</div>
                          {slot.lessonCode && (
                            <div className="text-xs opacity-80">{slot.lessonCode}</div>
                          )}
                        </div>
                      ) : slot?.studentId ? (
                        <div className="space-y-1">
                          <div className="font-medium">Booked</div>
                          <div className="text-xs opacity-80">{slot.duration}min</div>
                        </div>
                      ) : (
                        <div className="h-8 flex items-center justify-center">
                          <div className="w-2 h-2 bg-current opacity-30 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <CalendarLegend />
        </CardContent>
      </Card>

      <BulkAvailabilityActions
        selectedDate={currentWeek}
        selectedSlots={selectedSlots}
        selectedDuration={selectedDuration}
        onBulkOpen={handleBulkOpen}
        onBulkClose={handleBulkClose}
        onCopyFromPrevious={handleCopyFromPrevious}
        onClearSelection={() => setSelectedSlots([])}
        isLoading={isLoading}
      />
    </div>
  );
};