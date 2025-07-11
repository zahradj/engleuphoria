import React from 'react';
import { Plus, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackNavigation } from '@/components/navigation/BackNavigation';
import { NavigationBreadcrumb } from '@/components/navigation/Breadcrumb';

const BookLesson = () => {
  const breadcrumbs = [
    { label: 'Dashboard', path: '/student' },
    { label: 'Book Lesson', path: '/student/book-lesson' }
  ];

  const availableTeachers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialization: 'Conversation & Grammar',
      rating: 4.9,
      nextAvailable: 'Today 2:00 PM'
    },
    {
      id: 2,
      name: 'Mike Davis',
      specialization: 'Business English',
      rating: 4.8,
      nextAvailable: 'Tomorrow 10:00 AM'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackNavigation />
        <NavigationBreadcrumb items={breadcrumbs} />
        
        <div className="flex items-center gap-3 mb-6">
          <Plus className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Book a Lesson</h1>
        </div>

        <div className="grid gap-6">
          {availableTeachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6" />
                    <div>
                      <span>{teacher.name}</span>
                      <p className="text-sm text-muted-foreground font-normal">
                        {teacher.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-normal">⭐ {teacher.rating}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Next available: {teacher.nextAvailable}
                  </div>
                  <Button>Book Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookLesson;