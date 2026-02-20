import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: lessons = [], isLoading } = useCurriculumLessons('adult');
  const liveStatus = useLiveClassroomStatus('student');

  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // Mock resources
  const resources = [
    { name: 'Business English Guide.pdf', size: '2.4 MB', type: 'PDF' },
    { name: 'Vocabulary Builder.pdf', size: '1.8 MB', type: 'PDF' },
    { name: 'Interview Practice Audio.mp3', size: '15.2 MB', type: 'Audio' },
    { name: 'Weekly Practice Exercises.pdf', size: '890 KB', type: 'PDF' },
  ];

  // Mock progress stats
  const stats = {
    coursesCompleted: 3,
    coursesInProgress: 2,
    hoursLearned: 24,
    streak: 12,
  };

  // Mock weekly activity data — shaped for LearningVelocityChart
  const weeklyActivity = [
    { day: 'Mon', studied: 1.5, goal: 2 },
    { day: 'Tue', studied: 2.0, goal: 2 },
    { day: 'Wed', studied: 0.5, goal: 2 },
    { day: 'Thu', studied: 1.0, goal: 2 },
    { day: 'Fri', studied: 2.5, goal: 2 },
    { day: 'Sat', studied: 0.0, goal: 2 },
    { day: 'Sun', studied: 1.0, goal: 2 },
  ];
  const maxHours = Math.max(...weeklyActivity.map(d => d.studied));

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-50' : 'text-gray-900';
  const mutedClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const cardClass = isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100';

  return (
    <div className={`min-h-screen transition-colors ${bgClass}`}>
      {/* Top Navigation */}
      <header className={`border-b sticky top-0 z-50 ${borderClass} ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                  : 'bg-gradient-to-br from-emerald-600 to-teal-600'
              }`}>
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className={`text-xl font-semibold ${textClass}`}>The Hub</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeNav === item.id 
                      ? isDarkMode 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-emerald-50 text-emerald-600' 
                      : isDarkMode
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                isDarkMode ? 'bg-emerald-900/30' : 'bg-gradient-to-br from-emerald-100 to-teal-100'
              }`}>
                👩‍💼
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* LIVE Session Banner — appears automatically when teacher opens the room */}
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
              ? 'bg-gray-800 border border-emerald-500/30'
              : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'
            }`}>
              <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <div>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Next Career Milestone</p>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Master Business Presentations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className={`text-sm font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>68%</p>
            </div>
            <div className={`w-24 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-full w-[68%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
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
          <h1 className={`text-2xl md:text-3xl font-semibold ${textClass} mb-1`}>
            Good morning, {studentName}
          </h1>
          <p className={mutedClass}>
            Continue your learning journey where you left off.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard icon={<CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />} label="Completed" value={stats.coursesCompleted} suffix="courses" isDarkMode={isDarkMode} />
          <StatCard icon={<BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-500'}`} />} label="In Progress" value={stats.coursesInProgress} suffix="courses" isDarkMode={isDarkMode} />
          <StatCard icon={<Clock className={`w-5 h-5 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`} />} label="Total Hours" value={stats.hoursLearned} suffix="hrs" isDarkMode={isDarkMode} />
          <StatCard icon={<TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />} label="Streak" value={stats.streak} suffix="days" isDarkMode={isDarkMode} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Skills Radar, Milestones & AI Agent */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Radar Chart */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SkillsRadarChart isDarkMode={isDarkMode} />
            </motion.div>

            {/* Business Milestones - promoted to main area */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.22 }}
            >
              <BusinessMilestonesCard
                timeSavedHours={4.5}
                isDarkMode={isDarkMode}
              />
            </motion.div>

            {/* Learning Velocity Chart */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.24 }}
            >
              <LearningVelocityChart
                isDarkMode={isDarkMode}
                weeklyData={weeklyActivity}
                dailyGoalHours={2}
              />
            </motion.div>

            {/* Daily AI Lesson Card */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.26 }}
            >
              <AIPersonalizedLessonCard isDarkMode={isDarkMode} />
            </motion.div>

            {/* AI Lesson Agent */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.28 }}
            >
              <AILessonAgent
                studentLevel="professional"
                studentInterests={['business', 'technology', 'leadership']}
                cefrLevel="B1"
              />
            </motion.div>
          </div>

          {/* Right Column - Resources & Schedule */}
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Weekly Briefing AI Card — top of right sidebar */}
            <WeeklyBriefingCard isDarkMode={isDarkMode} />

            {/* Weekly Goal */}
            <WeeklyGoalWidget studentLevel="professional" isDarkMode={isDarkMode} />

            {/* Resources */}
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 ${textClass}`}>
                  <FileText className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
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

            {/* Recommended Teachers */}
            <RecommendedTeachers isDarkMode={isDarkMode} />

            {/* Schedule a Session CTA */}
            <button
              onClick={() => setBookingOpen(true)}
              className={`w-full py-3 px-5 rounded-xl font-semibold text-sm transition-all hover:brightness-105 active:scale-95 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
              } shadow-md`}
            >
              📅 Schedule a Session
            </button>

            {/* Upcoming Session */}
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 ${textClass}`}>
                  <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-green-600'}`} />
                  Next Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-700/30' 
                    : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
                }`}>
                  <p className={`font-medium ${textClass}`}>Public Speaking Workshop</p>
                  <p className={`text-sm mt-1 ${mutedClass}`}>Tomorrow at 6:00 PM</p>
                  <Button className={`mt-3 w-full ${
                    isDarkMode 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}>
                    Join Session
                  </Button>

                  {/* Calendar integration buttons */}
                  <div className="flex gap-2 mt-2">
                    <a
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Public+Speaking+Workshop&details=English+lesson+session&dates=20260221T180000Z/20260221T190000Z`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-2 rounded-lg border transition-colors ${
                        isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Google Cal
                    </a>
                    <a
                      href={`https://outlook.live.com/calendar/0/deeplink/compose?subject=Public+Speaking+Workshop&startdt=2026-02-21T18:00:00&enddt=2026-02-21T19:00:00`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-2 rounded-lg border transition-colors ${
                        isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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

      {/* Booking Modal */}
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
  <Card className={isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'border-gray-100'}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>{icon}</div>
        <div>
          <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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
    isDarkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
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
        <p className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{name}</p>
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{size}</p>
      </div>
    </div>
    <Button variant="ghost" size="sm" className={isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}>
      <Download className="w-4 h-4" />
    </Button>
  </div>
);
