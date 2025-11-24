import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LessonStatusBadge } from '@/components/ui/LessonStatusBadge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ClassroomLessonControls } from './ClassroomLessonControls';
import { Eye, Play, ChevronDown } from 'lucide-react';
import { interactiveLessonProgressService, type LessonWithProgress } from '@/services/interactiveLessonProgressService';

interface StudentLessonHistoryProps {
  studentId: string;
}

export function StudentLessonHistory({ studentId }: StudentLessonHistoryProps) {
  const [lessonsWithProgress, setLessonsWithProgress] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessonHistory();
  }, [studentId]);

  const loadLessonHistory = async () => {
    setLoading(true);
    const data = await interactiveLessonProgressService.getStudentLessonLibrary(studentId);
    setLessonsWithProgress(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Loading lesson history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson History</CardTitle>
        <CardDescription>All assigned lessons and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessonsWithProgress.map(({ lesson, progress, assignment }) => (
            <Collapsible key={lesson.id}>
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <LessonStatusBadge status={progress?.lesson_status || 'not_started'} />
                      <Badge variant="outline">{lesson.cefr_level}</Badge>
                      <Badge variant="outline">{lesson.age_group}</Badge>
                    </div>
                  </div>
                  <ProgressRing percentage={progress?.completion_percentage || 0} size={60} />
                </div>

                {progress && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="ml-2 font-medium">
                        {progress.completed_slides}/{progress.total_slides} slides
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">XP Earned:</span>
                      <span className="ml-2 font-medium text-primary">{progress.xp_earned} XP</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Started:</span>
                      <span className="ml-2 font-medium">
                        {new Date(progress.started_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Activity:</span>
                      <span className="ml-2 font-medium">
                        {new Date(progress.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(`/interactive-lesson/${lesson.id}?mode=preview`, '_blank')
                    }
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/interactive-lesson/${lesson.id}?mode=classroom&studentId=${studentId}`)
                    }
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Open for Student
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Advanced Controls
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-4">
                  <div className="border-t pt-4">
                    <ClassroomLessonControls
                      lessonId={lesson.id}
                      studentId={studentId}
                      progress={progress}
                      onProgressUpdate={loadLessonHistory}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
