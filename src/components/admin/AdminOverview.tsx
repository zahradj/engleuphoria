import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, AlertTriangle, Calendar, Star, Clock, Activity } from 'lucide-react';

export const AdminOverview = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 347,
    ongoingLessons: 23,
    systemHealth: 98.7
  });

  // Mock data - in production this would come from APIs
  const stats = {
    totalUsers: 1247,
    totalTeachers: 89,
    activeLessons: 156,
    monthlyRevenue: 45600,
    userGrowth: 12.5,
    pendingModeration: 8,
    completionRate: 87.3,
    avgRating: 4.8,
    responseTime: '2.3s'
  };

  const recentActivities = [
    { 
      type: 'user_registration', 
      message: 'New student registered: Ahmed Ben Ali', 
      time: '2 hours ago', 
      status: 'success',
      icon: Users 
    },
    { 
      type: 'teacher_approval', 
      message: 'Teacher Sarah Johnson approved', 
      time: '4 hours ago', 
      status: 'info',
      icon: GraduationCap 
    },
    { 
      type: 'lesson_completed', 
      message: '15 lessons completed today', 
      time: '6 hours ago', 
      status: 'success',
      icon: BookOpen 
    },
    { 
      type: 'payment_received', 
      message: 'Payment received from Premium subscriber', 
      time: '8 hours ago', 
      status: 'success',
      icon: DollarSign 
    },
    { 
      type: 'alert', 
      message: 'Server response time increased', 
      time: '12 hours ago', 
      status: 'warning',
      icon: AlertTriangle 
    }
  ];

  const quickActions = [
    { label: 'Review Applications', count: 5, action: 'teacher-applications' },
    { label: 'Moderate Content', count: 8, action: 'moderation' },
    { label: 'Process Payments', count: 12, action: 'payments' },
    { label: 'System Alerts', count: 3, action: 'alerts' }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        ongoingLessons: Math.max(0, prev.ongoingLessons + Math.floor(Math.random() * 6 - 3)),
        systemHealth: Math.min(100, Math.max(95, prev.systemHealth + (Math.random() - 0.5) * 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Real-time platform insights and metrics</p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Real-time Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Users</p>
                <p className="text-2xl font-bold">{realTimeData.activeUsers}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Live Lessons</p>
                <p className="text-2xl font-bold">{realTimeData.ongoingLessons}</p>
              </div>
              <Clock className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">System Health</p>
                <p className="text-2xl font-bold">{realTimeData.systemHealth.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{stats.userGrowth}% from last month
            </div>
            <Progress value={stats.userGrowth * 2} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Verified and active</p>
            <div className="flex items-center mt-2">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="text-xs">{stats.avgRating}/5.0 avg rating</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Lesson completion</p>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()} DZD</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +20.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <span className="font-medium">{action.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {action.count}
                    </span>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-3 py-2">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100 text-green-600' :
                      activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      activity.status === 'info' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm text-green-600">{stats.responseTime}</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Server Uptime</span>
                <span className="text-sm text-green-600">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-green-600">0.1%</span>
              </div>
              <Progress value={0.1} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};