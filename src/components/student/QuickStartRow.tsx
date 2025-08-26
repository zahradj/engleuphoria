import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  TestTube, 
  BookOpen, 
  MessageCircle, 
  Play,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface QuickStartRowProps {
  studentName: string;
}

export const QuickStartRow: React.FC<QuickStartRowProps> = ({ studentName }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'join-class',
      title: 'Join Next Class',
      description: 'Start your scheduled lesson',
      icon: Video,
      variant: 'default' as const,
      action: () => {
        const roomId = `class-${Date.now()}`;
        navigate(`/classroom-prejoin?roomId=${roomId}&role=student&name=${encodeURIComponent(studentName)}`);
      },
      badge: { text: 'Live', color: 'bg-red-500' },
      time: '2:30 PM Today'
    },
    {
      id: 'placement-test',
      title: 'Resume Placement Test',
      description: 'Continue your level assessment',
      icon: TestTube,
      variant: 'secondary' as const,
      action: () => navigate('/placement-test-2'),
      badge: { text: '70%', color: 'bg-orange-500' },
      time: '15 min remaining'
    },
    {
      id: 'learning-path',
      title: 'Continue Learning Path',
      description: 'Next: A1 Numbers & Colors',
      icon: BookOpen,
      variant: 'outline' as const,
      action: () => navigate('/curriculum-generation'),
      badge: { text: 'A1', color: 'bg-green-500' },
      time: 'Lesson 2 of 24'
    },
    {
      id: 'speaking-practice',
      title: 'Speak Now',
      description: 'AI conversation practice',
      icon: MessageCircle,
      variant: 'outline' as const,
      action: () => navigate('/student/speaking-practice'),
      badge: { text: 'AI', color: 'bg-purple-500' },
      time: 'Free practice'
    }
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Start
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Ready to learn
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            
            return (
              <Card 
                key={action.id} 
                className="group hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-primary/50"
                onClick={action.action}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header with icon and badge */}
                    <div className="flex items-start justify-between">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      {action.badge && (
                        <Badge className={`text-white text-xs ${action.badge.color}`}>
                          {action.badge.text}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>

                    {/* Time info */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {action.time}
                    </div>

                    {/* Action button */}
                    <Button 
                      size="sm" 
                      variant={action.variant}
                      className="w-full text-xs h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        action.action();
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};