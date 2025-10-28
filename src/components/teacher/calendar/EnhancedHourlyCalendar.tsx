import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Plus, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface TimeSlot {
  id?: string;
  time: string;
  duration: 30 | 60;
  lessonType: 'free_slot' | 'direct_booking';
  isAvailable: boolean;
  studentId?: string;
  lessonTitle?: string;
  studentName?: string;
}

interface EnhancedHourlyCalendarProps {
  teacherId: string;
}

export const EnhancedHourlyCalendar = ({ teacherId }: EnhancedHourlyCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [isLoading, setIsLoading] = useState(false);

  // Generate hourly time slots from 6 AM to 11 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  const loadSlotsForDate = async (date: Date) => {
    if (!teacherId) return;
    
    setIsLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('teacher_availability')
        .select(`
          *,
          student:student_id(full_name)
        `)
        .eq('teacher_id', teacherId)
        .eq('date', dateStr);

      if (error) throw error;

      const slotsMap = new Map();
      data?.forEach(slot => {
        slotsMap.set(slot.start_time, {
          id: slot.id,
          time: slot.start_time,
          duration: slot.duration,
          lessonType: slot.lesson_type,
          isAvailable: slot.is_available,
          studentId: slot.student_id,
          lessonTitle: slot.lesson_title,
          studentName: slot.student?.full_name
        });
      });

      const formattedSlots = allTimeSlots.map(time => 
        slotsMap.get(time) || {
          time,
          duration: 30,
          lessonType: 'free_slot',
          isAvailable: false
        }
      );

      setTimeSlots(formattedSlots);
    } catch (error) {
      console.error('Error loading slots:', error);
      toast({
        title: "Error",
        description: "Failed to load availability slots",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlotsForDate(selectedDate);
  }, [selectedDate, teacherId]);

  const handleTimeSlotClick = async (time: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Direct booking mode
      handleDirectBooking(time);
    } else {
      // Toggle free slot mode
      await handleToggleFreeSlot(time);
    }
  };

  const handleToggleFreeSlot = async (time: string) => {
    const existingSlot = timeSlots.find(slot => slot.time === time);
    const dateStr = selectedDate.toISOString().split('T')[0];

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
        const startTime = time;
        const [hours, minutes] = time.split(':').map(Number);
        const endTime = `${(hours + Math.floor((minutes + selectedDuration) / 60)).toString().padStart(2, '0')}:${((minutes + selectedDuration) % 60).toString().padStart(2, '0')}`;

        const { insertAvailabilitySlotsWithFallback } = await import("@/services/availabilityInsert");
        await insertAvailabilitySlotsWithFallback(supabase as any, [{
          teacher_id: teacherId,
          date: dateStr,
          start_time: startTime,
          end_time: endTime,
          duration: selectedDuration,
          lesson_type: 'free_slot',
          is_available: true
        }] as any);
        
        toast({
          title: "Success",
          description: `${selectedDuration}-minute slot opened`,
        });
      }

      await loadSlotsForDate(selectedDate);
    } catch (error) {
      console.error('Error toggling slot:', error);
      toast({
        title: "Error",
        description: "Failed to toggle time slot",
        variant: "destructive"
      });
    }
  };

  const handleDirectBooking = (time: string) => {
    // TODO: Open modal for direct student booking
    toast({
      title: "Direct Booking",
      description: "Direct booking feature coming soon. Use Ctrl+Click to access.",
    });
  };

  const getSlotColor = (slot: TimeSlot) => {
    if (!slot.isAvailable) return "bg-gray-100 text-gray-400 border-gray-200";
    if (slot.lessonType === 'direct_booking') return "bg-orange-100 text-orange-700 border-orange-200";
    if (slot.studentId) return "bg-red-100 text-red-700 border-red-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getSlotIcon = (slot: TimeSlot) => {
    if (!slot.isAvailable) return <Clock className="h-3 w-3" />;
    if (slot.lessonType === 'direct_booking') return <Users className="h-3 w-3" />;
    if (slot.studentId) return <Users className="h-3 w-3" />;
    return <Plus className="h-3 w-3" />;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header with date navigation and duration selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={selectedDuration.toString()}
            onValueChange={(value) => setSelectedDuration(Number(value) as 30 | 60)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        {/* Hourly Grid */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Hours grid */}
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: 17 }, (_, i) => {
                  const hour = i + 6;
                  const hourSlots = timeSlots.filter(slot => {
                    const slotHour = parseInt(slot.time.split(':')[0]);
                    return slotHour === hour;
                  });

                  return (
                    <div key={hour} className="space-y-1">
                      <div className="text-xs font-medium text-center p-1 bg-gray-50 rounded">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      
                      {hourSlots.map(slot => (
                        <Button
                          key={slot.time}
                          variant="outline"
                          size="sm"
                          disabled={isLoading}
                          onClick={(e) => handleTimeSlotClick(slot.time, e)}
                          className={`
                            h-8 text-xs font-medium transition-all cursor-pointer
                            ${getSlotColor(slot)}
                            hover:scale-105 active:scale-95
                          `}
                          title={`${slot.time} - ${slot.duration}min ${slot.lessonType === 'direct_booking' ? '(Direct)' : '(Free)'}`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {getSlotIcon(slot)}
                            <span className="text-xs">{slot.time.split(':')[1]}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 pt-4 text-xs border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span>Closed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-200 rounded"></div>
                  <span>Open for booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-200 rounded"></div>
                  <span>Direct booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-200 rounded"></div>
                  <span>Booked by student</span>
                </div>
                <div className="text-gray-600">
                  Tip: Click to open slots, Ctrl+Click for direct booking
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};