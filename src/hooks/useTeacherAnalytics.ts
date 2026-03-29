import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StudentStat {
  student_id: string;
  student_name: string;
  email: string;
  cefr_level: string;
  lessons_completed: number;
  avg_score: number;
  homework_completion_rate: number;
  last_active: string | null;
  total_sessions: number;
}

export interface ClassMetrics {
  totalStudents: number;
  averageAttendance: number;
  averageProgress: number;
  completedLessons: number;
  totalHomeworkSubmissions: number;
  averageScore: number;
}

export const useTeacherAnalytics = (teacherId: string | undefined) => {
  // Get students assigned to this teacher via class_bookings
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['teacher-students', teacherId],
    queryFn: async () => {
      if (!teacherId) return [];

      // Get unique students from bookings
      const { data: bookings, error } = await supabase
        .from('class_bookings')
        .select('student_id')
        .eq('teacher_id', teacherId);

      if (error) throw error;
      const uniqueIds = [...new Set(bookings?.map(b => b.student_id) || [])];
      if (uniqueIds.length === 0) return [];

      // Get profiles for these students
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, display_name, email, current_level')
        .in('id', uniqueIds);

      if (profErr) throw profErr;
      return profiles || [];
    },
    enabled: !!teacherId,
  });

  // Get homework submissions for these students
  const { data: homeworkData, isLoading: homeworkLoading } = useQuery({
    queryKey: ['teacher-homework-stats', teacherId, students?.length],
    queryFn: async () => {
      if (!students?.length) return { submissions: 0, graded: 0, avgScore: 0 };

      const studentIds = students.map(s => s.id);
      const { data, error } = await supabase
        .from('homework_submissions')
        .select('id, status, score, student_id')
        .in('student_id', studentIds);

      if (error) throw error;
      const submissions = data || [];
      const graded = submissions.filter(s => s.status === 'graded');
      const avgScore = graded.length > 0
        ? graded.reduce((sum, s) => sum + (s.score || 0), 0) / graded.length
        : 0;

      return { submissions: submissions.length, graded: graded.length, avgScore: Math.round(avgScore) };
    },
    enabled: !!students?.length,
  });

  // Get lesson progress for these students
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['teacher-progress-stats', teacherId, students?.length],
    queryFn: async () => {
      if (!students?.length) return { totalCompleted: 0, avgProgress: 0 };

      const studentIds = students.map(s => s.id);
      const { data, error } = await supabase
        .from('interactive_lesson_progress')
        .select('id, completed, progress_percentage, student_id')
        .in('student_id', studentIds);

      if (error) throw error;
      const progress = data || [];
      const completed = progress.filter(p => p.completed).length;
      const avgProg = progress.length > 0
        ? progress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / progress.length
        : 0;

      return { totalCompleted: completed, avgProgress: Math.round(avgProg) };
    },
    enabled: !!students?.length,
  });

  // Get session counts
  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ['teacher-session-stats', teacherId],
    queryFn: async () => {
      if (!teacherId) return { total: 0, completed: 0, upcoming: 0 };

      const { data, error } = await supabase
        .from('class_bookings')
        .select('id, status, scheduled_at')
        .eq('teacher_id', teacherId);

      if (error) throw error;
      const bookings = data || [];
      const now = new Date().toISOString();

      return {
        total: bookings.length,
        completed: bookings.filter(b => b.status === 'completed').length,
        upcoming: bookings.filter(b => b.scheduled_at > now && b.status !== 'cancelled').length,
      };
    },
    enabled: !!teacherId,
  });

  // Build per-student stats
  const studentStats: StudentStat[] = (students || []).map(s => ({
    student_id: s.id,
    student_name: s.display_name || 'Unknown',
    email: s.email || '',
    cefr_level: s.current_level || 'A1',
    lessons_completed: 0,
    avg_score: homeworkData?.avgScore || 0,
    homework_completion_rate: 0,
    last_active: null,
    total_sessions: 0,
  }));

  const classMetrics: ClassMetrics = {
    totalStudents: students?.length || 0,
    averageAttendance: sessionData ? Math.round((sessionData.completed / Math.max(sessionData.total, 1)) * 100) : 0,
    averageProgress: progressData?.avgProgress || 0,
    completedLessons: progressData?.totalCompleted || 0,
    totalHomeworkSubmissions: homeworkData?.submissions || 0,
    averageScore: homeworkData?.avgScore || 0,
  };

  return {
    studentStats,
    classMetrics,
    sessionData,
    isLoading: studentsLoading || homeworkLoading || progressLoading || sessionLoading,
  };
};
