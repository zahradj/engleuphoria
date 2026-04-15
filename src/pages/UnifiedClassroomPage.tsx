import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TeacherClassroom } from '@/components/teacher/classroom';
import { StudentClassroom } from '@/components/student/classroom';

import { PreFlightCheck } from '@/components/classroom/PreFlightCheck';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, ShieldOff, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Unified Classroom Page
 * 
 * Single route: /classroom/:bookingId
 * 
 * Determines whether to render TeacherClassroom or StudentClassroom
 * based on the booking record. Admins get "God Mode" access.
 */
const UnifiedClassroomPage: React.FC = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [preFlightPassed, setPreFlightPassed] = useState(false);

  const userRole = (user as any)?.role;
  const isAdmin = userRole === 'admin';

  // Fetch booking to determine participant role
  const { data: booking, isLoading: bookingLoading, error: bookingError } = useQuery({
    queryKey: ['classroom-booking', bookingId, user?.id],
    queryFn: async () => {
      if (!bookingId || !user?.id) return null;
      const { data, error } = await supabase
        .from('class_bookings')
        .select('id, teacher_id, student_id, scheduled_at, duration, status, hub_type')
        .eq('id', bookingId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!bookingId && !!user?.id,
  });

  // Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-foreground text-lg font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!bookingId) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (bookingLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-foreground text-lg font-medium">Verifying classroom access...</p>
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  // Booking not found
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <ShieldOff className="w-10 h-10 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Booking Not Found</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This classroom session does not exist or has been cancelled.
            </p>
            {isAdmin && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-left text-xs">
                <div className="flex items-center gap-2 mb-1 text-yellow-400 font-semibold">
                  <Bug className="h-3 w-3" /> Admin Debug
                </div>
                <p className="text-muted-foreground">
                  Booking ID: <code className="text-foreground">{bookingId}</code><br/>
                  User ID: <code className="text-foreground">{user.id}</code><br/>
                  Error: {bookingError?.message || 'No booking found with this ID'}
                </p>
              </div>
            )}
          </div>
          <Button onClick={() => window.history.back()} variant="outline">Go back</Button>
        </div>
      </div>
    );
  }

  // Determine classroom role
  const isTeacher = booking.teacher_id === user.id;
  const isStudent = booking.student_id === user.id;
  const hasAccess = isTeacher || isStudent || isAdmin;

  // Access denied
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <ShieldOff className="w-10 h-10 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">This session is private</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You don't have access to this classroom. Only the student and teacher
              associated with this booking can enter.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-left text-xs">
              <p className="text-muted-foreground">
                <strong>ID Mismatch:</strong><br/>
                Your ID: <code className="text-foreground">{user.id}</code><br/>
                Booking Teacher: <code className="text-foreground">{booking.teacher_id}</code><br/>
                Booking Student: <code className="text-foreground">{booking.student_id}</code>
              </p>
            </div>
          </div>
          <Button onClick={() => window.history.back()} variant="outline">Go back</Button>
        </div>
      </div>
    );
  }

  // Admin "God Mode" — admin enters as teacher view by default
  const classroomRole: 'teacher' | 'student' = isTeacher || (isAdmin && !isStudent) ? 'teacher' : 'student';

  if (!preFlightPassed) {
    return (
      <PreFlightCheck
        onComplete={() => setPreFlightPassed(true)}
        hubType="academy"
        role={classroomRole}
      />
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Participant';

  if (classroomRole === 'teacher') {
    return (
      <TeacherClassroom
        classId={bookingId}
        teacherName={displayName}
      />
    );
  }

  return (
    <StudentClassroom
      roomId={bookingId}
      studentId={user.id}
      studentName={displayName}
    />
  );
};

export default UnifiedClassroomPage;
