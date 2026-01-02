import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  MessageSquare, 
  Video,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

interface NextLessonCardProps {
  disabled?: boolean;
}

export const NextLessonCard: React.FC<NextLessonCardProps> = ({ disabled = false }) => {
  const navigate = useNavigate();

  // Mock data - in production this would come from a lessons query
  const nextLesson = {
    id: 'lesson-1',
    scheduledAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins from now
    title: 'English 101 - Speaking Practice',
    studentName: 'Alex M.',
    studentAge: 12,
    studentId: 'STU-001',
    lastFeedback: 'Great progress on pronunciation!'
  };

  const handleEnterClassroom = () => {
    if (!disabled) {
      navigate(`/classroom/${nextLesson.id}`);
    }
  };

  const minutesUntil = Math.max(0, Math.round((nextLesson.scheduledAt.getTime() - Date.now()) / 60000));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Next Lesson
          </CardTitle>
          <Badge variant={minutesUntil <= 5 ? 'destructive' : 'secondary'}>
            {minutesUntil <= 0 ? 'Starting Now' : `In ${minutesUntil} min`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Date & Time */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(nextLesson.scheduledAt, 'EEEE, MMM d')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{format(nextLesson.scheduledAt, 'h:mm a')}</span>
          </div>
        </div>

        {/* Lesson Title */}
        <div>
          <p className="font-semibold text-foreground">{nextLesson.title}</p>
        </div>

        {/* Student Info */}
        <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{nextLesson.studentName}</p>
            <p className="text-xs text-muted-foreground">
              Age {nextLesson.studentAge} • ID: {nextLesson.studentId}
            </p>
          </div>
        </div>

        {/* Last Feedback */}
        <div className="flex items-start gap-2 text-sm">
          <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div>
            <span className="text-muted-foreground">Last feedback: </span>
            <span className="text-foreground">{nextLesson.lastFeedback}</span>
          </div>
        </div>

        {/* Enter Classroom Button */}
        <Button
          onClick={handleEnterClassroom}
          disabled={disabled}
          size="lg"
          className={`w-full ${
            disabled 
              ? 'bg-muted text-muted-foreground' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white animate-pulse'
          }`}
        >
          <Video className="w-5 h-5 mr-2" />
          Enter Classroom
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>

        {disabled && (
          <p className="text-xs text-center text-muted-foreground">
            Available after profile approval
          </p>
        )}
      </CardContent>
    </Card>
  );
};
