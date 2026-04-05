/**
 * Slide Skeleton Pre-Prompt Engine
 * 
 * When a lesson is clicked in the Curriculum Explorer, this engine
 * auto-generates a set of slide "skeletons" with pre-calculated
 * image prompts, positioning rules, and timing metadata.
 * 
 * The skeletons are ready for one-click image generation.
 */

import { HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';

export type SlidePhase = 'hook' | 'discovery' | 'active_play' | 'recap';
export type MascotPosition = 'left' | 'right' | 'hidden';

export interface SlideSkeleton {
  slideNumber: number;
  phase: SlidePhase;
  phaseLabel: string;
  title: string;
  objective: string;
  imagePrompt: string;
  mascotPosition: MascotPosition;
  contentPosition: 'left' | 'right' | 'center';
  safeZoneInstruction: string;
  activityType: string | null;
  durationSeconds: number;
  accessoryReveal: boolean;
}

export interface LessonSkeletonPlan {
  lessonId: string;
  lessonTitle: string;
  hub: HubType;
  levelName: string;
  accessoryName: string | null;
  totalSlides: number;
  totalMinutes: number;
  skeletons: SlideSkeleton[];
  generatedAt: string;
}

// ─── Phase Definitions ────────────────────────────────────────────
const PLAYGROUND_SEQUENCE: Array<{
  phase: SlidePhase;
  phaseLabel: string;
  objective: string;
  activityType: string | null;
  durationSeconds: number;
}> = [
  { phase: 'hook', phaseLabel: 'Intro Hook', objective: 'Mascot greeting — set the world', activityType: null, durationSeconds: 120 },
  { phase: 'hook', phaseLabel: 'Intro Hook', objective: 'Today\'s adventure preview', activityType: null, durationSeconds: 120 },
  { phase: 'discovery', phaseLabel: 'Discovery', objective: 'New word #1 — Click-to-Reveal', activityType: 'click_to_reveal', durationSeconds: 150 },
  { phase: 'discovery', phaseLabel: 'Discovery', objective: 'New word #2 — Click-to-Reveal', activityType: 'click_to_reveal', durationSeconds: 150 },
  { phase: 'discovery', phaseLabel: 'Discovery', objective: 'New word #3 — Click-to-Reveal', activityType: 'click_to_reveal', durationSeconds: 150 },
  { phase: 'active_play', phaseLabel: 'Active Play', objective: 'Drag & Drop activity', activityType: 'drag_and_drop', durationSeconds: 180 },
  { phase: 'active_play', phaseLabel: 'Active Play', objective: 'Matching pairs game', activityType: 'match_pictures', durationSeconds: 180 },
  { phase: 'active_play', phaseLabel: 'Active Play', objective: 'Pop the Word Bubble', activityType: 'pop_the_word_bubble', durationSeconds: 150 },
  { phase: 'active_play', phaseLabel: 'Active Play', objective: 'Quick quiz checkpoint', activityType: 'multiple_choice', durationSeconds: 120 },
  { phase: 'recap', phaseLabel: 'Recap & Reward', objective: 'Review key words', activityType: null, durationSeconds: 120 },
  { phase: 'recap', phaseLabel: 'Recap & Reward', objective: 'Celebration — Accessory reveal', activityType: null, durationSeconds: 90 },
  { phase: 'recap', phaseLabel: 'Recap & Reward', objective: 'Goodbye wave', activityType: null, durationSeconds: 60 },
];

const ACADEMY_SEQUENCE: Array<{
  phase: SlidePhase;
  phaseLabel: string;
  objective: string;
  activityType: string | null;
  durationSeconds: number;
}> = [
  { phase: 'hook', phaseLabel: 'Hook', objective: 'Challenge intro — set the stakes', activityType: null, durationSeconds: 120 },
  { phase: 'hook', phaseLabel: 'Hook', objective: 'Today\'s mission briefing', activityType: null, durationSeconds: 120 },
  { phase: 'discovery', phaseLabel: 'Input', objective: 'Vocabulary deep-dive #1', activityType: 'fill_in_blanks', durationSeconds: 150 },
  { phase: 'discovery', phaseLabel: 'Input', objective: 'Vocabulary deep-dive #2', activityType: 'fill_in_blanks', durationSeconds: 150 },
  { phase: 'discovery', phaseLabel: 'Input', objective: 'Grammar pattern spotlight', activityType: null, durationSeconds: 180 },
  { phase: 'active_play', phaseLabel: 'Practice', objective: 'Sentence Unscramble', activityType: 'sentence_unscramble', durationSeconds: 180 },
  { phase: 'active_play', phaseLabel: 'Practice', objective: 'Speed Quiz round', activityType: 'speed_quiz', durationSeconds: 150 },
  { phase: 'active_play', phaseLabel: 'Practice', objective: 'Fill-in-the-Blanks challenge', activityType: 'fill_in_blanks', durationSeconds: 150 },
  { phase: 'active_play', phaseLabel: 'Practice', objective: 'Listening comprehension', activityType: null, durationSeconds: 180 },
  { phase: 'recap', phaseLabel: 'Wrap-up', objective: 'Key takeaways review', activityType: null, durationSeconds: 120 },
  { phase: 'recap', phaseLabel: 'Wrap-up', objective: 'Achievement unlock', activityType: null, durationSeconds: 90 },
  { phase: 'recap', phaseLabel: 'Wrap-up', objective: 'Next mission teaser', activityType: null, durationSeconds: 60 },
];

const PROFESSIONAL_SEQUENCE: Array<{
  phase: SlidePhase;
  phaseLabel: string;
  objective: string;
  activityType: string | null;
  durationSeconds: number;
}> = [
  { phase: 'hook', phaseLabel: 'Context', objective: 'Scenario introduction', activityType: null, durationSeconds: 150 },
  { phase: 'hook', phaseLabel: 'Context', objective: 'Learning objectives', activityType: null, durationSeconds: 120 },
  { phase: 'discovery', phaseLabel: 'Input', objective: 'Key terminology #1', activityType: 'vocabulary_expansion', durationSeconds: 180 },
  { phase: 'discovery', phaseLabel: 'Input', objective: 'Key terminology #2', activityType: 'vocabulary_expansion', durationSeconds: 180 },
  { phase: 'discovery', phaseLabel: 'Input', objective: 'Framework / structure', activityType: null, durationSeconds: 180 },
  { phase: 'active_play', phaseLabel: 'Application', objective: 'Case study analysis', activityType: 'case_study_analysis', durationSeconds: 240 },
  { phase: 'active_play', phaseLabel: 'Application', objective: 'Business email reply', activityType: 'business_email_reply', durationSeconds: 210 },
  { phase: 'active_play', phaseLabel: 'Application', objective: 'Executive choice scenario', activityType: 'executive_choice', durationSeconds: 180 },
  { phase: 'active_play', phaseLabel: 'Application', objective: 'Discussion prompt', activityType: null, durationSeconds: 150 },
  { phase: 'recap', phaseLabel: 'Summary', objective: 'Key outcomes review', activityType: null, durationSeconds: 120 },
  { phase: 'recap', phaseLabel: 'Summary', objective: 'Action items', activityType: null, durationSeconds: 90 },
  { phase: 'recap', phaseLabel: 'Summary', objective: 'Professional badge reveal', activityType: null, durationSeconds: 60 },
];

const SEQUENCES: Record<HubType, typeof PLAYGROUND_SEQUENCE> = {
  playground: PLAYGROUND_SEQUENCE,
  academy: ACADEMY_SEQUENCE,
  professional: PROFESSIONAL_SEQUENCE,
};

// ─── Image Prompt Builder ─────────────────────────────────────────
function buildImagePrompt(
  hub: HubType,
  topic: string,
  slideObjective: string,
  slideNumber: number,
  safeZone: string,
  accessoryName: string | null,
  levelName: string,
): string {
  const config = HUB_CONFIGS[hub];

  // Base cinematic prompt per hub
  const basePrompts: Record<HubType, string> = {
    playground: `3D stylized environment for a kids' educational app. Topic: "${topic}". Scene: ${slideObjective}. Style: High-quality Disney-Pixar render, vibrant lighting, soft shadows, ${config.imageStyleSuffix}. Layout: ${safeZone}. No text in image. 8k resolution.`,
    academy: `Futuristic digital learning environment. Topic: "${topic}". Scene: ${slideObjective}. Style: Holographic UI elements, neon accents, ${config.imageStyleSuffix}. Layout: ${safeZone}. No text in image. 8k resolution.`,
    professional: `Modern corporate environment. Topic: "${topic}". Scene: ${slideObjective}. Style: Clean, executive, ${config.imageStyleSuffix}. Layout: ${safeZone}. No text in image. 8k resolution.`,
  };

  let prompt = basePrompts[hub];

  // Accessory reveal on slide 11
  if (slideNumber === 11 && accessoryName) {
    if (hub === 'playground') {
      prompt = `3D stylized scene of Pip the Penguin holding a glowing "${accessoryName}" to celebrate. Topic: "${topic}". Style: Disney-Pixar celebration render, confetti, golden lighting, ${config.imageStyleSuffix}. No text in image. 8k resolution.`;
    } else if (hub === 'academy') {
      prompt = `Holographic achievement unlock screen showing a floating "${accessoryName}" reward. Topic: "${topic}". Style: Neon glow, ${config.imageStyleSuffix}. No text in image. 8k resolution.`;
    } else {
      prompt = `Elegant certificate or badge presentation: "${accessoryName}". Corporate achievement style, ${config.imageStyleSuffix}. No text in image. 8k resolution.`;
    }
  }

  // Mascot-specific prompts for Playground
  if (hub === 'playground' && slideNumber <= 2) {
    const position = slideNumber % 2 === 1 ? 'on the LEFT side' : 'on the RIGHT side';
    prompt = `3D stylized scene: Pip the Penguin ${position}, waving hello in a "${levelName}" world. Topic: "${topic}". Style: Disney-Pixar render, vibrant lighting, ${config.imageStyleSuffix}. No text in image. 8k resolution.`;
  }

  return prompt;
}

// ─── Safe Zone Logic ──────────────────────────────────────────────
function getSafeZone(activityType: string | null, mascotPosition: MascotPosition): string {
  if (activityType === 'drag_and_drop' || activityType === 'drag_and_drop_image') {
    return 'Subject framed in the top-center, minimalist background, 40% empty space at the bottom for drag-drop UI';
  }
  if (activityType === 'pop_the_word_bubble') {
    return 'Subject framed in the top-center, minimalist background, 40% empty space at the bottom for word bubbles';
  }
  if (activityType === 'multiple_choice' || activityType === 'speed_quiz') {
    return 'Subject framed in the upper-third, clean background, 50% empty space at the bottom for answer options';
  }
  if (mascotPosition === 'left') {
    return 'Main subject positioned on the RIGHT side, 40% empty space on the LEFT for mascot overlay';
  }
  if (mascotPosition === 'right') {
    return 'Main subject positioned on the LEFT side, 40% empty space on the RIGHT for mascot overlay';
  }
  return 'Centered composition, balanced negative space for text overlay';
}

// ─── Main Generator ───────────────────────────────────────────────
export function generateSlideSkeletons(params: {
  lessonId: string;
  lessonTitle: string;
  hub: HubType;
  levelName: string;
  accessoryName: string | null;
  topic: string;
}): LessonSkeletonPlan {
  const { lessonId, lessonTitle, hub, levelName, accessoryName, topic } = params;
  const sequence = SEQUENCES[hub];

  const skeletons: SlideSkeleton[] = sequence.map((step, index) => {
    const slideNumber = index + 1;

    // Alternating mascot position (odd=left, even=right) for playground
    let mascotPosition: MascotPosition = 'hidden';
    if (hub === 'playground') {
      mascotPosition = slideNumber % 2 === 1 ? 'left' : 'right';
      // Hide mascot during intense activities
      if (step.phase === 'active_play' && step.activityType) {
        mascotPosition = 'hidden';
      }
    }

    const contentPosition: 'left' | 'right' | 'center' =
      mascotPosition === 'left' ? 'right' :
      mascotPosition === 'right' ? 'left' : 'center';

    const safeZoneInstruction = getSafeZone(step.activityType, mascotPosition);

    const imagePrompt = buildImagePrompt(
      hub, topic, step.objective, slideNumber,
      safeZoneInstruction, accessoryName, levelName,
    );

    return {
      slideNumber,
      phase: step.phase,
      phaseLabel: step.phaseLabel,
      title: `Slide ${slideNumber}: ${step.objective}`,
      objective: step.objective,
      imagePrompt,
      mascotPosition,
      contentPosition,
      safeZoneInstruction,
      activityType: step.activityType,
      durationSeconds: step.durationSeconds,
      accessoryReveal: slideNumber === 11 && !!accessoryName,
    };
  });

  const totalSeconds = skeletons.reduce((sum, s) => sum + s.durationSeconds, 0);

  return {
    lessonId,
    lessonTitle,
    hub,
    levelName,
    accessoryName,
    totalSlides: skeletons.length,
    totalMinutes: Math.round(totalSeconds / 60),
    skeletons,
    generatedAt: new Date().toISOString(),
  };
}
