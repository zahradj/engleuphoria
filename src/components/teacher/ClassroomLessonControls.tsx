import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { LessonStatusBadge } from '@/components/ui/LessonStatusBadge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Play, RotateCcw, CheckCircle, RefreshCw, Settings } from 'lucide-react';
import { interactiveLessonProgressService, type LessonProgress } from '@/services/interactiveLessonProgressService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ClassroomLessonControlsProps {
  lessonId: string;
  studentId: string;
  progress: LessonProgress | null;
  onProgressUpdate: () => void;
}

export function ClassroomLessonControls({
  lessonId,
  studentId,
  progress,
  onProgressUpdate,
}: ClassroomLessonControlsProps) {
  const [overrideSlide, setOverrideSlide] = useState(progress?.current_slide_index || 0);
  const [overridePercentage, setOverridePercentage] = useState(progress?.completion_percentage || 0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = () => {
    navigate(`/interactive-lesson/${lessonId}?mode=classroom&studentId=${studentId}`);
  };

  const handleRestart = async () => {
    await interactiveLessonProgressService.resetLessonProgress(studentId, lessonId);
    toast({ title: 'Lesson reset', description: 'Student can now start from the beginning.' });
    onProgressUpdate();
  };

  const handleMarkCompleted = async () => {
    await interactiveLessonProgressService.markLessonCompleted(studentId, lessonId);
    toast({ title: 'Lesson marked as completed' });
    onProgressUpdate();
  };

  const handleMarkRedo = async () => {
    await interactiveLessonProgressService.markLessonRedo(studentId, lessonId);
    toast({ title: 'Lesson marked for redo' });
    onProgressUpdate();
  };

  const handleOverride = async () => {
    await supabase
      .from('interactive_lesson_progress')
      .update({
        current_slide_index: overrideSlide,
        completion_percentage: overridePercentage,
      })
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId);

    toast({ title: 'Progress overridden successfully' });
    onProgressUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Progress Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Display */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Slides Completed:</span>
            <span className="font-semibold">
              {progress?.completed_slides || 0} / {progress?.total_slides || 0}
            </span>
          </div>
          <Progress value={progress?.completion_percentage || 0} />
          <LessonStatusBadge status={progress?.lesson_status || 'not_started'} />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleContinue} disabled={!progress || progress.current_slide_index === 0}>
            <Play className="h-4 w-4 mr-2" />
            Continue from Slide {progress?.current_slide_index || 1}
          </Button>

          <Button variant="outline" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart Lesson
          </Button>

          <Button variant="default" onClick={handleMarkCompleted}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark Completed
          </Button>

          <Button variant="destructive" onClick={handleMarkRedo}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Mark as Redo
          </Button>
        </div>

        {/* Progress Override */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Controls
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            <div>
              <Label>Override Slide Number:</Label>
              <Input
                type="number"
                min={0}
                max={progress?.total_slides || 20}
                value={overrideSlide}
                onChange={(e) => setOverrideSlide(parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Override Completion %:</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={overridePercentage}
                onChange={(e) => setOverridePercentage(parseInt(e.target.value))}
              />
            </div>
            <Button onClick={handleOverride} className="w-full">
              Apply Override
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
