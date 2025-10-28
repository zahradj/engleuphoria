
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, User, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { lessonService, ScheduledLesson } from "@/services/lessonService";

interface EnhancedUpcomingClassesTabProps {
  studentId: string;
}

export const EnhancedUpcomingClassesTab = ({ studentId }: EnhancedUpcomingClassesTabProps) => {
  const [lessons, setLessons] = useState<ScheduledLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadLessons = async () => {
    try {
      setIsLoading(true);
      const studentLessons = await lessonService.getStudentUpcomingLessons(studentId);
      setLessons(studentLessons);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load classes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      loadLessons();
    }
  }, [studentId]);

  const handleJoinClass = async (lesson: ScheduledLesson) => {
    try {
      // Validate access first
      const canAccess = await lessonService.canAccessLesson(lesson.room_id, studentId);
      
      if (!canAccess) {
        toast({
          title: "Access Denied",
          description: "You can only join 10 minutes before the scheduled time.",
          variant: "destructive"
        });
        return;
      }

      // Track that student is joining the lesson
      await lessonService.joinLesson(lesson.id, studentId, 'student');
      
      // Navigate to classroom with room parameters
      const classroomUrl = `/classroom?roomId=${lesson.room_id}&role=student&name=Student&userId=${studentId}`;
      navigate(classroomUrl);
      
      toast({
        title: "Joining Class",
        description: `Joining: ${lesson.title}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join class. Please try again.",
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

  const getTimeUntilClass = (scheduledAt: string) => {
    const lessonTime = new Date(scheduledAt);
    const now = new Date();
    const diffMs = lessonTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 0) {
      return { status: 'live', text: 'Class is Live!', canJoin: true };
    } else if (diffMinutes <= 10) {
      return { status: 'ready', text: 'Ready to Join', canJoin: true };
    } else if (diffMinutes <= 60) {
      return { status: 'soon', text: `${diffMinutes} min`, canJoin: false };
    } else {
      const hours = Math.floor(diffMinutes / 60);
      return { status: 'later', text: `${hours}h ${diffMinutes % 60}m`, canJoin: false };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Upcoming Classes</h1>
        <Button variant="outline" onClick={loadLessons}>
          <Calendar className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Classes Scheduled</h3>
            <p className="text-gray-500">Your teacher will schedule classes for you.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson) => {
            const { date, time } = formatDateTime(lesson.scheduled_at);
            const timeStatus = getTimeUntilClass(lesson.scheduled_at);
            
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
                          <span>{lesson.teacher_name || 'Teacher'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={timeStatus.status === 'live' ? 'destructive' : 
                                  timeStatus.status === 'ready' ? 'default' : 'secondary'}
                        >
                          {timeStatus.text}
                        </Badge>
                        <Badge variant="outline">
                          {lesson.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleJoinClass(lesson)}
                        disabled={!timeStatus.canJoin}
                        className={timeStatus.canJoin
                          ? timeStatus.status === 'live' 
                            ? "bg-red-500 hover:bg-red-600 animate-pulse"
                            : "bg-green-500 hover:bg-green-600"
                          : "bg-gray-400 cursor-not-allowed"
                        }
                      >
                        <Video className="h-4 w-4 mr-1" />
                        {timeStatus.status === 'live' ? "Join Now!" : 
                         timeStatus.canJoin ? "Join Class" : "Not Ready"}
                      </Button>
                      
                      {!timeStatus.canJoin && timeStatus.status !== 'live' && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <AlertCircle className="h-3 w-3" />
                          <span>Available 10 min before</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
