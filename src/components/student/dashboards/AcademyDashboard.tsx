import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, BookOpen, Calendar, Trophy, User, Moon, Sun, 
  Flame, ChevronRight, Clock, Users, Zap, Sparkles, TrendingUp, TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCurriculumLessons } from '@/hooks/useCurriculumLessons';
import { CurriculumLesson } from '@/types/multiTenant';
import { DailyStreakCard } from '../academy/DailyStreakCard';
import { SocialLounge } from '../academy/SocialLounge';
import { AILessonAgent } from '../AILessonAgent';
import { WeeklyGoalWidget } from '../WeeklyGoalWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const { data: lessons = [], isLoading } = useCurriculumLessons('teen');

  const tabs: { id: TabId; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { id: 'learn', icon: <BookOpen className="w-5 h-5" />, label: 'Learn' },
    { id: 'schedule', icon: <Calendar className="w-5 h-5" />, label: 'Schedule' },
    { id: 'rank', icon: <Trophy className="w-5 h-5" />, label: 'Rank' },
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  // Mock schedule data
  const schedule = [
    { day: 'Mon', time: '3:00 PM', subject: 'Grammar' },
    { day: 'Wed', time: '4:30 PM', subject: 'Speaking' },
    { day: 'Fri', time: '2:00 PM', subject: 'Reading' },
  ];

  // Mock leaderboard data with rank changes
  const leaderboard = [
    { rank: 1, name: 'Sarah K.', xp: 4520, avatar: '👩', change: 0 },
    { rank: 2, name: 'Mike T.', xp: 3890, avatar: '👨', change: 1 },
    { rank: 3, name: studentName, xp: totalXp, avatar: '🧑', isYou: true, change: -1 },
    { rank: 4, name: 'Emma L.', xp: 2100, avatar: '👧', change: 2 },
    { rank: 5, name: 'Jake R.', xp: 1850, avatar: '🧒', change: 0 },
  ];

  const currentLesson = lessons[2] || lessons[0]; // Current lesson is third one

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#0f0f1a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`w-20 md:w-64 ${isDarkMode ? 'bg-[#1a1a2e]' : 'bg-white'} border-r ${isDarkMode ? 'border-purple-900/30' : 'border-gray-200'} flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-center md:justify-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Academy
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                activeTab === tab.id 
                  ? isDarkMode 
                    ? 'bg-purple-600/20 text-purple-400 border-r-2 border-purple-500' 
                    : 'bg-purple-50 text-purple-600 border-r-2 border-purple-500'
                  : isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="hidden md:block font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="p-4 border-t border-purple-900/30">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full flex items-center justify-center md:justify-start gap-3 px-4 py-2 rounded-lg transition-all ${
              isDarkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-yellow-100 text-yellow-600'
            }`}
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span className="hidden md:block font-medium">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{studentName}!</span>
            </h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Level {level} • {totalXp.toLocaleString()} XP
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Streak Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
              <Flame className="w-5 h-5 text-orange-500" fill="currentColor" />
              <span className="font-bold text-orange-500">{currentStreak}</span>
            </div>
          </div>
        </motion.div>

        {/* Daily Streak Card - Full Width */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <DailyStreakCard
            currentStreak={currentStreak}
            longestStreak={14}
            weeklyActivity={weeklyActivity}
            hasStreakFreeze={true}
            isDarkMode={isDarkMode}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Schedule & Continue */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Schedule */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={isDarkMode ? 'bg-[#1a1a2e] border-purple-900/30' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-500" />
                    My Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedule.map((item, index) => (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isDarkMode ? 'bg-[#0f0f1a]' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isDarkMode ? 'bg-purple-600/20' : 'bg-purple-100'
                          }`}>
                            <span className="font-bold text-purple-500">{item.day}</span>
                          </div>
                          <div>
                            <p className="font-medium">{item.subject}</p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <Clock className="w-3 h-3 inline mr-1" />{item.time}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Continue Learning - Using CurrentLessonCard */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={`overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-cyan-50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className={`text-sm mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>Continue where you left off</p>
                      
                      {/* Unit & Lesson info from currentLesson */}
                      {currentLesson && (
                        <>
                          <div className="flex items-center gap-2 text-xs opacity-75">
                            {(currentLesson as any).unit && (
                              <span>Unit {(currentLesson as any).unit.unit_number}: {(currentLesson as any).unit.title}</span>
                            )}
                            {currentLesson.sequence_order && (
                              <span>• Lesson {currentLesson.sequence_order}</span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold">
                            {currentLesson.title || 'Writing Workshop'}
                          </h3>
                        </>
                      )}
                      
                      {!currentLesson && (
                        <h3 className="text-xl font-bold">No lessons available</h3>
                      )}
                      
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {currentLesson?.duration_minutes || 35} min
                      </p>
                      {/* Progress bar */}
                      <div className="mt-3 h-2 w-48 bg-gray-700/50 rounded-full overflow-hidden">
                        <div className="h-full w-3/5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6">
                      Continue
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Leaderboard */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className={isDarkMode ? 'bg-[#1a1a2e] border-purple-900/30' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Leaderboard
                  </CardTitle>
                </div>
                {/* Period Tabs */}
                <Tabs value={leaderboardPeriod} onValueChange={(v) => setLeaderboardPeriod(v as any)} className="mt-2">
                  <TabsList className={`grid grid-cols-3 ${isDarkMode ? 'bg-[#0f0f1a]' : ''}`}>
                    <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                    <TabsTrigger value="all" className="text-xs">All Time</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div 
                      key={user.rank}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        user.isYou 
                          ? isDarkMode 
                            ? 'bg-purple-600/20 border border-purple-500/50 shadow-lg shadow-purple-500/20' 
                            : 'bg-purple-50 border border-purple-200'
                          : isDarkMode 
                            ? 'bg-[#0f0f1a]' 
                            : 'bg-gray-50'
                      }`}
                    >
                      <span className={`w-6 text-center font-bold ${
                        user.rank === 1 ? 'text-yellow-500' : 
                        user.rank === 2 ? 'text-gray-400' : 
                        user.rank === 3 ? 'text-amber-600' : 'text-gray-500'
                      }`}>
                        #{user.rank}
                      </span>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={isDarkMode ? 'bg-purple-600/30' : 'bg-purple-100'}>
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {user.name} {user.isYou && <span className="text-purple-400 text-sm">(You)</span>}
                        </p>
                      </div>
                      {/* Rank Change Indicator */}
                      {user.change !== 0 && (
                        <div className={`flex items-center gap-0.5 text-xs ${
                          user.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {user.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(user.change)}
                        </div>
                      )}
                      <span className={`font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {user.xp.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Challenge Button */}
                <Button
                  variant="outline"
                  className={`w-full mt-4 ${isDarkMode ? 'border-purple-500/30 text-purple-300 hover:bg-purple-600/20' : ''}`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Challenge a Friend
                </Button>
              </CardContent>
            </Card>

            {/* Social Lounge */}
            <SocialLounge isDarkMode={isDarkMode} />

            {/* Weekly Goal */}
            <WeeklyGoalWidget studentLevel="academy" isDarkMode={isDarkMode} />

            {/* AI Lesson Agent */}
            <AILessonAgent
              studentLevel="academy"
              studentInterests={['gaming', 'social media', 'music']}
              cefrLevel="A2"
            />

            {onLevelUp && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={onLevelUp}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Graduate to The Hub!
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
