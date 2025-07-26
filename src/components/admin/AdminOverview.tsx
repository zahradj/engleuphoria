import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, AlertTriangle, Calendar, Star, Clock, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminWelcomeSection } from './dashboard/AdminWelcomeSection';
import { AdminStatsOverview } from './dashboard/AdminStatsOverview';
import { AdminQuickActions } from './dashboard/AdminQuickActions';
import { AdminSystemHealth } from './dashboard/AdminSystemHealth';
import { AdminActivityFeed } from './dashboard/AdminActivityFeed';

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

  const handleQuickActions = {
    onManageUsers: () => console.log('Navigate to user management'),
    onManageTeachers: () => console.log('Navigate to teacher management'),
    onViewReports: () => console.log('Navigate to reports'),
    onViewAnalytics: () => console.log('Navigate to analytics'),
    onModerateContent: () => console.log('Navigate to content moderation'),
    onSystemSettings: () => console.log('Navigate to system settings'),
  };

  const mockCounts = {
    pendingUsers: 3,
    pendingTeachers: 2,
    pendingReports: 1,
    systemAlerts: 0,
  };

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

      {/* Enhanced Welcome Section */}
      <AdminWelcomeSection
        adminName="Administrator"
        stats={{
          totalUsers: stats.totalUsers,
          totalTeachers: stats.totalTeachers,
          activeLessons: stats.activeLessons,
          systemHealth: realTimeData.systemHealth,
        }}
      />

      {/* Enhanced Stats Overview */}
      <AdminStatsOverview
        stats={{
          totalUsers: stats.totalUsers,
          totalTeachers: stats.totalTeachers,
          activeLessons: stats.activeLessons,
          averageRating: stats.avgRating,
          userGrowth: 15.2,
          teacherGrowth: 8.7,
          lessonGrowth: 23.1,
          ratingChange: 0.3,
        }}
        loading={loading}
      />

      {/* Layout for Quick Actions, System Health, and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <AdminQuickActions
          actions={handleQuickActions}
          counts={mockCounts}
        />

        {/* System Health */}
        <AdminSystemHealth
          metrics={{
            serverUptime: 99.9,
            databaseHealth: 98.5,
            apiResponseTime: 125,
            activeConnections: realTimeData.activeUsers,
            memoryUsage: 67,
            storageUsage: 43,
          }}
          loading={loading}
        />
      </div>

      {/* Activity Feed */}
      <AdminActivityFeed loading={loading} />
    </div>
  );
};