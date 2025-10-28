import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackNavigation } from '@/components/navigation/BackNavigation';
import { NavigationBreadcrumb } from '@/components/navigation/Breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { usePackageValidation } from '@/hooks/usePackageValidation';
import { PackageRequiredModal } from '@/components/package/PackageRequiredModal';
import { InstructionPrompt } from '@/components/shared/InstructionPrompt';
import { StudentBookingCalendar } from '@/components/student/StudentBookingCalendar';
import { teacherAvailabilityService, AvailableTimeSlot } from '@/services/teacherAvailabilityService';
import { lessonService } from '@/services/lessonService';
import { useToast } from '@/hooks/use-toast';

const BookLesson = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasActivePackages, totalCredits, loading } = usePackageValidation(user?.id || null);
  const [showModal, setShowModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const breadcrumbs = [
    { label: 'Dashboard', path: '/student' },
    { label: 'Book Lesson', path: '/student/book-lesson' }
  ];

  // Load available slots when user has packages
  useEffect(() => {
    if (!loading && hasActivePackages) {
      loadAvailableSlots();
    } else if (!loading && !hasActivePackages) {
      setShowModal(true);
    }
  }, [loading, hasActivePackages]);

  const loadAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const slots = await teacherAvailabilityService.getAvailableSlots();
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading available slots:', error);
      toast({
        title: "Error",
        description: "Failed to load available time slots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookLesson = async (slot: AvailableTimeSlot) => {
    if (!user?.id) return;

    try {
      setIsBooking(true);

      // Get user's packages using the hook (need to fetch fresh data)
      const { lessonPricingService } = await import('@/services/lessonPricingService');
      const packages = await lessonPricingService.getStudentPackages(user.id);
      
      // Find matching package by duration
      const matchingPackage = packages.find(
        pkg => pkg.package.duration_minutes === slot.duration && pkg.lessons_remaining > 0
      );

      if (!matchingPackage) {
        toast({
          title: "No Matching Package",
          description: `You need a ${slot.duration}-minute lesson package to book this slot. Please purchase one from the pricing page.`,
          variant: "destructive"
        });
        return;
      }

      console.log('📦 Using package:', {
        packageId: matchingPackage.id,
        duration: slot.duration,
        durationType: typeof slot.duration,
        creditsRemaining: matchingPackage.lessons_remaining
      });

      await lessonService.createLesson(
        {
          title: `Lesson with ${slot.teacherName}`,
          teacher_id: slot.teacherId,
          student_id: user.id,
          scheduled_at: slot.startTime.toISOString(),
          duration: Number(slot.duration) // Explicit number conversion
        },
        matchingPackage.id // Pass package ID for credit deduction
      );

      toast({
        title: "Lesson Booked!",
        description: `Your lesson with ${slot.teacherName} has been scheduled for ${slot.startTime.toLocaleString()}. Credits remaining: ${matchingPackage.lessons_remaining - 1}`
      });

      // Reload available slots
      await loadAvailableSlots();
    } catch (error: any) {
      console.error('Error booking lesson:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to book the lesson. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

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
                onClick={() => navigate('/pricing')}
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

        {/* Instruction Prompt */}
        <InstructionPrompt
          icon="📚"
          title="Book a Lesson"
          description="Choose a day and time from your teacher's available slots below. Only available times are shown. After booking, you'll receive a confirmation and the lesson will appear in your dashboard."
        />

        {/* Booking Calendar */}
        {loadingSlots ? (
          <Card>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ) : availableSlots.length > 0 ? (
          <StudentBookingCalendar
            availableSlots={availableSlots.map(slot => ({
              id: slot.id,
              teacherId: slot.teacherId,
              teacherName: slot.teacherName,
              startTime: slot.startTime,
              endTime: slot.endTime,
              duration: slot.duration,
              isAvailable: slot.isAvailable
            }))}
            onBookLesson={handleBookLesson}
            isLoading={isBooking}
          />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No Available Slots</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are currently no available time slots from teachers. Please check back later.
              </p>
              <Button onClick={loadAvailableSlots}>Refresh</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookLesson;