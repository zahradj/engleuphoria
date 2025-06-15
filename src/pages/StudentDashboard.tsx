
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, User, BookOpen, Trophy } from 'lucide-react';
import { useClassroomAuth } from '@/hooks/useClassroomAuth';
import { classroomDatabase, Lesson } from '@/services/classroomDatabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const StudentDashboard = () => {
  const { user } = useClassroomAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
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
      const lessonData = await classroomDatabase.getLessonsByStudent(user.id);
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

  const handleJoinClassroom = (lesson: Lesson) => {
    navigate(`/classroom/student/${lesson.room_id}`);
    toast({
      title: "Joining Classroom",
      description: `Joining lesson: ${lesson.title}`,
    });
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

  const isLessonSoon = (scheduledAt: string) => {
    const lessonTime = new Date(scheduledAt);
    const now = new Date();
    const timeDiff = lessonTime.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 15 * 60 * 1000; // Within 15 minutes
  };

  if (!user) return null;

  const upcomingLessons = lessons.filter(l => l.status === 'scheduled');
  const completedLessons = lessons.filter(l => l.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user.full_name}!
          </h1>
          <p className="text-gray-600">Your learning journey continues here</p>
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
                  <p className="text-2xl font-bold text-gray-800">{upcomingLessons.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed Lessons</p>
                  <p className="text-2xl font-bold text-gray-800">{completedLessons.length}</p>
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
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  My Lessons
                </CardTitle>
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
                    <p className="text-sm text-gray-500">Your teacher will schedule lessons for you</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lessons.map((lesson) => {
                      const { date, time } = formatDateTime(lesson.scheduled_at);
                      const isSoon = isLessonSoon(lesson.scheduled_at);
                      
                      return (
                        <div key={lesson.id} className={`p-4 border rounded-lg transition-all ${
                          isSoon ? 'border-green-300 bg-green-50 shadow-md' : 'border-gray-200 hover:shadow-md'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                                <Badge className={getStatusColor(lesson.status)}>
                                  {lesson.status}
                                </Badge>
                                {isSoon && (
                                  <Badge className="bg-green-100 text-green-800 animate-pulse">
                                    Starting Soon!
                                  </Badge>
                                )}
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
                                  <User className="h-4 w-4" />
                                  <span>Teacher: {lesson.teacher?.full_name}</span>
                                </div>
                              </div>
                              
                              {lesson.notes && (
                                <p className="text-sm text-gray-500 mt-2">{lesson.notes}</p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              {(lesson.status === 'scheduled' || lesson.status === 'live') && (
                                <Button 
                                  onClick={() => handleJoinClassroom(lesson)}
                                  className={isSoon || lesson.status === 'live' 
                                    ? "bg-green-600 hover:bg-green-700 animate-pulse" 
                                    : "bg-blue-600 hover:bg-blue-700"
                                  }
                                >
                                  <Video className="h-4 w-4 mr-2" />
                                  {lesson.status === 'live' ? 'Join Now' : 'Join Classroom'}
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

          {/* Progress & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Learning Progress */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lessons Completed</span>
                      <span>{completedLessons.length}/{lessons.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: lessons.length > 0 ? `${(completedLessons.length / lessons.length) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Next Milestone</p>
                    <p className="text-xs text-gray-500">Complete 5 more lessons to unlock achievement badge!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/classroom')}
                  className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100"
                  variant="ghost"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Test Classroom
                </Button>
                <Button 
                  className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100"
                  variant="ghost"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study Materials
                </Button>
                <Button 
                  className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100"
                  variant="ghost"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
