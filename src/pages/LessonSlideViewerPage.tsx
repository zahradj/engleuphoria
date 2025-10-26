import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home, Volume2, VolumeX, Clock, Users } from 'lucide-react';
import { SlideRenderer } from '@/components/slides/SlideRenderer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProgressBar } from '@/components/gamification/ProgressBar';
import { ConfettiEffect } from '@/components/gamification/ConfettiEffect';
import { AchievementPopup } from '@/components/gamification/AchievementPopup';
import { soundEffectsService } from '@/services/soundEffectsService';

export default function LessonSlideViewerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [lessonData, setLessonData] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievement, setAchievement] = useState<{ show: boolean; message: string; type: 'success' | 'perfect' | 'streak' | 'complete' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [isMuted, setIsMuted] = useState(false);

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

  useEffect(() => {
    soundEffectsService.setMuted(isMuted);
  }, [isMuted]);

  const handleNext = () => {
    if (lessonData && currentSlide < lessonData.slides_content.slides.length - 1) {
      soundEffectsService.playPageTurn();
      setCurrentSlide(currentSlide + 1);
      
      // Award XP for completing a slide
      const xpEarned = lessonData.slides_content.slides[currentSlide].xpReward || 10;
      setTotalXP(prev => prev + xpEarned);
      
      // Show achievements at milestones
      if ((currentSlide + 1) % 5 === 0) {
        soundEffectsService.playStarEarned();
        setShowConfetti(true);
        setAchievement({
          show: true,
          message: '🎉 Milestone Reached!',
          type: 'complete'
        });
      }
    } else if (lessonData && currentSlide === lessonData.slides_content.slides.length - 1) {
      // Lesson complete!
      soundEffectsService.playLevelComplete();
      setShowConfetti(true);
      setAchievement({
        show: true,
        message: '🏆 Lesson Complete!',
        type: 'perfect'
      });
      toast({
        title: "Lesson Complete! 🎉",
        description: "You've completed this lesson!",
      });
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      soundEffectsService.playPageTurn();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <AchievementPopup
        show={achievement.show}
        message={achievement.message}
        type={achievement.type}
        onClose={() => setAchievement(prev => ({ ...prev, show: false }))}
      />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-primary/10 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleExit} className="hover:scale-105 transition-transform">
                <Home className="h-4 w-4 mr-2" />
                Exit
              </Button>
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{lessonData.title}</span>
                  {lessonData.slides_content?.metadata?.format === 'one-on-one' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
                      <Users className="w-3 h-3 mr-1" />
                      1-on-1
                    </span>
                  )}
                  {lessonData.slides_content?.durationMin && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <Clock className="w-3 h-3 mr-1" />
                      {lessonData.slides_content.durationMin} min
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground font-medium">
                  Module {moduleNumber} • Lesson {lessonNumber}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="gap-2 hover:scale-105 transition-transform"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
          </div>
          <ProgressBar
            current={currentSlide + 1}
            total={slides.length}
            xp={totalXP}
          />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-primary/10 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className="shadow-md hover:scale-105 transition-transform disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {slides.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    soundEffectsService.playButtonClick();
                    setCurrentSlide(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-125 shadow-lg' 
                      : index < currentSlide 
                      ? 'bg-green-400 shadow-md' 
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="shadow-md hover:scale-105 transition-transform disabled:opacity-40 font-bold"
            >
              {currentSlide === slides.length - 1 ? '🎉 Complete' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
