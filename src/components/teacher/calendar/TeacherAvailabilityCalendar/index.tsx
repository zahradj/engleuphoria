import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { batchAvailabilityService } from "@/services/batchAvailabilityService";
import { ChevronLeft, ChevronRight, Plus, Trash2, Check, Clock } from "lucide-react";
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
    setIsLoading(true);
    try {
      const startDate = weekDates[0];
      const endDate = new Date(weekDates[6]);
      endDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('teacher_availability')
        .select('*')
        .eq('teacher_id', teacherId)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

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
            studentName: slot.student_name,
            lessonTitle: slot.lesson_title
          });
        }
      });

      setWeeklySlots(slotsMap);
    } catch (error) {
      console.error('Error loading weekly data:', error);
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
      const dates = [...new Set(selectedSlots.map(s => {
        const date = weekDates.find(d => formatDate(d) === s.dateKey);
        return date;
      }))].filter(Boolean) as Date[];

      const times = [...new Set(selectedSlots.map(s => s.time))];

      console.log('🔍 Creating slots:', {
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

      console.log('✅ Slots created successfully');

      toast({
        title: "✅ Success!",
        description: `Created ${selectedSlots.length} slots of ${duration} minutes`
      });

      setSelectedSlots([]);
      setShowConfirmDialog(false);
      loadWeeklyData();
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

  const renderSlot = (date: Date, time: string) => {
    const dateKey = formatDate(date);
    const slotKey = `${dateKey}-${time}`;
    const slot = getSlotAtPosition(dateKey, time);
    const isSelected = isSlotSelected(slotKey);
    const past = isPastSlot(date, time);

    if (slot?.isBooked) {
      return (
        <div className="h-12 rounded border border-primary/30 bg-primary/10 p-1 text-xs">
          <Badge variant="secondary" className="text-[10px] mb-0.5">BOOKED</Badge>
          {slot.studentName && <div className="text-[10px] truncate">{slot.studentName}</div>}
        </div>
      );
    }

    if (slot?.isAvailable) {
      return (
        <button
          onClick={() => handleSlotClick(dateKey, time)}
          className="h-12 w-full rounded border border-green-500/30 bg-green-500/10 p-1 text-xs hover:bg-green-500/20 transition-colors group"
        >
          <Badge variant="outline" className="text-[10px] mb-0.5 border-green-500/50">OPEN</Badge>
          <div className="text-[10px] text-muted-foreground">{slot.duration}min</div>
          <Trash2 className="h-3 w-3 absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-destructive" />
        </button>
      );
    }

    if (past) {
      return <div className="h-12 rounded border border-muted/20 bg-muted/5 opacity-50" />;
    }

    return (
      <button
        onMouseDown={() => handleSlotMouseDown(dateKey, time)}
        onMouseEnter={() => handleSlotMouseEnter(dateKey, time)}
        onMouseUp={handleSlotMouseUp}
        onClick={() => !isMultiSelectMode && toggleSlotSelection(dateKey, time)}
        disabled={!isMultiSelectMode && isSelected}
        className={`h-12 w-full rounded border-2 border-dashed transition-all ${
          isSelected
            ? 'border-primary bg-primary/20 hover:bg-primary/30'
            : 'border-muted hover:border-primary/50 hover:bg-accent/50'
        } ${isMultiSelectMode ? 'cursor-crosshair' : 'cursor-pointer'}`}
      >
        {isSelected ? (
          <Check className="h-4 w-4 mx-auto text-primary" />
        ) : (
          <Plus className="h-4 w-4 mx-auto opacity-0 hover:opacity-50 transition-opacity" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4" onMouseUp={handleSlotMouseUp}>
      {/* Navigation & Controls */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-sm min-w-[200px] text-center">
              {formatWeekRange(weekDates)}
            </span>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
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
      <Card className="p-4 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-xs font-semibold text-muted-foreground">Time</div>
              {weekDates.map(date => (
                <div key={formatDate(date)} className="text-center">
                  <div className="text-xs font-semibold">{getDayName(date)}</div>
                  <div className="text-[10px] text-muted-foreground">{getDayDate(date)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 gap-2">
                  <div className="text-xs text-muted-foreground flex items-center">{time}</div>
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
