/**
 * Shared shape for the Lesson Blueprint exchanged between
 * `generate-blueprint` (edge) → BlueprintReview (UI) → `generate-ppp-slides` (edge).
 */
export interface BlueprintVocabItem {
  word: string;
  definition: string;
  example: string;
}

/** Three target audiences. Drives prompts, safety bouncer, CEFR floor/ceiling, UI theme. */
export type TargetHub = 'Playground' | 'Academy' | 'Success';

/** Three scientifically-grounded pedagogical frameworks the AI picks between. */
export type PedagogicalFramework = 'Discovery' | 'TaskBased' | 'Immersion';

/** Canonical lesson phases. The blueprint's `phases` array selects an ordered subset of these. */
export type LessonPhase =
  | 'Vocabulary'
  | 'Reading'
  | 'Comprehension'
  | 'Grammar'
  | 'Speaking'
  | 'Writing';

/** Default phase sequence per framework. Used when the user overrides the AI's choice in the UI. */
export const FRAMEWORK_DEFAULTS: Record<PedagogicalFramework, LessonPhase[]> = {
  // Discovery (Inductive): hook → reading → guess the rule → grammar → vocab → production
  Discovery: ['Reading', 'Comprehension', 'Grammar', 'Vocabulary', 'Speaking', 'Writing'],
  // Task-Based: try & fail → vocab toolbox → grammar strategy → succeed
  TaskBased: ['Speaking', 'Vocabulary', 'Grammar', 'Reading', 'Comprehension', 'Writing'],
  // Classic Immersion: visual vocab → story → comprehension → guided speaking
  Immersion: ['Vocabulary', 'Reading', 'Comprehension', 'Speaking', 'Grammar', 'Writing'],
};

export const FRAMEWORK_LABELS: Record<PedagogicalFramework, string> = {
  Discovery: 'The Discovery Model (Inductive)',
  TaskBased: 'The Task-Based Model (TBL)',
  Immersion: 'The Classic Immersion Model',
};

export const FRAMEWORK_BLURBS: Record<PedagogicalFramework, string> = {
  Discovery:
    'Best for tricky grammar. Students meet the structure in context, then puzzle out the rule before formal explanation.',
  TaskBased:
    'Best for adult/professional learners. Students attempt a real-world task, fail productively, then learn the language tools to succeed.',
  Immersion:
    'Best for young learners and beginners. Visual vocabulary first, then story, comprehension and guided production.',
};

export interface LessonBlueprint {
  lesson_title: string;
  target_vocabulary: BlueprintVocabItem[];
  target_grammar_rule: string;
  grammar_explanation: string;
  reading_passage_summary: string;
  final_speaking_mission: string;
  /** Hub the lesson targets — drives every downstream prompt. Optional for backwards compat. */
  target_hub?: TargetHub;
  /** AI-selected pedagogical framework (with teacher override). */
  pedagogical_framework?: PedagogicalFramework;
  /** Short rationale explaining the AI's framework choice. */
  framework_rationale?: string;
  /** Ordered phase sequence the slide generator MUST follow. */
  phases?: LessonPhase[];
}

export const isBlueprintReady = (b: LessonBlueprint | null): b is LessonBlueprint => {
  if (!b) return false;
  return (
    !!b.target_grammar_rule.trim() &&
    !!b.reading_passage_summary.trim() &&
    !!b.final_speaking_mission.trim() &&
    Array.isArray(b.target_vocabulary) &&
    b.target_vocabulary.filter((v) => v.word.trim()).length >= 3
  );
};
