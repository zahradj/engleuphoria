import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HubSkeleton } from '@/components/shared/DashboardSkeleton';
import { useLiveClassroomStatus } from '@/hooks/useLiveClassroomStatus';
import { LiveSessionBadge } from '@/components/shared/LiveSessionBadge';
import { 
  LayoutDashboard, BookOpen, Award, Settings, 
  Download, FileText, TrendingUp, Clock, CheckCircle, 
  ChevronRight, BarChart3, Calendar, Moon, Sun, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCurriculumLessons } from '@/hooks/useCurriculumLessons';
import { SkillsRadarChart } from '../hub/SkillsRadarChart';
import { MaterialsGallery } from '../MaterialsGallery';
import { BusinessMilestonesCard } from '../hub/BusinessMilestonesCard';
import { LearningVelocityChart } from '../hub/LearningVelocityChart';
import { WeeklyBriefingCard } from '../hub/WeeklyBriefingCard';
import { DailyLessonCard } from '../DailyLessonCard';
import { AIPersonalizedLessonCard } from '../AIPersonalizedLessonCard';
import { AILessonAgent } from '../AILessonAgent';
import { WeeklyGoalWidget } from '../WeeklyGoalWidget';
import { RecommendedTeachers } from '../RecommendedTeachers';
import { BookMyClassModal } from '../BookMyClassModal';
import { CreditDisplay } from '../CreditDisplay';
import { JoinLessonHero } from '../JoinLessonHero';
import { HubLogo } from '../HubLogo';
import { usePackageValidation } from '@/hooks/usePackageValidation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HubDashboardProps {
  studentName?: string;
  totalXp?: number;
  onLevelUp?: () => void;
}

type NavItem = 'dashboard' | 'courses' | 'certificates' | 'settings';

// Success Hub color constants — Green & Teal
const PRIMARY = '#1B5E20';
const ACCENT = '#009688';

export const HubDashboard: React.FC<HubDashboardProps> = ({
  studentName = 'Sarah',
  totalXp = 5680,
}) => {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: lessons = [], isLoading } = useCurriculumLessons('adult');
  const liveStatus = useLiveClassroomStatus('student');
  const { user } = useAuth();
  const { totalCredits, loading: creditsLoading } = usePackageValidation(user?.id || null);

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

  // Success Hub palette classes
  const bgClass = isDarkMode ? 'bg-[#0D1A0F]' : 'bg-[#F5FAF5]';
  const textClass = isDarkMode ? 'text-emerald-50' : 'text-[#1B5E20]';
  const mutedClass = isDarkMode ? 'text-emerald-400' : 'text-gray-500';
  const borderClass = isDarkMode ? 'border-emerald-900/50' : 'border-emerald-200/50';
  const cardClass = isDarkMode ? 'bg-emerald-950/50 border-emerald-800/30' : 'bg-white border-emerald-200/50 hover:border-teal-400/40 transition-colors';

  if (isLoading) return <HubSkeleton />;

  return (
    <div className="relative space-y-6">
      {/* Top Navigation Bar */}
      <header className={cn(
        'flex items-center justify-between px-5 py-3 rounded-xl border',
        isDarkMode
          ? 'bg-emerald-950/60 backdrop-blur-xl border-emerald-700/30'
          : 'bg-white/80 backdrop-blur-xl border-emerald-200/50 shadow-sm'
      )}>
        {/* Logo */}
        <HubLogo hubId="professional" size="md" />

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm',
                activeNav === item.id
                  ? isDarkMode ? 'text-white border-b-2 border-teal-400' : 'text-emerald-800 border-b-2 border-emerald-600'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User + Dark Mode */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              'p-2 rounded-lg transition-all',
              isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
            )}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="text-right hidden sm:block">
            <p className={cn('font-medium', textClass)}>{studentName}</p>
            <p className={cn('text-sm', mutedClass)}>{totalXp.toLocaleString()} XP</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div>
        {/* JOIN LESSON HERO — primary CTA */}
        <div className="mb-6">
          <JoinLessonHero hubId="professional" isDark={isDarkMode} />
        </div>

        {/* LIVE Session Banner */}
        {liveStatus.isLive && liveStatus.classroomUrl && (
          <div className="mb-6">
            <LiveSessionBadge
              classroomUrl={liveStatus.classroomUrl}
              variant="banner"
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* Next Career Milestone Banner */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
            isDarkMode
              ? 'bg-[#1A2B3C] border border-[#C9A96E]/30'
              : 'bg-gradient-to-r from-[#F5F0E8] to-[#EDE9E0] border border-[#C9A96E]/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: isDarkMode ? '#2A3D50' : '#E8DFD0' }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: ACCENT }} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: ACCENT }}>
                Next Career Milestone
              </p>
              <p className={`font-semibold ${textClass}`}>Master Business Presentations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: ACCENT }}>68%</p>
            </div>
            <div className={`w-24 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-full w-[68%] rounded-full" style={{ backgroundColor: ACCENT }} />
            </div>
          </div>
        </motion.div>

        {/* Welcome Section */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <h1 className={`text-2xl md:text-3xl font-semibold tracking-tight ${textClass} mb-1`}>
            Good morning, {studentName}
          </h1>
          <p className={mutedClass}>
            Continue your executive learning journey where you left off.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard icon={<CheckCircle className="w-5 h-5" style={{ color: ACCENT }} />} label="Completed" value={stats.coursesCompleted} suffix="courses" isDarkMode={isDarkMode} />
          <StatCard icon={<BookOpen className="w-5 h-5" style={{ color: ACCENT }} />} label="In Progress" value={stats.coursesInProgress} suffix="courses" isDarkMode={isDarkMode} />
          <StatCard icon={<Clock className="w-5 h-5" style={{ color: ACCENT }} />} label="Total Hours" value={stats.hoursLearned} suffix="hrs" isDarkMode={isDarkMode} />
          <StatCard icon={<TrendingUp className="w-5 h-5" style={{ color: ACCENT }} />} label="Streak" value={stats.streak} suffix="days" isDarkMode={isDarkMode} />
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
              <AILessonAgent
                studentLevel="professional"
                studentInterests={['business', 'technology', 'leadership']}
                cefrLevel="B1"
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Credit Balance — prominent position */}
            <CreditDisplay
              totalCredits={totalCredits}
              loading={creditsLoading}
              showPurchaseButton={true}
              size="md"
            />

            <WeeklyBriefingCard isDarkMode={isDarkMode} />
            <WeeklyGoalWidget studentLevel="professional" isDarkMode={isDarkMode} />

            {/* Resources */}
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 tracking-tight ${textClass}`}>
                  <FileText className="w-5 h-5" style={{ color: ACCENT }} />
                  Resources
                </CardTitle>
                <CardDescription className={mutedClass}>Downloadable materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {resources.map((resource, index) => (
                  <ResourceItem key={index} {...resource} isDarkMode={isDarkMode} />
                ))}
              </CardContent>
            </Card>

            <MaterialsGallery track="adults" />

            <RecommendedTeachers isDarkMode={isDarkMode} hubLevel="professional" />

            {/* Schedule Executive Briefing CTA */}
            <button
              onClick={() => setBookingOpen(true)}
              className="w-full py-3 px-5 rounded-xl font-semibold text-sm transition-all hover:brightness-105 active:scale-95 text-white shadow-md uppercase tracking-wider"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}, #2A3D50)` }}
            >
              📅 Schedule Executive Briefing
            </button>

            {/* Upcoming Session */}
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 tracking-tight ${textClass}`}>
                  <Calendar className="w-5 h-5" style={{ color: ACCENT }} />
                  Next Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? 'bg-[#1A2B3C] border-[#2A3D50]'
                    : 'bg-gradient-to-br from-[#F5F0E8] to-[#EDE9E0] border-[#C9A96E]/20'
                }`}>
                  <p className={`font-medium ${textClass}`}>Public Speaking Workshop</p>
                  <p className={`text-sm mt-1 ${mutedClass}`}>Tomorrow at 6:00 PM</p>
                  <Button
                    className="mt-3 w-full text-white"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    Join Executive Briefing
                  </Button>

                  <div className="flex gap-2 mt-2">
                    <a
                      href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Public+Speaking+Workshop&details=English+lesson+session&dates=20260221T180000Z/20260221T190000Z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-2 rounded-lg border transition-colors ${
                        isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-[#E8E4DD] text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Google Cal
                    </a>
                    <a
                      href="https://outlook.live.com/calendar/0/deeplink/compose?subject=Public+Speaking+Workshop&startdt=2026-02-21T18:00:00&enddt=2026-02-21T19:00:00"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-2 rounded-lg border transition-colors ${
                        isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-[#E8E4DD] text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Outlook
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <BookMyClassModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        studentLevel="professional"
      />
    </div>
  );
};

// Sub-components
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
  isDarkMode?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, suffix, isDarkMode = false }) => (
  <Card className={isDarkMode ? 'bg-[#1A2B3C]/80 border-[#2A3D50]' : 'border-[#E8E4DD] hover:border-[#C9A96E]/40 transition-colors'}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#2A3D50]' : 'bg-[#F5F0E8]'}`}>{icon}</div>
        <div>
          <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-[#1A2B3C]'}`}>
            {value} <span className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{suffix}</span>
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface ResourceItemProps {
  name: string;
  size: string;
  type: string;
  isDarkMode?: boolean;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ name, size, type, isDarkMode = false }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
    isDarkMode ? 'bg-[#2A3D50]/50 hover:bg-[#2A3D50]' : 'bg-[#F5F0E8] hover:bg-[#EDE9E0]'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        type === 'PDF'
          ? isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
          : isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
      }`}>
        <FileText className="w-4 h-4" />
      </div>
      <div>
        <p className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-[#1A2B3C]'}`}>{name}</p>
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{size}</p>
      </div>
    </div>
    <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}>
      <Download className="w-4 h-4" />
    </Button>
  </div>
);
