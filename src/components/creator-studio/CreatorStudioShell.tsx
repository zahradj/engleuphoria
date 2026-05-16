import React from 'react';
import { useLocation } from 'react-router-dom';
import { CreatorProvider, useCreator } from './CreatorContext';
import { StudioSidebar } from './StudioSidebar';
import { StudioHeader } from './StudioHeader';
import { StudioMobileNav } from './StudioMobileNav';
import { BlueprintEngine } from './steps/BlueprintEngine';
import { LibraryManager } from './steps/LibraryManager';
import { TrialCreator } from './steps/TrialCreator';
import { StoryCreator } from './steps/StoryCreator';
import { CharacterCreator } from './characters/CharacterCreator';
import { GameMaker } from './steps/GameMaker';
import PlaygroundCreator from '@/pages/PlaygroundCreator';
import AcademyCreator from '@/pages/AcademyCreator';
import SuccessCreator from '@/pages/SuccessCreator';

const StudioBody: React.FC = () => {
  const { currentStep, setCurrentStep } = useCreator();
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    let next: typeof currentStep | null = null;
    if (path.endsWith('/library')) next = 'library';
    else if (path.endsWith('/blueprint')) next = 'blueprint';
    else if (path.endsWith('/trial')) next = 'trial';
    else if (path.endsWith('/story')) next = 'story';
    else if (path.endsWith('/characters')) next = 'characters';
    else if (path.endsWith('/playground-creator')) next = 'playground-creator';
    else if (path.endsWith('/academy-creator')) next = 'academy-creator';
    else if (path.endsWith('/success-creator')) next = 'success-creator';
    else if (path.endsWith('/game-maker')) next = 'game-maker';
    // Legacy /slide-builder or /slides paths now route to the Academy Creator,
    // which owns the advanced sequencing engine inherited from the Slide Studio.
    else if (path.endsWith('/slide-builder') || path.endsWith('/slides')) next = 'academy-creator';
    if (next && next !== currentStep) setCurrentStep(next);
  }, [currentStep, location.pathname, setCurrentStep]);

  const Step =
    currentStep === 'blueprint' ? BlueprintEngine
    : currentStep === 'playground-creator' ? PlaygroundCreator
    : currentStep === 'academy-creator' ? AcademyCreator
    : currentStep === 'success-creator' ? SuccessCreator
    : currentStep === 'trial' ? TrialCreator
    : currentStep === 'story' ? StoryCreator
    : currentStep === 'characters' ? CharacterCreator
    : currentStep === 'game-maker' ? GameMaker
    : LibraryManager;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <StudioSidebar />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <StudioHeader />
        <main className="flex-1 min-h-0 overflow-auto bg-slate-100 dark:bg-slate-950 p-3 sm:p-6 pb-20 md:pb-6">
          <Step />
        </main>
        {/* Mobile bottom nav — visible only on mobile */}
        <StudioMobileNav />
      </div>
    </div>
  );
};

const CreatorStudioShell: React.FC = () => (
  <CreatorProvider>
    <StudioBody />
  </CreatorProvider>
);

export default CreatorStudioShell;
