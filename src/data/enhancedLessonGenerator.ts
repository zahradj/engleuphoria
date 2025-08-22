import { LessonSlides, Slide } from '@/types/slides';

interface LessonContent {
  title: string;
  topic: string;
  vocabulary: string[];
  grammar: string[];
  objectives: string[];
  level: string;
  module: number;
  lesson: number;
}

const lessonContents: Record<string, LessonContent> = {
  'greetings-introductions': {
    title: 'Greetings and Introductions',
    topic: 'greetings and introductions',
    vocabulary: ['hello', 'hi', 'goodbye', 'bye', 'nice', 'meet', 'name', 'pleased'],
    grammar: ['My name is...', 'What is your name?', 'Nice to meet you'],
    objectives: ['greet people politely', 'introduce yourself', 'ask for names', 'say goodbye'],
    level: 'A1',
    module: 1,
    lesson: 1
  },
  'alphabet-spelling': {
    title: 'The Alphabet and Spelling Names',
    topic: 'alphabet and spelling',
    vocabulary: ['letter', 'spell', 'alphabet', 'capital', 'small', 'first', 'last', 'family'],
    grammar: ['How do you spell...?', 'My first name is...', 'Capital letter A'],
    objectives: ['spell names correctly', 'use the alphabet', 'ask about spelling', 'write names'],
    level: 'A1',
    module: 1,
    lesson: 2
  },
  'numbers-age': {
    title: 'Numbers 1–20 and Age',
    topic: 'numbers and age',
    vocabulary: ['one', 'two', 'three', 'four', 'five', 'age', 'years', 'old'],
    grammar: ['I am ... years old', 'How old are you?', 'She is ten'],
    objectives: ['count from 1 to 20', 'ask about age', 'say your age', 'use numbers'],
    level: 'A1',
    module: 1,
    lesson: 3
  }
};

export const createEnhancedLessonSlides = (lessonKey: string): LessonSlides | null => {
  const content = lessonContents[lessonKey];
  if (!content) return null;

  const slides: Slide[] = [
    // ========== WARM-UP (3 SLIDES) ==========
    {
      id: "slide-1",
      type: "warmup",
      prompt: `Welcome to ${content.title}!`,
      instructions: "Let's start with an energizing warm-up! Look around and greet your classmates using different ways to say hello!",
      accessibility: {
        screenReaderText: "Warm-up greeting activity to start the lesson",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-2",
      type: "warmup",
      prompt: "Quick Brain Warm-up",
      instructions: `Think about what you already know about ${content.topic}. Share one word or idea with a partner!`,
      accessibility: {
        screenReaderText: "Brain activation exercise about today's topic",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-3",
      type: "warmup",
      prompt: "Energy Check!",
      instructions: "How are you feeling today? Show me with your body! Stand up if you're excited, sit if you're calm, stretch if you're tired!",
      accessibility: {
        screenReaderText: "Physical energy check-in activity",
        highContrast: false,
        largeText: false
      }
    },

    // ========== INTRODUCTION (2 SLIDES) ==========
    {
      id: "slide-4",
      type: "vocabulary_preview",
      prompt: `Today's Lesson: ${content.title}`,
      instructions: `Today we will learn about ${content.topic}. By the end of this lesson, you will be able to: ${content.objectives.join(', ')}.`,
      accessibility: {
        screenReaderText: "Lesson objectives and goals overview",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-5",
      type: "target_language",
      prompt: "What We'll Discover Today",
      instructions: `Key words: ${content.vocabulary.slice(0, 6).join(', ')}. Grammar focus: ${content.grammar[0]}. Get ready for an exciting learning journey!`,
      accessibility: {
        screenReaderText: "Preview of key vocabulary and grammar",
        highContrast: false,
        largeText: false
      }
    },

    // ========== PRESENTATION/INPUT (6 SLIDES) ==========
    {
      id: "slide-6",
      type: "vocabulary_preview",
      prompt: "New Vocabulary",
      instructions: `Let's learn these important words: ${content.vocabulary.join(', ')}. Listen carefully and repeat after me.`,
      accessibility: {
        screenReaderText: "New vocabulary presentation with pronunciation practice",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-7",
      type: "vocabulary_preview",
      prompt: "Vocabulary in Context",
      instructions: getContextInstructions(lessonKey, content.vocabulary),
      accessibility: {
        screenReaderText: "Vocabulary words shown in context sentences",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-8",
      type: "grammar_focus",
      prompt: "Grammar Focus",
      instructions: `Today's grammar pattern: ${content.grammar[0]}. Look at these examples: ${getGrammarExamples(lessonKey)}`,
      accessibility: {
        screenReaderText: "Grammar pattern introduction with examples",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-9",
      type: "sentence_builder",
      prompt: "Building Sentences",
      instructions: `Let's build sentences together! Example: ${getSentenceExample(lessonKey)}. Watch how the pieces fit together!`,
      accessibility: {
        screenReaderText: "Interactive sentence building demonstration",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-10",
      type: "listening_comprehension",
      prompt: "Listen and Learn",
      instructions: "Listen to these examples. Pay attention to pronunciation and how the words sound together.",
      accessibility: {
        screenReaderText: "Listening comprehension with pronunciation focus",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-11",
      type: "pronunciation_shadow",
      prompt: "Pronunciation Practice",
      instructions: "Your turn! Repeat after me. Focus on clear pronunciation. Don't worry about being perfect!",
      accessibility: {
        screenReaderText: "Student pronunciation practice session",
        highContrast: false,
        largeText: false
      }
    },

    // ========== GUIDED PRACTICE (5 SLIDES) ==========
    {
      id: "slide-12",
      type: "accuracy_mcq",
      prompt: "Fill in the Blanks",
      instructions: "Complete these sentences using our new vocabulary. Choose the best word for each blank!",
      options: getFillBlankOptions(lessonKey),
      correct: getFillBlankAnswers(lessonKey),
      accessibility: {
        screenReaderText: "Fill-in-the-blank exercise with vocabulary",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-13",
      type: "picture_choice",
      prompt: "Match Words and Meanings",
      instructions: "Connect each word with its correct meaning or picture!",
      options: getMatchingOptions(lessonKey),
      correct: getMatchingAnswers(lessonKey),
      accessibility: {
        screenReaderText: "Vocabulary matching exercise with visual aids",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-14",
      type: "transform",
      prompt: "Sentence Ordering",
      instructions: "Put these words in the correct order to make sentences!",
      options: getSentenceOrderOptions(lessonKey),
      correct: getSentenceOrderAnswers(lessonKey),
      accessibility: {
        screenReaderText: "Sentence ordering and construction activity",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-15",
      type: "error_fix",
      prompt: "Find and Fix Mistakes",
      instructions: "These sentences have small errors. Can you spot and fix them?",
      options: getErrorFixOptions(lessonKey),
      correct: getErrorFixAnswers(lessonKey),
      accessibility: {
        screenReaderText: "Error identification and correction exercise",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-16",
      type: "labeling",
      prompt: "Drag and Drop Practice",
      instructions: "Drag the correct words to complete these sentences!",
      accessibility: {
        screenReaderText: "Interactive drag and drop sentence completion",
        highContrast: false,
        largeText: false
      }
    },

    // ========== GAMIFIED ACTIVITIES (4 SLIDES) ==========
    {
      id: "slide-17",
      type: "controlled_practice",
      prompt: "Quick Quiz Challenge!",
      instructions: "Fast-paced quiz time! Answer quickly and have fun!",
      options: getQuizOptions(lessonKey),
      correct: getQuizAnswers(lessonKey),
      accessibility: {
        screenReaderText: "Quick-fire quiz with immediate feedback",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-18",
      type: "controlled_practice",
      prompt: "Spinning Wheel Q&A",
      instructions: "Answer the questions that appear! Support each other!",
      accessibility: {
        screenReaderText: "Interactive spinning wheel question game",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-19",
      type: "roleplay_setup",
      prompt: "Mini Role-Play Setup",
      instructions: getRolePlayInstructions(lessonKey),
      accessibility: {
        screenReaderText: "Role-play activity preparation and setup",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-20",
      type: "fluency_sprint",
      prompt: "Speed Challenge",
      instructions: "How quickly can you use all the new words in sentences? Go for fluency!",
      accessibility: {
        screenReaderText: "Fluency-building speed speaking exercise",
        highContrast: false,
        largeText: false
      }
    },

    // ========== COMMUNICATION PRACTICE (3 SLIDES) ==========
    {
      id: "slide-21",
      type: "communicative_task",
      prompt: "Pair Work Practice",
      instructions: "Work with a partner! Take turns using today's new language!",
      accessibility: {
        screenReaderText: "Paired conversation practice activity",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-22",
      type: "picture_description",
      prompt: "Ask and Answer",
      instructions: "Look at the pictures and ask your partner questions. Use our new vocabulary!",
      accessibility: {
        screenReaderText: "Picture-based question and answer activity",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-23",
      type: "roleplay_setup",
      prompt: "Real-Life Role-Play",
      instructions: "Practice the role-play using everything you've learned today!",
      accessibility: {
        screenReaderText: "Real-life scenario role-play performance",
        highContrast: false,
        largeText: false
      }
    },

    // ========== REVIEW & WRAP-UP (2 SLIDES) ==========
    {
      id: "slide-24",
      type: "review_consolidation",
      prompt: "Today's Key Learning",
      instructions: `Let's review! New vocabulary: ${content.vocabulary.slice(0, 4).join(', ')}. Grammar: ${content.grammar[0]}. Great job!`,
      accessibility: {
        screenReaderText: "Lesson summary and key learning review",
        highContrast: false,
        largeText: false
      }
    },
    {
      id: "slide-25",
      type: "exit_check",
      prompt: "Exit Check & Homework",
      instructions: `Show me what you learned! Practice using ${content.vocabulary[0]} in real conversations this week!`,
      accessibility: {
        screenReaderText: "Final assessment and homework assignment",
        highContrast: false,
        largeText: false
      }
    }
  ];

  return {
    version: '2.0',
    theme: 'mist-blue',
    slides,
    durationMin: 60,
    total_slides: 25,
    metadata: {
      CEFR: content.level,
      module: content.module,
      lesson: content.lesson,
      targets: content.objectives,
      weights: {
        accuracy: 0.6,
        fluency: 0.4
      }
    }
  };
};

// Helper functions for content-specific examples and exercises
function getContextInstructions(lessonKey: string, vocabulary: string[]): string {
  switch (lessonKey) {
    case 'greetings-introductions':
      return "See examples: 'Hello, my name is Sarah.' 'Nice to meet you!' 'Goodbye, see you tomorrow!'";
    case 'alphabet-spelling':
      return "Examples: 'How do you spell your name?' 'My first name starts with a capital letter.' 'A-B-C are letters.'";
    case 'numbers-age':
      return "Examples: 'I am ten years old.' 'She is five.' 'Count from one to twenty.'";
    default:
      return `Context examples with: ${vocabulary.slice(0, 3).join(', ')}`;
  }
}

function getGrammarExamples(lessonKey: string): string {
  switch (lessonKey) {
    case 'greetings-introductions':
      return "'My name is Tom.' 'What is your name?' 'Nice to meet you, Lisa.'";
    case 'alphabet-spelling':
      return "'How do you spell Tom? T-O-M.' 'My first name is Anna. A-N-N-A.'";
    case 'numbers-age':
      return "'I am twelve years old.' 'How old are you?' 'She is fifteen.'";
    default:
      return "Grammar pattern examples";
  }
}

function getSentenceExample(lessonKey: string): string {
  switch (lessonKey) {
    case 'greetings-introductions':
      return "Hello + my name is + [name]";
    case 'alphabet-spelling':
      return "How + do you spell + [name]?";
    case 'numbers-age':
      return "I am + [number] + years old";
    default:
      return "sentence structure";
  }
}

function getFillBlankOptions(lessonKey: string): any[] {
  switch (lessonKey) {
    case 'greetings-introductions':
      return [
        { id: "1", text: "Hello, _____ name is Sarah.", options: ["my", "your", "his"], correct: "my" },
        { id: "2", text: "Nice to _____ you!", options: ["see", "meet", "know"], correct: "meet" }
      ];
    case 'alphabet-spelling':
      return [
        { id: "1", text: "How do you _____ your name?", options: ["spell", "say", "write"], correct: "spell" },
        { id: "2", text: "My _____ name is Tom.", options: ["first", "last", "full"], correct: "first" }
      ];
    case 'numbers-age':
      return [
        { id: "1", text: "I am _____ years old.", options: ["ten", "tens", "tenth"], correct: "ten" },
        { id: "2", text: "How _____ are you?", options: ["age", "old", "years"], correct: "old" }
      ];
    default:
      return [];
  }
}

function getFillBlankAnswers(lessonKey: string): string[] {
  switch (lessonKey) {
    case 'greetings-introductions': return ["my", "meet"];
    case 'alphabet-spelling': return ["spell", "first"];
    case 'numbers-age': return ["ten", "old"];
    default: return [];
  }
}

function getMatchingOptions(lessonKey: string): any[] {
  switch (lessonKey) {
    case 'greetings-introductions':
      return [
        { id: "1", text: "hello", image: "greeting", match: "greeting" },
        { id: "2", text: "goodbye", image: "farewell", match: "farewell" }
      ];
    case 'alphabet-spelling':
      return [
        { id: "1", text: "A", image: "letter-a", match: "first letter" },
        { id: "2", text: "spell", image: "spelling", match: "S-P-E-L-L" }
      ];
    case 'numbers-age':
      return [
        { id: "1", text: "five", image: "number-5", match: "5" },
        { id: "2", text: "ten", image: "number-10", match: "10" }
      ];
    default:
      return [];
  }
}

function getMatchingAnswers(lessonKey: string): string[] {
  switch (lessonKey) {
    case 'greetings-introductions': return ["greeting", "farewell"];
    case 'alphabet-spelling': return ["first letter", "S-P-E-L-L"];
    case 'numbers-age': return ["5", "10"];
    default: return [];
  }
}

function getSentenceOrderOptions(lessonKey: string): any[] {
  switch (lessonKey) {
    case 'greetings-introductions':
      return [
        { id: "1", words: ["Hello", "my", "name", "is", "Tom"], correct: "Hello, my name is Tom." }
      ];
    case 'alphabet-spelling':
      return [
        { id: "1", words: ["How", "do", "you", "spell", "that"], correct: "How do you spell that?" }
      ];
    case 'numbers-age':
      return [
        { id: "1", words: ["I", "am", "ten", "years", "old"], correct: "I am ten years old." }
      ];
    default:
      return [];
  }
}

function getSentenceOrderAnswers(lessonKey: string): string[] {
  switch (lessonKey) {
    case 'greetings-introductions': return ["Hello, my name is Tom."];
    case 'alphabet-spelling': return ["How do you spell that?"];
    case 'numbers-age': return ["I am ten years old."];
    default: return [];
  }
}

function getErrorFixOptions(lessonKey: string): any[] {
  switch (lessonKey) {
    case 'greetings-introductions':
      return [
        { id: "1", incorrect: "Hello, me name is Sarah.", correct: "Hello, my name is Sarah." }
      ];
    case 'alphabet-spelling':
      return [
        { id: "1", incorrect: "How you spell your name?", correct: "How do you spell your name?" }
      ];
    case 'numbers-age':
      return [
        { id: "1", incorrect: "I am ten year old.", correct: "I am ten years old." }
      ];
    default:
      return [];
  }
}

function getErrorFixAnswers(lessonKey: string): string[] {
  switch (lessonKey) {
    case 'greetings-introductions': return ["Hello, my name is Sarah."];
    case 'alphabet-spelling': return ["How do you spell your name?"];
    case 'numbers-age': return ["I am ten years old."];
    default: return [];
  }
}

function getQuizOptions(lessonKey: string): any[] {
  switch (lessonKey) {
    case 'greetings-introductions':
      return [
        { id: "1", question: "How do you say hello?", options: ["Hello", "Goodbye", "Thank you"], correct: "Hello" }
      ];
    case 'alphabet-spelling':
      return [
        { id: "1", question: "How many letters in 'cat'?", options: ["2", "3", "4"], correct: "3" }
      ];
    case 'numbers-age':
      return [
        { id: "1", question: "What comes after nine?", options: ["ten", "eleven", "eight"], correct: "ten" }
      ];
    default:
      return [];
  }
}

function getQuizAnswers(lessonKey: string): string[] {
  switch (lessonKey) {
    case 'greetings-introductions': return ["Hello"];
    case 'alphabet-spelling': return ["3"];
    case 'numbers-age': return ["ten"];
    default: return [];
  }
}

function getRolePlayInstructions(lessonKey: string): string {
  switch (lessonKey) {
    case 'greetings-introductions':
      return "Role-play: Meet a new classmate! One person says hello and introduces themselves. The other responds politely.";
    case 'alphabet-spelling':
      return "Role-play: Help someone spell their name! One person asks for spelling help, the other helps them.";
    case 'numbers-age':
      return "Role-play: Ask about age! One person asks 'How old are you?' and the other answers with their age.";
    default:
      return "Practice using today's vocabulary in a real situation.";
  }
}