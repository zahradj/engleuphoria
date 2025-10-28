import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Calendar, Check, Plus, Sunrise, Sun, Moon, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format, addDays, startOfWeek, isSameDay, isPast, parseISO } from "date-fns";
import { batchAvailabilityService } from "@/services/batchAvailabilityService";
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

interface SimplifiedMultiSelectCalendarProps {
  teacherId: string;
}

interface SelectedSlot {
  date: Date;
  time: string;
  key: string;
}

interface SlotData {
  id: string;
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
  studentName?: string;
}

const TIME_SLOTS = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30"
];

export const SimplifiedMultiSelectCalendar: React.FC<SimplifiedMultiSelectCalendarProps> = ({ teacherId }) => {
  const { toast } = useToast();
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastClickedSlot, setLastClickedSlot] = useState<SelectedSlot | null>(null);
  const [weeklySlots, setWeeklySlots] = useState<Record<string, SlotData[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    loadWeekData();
  }, [weekStart, teacherId]);

  const loadWeekData = async () => {
    setIsLoading(true);
    try {
      const startDate = weekStart.toISOString();
      const endDate = addDays(weekStart, 7).toISOString();

      const { data, error } = await supabase
        .from('teacher_availability')
        .select(`
          id,
          start_time,
          end_time,
          is_available,
          is_booked,
          lessons(student:users(full_name))
        `)
        .eq('teacher_id', teacherId)
        .gte('start_time', startDate)
        .lt('start_time', endDate);

      if (error) throw error;

      const slotsMap: Record<string, SlotData[]> = {};
      data?.forEach((slot: any) => {
        const date = format(parseISO(slot.start_time), 'yyyy-MM-dd');
        const time = format(parseISO(slot.start_time), 'HH:mm');
        
        if (!slotsMap[date]) slotsMap[date] = [];
        slotsMap[date].push({
          id: slot.id,
          time,
          isAvailable: slot.is_available,
          isBooked: slot.is_booked,
          studentName: slot.lessons?.[0]?.student?.full_name
        });
      });

      setWeeklySlots(slotsMap);
    } catch (error) {
      console.error('Error loading week data:', error);
      toast({
        title: "Error",
        description: "Failed to load calendar data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSlotKey = (date: Date, time: string) => `${format(date, 'yyyy-MM-dd')}-${time}`;

  const isSlotSelected = (date: Date, time: string) => {
    return selectedSlots.some(s => s.key === getSlotKey(date, time));
  };

  const getSlotState = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const slot = weeklySlots[dateStr]?.find(s => s.time === time);
    
    if (slot?.isBooked) return 'booked';
    if (slot?.isAvailable) return 'available';
    return 'empty';
  };

  const handleMouseDown = (date: Date, time: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isMultiSelectMode) return;
    
    const state = getSlotState(date, time);
    if (state !== 'empty' || isPast(date)) return;

    setIsDragging(true);
    toggleSlotSelection(date, time);
  };

  const handleMouseEnter = (date: Date, time: string) => {
    if (!isMultiSelectMode || !isDragging) return;
    
    const state = getSlotState(date, time);
    if (state !== 'empty' || isPast(date)) return;

    addSlotToSelection(date, time);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleSlotSelection = (date: Date, time: string) => {
    const key = getSlotKey(date, time);
    setSelectedSlots(prev => {
      const exists = prev.some(s => s.key === key);
      if (exists) {
        return prev.filter(s => s.key !== key);
      } else {
        return [...prev, { date, time, key }];
      }
    });
  };

  const addSlotToSelection = (date: Date, time: string) => {
    const key = getSlotKey(date, time);
    setSelectedSlots(prev => {
      if (prev.some(s => s.key === key)) return prev;
      return [...prev, { date, time, key }];
    });
  };

  const selectTimeRange = (startHour: number, endHour: number) => {
    const slots: SelectedSlot[] = [];
    
    weekDays.forEach(day => {
      if (isPast(day) && !isSameDay(day, new Date())) return;
      
      TIME_SLOTS.forEach(time => {
        const hour = parseInt(time.split(':')[0]);
        if (hour >= startHour && hour < endHour) {
          const state = getSlotState(day, time);
          if (state === 'empty') {
            slots.push({
              date: day,
              time,
              key: getSlotKey(day, time)
            });
          }
        }
      });
    });
    
    setSelectedSlots(slots);
    toast({
      description: `Selected ${slots.length} empty slots`,
    });
  };

  const createSelectedSlots = async () => {
    if (selectedSlots.length === 0) return;

    setShowConfirmDialog(false);
    setIsLoading(true);
    
    try {
      const dates = selectedSlots.map(s => s.date);
      const times = [...new Set(selectedSlots.map(s => s.time))];

      await batchAvailabilityService.createBatchSlots(teacherId, dates, times, selectedDuration);

      toast({
        title: "✅ Success!",
        description: `Created ${selectedSlots.length} slots of ${selectedDuration} minutes`,
      });

      setSelectedSlots([]);
      setIsMultiSelectMode(false);
      await loadWeekData();
    } catch (error) {
      console.error('Error creating slots:', error);
      toast({
        title: "Error",
        description: "Failed to create some slots",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('teacher_availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      toast({ description: "Slot deleted successfully" });
      await loadWeekData();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast({
        title: "Error",
        description: "Failed to delete slot",
        variant: "destructive"
      });
    }
  };

  const renderSlot = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const slot = weeklySlots[dateStr]?.find(s => s.time === time);
    const isSelected = isSlotSelected(date, time);
    const isPastSlot = isPast(date) && !isSameDay(date, new Date());
    const state = getSlotState(date, time);

    let bgColor = "bg-background hover:bg-muted/50";
    let borderColor = "border-border";
    let content = <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />;
    let cursor = "cursor-pointer";

    if (isPastSlot) {
      bgColor = "bg-muted/30";
      borderColor = "border-muted";
      content = null;
      cursor = "cursor-not-allowed";
    } else if (state === 'booked') {
      bgColor = "bg-blue-500/20";
      borderColor = "border-blue-500";
      content = (
        <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
          BOOKED
        </div>
      );
      cursor = "cursor-default";
    } else if (state === 'available') {
      bgColor = "bg-green-500/20";
      borderColor = "border-green-500";
      content = (
        <div className="flex items-center justify-between w-full gap-1">
          <span className="text-xs font-medium text-green-700 dark:text-green-300">OPEN</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-destructive/20"
            onClick={(e) => {
              e.stopPropagation();
              deleteSlot(slot!.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      );
      cursor = "cursor-default";
    } else if (isSelected && isMultiSelectMode) {
      bgColor = "bg-primary/20";
      borderColor = "border-primary";
      content = <Check className="w-4 h-4 text-primary" />;
    }

    return (
      <div
        key={`${dateStr}-${time}`}
        className={`
          group relative h-12 border-2 rounded-md flex items-center justify-center
          transition-all duration-150 select-none
          ${bgColor} ${borderColor} ${cursor}
        `}
        onMouseDown={(e) => handleMouseDown(date, time, e)}
        onMouseEnter={() => handleMouseEnter(date, time)}
        onClick={(e) => {
          if (isMultiSelectMode && state === 'empty' && !isPastSlot) {
            e.preventDefault();
            toggleSlotSelection(date, time);
          }
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="space-y-6" onMouseUp={handleMouseUp}>
      {/* Control Bar */}
      <Card className="p-4 space-y-4">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium ml-2">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        {/* Duration & Multi-Select */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Duration:</span>
            <Button
              variant={selectedDuration === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDuration(30)}
            >
              30 min
            </Button>
            <Button
              variant={selectedDuration === 60 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDuration(60)}
            >
              60 min
            </Button>
          </div>

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
        </div>

        {/* Quick Actions */}
        {isMultiSelectMode && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Quick Select:</span>
            <Button variant="outline" size="sm" onClick={() => selectTimeRange(9, 12)}>
              <Sunrise className="h-4 w-4 mr-1" />
              Morning (9-12)
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectTimeRange(13, 17)}>
              <Sun className="h-4 w-4 mr-1" />
              Afternoon (13-17)
            </Button>
            <Button variant="outline" size="sm" onClick={() => selectTimeRange(18, 21)}>
              <Moon className="h-4 w-4 mr-1" />
              Evening (18-21)
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedSlots([])}>
              Clear Selection
            </Button>
          </div>
        )}

        {/* Create Button */}
        {selectedSlots.length > 0 && (
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isLoading}
          >
            <Check className="h-5 w-5 mr-2" />
            Create {selectedSlots.length} Selected Slot{selectedSlots.length > 1 ? 's' : ''}
          </Button>
        )}
      </Card>

      {/* Calendar Grid */}
      <Card className="p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-xs font-medium text-muted-foreground">Time</div>
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="text-center">
                <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                <div className={`text-sm ${isSameDay(day, new Date()) ? 'text-primary font-bold' : ''}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-1">
            {TIME_SLOTS.map((time) => (
              <div key={time} className="grid grid-cols-8 gap-2">
                <div className="text-xs text-muted-foreground py-2">{time}</div>
                {weekDays.map((day) => renderSlot(day, time))}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Availability Slots?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create {selectedSlots.length} slots of {selectedDuration} minutes each.
              These slots will be immediately visible to students for booking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createSelectedSlots}>
              Create Slots
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
