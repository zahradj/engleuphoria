import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, TrendingUp, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const HUBS = [
  { value: 'playground', label: 'Playground (Kids)' },
  { value: 'academy', label: 'Academy (Teens)' },
  { value: 'professional', label: 'Success (Adults)' },
] as const;
type HubValue = typeof HUBS[number]['value'];

interface Student {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  cefr_level?: string;
  student_level?: HubValue;
  total_lessons: number;
}

interface DailyStats {
  date: string;
  classes: number;
  newStudents: number;
}

export const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    newToday: 0,
    classesToday: 0,
    activeStudents: 0,
  });

  const fetchStudents = async () => {
    try {
      // Drive the list off student_profiles (truthful "is a student" signal)
      // rather than users.role, which can be flipped to 'teacher' /
      // 'content_creator' for multi-role accounts and would otherwise hide
      // legitimate student registrations from this admin tab.
      const { data: profilesData, error: profilesError } = await supabase
        .from('student_profiles')
        .select(`
          user_id,
          cefr_level,
          student_level,
          created_at,
          users!inner(id, full_name, email, created_at)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (profilesError) throw profilesError;

      // Get lesson counts for each student
      const studentsWithLessons = await Promise.all(
        (profilesData || []).map(async (row: any) => {
          const { count } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', row.user_id);

          return {
            id: row.user_id,
            full_name: row.users?.full_name || 'Unknown',
            email: row.users?.email || 'Unknown',
            // Prefer the user's signup time for "Joined" display; fall back
            // to the profile creation time if missing.
            created_at: row.users?.created_at || row.created_at,
            cefr_level: row.cefr_level,
            student_level: row.student_level,
            total_lessons: count || 0,
          };
        })
      );

      setStudents(studentsWithLessons);

      // Get basic stats — count from student_profiles too so the totals
      // match the list above and don't undercount multi-role accounts.
      const today = new Date().toISOString().split('T')[0];

      const { count: totalCount } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true });

      const { count: newTodayCount } = await supabase
        .from('student_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`);

      const { count: classesTodayCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_at', `${today}T00:00:00`)
        .lte('scheduled_at', `${today}T23:59:59`);

      setStats({
        totalStudents: totalCount || 0,
        newToday: newTodayCount || 0,
        classesToday: classesTodayCount || 0,
        activeStudents: studentsWithLessons.filter(s => s.total_lessons > 0).length,
      });

      // Get daily stats for chart
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyData = await Promise.all(
        last7Days.map(async (date) => {
          const { count: classes } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .gte('scheduled_at', `${date}T00:00:00`)
            .lte('scheduled_at', `${date}T23:59:59`);

          const { count: newStudents } = await supabase
            .from('student_profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${date}T00:00:00`)
            .lte('created_at', `${date}T23:59:59`);

          return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            classes: classes || 0,
            newStudents: newStudents || 0,
          };
        })
      );

      setDailyStats(dailyData);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleLevelChange = async (studentId: string, newLevel: string) => {
    const previous = students;
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, cefr_level: newLevel } : s))
    );
    try {
      const { error } = await supabase
        .from('student_profiles')
        .upsert(
          { user_id: studentId, cefr_level: newLevel },
          { onConflict: 'user_id' }
        );
      if (error) throw error;
      toast.success(`Level updated to ${newLevel}`);
    } catch (err) {
      console.error('Failed to update CEFR level:', err);
      setStudents(previous);
      toast.error('Could not update level');
    }
  };

  const handleHubChange = async (studentId: string, newHub: HubValue) => {
    const previous = students;
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, student_level: newHub } : s))
    );
    try {
      const { error } = await supabase
        .from('student_profiles')
        .upsert(
          { user_id: studentId, student_level: newHub },
          { onConflict: 'user_id' }
        );
      if (error) throw error;
      const label = HUBS.find(h => h.value === newHub)?.label ?? newHub;
      toast.success(`Hub updated to ${label}`);
    } catch (err) {
      console.error('Failed to update hub:', err);
      setStudents(previous);
      toast.error('Could not update hub');
    }
  };

  if (loading) {
    return (
      <div className="text-center text-muted-foreground">Loading student data...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.newToday}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Classes Today</p>
                <p className="text-2xl font-bold text-blue-600">{stats.classesToday}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeStudents}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="classes" name="Classes" fill="#3b82f6" />
                <Bar dataKey="newStudents" name="New Students" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Hub</TableHead>
                  <TableHead>CEFR Level</TableHead>
                  <TableHead>Total Lessons</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.full_name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={student.student_level || ''}
                        onValueChange={(v) => handleHubChange(student.id, v as HubValue)}
                      >
                        <SelectTrigger className="w-[170px] h-8">
                          <SelectValue placeholder="Set hub" />
                        </SelectTrigger>
                        <SelectContent>
                          {HUBS.map(hub => (
                            <SelectItem key={hub.value} value={hub.value}>{hub.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={student.cefr_level || ''}
                        onValueChange={(v) => handleLevelChange(student.id, v)}
                      >
                        <SelectTrigger className="w-[110px] h-8">
                          <SelectValue placeholder="Set level" />
                        </SelectTrigger>
                        <SelectContent>
                          {CEFR_LEVELS.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{student.total_lessons}</TableCell>
                    <TableCell>
                      {new Date(student.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.total_lessons > 0 ? "default" : "secondary"}>
                        {student.total_lessons > 0 ? "Active" : "New"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};