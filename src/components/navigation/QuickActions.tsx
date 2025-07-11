import React from 'react';
import { Plus, Calendar, MessageSquare, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  variant?: 'default' | 'outline' | 'secondary';
}

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getQuickActions = (): QuickAction[] => {
    if (!user) return [];

    const baseActions: QuickAction[] = [
      {
        icon: Settings,
        label: 'Settings',
        action: () => navigate('/student'), // Navigate to dashboard for now
        variant: 'outline'
      }
    ];

    switch (user.role) {
      case 'student':
        return [
          {
            icon: Plus,
            label: 'Book Lesson',
            action: () => navigate('/student/book-lesson'),
            variant: 'default'
          },
          {
            icon: Calendar,
            label: 'My Schedule',
            action: () => navigate('/student/schedule'),
            variant: 'outline'
          },
          {
            icon: BookOpen,
            label: 'Speaking Practice',
            action: () => navigate('/student/speaking-practice'),
            variant: 'outline'
          },
          ...baseActions
        ];

      case 'teacher':
        return [
          {
            icon: Calendar,
            label: 'My Schedule',
            action: () => navigate('/teacher/lesson-scheduler'),
            variant: 'default'
          },
          {
            icon: MessageSquare,
            label: 'Messages',
            action: () => navigate('/teacher'), // Navigate to dashboard for now
            variant: 'outline'
          },
          {
            icon: BookOpen,
            label: 'Materials',
            action: () => navigate('/teacher/materials'),
            variant: 'outline'
          },
          ...baseActions
        ];

      case 'admin':
        return [
          {
            icon: Plus,
            label: 'Add User',
            action: () => navigate('/admin'), // Navigate to dashboard for now
            variant: 'default'
          },
          {
            icon: Calendar,
            label: 'All Schedules',
            action: () => navigate('/admin'), // Navigate to dashboard for now
            variant: 'outline'
          },
          ...baseActions
        ];

      default:
        return baseActions;
    }
  };

  const actions = getQuickActions();

  if (actions.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.action}
              className="flex items-center gap-2"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};