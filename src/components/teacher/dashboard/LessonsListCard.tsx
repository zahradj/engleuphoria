import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Video, MessageSquare, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface Lesson {
  id: string;
  scheduledAt: Date;
  title: string;
  studentName: string;
  studentAge: number;
  status: 'upcoming' | 'completed' | 'needs-feedback';
}

const mockLessons: Lesson[] = [
  {
    id: '1',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    title: 'Speaking Practice',
    studentName: 'Alex M.',
    studentAge: 12,
    status: 'upcoming'
  },
  {
    id: '2',
    scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    title: 'Grammar Basics',
    studentName: 'Sarah K.',
    studentAge: 10,
    status: 'upcoming'
  },
  {
    id: '3',
    scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    title: 'Reading Comprehension',
    studentName: 'John D.',
    studentAge: 14,
    status: 'completed'
  },
  {
    id: '4',
    scheduledAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    title: 'Vocabulary Building',
    studentName: 'Emma L.',
    studentAge: 11,
    status: 'needs-feedback'
  },
];

interface LessonItemProps {
  lesson: Lesson;
  showEnterButton?: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, showEnterButton }) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-foreground truncate">{lesson.title}</p>
          {lesson.status === 'needs-feedback' && (
            <Badge variant="destructive" className="text-xs">Needs Feedback</Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(lesson.scheduledAt, 'MMM d')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(lesson.scheduledAt, 'h:mm a')}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {lesson.studentName} ({lesson.studentAge}y)
          </span>
        </div>
      </div>
      
      {showEnterButton && (
        <Button size="sm" className="gap-1 shrink-0">
          <Video className="w-4 h-4" />
          Enter
        </Button>
      )}
      
      {lesson.status === 'needs-feedback' && (
        <Button size="sm" variant="outline" className="gap-1 shrink-0">
          <MessageSquare className="w-4 h-4" />
          Feedback
        </Button>
      )}
      
      {lesson.status === 'completed' && (
        <Button size="sm" variant="ghost" className="shrink-0">
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export const LessonsListCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingLessons = mockLessons.filter(l => l.status === 'upcoming');
  const pastLessons = mockLessons.filter(l => l.status === 'completed');
  const needsFeedback = mockLessons.filter(l => l.status === 'needs-feedback');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Lessons Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
              Upcoming ({upcomingLessons.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="text-xs sm:text-sm">
              Past ({pastLessons.length})
            </TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm">
              No Feedback ({needsFeedback.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-2">
            {upcomingLessons.length > 0 ? (
              upcomingLessons.map(lesson => (
                <LessonItem key={lesson.id} lesson={lesson} showEnterButton />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No upcoming lessons</p>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-2">
            {pastLessons.length > 0 ? (
              pastLessons.map(lesson => (
                <LessonItem key={lesson.id} lesson={lesson} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No past lessons</p>
            )}
          </TabsContent>
          
          <TabsContent value="feedback" className="space-y-2">
            {needsFeedback.length > 0 ? (
              needsFeedback.map(lesson => (
                <LessonItem key={lesson.id} lesson={lesson} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">All feedback completed!</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
