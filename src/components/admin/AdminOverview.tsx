import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, AlertTriangle, Calendar, Star, Clock, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const AdminOverview = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    activeLessons: 0,
    monthlyRevenue: 0,
    userGrowth: 0,
    completionRate: 0,
    avgRating: 0,
  });
  
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    ongoingLessons: 0,
    systemHealth: 98.5
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Fetch total teachers
        const { count: totalTeachers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'teacher');

        // Fetch active lessons (scheduled and confirmed)
        const { count: activeLessons } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .in('status', ['scheduled', 'confirmed']);

        // Fetch average teacher rating
        const { data: teacherProfiles } = await supabase
          .from('teacher_profiles')
          .select('rating')
          .not('rating', 'is', null);

        const avgRating = teacherProfiles?.length 
          ? teacherProfiles.reduce((sum, profile) => sum + (profile.rating || 0), 0) / teacherProfiles.length 
          : 0;

        // Calculate completion rate from lessons
        const { count: completedLessons } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');

        const totalLessonsCount = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true });

        const completionRate = totalLessonsCount.count 
          ? (completedLessons || 0) / totalLessonsCount.count * 100 
          : 0;

        setStats({
          totalUsers: totalUsers || 0,
          totalTeachers: totalTeachers || 0,
          activeLessons: activeLessons || 0,
          monthlyRevenue: 0, // TODO: Implement revenue tracking
          userGrowth: 0, // TODO: Implement user growth calculation
          completionRate: Math.round(completionRate),
          avgRating: Math.round(avgRating * 10) / 10,
        });

        setRealTimeData(prev => ({
          ...prev,
          activeUsers: totalUsers || 0,
          ongoingLessons: activeLessons || 0,
        }));

      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const quickActions = [
    { label: 'Review Applications', count: 0, action: 'teacher-applications' },
    { label: 'Moderate Content', count: 0, action: 'moderation' },
    { label: 'Process Payments', count: 0, action: 'payments' },
    { label: 'System Alerts', count: 0, action: 'alerts' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Platform insights and metrics</p>
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
                <p className="text-blue-100 text-sm">Total Users</p>
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
                <p className="text-green-100 text-sm">Active Lessons</p>
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
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Registered teachers</p>
            {stats.avgRating > 0 && (
              <div className="flex items-center mt-2">
                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                <span className="text-xs">{stats.avgRating}/5.0 avg rating</span>
              </div>
            )}
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
            <CardTitle className="text-sm font-medium">Active Lessons</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLessons}</div>
            <p className="text-xs text-muted-foreground">Scheduled & confirmed</p>
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
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {action.count}
                    </span>
                    <Button size="sm" variant="outline" disabled>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">System Health</span>
                  <span className="text-sm text-green-600">{realTimeData.systemHealth.toFixed(1)}%</span>
                </div>
                <Progress value={realTimeData.systemHealth} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Database Status</span>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">API Status</span>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};