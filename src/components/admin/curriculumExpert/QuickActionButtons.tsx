import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Mic, FileText, BookOpen, Gamepad2, Calendar, Clock, MessageSquare, BookMarked, GraduationCap, Users, Target } from 'lucide-react';
import { useCurriculumExpert } from '@/hooks/useCurriculumExpert';
import { AgeGroup, QuickActionButton, ECAMode } from '@/types/curriculumExpert';

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
  const [quickActions, setQuickActions] = useState<QuickActionButton[]>([]);
  const { getQuickActions } = useCurriculumExpert();

  useEffect(() => {
    const loadActions = async () => {
      const actions = await getQuickActions(ageGroup);
      setQuickActions(actions);
    };
    loadActions();
  }, [ageGroup, getQuickActions]);

  const getIconComponent = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || BookOpen;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Pre-configured prompts for ages {ageGroup}
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
              className="h-auto py-4 px-4 flex flex-col items-start gap-2"
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