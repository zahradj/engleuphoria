import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  PlayCircle,
  Calendar,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ClassroomConnectionProps {
  lesson: {
    id: string;
    title: string;
    scheduled_at: string;
    duration: number;
    room_id: string;
    room_link: string;
    teacher_id: string;
    student_id: string;
    teacher_name?: string;
    student_name?: string;
    status: string;
  };
  userRole: 'teacher' | 'student';
  onJoinClassroom?: () => void;
}

export const ClassroomConnection: React.FC<ClassroomConnectionProps> = ({
  lesson,
  userRole,
  onJoinClassroom
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [timeUntilClass, setTimeUntilClass] = useState('');
  const [canJoin, setCanJoin] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const updateTimeStatus = () => {
      const now = new Date();
      const lessonTime = new Date(lesson.scheduled_at);
      const timeDiff = lessonTime.getTime() - now.getTime();
      
      // Allow joining 10 minutes before lesson time
      const canJoinTime = lessonTime.getTime() - (10 * 60 * 1000);
      const lessonEndTime = lessonTime.getTime() + (lesson.duration * 60 * 1000);
      
      setCanJoin(now.getTime() >= canJoinTime && now.getTime() <= lessonEndTime);
      setIsLive(now.getTime() >= lessonTime.getTime() && now.getTime() <= lessonEndTime);
      
      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
          setTimeUntilClass(`${hours}h ${minutes}m`);
        } else if (minutes > 0) {
          setTimeUntilClass(`${minutes}m`);
        } else {
          setTimeUntilClass('Starting soon...');
        }
      } else if (now.getTime() <= lessonEndTime) {
        setTimeUntilClass('Class in session');
      } else {
        setTimeUntilClass('Class ended');
      }
    };

    updateTimeStatus();
    const interval = setInterval(updateTimeStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lesson.scheduled_at, lesson.duration]);

  const handleJoinClassroom = () => {
    if (!canJoin) {
      toast({
        title: "Cannot Join Yet",
        description: "The classroom opens 10 minutes before the lesson starts.",
        variant: "destructive"
      });
      return;
    }

    try {
      const url = new URL(lesson.room_link);
      url.searchParams.set('role', userRole);
      url.searchParams.set('name', userRole === 'teacher' ? 'Teacher' : 'Student');
      url.searchParams.set('userId', user?.id || '');
      
      // Open in new tab for better UX
      window.open(url.toString(), '_blank');
      
      toast({
        title: "Joining Classroom",
        description: `Opening ${lesson.title} in a new tab`,
      });

      onJoinClassroom?.();
    } catch (error) {
      console.error('Error joining classroom:', error);
      toast({
        title: "Error",
        description: "Failed to join classroom. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = () => {
    if (isLive) {
      return <Badge className="bg-red-500 text-white">● LIVE</Badge>;
    } else if (canJoin) {
      return <Badge className="bg-green-500 text-white">Ready to Join</Badge>;
    } else if (timeUntilClass === 'Class ended') {
      return <Badge variant="secondary">Ended</Badge>;
    } else {
      return <Badge variant="outline">Scheduled</Badge>;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6 text-blue-600" />
            {lesson.title}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Lesson Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatTime(lesson.scheduled_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{lesson.duration} minutes</span>
          </div>
          
          {userRole === 'student' && lesson.teacher_name && (
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-sm">Teacher: {lesson.teacher_name}</span>
            </div>
          )}
          
          {userRole === 'teacher' && lesson.student_name && (
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-sm">Student: {lesson.student_name}</span>
            </div>
          )}
        </div>

        {/* Status and Countdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLive ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : canJoin ? (
                <PlayCircle className="h-5 w-5 text-blue-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              )}
              <span className="font-medium text-gray-700">
                {timeUntilClass}
              </span>
            </div>
            
            <div className="text-sm text-gray-500">
              Room: {lesson.room_id}
            </div>
          </div>
        </div>

        {/* Join Button */}
        <div className="flex justify-center pt-2">
          <Button
            onClick={handleJoinClassroom}
            disabled={!canJoin}
            size="lg"
            className={`w-full max-w-sm ${
              isLive 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : canJoin 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400'
            }`}
          >
            {isLive ? (
              <>
                <Video className="h-5 w-5 mr-2" />
                Join Live Class
              </>
            ) : canJoin ? (
              <>
                <PlayCircle className="h-5 w-5 mr-2" />
                Join Classroom
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 mr-2" />
                {timeUntilClass === 'Class ended' ? 'Class Ended' : 'Opens 10 min before'}
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        {canJoin && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              💡 Click "Join Classroom" to open the lesson in a new tab. 
              Make sure your camera and microphone are ready!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};