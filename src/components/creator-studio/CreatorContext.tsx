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

export type SlideType = 'text_image' | 'multiple_choice' | 'drawing_prompt' | 'flashcard';
export type LayoutStyle = 'split_left' | 'split_right' | 'center_card' | 'full_background';

export interface MCQData {
  question: string;
  options: string[];
  correct_index: number;
}
export interface FlashcardData {
  front: string;
  back: string;
}
export interface DrawingData {
  prompt: string;
}
export type InteractiveData = MCQData | FlashcardData | DrawingData | Record<string, unknown>;

export interface PPPSlide {
  id: string;
  phase: Phase | string;
  slide_type?: SlideType;
  layout_style?: LayoutStyle;
  title?: string;
  content?: string;
  teacher_script?: string;
  visual_keyword?: string;
  custom_image_url?: string;
  /** Public URL of an uploaded looping video clip (preferred over image when present). */
  custom_video_url?: string;
  /** Phonetic kid-friendly TTS string sent to ElevenLabs. */
  elevenlabs_script?: string;
  /** AI-engineered prompt the user can copy into a text-to-image tool. */
  image_generation_prompt?: string;
  /** AI-engineered prompt the user can copy into a text-to-video tool. */
  video_generation_prompt?: string;
  /** Prompt for AI background music (ElevenLabs Music / Lyria). */
  music_generation_prompt?: string;
  /** Public URL of the generated/uploaded voiceover MP3 attached to this slide. */
  audio_url?: string;
  /** Public URL of the generated/uploaded background music track attached to this slide. */
  background_music_url?: string;
  interactive_data?: InteractiveData;
  // legacy / optional
  teacher_instructions?: string;
  interactive_options?: string[];
  interaction_type?: string;
}

export interface ActiveLessonData {
  /** Supabase curriculum_lessons.id — set when editing an existing row. */
  lesson_id?: string;
  source_lesson?: BlueprintLessonRef;
  cefr_level: CEFRLevel;
  hub: HubType;
  lesson_title: string;
  target_goal?: string;
  target_grammar?: string;
  target_vocabulary?: string;
  roadmap?: string[];
  slides: PPPSlide[];
  // Optional handoff metadata so we can persist links to the blueprint.
  level_id?: string;
  unit_id?: string;
}

interface CreatorContextValue {
  currentStep: CreatorStep;
  setCurrentStep: (s: CreatorStep) => void;

  curriculumData: CurriculumData | null;
  setCurriculumData: (c: CurriculumData | null) => void;

  activeLessonData: ActiveLessonData | null;
  setActiveLessonData: (l: ActiveLessonData | null) => void;

  /** Patch a single slide on the active lesson and mark the studio dirty. */
  updateSlide: (id: string, patch: Partial<PPPSlide>) => void;
  /** Replace the whole slide deck on the active lesson. */
  replaceSlides: (slides: PPPSlide[]) => void;

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

  const updateSlide = (id: string, patch: Partial<PPPSlide>) => {
    setActiveLessonData((prev) => {
      if (!prev) return prev;
      const slides = prev.slides.map((s) => (s.id === id ? { ...s, ...patch } : s));
      return { ...prev, slides };
    });
    setDirty(true);
  };

  const replaceSlides = (slides: PPPSlide[]) => {
    setActiveLessonData((prev) => (prev ? { ...prev, slides } : prev));
    setDirty(true);
  };

  const value: CreatorContextValue = {
    currentStep,
    setCurrentStep,
    curriculumData,
    setCurriculumData,
    activeLessonData,
    setActiveLessonData,
    updateSlide,
    replaceSlides,
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
