import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SlideRenderer } from '@/components/slides/SlideRenderer';
import { IntroSlide } from './slides/IntroSlide';
import { LessonProgressBar } from './LessonProgressBar';
import { LessonNavigator } from './LessonNavigator';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { useToast } from '@/hooks/use-toast';
import { mapLessonScreens } from '@/utils/lessonScreenMapper';
import { motion } from 'framer-motion';

interface InteractiveLessonPlayerProps {
  lessonId: string;
  studentId?: string;
  mode?: 'preview' | 'classroom' | 'student';
  onExit?: () => void;
}

export function InteractiveLessonPlayer({ 
  lessonId, 
  studentId,
  mode = 'preview',
  onExit 
}: InteractiveLessonPlayerProps) {
  const [lesson, setLesson] = useState<any>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [progressInitialized, setProgressInitialized] = useState(false);
  const { toast} = useToast();

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('interactive_lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Lesson not found",
          description: "The lesson you're looking for doesn't exist.",
          variant: "destructive"
        });
        return;
      }

      setLesson(data);
      const mappedSlides = mapLessonScreens(data.screens_data || []);
      setSlides(mappedSlides);
      
      // Load progress if studentId is provided and mode is not preview
      if (studentId && mode !== 'preview' && !progressInitialized) {
        const { interactiveLessonProgressService } = await import('@/services/interactiveLessonProgressService');
        let progress = await interactiveLessonProgressService.getStudentLessonProgress(studentId, lessonId);
        
        if (!progress) {
          // Initialize progress if it doesn't exist
          progress = await interactiveLessonProgressService.initializeLessonProgress(
            studentId,
            lessonId,
            mappedSlides.length
          );
        }

        if (progress && progress.current_slide_index > 0) {
          setCurrentSlide(progress.current_slide_index);
          setXpEarned(progress.xp_earned);
          setStarsEarned(progress.stars_earned);
          setShowIntro(false); // Skip intro if continuing
        }
        
        setProgressInitialized(true);
      }
      
      // Check if lesson has custom intro screen (only if not continuing)
      if (currentSlide === 0) {
        if (data.intro_screen_data?.url) {
          setShowIntro(true);
        } else if (data.intro_screen_data?.source === 'default') {
          setShowIntro(true);
        } else {
          setShowIntro(false);
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast({
        title: "Error loading lesson",
        description: "Failed to load the lesson. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (showIntro) {
      setShowIntro(false);
      return;
    }
    
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      // Award XP for completing a slide
      const xpPerSlide = Math.floor((lesson?.total_xp || 100) / slides.length);
      setXpEarned(prev => prev + xpPerSlide);

      // Save progress if studentId is provided
      if (studentId && mode !== 'preview') {
        const { interactiveLessonProgressService } = await import('@/services/interactiveLessonProgressService');
        await interactiveLessonProgressService.updateSlideProgress(
          studentId,
          lessonId,
          nextSlide,
          xpPerSlide,
          0
        );
      }
    } else {
      // Reached the end - complete the lesson
      await handleLessonComplete();
    }
  };

  const handleLessonComplete = async () => {
    if (studentId && mode !== 'preview') {
      const { interactiveLessonProgressService } = await import('@/services/interactiveLessonProgressService');
      const status = await interactiveLessonProgressService.completeLessonSession(
        studentId,
        lessonId,
        {
          totalSlides: slides.length,
          completedSlides: currentSlide + 1,
          xpEarned,
          starsEarned
        }
      );

      // Check if next lesson was unlocked
      const nextLessonId = await interactiveLessonProgressService.unlockNextLesson(studentId, lessonId);
      
      if (nextLessonId && status === 'completed') {
        toast({
          title: "🎉 Great Job!",
          description: "You've completed this lesson! Next lesson is now unlocked.",
        });
      } else if (status === 'redo_required') {
        toast({
          title: "Keep Practicing!",
          description: "Complete at least 50% of the lesson to unlock the next one.",
          variant: "destructive"
        });
      }
    }
    
    if (onExit) onExit();
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      window.history.back();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10">
        <LoadingSpinner size="lg" message="Loading lesson..." />
      </div>
    );
  }

  if (!lesson || slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">No lesson content available</h2>
          <p className="text-muted-foreground">This lesson doesn't have any screens yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <LessonProgressBar
          currentSlide={currentSlide + 1}
          totalSlides={slides.length}
          xpEarned={xpEarned}
          starsEarned={starsEarned}
        />
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-24 px-4">
        {showIntro ? (
          <IntroSlide
            title={lesson.title}
            topic={lesson.topic || lesson.title}
            ageGroup={lesson.age_group}
            backgroundUrl={lesson.intro_screen_data?.url}
            onStart={() => setShowIntro(false)}
          />
        ) : (
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SlideRenderer
              slide={slides[currentSlide]}
              slideNumber={currentSlide + 1}
              onNext={handleNext}
            />
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t">
        <LessonNavigator
          currentSlide={currentSlide + 1}
          totalSlides={slides.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onExit={handleExit}
          canGoPrevious={currentSlide > 0}
          canGoNext={currentSlide < slides.length - 1}
        />
      </div>
    </div>
  );
}
