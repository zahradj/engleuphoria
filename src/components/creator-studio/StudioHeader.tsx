import React, { useState } from 'react';
import { Save, Rocket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreator } from './CreatorContext';
import { toast } from 'sonner';
import { persistLesson } from './persistLesson';

export const StudioHeader: React.FC = () => {
  const {
    workingTitle,
    isDirty,
    currentStep,
    activeLessonData,
    setActiveLessonData,
    setCurrentStep,
    setDirty,
  } = useCreator();
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const inSlideStudio = currentStep === 'slide-builder';
  const hasSlides = !!activeLessonData?.slides?.length;

  const handleSaveDraft = async () => {
    if (!inSlideStudio || !activeLessonData) {
      toast.message('Open a lesson in the Slide Studio to save a draft.');
      return;
    }
    setSavingDraft(true);
    const res = await persistLesson(activeLessonData, activeLessonData.slides, false);
    setSavingDraft(false);
    if (res.ok === false) {
      toast.error(`Could not save draft: ${res.error}`);
      return;
    }
    // Stamp the row id back into context so the next save UPDATEs instead of
    // creating a duplicate row.
    if (!activeLessonData.lesson_id) {
      setActiveLessonData({ ...activeLessonData, lesson_id: res.lesson_id });
    }
    setDirty(false);
    toast.success('Draft saved');
  };

  const handlePublish = async () => {
    if (!inSlideStudio || !activeLessonData) {
      toast.message('Open a lesson in the Slide Studio to publish.');
      return;
    }
    if (!hasSlides) {
      toast.error('Generate or add slides before publishing.');
      return;
    }
    setPublishing(true);
    const res = await persistLesson(activeLessonData, activeLessonData.slides, true);
    setPublishing(false);
    if (res.ok === false) {
      toast.error(`Publish failed: ${res.error}`);
      return;
    }
    toast.success('Lesson published to the Master Library 🎉');
    setDirty(false);
    setActiveLessonData(null);
    setCurrentStep('library');
  };

  const publishLabel = inSlideStudio ? 'Save & Publish to Library' : 'Publish';

  return (
    <header className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveDraft}
          disabled={savingDraft || publishing || !inSlideStudio}
          className="gap-1.5"
        >
          {savingDraft ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span className="hidden sm:inline">Save Draft</span>
        </Button>
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={publishing || savingDraft || (inSlideStudio && !hasSlides)}
          className="gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-md"
        >
          {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          <span className="hidden sm:inline">💾 {publishLabel}</span>
        </Button>
      </div>
    </header>
  );
};
