import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Award, Settings, 
  Download, FileText, TrendingUp, Clock, CheckCircle, 
  ChevronRight, BarChart3, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCurriculumLessons } from '@/hooks/useCurriculumLessons';

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
  const { data: lessons = [], isLoading } = useCurriculumLessons('adult');

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

  // Mock weekly activity data
  const weeklyActivity = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2 },
    { day: 'Wed', hours: 0.5 },
    { day: 'Thu', hours: 1 },
    { day: 'Fri', hours: 2.5 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 1 },
  ];
  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">The Hub</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeNav === item.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-900">{studentName}</p>
                <p className="text-sm text-gray-500">{totalXp.toLocaleString()} XP</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-lg">
                👩‍💼
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
            Good morning, {studentName}
          </h1>
          <p className="text-gray-500">
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
          <StatCard icon={<CheckCircle className="w-5 h-5 text-green-600" />} label="Completed" value={stats.coursesCompleted} suffix="courses" />
          <StatCard icon={<BookOpen className="w-5 h-5 text-blue-600" />} label="In Progress" value={stats.coursesInProgress} suffix="courses" />
          <StatCard icon={<Clock className="w-5 h-5 text-indigo-600" />} label="Total Hours" value={stats.hoursLearned} suffix="hrs" />
          <StatCard icon={<TrendingUp className="w-5 h-5 text-orange-600" />} label="Streak" value={stats.streak} suffix="days" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Course Progress & Weekly Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Progress */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Progress</CardTitle>
                  <CardDescription>Your active courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1,2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg" />)}
                    </div>
                  ) : (
                    lessons.slice(0, 3).map((lesson, index) => (
                      <CourseProgressItem
                        key={lesson.id}
                        title={lesson.title}
                        progress={[78, 45, 20][index] || 0}
                        duration={lesson.duration_minutes}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Activity Chart */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-40 gap-2">
                    {weeklyActivity.map((day) => (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-blue-100 rounded-t-lg transition-all hover:bg-blue-200 relative"
                          style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: day.hours > 0 ? '8px' : '2px' }}
                        >
                          {day.hours > 0 && (
                            <div 
                              className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                            />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{day.day}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    You've studied {weeklyActivity.reduce((a, b) => a + b.hours, 0)} hours this week
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Resources */}
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Resources
                </CardTitle>
                <CardDescription>Downloadable materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {resources.map((resource, index) => (
                  <ResourceItem key={index} {...resource} />
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Session */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Next Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <p className="font-medium text-gray-900">Public Speaking Workshop</p>
                  <p className="text-sm text-gray-600 mt-1">Tomorrow at 6:00 PM</p>
                  <Button className="mt-3 w-full bg-green-600 hover:bg-green-700">
                    Join Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, suffix }) => (
  <Card className="border-gray-100">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <div>
          <p className="text-2xl font-semibold text-gray-900">
            {value} <span className="text-sm font-normal text-gray-500">{suffix}</span>
          </p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface CourseProgressItemProps {
  title: string;
  progress: number;
  duration: number;
}

const CourseProgressItem: React.FC<CourseProgressItemProps> = ({ title, progress, duration }) => (
  <div className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-all">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-medium text-gray-900">{title}</h4>
      <span className="text-sm text-blue-600 font-medium">{progress}%</span>
    </div>
    <Progress value={progress} className="h-2 mb-2" />
    <div className="flex items-center justify-between text-sm text-gray-500">
      <span>{duration} min per lesson</span>
      <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
        Continue <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

interface ResourceItemProps {
  name: string;
  size: string;
  type: string;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ name, size, type }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
      }`}>
        <FileText className="w-4 h-4" />
      </div>
      <div>
        <p className="font-medium text-gray-900 text-sm">{name}</p>
        <p className="text-xs text-gray-500">{size}</p>
      </div>
    </div>
    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
      <Download className="w-4 h-4" />
    </Button>
  </div>
);
