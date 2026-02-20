import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Video,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useNextClassCountdown } from '@/hooks/useNextClassCountdown';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface NextLessonCardProps {
  disabled?: boolean;
}

export const NextLessonCard: React.FC<NextLessonCardProps> = ({ disabled = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch real upcoming lesson from DB using the existing RPC
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['teacher-next-lesson', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.rpc('get_teacher_upcoming_lessons', {
        teacher_uuid: user.id,
      });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
    refetchInterval: 60_000, // refresh every minute
  });

  const nextLesson = lessons?.[0] ?? null;
  const scheduledAt = nextLesson ? new Date(nextLesson.scheduled_at) : new Date(Date.now() + 3_600_000);

  const { formattedTime, canEnter, isStartingSoon, hasStarted } = useNextClassCountdown(scheduledAt);

  const buttonEnabled = !disabled && !!nextLesson && (canEnter || hasStarted);

  const handleEnterClassroom = () => {
    if (!buttonEnabled || !nextLesson) return;
    // Prefer room_id if set, otherwise use lesson id
    const roomId = nextLesson.room_id || nextLesson.id;
    navigate(`/classroom/${roomId}`);
  };

  const getBadgeContent = () => {
    if (!nextLesson) return 'No upcoming lessons';
    if (hasStarted) return 'Starting Now!';
    return `In ${formattedTime}`;
  };

  const getBadgeVariant = (): 'default' | 'secondary' | 'destructive' => {
    if (!nextLesson) return 'secondary';
    if (hasStarted) return 'destructive';
    if (isStartingSoon) return 'default';
    return 'secondary';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Next Lesson
          </CardTitle>
          {!isLoading && (
            <Badge
              variant={getBadgeVariant()}
              className={`${
                (isStartingSoon || hasStarted) && nextLesson
                  ? 'animate-pulse bg-emerald-500 text-white'
                  : ''
              }`}
            >
              {getBadgeContent()}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !nextLesson ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm">No upcoming lessons scheduled.</p>
            <p className="text-muted-foreground text-xs mt-1">
              Students will appear here once they book a slot.
            </p>
          </div>
        ) : (
          <>
            {/* Date & Time */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{format(scheduledAt, 'EEEE, MMM d')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{format(scheduledAt, 'h:mm a')}</span>
              </div>
            </div>

            {/* Lesson Title */}
            <div>
              <p className="font-semibold text-foreground">
                {nextLesson.title || 'English Lesson'}
              </p>
            </div>

            {/* Student Info */}
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {nextLesson.student_name || 'Student'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nextLesson.duration} min session
                </p>
              </div>
            </div>

            {/* Countdown when not yet ready */}
            {!canEnter && !disabled && !hasStarted && (
              <div className="text-center py-2 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Classroom opens in{' '}
                  <span className="font-mono font-bold text-foreground">{formattedTime}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You can enter 5 minutes before class starts
                </p>
              </div>
            )}
          </>
        )}

        {/* Enter Classroom Button */}
        <Button
          onClick={handleEnterClassroom}
          disabled={!buttonEnabled}
          size="lg"
          className={`w-full transition-all duration-300 ${
            !buttonEnabled
              ? 'bg-muted text-muted-foreground'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25'
          } ${(isStartingSoon || hasStarted) && nextLesson ? 'animate-pulse' : ''}`}
        >
          <Video className="w-5 h-5 mr-2" />
          {hasStarted ? 'Join Now!' : 'Enter Classroom'}
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
