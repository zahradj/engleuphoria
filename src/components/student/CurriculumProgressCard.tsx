import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trophy, Target } from 'lucide-react';
import { curriculumAssignmentService } from '@/services/curriculumAssignmentService';
import { useAuth } from '@/contexts/AuthContext';

export function CurriculumProgressCard() {
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignment = async () => {
      if (!user?.id) return;

      try {
        const data = await curriculumAssignmentService.getCurrentAssignment(user.id);
        if (data) {
          setAssignment(data);
          const progressPercent = curriculumAssignmentService.calculateUnitProgress(data);
          setProgress(progressPercent);
        }
      } catch (error) {
        console.error('Error loading curriculum assignment:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!assignment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Your Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Complete your placement test to get started with your personalized curriculum!
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedLessons = assignment.lessons_completed?.length || 0;
  const totalLessons = assignment.total_lessons_in_unit;
  const currentLesson = assignment.current_lesson_number;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Your Learning Path
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {assignment.stage_name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{assignment.unit_name}</h3>
            <Badge variant="outline" className="text-xs">
              Lesson {currentLesson}/{totalLessons}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        {progress === 100 && (
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-3 rounded-md">
            <Trophy className="h-4 w-4" />
            <span className="font-medium">Unit complete! Great job! 🎉</span>
          </div>
        )}

        {progress < 100 && (
          <div className="text-sm text-muted-foreground">
            <p>Keep going! Complete your current lesson to unlock the next one.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
