import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  DollarSign,
  Plus,
  Eye,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface TeacherStats {
  upcomingLessons: any[];
  totalEarnings: number;
  studentsThisMonth: number;
  lessonsCompleted: number;
  avgRating: number;
  availabilitySlots: number;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch teacher data
  const { data: stats, isLoading } = useQuery({
    queryKey: ['teacherStats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get upcoming lessons
      const { data: lessons } = await supabase
        .from('lessons')
        .select(`
          *,
          student:users!lessons_student_id_fkey(full_name)
        `)
        .eq('teacher_id', user.id)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(5);

      // Get teacher profile
      const { data: profile } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get earnings
      const { data: earnings } = await supabase
        .from('teacher_earnings')
        .select('teacher_amount')
        .eq('teacher_id', user.id)
        .eq('status', 'paid');

      const totalEarnings = earnings?.reduce((sum, e) => sum + Number(e.teacher_amount), 0) || 0;

      return {
        upcomingLessons: lessons || [],
        totalEarnings,
        studentsThisMonth: 15, // Mock data
        lessonsCompleted: 45, // Mock data  
        avgRating: profile?.rating || 0,
        availabilitySlots: 24 // Mock data
      } as TeacherStats;
    }
  });

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
        {/* Professional Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Teacher Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your classes, track student progress, and grow your teaching practice.
          </p>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate('/teacher-availability')}
              className="h-24 flex-col gap-2 bg-gradient-to-br from-primary to-accent text-white hover:scale-105 smooth-transition"
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm font-medium">Set Availability</span>
            </Button>
            
            <Button
              onClick={() => navigate('/unified-classroom')}
              variant="outline"
              className="h-24 flex-col gap-2 hover-lift smooth-transition"
            >
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium">Start Class</span>
            </Button>
            
            <Button
              onClick={() => navigate('/k12-lessons')}
              variant="outline"
              className="h-24 flex-col gap-2 hover-lift smooth-transition"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm font-medium">Lesson Library</span>
            </Button>
            
            <Button
              onClick={() => navigate('/teacher-profile')}
              variant="outline"
              className="h-24 flex-col gap-2 hover-lift smooth-transition"
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm font-medium">Profile</span>
            </Button>
          </div>
        </section>

        {/* Professional CTA */}
        <Card className="text-center professional-shadow-lg engagement-gradient text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to teach your next class?</h3>
            <p className="text-white/90 mb-6">
              Everything you need for successful online teaching is at your fingertips.
            </p>
            <Button 
              onClick={() => navigate('/unified-classroom')}
              variant="secondary"
              size="lg"
              className="hover:scale-105 smooth-transition"
            >
              Start Teaching
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}