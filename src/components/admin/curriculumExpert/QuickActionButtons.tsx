import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Mic, FileText, BookOpen, Gamepad2, Calendar, Clock, MessageSquare, BookMarked, GraduationCap, Users, Target } from 'lucide-react';
import { useECAQuickActions } from '@/hooks/useECAQuickActions';
import { AgeGroup, ECAMode } from '@/types/curriculumExpert';

const ICON_MAP: Record<string, any> = {
  Sparkles, Mic, FileText, BookOpen, Gamepad2, Calendar,
  Clock, MessageSquare, BookMarked, GraduationCap, Users, Target
};

interface Props {
  ageGroup: AgeGroup;
  mode?: ECAMode;
  onActionClick: (prompt: string) => void;
  isGenerating: boolean;
}

export const QuickActionButtons = ({ ageGroup, mode = 'lesson', onActionClick, isGenerating }: Props) => {
  const { quickActions, isLoading, fetchActions } = useECAQuickActions();

  useEffect(() => {
    fetchActions({ ageGroup, mode });
  }, [ageGroup, mode, fetchActions]);

  const getIconComponent = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || BookOpen;
    return <IconComponent className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (quickActions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No quick actions available for {mode} mode and ages {ageGroup}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try a different mode or age group
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quick Actions</CardTitle>
          <Badge variant="secondary" className="capitalize">{mode} mode</Badge>
        </div>
        <CardDescription>
          Pre-configured {mode} prompts for ages {ageGroup}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              onClick={() => onActionClick(action.promptText)}
              disabled={isGenerating}
              className="h-auto py-4 px-4 flex flex-col items-start gap-2 hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2 w-full">
                {getIconComponent(action.icon)}
                <span className="text-sm font-semibold text-left flex-1">
                  {action.buttonLabel}
                </span>
              </div>
              <span className="text-xs text-muted-foreground text-left line-clamp-2">
                {action.promptText.substring(0, 80)}...
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};