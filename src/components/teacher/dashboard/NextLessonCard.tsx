import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClassStartTiming } from '@/hooks/useClassStartTiming';

interface NextLessonCardProps {
  lesson: any;
  teacherName: string;
}

export const NextLessonCard = ({ lesson, teacherName }: NextLessonCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const timing = useClassStartTiming(
    lesson?.scheduled_at || new Date().toISOString(), 
    lesson?.duration || 55
  );

  if (!lesson) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Next lesson
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No upcoming lessons</p>
        </CardContent>
      </Card>
    );
  }

  const lessonDate = new Date(lesson.scheduled_at);
  const dateStr = lessonDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = lessonDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleEnterClassroom = () => {
    navigate(`/classroom?roomId=${lesson.room_id}&role=teacher&name=${encodeURIComponent(teacherName)}&userId=${user?.id}`);
  };

  return (
    <Card className="border-2 border-purple-200 shadow-md bg-gradient-to-br from-white to-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          Next lesson
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{dateStr} at {timeStr}</span>
          </div>
          {timing.minutesUntil > 0 && (
            <div className="text-lg font-bold text-purple-600">
              Starts in {timing.minutesUntil} minutes
            </div>
          )}
        </div>

        <div className="space-y-2 p-3 bg-white rounded-lg">
          <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{lesson.student_name}</span>
            {lesson.student_id && (
              <span className="text-xs text-gray-500">
                #{lesson.student_id.slice(-6).toUpperCase()}
              </span>
            )}
          </div>
          {lesson.student_cefr_level && (
            <div className="text-xs text-gray-600">
              Level: {lesson.student_cefr_level}
            </div>
          )}
        </div>

        <Button 
          onClick={handleEnterClassroom}
          disabled={!timing.canStart}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
        >
          Enter classroom
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {!timing.canStart && timing.minutesUntil > 0 && (
          <p className="text-xs text-center text-gray-500">{timing.statusMessage}</p>
        )}
      </CardContent>
    </Card>
  );
};
