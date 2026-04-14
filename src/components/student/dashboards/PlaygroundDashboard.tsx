import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KidsWorldMap, ThemeType } from '../kids/KidsWorldMap';
import { usePlaygroundLessons } from '@/hooks/usePlaygroundLessons';
import { useLiveClassroomStatus } from '@/hooks/useLiveClassroomStatus';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useThemeMode } from '@/hooks/useThemeMode';
import { LiveSessionBadge } from '@/components/shared/LiveSessionBadge';
import { PlaygroundSkeleton } from '@/components/shared/DashboardSkeleton';
import { PlaygroundSidebar } from '../kids/PlaygroundSidebar';
import { VirtualPetWidget } from '../kids/VirtualPetWidget';
import { AILessonAgent } from '../AILessonAgent';
import { WeeklyGoalWidget } from '../WeeklyGoalWidget';
import { RecommendedTeachers } from '../RecommendedTeachers';
import { EnterClassroomCTA } from '../kids/EnterClassroomCTA';
import { AIPersonalizedLessonCard } from '../AIPersonalizedLessonCard';
import { MaterialsGallery } from '../MaterialsGallery';
import { BookMyClassModal } from '../BookMyClassModal';
import { JoinLessonHero } from '../JoinLessonHero';
import { Volume2, Star } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('home');
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
      <div className={cn(
        'flex items-center justify-center h-screen',
        isDark ? 'bg-[#1A1200]' : 'bg-gradient-to-b from-amber-50 to-orange-50'
      )}>
        <div className={cn(
          'text-center p-8 rounded-3xl shadow-xl',
          isDark ? 'bg-amber-950/60 text-amber-100' : 'bg-white/80 text-slate-800'
        )}>
          <p className="text-4xl mb-4">😢</p>
          <p className="text-xl font-semibold mb-2">Oops! Something went wrong</p>
          <p className={isDark ? 'text-amber-300' : 'text-slate-500'}>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center h-screen',
        isDark ? 'bg-[#1A1200]' : 'bg-gradient-to-b from-amber-50 to-orange-50'
      )}>
        <div className={cn(
          'text-center p-8 rounded-3xl shadow-xl',
          isDark ? 'bg-amber-950/60 text-amber-100' : 'bg-white/80 text-slate-800'
        )}>
          <p className="text-6xl mb-4">🎒</p>
          <p className="text-xl font-semibold mb-2">No lessons yet!</p>
          <p className={isDark ? 'text-amber-300' : 'text-slate-500'}>Your adventure will start soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-screen p-4 transition-colors duration-700',
        isDark
          ? 'bg-gradient-to-b from-[#1A1200] to-[#0D0A00]'
          : 'bg-gradient-to-b from-amber-50 to-orange-50/30'
      )}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="flex flex-col gap-4 h-[calc(100vh-2rem)]">
        {/* Top Bar — Playground branded */}
        <div className={cn(
          'flex items-center justify-between px-5 py-3 rounded-3xl shadow-md border transition-colors duration-500',
          isDark
            ? 'bg-amber-950/70 backdrop-blur border-amber-600/20'
            : 'bg-white/70 backdrop-blur border-orange-200/50'
        )}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌈</span>
            <p className={cn('text-lg font-semibold', isDark ? 'text-amber-100' : 'text-orange-800')}>
              Hi, {studentName}! 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                isDark ? 'bg-orange-900/30 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
              )}
              animate={{ scale: dailyStreak > 0 ? [1, 1.03, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-orange-500 text-sm">🔥</span>
              <span className={cn('text-sm font-bold', isDark ? 'text-orange-300' : 'text-orange-600')}>{dailyStreak}</span>
            </motion.div>
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              isDark ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'
            )}>
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className={cn('text-sm font-bold', isDark ? 'text-amber-300' : 'text-amber-600')}>{totalStars}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Sidebar */}
          <PlaygroundSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
            {/* Map Area */}
            <div className={cn(
              'flex-1 rounded-3xl shadow-lg overflow-hidden transition-colors duration-500',
              isDark ? 'bg-amber-950/30' : 'bg-white/50'
            )}>
              <KidsWorldMap
                studentName={studentName}
                totalStars={totalStars}
                theme={theme}
                lessons={lessons}
                onLessonComplete={markLessonComplete}
              />
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-80 flex flex-col gap-3 overflow-y-auto">
              {/* JOIN LESSON HERO — primary CTA */}
              <JoinLessonHero hubId="playground" isDark={isDark} />

              {/* LIVE Session Badge */}
              {liveStatus.isLive && liveStatus.classroomUrl ? (
                <LiveSessionBadge classroomUrl={liveStatus.classroomUrl} variant="banner" />
              ) : (
                <EnterClassroomCTA nextLessonRoomLink={nextLessonRoomLink} nextLessonTitle={nextLessonTitle} />
              )}

              {/* Sound Lab Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-3xl font-semibold text-sm shadow-md transition-colors duration-500',
                  isDark
                    ? 'bg-gradient-to-r from-amber-700 to-orange-700 text-amber-100 shadow-[0_0_16px_rgba(255,143,0,0.3)]'
                    : 'bg-gradient-to-r from-orange-400 to-amber-400 text-white'
                )}
              >
                <Volume2 className="w-4 h-4" />
                Sound Lab — Map of Sounds
              </motion.button>

              {/* Book a Class */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setBookingOpen(true)}
                className={cn(
                  'w-full py-3 px-4 rounded-3xl font-semibold text-sm shadow-md transition-colors duration-500',
                  isDark
                    ? 'bg-gradient-to-r from-amber-800 to-orange-800 text-amber-100'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                )}
              >
                📅 Book a Class!
              </motion.button>

              <VirtualPetWidget petType={petType} petHappiness={petHappiness} wordsLearnedToday={wordsLearnedToday} wordsGoal={5} />
              <AIPersonalizedLessonCard />
              <WeeklyGoalWidget studentLevel="playground" />
              <AILessonAgent studentLevel="playground" studentInterests={['animals', 'games', 'cartoons']} cefrLevel="Pre-A1" />
              <MaterialsGallery track="kids" />
              <RecommendedTeachers hubLevel="playground" />
            </div>
          </div>
        </div>

        {/* Star Meter — Playground branded progress bar */}
        <div className={cn(
          'rounded-full h-3 overflow-hidden transition-colors duration-500',
          isDark ? 'bg-amber-900/50' : 'bg-amber-100'
        )}>
          <motion.div
            className={cn(
              'h-full rounded-full',
              isDark
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 shadow-[0_0_12px_rgba(255,143,0,0.5)]'
                : 'bg-gradient-to-r from-amber-400 to-orange-400'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${starPercent}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>

      <BookMyClassModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} studentLevel="playground" />
    </div>
  );
};
