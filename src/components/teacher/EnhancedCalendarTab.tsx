
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Video, Calendar as CalendarIcon, Clock, User, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { lessonService, ScheduledLesson } from "@/services/lessonService";
import { ScheduleLessonModal } from "./ScheduleLessonModal";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, startOfDay, addDays } from "date-fns";

interface EnhancedCalendarTabProps {
  teacherId: string;
}

export const EnhancedCalendarTab = ({ teacherId }: EnhancedCalendarTabProps) => {
  const [lessons, setLessons] = useState<ScheduledLesson[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadLessons = async () => {
    try {
      setIsLoading(true);
      const teacherLessons = await lessonService.getTeacherUpcomingLessons(teacherId);
      setLessons(teacherLessons);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load lessons. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      loadLessons();
    }
  }, [teacherId]);

  const handleJoinClassroom = async (lesson: ScheduledLesson) => {
    try {
      await lessonService.joinLesson(lesson.id, teacherId, 'teacher');
      
      const classroomUrl = `/oneonone-classroom-new?roomId=${lesson.room_id}&role=teacher&name=Teacher&userId=${teacherId}`;
      navigate(classroomUrl);
      
      toast({
        title: "Joining Classroom",
        description: `Joining lesson: ${lesson.title}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join classroom. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const canJoinNow = (scheduledAt: string) => {
    const lessonTime = new Date(scheduledAt);
    const now = new Date();
    const tenMinutesBefore = new Date(lessonTime.getTime() - 10 * 60 * 1000);
    
    return now >= tenMinutesBefore;
  };

  const getLessonsForDate = (date: Date) => {
    return lessons.filter(lesson => 
      isSameDay(new Date(lesson.scheduled_at), date)
    );
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
    return eachDayOfInterval({
      start,
      end: endOfWeek(currentWeek, { weekStartsOn: 1 })
    });
  };

  const renderMonthView = () => (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border p-3 pointer-events-auto"
        components={{
          Day: ({ date, ...props }) => {
            const dayLessons = getLessonsForDate(date);
            return (
              <div {...props} className="relative">
                <div>{date.getDate()}</div>
                {dayLessons.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                )}
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
          {renderDayLessons(selectedDate)}
        </CardContent>
      </Card>
    </div>
  );

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
        
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <Card key={day.toISOString()} className="min-h-[200px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">
                  <div>{format(day, 'EEE')}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {renderDayLessons(day, true)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderDayLessons = (date: Date, compact = false) => {
    const dayLessons = getLessonsForDate(date);
    
    if (dayLessons.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">
          {compact ? "No lessons" : "No lessons scheduled for this day"}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {dayLessons.map((lesson) => {
          const { time } = formatDateTime(lesson.scheduled_at);
          const canJoin = canJoinNow(lesson.scheduled_at);
          
          return (
            <div key={lesson.id} className={`p-3 rounded-lg border ${compact ? 'text-xs' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
                  {lesson.title}
                </h4>
                <Badge variant={lesson.status === 'scheduled' ? 'default' : 'secondary'} className={compact ? 'text-xs px-1' : ''}>
                  {lesson.status}
                </Badge>
              </div>
              
              <div className={`flex items-center gap-4 text-gray-600 mb-2 ${compact ? 'text-xs' : 'text-sm'}`}>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{lesson.student_name || 'Unknown Student'}</span>
                </div>
              </div>

              {!compact && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {lesson.duration} min
                  </Badge>
                  <Button
                    onClick={() => handleJoinClassroom(lesson)}
                    disabled={!canJoin}
                    size="sm"
                    className={canJoin ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <Video className="h-3 w-3 mr-1" />
                    {canJoin ? "Join" : "Join Classroom"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Lesson Calendar</h1>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
          </div>
          <Button 
            onClick={() => setShowScheduleModal(true)}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Lesson
          </Button>
        </div>
      </div>

      {viewMode === 'month' ? renderMonthView() : renderWeekView()}

      <ScheduleLessonModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        teacherId={teacherId}
        onLessonScheduled={loadLessons}
      />
    </div>
  );
};
