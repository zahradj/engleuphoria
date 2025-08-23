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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {studentName}!
            </h1>
            <p className="text-muted-foreground mb-4">
              You're doing great! Keep up your {streakDays}-day learning streak.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Level {currentLevel}</p>
                  <p className="text-xs text-muted-foreground">{progressPercentage}% Complete</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{totalPoints} XP</p>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
              </div>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Continue Learning
            <Play className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Level {currentLevel} Progress</span>
                <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {learningModules.map((module, index) => (
                <div key={index} className="p-4 bg-surface-2 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-foreground text-sm">{module.title}</h4>
                    {module.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    {module.status === 'locked' && (
                      <div className="w-4 h-4 bg-muted rounded-full"></div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Progress value={module.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{module.lessons} lessons</span>
                      <span className="text-muted-foreground">{module.progress}%</span>
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
        <Card className="lg:col-span-5 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((class_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{class_.title}</h4>
                    <p className="text-sm text-muted-foreground">with {class_.teacher}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {class_.time}
                      </span>
                      <span>{class_.duration}</span>
                      <Badge variant="outline" className="text-xs">
                        {class_.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Join
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="lg:col-span-3 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.map((assignment, index) => (
              <div key={index} className="p-3 bg-surface-2 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground text-sm leading-tight">
                    {assignment.title}
                  </h4>
                  {assignment.status === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline" className="text-xs">
                    {assignment.subject}
                  </Badge>
                  <span className={`text-xs ${
                    assignment.status === 'completed' ? 'text-success' : 'text-muted-foreground'
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