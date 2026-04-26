import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContentCreatorStepper, PipelineStep } from '@/components/content-creator/ContentCreatorStepper';
import { usePipelineProgress } from '@/hooks/usePipelineProgress';
import { CurriculumStep, CurriculumContext } from '@/components/content-creator/CurriculumStep';
import { SlideStudio } from '@/components/content-creator/slide-studio/SlideStudio';
import LessonLibraryHub from '@/components/lesson-player/LessonLibraryHub';
// AILessonArchitect is now integrated inside the Slide Builder (AdminLessonEditor)
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, ArrowLeft, Wand2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

const ContentCreatorDashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<PipelineStep>(1);
  const [curriculumContext, setCurriculumContext] = useState<CurriculumContext | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const progress = usePipelineProgress();

  // Auto-jump to Step 2 when arriving from Blueprint "Build Slides"
  useEffect(() => {
    const state = (location.state || {}) as { fromBlueprint?: boolean };
    if (state.fromBlueprint) setCurrentStep(2);
  }, [location.state]);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 3) as PipelineStep);
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1) as PipelineStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* 4-Skills Blueprint entry banner */}
            <button
              onClick={() => navigate('/content-creator/blueprint')}
              className="w-full text-left rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-sky-500/5 hover:from-sky-500/15 hover:to-blue-500/15 transition-colors p-5 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold tracking-tight">4-Skills Curriculum Blueprint</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    Generate a themed, 4-skills curriculum (Grammar · Vocab · Reading/Listening · Speaking) and hand off each lesson straight to the AI Slide Wizard.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </button>

            {/* Master PPP Wizard entry banner */}
            <button
              onClick={() => navigate('/content-creator/master-wizard')}
              className="w-full text-left rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 hover:from-amber-500/15 hover:to-orange-500/15 transition-colors p-5 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold tracking-tight">Master PPP Lesson Wizard</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    Generate a Cambridge-grade PPP lesson with roadmap, editable cards & Unsplash visuals.
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </button>

            <CurriculumStep onNextStep={goNext} onCurriculumSelected={setCurriculumContext} />
          </div>
        );
      case 2:
        return <AdminLessonEditor onFinish={goNext} onBack={goPrev} curriculumContext={curriculumContext} />;
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Step 3: Content Library</h1>
              <p className="text-muted-foreground mt-1">
                Browse, manage, and publish your completed content.
              </p>
            </div>
            <LessonLibraryHub />
            <div className="flex justify-start pt-4 border-t border-border">
              <Button variant="outline" onClick={goPrev} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back: Slide Builder
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isFullBleed = currentStep === 2;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Logo size="small" />
          <div className="hidden sm:block h-6 w-px bg-border/50" />
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground tracking-tight">AI Content Studio</h2>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              — Welcome, <strong className="text-foreground">{user?.user_metadata?.full_name || 'Content Creator'}</strong>
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </header>

      {currentStep !== 2 && (
        <ContentCreatorStepper currentStep={currentStep} onStepChange={setCurrentStep} progress={progress} />
      )}

      {isFullBleed ? (
        <div className="flex-1 min-h-0">{renderStepContent()}</div>
      ) : (
        <main className="flex-1 p-6 overflow-auto">{renderStepContent()}</main>
      )}
    </div>
  );
};

export default ContentCreatorDashboard;
