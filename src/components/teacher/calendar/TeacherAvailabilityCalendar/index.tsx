import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { batchAvailabilityService } from "@/services/batchAvailabilityService";
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Clock, User } from "lucide-react";
import { SlotTypeSelector } from "./SlotTypeSelector";
import { RecurringSlotPanel } from "./RecurringSlotPanel";
import { CalendarLegend } from "./CalendarLegend";
import { TimeSlot, SelectedSlot, WeeklySlots } from "./types";
import { 
  generateTimeSlots, 
  getWeekDates, 
  formatDate, 
  formatWeekRange,
  isPastSlot,
  getDayName,
  getDayDate
} from "./utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TeacherAvailabilityCalendarProps {
  teacherId: string;
}

export const TeacherAvailabilityCalendar = ({ teacherId }: TeacherAvailabilityCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [weeklySlots, setWeeklySlots] = useState<WeeklySlots>({});
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [duration, setDuration] = useState<30 | 60>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [slotType, setSlotType] = useState<'one-time' | 'weekly-recurring'>('one-time');
  const [numberOfWeeks, setNumberOfWeeks] = useState(4);
  const { toast } = useToast();

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    const dates = getWeekDates(currentDate);
    setWeekDates(dates);
  }, [currentDate]);

  useEffect(() => {
    if (weekDates.length > 0 && teacherId) {
      loadWeeklyData();
    }
  }, [weekDates, teacherId]);

  const loadWeeklyData = async () => {
    console.log('🔄 Loading weekly data...', {
      dateRange: `${weekDates[0]?.toISOString()} to ${weekDates[6]?.toISOString()}`,
      teacherId
    });
    
    setIsLoading(true);
    try {
      const startDate = weekDates[0];
      const endDate = new Date(weekDates[6]);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('teacher_availability')
        .select(`
          *,
          student:users!teacher_availability_student_id_fkey(
            id,
            full_name,
            student_profiles(cefr_level)
          )
        `)
        .eq('teacher_id', teacherId)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        console.error('❌ Error loading calendar data:', error);
        toast({
          title: "Error Loading Calendar",
          description: error.message || "Failed to load availability slots",
          variant: "destructive"
        });
        throw error;
      }

      console.log('📊 Fetched slots from database:', {
        totalSlots: data?.length || 0,
        availableSlots: data?.filter(s => s.is_available && !s.is_booked).length || 0,
        bookedSlots: data?.filter(s => s.is_booked).length || 0
      });

      const slotsMap: WeeklySlots = {};
      
      weekDates.forEach(date => {
        const dateKey = formatDate(date);
        slotsMap[dateKey] = [];
      });

      data?.forEach(slot => {
        const slotDate = new Date(slot.start_time);
        const dateKey = formatDate(slotDate);
        const time = slotDate.toTimeString().substring(0, 5);

        if (slotsMap[dateKey]) {
          slotsMap[dateKey].push({
            id: slot.id,
            time,
            date: slotDate,
            dateKey,
            slotKey: `${dateKey}-${time}`,
            isAvailable: slot.is_available && !slot.is_booked,
            isBooked: slot.is_booked,
            isPast: isPastSlot(slotDate, time),
            duration: slot.duration,
            studentName: (slot.student as any)?.full_name || slot.student_name,
            studentId: slot.student_id,
            studentLevel: (slot.student as any)?.student_profiles?.[0]?.cefr_level,
            lessonTitle: slot.lesson_title
          });
        }
      });

      console.log('✅ Slots map constructed:', {
        totalDays: Object.keys(slotsMap).length,
        slotsPerDay: Object.entries(slotsMap).map(([date, slots]) => ({
          date,
          count: slots.length,
          available: slots.filter(s => s.isAvailable).length
        }))
      });

      setWeeklySlots(slotsMap);
    } catch (error) {
      console.error('❌ Error loading weekly data:', error);
      toast({
        title: "Error",
        description: "Failed to load availability data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
    setSelectedSlots([]);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
    setSelectedSlots([]);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedSlots([]);
  };

  const isSlotSelected = (slotKey: string): boolean => {
    return selectedSlots.some(s => s.slotKey === slotKey);
  };

  const getSlotAtPosition = (dateKey: string, time: string): TimeSlot | undefined => {
    return weeklySlots[dateKey]?.find(s => s.time === time);
  };

  const toggleSlotSelection = (dateKey: string, time: string) => {
    const slotKey = `${dateKey}-${time}`;
    const existingSlot = getSlotAtPosition(dateKey, time);
    
    if (existingSlot?.isBooked || existingSlot?.isPast) return;
    if (existingSlot?.isAvailable) return;

    setSelectedSlots(prev => {
      const isSelected = prev.some(s => s.slotKey === slotKey);
      if (isSelected) {
        return prev.filter(s => s.slotKey !== slotKey);
      } else {
        return [...prev, { dateKey, time, slotKey }];
      }
    });
  };

  const handleSlotMouseDown = (dateKey: string, time: string) => {
    if (!isMultiSelectMode) return;
    setIsDragging(true);
    toggleSlotSelection(dateKey, time);
  };

  const handleSlotMouseEnter = (dateKey: string, time: string) => {
    if (!isMultiSelectMode || !isDragging) return;
    const existingSlot = getSlotAtPosition(dateKey, time);
    if (existingSlot?.isBooked || existingSlot?.isPast || existingSlot?.isAvailable) return;
    
    const slotKey = `${dateKey}-${time}`;
    if (!isSlotSelected(slotKey)) {
      setSelectedSlots(prev => [...prev, { dateKey, time, slotKey }]);
    }
  };

  const handleSlotMouseUp = () => {
    setIsDragging(false);
  };

  const handleSlotClick = (dateKey: string, time: string) => {
    if (isMultiSelectMode) return;
    
    const existingSlot = getSlotAtPosition(dateKey, time);
    if (!existingSlot || existingSlot.isPast || existingSlot.isBooked) return;

    if (existingSlot.isAvailable && existingSlot.id) {
      handleDeleteSlot(existingSlot.id);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('teacher_availability')
        .delete()
        .eq('id', slotId)
        .eq('teacher_id', teacherId);

      if (error) throw error;

      toast({
        title: "Slot deleted",
        description: "Availability slot removed successfully"
      });

      loadWeeklyData();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast({
        title: "Error",
        description: "Failed to delete slot",
        variant: "destructive"
      });
    }
  };

  const selectTimeRange = (startHour: number, endHour: number) => {
    const slots: SelectedSlot[] = [];
    
    weekDates.forEach(date => {
      const dateKey = formatDate(date);
      timeSlots.forEach(time => {
        const hour = parseInt(time.split(':')[0]);
        if (hour >= startHour && hour < endHour) {
          const existingSlot = getSlotAtPosition(dateKey, time);
          if (!existingSlot || (!existingSlot.isAvailable && !existingSlot.isBooked && !existingSlot.isPast)) {
            const slotKey = `${dateKey}-${time}`;
            slots.push({ dateKey, time, slotKey });
          }
        }
      });
    });
    
    setSelectedSlots(slots);
    if (slots.length > 0) {
      toast({
        title: "Selection Updated",
        description: `Selected ${slots.length} empty slots`
      });
    }
  };

  const handleCreateSlots = async () => {
    if (selectedSlots.length === 0) return;
    
    // Pre-flight authentication check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create availability slots.",
        variant: "destructive"
      });
      return;
    }
    
    if (user.id !== teacherId) {
      toast({
        title: "Permission Error",
        description: "You can only create slots for your own calendar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (slotType === 'weekly-recurring') {
        // Weekly recurring mode - create slots for multiple weeks
        const dayTimeMap = new Map<number, string[]>();
        
        selectedSlots.forEach(slot => {
          const date = weekDates.find(d => formatDate(d) === slot.dateKey);
          if (date) {
            const dayOfWeek = date.getDay();
            if (!dayTimeMap.has(dayOfWeek)) {
              dayTimeMap.set(dayOfWeek, []);
            }
            if (!dayTimeMap.get(dayOfWeek)!.includes(slot.time)) {
              dayTimeMap.get(dayOfWeek)!.push(slot.time);
            }
          }
        });

        console.log('🔍 Creating recurring slots:', {
          teacherId,
          userId: user.id,
          numberOfWeeks,
          duration,
          dayTimeMap: Array.from(dayTimeMap.entries())
        });

        await batchAvailabilityService.createRecurringWeeklySlots(
          teacherId,
          dayTimeMap,
          weekDates[0],
          numberOfWeeks,
          duration
        );

        const totalSlotsCreated = selectedSlots.length * numberOfWeeks;
        toast({
          title: "✅ Recurring Slots Created",
          description: `${totalSlotsCreated} slots created for ${numberOfWeeks} weeks`
        });
      } else {
        // One-time mode - existing behavior
        const dates = [...new Set(selectedSlots.map(s => {
          const date = weekDates.find(d => formatDate(d) === s.dateKey);
          return date;
        }))].filter(Boolean) as Date[];

        const times = [...new Set(selectedSlots.map(s => s.time))];

        console.log('🔍 Creating one-time slots:', {
          teacherId,
          userId: user.id,
          selectedSlotsCount: selectedSlots.length,
          duration,
          dates: dates.map(d => d.toISOString()),
          times
        });

        await batchAvailabilityService.createBatchSlots(
          teacherId,
          dates,
          times,
          duration
        );

        toast({
          title: "✅ Slots Created",
          description: `${selectedSlots.length} slots created`
        });
      }

      console.log('✅ Slots created successfully in database');

      // Clear state BEFORE reloading
      setSelectedSlots([]);
      setShowConfirmDialog(false);

      // Wait 150ms to ensure database commit
      await new Promise(resolve => setTimeout(resolve, 150));

      console.log('🔄 Reloading calendar data...');
      
      // Reload the calendar
      await loadWeeklyData();

      console.log('✨ Calendar refresh complete');

      toast({
        title: "Calendar Updated",
        description: "Your availability is now visible"
      });
    } catch (error: any) {
      console.error('❌ Error creating slots:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      let errorMessage = "Failed to create slots";
      
      if (error.code === '42501') {
        errorMessage = "Permission denied. Please check your teacher account status.";
      } else if (error.code === '23505') {
        errorMessage = "Some slots already exist and were skipped.";
      } else if (error.code === '23502') {
        errorMessage = "Required data missing. Please try again.";
      } else if (error.code === '23514') {
        errorMessage = "Allowed durations are 30 or 60 minutes. Please switch the duration and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error Creating Slots",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeBlockColor = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    // Peak teaching hours (evening) - light orange/peach
    if (hour >= 18 && hour < 22) return "bg-orange-50 dark:bg-orange-950/20";
    // Weekend mornings - light blue
    if (hour >= 7 && hour < 10) return "bg-blue-50 dark:bg-blue-950/20";
    return "";
  };

  const renderSlot = (date: Date, time: string) => {
    const dateKey = formatDate(date);
    const slotKey = `${dateKey}-${time}`;
    const slot = getSlotAtPosition(dateKey, time);
    const isSelected = isSlotSelected(slotKey);
    const past = isPastSlot(date, time);
    const blockColor = getTimeBlockColor(time);

    if (slot?.isBooked) {
      return (
        <div className="h-16 rounded-md border-2 border-purple-300 dark:border-purple-700 bg-purple-100 dark:bg-purple-950/30 p-1.5 text-xs shadow-sm">
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-purple-500/20 text-purple-700">BOOKED</Badge>
          </div>
          {slot.studentName && (
            <div className="flex items-center gap-1 mb-0.5">
              <User className="h-3 w-3 text-muted-foreground" />
              <div className="text-[10px] font-semibold truncate text-foreground">{slot.studentName}</div>
            </div>
          )}
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
            {slot.studentId && <span className="font-mono">ID: {slot.studentId.slice(0, 8)}</span>}
            {slot.studentLevel && (
              <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 border-purple-400">
                {slot.studentLevel}
              </Badge>
            )}
          </div>
          {slot.lessonTitle && (
            <div className="text-[9px] text-muted-foreground truncate mt-0.5">{slot.lessonTitle}</div>
          )}
        </div>
      );
    }

    if (slot?.isAvailable) {
      return (
        <button
          onClick={() => handleSlotClick(dateKey, time)}
          className="h-16 w-full rounded-md border-2 border-yellow-400 dark:border-yellow-600 bg-yellow-100 dark:bg-yellow-950/30 p-1.5 text-xs hover:bg-yellow-200 dark:hover:bg-yellow-950/40 transition-all shadow-sm group relative"
        >
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-yellow-500/50 bg-yellow-500/10 text-yellow-700">OPEN</Badge>
          </div>
          <div className="text-[10px] font-medium text-yellow-700 dark:text-yellow-300">{slot.duration} min</div>
          <Trash2 className="h-3 w-3 absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-destructive transition-opacity" />
        </button>
      );
    }

    if (past) {
      return <div className="h-16 rounded-md border border-muted/20 bg-muted/10" />;
    }

    return (
      <button
        onMouseDown={() => handleSlotMouseDown(dateKey, time)}
        onMouseEnter={() => handleSlotMouseEnter(dateKey, time)}
        onMouseUp={handleSlotMouseUp}
        onClick={() => !isMultiSelectMode && toggleSlotSelection(dateKey, time)}
        disabled={!isMultiSelectMode && isSelected}
        className={`h-16 w-full rounded-md border-2 transition-all bg-sky-50 dark:bg-sky-950/20 ${
          isSelected
            ? 'border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/30 shadow-sm'
            : 'border-dashed border-sky-200 dark:border-sky-800 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-950/20'
        } ${isMultiSelectMode ? 'cursor-crosshair' : 'cursor-pointer'}`}
      >
        {isSelected ? (
          <Check className="h-4 w-4 mx-auto text-violet-600 dark:text-violet-400" />
        ) : (
          <Plus className="h-4 w-4 mx-auto opacity-0 hover:opacity-40 transition-opacity text-muted-foreground" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4" onMouseUp={handleSlotMouseUp}>
      {/* Legend */}
      <CalendarLegend />

      {/* Slot Type Selector */}
      <div className="flex justify-center">
        <SlotTypeSelector slotType={slotType} onTypeChange={setSlotType} />
      </div>

      {/* Recurring Slot Panel */}
      {slotType === 'weekly-recurring' && (
        <RecurringSlotPanel
          numberOfWeeks={numberOfWeeks}
          onWeeksChange={setNumberOfWeeks}
          selectedSlots={selectedSlots}
        />
      )}

      {/* Navigation & Controls */}
      <Card className="p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek} className="rounded-full bg-amber-500 hover:bg-amber-600 text-white border-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek} className="rounded-full bg-amber-500 hover:bg-amber-600 text-white border-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="font-bold text-base min-w-[220px] text-center px-4">
              {formatWeekRange(weekDates)}
            </span>
            <Button variant="outline" size="sm" onClick={handleToday} className="font-medium">
              Today
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Duration:</span>
            <Button
              variant={duration === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => setDuration(30)}
            >
              30 min
            </Button>
            <Button
              variant={duration === 60 ? "default" : "outline"}
              size="sm"
              onClick={() => setDuration(60)}
            >
              60 min
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={isMultiSelectMode ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIsMultiSelectMode(!isMultiSelectMode);
                if (isMultiSelectMode) setSelectedSlots([]);
              }}
            >
              Multi-Select: {isMultiSelectMode ? "ON" : "OFF"}
            </Button>
            
            {isMultiSelectMode && (
              <>
                <Button variant="outline" size="sm" onClick={() => selectTimeRange(9, 12)}>
                  Morning (9-12)
                </Button>
                <Button variant="outline" size="sm" onClick={() => selectTimeRange(13, 17)}>
                  Afternoon (13-17)
                </Button>
                <Button variant="outline" size="sm" onClick={() => selectTimeRange(18, 21)}>
                  Evening (18-21)
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedSlots([])}>
                  Clear
                </Button>
              </>
            )}
          </div>

          {selectedSlots.length > 0 && (
            <Button
              size="lg"
              onClick={() => setShowConfirmDialog(true)}
              disabled={isLoading}
              className="font-semibold"
            >
              <Clock className="h-4 w-4 mr-2" />
              Create {selectedSlots.length} Slot{selectedSlots.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      </Card>

      {/* Weekly Grid */}
      <Card className="p-3 overflow-x-auto shadow-sm border-muted/30 bg-sky-50 dark:bg-sky-950/10">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="min-w-[900px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-2 mb-3 pb-2 border-b-2 border-border">
              <div className="text-xs font-bold text-muted-foreground uppercase">Time</div>
              {weekDates.map(date => (
                <div key={formatDate(date)} className="text-center bg-muted/30 rounded-md p-2">
                  <div className="text-sm font-bold text-foreground">{getDayName(date)}, {getDayDate(date).split(' ')[1]}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">{getDayDate(date).split(' ')[0]}</div>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-1.5">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 gap-2">
                  <div className="text-xs text-muted-foreground font-semibold flex items-center justify-end pr-2">
                    {time}
                  </div>
                  {weekDates.map(date => (
                    <div key={`${formatDate(date)}-${time}`} className="relative">
                      {renderSlot(date, time)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Availability Slots</AlertDialogTitle>
            <AlertDialogDescription>
              Create {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} of {duration} minutes each?
              Students will be able to book these time slots.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateSlots} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Slots'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
