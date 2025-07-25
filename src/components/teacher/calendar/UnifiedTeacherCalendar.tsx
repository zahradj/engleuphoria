import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ChevronLeft, ChevronRight, Clock, User, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, addDays, startOfDay, endOfDay } from "date-fns";
import { supabase } from "@/lib/supabase";
import { lessonService, ScheduledLesson } from "@/services/lessonService";
import { ScheduleLessonModal } from "../ScheduleLessonModal";

interface UnifiedTeacherCalendarProps {
  teacherId: string;
}

interface TimeSlot {
  id?: string;
  time: string;
  duration: number;
  isAvailable: boolean;
  isBooked: boolean;
  lessonId?: string;
  lessonTitle?: string;
  studentName?: string;
  studentId?: string;
  slotType: 'available' | 'booked' | 'lesson' | 'blocked';
}

interface DaySlots {
  [date: string]: TimeSlot[];
}

export const UnifiedTeacherCalendar = ({ teacherId }: UnifiedTeacherCalendarProps) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<25 | 55>(25);
  const [lessons, setLessons] = useState<ScheduledLesson[]>([]);
  const [daySlots, setDaySlots] = useState<DaySlots>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Time slots from 6 AM to 10 PM in 30-minute intervals
  const timeSlots = Array.from({ length: 32 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const loadCalendarData = async () => {
    setIsLoading(true);
    try {
      // Get date range based on view mode
      let startDate: Date, endDate: Date;
      
      if (viewMode === 'day') {
        startDate = startOfDay(selectedDate);
        endDate = endOfDay(selectedDate);
      } else if (viewMode === 'week') {
        const weekDays = getWeekDays();
        startDate = startOfDay(weekDays[0]);
        endDate = endOfDay(weekDays[6]);
      } else {
        startDate = startOfDay(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
        endDate = endOfDay(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0));
      }

      // Load lessons and availability in parallel
      const [lessonsData, availabilityData] = await Promise.all([
        lessonService.getTeacherUpcomingLessons(teacherId),
        supabase
          .from('teacher_availability')
          .select('*')
          .eq('teacher_id', teacherId)
          .gte('start_time', startDate.toISOString())
          .lte('start_time', endDate.toISOString())
      ]);

      if (availabilityData.error) throw availabilityData.error;

      setLessons(lessonsData);

      // Process and combine data
      const slotsMap: DaySlots = {};
      
      // Initialize all days with empty arrays
      const days = viewMode === 'day' ? [selectedDate] : 
                   viewMode === 'week' ? getWeekDays() :
                   getDaysInMonth();
      
      days.forEach(day => {
        const dateStr = day.toISOString().split('T')[0];
        slotsMap[dateStr] = [];
      });

      // Add availability slots
      availabilityData.data?.forEach(slot => {
        const slotDate = new Date(slot.start_time);
        const dateStr = slotDate.toISOString().split('T')[0];
        const timeStr = slotDate.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        if (slotsMap[dateStr]) {
          slotsMap[dateStr].push({
            id: slot.id,
            time: timeStr,
            duration: slot.duration,
            isAvailable: slot.is_available,
            isBooked: slot.is_booked,
            lessonId: slot.lesson_id,
            lessonTitle: slot.lesson_title,
            studentId: slot.student_id,
            slotType: slot.is_booked ? 'booked' : slot.is_available ? 'available' : 'blocked'
          });
        }
      });

      // Add lessons
      lessonsData.forEach(lesson => {
        const lessonDate = new Date(lesson.scheduled_at);
        const dateStr = lessonDate.toISOString().split('T')[0];
        const timeStr = lessonDate.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        if (slotsMap[dateStr]) {
          slotsMap[dateStr].push({
            time: timeStr,
            duration: lesson.duration,
            isAvailable: false,
            isBooked: true,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            studentName: lesson.student_name,
            studentId: lesson.student_id,
            slotType: 'lesson'
          });
        }
      });

      setDaySlots(slotsMap);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      toast({
        title: "Error",
        description: "Failed to load calendar data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      loadCalendarData();
    }
  }, [teacherId, viewMode, selectedDate, currentWeek]);

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    return eachDayOfInterval({
      start,
      end: endOfWeek(currentWeek, { weekStartsOn: 1 })
    });
  };

  const getDaysInMonth = () => {
    const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    return eachDayOfInterval({ start, end });
  };

  const handleTimeSlotClick = async (date: Date, time: string, slot?: TimeSlot) => {
    try {
      if (slot?.slotType === 'lesson') {
        // Join lesson
        await handleJoinLesson(slot);
        return;
      }

      // Toggle availability
      const dateStr = date.toISOString().split('T')[0];
      const existingSlot = daySlots[dateStr]?.find(s => s.time === time);

      if (existingSlot?.id) {
        // Delete existing slot
        const { error } = await supabase
          .from('teacher_availability')
          .delete()
          .eq('id', existingSlot.id);

        if (error) throw error;
      } else {
        // Create new slot
        const [hours, minutes] = time.split(':').map(Number);
        const startDateTime = new Date(date);
        startDateTime.setHours(hours, minutes, 0, 0);
        
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + selectedDuration);

        const { error } = await supabase
          .from('teacher_availability')
          .insert({
            teacher_id: teacherId,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            duration: selectedDuration,
            lesson_type: 'free_slot',
            is_available: true,
            is_booked: false
          });

        if (error) throw error;
      }

      await loadCalendarData();
    } catch (error) {
      console.error('Error toggling time slot:', error);
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleJoinLesson = async (slot: TimeSlot) => {
    if (!slot.lessonId) return;

    try {
      await lessonService.joinLesson(slot.lessonId, teacherId, 'teacher');
      
      const lesson = lessons.find(l => l.id === slot.lessonId);
      if (lesson?.room_id) {
        const classroomUrl = `/oneonone-classroom-new?roomId=${lesson.room_id}&role=teacher&name=Teacher&userId=${teacherId}`;
        navigate(classroomUrl);
        
        toast({
          title: "Joining Classroom",
          description: `Joining lesson: ${slot.lessonTitle}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join classroom. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getSlotStyle = (slot: TimeSlot) => {
    switch (slot.slotType) {
      case 'lesson':
        return "bg-primary text-primary-foreground border-primary";
      case 'booked':
        return "bg-destructive/10 text-destructive border-destructive/20";
      case 'available':
        return "bg-success/10 text-success border-success/20 cursor-pointer hover:bg-success/20";
      default:
        return "bg-muted/30 border-border cursor-pointer hover:bg-muted/50";
    }
  };

  const renderTimeSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    const slot = daySlots[dateStr]?.find(s => s.time === time);
    const isPastTime = date < new Date() && time < format(new Date(), 'HH:mm');

    return (
      <div
        key={`${dateStr}-${time}`}
        className={`
          min-h-[60px] p-2 border rounded text-xs transition-colors
          ${isPastTime ? 'opacity-50 cursor-not-allowed' : ''}
          ${slot ? getSlotStyle(slot) : 'bg-background border-border cursor-pointer hover:bg-muted/30'}
        `}
        onClick={() => !isPastTime && handleTimeSlotClick(date, time, slot)}
      >
        <div className="font-medium">{time}</div>
        {slot && (
          <div className="mt-1 space-y-1">
            {slot.slotType === 'lesson' && (
              <>
                <div className="flex items-center gap-1">
                  <PlayCircle className="h-3 w-3" />
                  <span className="truncate">{slot.lessonTitle}</span>
                </div>
                {slot.studentName && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="truncate">{slot.studentName}</span>
                  </div>
                )}
              </>
            )}
            {slot.slotType === 'available' && (
              <Badge variant="secondary" className="text-xs">Available</Badge>
            )}
            {slot.slotType === 'booked' && (
              <Badge variant="destructive" className="text-xs">Booked</Badge>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-8 gap-2">
          <div className="font-medium text-sm text-muted-foreground">Time</div>
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="font-medium text-sm text-center">
              <div>{format(day, 'EEE')}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
          ))}
          
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="text-xs text-muted-foreground py-2">{time}</div>
              {weekDays.map((day) => renderTimeSlot(day, time))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2 max-w-md">
          {timeSlots.map((time) => renderTimeSlot(selectedDate, time))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border"
          components={{
            Day: ({ date, ...props }) => {
              const dateStr = date.toISOString().split('T')[0];
              const daySlot = daySlots[dateStr];
              const hasLessons = daySlot?.some(slot => slot.slotType === 'lesson');
              const hasAvailability = daySlot?.some(slot => slot.slotType === 'available');
              
              return (
                <div {...props} className="relative">
                  <div>{date.getDate()}</div>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1">
                    {hasLessons && <div className="w-1 h-1 bg-primary rounded-full"></div>}
                    {hasAvailability && <div className="w-1 h-1 bg-success rounded-full"></div>}
                  </div>
                </div>
              );
            }
          }}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {daySlots[selectedDate.toISOString().split('T')[0]]?.length > 0 ? (
              <div className="space-y-2">
                {daySlots[selectedDate.toISOString().split('T')[0]]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((slot, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getSlotStyle(slot)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{slot.time}</span>
                          {slot.slotType === 'lesson' && slot.lessonTitle && (
                            <span>- {slot.lessonTitle}</span>
                          )}
                        </div>
                        {slot.slotType === 'lesson' && (
                          <Button size="sm" onClick={() => handleJoinLesson(slot)}>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        )}
                      </div>
                      {slot.studentName && (
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{slot.studentName}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No lessons or availability slots for this day
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teaching Calendar</h1>
        <div className="flex gap-2 items-center">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {viewMode !== 'month' && (
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value) as 25 | 55)}
              className="px-3 py-1 border rounded-md"
            >
              <option value={25}>25 min</option>
              <option value={55}>55 min</option>
            </select>
          )}
          
          <Button onClick={() => setShowScheduleModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Lesson
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </CardContent>
      </Card>

      <ScheduleLessonModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        teacherId={teacherId}
        onLessonScheduled={loadCalendarData}
      />
    </div>
  );
};