import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HubSkeleton } from '@/components/shared/DashboardSkeleton';
import { useLiveClassroomStatus } from '@/hooks/useLiveClassroomStatus';
import { LiveSessionBadge } from '@/components/shared/LiveSessionBadge';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useStudentLanguageSync } from '@/hooks/useStudentLanguageSync';
import { 
  LayoutDashboard, BookOpen, Award, Settings, 
  Download, FileText, TrendingUp, Clock, CheckCircle, 
  ChevronRight, Calendar, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurriculumLessons } from '@/hooks/useCurriculumLessons';
import { SkillsRadarChart } from '../hub/SkillsRadarChart';
import { MaterialsGallery } from '../MaterialsGallery';
import { BusinessMilestonesCard } from '../hub/BusinessMilestonesCard';
import { LearningVelocityChart } from '../hub/LearningVelocityChart';
import { WeeklyBriefingCard } from '../hub/WeeklyBriefingCard';
import { AIPersonalizedLessonCard } from '../AIPersonalizedLessonCard';
import { AILessonAgent } from '../AILessonAgent';
import { WeeklyGoalWidget } from '../WeeklyGoalWidget';
import { RecommendedTeachers } from '../RecommendedTeachers';
import { RecentLessonReports } from '../RecentLessonReports';
import { BookMyClassModal } from '../BookMyClassModal';
import { CreditDisplay } from '../CreditDisplay';
import { JoinLessonHero } from '../JoinLessonHero';
import { HubLogo } from '../HubLogo';
import { usePackageValidation } from '@/hooks/usePackageValidation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { DashboardVoiceGym } from '../DashboardVoiceGym';

interface HubDashboardProps {
  studentName?: string;
  totalXp?: number;
  onLevelUp?: () => void;
}

type NavItem = 'dashboard' | 'courses' | 'certificates' | 'settings';

export const HubDashboard: React.FC<HubDashboardProps> = ({
  studentName = 'Sarah',
  totalXp = 5680,
}) => {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: lessons = [], isLoading } = useCurriculumLessons('adult');
  const liveStatus = useLiveClassroomStatus('student');
  const { user } = useAuth();
  const { totalCredits, loading: creditsLoading } = usePackageValidation(user?.id || null);
  const { resolvedTheme } = useThemeMode();
  const isDarkMode = resolvedTheme === 'dark';
  const { t } = useTranslation();
  useStudentLanguageSync();

  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const resources = [
    { name: 'Business English Guide.pdf', size: '2.4 MB', type: 'PDF' },
    { name: 'Vocabulary Builder.pdf', size: '1.8 MB', type: 'PDF' },
    { name: 'Interview Practice Audio.mp3', size: '15.2 MB', type: 'Audio' },
    { name: 'Weekly Practice Exercises.pdf', size: '890 KB', type: 'PDF' },
  ];

  const stats = {
    coursesCompleted: 3,
    coursesInProgress: 2,
    hoursLearned: 24,
    streak: 12,
  };

  const textClass = isDarkMode ? 'text-emerald-50' : 'text-[#0D652D]';
  const mutedClass = isDarkMode ? 'text-emerald-400' : 'text-gray-500';

  if (isLoading) return <HubSkeleton />;

  return (
    <div className="relative space-y-6">
      {/* ═══════════ TOP NAV — GLASSMORPHIC ═══════════ */}
      <header className="glass-card-hub glass-professional flex items-center justify-between px-5 py-3 backdrop-blur-xl">
        <HubLogo hubId="professional" size="md" />
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm',
                activeNav === item.id
                  ? isDarkMode ? 'text-white border-b-2 border-[#3DD39B]' : 'text-[#0D652D] border-b-2 border-[#0D652D]'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className={cn('font-medium', textClass)}>{studentName}</p>
            <p className={cn('text-sm', mutedClass)}>{totalXp.toLocaleString()} XP</p>
          </div>
        </div>
      </header>

      {/* ═══════════ HERO WELCOME — GLASSMORPHIC ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card-hub glass-professional p-6 backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D652D]/10 via-[#3DD39B]/10 to-transparent pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0D652D] to-[#3DD39B] bg-clip-text text-transparent">
              {t('sd.welcomeAdults', { name: studentName, defaultValue: 'Good morning, {{name}}' })} ☀️
            </h1>
            <p className={cn('text-sm mt-1', mutedClass)}>
              {t('sd.subtitleAdults', 'Continue your executive learning journey where you left off.')}
            </p>
          </div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl hidden md:block"
          >
            💼
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div>
        {/* JOIN LESSON HERO */}
        <div className="mb-6">
          <JoinLessonHero hubId="professional" isDark={isDarkMode} />
        </div>

        {/* LIVE Session Banner */}
        {liveStatus.isLive && liveStatus.classroomUrl && (
          <div className="mb-6">
            <LiveSessionBadge classroomUrl={liveStatus.classroomUrl} variant="banner" isDarkMode={isDarkMode} />
          </div>
        )}

        {/* Next Career Milestone — GLASS */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card-hub glass-professional mb-6 p-4 backdrop-blur-md flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-50')}>
              <TrendingUp className="w-5 h-5 text-[#3DD39B]" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#3DD39B]">
                {t('sd.nextCareerMilestone', 'Next Career Milestone')}
              </p>
              <p className={cn('font-semibold', textClass)}>Master Business Presentations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-[#3DD39B]">68%</p>
            </div>
            <div className={cn('w-24 h-2 rounded-full overflow-hidden', isDarkMode ? 'bg-gray-700' : 'bg-gray-200')}>
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#0D652D] to-[#3DD39B]" />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid — GLASS */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <GlassStatCard icon={<CheckCircle className="w-5 h-5 text-[#3DD39B]" />} label={t('sd.completed', 'Completed')} value={stats.coursesCompleted} suffix={t('sd.courses', 'courses')} isDarkMode={isDarkMode} />
          <GlassStatCard icon={<BookOpen className="w-5 h-5 text-[#3DD39B]" />} label={t('sd.inProgress', 'In Progress')} value={stats.coursesInProgress} suffix={t('sd.courses', 'courses')} isDarkMode={isDarkMode} />
          <GlassStatCard icon={<Clock className="w-5 h-5 text-[#3DD39B]" />} label={t('sd.totalHours', 'Total Hours')} value={stats.hoursLearned} suffix={t('sd.hours', 'hrs')} isDarkMode={isDarkMode} />
          <GlassStatCard icon={<TrendingUp className="w-5 h-5 text-[#3DD39B]" />} label={t('sd.streak', 'Streak')} value={stats.streak} suffix={t('sd.days', 'days')} isDarkMode={isDarkMode} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <SkillsRadarChart isDarkMode={isDarkMode} />
            </motion.div>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}>
              <BusinessMilestonesCard timeSavedHours={4.5} isDarkMode={isDarkMode} />
            </motion.div>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.24 }}>
              <LearningVelocityChart isDarkMode={isDarkMode} />
            </motion.div>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.26 }}>
              <AIPersonalizedLessonCard isDarkMode={isDarkMode} />
            </motion.div>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28 }}>
              <AILessonAgent studentLevel="professional" studentInterests={['business', 'technology', 'leadership']} cefrLevel="B1" />
            </motion.div>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }}>
              <DashboardVoiceGym hub="success" />
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-6">
            <CreditDisplay totalCredits={totalCredits} loading={creditsLoading} showPurchaseButton={true} size="md" />
            <WeeklyBriefingCard isDarkMode={isDarkMode} />
            <WeeklyGoalWidget studentLevel="professional" isDarkMode={isDarkMode} />

            {/* Resources — GLASS */}
            <div className="glass-card-hub glass-professional p-5 backdrop-blur-md">
              <h3 className={cn('text-lg flex items-center gap-2 tracking-tight mb-1 font-semibold', textClass)}>
                <FileText className="w-5 h-5 text-[#3DD39B]" />
                {t('sd.resources', 'Resources')}
              </h3>
              <p className={cn('text-sm mb-4', mutedClass)}>{t('sd.downloadableMaterials', 'Downloadable materials')}</p>
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <ResourceItem key={index} {...resource} isDarkMode={isDarkMode} />
                ))}
              </div>
            </div>

            <MaterialsGallery track="adults" />
            <RecentLessonReports hubId="professional" />
            <RecommendedTeachers isDarkMode={isDarkMode} hubLevel="professional" />

            {/* Schedule Executive Briefing — GLOWING */}
            <button
              onClick={() => setBookingOpen(true)}
              className="w-full py-3 px-5 rounded-xl font-semibold text-sm transition-all hover:brightness-105 active:scale-95 text-white shadow-md uppercase tracking-wider bg-gradient-to-r from-[#0D652D] to-[#3DD39B] glow-pulse-professional"
            >
              📅 {t('sd.scheduleExecBriefing', 'Schedule Executive Briefing')}
            </button>

            {/* Upcoming Session — GLASS */}
            <div className="glass-card-hub glass-professional p-5 backdrop-blur-md">
              <h3 className={cn('text-lg flex items-center gap-2 tracking-tight mb-4 font-semibold', textClass)}>
                <Calendar className="w-5 h-5 text-[#3DD39B]" />
                {t('sd.nextSession', 'Next Session')}
              </h3>
              <div className={cn(
                'p-4 rounded-lg border',
                isDarkMode ? 'bg-emerald-950/30 border-emerald-800/30' : 'bg-white/50 border-emerald-200/30'
              )}>
                <p className={cn('font-medium', textClass)}>Public Speaking Workshop</p>
                <p className={cn('text-sm mt-1', mutedClass)}>Tomorrow at 6:00 PM</p>
                <Button className="mt-3 w-full text-white bg-gradient-to-r from-[#0D652D] to-[#3DD39B]">
                  {t('sd.joinExecBriefing', 'Join Executive Briefing')}
                </Button>
                <div className="flex gap-2 mt-2">
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Public+Speaking+Workshop&details=English+lesson+session&dates=20260221T180000Z/20260221T190000Z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-2 rounded-lg border transition-colors',
                      isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-emerald-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Google Cal
                  </a>
                  <a
                    href="https://outlook.live.com/calendar/0/deeplink/compose?subject=Public+Speaking+Workshop&startdt=2026-02-21T18:00:00&enddt=2026-02-21T19:00:00"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-2 rounded-lg border transition-colors',
                      isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-emerald-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Outlook
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <BookMyClassModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} studentLevel="professional" />
    </div>
  );
};

// Sub-components
interface GlassStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
  isDarkMode?: boolean;
}

const GlassStatCard: React.FC<GlassStatCardProps> = ({ icon, label, value, suffix, isDarkMode = false }) => (
  <div className="glass-card-hub glass-professional p-4 backdrop-blur-md">
    <div className="flex items-center gap-3">
      <div className={cn('p-2 rounded-lg', isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-50')}>{icon}</div>
      <div>
        <p className={cn('text-2xl font-semibold', isDarkMode ? 'text-white' : 'text-[#0D652D]')}>
          {value} <span className={cn('text-sm font-normal', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>{suffix}</span>
        </p>
        <p className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>{label}</p>
      </div>
    </div>
  </div>
);

interface ResourceItemProps {
  name: string;
  size: string;
  type: string;
  isDarkMode?: boolean;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ name, size, type, isDarkMode = false }) => (
  <div className={cn(
    'flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer',
    isDarkMode ? 'bg-emerald-950/30 hover:bg-emerald-950/50' : 'bg-white/50 hover:bg-white/80'
  )}>
    <div className="flex items-center gap-3">
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center',
        type === 'PDF'
          ? isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
          : isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
      )}>
        <FileText className="w-4 h-4" />
      </div>
      <div>
        <p className={cn('font-medium text-sm', isDarkMode ? 'text-gray-200' : 'text-[#0D652D]')}>{name}</p>
        <p className="text-xs text-gray-500">{size}</p>
      </div>
    </div>
    <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}>
      <Download className="w-4 h-4" />
    </Button>
  </div>
);
