import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { KidsWorldMap, ThemeType } from '../kids/KidsWorldMap';
import { usePlaygroundLessons } from '@/hooks/usePlaygroundLessons';
import { useLiveClassroomStatus } from '@/hooks/useLiveClassroomStatus';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useStudentLanguageSync } from '@/hooks/useStudentLanguageSync';
import { LiveSessionBadge } from '@/components/shared/LiveSessionBadge';
import { PlaygroundSkeleton } from '@/components/shared/DashboardSkeleton';
import { VirtualPetWidget } from '../kids/VirtualPetWidget';
import { AILessonAgent } from '../AILessonAgent';
import { WeeklyGoalWidget } from '../WeeklyGoalWidget';
import { RecommendedTeachers } from '../RecommendedTeachers';
import { RecentLessonReports } from '../RecentLessonReports';
import { EnterClassroomCTA } from '../kids/EnterClassroomCTA';
import { AIPersonalizedLessonCard } from '../AIPersonalizedLessonCard';
import { MaterialsGallery } from '../MaterialsGallery';
import { BookMyClassModal } from '../BookMyClassModal';
import { JoinLessonHero } from '../JoinLessonHero';
import { HubLogo } from '../HubLogo';
import { Volume2, Star, Rocket, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { DashboardVoiceGym } from '../DashboardVoiceGym';

interface PlaygroundDashboardProps {
  studentName?: string;
  theme?: ThemeType;
  petType?: 'lion' | 'panda' | 'bunny';
  petHappiness?: number;
  wordsLearnedToday?: number;
  dailyStreak?: number;
}

export const PlaygroundDashboard: React.FC<PlaygroundDashboardProps> = ({
  studentName = 'Explorer',
  theme = 'jungle',
  petType = 'lion',
  petHappiness = 50,
  wordsLearnedToday = 2,
  dailyStreak = 0,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  useStudentLanguageSync();
  const { lessons, loading, error, markLessonComplete, getTotalStars } = usePlaygroundLessons();
  const { isDaytime } = useTimeOfDay();
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const [bookingOpen, setBookingOpen] = useState(false);
  const [nextLessonRoomLink, setNextLessonRoomLink] = useState<string | null>(null);
  const [nextLessonTitle, setNextLessonTitle] = useState<string | undefined>(undefined);
  const liveStatus = useLiveClassroomStatus('student');

  const totalStars = getTotalStars();
  const maxStars = lessons.length * 3;
  const starPercent = maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0;

  useEffect(() => {
    if (!user?.id) return;
    const fetchUpcoming = async () => {
      // Primary: RPC for lessons table
      const { data, error } = await supabase.rpc('get_student_upcoming_lessons', {
        student_uuid: user.id,
      });
      if (!error && data && data.length > 0) {
        const next = data[0];
        setNextLessonRoomLink(next.room_link || (next.room_id ? `/classroom/${next.room_id}` : null));
        setNextLessonTitle(next.title || undefined);
        return;
      }

      // Fallback: check class_bookings directly for confirmed trials
      const { data: bookings } = await supabase
        .from('class_bookings')
        .select('id, scheduled_at, booking_type, lesson_id, status')
        .eq('student_id', user.id)
        .in('status', ['confirmed', 'scheduled'])
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1);

      if (bookings && bookings.length > 0) {
        const b = bookings[0];
        if (b.lesson_id) {
          const { data: lesson } = await supabase
            .from('lessons')
            .select('room_id, room_link, title')
            .eq('id', b.lesson_id)
            .maybeSingle();
          if (lesson) {
            setNextLessonRoomLink(lesson.room_link || (lesson.room_id ? `/classroom/${lesson.room_id}` : null));
            setNextLessonTitle(lesson.title || 'Trial Lesson');
            return;
          }
        }
        setNextLessonTitle('Upcoming Lesson');
      }
    };
    fetchUpcoming();
  }, [user?.id]);

  if (loading) return <PlaygroundSkeleton />;

  // Shared layout wrapper that always renders the branded shell
  const renderShell = (content: React.ReactNode) => (
    <div className="relative">
      {/* Floating decorative shapes */}
      {!isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-32 h-32 rounded-full bg-orange-200/30"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-40 left-20 w-20 h-20 rounded-full bg-yellow-200/40"
            animate={{ y: [0, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-32 right-1/3 w-24 h-24 rounded-full bg-amber-200/25"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      {isDark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-32 right-20 w-3 h-3 rounded-full bg-amber-500/40"
            animate={{ y: [0, -60, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-60 left-40 w-2 h-2 rounded-full bg-orange-400/30"
            animate={{ y: [0, -40, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
        </div>
      )}

      <div className="relative z-10 space-y-4">
        {/* ═══════════ TOP BAR — GLASSMORPHIC ═══════════ */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card-hub glass-playground flex items-center justify-between px-5 py-3 backdrop-blur-xl"
        >
          <HubLogo hubId="playground" size="md" />
          <div className="hidden md:flex items-center gap-2">
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
            >
              👋
            </motion.span>
            <p className={cn('text-base font-semibold', isDark ? 'text-amber-100' : 'text-orange-800')}>
              Hi, {studentName}!
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <motion.div
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold text-sm',
                isDark
                  ? 'bg-orange-900/40 border border-orange-500/30 text-orange-300'
                  : 'bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 text-orange-600'
              )}
              animate={dailyStreak > 0 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-base">🔥</span>
              {dailyStreak}
            </motion.div>
            <div className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold text-sm',
              isDark
                ? 'bg-amber-900/40 border border-amber-500/30 text-amber-300'
                : 'bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200 text-amber-600'
            )}>
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              {totalStars}
            </div>
          </div>
        </motion.div>

        {/* ═══════════ HERO WELCOME SECTION ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-hub glass-playground p-6 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FE6A2F]/10 via-[#FEAF15]/10 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#FE6A2F] to-[#FEAF15] bg-clip-text text-transparent">
                {t('sd.welcomeKids', 'Welcome to the Playground!')} 🎪
              </h1>
              <p className={cn('text-sm mt-1', isDark ? 'text-amber-300/80' : 'text-orange-600/80')}>
                {t('sd.subtitleKids', { name: studentName, defaultValue: "Ready for today's English adventure, {{name}}?" })}
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-5xl hidden md:block"
            >
              🎉
            </motion.div>
          </div>
        </motion.div>

        {/* ═══════════ MAIN CONTENT ═══════════ */}
        {content}
      </div>

      <BookMyClassModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} studentLevel="playground" />
    </div>
  );

  if (error) {
    return renderShell(
      <div className="flex items-center justify-center py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card-hub glass-playground text-center p-10 backdrop-blur-md"
        >
          <p className="text-6xl mb-4">😢</p>
          <p className={cn('text-xl font-bold mb-2', isDark ? 'text-amber-100' : 'text-slate-800')}>{t('sd.errorTitle', 'Oops! Something went wrong')}</p>
          <p className={isDark ? 'text-amber-300' : 'text-slate-500'}>{t('sd.errorBody', 'Please try refreshing the page')}</p>
        </motion.div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return renderShell(
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex items-center justify-center py-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card-hub glass-playground text-center p-10 backdrop-blur-md"
          >
            <motion.p
              className="text-7xl mb-4"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🚀
            </motion.p>
            <p className={cn('text-xl font-bold mb-2', isDark ? 'text-amber-100' : 'text-slate-800')}>{t('sd.noLessonsTitle', 'No lessons yet!')}</p>
            <p className={isDark ? 'text-amber-300' : 'text-slate-500'}>{t('sd.noLessonsBody', 'Your adventure will start soon...')}</p>
          </motion.div>
        </div>
        {/* Right panel still shows in empty state */}
        <div className="w-full lg:w-80 flex flex-col gap-3">
          <JoinLessonHero hubId="playground" isDark={isDark} />
          <WeeklyGoalWidget studentLevel="playground" />
          <RecommendedTeachers hubLevel="playground" />
        </div>
      </div>
    );
  }

  return renderShell(
    <div className="flex flex-col lg:flex-row gap-4">
      {/* ═══ MAP AREA — GLASS ═══ */}
      <div className="glass-card-hub glass-playground flex-1 overflow-hidden backdrop-blur-md">
        <KidsWorldMap
          studentName={studentName}
          totalStars={totalStars}
          theme={theme}
          lessons={lessons}
          onLessonComplete={markLessonComplete}
        />
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div className="w-full lg:w-80 flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-thin">
        <JoinLessonHero hubId="playground" isDark={isDark} />

        {liveStatus.isLive && liveStatus.classroomUrl ? (
          <LiveSessionBadge classroomUrl={liveStatus.classroomUrl} variant="banner" />
        ) : (
          <EnterClassroomCTA nextLessonRoomLink={nextLessonRoomLink} nextLessonTitle={nextLessonTitle} />
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'glass-card-hub glass-playground flex flex-col items-center gap-2 p-4 font-semibold text-xs backdrop-blur-md',
              isDark ? 'text-purple-200' : 'text-purple-700'
            )}
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-purple-800/60' : 'bg-purple-100')}>
              <Volume2 className="w-5 h-5" />
            </div>
            Sound Lab
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBookingOpen(true)}
            className={cn(
              'glass-card-hub glass-playground flex flex-col items-center gap-2 p-4 font-semibold text-xs backdrop-blur-md',
              isDark ? 'text-amber-200' : 'text-orange-700'
            )}
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-amber-800/60' : 'bg-orange-100')}>
              <Calendar className="w-5 h-5" />
            </div>
            Book Class
          </motion.button>
        </div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card-hub glass-playground p-4 backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Rocket className={cn('w-5 h-5', isDark ? 'text-amber-400' : 'text-orange-500')} />
              <span className={cn('font-bold text-sm', isDark ? 'text-amber-200' : 'text-orange-800')}>
                Adventure Progress
              </span>
            </div>
            <span className={cn('text-xs font-bold', isDark ? 'text-amber-400' : 'text-orange-600')}>
              {starPercent}%
            </span>
          </div>
          <div className={cn('h-3 rounded-full overflow-hidden', isDark ? 'bg-amber-900/50' : 'bg-orange-100')}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#FE6A2F] to-[#FEAF15]"
              initial={{ width: 0 }}
              animate={{ width: `${starPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          <p className={cn('text-xs mt-2', isDark ? 'text-amber-400/70' : 'text-orange-500/70')}>
            ⭐ {totalStars} / {maxStars} stars collected
          </p>
        </motion.div>

        <DashboardVoiceGym hub="playground" />
        <VirtualPetWidget petType={petType} petHappiness={petHappiness} wordsLearnedToday={wordsLearnedToday} wordsGoal={5} />
        <AIPersonalizedLessonCard />
        <WeeklyGoalWidget studentLevel="playground" />
        <AILessonAgent studentLevel="playground" studentInterests={['animals', 'games', 'cartoons']} cefrLevel="Pre-A1" />
        <MaterialsGallery track="kids" />
        <RecentLessonReports hubId="playground" />
        <RecommendedTeachers hubLevel="playground" />
      </div>
    </div>
  );
};
