import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  Activity,
  BookOpen,
  BarChart3,
  ChevronRight,
  Zap,
  Globe,
} from 'lucide-react';

interface CommandCenterProps {
  teacherId: string;
  teacherName: string;
  onViewStudent?: (studentId: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  teacherId,
  teacherName,
  onViewStudent,
}) => {
  // Fetch live metrics
  const { data: metrics } = useQuery({
    queryKey: ['command-center-metrics', teacherId],
    queryFn: async () => {
      const { data: bookings } = await supabase
        .from('class_bookings')
        .select('student_id, status, scheduled_at')
        .eq('teacher_id', teacherId);

      const uniqueStudents = [...new Set((bookings || []).map(b => b.student_id))];
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = (bookings || []).filter(
        b => b.scheduled_at?.startsWith(today)
      );

      // Fetch at-risk students (failed phonics checks)
      const { data: atRisk } = await supabase
        .from('mastery_milestone_results')
        .select('student_id, score, weakest_skill, completed_at')
        .in('student_id', uniqueStudents.length ? uniqueStudents : ['none'])
        .eq('passed', false)
        .order('completed_at', { ascending: false })
        .limit(10);

      // Fetch student profiles for display names
      const atRiskIds = [...new Set((atRisk || []).map(a => a.student_id))];
      const { data: profiles } = await supabase
        .from('student_profiles')
        .select('user_id, display_name')
        .in('user_id', atRiskIds.length ? atRiskIds : ['none']);

      const profileMap = Object.fromEntries(
        (profiles || []).map(p => [p.user_id, p.display_name])
      );

      // Recent activity feed
      const { data: recentLessons } = await supabase
        .from('class_bookings')
        .select('id, student_id, scheduled_at, status, duration')
        .eq('teacher_id', teacherId)
        .eq('status', 'completed')
        .order('scheduled_at', { ascending: false })
        .limit(6);

      const completedStudentIds = [
        ...new Set((recentLessons || []).map(l => l.student_id)),
      ];
      const { data: completedProfiles } = await supabase
        .from('student_profiles')
        .select('user_id, display_name')
        .in('user_id', completedStudentIds.length ? completedStudentIds : ['none']);

      const completedProfileMap = Object.fromEntries(
        (completedProfiles || []).map(p => [p.user_id, p.display_name])
      );

      return {
        totalStudents: uniqueStudents.length,
        sessionsToday: todayBookings.length,
        atRiskStudents: (atRisk || []).map(a => ({
          ...a,
          studentName: profileMap[a.student_id] || 'Unknown',
        })),
        recentActivity: (recentLessons || []).map(l => ({
          ...l,
          studentName: completedProfileMap[l.student_id] || 'Unknown',
        })),
      };
    },
    staleTime: 60_000,
  });

  const { totalStudents = 0, sessionsToday = 0, atRiskStudents = [], recentActivity = [] } =
    metrics || {};

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A237E] font-inter tracking-tight">
            Command Center
          </h1>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {teacherName}
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-[#4CAF50]/30 bg-[#4CAF50]/5 text-[#2E7D32] font-medium"
        >
          <Activity className="h-3 w-3 mr-1.5" />
          Live
        </Badge>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          icon={<Users className="h-5 w-5" />}
          label="Total Students"
          value={totalStudents}
          color="#1A237E"
        />
        <StatusCard
          icon={<Clock className="h-5 w-5" />}
          label="Sessions Today"
          value={sessionsToday}
          color="#1A237E"
        />
        <StatusCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="At-Risk Alerts"
          value={atRiskStudents.length}
          color={atRiskStudents.length > 0 ? '#EF5350' : '#9E9E9E'}
        />
        <StatusCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Units Completed"
          value={recentActivity.length}
          color="#2E7D32"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* At-Risk Alerts */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#1A237E] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#EF5350]" />
              II Wizard Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {atRiskStudents.length === 0 ? (
              <div className="flex items-center gap-3 py-6 justify-center text-[#9E9E9E]">
                <Zap className="h-5 w-5" />
                <p className="text-sm">All students on track — no alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {atRiskStudents.slice(0, 5).map((student: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#EF5350]/10 bg-[#EF5350]/3 cursor-pointer hover:bg-[#EF5350]/5 transition-colors"
                    onClick={() => onViewStudent?.(student.student_id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#EF5350]/10 flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-[#EF5350]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {student.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Failed • Weakest: {student.weakest_skill || 'N/A'} • Score:{' '}
                          {Math.round(student.score)}%
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-[#1A237E] flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#2E7D32]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="flex items-center gap-3 py-6 justify-center text-[#9E9E9E]">
                <BookOpen className="h-5 w-5" />
                <p className="text-sm">No completed sessions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#2E7D32]/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#2E7D32]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {activity.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.duration}min session completed
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.scheduled_at
                        ? new Date(activity.scheduled_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/* ── Small helper ─────────────────────────────── */
const StatusCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) => (
  <Card className="border border-border bg-card shadow-sm">
    <CardContent className="pt-5 pb-4 flex items-center gap-4">
      <div
        className="h-10 w-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}10`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);
