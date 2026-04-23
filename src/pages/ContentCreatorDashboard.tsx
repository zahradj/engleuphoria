import React, { useState } from 'react';
import { ContentCreatorStepper, PipelineStep } from '@/components/content-creator/ContentCreatorStepper';
import { usePipelineProgress } from '@/hooks/usePipelineProgress';
import { CurriculumStep, CurriculumContext } from '@/components/content-creator/CurriculumStep';
import { AdminLessonEditor } from '@/components/admin/lesson-builder';
import LessonLibraryHub from '@/components/lesson-player/LessonLibraryHub';
// AILessonArchitect is now integrated inside the Slide Builder (AdminLessonEditor)
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

const ContentCreatorDashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<PipelineStep>(1);
  const [curriculumContext, setCurriculumContext] = useState<CurriculumContext | null>(null);
  const { user, signOut } = useAuth();
  const progress = usePipelineProgress();

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 3) as PipelineStep);
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1) as PipelineStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
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
