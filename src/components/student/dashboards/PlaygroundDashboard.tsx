import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KidsWorldMap, ThemeType } from '../kids/KidsWorldMap';
import { usePlaygroundLessons } from '@/hooks/usePlaygroundLessons';
import { useLiveClassroomStatus } from '@/hooks/useLiveClassroomStatus';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useThemeMode } from '@/hooks/useThemeMode';
import { LiveSessionBadge } from '@/components/shared/LiveSessionBadge';
import { PlaygroundSkeleton } from '@/components/shared/DashboardSkeleton';
import { VirtualPetWidget } from '../kids/VirtualPetWidget';
import { AILessonAgent } from '../AILessonAgent';
import { WeeklyGoalWidget } from '../WeeklyGoalWidget';
import { RecommendedTeachers } from '../RecommendedTeachers';
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
      const { data, error } = await supabase.rpc('get_student_upcoming_lessons', {
        student_uuid: user.id,
      });
      if (!error && data && data.length > 0) {
        const next = data[0];
        setNextLessonRoomLink(next.room_link || (next.room_id ? `/classroom/${next.room_id}` : null));
        setNextLessonTitle(next.title || undefined);
      }
    };
    fetchUpcoming();
  }, [user?.id]);

  if (loading) return <PlaygroundSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'text-center p-10 rounded-[2rem] shadow-2xl',
            isDark ? 'bg-amber-950/60 text-amber-100' : 'bg-white/90 text-slate-800'
          )}
        >
          <p className="text-6xl mb-4">😢</p>
          <p className="text-xl font-bold mb-2">Oops! Something went wrong</p>
          <p className={isDark ? 'text-amber-300' : 'text-slate-500'}>Please try refreshing the page</p>
        </motion.div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            'text-center p-10 rounded-[2rem] shadow-2xl',
            isDark ? 'bg-amber-950/60 text-amber-100' : 'bg-white/90 text-slate-800'
          )}
        >
          <motion.p
            className="text-7xl mb-4"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🚀
          </motion.p>
          <p className="text-xl font-bold mb-2">No lessons yet!</p>
          <p className={isDark ? 'text-amber-300' : 'text-slate-500'}>Your adventure will start soon...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Fun decorative floating shapes — light mode only */}
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

      {/* Dark mode floating embers */}
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
        {/* ═══════════ TOP BAR ═══════════ */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            'flex items-center justify-between px-5 py-3 rounded-[1.5rem] shadow-lg border transition-colors duration-500',
            isDark
              ? 'bg-gradient-to-r from-amber-950/80 to-orange-950/80 backdrop-blur-xl border-amber-600/20'
              : 'bg-white/80 backdrop-blur-xl border-orange-200/60 shadow-orange-100/50'
          )}
        >
          {/* Logo + Hub Name — homepage style */}
          <HubLogo hubId="playground" size="md" />

          {/* Greeting */}
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

          {/* Stats Badges */}
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

        {/* ═══════════ MAIN CONTENT ═══════════ */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* ═══ MAP AREA ═══ */}
          <div className={cn(
            'flex-1 rounded-[1.5rem] shadow-xl overflow-hidden transition-colors duration-500 border',
            isDark
              ? 'bg-amber-950/20 border-amber-800/20'
              : 'bg-white/60 backdrop-blur border-orange-200/40 shadow-orange-100/30'
          )}>
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
            {/* JOIN LESSON HERO */}
            <JoinLessonHero hubId="playground" isDark={isDark} />

            {/* LIVE Session Badge */}
            {liveStatus.isLive && liveStatus.classroomUrl ? (
              <LiveSessionBadge classroomUrl={liveStatus.classroomUrl} variant="banner" />
            ) : (
              <EnterClassroomCTA nextLessonRoomLink={nextLessonRoomLink} nextLessonTitle={nextLessonTitle} />
            )}

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl font-semibold text-xs shadow-md transition-colors duration-500 border',
                  isDark
                    ? 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60 text-purple-200 border-purple-700/30'
                    : 'bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-700 border-purple-200/60'
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
                  'flex flex-col items-center gap-2 p-4 rounded-2xl font-semibold text-xs shadow-md transition-colors duration-500 border',
                  isDark
                    ? 'bg-gradient-to-br from-amber-900/60 to-orange-900/60 text-amber-200 border-amber-700/30'
                    : 'bg-gradient-to-br from-orange-50 to-amber-50 text-orange-700 border-orange-200/60'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isDark ? 'bg-amber-800/60' : 'bg-orange-100')}>
                  <Calendar className="w-5 h-5" />
                </div>
                Book Class
              </motion.button>
            </div>

            {/* Fun Progress Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'p-4 rounded-2xl border shadow-md',
                isDark
                  ? 'bg-gradient-to-br from-amber-950/60 to-orange-950/60 border-amber-700/20'
                  : 'bg-gradient-to-br from-orange-50/80 to-yellow-50/80 border-orange-200/50'
              )}
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
                  className={cn(
                    'h-full rounded-full',
                    isDark
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-orange-400 to-amber-400'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${starPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <p className={cn('text-xs mt-2', isDark ? 'text-amber-400/70' : 'text-orange-500/70')}>
                ⭐ {totalStars} / {maxStars} stars collected
              </p>
            </motion.div>

            {/* Pet Widget */}
            <VirtualPetWidget petType={petType} petHappiness={petHappiness} wordsLearnedToday={wordsLearnedToday} wordsGoal={5} />

            {/* AI Lesson Card */}
            <AIPersonalizedLessonCard />

            {/* Weekly Goal */}
            <WeeklyGoalWidget studentLevel="playground" />

            {/* AI Agent */}
            <AILessonAgent studentLevel="playground" studentInterests={['animals', 'games', 'cartoons']} cefrLevel="Pre-A1" />

            {/* Materials */}
            <MaterialsGallery track="kids" />

            {/* Recommended Teachers */}
            <RecommendedTeachers hubLevel="playground" />
          </div>
        </div>
      </div>

      <BookMyClassModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} studentLevel="playground" />
    </div>
  );
};
