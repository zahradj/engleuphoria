import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Eye } from 'lucide-react';
import { interactiveLessonProgressService } from '@/services/interactiveLessonProgressService';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  student: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  lesson: {
    id: string;
    title: string;
    cefr_level: string;
  };
  lesson_status: string;
  completion_percentage: number;
  updated_at: string;
}

interface RecentActivityCardProps {
  teacherId: string;
  onViewDetails?: (studentId: string) => void;
}

export function RecentActivityCard({ teacherId, onViewDetails }: RecentActivityCardProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActivity = async () => {
    setLoading(true);
    const data = await interactiveLessonProgressService.getRecentStudentActivity(teacherId, 5);
    setActivities(data);
    setLoading(false);
  };

  useEffect(() => {
    loadActivity();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadActivity, 30000);
    return () => clearInterval(interval);
  }, [teacherId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">In Progress</Badge>;
      case 'redo_required':
        return <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20">Redo Required</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Student Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Student Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent activity to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Student Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={`${activity.student.id}-${activity.lesson.id}-${index}`}
              className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.student.avatar_url} />
                <AvatarFallback>
                  {activity.student.full_name
                    ?.split(' ')
                    .map(n => n[0])
                    .join('') || '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{activity.student.full_name}</p>
                    <p className="text-sm text-muted-foreground">{activity.lesson.title}</p>
                  </div>
                  {getStatusBadge(activity.lesson_status)}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {activity.lesson.cefr_level}
                    </Badge>
                    <span>•</span>
                    <span>{Math.round(activity.completion_percentage)}% complete</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(activity.updated_at), { addSuffix: true })}</span>
                  </div>
                  
                  {onViewDetails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(activity.student.id)}
                      className="h-8 px-2"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
