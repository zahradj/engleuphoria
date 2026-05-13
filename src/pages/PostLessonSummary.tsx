import React from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, Star, Clock, BookOpen, ArrowRight, Sparkles, ClipboardCheck } from 'lucide-react';

/**
 * Post-Lesson Summary
 *
 * Shared landing page for both teacher and student after the classroom
 * session ends. Reached automatically via the Realtime listener in
 * TeacherClassroom / StudentClassroom when classroom_sessions.session_status
 * transitions to 'ended'.
 *
 * Route: /classroom/:id/summary
 */
const PostLessonSummary: React.FC = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['post-lesson-summary', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      const { data: resolvedId } = await supabase.rpc('resolve_classroom_id', {
        any_id: bookingId,
      });
      if (!resolvedId) return null;

      const [{ data: booking }, { data: session }] = await Promise.all([
        supabase
          .from('class_bookings')
          .select('id, teacher_id, student_id, scheduled_at, duration, hub_type')
          .eq('id', resolvedId)
          .maybeSingle(),
        supabase
          .from('classroom_sessions')
          .select('lesson_title, lesson_id, started_at, ended_at, star_count, current_slide_index, lesson_slides')
          .eq('room_id', resolvedId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      return { booking, session };
    },
    enabled: !!bookingId && !!user?.id,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!bookingId) return <Navigate to="/dashboard" replace />;

  const booking = data?.booking;
  const session = data?.session;
  const isTeacher = booking?.teacher_id === user.id;
  const hub = (booking?.hub_type as 'playground' | 'academy' | 'professional') || 'academy';

  // Hub palette per workspace branding rules
  const palette = hub === 'playground'
    ? { from: 'from-orange-50', to: 'to-amber-50', accent: 'text-orange-600', btn: 'bg-orange-500 hover:bg-orange-600', ring: 'ring-orange-200' }
    : hub === 'professional'
    ? { from: 'from-emerald-50', to: 'to-teal-50', accent: 'text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700', ring: 'ring-emerald-200' }
    : { from: 'from-purple-50', to: 'to-indigo-50', accent: 'text-purple-700', btn: 'bg-purple-600 hover:bg-purple-700', ring: 'ring-purple-200' };

  const startedAt = session?.started_at ? new Date(session.started_at) : null;
  const endedAt = session?.ended_at ? new Date(session.ended_at) : new Date();
  const durationMin = startedAt
    ? Math.max(1, Math.round((endedAt.getTime() - startedAt.getTime()) / 60000))
    : booking?.duration ?? null;

  const slidesCovered = (session?.current_slide_index ?? 0) + 1;
  const totalSlides = Array.isArray(session?.lesson_slides) ? (session?.lesson_slides as unknown[]).length : null;
  const stars = session?.star_count ?? 0;

  const dashboardPath = isTeacher ? '/teacher' : (hub === 'playground' ? '/playground' : hub === 'professional' ? '/hub' : '/academy');

  return (
    <div className={`min-h-screen bg-gradient-to-br ${palette.from} via-white ${palette.to} flex items-center justify-center p-6`}>
      <div className={`w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-xl ring-1 ${palette.ring} p-8 md:p-12 space-y-8`}>
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-md">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl md:text-4xl font-extrabold ${palette.accent}`}>
            {isTeacher ? 'Class wrapped!' : 'Great work today!'}
          </h1>
          <p className="text-base text-slate-600">
            {session?.lesson_title || 'Your lesson'} {durationMin ? `· ${durationMin} min` : ''}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat icon={<Star className="w-5 h-5" />} label="Stars earned" value={stars} accent={palette.accent} />
          <Stat
            icon={<BookOpen className="w-5 h-5" />}
            label="Slides covered"
            value={totalSlides ? `${slidesCovered} / ${totalSlides}` : slidesCovered}
            accent={palette.accent}
          />
          <Stat icon={<Clock className="w-5 h-5" />} label="Duration" value={durationMin ? `${durationMin} min` : '—'} accent={palette.accent} />
        </div>

        {/* Role-specific message */}
        <div className="text-center text-sm text-slate-600 leading-relaxed">
          {isTeacher
            ? 'Take a moment to log observations and prep the next session. The student has been routed to their dashboard.'
            : 'Your progress has been saved. Review new vocabulary in your Vault, or jump back to your learning path.'}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {isTeacher ? (
            <>
              <Button onClick={() => navigate('/teacher')} className={`${palette.btn} text-white`}>
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Back to teacher dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/teacher/schedule')}>
                View schedule
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate(dashboardPath)} className={`${palette.btn} text-white`}>
                Continue learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/student/vault')}>
                Open Vocabulary Vault
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; accent: string }> = ({
  icon,
  label,
  value,
  accent,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 mb-2 ${accent}`}>
      {icon}
    </div>
    <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">{label}</div>
    <div className={`text-2xl font-extrabold ${accent} mt-1`}>{value}</div>
  </div>
);

export default PostLessonSummary;
