import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { SlideRenderer } from '@/components/slides/SlideRenderer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function LessonSlideViewerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [lessonData, setLessonData] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const contentId = searchParams.get('contentId');
  const moduleNumber = searchParams.get('module');
  const lessonNumber = searchParams.get('lesson');

  const isValidUUID = (v?: string | null) =>
    !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  const moduleNum = moduleNumber ? Number(moduleNumber) : NaN;
  const lessonNum = lessonNumber ? Number(lessonNumber) : NaN;

  useEffect(() => {
    loadLessonData();
  }, [contentId, moduleNum, lessonNum]);

  const loadLessonData = async () => {
    setLoading(true);

    try {
      let data: any = null;
      let error: any = null;

      if (isValidUUID(contentId)) {
        const res = await supabase
          .from('lessons_content')
          .select('*')
          .eq('id', contentId)
          .maybeSingle();
        data = res.data;
        error = res.error;
        console.log('[LessonViewer] Fetched by contentId', { contentId, found: !!data, error });
      } else if (!Number.isNaN(moduleNum) && !Number.isNaN(lessonNum)) {
        const res = await supabase
          .from('lessons_content')
          .select('*')
          .eq('module_number', moduleNum)
          .eq('lesson_number', lessonNum)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        data = res.data;
        error = res.error;
        console.log('[LessonViewer] Fetched by module/lesson', { moduleNum, lessonNum, found: !!data, error });
      }

      if (error) throw error;

      // Fallback: localStorage when no identifiers or no DB data
      if (!data) {
        const raw = localStorage.getItem('currentLesson');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed?.slides?.slides) {
              setLessonData({
                id: parsed.lessonId || 'local',
                title: parsed.title || 'Lesson',
                slides_content: parsed.slides,
              });
              return;
            }
          } catch {}
        }

        toast({
          title: "No Lesson Found",
          description: moduleNumber && lessonNumber
            ? `No content for Module ${moduleNumber}, Lesson ${lessonNumber}.`
            : "Missing lesson identifiers.",
          variant: "destructive",
        });
        navigate(-1);
        return;
      }

      if (!data?.slides_content?.slides || data.slides_content.slides.length === 0) {
        toast({
          title: "No Slides Available",
          description: "This lesson doesn't have any slides yet.",
          variant: "destructive",
        });
        navigate(-1);
        return;
      }

      setLessonData(data);
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast({
        title: "Error",
        description: "Failed to load lesson content",
        variant: "destructive",
      });
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (lessonData && currentSlide < lessonData.slides_content.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      toast({
        title: "Lesson Complete! 🎉",
        description: "You've completed this lesson!",
      });
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleExit = () => {
    navigate('/teacher');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lessonData) return null;

  const slides = lessonData.slides_content.slides;
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleExit}>
                <Home className="h-4 w-4 mr-2" />
                Exit
              </Button>
              <div className="text-sm">
                <div className="font-semibold">{lessonData.title}</div>
                <div className="text-muted-foreground">
                  Module {moduleNumber} • Lesson {lessonNumber}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Slide {currentSlide + 1} of {slides.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Slide Content */}
      <div className="container mx-auto px-4 py-8">
        <SlideRenderer 
          slide={slides[currentSlide]} 
          slideNumber={currentSlide + 1}
          onNext={handleNext}
        />
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {slides.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide 
                      ? 'bg-primary' 
                      : index < currentSlide 
                      ? 'bg-primary/40' 
                      : 'bg-muted'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
            >
              {currentSlide === slides.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
