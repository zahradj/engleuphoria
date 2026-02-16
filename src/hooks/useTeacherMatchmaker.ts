import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { TeacherProfile } from '@/types/teacher-discovery';

interface MatchedTeacher extends TeacherProfile {
  matchScore: number;
}

export function useTeacherMatchmaker() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<MatchedTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasBookings, setHasBookings] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetchMatches();
  }, [user?.id]);

  const fetchMatches = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      // Fetch student profile
      const { data: studentProfile } = await supabase
        .from('student_profiles')
        .select('student_level, interests')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!studentProfile) {
        setLoading(false);
        return;
      }

      // Check existing bookings
      const { count } = await supabase
        .from('class_bookings')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', user.id);

      if (count && count > 0) {
        setHasBookings(true);
        setLoading(false);
        return;
      }

      // Fetch all approved teacher profiles
      const { data: teacherProfiles } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('is_available', true);

      if (!teacherProfiles || teacherProfiles.length === 0) {
        setLoading(false);
        return;
      }

      const studentLevel = studentProfile.student_level || 'playground';
      const studentInterests: string[] = (studentProfile.interests as string[]) || [];

      // Score each teacher
      const scored: MatchedTeacher[] = teacherProfiles.map((tp) => {
        let score = 0;

        // Specialization match (40%)
        const levelKeywords: Record<string, string[]> = {
          playground: ['kids', 'children', 'young learners', 'storyteller', 'phonics'],
          academy: ['teens', 'grammar', 'exam prep', 'ielts', 'conversation'],
          professional: ['business', 'corporate', 'professional', 'presentation', 'coach'],
        };
        const keywords = levelKeywords[studentLevel] || [];
        const specs = (tp.specializations || []).map((s: string) => s.toLowerCase());
        const specMatch = keywords.some(k => specs.some((s: string) => s.includes(k)));
        score += specMatch ? 40 : 10;

        // Interest overlap (30%)
        if (studentInterests.length > 0 && specs.length > 0) {
          const overlap = studentInterests.filter(i =>
            specs.some((s: string) => s.toLowerCase().includes(i.toLowerCase()))
          ).length;
          score += Math.min((overlap / studentInterests.length) * 30, 30);
        }

        // Rating (20%)
        score += ((tp.rating || 0) / 5) * 20;

        // Availability bonus (10%) — teacher is available
        score += tp.is_available ? 10 : 0;

        return { ...tp, matchScore: Math.round(score) };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      setTeachers(scored.slice(0, 3));
    } catch (err) {
      console.error('Teacher matchmaker error:', err);
    } finally {
      setLoading(false);
    }
  };

  const bookTrialLesson = async (teacherId: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('class_bookings')
      .insert({
        student_id: user.id,
        teacher_id: teacherId,
        status: 'pending',
        booking_type: 'trial',
        scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 30,
        price_paid: 0,
        currency: 'DZD',
      });

    if (error) throw error;
    setHasBookings(true);
  };

  return { teachers, loading, hasBookings, bookTrialLesson };
}
