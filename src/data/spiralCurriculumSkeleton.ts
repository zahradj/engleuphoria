/**
 * Spiral Curriculum Skeleton — The Dependency Tree
 * 
 * This is the "Hard Schema" that forces the AI generator to produce
 * a PROGRESSIVE curriculum rather than random independent lessons.
 * 
 * Each unit defines:
 *   - anchor phoneme (the new sound introduced)
 *   - grammar goal (the structural target)
 *   - prerequisite unit (what must be mastered first)
 *   - skills mix (% allocation of L/S/R/W — Writing increases over time)
 *   - vocabulary constraints (5 words using current phoneme + 1 review word)
 *   - lesson cycle (Discovery → Ladder → Bridge)
 * 
 * PROGRESSION RULES:
 *   Phonics:  Individual Sounds → Blends → Digraphs
 *   Grammar:  Nouns → "It is a..." → "Is it a...?" → Plurals → Adjectives
 *   Skills:   Listening/Speaking (80%) → Reading (growing) → Writing (growing)
 */

export interface SpiralUnit {
  unit: number;
  theme: string;
  phonicsGoal: string;        // IPA symbol
  phonicsCategory: 'consonant' | 'short_vowel' | 'long_vowel' | 'blend' | 'digraph';
  grammarGoal: string;
  prerequisiteUnit: number | null;
  skillsMix: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
  vocabularyConstraints: {
    newWords: number;
    reviewWordsFromPrevUnit: number;
    phonemeFilter: string;     // words must contain this sound
  };
  lessons: SpiralLessonTemplate[];
}

export interface SpiralLessonTemplate {
  id: string;
  focus: string;
  cycleType: 'discovery' | 'ladder' | 'bridge';
  activities: string[];
  skillTags: ('L' | 'S' | 'R' | 'W')[];
}

// ─── The 10-Unit Progressive Skeleton (Beginner/Kids) ─────────────
export const BEGINNER_KIDS_SKELETON: SpiralUnit[] = [
  {
    unit: 1,
    theme: 'The Beginning',
    phonicsGoal: '/s/',
    phonicsCategory: 'consonant',
    grammarGoal: 'Noun Identification (It is a...)',
    prerequisiteUnit: null,
    skillsMix: { listening: 40, speaking: 40, reading: 15, writing: 5 },
    vocabularyConstraints: { newWords: 5, reviewWordsFromPrevUnit: 0, phonemeFilter: 's' },
    lessons: [
      { id: '1.1', focus: 'Sound Recognition /s/', cycleType: 'discovery', activities: ['Phonetic Slider', 'Listening Spotting', 'Sound Sort'], skillTags: ['L', 'S'] },
      { id: '1.2', focus: 'Word Integration', cycleType: 'ladder', activities: ['Grammar Blocks: "It is a ___"', 'Flat 2.0 Mapping', 'Word Builder'], skillTags: ['R', 'W'] },
      { id: '1.3', focus: 'Sentence Production', cycleType: 'bridge', activities: ['Tracing Letter S', 'Speaking: "What is it?"', 'Mastery Check'], skillTags: ['S', 'W'] },
    ],
  },
  {
    unit: 2,
    theme: 'Action & Movement',
    phonicsGoal: '/m/',
    phonicsCategory: 'consonant',
    grammarGoal: 'Article Usage (A vs AN)',
    prerequisiteUnit: 1,
    skillsMix: { listening: 30, speaking: 30, reading: 25, writing: 15 },
    vocabularyConstraints: { newWords: 5, reviewWordsFromPrevUnit: 2, phonemeFilter: 'm' },
    lessons: [
      { id: '2.1', focus: 'Review /s/ + Intro /m/', cycleType: 'discovery', activities: ['Bridge Retrieval Quiz', 'Contrastive Listening', 'Phoneme Tap'], skillTags: ['L', 'S'] },
      { id: '2.2', focus: 'Complex Vocabulary', cycleType: 'ladder', activities: ['Ghost Vector Retrieval', 'Article Picker: a vs an', 'Sentence Ladder'], skillTags: ['R', 'W'] },
      { id: '2.3', focus: 'Structural Writing', cycleType: 'bridge', activities: ['Block Snapping', 'Full Word Tracing', 'Speaking Production'], skillTags: ['W', 'S'] },
    ],
  },
  {
    unit: 3,
    theme: 'My World',
    phonicsGoal: '/t/',
    phonicsCategory: 'consonant',
    grammarGoal: 'Plural -s (cats, mats)',
    prerequisiteUnit: 2,
    skillsMix: { listening: 25, speaking: 30, reading: 25, writing: 20 },
    vocabularyConstraints: { newWords: 5, reviewWordsFromPrevUnit: 2, phonemeFilter: 't' },
    lessons: [
      { id: '3.1', focus: 'Review /m/ + Intro /t/', cycleType: 'discovery', activities: ['Bridge Retrieval Quiz', 'Sound Sort /s/ vs /m/ vs /t/', 'Odd One Out'], skillTags: ['L', 'S'] },
      { id: '3.2', focus: 'Plural Nouns', cycleType: 'ladder', activities: ['Grammar Blocks: "They are ___s"', 'Picture Label Plural', 'Sentence Transform'], skillTags: ['R', 'W'] },
      { id: '3.3', focus: 'Question Formation', cycleType: 'bridge', activities: ['Speaking: "Are they ___s?"', 'Letter Hunt', 'Mastery Check'], skillTags: ['S', 'W'] },
    ],
  },
  {
    unit: 4,
    theme: 'Colors & Shapes',
    phonicsGoal: '/æ/',
    phonicsCategory: 'short_vowel',
    grammarGoal: 'Adjective + Noun (a big cat)',
    prerequisiteUnit: 3,
    skillsMix: { listening: 20, speaking: 30, reading: 25, writing: 25 },
    vocabularyConstraints: { newWords: 5, reviewWordsFromPrevUnit: 2, phonemeFilter: 'a' },
    lessons: [
      { id: '4.1', focus: 'Review /t/ + Intro /æ/', cycleType: 'discovery', activities: ['Bridge Retrieval Quiz', 'Minimal Pairs: cat/cut', 'Phonics Slider'], skillTags: ['L', 'S'] },
      { id: '4.2', focus: 'Adjective Placement', cycleType: 'ladder', activities: ['Grammar Blocks: "It is a ___ ___"', 'Sentence Ladder +adjective', 'Word Builder'], skillTags: ['R', 'W'] },
      { id: '4.3', focus: 'Descriptive Speaking', cycleType: 'bridge', activities: ['Speaking: "What color is it?"', 'Tactile Tracing', 'Mastery Check'], skillTags: ['S', 'W'] },
    ],
  },
  {
    unit: 5,
    theme: 'Food & Drinks',
    phonicsGoal: '/p/',
    phonicsCategory: 'consonant',
    grammarGoal: 'Question: "Do you like ___?"',
    prerequisiteUnit: 4,
    skillsMix: { listening: 20, speaking: 30, reading: 25, writing: 25 },
    vocabularyConstraints: { newWords: 5, reviewWordsFromPrevUnit: 2, phonemeFilter: 'p' },
    lessons: [
      { id: '5.1', focus: 'Review /æ/ + Intro /p/', cycleType: 'discovery', activities: ['Bridge Retrieval Quiz', 'Sound Spotting', 'Phoneme Tap'], skillTags: ['L', 'S'] },
      { id: '5.2', focus: 'Question Building', cycleType: 'ladder', activities: ['Grammar Blocks: "Do you like ___?"', 'Sentence Transform', 'Picture Label'], skillTags: ['R', 'W'] },
      { id: '5.3', focus: 'Real Conversation', cycleType: 'bridge', activities: ['Dialogue Practice', 'Word Tracing', 'Mastery Check'], skillTags: ['S', 'W'] },
    ],
  },
  {
    unit: 6,
    theme: 'Animals',
    phonicsGoal: '/ɪ/',
    phonicsCategory: 'short_vowel',
    grammarGoal: 'Has / Have (It has legs)',
    prerequisiteUnit: 5,
    skillsMix: { listening: 15, speaking: 25, reading: 30, writing: 30 },
    vocabularyConstraints: { newWords: 5, reviewWordsFromPrevUnit: 2, phonemeFilter: 'i' },
    lessons: [
      { id: '6.1', focus: 'Review /p/ + Intro /ɪ/', cycleType: 'discovery', activities: ['Bridge Retrieval Quiz', 'Minimal Pairs: pin/pen', 'Sound Sort'], skillTags: ['L', 'S'] },
      { id: '6.2', focus: 'Has/Have Structure', cycleType: 'ladder', activities: ['Grammar Blocks: "It has ___"', 'Sentence Ladder + has/have', 'Odd One Out'], skillTags: ['R', 'W'] },
      { id: '6.3', focus: 'Animal Description', cycleType: 'bridge', activities: ['Speaking: "Does it have ___?"', 'Letter Hunt', 'Mastery Check'], skillTags: ['S', 'W'] },
    ],
  },
  {
    unit: 7,
    theme: 'My Family',
    phonicsGoal: '/n/',
    phonicsCategory: 'consonant',
    grammarGoal: 'Possessives (my, your, his, her)',
    prerequisiteUnit: 6,
    skillsMix: { listening: 15, speaking: 25, reading: 30, writing: 30 },
    vocabularyConstraints: { newWords: 5, reviewWordsFromPrevUnit: 2, phonemeFilter: 'n' },
    lessons: [
      { id: '7.1', focus: 'Review /ɪ/ + Intro /n/', cycleType: 'discovery', activities: ['Bridge Retrieval Quiz', 'Sound Spotting', 'Phonics Slider'], skillTags: ['L', 'S'] },
      { id: '7.2', focus: 'Possessive Pronouns', cycleType: 'ladder', activities: ['Grammar Blocks: "This is my ___"', 'Article Picker: my/your', 'Sentence Transform'], skillTags: ['R', 'W'] },
      { id: '7.3', focus: 'Family Presentation', cycleType: 'bridge', activities: ['Speaking: "Who is this?"', 'Tactile Tracing', 'Mastery Check'], skillTags: ['S', 'W'] },
    ],
  },
  {
    unit: 8,
    theme: 'At Home',
    phonicsGoal: '/ɒ/',
    phonicsCategory: 'short_vowel',
    grammarGoal: 'Prepositions (in, on, under)',
    prerequisiteUnit: 7,
    skillsMix: { listening: 10, speaking: 25, reading: 30, writing: 35 },
    vocabularyConstraints: { newWords: 5, reviewWordsFromPrevUnit: 2, phonemeFilter: 'o' },
    lessons: [
      { id: '8.1', focus: 'Review /n/ + Intro /ɒ/', cycleType: 'discovery', activities: ['Bridge Retrieval Quiz', 'Minimal Pairs: hot/hat', 'Phoneme Tap'], skillTags: ['L', 'S'] },
      { id: '8.2', focus: 'Preposition Sentences', cycleType: 'ladder', activities: ['Grammar Blocks: "The ___ is on the ___"', 'Picture Label + prep', 'Word Builder'], skillTags: ['R', 'W'] },
      { id: '8.3', focus: 'Room Description', cycleType: 'bridge', activities: ['Speaking: "Where is the ___?"', 'Letter Hunt', 'Mastery Check'], skillTags: ['S', 'W'] },
    ],
  },
  {
    unit: 9,
    theme: 'Daily Routine',
    phonicsGoal: '/ʃ/',
    phonicsCategory: 'digraph',
    grammarGoal: 'Present Simple (I wake up, I eat)',
    prerequisiteUnit: 8,
    skillsMix: { listening: 10, speaking: 20, reading: 30, writing: 40 },
    vocabularyConstraints: { newWords: 5, reviewWordsFromPrevUnit: 2, phonemeFilter: 'sh' },
    lessons: [
      { id: '9.1', focus: 'Review /ɒ/ + Intro /ʃ/', cycleType: 'discovery', activities: ['Bridge Retrieval Quiz', 'Sound Sort: /s/ vs /ʃ/', 'Mouth Mirror'], skillTags: ['L', 'S'] },
      { id: '9.2', focus: 'Routine Sentences', cycleType: 'ladder', activities: ['Grammar Blocks: "I ___ every day"', 'Sentence Ladder + time', 'Sentence Transform'], skillTags: ['R', 'W'] },
      { id: '9.3', focus: 'Describing Your Day', cycleType: 'bridge', activities: ['Speaking: "What do you do?"', 'Paragraph Writing', 'Mastery Check'], skillTags: ['S', 'W'] },
    ],
  },
  {
    unit: 10,
    theme: 'The Big Review',
    phonicsGoal: '/tʃ/',
    phonicsCategory: 'digraph',
    grammarGoal: 'Review All: Nouns → Questions → Descriptions',
    prerequisiteUnit: 9,
    skillsMix: { listening: 10, speaking: 20, reading: 30, writing: 40 },
    vocabularyConstraints: { newWords: 3, reviewWordsFromPrevUnit: 5, phonemeFilter: 'ch' },
    lessons: [
      { id: '10.1', focus: 'Phonics Grand Review', cycleType: 'discovery', activities: ['All-Sound Sort', 'Minimal Pairs Marathon', 'Contrastive Listening'], skillTags: ['L', 'S'] },
      { id: '10.2', focus: 'Grammar Grand Review', cycleType: 'ladder', activities: ['Grammar Blocks: all patterns', 'Sentence Transform: all types', 'Writing Task'], skillTags: ['R', 'W'] },
      { id: '10.3', focus: 'Final Presentation', cycleType: 'bridge', activities: ['Speaking: free production', 'Portfolio Review', 'Celebration'], skillTags: ['S', 'W'] },
    ],
  },
];

// ─── Helper: Get the skeleton for a given hub/level ─────────────────
export type SkeletonKey = 'beginner_kids' | 'beginner_teens' | 'beginner_adults';

export function getSpiralSkeleton(ageGroup: string, _level: string): SpiralUnit[] {
  // For now, return the kids skeleton as the base template.
  // The AI will adapt the themes/vocabulary for teens and adults.
  return BEGINNER_KIDS_SKELETON;
}

// ─── Helper: Build dependency context string for AI ────────────────
export function buildDependencyContext(
  skeleton: SpiralUnit[],
  currentUnitNumber: number,
): string {
  const currentUnit = skeleton.find(u => u.unit === currentUnitNumber);
  if (!currentUnit) return '';

  const prevUnit = currentUnit.prerequisiteUnit
    ? skeleton.find(u => u.unit === currentUnit.prerequisiteUnit)
    : null;

  let context = `\n--- SPIRAL DEPENDENCY CONTEXT ---\n`;
  context += `Current Unit: ${currentUnit.unit} — "${currentUnit.theme}"\n`;
  context += `Anchor Phoneme: ${currentUnit.phonicsGoal} (${currentUnit.phonicsCategory})\n`;
  context += `Grammar Goal: ${currentUnit.grammarGoal}\n`;
  context += `Skills Mix: L=${currentUnit.skillsMix.listening}% S=${currentUnit.skillsMix.speaking}% R=${currentUnit.skillsMix.reading}% W=${currentUnit.skillsMix.writing}%\n`;
  context += `Vocabulary: ${currentUnit.vocabularyConstraints.newWords} new words with "${currentUnit.vocabularyConstraints.phonemeFilter}" sound`;

  if (prevUnit) {
    context += `\n\n--- PREREQUISITE UNIT ${prevUnit.unit}: "${prevUnit.theme}" ---\n`;
    context += `Previous Phoneme: ${prevUnit.phonicsGoal}\n`;
    context += `Previous Grammar: ${prevUnit.grammarGoal}\n`;
    context += `Review Words Required: ${currentUnit.vocabularyConstraints.reviewWordsFromPrevUnit} words from Unit ${prevUnit.unit}\n`;
    context += `Bridge Retrieval: MANDATORY 5-question pop quiz from Unit ${prevUnit.unit} content\n`;
  }

  context += `\n--- LESSON CYCLE ---\n`;
  currentUnit.lessons.forEach(l => {
    context += `  ${l.id} [${l.cycleType}] — ${l.focus} | Skills: ${l.skillTags.join(',')} | Activities: ${l.activities.join(', ')}\n`;
  });

  return context;
}

// ─── Helper: Build full curriculum map context ─────────────────────
export function buildFullCurriculumMapContext(skeleton: SpiralUnit[]): string {
  let context = `\n══════════════════════════════════════════\n`;
  context += `  SPIRAL CURRICULUM MAP — 10-Unit Dependency Tree\n`;
  context += `══════════════════════════════════════════\n\n`;

  context += `PROGRESSION RULES (MANDATORY):\n`;
  context += `  Phonics:  Individual Sounds → Blends → Digraphs\n`;
  context += `  Grammar:  Nouns → "It is a..." → "Is it a...?" → Plurals → Adjectives → Has/Have → Possessives → Prepositions → Present Simple\n`;
  context += `  Skills:   Writing % MUST increase from 5% (Unit 1) to 40% (Unit 10)\n`;
  context += `  Review:   Unit N Lesson 1 MUST include Bridge Retrieval from Unit N-1\n\n`;

  skeleton.forEach(unit => {
    const prereq = unit.prerequisiteUnit ? `← requires Unit ${unit.prerequisiteUnit}` : '(start)';
    context += `Unit ${unit.unit}: "${unit.theme}" ${prereq}\n`;
    context += `  Phoneme: ${unit.phonicsGoal} | Grammar: ${unit.grammarGoal}\n`;
    context += `  Skills: L=${unit.skillsMix.listening}% S=${unit.skillsMix.speaking}% R=${unit.skillsMix.reading}% W=${unit.skillsMix.writing}%\n`;
    unit.lessons.forEach(l => {
      context += `    ${l.id} [${l.cycleType}] ${l.focus} (${l.skillTags.join(',')})\n`;
    });
    context += `\n`;
  });

  return context;
}
