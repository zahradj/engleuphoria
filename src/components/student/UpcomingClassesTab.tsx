
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, User, CheckCircle } from "lucide-react";
import { CompletedLessonCard } from "./CompletedLessonCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface Lesson {
  id: string;
  title: string;
  teacher_id: string;
  teacher_name?: string;
  scheduled_at: string;
  duration: number;
  status: string;
  completed_at?: string;
  room_link?: string;
}

export const UpcomingClassesTab = () => {
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Fetch lessons with teacher information
      const { data: lessons, error } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          teacher_id,
          scheduled_at,
          duration,
          status,
          completed_at,
          room_link,
          users!inner(full_name)
        `)
        .eq('student_id', user.user.id)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;

      const formattedLessons = (lessons || []).map(lesson => ({
        ...lesson,
        teacher_name: Array.isArray(lesson.users) && lesson.users.length > 0 
          ? lesson.users[0].full_name 
          : 'Teacher'
      }));

      // Separate upcoming and completed lessons
      const now = new Date();
      const upcoming = formattedLessons.filter(lesson => 
        ['scheduled', 'confirmed'].includes(lesson.status) && 
        new Date(lesson.scheduled_at) > now
      );
      
      const completed = formattedLessons.filter(lesson => 
        lesson.status === 'completed'
      );

      setUpcomingLessons(upcoming);
      setCompletedLessons(completed);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast({
        title: "Error",
        description: "Failed to load your lessons. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleJoinClass = (lesson: Lesson) => {
    if (lesson.room_link) {
      // Use the existing room link with student parameters
      const url = new URL(lesson.room_link);
      url.searchParams.set('role', 'student');
      url.searchParams.set('name', 'Student');
      url.searchParams.set('userId', user?.id || '');
      
      // Open in new tab for better UX
      window.open(url.toString(), '_blank');
    } else {
      toast({
        title: "Room Link Not Available",
        description: "The classroom link is not available yet. Please try again closer to the lesson time.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">My Lessons</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Lessons</h1>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New Lesson
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingLessons.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedLessons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingLessons.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Upcoming Lessons</h3>
                <p className="text-gray-500 mb-4">You don't have any lessons scheduled at the moment.</p>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Your First Lesson
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingLessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                          {lesson.status === 'confirmed' ? 'Confirmed' : 'Scheduled'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(lesson.scheduled_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(lesson.scheduled_at)} ({lesson.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{lesson.teacher_name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleJoinClass(lesson)}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Join Lesson
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedLessons.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Completed Lessons</h3>
                <p className="text-gray-500 mb-4">Your completed lessons will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            completedLessons.map((lesson) => (
              <CompletedLessonCard 
                key={lesson.id} 
                lesson={lesson}
                onUpdate={fetchLessons}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
