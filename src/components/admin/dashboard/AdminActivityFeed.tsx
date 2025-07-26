import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  User,
  GraduationCap,
  BookOpen,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'user' | 'teacher' | 'lesson' | 'system' | 'security' | 'content';
  action: string;
  details: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  user?: string;
}

interface AdminActivityFeedProps {
  activities?: ActivityItem[];
  loading?: boolean;
}

export const AdminActivityFeed = ({ activities, loading }: AdminActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return User;
      case 'teacher':
        return GraduationCap;
      case 'lesson':
        return BookOpen;
      case 'security':
        return Shield;
      case 'system':
        return Settings;
      default:
        return Activity;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'error':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-600';
      case 'teacher':
        return 'bg-green-100 text-green-600';
      case 'lesson':
        return 'bg-purple-100 text-purple-600';
      case 'security':
        return 'bg-red-100 text-red-600';
      case 'system':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Sample data if no activities provided
  const sampleActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'user',
      action: 'New user registration',
      details: 'Sarah Johnson created a new account',
      timestamp: '2 minutes ago',
      status: 'success',
      user: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'teacher',
      action: 'Teacher application',
      details: 'Michael Chen submitted teacher application',
      timestamp: '15 minutes ago',
      status: 'info',
      user: 'Michael Chen'
    },
    {
      id: '3',
      type: 'lesson',
      action: 'Lesson completed',
      details: 'Advanced Grammar lesson completed by 15 students',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'security',
      action: 'Security alert',
      details: 'Multiple failed login attempts detected',
      timestamp: '2 hours ago',
      status: 'warning'
    },
    {
      id: '5',
      type: 'system',
      action: 'System maintenance',
      details: 'Database optimization completed successfully',
      timestamp: '3 hours ago',
      status: 'success'
    },
    {
      id: '6',
      type: 'content',
      action: 'Content moderation',
      details: 'Flagged content reviewed and approved',
      timestamp: '4 hours ago',
      status: 'info'
    }
  ];

  const displayActivities = activities || sampleActivities;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          Recent Activity
        </CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.slice(0, 6).map((activity) => {
            const ActivityIcon = getActivityIcon(activity.type);
            const StatusIcon = getStatusIcon(activity.status);
            
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(activity.type)}`}>
                  <ActivityIcon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {activity.action}
                    </p>
                    <StatusIcon className={`w-4 h-4 flex-shrink-0 ${activity.status === 'success' ? 'text-green-500' : activity.status === 'warning' ? 'text-yellow-500' : activity.status === 'error' ? 'text-red-500' : 'text-blue-500'}`} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(activity.status)}`}
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button variant="outline" className="w-full" size="sm">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};