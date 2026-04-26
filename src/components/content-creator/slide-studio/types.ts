export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type HubType = 'playground' | 'academy' | 'success';
export type Phase = 'warm-up' | 'presentation' | 'practice' | 'production' | 'review';

export interface StudioSlide {
  id: string;
  phase: Phase;
  slide_type?: string;
  interaction_type?: string;
  title?: string;
  content?: string;
  visual_keyword?: string;
  custom_image_url?: string;
  teacher_instructions?: string;
  interactive_options?: string[];
}

export interface StudioLesson {
  lesson_title: string;
  target_goal?: string;
  target_grammar?: string;
  target_vocabulary?: string;
  roadmap?: string[];
  slides: StudioSlide[];
}

export interface BlueprintHandoff {
  fromBlueprint?: boolean;
  cefr_level?: CEFRLevel;
  hub?: HubType;
  topic?: string;
  skill_focus?: string;
  learning_objective?: string;
  unit_title?: string;
  unit_theme?: string;
  curriculum_title?: string;
}

export const PHASE_LABEL: Record<Phase, string> = {
  'warm-up': 'Warm-up',
  presentation: 'Presentation',
  practice: 'Practice',
  production: 'Production',
  review: 'Review',
};

export const PHASE_COLOR: Record<Phase, string> = {
  'warm-up': 'bg-amber-500',
  presentation: 'bg-sky-500',
  practice: 'bg-violet-500',
  production: 'bg-emerald-500',
  review: 'bg-rose-500',
};

export const HUB_LABEL: Record<HubType, string> = {
  playground: 'Playground (Kids 4–9, 30 min)',
  academy: 'Academy (Teens 12–17, 60 min)',
  success: 'Success Hub (Adults 18+, 60 min)',
};

export const HUB_TARGET_SYSTEM: Record<HubType, string> = {
  playground: 'playground',
  academy: 'teens',
  success: 'adults',
};

export const HUB_DIFFICULTY: Record<HubType, string> = {
  playground: 'beginner',
  academy: 'intermediate',
  success: 'advanced',
};

export const HUB_DURATION: Record<HubType, number> = {
  playground: 30,
  academy: 60,
  success: 60,
};

export const HUB_DEFAULT_CEFR: Record<HubType, CEFRLevel> = {
  playground: 'A1',
  academy: 'B1',
  success: 'C1',
};

export const normalizePhase = (s?: string): Phase => {
  const v = (s || '').toLowerCase().replace(/\s+/g, '-').replace('warmup', 'warm-up');
  if (v.startsWith('warm')) return 'warm-up';
  if (v.startsWith('pres')) return 'presentation';
  if (v.startsWith('prac')) return 'practice';
  if (v.startsWith('prod')) return 'production';
  if (v.startsWith('rev')) return 'review';
  return 'presentation';
};

export const unsplashUrl = (keyword?: string) => {
  const safe = (keyword || 'classroom-english').trim().replace(/\s+/g, '-');
  return `https://source.unsplash.com/1024x768/?${encodeURIComponent(safe)}`;
};
