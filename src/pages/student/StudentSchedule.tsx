import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackNavigation } from '@/components/navigation/BackNavigation';
import { NavigationBreadcrumb } from '@/components/navigation/Breadcrumb';

const StudentSchedule = () => {
  const breadcrumbs = [
    { label: 'Dashboard', path: '/student' },
    { label: 'Schedule', path: '/student/schedule' }
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: 'English Conversation',
      teacher: 'Sarah Johnson',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '60 minutes'
    },
    {
      id: 2,
      title: 'Grammar Practice',
      teacher: 'Mike Davis',
      date: '2024-01-17',
      time: '2:00 PM',
      duration: '45 minutes'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackNavigation />
        <NavigationBreadcrumb items={breadcrumbs} />
        
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Schedule</h1>
        </div>

        <div className="grid gap-6">
          {upcomingLessons.map((lesson) => (
            <Card key={lesson.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{lesson.title}</span>
                  <span className="text-sm text-muted-foreground">{lesson.date}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {lesson.teacher}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lesson.time} ({lesson.duration})
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;