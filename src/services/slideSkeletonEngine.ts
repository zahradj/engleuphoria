/**
 * Slide Skeleton Pre-Prompt Engine — Scaffolded Mastery Edition
 * 
 * 5-Phase "Epic Arc" structure:
 *   1. Warm-Up (Song/Chant)
 *   2. Prime (Recognition — "I Do")
 *   3. Mimic (Phonetic Accuracy — "We Do")
 *   4. Produce (Active Recall — "You Do")
 *   5. Cool-Off (Brain Break / Recap)
 */

import { HubType } from '@/components/admin/lesson-builder/ai-wizard/types';
import { HUB_CONFIGS } from '@/components/admin/lesson-builder/ai-wizard/hubConfig';

export type SlidePhase = 'warmup' | 'prime' | 'mimic' | 'produce' | 'cooloff';
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
  phonemeTarget?: string;
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

// ─── Phase Color Map (for UI badges) ─────────────────────────────
export const PHASE_COLORS: Record<SlidePhase, { bg: string; text: string; label: string }> = {
  warmup:  { bg: 'bg-amber-100 dark:bg-amber-900/30',  text: 'text-amber-700 dark:text-amber-300',  label: '🎵 Warm-Up' },
  prime:   { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-300',    label: '👀 Prime' },
  mimic:   { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-300',  label: '🎤 Mimic' },
  produce: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', label: '🧠 Produce' },
  cooloff: { bg: 'bg-teal-100 dark:bg-teal-900/30',    text: 'text-teal-700 dark:text-teal-300',    label: '🧊 Cool-Off' },
};

// ─── Phase Sequences (5-Phase Scaffolded Mastery) ─────────────────
const PLAYGROUND_SEQUENCE: Array<{
  phase: SlidePhase;
  phaseLabel: string;
  objective: string;
  activityType: string | null;
  durationSeconds: number;
}> = [
  { phase: 'warmup', phaseLabel: 'Warm-Up', objective: 'AI Song / Tap the Beat', activityType: 'tap_the_beat', durationSeconds: 60 },
  { phase: 'warmup', phaseLabel: 'Warm-Up', objective: 'Hello Chant animation', activityType: null, durationSeconds: 60 },
  { phase: 'prime', phaseLabel: 'Prime', objective: 'Word #1 — Visual only, no text', activityType: null, durationSeconds: 120 },
  { phase: 'prime', phaseLabel: 'Prime', objective: 'Word #2 — Visual only, no text', activityType: null, durationSeconds: 120 },
  { phase: 'mimic', phaseLabel: 'Mimic', objective: 'Voice record word #1', activityType: 'voice_record', durationSeconds: 150 },
  { phase: 'mimic', phaseLabel: 'Mimic', objective: 'Voice record word #2', activityType: 'voice_record', durationSeconds: 150 },
  { phase: 'produce', phaseLabel: 'Produce', objective: 'Mystery silhouette — identify word', activityType: 'mystery_silhouette', durationSeconds: 150 },
  { phase: 'produce', phaseLabel: 'Produce', objective: 'Drag & Drop activity', activityType: 'drag_and_drop', durationSeconds: 180 },
  { phase: 'produce', phaseLabel: 'Produce', objective: 'Pop the Word Bubble', activityType: 'pop_the_word_bubble', durationSeconds: 150 },
  { phase: 'cooloff', phaseLabel: 'Cool-Off', objective: 'Breathing Balloon / Brain Break', activityType: 'breathing_balloon', durationSeconds: 60 },
  { phase: 'cooloff', phaseLabel: 'Cool-Off', objective: 'Celebration — Accessory reveal', activityType: null, durationSeconds: 90 },
  { phase: 'cooloff', phaseLabel: 'Cool-Off', objective: 'Goodbye wave', activityType: null, durationSeconds: 60 },
];

const ACADEMY_SEQUENCE: Array<{
  phase: SlidePhase;
  phaseLabel: string;
  objective: string;
  activityType: string | null;
  durationSeconds: number;
}> = [
  { phase: 'warmup', phaseLabel: 'Warm-Up', objective: 'Challenge intro music + mission brief', activityType: null, durationSeconds: 120 },
  { phase: 'warmup', phaseLabel: 'Warm-Up', objective: 'Quick fire warm-up quiz', activityType: 'speed_quiz', durationSeconds: 120 },
  { phase: 'prime', phaseLabel: 'Prime', objective: 'Vocabulary deep-dive #1 — Visual priming', activityType: null, durationSeconds: 150 },
  { phase: 'prime', phaseLabel: 'Prime', objective: 'Vocabulary deep-dive #2 — Visual priming', activityType: null, durationSeconds: 150 },
  { phase: 'mimic', phaseLabel: 'Mimic', objective: 'Pronunciation drill — record & compare', activityType: 'voice_record', durationSeconds: 150 },
  { phase: 'mimic', phaseLabel: 'Mimic', objective: 'Grammar pattern spotlight + repeat', activityType: 'voice_record', durationSeconds: 180 },
  { phase: 'produce', phaseLabel: 'Produce', objective: 'Sentence Unscramble', activityType: 'sentence_unscramble', durationSeconds: 180 },
  { phase: 'produce', phaseLabel: 'Produce', objective: 'Fill-in-the-Blanks challenge', activityType: 'fill_in_blanks', durationSeconds: 150 },
  { phase: 'produce', phaseLabel: 'Produce', objective: 'Listening comprehension', activityType: null, durationSeconds: 150 },
  { phase: 'cooloff', phaseLabel: 'Cool-Off', objective: 'Brain break mini-game', activityType: 'breathing_balloon', durationSeconds: 60 },
  { phase: 'cooloff', phaseLabel: 'Cool-Off', objective: 'Achievement unlock', activityType: null, durationSeconds: 90 },
  { phase: 'cooloff', phaseLabel: 'Cool-Off', objective: 'Next mission teaser', activityType: null, durationSeconds: 60 },
];

const PROFESSIONAL_SEQUENCE: Array<{
  phase: SlidePhase;
  phaseLabel: string;
  objective: string;
  activityType: string | null;
  durationSeconds: number;
}> = [
  { phase: 'warmup', phaseLabel: 'Context', objective: 'Scenario introduction', activityType: null, durationSeconds: 150 },
  { phase: 'warmup', phaseLabel: 'Context', objective: 'Learning objectives', activityType: null, durationSeconds: 120 },
  { phase: 'prime', phaseLabel: 'Input', objective: 'Key terminology #1 — Visual priming', activityType: 'vocabulary_expansion', durationSeconds: 180 },
  { phase: 'prime', phaseLabel: 'Input', objective: 'Key terminology #2 — Visual priming', activityType: 'vocabulary_expansion', durationSeconds: 180 },
  { phase: 'mimic', phaseLabel: 'Model', objective: 'Pronunciation & intonation drill', activityType: 'voice_record', durationSeconds: 180 },
  { phase: 'mimic', phaseLabel: 'Model', objective: 'Framework / structure review', activityType: null, durationSeconds: 180 },
  { phase: 'produce', phaseLabel: 'Application', objective: 'Case study analysis', activityType: 'case_study_analysis', durationSeconds: 240 },
  { phase: 'produce', phaseLabel: 'Application', objective: 'Business email reply', activityType: 'business_email_reply', durationSeconds: 210 },
  { phase: 'produce', phaseLabel: 'Application', objective: 'Executive choice scenario', activityType: 'executive_choice', durationSeconds: 180 },
  { phase: 'cooloff', phaseLabel: 'Summary', objective: 'Key outcomes review', activityType: null, durationSeconds: 120 },
  { phase: 'cooloff', phaseLabel: 'Summary', objective: 'Action items', activityType: null, durationSeconds: 90 },
  { phase: 'cooloff', phaseLabel: 'Summary', objective: 'Professional badge reveal', activityType: null, durationSeconds: 60 },
];

const SEQUENCES: Record<HubType, typeof PLAYGROUND_SEQUENCE> = {
  playground: PLAYGROUND_SEQUENCE,
  academy: ACADEMY_SEQUENCE,
  professional: PROFESSIONAL_SEQUENCE,
};

// ─── Anti-3D Flat 2.0 Style Wrappers ─────────────────────────────
const FLAT_STYLE_WRAPPERS: Record<HubType, string> = {
  playground: 'Minimalist 2D flat vector, friendly character design, solid pastel colors, clean bold outlines, white background, Engleuphoria Navy accents, isolated subject --ar 16:9',
  academy: 'Professional 2D illustration, clean geometric style, bold colors, modern infographic aesthetic, white background, Engleuphoria Navy accents --ar 16:9',
  professional: 'Minimalist editorial photography, luxury corporate aesthetic, shot on 35mm Leica, natural soft lighting, neutral tones, high-end professional stock style --ar 16:9',
};

const NEGATIVE_PROMPTS: Record<HubType, string> = {
  playground: 'No 3D, no render, no depth, no shadows, no gradients, no photorealism, no fuzzy textures, no Octane Render, no Unreal Engine, no claymation.',
  academy: 'No 3D, no render, no depth, no heavy shadows, no gradients, no photorealism, no cyberpunk neon, no holographic, no Octane Render.',
  professional: '', // editorial photography is appropriate
};

const HUB_LENS: Record<HubType, string> = {
  playground: 'Clean studio lighting, flat composition',
  academy: 'Even lighting, clean geometric composition',
  professional: 'Golden hour, wide angle, 35mm',
};

// ─── Image Prompt Builder (Flat 2.0) ──────────────────────────────
function buildImagePrompt(
  hub: HubType,
  topic: string,
  slideObjective: string,
  slideNumber: number,
  safeZone: string,
  accessoryName: string | null,
  levelName: string,
): string {
  const wrapper = FLAT_STYLE_WRAPPERS[hub];
  const lens = HUB_LENS[hub];
  const negative = NEGATIVE_PROMPTS[hub];

  const safeZoneInstruction = safeZone.includes('LEFT')
    ? 'Subject strictly on the LEFT third, negative space on right'
    : safeZone.includes('RIGHT')
    ? 'Subject strictly on the RIGHT third, negative space on left'
    : safeZone;

  const buildPrompt = (subject: string): string => {
    let prompt = `${subject}, ${safeZoneInstruction}, ${lens}, ${wrapper}. No text in image.`;
    if (negative) prompt += ` NEGATIVE: ${negative}`;
    return prompt;
  };

  // Slide 12: Special "Reward Reveal" close-up
  if (slideNumber === 12 && accessoryName) {
    return buildPrompt(
      `Close up of ${accessoryName}, floating with sparkle effects, flat 2D vector style, matching the lesson's color palette, topic: "${topic}"`
    );
  }

  // Slide 11: Accessory celebration
  if (slideNumber === 11 && accessoryName) {
    if (hub === 'playground') {
      return buildPrompt(`Pip the Penguin holding a glowing "${accessoryName}" trophy, celebration scene with confetti, 2D flat vector, topic: "${topic}"`);
    } else if (hub === 'academy') {
      return buildPrompt(`Achievement unlock: floating "${accessoryName}" reward with geometric particle effects, 2D illustration, topic: "${topic}"`);
    } else {
      return buildPrompt(`Elegant award ceremony: "${accessoryName}" certificate on a luxurious desk, topic: "${topic}"`);
    }
  }

  // Playground mascot intro slides (warmup)
  if (hub === 'playground' && slideNumber <= 2) {
    const position = slideNumber % 2 === 1 ? 'on the LEFT third of frame' : 'on the RIGHT third of frame';
    return buildPrompt(`Pip the Penguin ${position}, waving hello in a simple "${levelName}" scene, topic: "${topic}", 2D flat vector, clean white background`);
  }

  // Default prompts per hub
  const baseSubjects: Record<HubType, string> = {
    playground: `${slideObjective} in a friendly 2D "${topic}" scene, flat vector illustration, isolated elements, white background`,
    academy: `${slideObjective} in a clean geometric "${topic}" layout, 2D infographic style, white background`,
    professional: `${slideObjective} in an elegant modern "${topic}" setting, corporate environment`,
  };

  return buildPrompt(baseSubjects[hub]);
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
  if (activityType === 'voice_record') {
    return 'Subject centered, clean white background, 30% empty space at the bottom for recording UI';
  }
  if (activityType === 'mystery_silhouette') {
    return 'Subject centered as a dark silhouette, clean white background, mysterious mood';
  }
  if (activityType === 'breathing_balloon') {
    return 'Centered calming scene, soft colors, lots of white space, no complex elements';
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

    // Alternating mascot position for playground
    let mascotPosition: MascotPosition = 'hidden';
    if (hub === 'playground') {
      mascotPosition = slideNumber % 2 === 1 ? 'left' : 'right';
      // Hide mascot during intense activities
      if ((step.phase === 'produce' || step.phase === 'mimic') && step.activityType) {
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
