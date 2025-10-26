import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ChevronLeft, ChevronRight, Clock, User, PlayCircle, Calendar as CalendarIcon, Sparkles, Info, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, addDays, startOfDay, endOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { lessonService, ScheduledLesson } from "@/services/lessonService";
import { ScheduleLessonModal } from "../ScheduleLessonModal";
import { QuickSetupModal } from "./QuickSetupModal";
import { TimeSlotActionModal } from "./TimeSlotActionModal";
import { SlotManagementModal } from "./SlotManagementModal";
import { InstructionPrompt } from "@/components/shared/InstructionPrompt";

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
  
  // New modal states
  const [showTimeSlotActionModal, setShowTimeSlotActionModal] = useState(false);
  const [showSlotManagementModal, setShowSlotManagementModal] = useState(false);
  const [selectedSlotDate, setSelectedSlotDate] = useState<Date>(new Date());
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showQuickSetupModal, setShowQuickSetupModal] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Calculate slot counts
  const totalSlots = Object.values(daySlots).flat();
  const availableCount = totalSlots.filter(s => s.slotType === 'available').length;
  const bookedCount = totalSlots.filter(s => s.slotType === 'booked' || s.slotType === 'lesson').length;

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

  const handleTimeSlotClick = (date: Date, time: string, slot?: TimeSlot) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingSlot = daySlots[dateStr]?.find(s => s.time === time) || slot;

    if (existingSlot) {
      // Show slot management modal for existing slots
      setSelectedSlotDate(date);
      setSelectedSlotTime(time);
      setSelectedSlot(existingSlot);
      setShowSlotManagementModal(true);
    } else {
      // Show time slot action modal for empty slots
      setSelectedSlotDate(date);
      setSelectedSlotTime(time);
      setShowTimeSlotActionModal(true);
    }
  };

  const handleJoinLesson = async (slot: TimeSlot) => {
    if (!slot.lessonId) return;

    try {
      await lessonService.joinLesson(slot.lessonId, teacherId, 'teacher');
      
      const lesson = lessons.find(l => l.id === slot.lessonId);
      if (lesson?.room_link) {
        // Use the existing room link with teacher parameters
        const url = new URL(lesson.room_link);
        url.searchParams.set('role', 'teacher');
        url.searchParams.set('name', 'Teacher');
        url.searchParams.set('userId', teacherId);
        
        // Open in new tab for better UX
        window.open(url.toString(), '_blank');
        
        toast({
          title: "Joining Classroom",
          description: `Joining lesson: ${slot.lessonTitle}`,
        });
      } else if (lesson?.room_id) {
        // Fallback to building URL manually
        const classroomUrl = `/oneonone-classroom-new?roomId=${lesson.room_id}&role=teacher&name=Teacher&userId=${teacherId}`;
        window.open(classroomUrl, '_blank');
        
        toast({
          title: "Joining Classroom",
          description: `Joining lesson: ${slot.lessonTitle}`,
        });
      } else {
        throw new Error('No room information available');
      }
    } catch (error) {
      console.error('Error joining lesson:', error);
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
        return "bg-gradient-to-br from-primary via-primary/90 to-purple-600 text-primary-foreground border border-primary/30 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer backdrop-blur-sm";
      case 'booked':
        return "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border border-blue-400/50 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer backdrop-blur-sm";
      case 'available':
        return "bg-gradient-to-br from-secondary/80 via-secondary to-teal-600 text-secondary-foreground border border-secondary/40 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer backdrop-blur-sm";
      default:
        return "bg-background/80 border border-border hover:bg-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer backdrop-blur-sm";
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
          min-h-[70px] p-3 rounded-lg text-xs transition-all duration-300 relative group cursor-pointer
          ${isPastTime ? 'opacity-40 cursor-not-allowed bg-muted/30' : ''}
          ${slot ? getSlotStyle(slot) : 'bg-background/80 border border-border hover:bg-primary/10 hover:border-primary/30 hover:shadow-md hover:scale-[1.02]'}
        `}
        onClick={() => !isPastTime && handleTimeSlotClick(date, time, slot)}
        title={slot ? 
          slot.slotType === 'lesson' ? `Lesson: ${slot.lessonTitle}${slot.studentName ? ` with ${slot.studentName}` : ''}` :
          slot.slotType === 'available' ? 'Available for booking - Click to manage' :
          slot.slotType === 'booked' ? 'Booked slot - Click to view details' : 'Time slot'
          : 
          isPastTime ? 'Past time slot' : 'Click to create availability'
        }
      >
        {/* Time Display */}
        <div className="font-semibold text-foreground mb-2">{time}</div>
        
        {/* Empty slot indicator */}
        {!slot && !isPastTime && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary/5 rounded-lg">
            <div className="text-center">
              <Plus className="h-4 w-4 mx-auto mb-1 text-primary" />
              <div className="text-xs text-primary font-medium">Add Slot</div>
            </div>
          </div>
        )}
        
        {/* Slot Content */}
        {slot && (
          <div className="space-y-2">
            {slot.slotType === 'lesson' && (
              <>
                <div className="flex items-start gap-2">
                  <PlayCircle className="h-4 w-4 flex-shrink-0 text-primary-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-primary-foreground truncate text-sm">
                      {slot.lessonTitle}
                    </div>
                    {slot.studentName && (
                      <div className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3 text-primary-foreground/80" />
                        <span className="text-xs text-primary-foreground/90 truncate">
                          {slot.studentName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {slot.slotType === 'available' && (
              <div className="space-y-1">
                <Badge className="bg-secondary/80 text-secondary-foreground border-secondary/40 shadow-sm">
                  Available
                </Badge>
                <div className="text-xs text-secondary-foreground/80">
                  Ready for booking
                </div>
              </div>
            )}
            
            {slot.slotType === 'booked' && (
              <div className="space-y-1">
                <Badge className="bg-blue-500/80 text-white border-blue-400/40 shadow-sm">
                  Booked
                </Badge>
                <div className="text-xs text-blue-100">
                  Student confirmed
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Duration indicator */}
        {slot && (
          <div className="absolute top-2 right-2">
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-background/20 text-foreground/80 border border-background/40">
              {slot.duration}m
            </div>
          </div>
        )}
        
        {/* Hover effect overlay */}
        {!isPastTime && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
        )}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    
    return (
      <div className="space-y-6">
        {/* Week Navigation Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">
              {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
            </h3>
            <p className="text-sm text-muted-foreground">Weekly view of your teaching schedule</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentWeek(new Date())}
              className="hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
              {/* Empty State */}
              {!isLoading && totalSlots.length === 0 && (
                <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Welcome to Your Calendar! 📅</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Your calendar is empty. Let's get you started by creating your first availability slots.
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center flex-wrap">
                      <QuickSetupModal teacherId={teacherId} onSlotsCreated={loadCalendarData}>
                        <Button size="lg">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Quick Setup (Recommended)
                        </Button>
                      </QuickSetupModal>
                      <Button size="lg" variant="outline" onClick={loadCalendarData}>
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                    <div className="pt-4 border-t max-w-lg mx-auto">
                      <p className="text-sm text-muted-foreground text-left">
                        <strong>💡 Quick Tip:</strong> Use "Quick Setup" to create multiple slots at once. 
                        Choose your available days and times, and we'll create slots for the next 4 weeks automatically!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Slot Count Summary */}
              {!isLoading && totalSlots.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border mb-4">
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <span className="text-sm">
                        <strong>{availableCount}</strong> Available
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-sm">
                        <strong>{bookedCount}</strong> Booked
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-border"></div>
                      <span className="text-sm">
                        <strong>{totalSlots.length}</strong> Total
                      </span>
                    </div>
                  </div>
                  {availableCount < 10 && availableCount > 0 && (
                    <Badge variant="outline" className="text-amber-600 border-amber-600 whitespace-nowrap">
                      ⚠️ Consider adding more slots
                    </Badge>
                  )}
                </div>
              )}

              {/* Calendar Grid */}
              {totalSlots.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20">
                <div className="p-4 font-semibold text-sm text-muted-foreground border-r border-primary/10">
                  Time
                </div>
                {weekDays.map((day) => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div 
                      key={day.toISOString()} 
                      className={`p-4 text-center border-r last:border-r-0 border-primary/10 ${
                        isToday ? 'bg-primary/20 font-bold' : ''
                      }`}
                    >
                      <div className={`font-semibold text-sm ${isToday ? 'text-primary' : 'text-foreground'}`}>
                        {format(day, 'EEE')}
                      </div>
                      <div className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                        {format(day, 'd')}
                      </div>
                      {isToday && (
                        <div className="text-xs text-primary font-medium mt-1">Today</div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Time Slots */}
              <div className="divide-y divide-primary/10">
                {timeSlots.map((time, index) => (
                  <div key={time} className={`grid grid-cols-8 hover:bg-primary/5 transition-colors duration-150 ${index % 2 === 0 ? 'bg-background/30' : 'bg-background/60'}`}>
                    <div className="p-3 text-xs font-medium text-muted-foreground border-r border-primary/10 bg-muted/30 flex items-center">
                      <span className="font-mono">{time}</span>
                    </div>
                    {weekDays.map((day) => (
                      <div key={`${day.toISOString()}-${time}`} className="border-r last:border-r-0 border-primary/10 p-1">
                        {renderTimeSlot(day, time)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
              )}
      </div>
    );
  };

  const renderDayView = () => {
    const isToday = isSameDay(selectedDate, new Date());
    
    return (
      <div className="space-y-6">
        {/* Day Navigation Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              {isToday && (
                <Badge className="bg-primary text-primary-foreground">Today</Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">Detailed view for the selected day</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedDate(new Date())}
              className="hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Time Slots List */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-3">
            {timeSlots.map((time, index) => (
              <div 
                key={time} 
                className={`transition-all duration-300 ${index % 2 === 0 ? 'animate-fade-in' : 'animate-fade-in animation-delay-300'}`}
              >
                {renderTimeSlot(selectedDate, time)}
              </div>
            ))}
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
            Teaching Schedule
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your lessons, availability, and schedule with ease. Create time slots, track bookings, and join classes seamlessly.
          </p>
        </div>

        {/* Instruction Prompt */}
        <InstructionPrompt
          icon="🗓️"
          title="Set Your Availability"
          description="Click on the calendar below to select the days and time slots when you're available to teach. Once selected, your available slots will automatically appear on the student side for booking."
          additionalInfo="✅ You can edit or remove your availability at any time. 🔒 Only available (unbooked) time slots will be shown to students."
          className="max-w-4xl mx-auto"
        />

        {/* Main Calendar Card */}
        <Card className="glass-enhanced shadow-2xl border-0 overflow-hidden animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-50/50 to-secondary/10 dark:from-primary/20 dark:via-purple-900/30 dark:to-secondary/20 border-b border-primary/20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Calendar View
                </CardTitle>
                <p className="text-muted-foreground">
                  Switch between different views to manage your schedule
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'month' | 'week' | 'day')}>
                  <TabsList className="grid grid-cols-3 bg-background/80 border border-primary/20">
                    <TabsTrigger value="month" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Month
                    </TabsTrigger>
                    <TabsTrigger value="week" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Week
                    </TabsTrigger>
                    <TabsTrigger value="day" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Day
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Duration Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-medium">Duration:</span>
                  <div className="flex border border-primary/20 rounded-md overflow-hidden bg-background/80">
                    <Button
                      size="sm"
                      variant={selectedDuration === 25 ? "default" : "ghost"}
                      onClick={() => setSelectedDuration(25)}
                      className={`rounded-none px-4 ${selectedDuration === 25 ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      25 min
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedDuration === 55 ? "default" : "ghost"}
                      onClick={() => setSelectedDuration(55)}
                      className={`rounded-none px-4 ${selectedDuration === 55 ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      55 min
                    </Button>
                  </div>
                </div>

                {/* Quick Availability Button - More Prominent */}
                <QuickSetupModal teacherId={teacherId} onSlotsCreated={loadCalendarData}>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Quick Availability
                  </Button>
                </QuickSetupModal>
                
                <Button 
                  onClick={() => setShowScheduleModal(true)}
                  variant="outline"
                  size="lg"
                  className="shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Lesson
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <Tabs value={viewMode} className="w-full">
              <TabsContent value="week" className="mt-0 space-y-6">
                {renderWeekView()}
              </TabsContent>
              <TabsContent value="day" className="mt-0 space-y-6">
                {renderDayView()}
              </TabsContent>
              <TabsContent value="month" className="mt-0 space-y-6">
                {renderMonthView()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Legend Card */}
        <Card className="glass-enhanced border-primary/20 animate-fade-in animation-delay-300">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-foreground">Schedule Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="w-4 h-4 rounded bg-primary/90 shadow-sm"></div>
                <span className="text-sm font-medium">Active Lessons</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200 shadow-sm"></div>
                <span className="text-sm font-medium">Booked Slots</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="w-4 h-4 rounded bg-secondary/20 border border-secondary/30 shadow-sm"></div>
                <span className="text-sm font-medium">Available</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
                <div className="w-4 h-4 rounded bg-background border border-border shadow-sm"></div>
                <span className="text-sm font-medium">Empty Slots</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <ScheduleLessonModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          teacherId={teacherId}
          onLessonScheduled={loadCalendarData}
        />

        <TimeSlotActionModal
          isOpen={showTimeSlotActionModal}
          onClose={() => setShowTimeSlotActionModal(false)}
          date={selectedSlotDate}
          time={selectedSlotTime}
          selectedDuration={selectedDuration}
          teacherId={teacherId}
          onSlotCreated={loadCalendarData}
        />

        <SlotManagementModal
          isOpen={showSlotManagementModal}
          onClose={() => setShowSlotManagementModal(false)}
          slot={selectedSlot}
          date={selectedSlotDate}
          time={selectedSlotTime}
          onSlotDeleted={loadCalendarData}
          onJoinLesson={handleJoinLesson}
        />
      </div>
    </div>
  );
};