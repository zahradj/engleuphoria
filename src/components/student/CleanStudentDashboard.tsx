import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  BookOpen,
  Calendar,
  Award,
  Clock,
  Users,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface CleanStudentDashboardProps {
  studentName: string;
  studentProfile?: any;
}

export const CleanStudentDashboard = ({ studentName, studentProfile }: CleanStudentDashboardProps) => {
  const currentLevel = studentProfile?.current_level || 'A1';
  const progressPercentage = studentProfile?.progress_percentage || 45;
  const streakDays = studentProfile?.streak_days || 7;
  const totalPoints = studentProfile?.points || 1250;

  const upcomingClasses = [
    {
      title: 'English Conversation',
      teacher: 'Ms. Johnson',
      time: '2:00 PM',
      duration: '30 min',
      type: 'Live Class'
    },
    {
      title: 'Grammar Practice',
      teacher: 'Mr. Smith',
      time: '4:30 PM',
      duration: '45 min',
      type: 'Workshop'
    }
  ];

  const assignments = [
    {
      title: 'Writing Assignment: My Daily Routine',
      subject: 'Writing',
      dueDate: 'Tomorrow',
      status: 'pending'
    },
    {
      title: 'Vocabulary Quiz: Food & Drinks',
      subject: 'Vocabulary',
      dueDate: 'Friday',
      status: 'pending'
    },
    {
      title: 'Pronunciation Practice',
      subject: 'Speaking',
      dueDate: 'Completed',
      status: 'completed'
    }
  ];

  const learningModules = [
    {
      title: 'Basic Greetings',
      progress: 100,
      lessons: '8/8',
      status: 'completed'
    },
    {
      title: 'Daily Activities',
      progress: 75,
      lessons: '6/8',
      status: 'in-progress'
    },
    {
      title: 'Food & Dining',
      progress: 25,
      lessons: '2/8',
      status: 'in-progress'
    },
    {
      title: 'Travel & Transportation',
      progress: 0,
      lessons: '0/8',
      status: 'locked'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-3xl p-6 md:p-8 border-4 border-white/30 shadow-2xl shadow-purple-500/50">
        <div className="absolute inset-0 bg-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute top-4 right-4 text-6xl opacity-20">🎉</div>
        <div className="absolute bottom-4 left-4 text-5xl opacity-20">⭐</div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
              Welcome back, {studentName}! 🎊
            </h1>
            <p className="text-white/95 text-base mb-6 font-semibold drop-shadow">
              You're amazing! Keep up your <span className="text-yellow-300 font-extrabold text-xl">{streakDays}-day</span> learning streak 🔥
            </p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 border-2 border-purple-300 shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-purple-700">Level {currentLevel}</p>
                  <p className="text-xs text-purple-600 font-semibold">{progressPercentage}% Complete</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 border-2 border-orange-300 shadow-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-orange-700">{totalPoints} XP</p>
                  <p className="text-xs text-orange-600 font-semibold">Total Points</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-white text-purple-600 hover:bg-purple-50 shadow-2xl shadow-white/50 hover:shadow-white/70 transition-all duration-200 font-extrabold px-8 py-7 rounded-2xl text-lg border-4 border-purple-200">
            Continue Learning
            <Play className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </div>


      {/* Progress Overview */}
      <Card className="border-3 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-200/50">
        <CardHeader className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-t-xl -m-6 mb-4 p-6">
          <CardTitle className="text-xl font-extrabold text-white flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-yellow-300 animate-bounce" />
            Your Learning Progress 🚀
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-white/80 rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-purple-700">Level {currentLevel} Progress</span>
                <span className="text-lg font-black text-pink-600">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-4 bg-purple-100 rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {learningModules.map((module, index) => (
                <div key={index} className={`p-5 rounded-2xl shadow-lg border-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  module.status === 'completed' 
                    ? 'bg-gradient-to-br from-green-400 to-teal-400 border-green-300' 
                    : module.status === 'in-progress'
                    ? 'bg-gradient-to-br from-yellow-300 to-orange-300 border-yellow-400'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <h4 className={`font-black text-sm ${
                      module.status === 'completed' ? 'text-green-900' : 
                      module.status === 'in-progress' ? 'text-orange-900' : 'text-gray-600'
                    }`}>{module.title}</h4>
                    {module.status === 'completed' && (
                      <CheckCircle className="h-6 w-6 text-green-700 animate-pulse" />
                    )}
                    {module.status === 'locked' && (
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                        🔒
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Progress value={module.progress} className="h-3 bg-white/50 rounded-full" />
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={module.status === 'completed' ? 'text-green-900' : module.status === 'in-progress' ? 'text-orange-900' : 'text-gray-600'}>
                        {module.lessons} lessons
                      </span>
                      <span className={`text-sm ${module.status === 'completed' ? 'text-green-900' : module.status === 'in-progress' ? 'text-orange-900' : 'text-gray-600'}`}>
                        {module.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Upcoming Classes */}
        <Card className="lg:col-span-5 border-3 border-pink-200 bg-gradient-to-br from-pink-50 to-orange-50 shadow-xl shadow-pink-200/50">
          <CardHeader className="bg-gradient-to-r from-pink-400 to-orange-400 rounded-t-xl -m-6 mb-4 p-6">
            <CardTitle className="text-xl font-extrabold text-white flex items-center gap-3">
              <Calendar className="h-6 w-6 text-yellow-300 animate-pulse" />
              Today's Classes 📚
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((class_, index) => (
              <div key={index} className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-lg border-2 border-pink-200 hover:shadow-2xl hover:scale-105 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-purple-700 text-lg">{class_.title}</h4>
                    <p className="text-base text-pink-600 font-semibold">with {class_.teacher}</p>
                    <div className="flex items-center gap-3 text-sm text-purple-600 font-medium mt-2">
                      <span className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4" />
                        {class_.time}
                      </span>
                      <span className="bg-pink-100 px-3 py-1 rounded-full">{class_.duration}</span>
                      <Badge variant="outline" className="text-sm bg-orange-100 text-orange-700 border-2 border-orange-300 font-bold">
                        {class_.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white shadow-xl font-extrabold px-6 py-6 rounded-2xl text-base border-2 border-green-300">
                  Join 🎉
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="lg:col-span-3 border-3 border-green-200 bg-gradient-to-br from-green-50 to-teal-50 shadow-xl shadow-green-200/50">
          <CardHeader className="bg-gradient-to-r from-green-400 to-teal-400 rounded-t-xl -m-6 mb-4 p-6">
            <CardTitle className="text-xl font-extrabold text-white flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-yellow-300 animate-bounce" />
              Assignments ✏️
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.map((assignment, index) => (
              <div key={index} className={`p-4 rounded-2xl shadow-lg border-2 hover:shadow-2xl hover:scale-105 transition-all duration-200 ${
                assignment.status === 'completed' 
                  ? 'bg-gradient-to-r from-green-100 to-teal-100 border-green-300' 
                  : 'bg-white border-orange-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className={`font-black text-sm leading-tight ${
                    assignment.status === 'completed' ? 'text-green-700' : 'text-purple-700'
                  }`}>
                    {assignment.title}
                  </h4>
                  {assignment.status === 'completed' && (
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 animate-pulse" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline" className={`text-sm font-bold border-2 ${
                    assignment.status === 'completed'
                      ? 'bg-green-200 text-green-800 border-green-400'
                      : 'bg-purple-100 text-purple-700 border-purple-300'
                  }`}>
                    {assignment.subject}
                  </Badge>
                  <span className={`text-sm font-bold ${
                    assignment.status === 'completed' ? 'text-green-700' : 'text-orange-600'
                  }`}>
                    {assignment.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};