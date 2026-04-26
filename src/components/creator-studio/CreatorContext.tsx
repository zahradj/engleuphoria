import React, { createContext, useContext, useMemo, useState } from 'react';

export type CreatorStep = 'blueprint' | 'slide-builder' | 'library';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type HubType = 'playground' | 'academy' | 'success';
export type Phase = 'warm-up' | 'presentation' | 'practice' | 'production' | 'review';

export type SkillFocus = 'Grammar' | 'Vocabulary' | 'Reading/Listening' | 'Speaking' | 'Review';

export interface BlueprintLessonRef {
  id: string;
  lesson_number?: number;
  title: string;
  skill_focus?: SkillFocus | string;
  objective?: string;
  /** @deprecated alias of objective, kept for back-compat */
  learning_objective?: string;
  unit_number?: number;
  unit_title?: string;
  unit_theme?: string;
}

export interface CurriculumData {
  curriculum_title: string;
  cefr_level: CEFRLevel;
  hub: HubType;
  theme_hint?: string;
  units: Array<{
    id: string;
    unit_number?: number;
    unit_title: string;
    theme?: string;
    lessons: BlueprintLessonRef[];
  }>;
}

export interface PPPSlide {
  id: string;
  phase: Phase;
  title?: string;
  content?: string;
  visual_keyword?: string;
  custom_image_url?: string;
  teacher_instructions?: string;
  interactive_options?: string[];
  slide_type?: string;
  interaction_type?: string;
}

export interface ActiveLessonData {
  source_lesson?: BlueprintLessonRef;
  cefr_level: CEFRLevel;
  hub: HubType;
  lesson_title: string;
  target_goal?: string;
  target_grammar?: string;
  target_vocabulary?: string;
  roadmap?: string[];
  slides: PPPSlide[];
}

interface CreatorContextValue {
  currentStep: CreatorStep;
  setCurrentStep: (s: CreatorStep) => void;

  curriculumData: CurriculumData | null;
  setCurriculumData: (c: CurriculumData | null) => void;

  activeLessonData: ActiveLessonData | null;
  setActiveLessonData: (l: ActiveLessonData | null) => void;

  /** Computed working title for the studio header. */
  workingTitle: string;
  /** Dirty flag — set by feature components when there are unsaved edits. */
  isDirty: boolean;
  setDirty: (v: boolean) => void;
}

const CreatorContext = createContext<CreatorContextValue | null>(null);

export const CreatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<CreatorStep>('blueprint');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [activeLessonData, setActiveLessonData] = useState<ActiveLessonData | null>(null);
  const [isDirty, setDirty] = useState(false);

  const workingTitle = useMemo(() => {
    if (currentStep === 'slide-builder' && activeLessonData) {
      return `Drafting: ${activeLessonData.lesson_title}`;
    }
    if (currentStep === 'blueprint' && curriculumData) {
      return `Blueprint: ${curriculumData.curriculum_title}`;
    }
    if (currentStep === 'library') return 'Master Library';
    if (currentStep === 'blueprint') return 'New Curriculum Blueprint';
    return 'Creator Studio';
  }, [currentStep, activeLessonData, curriculumData]);

  const value: CreatorContextValue = {
    currentStep,
    setCurrentStep,
    curriculumData,
    setCurriculumData,
    activeLessonData,
    setActiveLessonData,
    workingTitle,
    isDirty,
    setDirty,
  };

  return <CreatorContext.Provider value={value}>{children}</CreatorContext.Provider>;
};

export const useCreator = (): CreatorContextValue => {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error('useCreator must be used within <CreatorProvider>');
  return ctx;
};
