
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { lessonService, ScheduledLesson } from "@/services/lessonService";
import { ScheduleLessonModal } from "./ScheduleLessonModal";
import { CalendarViewSwitcher } from "./calendar/CalendarViewSwitcher";
import { MonthView } from "./calendar/MonthView";
import { WeekView } from "./calendar/WeekView";

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
          <CalendarViewSwitcher 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
          />
          <Button 
            onClick={() => setShowScheduleModal(true)}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Lesson
          </Button>
        </div>
      </div>

      {viewMode === 'month' ? (
        <MonthView
          selectedDate={selectedDate}
          onDateSelect={(date) => date && setSelectedDate(date)}
          lessons={lessons}
          onJoinClassroom={handleJoinClassroom}
        />
      ) : (
        <WeekView
          currentWeek={currentWeek}
          onWeekChange={setCurrentWeek}
          lessons={lessons}
          onJoinClassroom={handleJoinClassroom}
        />
      )}

      <ScheduleLessonModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        teacherId={teacherId}
        onLessonScheduled={loadLessons}
      />
    </div>
  );
};
