import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AcademySkeleton } from '@/components/shared/DashboardSkeleton';
import { useLiveClassroomStatus } from '@/hooks/useLiveClassroomStatus';
import { useThemeMode } from '@/hooks/useThemeMode';
import { LiveSessionBadge } from '@/components/shared/LiveSessionBadge';
import { 
  Home, BookOpen, Calendar, Trophy, User, 
  Flame, ChevronRight, Clock, Users, Sparkles, TrendingUp, TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCurriculumLessons } from '@/hooks/useCurriculumLessons';
import { DailyStreakCard } from '../academy/DailyStreakCard';
import { DailyChallengeCard } from '../academy/DailyChallengeCard';
import { SocialLounge } from '../academy/SocialLounge';
import { RecordClipWidget } from '../academy/RecordClipWidget';
import { SkillXPBars } from '../academy/SkillXPBars';
import { DailyLessonCard } from '../DailyLessonCard';
import { AIPersonalizedLessonCard } from '../AIPersonalizedLessonCard';
import { MaterialsGallery } from '../MaterialsGallery';
import { AILessonAgent } from '../AILessonAgent';
import { WeeklyGoalWidget } from '../WeeklyGoalWidget';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecommendedTeachers } from '../RecommendedTeachers';
import { RecentLessonReports } from '../RecentLessonReports';
import { BookMyClassModal } from '../BookMyClassModal';
import { JoinLessonHero } from '../JoinLessonHero';
import { HubLogo } from '../HubLogo';
import { cn } from '@/lib/utils';
import { DashboardVoiceGym } from '../DashboardVoiceGym';

interface AcademyDashboardProps {
  studentName?: string;
  totalXp?: number;
  level?: number;
  currentStreak?: number;
  weeklyActivity?: boolean[];
  onLevelUp?: () => void;
}

type TabId = 'home' | 'learn' | 'schedule' | 'rank' | 'profile';

export const AcademyDashboard: React.FC<AcademyDashboardProps> = ({
  studentName = 'Alex',
  totalXp = 2340,
  level = 5,
  currentStreak = 7,
  weeklyActivity = [true, true, true, true, true, false, true],
  onLevelUp,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: lessons = [], isLoading } = useCurriculumLessons('teen');
  const liveStatus = useLiveClassroomStatus('student');
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';

  const schedule = [
    { day: 'Mon', time: '3:00 PM', subject: 'Grammar', color: isDark ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-700' },
    { day: 'Wed', time: '4:30 PM', subject: 'Speaking', color: isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-50 text-purple-700' },
    { day: 'Fri', time: '2:00 PM', subject: 'Reading', color: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah K.', xp: 4520, avatar: 'SK', change: 0 },
    { rank: 2, name: 'Mike T.', xp: 3890, avatar: 'MT', change: 1 },
    { rank: 3, name: studentName, xp: totalXp, avatar: studentName.slice(0, 2).toUpperCase(), isYou: true, change: -1 },
    { rank: 4, name: 'Emma L.', xp: 2100, avatar: 'EL', change: 2 },
    { rank: 5, name: 'Jake R.', xp: 1850, avatar: 'JR', change: 0 },
  ];

  const currentLesson = lessons[2] || lessons[0];

  if (isLoading) return <AcademySkeleton />;

  const textPrimary = isDark ? 'text-purple-100' : 'text-[#6B21A8]';
  const textSecondary = isDark ? 'text-purple-300' : 'text-slate-500';

  return (
    <div className="relative space-y-6">
      {/* ═══════════ HEADER BAR — GLASSMORPHIC ═══════════ */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card-hub glass-academy flex items-center justify-end px-5 py-3 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
            isDark ? 'bg-orange-900/30 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
          )}>
            <Flame className="w-4 h-4 text-orange-500" fill="currentColor" />
            <span className={cn('font-semibold text-sm', isDark ? 'text-orange-300' : 'text-orange-600')}>{currentStreak}</span>
          </div>
        </div>
      </motion.div>

      {/* ═══════════ HERO WELCOME — GLASSMORPHIC ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card-hub glass-academy p-6 backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#6B21A8]/10 via-[#A855F7]/10 to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#6B21A8] to-[#A855F7] bg-clip-text text-transparent">
              Welcome back, {studentName} 📚
            </h1>
            <p className={cn('text-sm mt-1', textSecondary)}>
              Level {level} · {totalXp.toLocaleString()} XP — Keep pushing forward!
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl hidden md:block"
          >
            🎓
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div>
        {/* JOIN LESSON HERO */}
        <div className="mb-6">
          <JoinLessonHero hubId="academy" isDark={isDark} />
        </div>

        {/* LIVE Session Banner */}
        {liveStatus.isLive && liveStatus.classroomUrl && (
          <div className="mb-4">
            <LiveSessionBadge classroomUrl={liveStatus.classroomUrl} variant="banner" />
          </div>
        )}

        {/* Streak Card */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
          <DailyStreakCard
            currentStreak={currentStreak}
            longestStreak={14}
            weeklyActivity={weeklyActivity}
            hasStreakFreeze={true}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Schedule — GLASS */}
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              <div className="glass-card-hub glass-academy p-5 backdrop-blur-md">
                <h3 className={cn('flex items-center gap-2 text-base font-semibold mb-4', textPrimary)}>
                  <Calendar className="w-4 h-4" />
                  My Schedule
                </h3>
                <div className="space-y-2">
                  {schedule.map((item, index) => (
                    <div key={index} className={cn(
                      'flex items-center justify-between p-3 rounded-lg transition-colors',
                      isDark ? 'bg-indigo-950/30 hover:bg-indigo-950/50' : 'bg-white/50 hover:bg-white/80'
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold', item.color)}>
                          {item.day}
                        </div>
                        <div>
                          <p className={cn('font-medium text-sm', isDark ? 'text-indigo-100' : 'text-slate-800')}>{item.subject}</p>
                          <p className={cn('text-xs flex items-center gap-1', textSecondary)}>
                            <Clock className="w-3 h-3" />{item.time}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={cn('w-4 h-4', isDark ? 'text-indigo-600' : 'text-slate-300')} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Continue Learning — GLASS */}
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="glass-card-hub glass-academy p-5 backdrop-blur-md border-l-4 border-l-[#174EA6]">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <p className={cn('text-xs font-medium uppercase tracking-wider', textSecondary)}>Continue where you left off</p>
                    {currentLesson && (
                      <>
                        <div className={cn('flex items-center gap-2 text-xs', textSecondary)}>
                          {(currentLesson as any).unit && (
                            <span>Unit {(currentLesson as any).unit.unit_number}: {(currentLesson as any).unit.title}</span>
                          )}
                          {currentLesson.sequence_order && (
                            <span>· Lesson {currentLesson.sequence_order}</span>
                          )}
                        </div>
                        <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-800')}>
                          {currentLesson.title || 'Writing Workshop'}
                        </h3>
                      </>
                    )}
                    {!currentLesson && <h3 className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-800')}>No lessons available</h3>}
                    <p className={cn('text-sm', textSecondary)}>{currentLesson?.duration_minutes || 35} min</p>
                    <div className={cn('mt-2 h-1.5 w-48 rounded-full overflow-hidden', isDark ? 'bg-indigo-900/50' : 'bg-slate-100')}>
                      <div className="h-full w-3/5 bg-gradient-to-r from-[#174EA6] to-[#B75EED] rounded-full" />
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-[#174EA6] to-[#B75EED] hover:from-indigo-700 hover:to-purple-700 text-white px-5 rounded-lg text-sm font-medium glow-pulse-academy">
                    Continue <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* AI Lesson Card */}
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
              <AIPersonalizedLessonCard />
            </motion.div>

            {/* Record Clip */}
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28 }}>
              <RecordClipWidget />
            </motion.div>

            {/* Daily Voice Gym */}
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }}>
              <DashboardVoiceGym hub="academy" />
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-5">
            {/* Book a Slot — GLOWING */}
            <Button
              onClick={() => setBookingOpen(true)}
              className="w-full bg-gradient-to-r from-[#174EA6] to-[#B75EED] hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium py-2.5 text-sm glow-pulse-academy"
            >
              Book a Slot with a Teacher
            </Button>

            {/* Skill XP */}
            <SkillXPBars />

            {/* Leaderboard — GLASS */}
            <div className="glass-card-hub glass-academy p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className={cn('flex items-center gap-2 text-base font-semibold', textPrimary)}>
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Leaderboard
                </h3>
              </div>
              <Tabs value={leaderboardPeriod} onValueChange={(v) => setLeaderboardPeriod(v as any)} className="mb-3">
                <TabsList className={cn('grid grid-cols-3', isDark ? 'bg-indigo-950/50' : 'bg-slate-100')}>
                  <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                  <TabsTrigger value="all" className="text-xs">All Time</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="space-y-2">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm',
                      user.isYou
                        ? isDark ? 'bg-indigo-800/30 border border-indigo-600/30' : 'bg-[#174EA6]/5 border border-[#174EA6]/15'
                        : isDark ? 'bg-indigo-950/30' : 'bg-white/50'
                    )}
                  >
                    <span className={cn('w-6 text-center font-bold text-xs',
                      user.rank === 1 ? 'text-amber-500' :
                      user.rank === 2 ? 'text-slate-400' :
                      user.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                    )}>
                      #{user.rank}
                    </span>
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className={cn('text-xs font-medium', isDark ? 'bg-indigo-900 text-indigo-300' : 'bg-slate-100 text-slate-600')}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className={cn('font-medium', isDark ? 'text-indigo-200' : 'text-slate-700')}>
                        {user.name} {user.isYou && <span className={cn('text-xs', textPrimary)}>(You)</span>}
                      </p>
                    </div>
                    {user.change !== 0 && (
                      <div className={cn('flex items-center gap-0.5 text-xs', user.change > 0 ? 'text-emerald-400' : 'text-red-400')}>
                        {user.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(user.change)}
                      </div>
                    )}
                    <span className={cn('font-semibold text-xs', textPrimary)}>{user.xp.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className={cn('w-full mt-3 text-xs', isDark ? 'border-indigo-800 text-indigo-300 hover:bg-indigo-900/30' : 'border-slate-200 text-slate-500 hover:text-[#174EA6]')}>
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Challenge a Friend
              </Button>
            </div>

            {/* Social Lounge */}
            <SocialLounge />

            {/* Weekly Goal */}
            <WeeklyGoalWidget studentLevel="academy" />

            {/* AI Lesson Agent */}
            <AILessonAgent studentLevel="academy" studentInterests={['gaming', 'social media', 'music']} cefrLevel="A2" />

            <MaterialsGallery track="teens" />
            <RecentLessonReports hubId="academy" />
            <RecommendedTeachers hubLevel="academy" />

            {onLevelUp && (
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <Button
                  onClick={onLevelUp}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-2.5 rounded-lg text-sm"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Graduate to The Hub!
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <BookMyClassModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} studentLevel="academy" />
    </div>
  );
};
