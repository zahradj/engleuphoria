
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClassroomAuth } from '@/hooks/useClassroomAuth';
import { classroomDatabase, Lesson } from '@/services/classroomDatabase';
import { useToast } from '@/hooks/use-toast';
import { UnifiedClassroom } from '@/pages/UnifiedClassroom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface ProtectedClassroomProps {
  userRole: 'teacher' | 'student';
}

export const ProtectedClassroom = ({ userRole }: ProtectedClassroomProps) => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useClassroomAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !roomId) {
      setError('User not authenticated or room ID missing');
      setLoading(false);
      return;
    }

    validateRoomAccess();
  }, [user, roomId]);

  const validateRoomAccess = async () => {
    if (!user || !roomId) return;

    try {
      // Get lesson by room ID
      const lessonData = await classroomDatabase.getLessonByRoomId(roomId);
      
      // Check if user has access to this room
      const hasAccess = userRole === 'teacher' 
        ? lessonData.teacher_id === user.id
        : lessonData.student_id === user.id;

      if (!hasAccess) {
        setError('You do not have access to this classroom');
        setLoading(false);
        return;
      }

      // Check if user role matches the route
      if (user.role !== userRole) {
        setError(`This is a ${userRole} classroom, but you are logged in as a ${user.role}`);
        setLoading(false);
        return;
      }

      setLesson(lessonData);
      setLoading(false);

      // Show welcome message
      toast({
        title: `Welcome to ${lessonData.title}`,
        description: `${userRole === 'teacher' ? 'You can now start teaching' : 'You can now start learning'}`,
      });

    } catch (error) {
      console.error('Error validating room access:', error);
      setError('Room not found or access denied');
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(userRole === 'teacher' ? '/teacher' : '/student');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Validating Access</h2>
            <p className="text-gray-600">Checking classroom permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={handleGoBack} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center p-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Classroom Not Found</h2>
            <p className="text-gray-600 mb-6">The requested classroom could not be found.</p>
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the unified classroom with role-specific context
  return (
    <UnifiedClassroom 
      lesson={lesson}
      userRole={userRole}
      currentUser={user}
    />
  );
};
