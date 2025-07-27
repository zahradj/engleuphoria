import React, { useState } from 'react';
import { Plus, Calendar, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackNavigation } from '@/components/navigation/BackNavigation';
import { NavigationBreadcrumb } from '@/components/navigation/Breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { usePackageValidation } from '@/hooks/usePackageValidation';
import { PackageRequiredModal } from '@/components/package/PackageRequiredModal';

const BookLesson = () => {
  const { user } = useAuth();
  const { hasActivePackages, totalCredits, loading } = usePackageValidation(user?.id || null);
  const [showModal, setShowModal] = useState(false);

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

  // Show package requirement modal if no active packages
  React.useEffect(() => {
    if (!loading && !hasActivePackages) {
      setShowModal(true);
    }
  }, [loading, hasActivePackages]);

  // Don't render teacher list if no packages
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <BackNavigation />
          <NavigationBreadcrumb items={breadcrumbs} />
          
          <div className="flex items-center gap-3 mb-6">
            <Plus className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Book a Lesson</h1>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!hasActivePackages) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <BackNavigation />
          <NavigationBreadcrumb items={breadcrumbs} />
          
          <div className="flex items-center gap-3 mb-6">
            <Plus className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Book a Lesson</h1>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Lesson Package Required</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Please purchase a lesson package to access the booking calendar and schedule lessons with our teachers.
              </p>
              <Button 
                onClick={() => window.location.href = '/pricing'}
                className="bg-gradient-to-r from-student to-student-accent hover:from-student-dark hover:to-student text-white"
              >
                Purchase Lesson Package
              </Button>
            </CardContent>
          </Card>

          <PackageRequiredModal 
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackNavigation />
        <NavigationBreadcrumb items={breadcrumbs} />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Plus className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Book a Lesson</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Available Credits</p>
            <p className="text-2xl font-bold text-student">{totalCredits}</p>
          </div>
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