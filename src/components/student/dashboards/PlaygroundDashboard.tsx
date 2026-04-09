import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KidsWorldMap, ThemeType } from '../kids/KidsWorldMap';
import { usePlaygroundLessons } from '@/hooks/usePlaygroundLessons';
import { useLiveClassroomStatus } from '@/hooks/useLiveClassroomStatus';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { LiveSessionBadge } from '@/components/shared/LiveSessionBadge';
import { PlaygroundSkeleton } from '@/components/shared/DashboardSkeleton';
import { PlaygroundSidebar } from '../kids/PlaygroundSidebar';
import { VirtualPetWidget } from '../kids/VirtualPetWidget';
import { AILessonAgent } from '../AILessonAgent';
import { WeeklyGoalWidget } from '../WeeklyGoalWidget';
import { RecommendedTeachers } from '../RecommendedTeachers';
import { PlaygroundTopBar } from '../kids/PlaygroundTopBar';
import { EnterClassroomCTA } from '../kids/EnterClassroomCTA';
import { AIPersonalizedLessonCard } from '../AIPersonalizedLessonCard';
import { MaterialsGallery } from '../MaterialsGallery';
import { BookMyClassModal } from '../BookMyClassModal';
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
        isDaytime ? 'bg-sky-50' : 'bg-[#1A1040]'
      )}>
        <div className={cn(
          'text-center p-8 rounded-3xl shadow-xl',
          isDaytime ? 'bg-white/80 text-slate-800' : 'bg-indigo-900/60 text-indigo-100'
        )}>
          <p className="text-4xl mb-4">😢</p>
          <p className="text-xl font-semibold mb-2">Oops! Something went wrong</p>
          <p className={isDaytime ? 'text-slate-500' : 'text-indigo-300'}>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center h-screen',
        isDaytime ? 'bg-sky-50' : 'bg-[#1A1040]'
      )}>
        <div className={cn(
          'text-center p-8 rounded-3xl shadow-xl',
          isDaytime ? 'bg-white/80 text-slate-800' : 'bg-indigo-900/60 text-indigo-100'
        )}>
          <p className="text-6xl mb-4">🎒</p>
          <p className="text-xl font-semibold mb-2">No lessons yet!</p>
          <p className={isDaytime ? 'text-slate-500' : 'text-indigo-300'}>Your adventure will start soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-screen p-4 transition-colors duration-700',
        isDaytime
          ? 'bg-gradient-to-b from-sky-100 to-blue-50'
          : 'bg-gradient-to-b from-[#1A1040] to-[#0D0A2A]'
      )}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="flex flex-col gap-4 h-[calc(100vh-2rem)]">
        {/* Top Bar */}
        <div className={cn(
          'flex items-center justify-between px-5 py-3 rounded-3xl shadow-md border transition-colors duration-500',
          isDaytime
            ? 'bg-white/70 backdrop-blur border-sky-200/50'
            : 'bg-indigo-950/70 backdrop-blur border-indigo-500/20'
        )}>
          <p className={cn('text-lg font-semibold', isDaytime ? 'text-slate-800' : 'text-indigo-100')}>
            Hi, {studentName}! 👋
          </p>
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                isDaytime ? 'bg-orange-50 border border-orange-200' : 'bg-orange-900/30 border border-orange-500/30'
              )}
              animate={{ scale: dailyStreak > 0 ? [1, 1.03, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-orange-500 text-sm">🔥</span>
              <span className={cn('text-sm font-bold', isDaytime ? 'text-orange-600' : 'text-orange-300')}>{dailyStreak}</span>
            </motion.div>
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              isDaytime ? 'bg-amber-50 border border-amber-200' : 'bg-amber-900/30 border border-amber-500/30'
            )}>
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className={cn('text-sm font-bold', isDaytime ? 'text-amber-600' : 'text-amber-300')}>{totalStars}</span>
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
              isDaytime ? 'bg-white/50' : 'bg-indigo-950/40'
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
                  isDaytime
                    ? 'bg-sky-500 hover:bg-sky-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-indigo-100 shadow-[0_0_16px_rgba(99,102,241,0.3)]'
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
                  isDaytime
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-indigo-100'
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

        {/* Star Meter — bottom progress */}
        <div className={cn(
          'rounded-full h-3 overflow-hidden transition-colors duration-500',
          isDaytime ? 'bg-amber-100' : 'bg-indigo-900/50'
        )}>
          <motion.div
            className={cn(
              'h-full rounded-full',
              isDaytime
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
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
