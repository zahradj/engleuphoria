/**
 * Shared shape for the Lesson Blueprint exchanged between
 * `generate-blueprint` (edge) → BlueprintReview (UI) → `generate-ppp-slides` (edge).
 */
export interface BlueprintVocabItem {
  word: string;
  definition: string;
  example: string;
}

export interface LessonBlueprint {
  lesson_title: string;
  target_vocabulary: BlueprintVocabItem[];
  target_grammar_rule: string;
  grammar_explanation: string;
  reading_passage_summary: string;
  final_speaking_mission: string;
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
