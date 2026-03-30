import React, { useState } from 'react';
import { ContentCreatorStepper, PipelineStep } from '@/components/content-creator/ContentCreatorStepper';
import { usePipelineProgress } from '@/hooks/usePipelineProgress';
import { CurriculumStep, CurriculumContext } from '@/components/content-creator/CurriculumStep';
import { NewLibrary } from '@/components/admin/NewLibrary';
import { AdminLessonEditor } from '@/components/admin/lesson-builder';
import { CurriculumLibrary } from '@/components/admin/CurriculumLibrary';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContentCreatorDashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<PipelineStep>(1);
  const [curriculumContext, setCurriculumContext] = useState<CurriculumContext | null>(null);
  const { user, signOut } = useAuth();

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4) as PipelineStep);
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 1) as PipelineStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CurriculumStep onNextStep={goNext} onCurriculumSelected={setCurriculumContext} />;
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Step 2: Lesson Generation</h1>
              <p className="text-muted-foreground mt-1">
                Generate AI-powered lessons based on your curriculum, then build slides.
              </p>
            </div>
            <NewLibrary onNavigate={() => {}} initialContext={curriculumContext} />
            <div className="flex justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={goPrev} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back: Curriculum
              </Button>
              <Button onClick={goNext} size="lg" className="gap-2">
                Next: Build Slides
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return <AdminLessonEditor onFinish={goNext} onBack={goPrev} />;
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Step 4: Content Library</h1>
              <p className="text-muted-foreground mt-1">
                Browse, manage, and publish your completed content.
              </p>
            </div>
            <CurriculumLibrary />
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

  const isFullBleed = currentStep === 3;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground tracking-tight">AI Content Studio</h2>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            — Welcome, <strong className="text-foreground">{user?.user_metadata?.full_name || 'Content Creator'}</strong>
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </header>

      {/* Stepper */}
      <ContentCreatorStepper currentStep={currentStep} onStepChange={setCurrentStep} />

      {/* Main Content */}
      {isFullBleed ? (
        <div className="flex-1 min-h-0">{renderStepContent()}</div>
      ) : (
        <main className="flex-1 p-6 overflow-auto">{renderStepContent()}</main>
      )}
    </div>
  );
};

export default ContentCreatorDashboard;
