import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  BookOpen,
  Calendar,
  Award,
  Clock,
  Users,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface CleanStudentDashboardProps {
  studentName: string;
  studentProfile?: any;
}

export const CleanStudentDashboard = ({ studentName, studentProfile }: CleanStudentDashboardProps) => {
  const { user } = useAuth();
  const currentLevel = studentProfile?.current_level || 'A1';
  const progressPercentage = studentProfile?.progress_percentage || 45;
  const streakDays = studentProfile?.streak_days || 7;
  const totalPoints = studentProfile?.points || 1250;

  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [learningModules, setLearningModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch upcoming lessons
        const { data: lessons } = await supabase
          .from('lessons')
          .select(`
            id,
            title,
            scheduled_at,
            duration,
            room_link,
            room_id,
            teacher:users!lessons_teacher_id_fkey(full_name)
          `)
          .eq('student_id', user.id)
          .eq('status', 'scheduled')
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(5);

        if (lessons) {
          setUpcomingClasses(lessons.map(lesson => ({
            title: lesson.title,
            teacher: (lesson.teacher as any)?.full_name || 'Teacher',
            time: new Date(lesson.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            duration: `${lesson.duration} min`,
            type: 'Live Class'
          })));
        }

        // Fetch homework assignments
        const { data: homework } = await supabase
          .from('homework')
          .select(`
            id,
            title,
            due_date,
            status,
            users!homework_teacher_id_fkey(full_name)
          `)
          .eq('student_id', user.id)
          .in('status', ['assigned', 'in_progress'])
          .order('due_date', { ascending: true })
          .limit(5);

        if (homework) {
          setAssignments(homework.map(hw => ({
            title: hw.title,
            subject: 'Homework',
            dueDate: new Date(hw.due_date).toLocaleDateString(),
            status: hw.status,
            statusColor: hw.status === 'assigned' ? 'yellow' : 'blue'
          })));
        }

        // Fetch curriculum progress
        const { data: progress } = await supabase
          .from('student_curriculum_progress')
          .select('current_week, current_lesson, completion_percentage, curriculum_id')
          .eq('student_id', user.id)
          .limit(3);

        if (progress && progress.length > 0) {
          setLearningModules(progress.map((p, idx) => ({
            title: `Week ${p.current_week} - Lesson ${p.current_lesson}`,
            level: currentLevel,
            progress: p.completion_percentage,
            lessons: `${Math.floor((p.completion_percentage / 100) * 8)}/8 lessons`,
            color: p.completion_percentage === 100 ? 'mint-green' : p.completion_percentage > 0 ? 'sky-blue' : 'border'
          })));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, currentLevel]);

  // Default fallback data if nothing is loaded yet
  const defaultData = {
    classes: upcomingClasses.length > 0 ? upcomingClasses : [
      {
        title: 'No upcoming classes',
        teacher: '',
        time: '',
        duration: '',
        type: 'Info'
      }
    ],
    assignments: assignments.length > 0 ? assignments : [
      {
        title: 'No assignments',
        subject: '',
        dueDate: '',
        status: 'info',
        statusColor: 'gray'
      }
    ],
    modules: learningModules.length > 0 ? learningModules : [
      {
        title: 'Start your learning journey',
        level: currentLevel,
        progress: 0,
        lessons: '0/8',
        color: 'border'
      }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section - Clean & Minimal */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-blue via-lavender to-mint-green rounded-2xl p-8 border border-border-light shadow-card">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
              Welcome back, {studentName}!
            </h1>
            <p className="text-text-muted text-base mb-6 font-medium">
              You're on a <span className="text-peach-dark font-semibold">{streakDays}-day</span> learning streak 🔥
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-border shadow-sm">
                <div className="w-10 h-10 bg-sky-blue rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-sky-blue-dark" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Level {currentLevel}</p>
                  <p className="text-xs text-text-muted">{progressPercentage}% Complete</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-border shadow-sm">
                <div className="w-10 h-10 bg-peach rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-peach-dark" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{totalPoints} XP</p>
                  <p className="text-xs text-text-muted">Total Points</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-text text-white hover:bg-text/90 shadow-sm transition-all duration-200 font-semibold px-6 py-6 rounded-xl text-base">
            Continue Learning
            <Play className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>


      {/* Progress Overview */}
      <Card className="border border-border bg-white shadow-card">
        <CardHeader className="bg-sky-blue border-b border-border-light p-6">
          <CardTitle className="text-xl font-semibold text-text flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-sky-blue-dark" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="bg-surface-soft rounded-xl p-5 border border-border-light">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-medium text-text">Level {currentLevel} Progress</span>
                <span className="text-lg font-semibold text-sky-blue-dark">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-border" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {learningModules.map((module, index) => (
                <div key={index} className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  module.status === 'completed' 
                    ? 'bg-success-bg border-success-border' 
                    : module.status === 'in-progress'
                    ? 'bg-warning-bg border-warning-border'
                    : 'bg-surface-soft border-border'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <h4 className={`font-medium text-sm ${
                      module.status === 'completed' ? 'text-success' : 
                      module.status === 'in-progress' ? 'text-warning' : 'text-text-muted'
                    }`}>{module.title}</h4>
                    {module.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    )}
                    {module.status === 'locked' && (
                      <div className="w-5 h-5 bg-border rounded-full flex items-center justify-center text-xs">
                        🔒
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Progress value={module.progress} className="h-2 bg-white" />
                    <div className="flex items-center justify-between text-xs">
                      <span className={module.status === 'completed' ? 'text-success' : module.status === 'in-progress' ? 'text-warning' : 'text-text-muted'}>
                        {module.lessons} lessons
                      </span>
                      <span className={`text-sm font-medium ${module.status === 'completed' ? 'text-success' : module.status === 'in-progress' ? 'text-warning' : 'text-text-muted'}`}>
                        {module.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Upcoming Classes */}
        <Card className="lg:col-span-5 border border-border bg-white shadow-card">
          <CardHeader className="bg-sky-blue border-b border-border-light p-6">
            <CardTitle className="text-xl font-semibold text-text flex items-center gap-3">
              <Calendar className="h-5 w-5 text-sky-blue-dark" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {upcomingClasses.map((class_, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-surface-soft rounded-xl border border-border-light hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4 flex-1 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-lavender rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-lavender-dark" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-base">{class_.title}</h4>
                    <p className="text-sm text-text-muted">with {class_.teacher}</p>
                    <div className="flex items-center gap-2 text-sm text-text-subtle mt-2 flex-wrap">
                      <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-border">
                        <Clock className="h-3 w-3" />
                        {class_.time}
                      </span>
                      <span className="bg-white px-2 py-1 rounded-lg border border-border">{class_.duration}</span>
                      <Badge variant="outline" className="text-xs bg-peach text-peach-dark border-peach-dark">
                        {class_.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-mint-green-dark hover:bg-mint-green-dark/90 text-white shadow-sm font-medium px-4 py-5 rounded-lg text-sm transition-all duration-200">
                  Join
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="lg:col-span-3 border border-border bg-white shadow-card">
          <CardHeader className="bg-lavender border-b border-border-light p-6">
            <CardTitle className="text-xl font-semibold text-text flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-lavender-dark" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {assignments.map((assignment, index) => (
              <div key={index} className={`p-4 rounded-xl border hover:shadow-md transition-all duration-200 ${
                assignment.status === 'completed' 
                  ? 'bg-success-bg border-success-border' 
                  : 'bg-surface-soft border-border-light'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className={`font-medium text-sm leading-tight ${
                    assignment.status === 'completed' ? 'text-success' : 'text-text'
                  }`}>
                    {assignment.title}
                  </h4>
                  {assignment.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline" className={`text-xs ${
                    assignment.status === 'completed'
                      ? 'bg-success text-white border-success'
                      : 'bg-lavender text-lavender-dark border-lavender-dark'
                  }`}>
                    {assignment.subject}
                  </Badge>
                  <span className={`text-sm font-medium ${
                    assignment.status === 'completed' ? 'text-success' : 'text-text-muted'
                  }`}>
                    {assignment.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};