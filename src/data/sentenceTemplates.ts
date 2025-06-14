
import { SentenceTemplate } from '@/types/curriculumTypes';

export const SENTENCE_TEMPLATES: SentenceTemplate[] = [
  // Level 1: Foundation Sentences
  {
    id: "foundation_1",
    level: 1,
    pattern: "Subject + Verb",
    example: "I study",
    visualAid: "Visual block diagram showing subject and verb connection",
    practiceExercises: ["Complete: I ___", "Choose correct verb", "Match subjects with verbs"]
  },
  {
    id: "foundation_2", 
    level: 1,
    pattern: "Subject + Verb + Object",
    example: "I study English",
    visualAid: "Three-block visual showing S-V-O relationship",
    practiceExercises: ["Add objects to sentences", "Reorder words", "Picture-sentence matching"]
  },
  {
    id: "foundation_3",
    level: 1,
    pattern: "Subject + Verb + Object + Time",
    example: "I study English daily",
    visualAid: "Four-block visual with time indicator",
    practiceExercises: ["Add time expressions", "Daily routine sentences", "Schedule completion"]
  },
  // Level 2: Enhanced Sentences
  {
    id: "enhanced_1",
    level: 2,
    pattern: "Adjective + Noun combinations",
    example: "I study difficult English daily",
    visualAid: "Color-coded adjective placement diagram",
    practiceExercises: ["Adjective insertion", "Descriptive expansion", "Comparison exercises"]
  },
  {
    id: "enhanced_2",
    level: 2,
    pattern: "Adverb placement",
    example: "I study difficult English carefully daily",
    visualAid: "Adverb positioning flowchart",
    practiceExercises: ["Adverb placement practice", "Manner expression", "Intensity exercises"]
  },
  // Level 3: Complex Sentences
  {
    id: "complex_1",
    level: 3,
    pattern: "Compound sentences with conjunctions",
    example: "I study English daily because I want to improve",
    visualAid: "Connection bridge diagram showing cause-effect",
    practiceExercises: ["Join sentences", "Cause-effect matching", "Reason expression"]
  },
  {
    id: "complex_2",
    level: 3,
    pattern: "Relative clauses",
    example: "I study English, which is challenging, daily",
    visualAid: "Sentence tree showing main and relative clauses",
    practiceExercises: ["Clause insertion", "Relative pronoun practice", "Description expansion"]
  }
];
