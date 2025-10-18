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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section - Clean & Minimal */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-blue via-lavender to-mint-green rounded-2xl p-8 border border-border-light shadow-card">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
              Welcome back, {studentName}!
            </h1>
            <p className="text-text-muted text-base mb-6 font-medium">
              You're on a <span className="text-peach-dark font-semibold">{streakDays}-day</span> learning streak 🔥
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-border shadow-sm">
                <div className="w-10 h-10 bg-sky-blue rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-sky-blue-dark" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Level {currentLevel}</p>
                  <p className="text-xs text-text-muted">{progressPercentage}% Complete</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-border shadow-sm">
                <div className="w-10 h-10 bg-peach rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-peach-dark" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{totalPoints} XP</p>
                  <p className="text-xs text-text-muted">Total Points</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-text text-white hover:bg-text/90 shadow-sm transition-all duration-200 font-semibold px-6 py-6 rounded-xl text-base">
            Continue Learning
            <Play className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>


      {/* Progress Overview */}
      <Card className="border border-border bg-white shadow-card">
        <CardHeader className="bg-sky-blue border-b border-border-light p-6">
          <CardTitle className="text-xl font-semibold text-text flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-sky-blue-dark" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="bg-surface-soft rounded-xl p-5 border border-border-light">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-medium text-text">Level {currentLevel} Progress</span>
                <span className="text-lg font-semibold text-sky-blue-dark">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-border" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {learningModules.map((module, index) => (
                <div key={index} className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  module.status === 'completed' 
                    ? 'bg-success-bg border-success-border' 
                    : module.status === 'in-progress'
                    ? 'bg-warning-bg border-warning-border'
                    : 'bg-surface-soft border-border'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <h4 className={`font-medium text-sm ${
                      module.status === 'completed' ? 'text-success' : 
                      module.status === 'in-progress' ? 'text-warning' : 'text-text-muted'
                    }`}>{module.title}</h4>
                    {module.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    )}
                    {module.status === 'locked' && (
                      <div className="w-5 h-5 bg-border rounded-full flex items-center justify-center text-xs">
                        🔒
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Progress value={module.progress} className="h-2 bg-white" />
                    <div className="flex items-center justify-between text-xs">
                      <span className={module.status === 'completed' ? 'text-success' : module.status === 'in-progress' ? 'text-warning' : 'text-text-muted'}>
                        {module.lessons} lessons
                      </span>
                      <span className={`text-sm font-medium ${module.status === 'completed' ? 'text-success' : module.status === 'in-progress' ? 'text-warning' : 'text-text-muted'}`}>
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
        <Card className="lg:col-span-5 border border-border bg-white shadow-card">
          <CardHeader className="bg-sky-blue border-b border-border-light p-6">
            <CardTitle className="text-xl font-semibold text-text flex items-center gap-3">
              <Calendar className="h-5 w-5 text-sky-blue-dark" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {upcomingClasses.map((class_, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-surface-soft rounded-xl border border-border-light hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4 flex-1 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-lavender rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-lavender-dark" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-base">{class_.title}</h4>
                    <p className="text-sm text-text-muted">with {class_.teacher}</p>
                    <div className="flex items-center gap-2 text-sm text-text-subtle mt-2 flex-wrap">
                      <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-border">
                        <Clock className="h-3 w-3" />
                        {class_.time}
                      </span>
                      <span className="bg-white px-2 py-1 rounded-lg border border-border">{class_.duration}</span>
                      <Badge variant="outline" className="text-xs bg-peach text-peach-dark border-peach-dark">
                        {class_.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-mint-green-dark hover:bg-mint-green-dark/90 text-white shadow-sm font-medium px-4 py-5 rounded-lg text-sm transition-all duration-200">
                  Join
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="lg:col-span-3 border border-border bg-white shadow-card">
          <CardHeader className="bg-lavender border-b border-border-light p-6">
            <CardTitle className="text-xl font-semibold text-text flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-lavender-dark" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {assignments.map((assignment, index) => (
              <div key={index} className={`p-4 rounded-xl border hover:shadow-md transition-all duration-200 ${
                assignment.status === 'completed' 
                  ? 'bg-success-bg border-success-border' 
                  : 'bg-surface-soft border-border-light'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className={`font-medium text-sm leading-tight ${
                    assignment.status === 'completed' ? 'text-success' : 'text-text'
                  }`}>
                    {assignment.title}
                  </h4>
                  {assignment.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline" className={`text-xs ${
                    assignment.status === 'completed'
                      ? 'bg-success text-white border-success'
                      : 'bg-lavender text-lavender-dark border-lavender-dark'
                  }`}>
                    {assignment.subject}
                  </Badge>
                  <span className={`text-sm font-medium ${
                    assignment.status === 'completed' ? 'text-success' : 'text-text-muted'
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