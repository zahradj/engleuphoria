
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, Users, Plus, BookOpen } from 'lucide-react';
import { useClassroomAuth } from '@/hooks/useClassroomAuth';
import { classroomDatabase, Lesson } from '@/services/classroomDatabase';
import { ScheduleLessonModal } from '@/components/scheduling/ScheduleLessonModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const TeacherDashboard = () => {
  const { user } = useClassroomAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadLessons();
    }
  }, [user]);

  const loadLessons = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const lessonData = await classroomDatabase.getLessonsByTeacher(user.id);
      setLessons(lessonData);
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast({
        title: "Error",
        description: "Failed to load lessons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClassroom = async (lesson: Lesson) => {
    try {
      // Update lesson status to live
      await classroomDatabase.updateLessonStatus(lesson.id, 'live');
      
      // Navigate to teacher classroom
      navigate(`/classroom/teacher/${lesson.room_id}`);
      
      toast({
        title: "Joining Classroom",
        description: `Starting lesson: ${lesson.title}`,
      });
    } catch (error) {
      console.error('Error joining classroom:', error);
      toast({
        title: "Error",
        description: "Failed to join classroom",
        variant: "destructive"
      });
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user.full_name}!
          </h1>
          <p className="text-gray-600">Manage your lessons and connect with students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming Lessons</p>
                  <p className="text-2xl font-bold text-gray-800">{lessons.filter(l => l.status === 'scheduled').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-gray-800">{new Set(lessons.map(l => l.student_id)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {lessons.filter(l => {
                      const lessonDate = new Date(l.scheduled_at);
                      const now = new Date();
                      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
                      return lessonDate >= weekStart && lessonDate < weekEnd;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lessons List */}
          <div className="lg:col-span-8">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Upcoming Lessons
                  </CardTitle>
                  <Button onClick={() => setIsScheduleModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Lesson
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : lessons.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No lessons scheduled yet</p>
                    <Button onClick={() => setIsScheduleModalOpen(true)} variant="outline">
                      Schedule Your First Lesson
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessons.map((lesson) => {
                      const { date, time } = formatDateTime(lesson.scheduled_at);
                      return (
                        <div key={lesson.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                                <Badge className={getStatusColor(lesson.status)}>
                                  {lesson.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{time} ({lesson.duration} min)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{lesson.student?.full_name}</span>
                                </div>
                              </div>
                              
                              {lesson.notes && (
                                <p className="text-sm text-gray-500 mt-2">{lesson.notes}</p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              {lesson.status === 'scheduled' && (
                                <Button 
                                  onClick={() => handleJoinClassroom(lesson)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Video className="h-4 w-4 mr-2" />
                                  Start Lesson
                                </Button>
                              )}
                              {lesson.status === 'live' && (
                                <Button 
                                  onClick={() => navigate(`/classroom/teacher/${lesson.room_id}`)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Video className="h-4 w-4 mr-2" />
                                  Rejoin
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-4">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100"
                  variant="ghost"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New Lesson
                </Button>
                <Button 
                  onClick={() => navigate('/classroom')}
                  className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100"
                  variant="ghost"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Test Classroom
                </Button>
                <Button 
                  className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100"
                  variant="ghost"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Students
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Schedule Lesson Modal */}
      <ScheduleLessonModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        teacherId={user.id}
        onLessonScheduled={loadLessons}
      />
    </div>
  );
};
