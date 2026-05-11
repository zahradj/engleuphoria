import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Map, Palette, Library, Sparkles, GraduationCap, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreator, type HubType, type CreatorStep } from './CreatorContext';
import { BlueprintEngine } from './steps/BlueprintEngine';
import { SlideStudio } from './steps/SlideStudio';
import { LibraryManager } from './steps/LibraryManager';

/**
 * HubCreatorWorkspace
 * --------------------
 * Hub-locked authoring workspace. Embeds the full Slide Studio toolchain
 * (Blueprint planner + Slide builder + Library) inside a single hub so
 * the creator never has to leave the branded environment.
 *
 * Tabs follow the canonical authoring sequence:
 *   Blueprint  →  Slide Studio  →  Library
 *
 * The hub is locked into CreatorContext on mount so every downstream
 * AI call, theme hook and persistence layer is hub-aware.
 */
const HUB_META: Record<HubType, { label: string; emoji: string; ring: string; tab: string; icon: React.ElementType }> = {
  playground: {
    label: 'Playground',
    emoji: '🧒',
    ring: 'ring-orange-400',
    tab: 'data-[state=active]:bg-orange-500 data-[state=active]:text-white',
    icon: Sparkles,
  },
  academy: {
    label: 'Academy',
    emoji: '🎓',
    ring: 'ring-purple-400',
    tab: 'data-[state=active]:bg-purple-600 data-[state=active]:text-white',
    icon: GraduationCap,
  },
  success: {
    label: 'Success',
    emoji: '💼',
    ring: 'ring-emerald-400',
    tab: 'data-[state=active]:bg-emerald-600 data-[state=active]:text-white',
    icon: Briefcase,
  },
};

const ALL_HUBS: HubType[] = ['playground', 'academy', 'success'];

type WorkspaceTab = 'blueprint' | 'slide-builder' | 'library';

const STEP_TO_TAB: Record<string, WorkspaceTab> = {
  blueprint: 'blueprint',
  'slide-builder': 'slide-builder',
  library: 'library',
};

export const HubCreatorWorkspace: React.FC<{ hub: HubType }> = ({ hub }) => {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, curriculumData, setCurriculumData, activeLessonData, setActiveLessonData } = useCreator();

  // Lock the hub into any in-progress data so downstream tools stay hub-aware.
  useEffect(() => {
    if (curriculumData && curriculumData.hub !== hub) {
      setCurriculumData({ ...curriculumData, hub });
    }
    if (activeLessonData && activeLessonData.hub !== hub) {
      setActiveLessonData({ ...activeLessonData, hub });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hub]);

  // Map currentStep → workspace tab. Defaults to Blueprint.
  const activeTab: WorkspaceTab =
    STEP_TO_TAB[currentStep] ?? 'blueprint';

  const onTabChange = (next: string) => {
    const step = (next === 'slide-builder' ? 'slide-builder' : next === 'library' ? 'library' : 'blueprint') as CreatorStep;
    setCurrentStep(step);
  };

  // When a creator clicks "Build Slides" inside Blueprint, the existing
  // BlueprintEngine calls setCurrentStep('slide-builder'). Our tab follows it.
  const meta = HUB_META[hub];

  return (
    <div className="h-full flex flex-col -m-3 sm:-m-6">
      {/* Hub strip + cross-hub switcher */}
      <div className="shrink-0 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none">{meta.emoji}</span>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Creator Workspace</div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50 truncate">{meta.label} Hub</div>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5">
          {ALL_HUBS.map((h) => {
            const Icon = HUB_META[h].icon;
            const active = h === hub;
            return (
              <button
                key={h}
                type="button"
                onClick={() => navigate(`/content-creator/${h}-creator`)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition',
                  active
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
                )}
                aria-pressed={active}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{HUB_META[h].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabbed workspace */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 min-h-0 flex flex-col">
        <div className="shrink-0 px-3 sm:px-6 pt-3 bg-slate-100 dark:bg-slate-950">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
            <TabsTrigger value="blueprint" className={cn('gap-1.5 text-xs sm:text-sm', meta.tab)}>
              <Map className="h-3.5 w-3.5" />
              Blueprint
            </TabsTrigger>
            <TabsTrigger value="slide-builder" className={cn('gap-1.5 text-xs sm:text-sm', meta.tab)}>
              <Palette className="h-3.5 w-3.5" />
              Slide Studio
            </TabsTrigger>
            <TabsTrigger value="library" className={cn('gap-1.5 text-xs sm:text-sm', meta.tab)}>
              <Library className="h-3.5 w-3.5" />
              Library
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="blueprint" className="flex-1 min-h-0 overflow-auto px-3 sm:px-6 py-4 mt-0 data-[state=inactive]:hidden">
          <BlueprintEngine />
        </TabsContent>
        <TabsContent value="slide-builder" className="flex-1 min-h-0 overflow-hidden mt-0 data-[state=inactive]:hidden">
          <div className="h-full px-3 sm:px-6 py-3">
            <SlideStudio />
          </div>
        </TabsContent>
        <TabsContent value="library" className="flex-1 min-h-0 overflow-auto px-3 sm:px-6 py-4 mt-0 data-[state=inactive]:hidden">
          <LibraryManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HubCreatorWorkspace;
