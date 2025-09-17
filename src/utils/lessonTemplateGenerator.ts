import { LessonSlides, Slide } from '@/types/slides';

export interface LessonTemplateConfig {
  title: string;
  topic: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  module: number;
  lesson: number;
  learningObjectives: string[];
  vocabularyFocus: string[];
  grammarFocus: string[];
  duration: number;
  theme?: 'mist-blue' | 'sage-sand' | 'default';
}

export interface SlideTemplate {
  type: string;
  title: string;
  content: string;
  instructions?: string;
  interactiveElement?: 'song' | 'drawing' | 'matching' | 'quiz' | 'speaking';
  media?: {
    type: 'audio' | 'image' | 'video';
    description: string;
  };
}

/**
 * Generates a complete lesson deck based on the reference "Hello Adventures" format
 */
export function generateLessonFromTemplate(config: LessonTemplateConfig): LessonSlides {
  const slides: Slide[] = [];
  
  // Slide 1: Welcome/Warmup with song element (like reference)
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-welcome`,
    type: 'warmup',
    prompt: `🎵 Welcome to ${config.title}!`,
    instructions: `👋\n\nLet's start with a fun ${config.topic} activity!\n\nGet ready to learn and have fun!`,
    media: {
      type: 'audio',
      url: '',
      alt: `Welcome song for ${config.title}`,
      imagePrompt: `Cheerful welcome scene with musical notes and happy children learning ${config.topic}`
    },
    accessibility: {
      screenReaderText: `Welcome to ${config.title} lesson`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 1
  });

  // Slide 2: Learning Objectives (matching reference format)
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-objectives`,
    type: 'target_language',
    prompt: '🎯 Learning Objectives:',
    instructions: config.learningObjectives.map(obj => `• ${obj}`).join('\n'),
    accessibility: {
      screenReaderText: `Learning objectives for ${config.title}`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 2
  });

  // Slide 3: Vocabulary Preview
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-vocabulary`,
    type: 'vocabulary_preview',
    prompt: '📚 New Words Today',
    instructions: 'Let\'s learn some new words together!',
    vocabulary: config.vocabularyFocus,
    media: {
      type: 'image',
      url: '',
      alt: `Vocabulary illustration for ${config.topic}`,
      imagePrompt: `Educational illustration showing vocabulary words for ${config.topic}, colorful and engaging for children`
    },
    accessibility: {
      screenReaderText: `Vocabulary preview for ${config.topic}`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 3
  });

  // Slide 4: Interactive Matching Activity
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-match`,
    type: 'match',
    prompt: `🎯 Match the ${config.topic} Words`,
    instructions: 'Match each word with its picture or meaning.',
    matchPairs: generateMatchPairs(config.vocabularyFocus),
    timeLimit: 120,
    accessibility: {
      screenReaderText: `Matching activity for ${config.topic} vocabulary`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 4
  });

  // Slide 5: Grammar Focus
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-grammar`,
    type: 'grammar_focus',
    prompt: '⚡ Grammar Time!',
    instructions: `Today we practice: ${config.grammarFocus.join(', ')}`,
    media: {
      type: 'image',
      url: '',
      alt: `Grammar examples for ${config.topic}`,
      imagePrompt: `Grammar examples and sentence structures for ${config.topic}, visual and clear for ESL learners`
    },
    accessibility: {
      screenReaderText: `Grammar focus for ${config.title}`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 5
  });

  // Slide 6: Listening Activity
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-listening`,
    type: 'listening_comprehension',
    prompt: '👂 Listen and Understand',
    instructions: 'Listen carefully and answer the questions.',
    media: {
      type: 'audio',
      url: '',
      alt: `Listening exercise for ${config.topic}`,
      imagePrompt: `People listening and understanding, educational scene for ${config.topic}`
    },
    accessibility: {
      screenReaderText: `Listening comprehension for ${config.topic}`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 6
  });

  // Slide 7: Multiple Choice Quiz
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-quiz`,
    type: 'accuracy_mcq',
    prompt: '🧠 Quick Quiz!',
    instructions: 'Choose the correct answer.',
    options: generateQuizOptions(config.vocabularyFocus[0] || 'word'),
    correct: 'opt-a',
    timeLimit: 60,
    accessibility: {
      screenReaderText: `Multiple choice quiz for ${config.topic}`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 7
  });

  // Slide 8: Drawing/Creative Activity (like the reference "Draw" button)
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-draw`,
    type: 'picture_description',
    prompt: '✏️ Draw and Describe',
    instructions: `Draw something related to ${config.topic} and describe it!`,
    media: {
      type: 'image',
      url: '',
      alt: `Drawing activity for ${config.topic}`,
      imagePrompt: `Creative drawing and art activity scene related to ${config.topic}, inspiring and fun`
    },
    accessibility: {
      screenReaderText: `Drawing and description activity for ${config.topic}`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 8
  });

  // Slide 9: Speaking Practice
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-speaking`,
    type: 'pronunciation_shadow',
    prompt: '🗣️ Speaking Practice',
    instructions: `Practice saying words about ${config.topic}. Repeat after me!`,
    vocabulary: config.vocabularyFocus,
    accessibility: {
      screenReaderText: `Speaking practice for ${config.topic}`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 9
  });

  // Slide 10: Final Activity & Next Adventure (matching reference "Next Adventure" button)
  slides.push({
    id: `${config.topic.toLowerCase().replace(/\s+/g, '-')}-complete`,
    type: 'exit_check',
    prompt: '🎉 Great Job!',
    instructions: `You've learned about ${config.topic}!\n\nReady for your next adventure?`,
    media: {
      type: 'image',
      url: '',
      alt: `Celebration for completing ${config.topic} lesson`,
      imagePrompt: `Celebration scene with confetti and happy students completing ${config.topic} lesson`
    },
    accessibility: {
      screenReaderText: `Lesson completion for ${config.title}`,
      highContrast: false,
      largeText: false
    },
    orderIndex: 10
  });

  return {
    version: '2.0',
    theme: config.theme || 'mist-blue',
    durationMin: config.duration,
    total_slides: slides.length,
    metadata: {
      CEFR: config.cefrLevel,
      module: config.module,
      lesson: config.lesson,
      targets: [config.topic.toLowerCase(), ...config.vocabularyFocus],
      weights: { accuracy: 70, fluency: 30 }
    },
    slides,
    slideOrder: slides.map(slide => slide.id)
  };
}

function generateMatchPairs(vocabulary: string[]) {
  return vocabulary.slice(0, 4).map((word, index) => ({
    id: `pair${index + 1}`,
    left: word,
    right: `Definition or example for ${word}`,
    leftImage: `https://images.unsplash.com/photo-150691${5000 + index}?w=150`
  }));
}

function generateQuizOptions(topic: string) {
  return [
    { id: 'opt-a', text: `Correct answer about ${topic}`, isCorrect: true },
    { id: 'opt-b', text: `Incorrect option 1`, isCorrect: false },
    { id: 'opt-c', text: `Incorrect option 2`, isCorrect: false },
    { id: 'opt-d', text: `Incorrect option 3`, isCorrect: false }
  ];
}

/**
 * Pre-made lesson templates based on common ESL topics
 */
export const lessonTemplates = {
  colors: {
    title: "Colors and Rainbows",
    topic: "Colors",
    cefrLevel: 'A1' as const,
    learningObjectives: [
      "Name basic colors in English",
      "Describe objects using colors",
      "Ask and answer 'What color is it?'"
    ],
    vocabularyFocus: ["red", "blue", "green", "yellow", "orange", "purple", "pink", "black", "white"],
    grammarFocus: ["'What color is...?'", "Color adjectives", "Simple present tense"]
  },
  
  animals: {
    title: "Amazing Animals",
    topic: "Animals",
    cefrLevel: 'A1' as const,
    learningObjectives: [
      "Name common animals",
      "Describe where animals live",
      "Make animal sounds in English"
    ],
    vocabularyFocus: ["cat", "dog", "bird", "fish", "rabbit", "elephant", "lion", "bear"],
    grammarFocus: ["Animal names", "Habitat vocabulary", "Simple descriptions"]
  },

  family: {
    title: "My Family Tree",
    topic: "Family",
    cefrLevel: 'A1' as const,
    learningObjectives: [
      "Name family members",
      "Describe family relationships",
      "Talk about family size"
    ],
    vocabularyFocus: ["mother", "father", "sister", "brother", "grandmother", "grandfather", "baby"],
    grammarFocus: ["Family vocabulary", "Possessive pronouns", "'I have...' structure"]
  },

  food: {
    title: "Yummy Food Adventures",
    topic: "Food",
    cefrLevel: 'A1' as const,
    learningObjectives: [
      "Name common foods",
      "Express food preferences",
      "Use polite expressions for meals"
    ],
    vocabularyFocus: ["apple", "banana", "bread", "milk", "cheese", "chicken", "rice", "water"],
    grammarFocus: ["Food vocabulary", "'I like/don't like'", "Polite requests"]
  }
};

/**
 * Generate a complete lesson from a pre-made template
 */
export function generateFromTemplate(
  templateName: keyof typeof lessonTemplates,
  module: number,
  lesson: number,
  duration: number = 30
): LessonSlides {
  const template = lessonTemplates[templateName];
  return generateLessonFromTemplate({
    ...template,
    module,
    lesson,
    duration
  });
}