import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreatorProvider, useCreator } from './CreatorContext';
import { StudioSidebar } from './StudioSidebar';
import { StudioHeader } from './StudioHeader';
import { StudioMobileNav } from './StudioMobileNav';
import { LibraryManager } from './steps/LibraryManager';
import { TrialCreator } from './steps/TrialCreator';
import { StoryCreator } from './steps/StoryCreator';
import PlaygroundCreator from '@/pages/PlaygroundCreator';
import AcademyCreator from '@/pages/AcademyCreator';
import SuccessCreator from '@/pages/SuccessCreator';

const LAST_HUB_KEY = 'creatorStudio:lastHub';

const StudioBody: React.FC = () => {
  const { currentStep, setCurrentStep } = useCreator();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const path = location.pathname;
    let next: typeof currentStep | null = null;

    // Legacy top-level routes → redirect into a hub workspace.
    if (path.endsWith('/blueprint') || path.endsWith('/slide-builder') || path.endsWith('/slides')) {
      const lastHub =
        (typeof window !== 'undefined' && window.localStorage.getItem(LAST_HUB_KEY)) || 'playground';
      const target = `/content-creator/${lastHub}-creator`;
      // Preserve the inner step (blueprint vs slide-builder) for the workspace tabs.
      if (path.endsWith('/slide-builder') || path.endsWith('/slides')) setCurrentStep('slide-builder');
      else setCurrentStep('blueprint');
      navigate(target, { replace: true });
      return;
    }

    if (path.endsWith('/library')) next = 'library';
    else if (path.endsWith('/trial')) next = 'trial';
    else if (path.endsWith('/story')) next = 'story';
    else if (path.endsWith('/playground-creator')) next = 'playground-creator';
    else if (path.endsWith('/academy-creator')) next = 'academy-creator';
    else if (path.endsWith('/success-creator')) next = 'success-creator';

    // Remember the last hub the creator visited so legacy redirects land there.
    if (next === 'playground-creator' || next === 'academy-creator' || next === 'success-creator') {
      const hub = next.replace('-creator', '');
      if (typeof window !== 'undefined') window.localStorage.setItem(LAST_HUB_KEY, hub);
    }

    if (next && next !== currentStep) setCurrentStep(next);
  }, [currentStep, location.pathname, setCurrentStep, navigate]);

  const Step =
    currentStep === 'playground-creator' ? PlaygroundCreator
    : currentStep === 'academy-creator' ? AcademyCreator
    : currentStep === 'success-creator' ? SuccessCreator
    : currentStep === 'trial' ? TrialCreator
    : currentStep === 'story' ? StoryCreator
    : currentStep === 'library' ? LibraryManager
    // Legacy `blueprint` / `slide-builder` should never be the standalone top-level
    // view anymore — fall back to Playground if somehow reached.
    : PlaygroundCreator;

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
