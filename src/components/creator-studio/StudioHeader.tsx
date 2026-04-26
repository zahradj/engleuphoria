import React from 'react';
import { Save, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreator } from './CreatorContext';
import { toast } from 'sonner';

export const StudioHeader: React.FC = () => {
  const { workingTitle, isDirty, currentStep } = useCreator();

  const handleSaveDraft = () => {
    // Wired in feature components later. Placeholder behaviour for the shell.
    toast.message('Draft saved', { description: 'Auto-save hook will plug in here.' });
  };

  const handlePublish = () => {
    toast.message('Publish flow', { description: 'Will be wired into the active step.' });
  };

  return (
    <header className="h-16 flex items-center justify-between gap-4 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {currentStep === 'blueprint' ? 'Blueprint Engine'
            : currentStep === 'slide-builder' ? 'Slide Studio'
            : 'Master Library'}
        </div>
        <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
          {workingTitle}
          {isDirty && <span className="ml-2 text-xs font-medium text-amber-500">• Unsaved</span>}
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-1.5">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save Draft</span>
        </Button>
        <Button
          size="sm"
          onClick={handlePublish}
          className="gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-md"
        >
          <Rocket className="h-4 w-4" />
          <span className="hidden sm:inline">Publish</span>
        </Button>
      </div>
    </header>
  );
};
