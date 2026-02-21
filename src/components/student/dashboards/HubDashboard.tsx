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
import { usePackageValidation } from '@/hooks/usePackageValidation';
import { useAuth } from '@/contexts/AuthContext';

interface HubDashboardProps {
  studentName?: string;
  totalXp?: number;
  onLevelUp?: () => void;
}

type NavItem = 'dashboard' | 'courses' | 'certificates' | 'settings';

// Executive color constants
const NAVY = '#1A2B3C';
const GOLD = '#C9A96E';

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

  // Executive palette classes
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-[#F8F7F4]';
  const textClass = isDarkMode ? 'text-gray-50' : 'text-[#1A2B3C]';
  const mutedClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-[#E8E4DD]';
  const cardClass = isDarkMode ? 'bg-[#1A2B3C]/80 border-[#2A3D50]' : 'bg-white border-[#E8E4DD] hover:border-[#C9A96E]/40 transition-colors';

  if (isLoading) return <HubSkeleton />;

  return (
    <div className={`min-h-screen transition-colors ${bgClass}`}>
      {/* Top Navigation */}
      <header className={`border-b sticky top-0 z-50 ${borderClass} ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: NAVY }}
              >
                <BookOpen className="w-4 h-4" style={{ color: GOLD }} />
              </div>
              <span className={`text-xl font-semibold tracking-tight ${textClass}`}>
                Executive Learning Hub
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm uppercase tracking-wide ${
                    activeNav === item.id
                      ? isDarkMode
                        ? 'text-white'
                        : 'text-[#1A2B3C]'
                      : isDarkMode
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A2B3C]'
                  }`}
                  style={activeNav === item.id ? { borderBottom: `2px solid ${GOLD}` } : undefined}
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
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="text-right hidden sm:block">
                <p className={`font-medium ${textClass}`}>{studentName}</p>
                <p className={`text-sm ${mutedClass}`}>{totalXp.toLocaleString()} XP</p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: isDarkMode ? '#2A3D50' : '#EDE9E0' }}
              >
                👩‍💼
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
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
              <TrendingUp className="w-5 h-5" style={{ color: GOLD }} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: GOLD }}>
                Next Career Milestone
              </p>
              <p className={`font-semibold ${textClass}`}>Master Business Presentations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: GOLD }}>68%</p>
            </div>
            <div className={`w-24 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-full w-[68%] rounded-full" style={{ backgroundColor: GOLD }} />
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
          <StatCard icon={<CheckCircle className="w-5 h-5" style={{ color: GOLD }} />} label="Completed" value={stats.coursesCompleted} suffix="courses" isDarkMode={isDarkMode} />
          <StatCard icon={<BookOpen className="w-5 h-5" style={{ color: GOLD }} />} label="In Progress" value={stats.coursesInProgress} suffix="courses" isDarkMode={isDarkMode} />
          <StatCard icon={<Clock className="w-5 h-5" style={{ color: GOLD }} />} label="Total Hours" value={stats.hoursLearned} suffix="hrs" isDarkMode={isDarkMode} />
          <StatCard icon={<TrendingUp className="w-5 h-5" style={{ color: GOLD }} />} label="Streak" value={stats.streak} suffix="days" isDarkMode={isDarkMode} />
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
                  <FileText className="w-5 h-5" style={{ color: GOLD }} />
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

            <RecommendedTeachers isDarkMode={isDarkMode} />

            {/* Schedule Executive Briefing CTA */}
            <button
              onClick={() => setBookingOpen(true)}
              className="w-full py-3 px-5 rounded-xl font-semibold text-sm transition-all hover:brightness-105 active:scale-95 text-white shadow-md uppercase tracking-wider"
              style={{ background: `linear-gradient(135deg, ${NAVY}, #2A3D50)` }}
            >
              📅 Schedule Executive Briefing
            </button>

            {/* Upcoming Session */}
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 tracking-tight ${textClass}`}>
                  <Calendar className="w-5 h-5" style={{ color: GOLD }} />
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
                    style={{ backgroundColor: NAVY }}
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
      </main>

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
