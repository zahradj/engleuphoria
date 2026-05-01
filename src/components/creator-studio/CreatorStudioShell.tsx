import React from 'react';
import { CreatorProvider, useCreator } from './CreatorContext';
import { StudioSidebar } from './StudioSidebar';
import { StudioHeader } from './StudioHeader';
import { StudioMobileNav } from './StudioMobileNav';
import { BlueprintEngine } from './steps/BlueprintEngine';
import { SlideStudio } from './steps/SlideStudio';
import { LibraryManager } from './steps/LibraryManager';

const StudioBody: React.FC = () => {
  const { currentStep } = useCreator();
  const Step =
    currentStep === 'blueprint' ? BlueprintEngine
    : currentStep === 'slide-builder' ? SlideStudio
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
