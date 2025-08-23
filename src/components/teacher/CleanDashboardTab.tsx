import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Users,
  Star,
  DollarSign,
  Clock,
  BookOpen,
  MessageSquare,
  Award,
  ArrowRight
} from 'lucide-react';

interface CleanDashboardTabProps {
  teacherName: string;
}

export const CleanDashboardTab = ({ teacherName }: CleanDashboardTabProps) => {
  const kpis = [
    {
      title: 'Classes Today',
      value: '3',
      icon: Calendar,
      color: 'text-primary'
    },
    {
      title: 'Active Students',
      value: '24',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      icon: Star,
      color: 'text-warning'
    },
    {
      title: 'This Month',
      value: '$2,847',
      icon: DollarSign,
      color: 'text-success'
    }
  ];

  const upcomingClasses = [
    {
      title: 'Beginner English A1',
      time: '10:00 AM',
      students: 8,
      duration: '45 min'
    },
    {
      title: 'Conversation Practice',
      time: '2:00 PM',
      students: 12,
      duration: '30 min'
    },
    {
      title: 'Grammar Fundamentals',
      time: '4:30 PM',
      students: 6,
      duration: '60 min'
    }
  ];

  const weeklyProgress = [
    { day: 'Mon', classes: 4, completed: 4 },
    { day: 'Tue', classes: 3, completed: 3 },
    { day: 'Wed', classes: 5, completed: 5 },
    { day: 'Thu', classes: 2, completed: 1 },
    { day: 'Fri', classes: 3, completed: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Good morning, {teacherName}! 
            </h1>
            <p className="text-muted-foreground">
              You have 3 classes scheduled for today. Ready to inspire your students?
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Start Class
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Weekly Schedule */}
        <Card className="lg:col-span-5 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              This Week's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground w-8">{day.day}</span>
                    <div className="flex-1 min-w-32">
                      <Progress 
                        value={(day.completed / day.classes) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {day.completed}/{day.classes} classes
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card className="lg:col-span-3 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingClasses.map((class_, index) => (
              <div key={index} className="p-4 bg-surface-2 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground text-sm">{class_.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {class_.time}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {class_.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {class_.duration}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-5 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Recent Messages & Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Sarah completed Advanced Grammar Module 3',
                'New student enrolled in your Beginner class',
                'Assignment submissions ready for review (5)',
                'Parent feedback received for Emma Watson',
                'System update: New collaboration tools available'
              ].map((message, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-foreground flex-1">{message}</span>
                  <span className="text-xs text-muted-foreground">
                    {index + 1}h ago
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card className="lg:col-span-3 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Classes Taught</span>
              <span className="text-lg font-semibold text-foreground">42</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Student Progress</span>
              <span className="text-lg font-semibold text-success">+18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Satisfaction</span>
              <span className="text-lg font-semibold text-warning">4.8★</span>
            </div>
            <Button variant="outline" className="w-full mt-4 border-border hover:bg-primary/5 hover:border-primary/30">
              <BookOpen className="mr-2 h-4 w-4" />
              View Full Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};