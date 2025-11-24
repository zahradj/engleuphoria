import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LessonStatusBadge, RedoBadge, NewLessonBadge } from '@/components/ui/LessonStatusBadge';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { Play, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { interactiveLessonProgressService, type LessonWithProgress } from '@/services/interactiveLessonProgressService';

interface StudentLessonsLibraryProps {
  studentId: string;
}

export function StudentLessonsLibrary({ studentId }: StudentLessonsLibraryProps) {
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLessons();
  }, [studentId]);

  const loadLessons = async () => {
    setLoading(true);
    const data = await interactiveLessonProgressService.getStudentLessonLibrary(studentId);
    setLessons(data);
    setLoading(false);
  };

  const handleLessonClick = (lessonWithProgress: LessonWithProgress) => {
    const { lesson, progress, assignment } = lessonWithProgress;
    
    // Check if lesson is locked
    if (assignment && !assignment.is_unlocked) {
      return; // Don't allow navigation to locked lessons
    }

    // Navigate to lesson player with studentId
    navigate(`/interactive-lesson/${lesson.id}?mode=student&studentId=${studentId}`);
  };

  const getButtonText = (lessonWithProgress: LessonWithProgress) => {
    const { progress, assignment } = lessonWithProgress;
    
    if (assignment && !assignment.is_unlocked) return 'Locked';
    if (!progress || progress.lesson_status === 'not_started') return 'Start Lesson';
    if (progress.lesson_status === 'in_progress') return 'Continue Lesson';
    if (progress.lesson_status === 'redo_required') return 'Redo Lesson';
    if (progress.lesson_status === 'completed') return 'Review Lesson';
    return 'Start Lesson';
  };

  const isNewLesson = (lessonWithProgress: LessonWithProgress, index: number) => {
    if (index === 0) return false;
    const prevLesson = lessons[index - 1];
    return prevLesson?.progress?.lesson_status === 'completed' && 
           lessonWithProgress.progress?.lesson_status === 'not_started';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" message="Loading your lessons..." />
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No lessons assigned yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Check back soon for new lessons!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">My Lessons</h2>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lessonWithProgress, index) => {
          const { lesson, progress, assignment } = lessonWithProgress;
          const isLocked = assignment && !assignment.is_unlocked;
          const completionPercentage = progress?.completion_percentage || 0;
          const status = progress?.lesson_status || 'not_started';
          const showRedoBadge = status === 'redo_required';
          const showNewBadge = isNewLesson(lessonWithProgress, index);

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => !isLocked && handleLessonClick(lessonWithProgress)}
              >
                {showRedoBadge && <RedoBadge />}
                {showNewBadge && <NewLessonBadge />}
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{lesson.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {lesson.topic}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {lesson.cefr_level}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {lesson.age_group}
                        </span>
                      </div>
                    </div>
                    
                    <ProgressRing 
                      percentage={completionPercentage} 
                      size={80}
                      strokeWidth={6}
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <LessonStatusBadge status={isLocked ? 'locked' : status} />
                  
                  {progress && (
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Slides completed:</span>
                        <span className="font-medium">
                          {progress.completed_slides}/{progress.total_slides}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>XP earned:</span>
                        <span className="font-medium text-primary">
                          {progress.xp_earned} XP
                        </span>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full"
                    variant={isLocked ? 'outline' : 'default'}
                    disabled={isLocked}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLocked) handleLessonClick(lessonWithProgress);
                    }}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {getButtonText(lessonWithProgress)}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
