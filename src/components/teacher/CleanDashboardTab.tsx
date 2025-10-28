import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Users,
  Star,
  DollarSign,
  Clock,
  BookOpen,
  MessageSquare,
  Award,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { lessonService } from '@/services/lessonService';
import { useNavigate } from 'react-router-dom';

interface CleanDashboardTabProps {
  teacherName: string;
}

export const CleanDashboardTab = ({ teacherName }: CleanDashboardTabProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingLessons, setUpcomingLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const lessons = await lessonService.getTeacherUpcomingLessons(user.id);
        setUpcomingLessons(lessons.slice(0, 5));
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [user?.id]);
  const kpis = [
    {
      title: 'Classes Today',
      value: '3',
      icon: Calendar,
      color: 'text-primary'
    },
    {
      title: 'Active Students',
      value: '24',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      icon: Star,
      color: 'text-warning'
    },
    {
      title: 'This Month',
      value: '$2,847',
      icon: DollarSign,
      color: 'text-success'
    }
  ];

  const todayLessons = upcomingLessons.filter(lesson => {
    const lessonDate = new Date(lesson.scheduled_at);
    const today = new Date();
    return lessonDate.toDateString() === today.toDateString();
  });

  const weeklyProgress = [
    { day: 'Mon', classes: 4, completed: 4 },
    { day: 'Tue', classes: 3, completed: 3 },
    { day: 'Wed', classes: 5, completed: 5 },
    { day: 'Thu', classes: 2, completed: 1 },
    { day: 'Fri', classes: 3, completed: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Good morning, {teacherName}! 
            </h1>
            <p className="text-muted-foreground">
              You have {todayLessons.length} classes scheduled for today. Ready to inspire your students?
            </p>
          </div>
          {todayLessons.length > 0 && (
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate('/classroom?role=teacher&name=' + encodeURIComponent(teacherName) + '&userId=' + user?.id)}
            >
              Start Class
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Weekly Schedule */}
        <Card className="lg:col-span-5 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              This Week's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Next Class with Countdown */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your schedule...</p>
                </div>
              ) : upcomingLessons.length > 0 ? (
                <>
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">Next Class: {upcomingLessons[0].title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Student: {upcomingLessons[0].student_name} 
                          {upcomingLessons[0].student_cefr_level && ` (${upcomingLessons[0].student_cefr_level} Level)`}
                        </p>
                        {upcomingLessons[0].student_id && (
                          <p className="text-xs text-muted-foreground">
                            #{upcomingLessons[0].student_id.slice(-6).toUpperCase()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {new Date(upcomingLessons[0].scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(upcomingLessons[0].scheduled_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{upcomingLessons[0].duration} minutes</span>
                        <Badge 
                          variant="secondary" 
                          className={upcomingLessons[0].duration === 25 ? "ml-2 bg-blue-500/10 text-blue-600 border-blue-500/20" : "ml-2 bg-purple-500/10 text-purple-600 border-purple-500/20"}
                        >
                          {upcomingLessons[0].duration} min
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => navigate(`/classroom?roomId=${upcomingLessons[0].room_id}&role=teacher&name=${encodeURIComponent(teacherName)}&userId=${user?.id}`)}
                      >
                        Start Class
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Other Upcoming Lessons */}
                  <div className="space-y-3">
                    {upcomingLessons.slice(1, 4).map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                        <div>
                          <h5 className="font-medium text-foreground text-sm">{lesson.title}</h5>
                          <p className="text-xs text-muted-foreground">
                            {lesson.student_name} • {new Date(lesson.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {lesson.duration} min
                        </Badge>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming lessons scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card className="lg:col-span-3 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : todayLessons.length > 0 ? (
              todayLessons.map((lesson) => (
                <div key={lesson.id} className="p-4 bg-surface-2 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{lesson.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lesson.student_name} {lesson.student_cefr_level && `(${lesson.student_cefr_level})`}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(lesson.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration} min
                    </span>
                    {lesson.student_id && (
                      <span className="flex items-center gap-1">
                        #{lesson.student_id.slice(-6).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No classes today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-5 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Recent Messages & Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Sarah completed Advanced Grammar Module 3',
                'New student enrolled in your Beginner class',
                'Assignment submissions ready for review (5)',
                'Parent feedback received for Emma Watson',
                'System update: New collaboration tools available'
              ].map((message, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-foreground flex-1">{message}</span>
                  <span className="text-xs text-muted-foreground">
                    {index + 1}h ago
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card className="lg:col-span-3 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Upcoming Lessons</span>
              <span className="text-lg font-semibold text-foreground">{upcomingLessons.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Student Progress</span>
              <span className="text-lg font-semibold text-success">+18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Satisfaction</span>
              <span className="text-lg font-semibold text-warning">4.8★</span>
            </div>
            <Button variant="outline" className="w-full mt-4 border-border hover:bg-primary/5 hover:border-primary/30">
              <BookOpen className="mr-2 h-4 w-4" />
              View Full Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};