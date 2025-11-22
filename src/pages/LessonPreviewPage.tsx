import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSlideNavigation } from '@/hooks/useSlideNavigation';
import { SlideRenderer } from '@/components/slides/SlideRenderer';
import { PresentationControls } from '@/components/lesson-preview/PresentationControls';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LessonPreviewPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;

      try {
        const { data, error } = await supabase
          .from('systematic_lessons')
          .select('*')
          .eq('id', lessonId)
          .single();

        if (error) throw error;

        setLesson(data);
      } catch (error) {
        console.error('Failed to load lesson:', error);
        toast({
          title: 'Error',
          description: 'Failed to load lesson',
          variant: 'destructive',
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, navigate, toast]);

  const slides = lesson?.slides_content || [];
  const totalSlides = slides.length;

  const {
    currentSlide,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    progress,
  } = useSlideNavigation({
    totalSlides,
    initialSlide: 0,
  });

  // Handle exit (Escape key)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson || totalSlides === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground">No slides available</p>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      {/* Current Slide */}
      <div className="h-full w-full">
        <SlideRenderer
          slide={currentSlideData}
          slideNumber={currentSlide + 1}
          onNext={canGoNext ? goToNext : undefined}
        />
      </div>

      {/* Presentation Controls */}
      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        progress={progress}
        onNext={goToNext}
        onPrevious={goToPrevious}
        onExit={() => navigate(-1)}
      />
    </div>
  );
}
