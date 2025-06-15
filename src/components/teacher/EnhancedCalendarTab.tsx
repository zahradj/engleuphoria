import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Video, Calendar, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { lessonService, ScheduledLesson } from "@/services/lessonService";
import { ScheduleLessonModal } from "./ScheduleLessonModal";

interface EnhancedCalendarTabProps {
  teacherId: string;
}

export const EnhancedCalendarTab = ({ teacherId }: EnhancedCalendarTabProps) => {
  const [lessons, setLessons] = useState<ScheduledLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
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
      // Track that teacher is joining the lesson
      await lessonService.joinLesson(lesson.id, teacherId, 'teacher');
      
      // Navigate to classroom with room parameters
      const classroomUrl = `/classroom?roomId=${lesson.room_id}&role=teacher&name=Teacher&userId=${teacherId}`;
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
        <h1 className="text-2xl font-bold text-gray-800">Scheduled Lessons</h1>
        <Button 
          onClick={() => setShowScheduleModal(true)}
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Lesson
        </Button>
      </div>

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Lessons Scheduled</h3>
            <p className="text-gray-500 mb-4">Schedule your first lesson to get started!</p>
            <Button onClick={() => setShowScheduleModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Lesson
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson) => {
            const { date, time } = formatDateTime(lesson.scheduled_at);
            const canJoin = canJoinNow(lesson.scheduled_at);
            
            return (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {lesson.title}
                      </h3>
                      
                      <div className="flex items-center gap-6 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{time} ({lesson.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{lesson.student_name || 'Student'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Room: {lesson.room_id}
                        </Badge>
                        <Badge variant={lesson.status === 'scheduled' ? 'secondary' : 'default'}>
                          {lesson.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleJoinClassroom(lesson)}
                        disabled={!canJoin}
                        className={canJoin 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-gray-400 cursor-not-allowed"
                        }
                      >
                        <Video className="h-4 w-4 mr-1" />
                        {canJoin ? "Join Classroom" : "Not Ready"}
                      </Button>
                      
                      {!canJoin && (
                        <p className="text-xs text-gray-500 text-center">
                          Available 10 min before
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
