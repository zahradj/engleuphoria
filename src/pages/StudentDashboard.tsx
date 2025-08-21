
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Trophy, 
  Calendar, 
  Clock, 
  Star, 
  Target,
  Play,
  MessageSquare,
  ChevronRight,
  Award
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface StudentProgress {
  totalXP: number;
  currentLevel: number;
  lessonsCompleted: number;
  upcomingLessons: any[];
  achievements: any[];
  currentStreak: number;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  // Fetch student progress data
  const { data: progress, isLoading } = useQuery({
    queryKey: ['studentProgress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get XP data
      const { data: xpData } = await supabase
        .from('student_xp')
        .select('*')
        .eq('student_id', user.id)
        .single();

      // Get upcoming lessons
      const { data: lessons } = await supabase
        .from('lessons')
        .select(`
          *,
          teacher:users!lessons_teacher_id_fkey(full_name)
        `)
        .eq('student_id', user.id)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(3);

      // Get achievements
      const { data: achievements } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('student_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(5);

      return {
        totalXP: xpData?.total_xp || 0,
        currentLevel: xpData?.current_level || 1,
        lessonsCompleted: xpData?.total_xp ? Math.floor(xpData.total_xp / 100) : 0,
        upcomingLessons: lessons || [],
        achievements: achievements || [],
        currentStreak: 7 // Mock for now
      } as StudentProgress;
    }
  });

  const QuickActions = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button
        onClick={() => navigate('/k12-lessons')}
        className="h-24 flex-col gap-2 bg-gradient-to-br from-primary to-accent text-white hover:scale-105 smooth-transition"
      >
        <BookOpen className="h-6 w-6" />
        <span className="text-sm font-medium">Start Learning</span>
      </Button>
      
      <Button
        onClick={() => navigate('/unified-classroom')}
        variant="outline"
        className="h-24 flex-col gap-2 hover-lift smooth-transition"
      >
        <Play className="h-6 w-6" />
        <span className="text-sm font-medium">Join Lesson</span>
      </Button>
      
      <Button
        onClick={() => navigate('/ai-tutor')}
        variant="outline"
        className="h-24 flex-col gap-2 hover-lift smooth-transition"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="text-sm font-medium">AI Tutor</span>
      </Button>
      
      <Button
        onClick={() => navigate('/communities')}
        variant="outline"
        className="h-24 flex-col gap-2 hover-lift smooth-transition"
      >
        <Trophy className="h-6 w-6" />
        <span className="text-sm font-medium">Communities</span>
      </Button>
    </div>
  );

  const ProgressOverview = () => (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="professional-shadow hover-lift smooth-transition">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Level {progress?.currentLevel}</span>
            <Badge variant="secondary">{progress?.totalXP} XP</Badge>
          </div>
          <Progress value={65} className="h-2" />
          <p className="text-xs text-muted-foreground">
            350 XP until Level {(progress?.currentLevel || 1) + 1}
          </p>
        </CardContent>
      </Card>

      <Card className="professional-shadow hover-lift smooth-transition">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold text-accent">
            {progress?.currentStreak} days
          </div>
          <p className="text-sm text-muted-foreground">
            Keep it up! Study tomorrow to continue your streak.
          </p>
        </CardContent>
      </Card>

      <Card className="professional-shadow hover-lift smooth-transition">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-success" />
            Lessons Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold text-success">
            {progress?.lessonsCompleted}
          </div>
          <p className="text-sm text-muted-foreground">
            Great progress this month!
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const UpcomingLessons = () => (
    <Card className="professional-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Lessons
        </CardTitle>
      </CardHeader>
      <CardContent>
        {progress?.upcomingLessons?.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming lessons scheduled</p>
            <Button 
              onClick={() => navigate('/book-lesson')}
              className="mt-4"
              variant="outline"
            >
              Book a Lesson
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {progress?.upcomingLessons?.map((lesson: any) => (
              <div 
                key={lesson.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 smooth-transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">
                      with {lesson.teacher?.full_name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(lesson.scheduled_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(lesson.scheduled_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const RecentAchievements = () => (
    <Card className="professional-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {progress?.achievements?.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Start learning to earn achievements!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress?.achievements?.map((item: any) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 smooth-transition"
              >
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.achievement?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.achievement?.description}
                  </p>
                </div>
                <Badge variant="secondary">
                  +{item.achievement?.xp_reward} XP
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background launch-ready">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back to your English journey! 🚀
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Continue learning, track your progress, and achieve your language goals.
          </p>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Quick Start</h2>
          <QuickActions />
        </section>

        {/* Progress Overview */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Your Progress</h2>
          <ProgressOverview />
        </section>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <UpcomingLessons />
          <RecentAchievements />
        </div>

        {/* Call to Action */}
        <Card className="text-center professional-shadow-lg engagement-gradient text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready for your next lesson?</h3>
            <p className="text-white/90 mb-6">
              Explore our extensive lesson library and continue your learning journey.
            </p>
            <Button 
              onClick={() => navigate('/k12-lessons')}
              variant="secondary"
              size="lg"
              className="hover:scale-105 smooth-transition"
            >
              Explore Lessons
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
