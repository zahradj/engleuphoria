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
  mode?: 'preview' | 'classroom' | 'student';
  onExit?: () => void;
}

export function InteractiveLessonPlayer({ 
  lessonId, 
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
  const { toast } = useToast();

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
      
      // Check if lesson has custom intro screen
      if (data.intro_screen_data?.url) {
        setShowIntro(true);
      } else if (data.intro_screen_data?.source === 'default') {
        setShowIntro(true);
      } else {
        setShowIntro(false);
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

  const handleNext = () => {
    if (showIntro) {
      setShowIntro(false);
      return;
    }
    
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      // Award XP for completing a slide
      const xpPerSlide = Math.floor((lesson?.total_xp || 100) / slides.length);
      setXpEarned(prev => prev + xpPerSlide);
    }
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
