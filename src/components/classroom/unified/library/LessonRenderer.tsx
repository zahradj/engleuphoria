import React, { useState, useEffect, useCallback } from 'react';
import { LessonRegistry, LessonComponentProps, LessonCompletionData } from '@/services/lessonRegistry';
import { LessonSlideViewer } from '@/components/classroom/content/LessonSlideViewer';
import { studentProgressService } from '@/services/studentProgressService';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

interface LessonRendererProps {
  moduleNumber: number;
  lessonNumber: number;
  studentId: string;
  onComplete?: (data: LessonCompletionData) => void;
  onProgress?: (progress: number) => void;
  mode?: 'overlay' | 'fullscreen';
}

export function LessonRenderer({
  moduleNumber,
  lessonNumber,
  studentId,
  onComplete,
  onProgress,
  mode = 'overlay'
}: LessonRendererProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonContent, setLessonContent] = useState<any>(null);
  const [startTime] = useState(Date.now());

  // Check for static lesson first
  const staticLesson = LessonRegistry.getLesson(moduleNumber, lessonNumber);

  const handleLessonComplete = useCallback(async (completionData: LessonCompletionData) => {
    const finalData: LessonCompletionData = {
      ...completionData,
      moduleNumber,
      lessonNumber,
      timeSpent: Math.floor((Date.now() - startTime) / 1000)
    };

    try {
      // Update progress in database
      await studentProgressService.updateStudentProgress(studentId, moduleNumber, lessonNumber);
      
      // Record completion
      await studentProgressService.recordLessonCompletion(
        studentId,
        `${moduleNumber}-${lessonNumber}`,
        {
          timeSpent: finalData.timeSpent,
          completionRate: finalData.completionRate,
          score: finalData.score || 0,
          slidesCompleted: finalData.slidesCompleted
        }
      );

      onComplete?.(finalData);
    } catch (err) {
      console.error('Failed to record lesson completion:', err);
    }
  }, [moduleNumber, lessonNumber, studentId, startTime, onComplete]);

  const handleProgress = useCallback((progress: number) => {
    onProgress?.(progress);
  }, [onProgress]);

  // Load database lesson if no static lesson exists
  useEffect(() => {
    if (!staticLesson) {
      const loadDatabaseLesson = async () => {
        try {
          setLoading(true);
          const content = await studentProgressService.getLessonContent(moduleNumber, lessonNumber);
          setLessonContent(content);
        } catch (err) {
          setError('Failed to load lesson content');
          console.error('Lesson loading error:', err);
        } finally {
          setLoading(false);
        }
      };

      loadDatabaseLesson();
    } else {
      setLoading(false);
    }
  }, [moduleNumber, lessonNumber, staticLesson]);

  // Enhanced lesson component props for static lessons
  const lessonProps: LessonComponentProps = {
    onComplete: (data) => handleLessonComplete({
      moduleNumber,
      lessonNumber,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      completionRate: 1.0,
      slidesCompleted: staticLesson?.totalSlides || 0,
      ...data
    }),
    onProgress: handleProgress
  };

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading lesson...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="h-6 w-6" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  // Render static lesson component
  if (staticLesson?.component) {
    const StaticLessonComponent = staticLesson.component;
    return (
      <div className={mode === 'fullscreen' ? 'h-full w-full' : 'min-h-[600px]'}>
        <StaticLessonComponent {...lessonProps} />
      </div>
    );
  }

  // Render database lesson via LessonSlideViewer
  if (lessonContent) {
    return (
      <div className={mode === 'fullscreen' ? 'h-full w-full' : 'min-h-[600px]'}>
        <LessonSlideViewer
          slides={lessonContent.slides_content?.slides || []}
          title={lessonContent.title || `Module ${moduleNumber}, Lesson ${lessonNumber}`}
          lessonId={lessonContent.id}
          studentId={studentId}
        />
      </div>
    );
  }

  // Fallback - no lesson found
  return (
    <Card className="flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Lesson Not Available</h3>
        <p className="text-muted-foreground">
          Module {moduleNumber}, Lesson {lessonNumber} is not yet available.
        </p>
      </div>
    </Card>
  );
}