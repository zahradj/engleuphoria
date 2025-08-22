import { LessonSlides } from '@/types/slides';

export function createGreetingsDeck(): LessonSlides {
  return {
    version: "2.0",
    theme: "mist-blue",
    durationMin: 15,
    total_slides: 6,
    metadata: {
      CEFR: "A1",
      module: 1,
      lesson: 1,
      targets: ["greetings", "introductions", "name/age", "polite expressions"],
      weights: { accuracy: 70, fluency: 30 }
    },
    slides: [
      {
        id: "greeting-intro",
        type: "warmup",
        prompt: "👋 Introducing Yourself - Basic Greetings",
        instructions: "In this lesson, you will learn how to greet someone and introduce yourself.",
        accessibility: {
          screenReaderText: "Welcome to greetings and introductions lesson",
          highContrast: false,
          largeText: false
        }
      },
      {
        id: "greeting-match",
        type: "match",
        prompt: "Match the Greetings",
        instructions: "Match each greeting with the correct time or situation.",
        matchPairs: [
          {
            id: "pair1",
            left: "Good morning",
            right: "Use in the morning (6 AM - 12 PM)",
            leftImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150"
          },
          {
            id: "pair2", 
            left: "Good afternoon",
            right: "Use in the afternoon (12 PM - 6 PM)",
            leftImage: "https://images.unsplash.com/photo-1504692300473-dd6e0d1b1e34?w=150"
          },
          {
            id: "pair3",
            left: "Good evening", 
            right: "Use in the evening (6 PM - 10 PM)",
            leftImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150"
          },
          {
            id: "pair4",
            left: "Hello/Hi",
            right: "Use anytime (casual greeting)",
            leftImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150"
          }
        ],
        timeLimit: 120,
        accessibility: {
          screenReaderText: "Match greetings with appropriate times",
          highContrast: false,
          largeText: false
        }
      },
      {
        id: "greeting-cloze",
        type: "cloze",
        prompt: "Complete the Introduction",
        instructions: "Fill in the missing words to complete the introduction.",
        clozeText: "Hello, my name [gap1] Sarah. I [gap2] 25 years old. I [gap3] from Canada. Nice to [gap4] you!",
        clozeGaps: [
          {
            id: "gap1",
            correctAnswers: ["is"],
            options: ["is", "am", "are", "be"]
          },
          {
            id: "gap2",
            correctAnswers: ["am"],
            options: ["am", "is", "are", "be"]
          },
          {
            id: "gap3",
            correctAnswers: ["am", "come"],
            options: ["am", "is", "come", "comes"]
          },
          {
            id: "gap4",
            correctAnswers: ["meet"],
            options: ["meet", "see", "know", "watch"]
          }
        ],
        timeLimit: 180,
        accessibility: {
          screenReaderText: "Complete the introduction with correct words",
          highContrast: false,
          largeText: false
        }
      },
      {
        id: "greeting-quiz",
        type: "accuracy_mcq",
        prompt: "Which one is a greeting?",
        instructions: "Choose the correct greeting from the options below.",
        options: [
          { id: "opt-a", text: "Hello", isCorrect: true },
          { id: "opt-b", text: "Goodbye", isCorrect: false },
          { id: "opt-c", text: "Please", isCorrect: false },
          { id: "opt-d", text: "Thank you", isCorrect: false }
        ],
        correct: "opt-a",
        timeLimit: 60,
        accessibility: {
          screenReaderText: "Multiple choice quiz about greetings",
          highContrast: false,
          largeText: false
        }
      },
      {
        id: "greeting-practice",
        type: "communicative_task",
        prompt: "Practice Time! 🗣️",
        instructions: "Now practice introducing yourself! Say: 'Hello, my name is [your name]. I am [your age] years old. Nice to meet you!'",
        media: {
          type: "image",
          url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=300",
          alt: "People shaking hands",
          imagePrompt: "Two people shaking hands in a friendly greeting"
        },
        accessibility: {
          screenReaderText: "Practice introducing yourself with name and age",
          highContrast: false,
          largeText: false
        }
      },
      {
        id: "greeting-complete",
        type: "exit_check",
        prompt: "Lesson Complete! 🎉",
        instructions: "Great job! You can now greet people and introduce yourself in English. Keep practicing with friends and family!",
        media: {
          type: "image",
          url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300",
          alt: "Celebration",
          imagePrompt: "Celebration with confetti and happy people"
        },
        accessibility: {
          screenReaderText: "Lesson completion and encouragement",
          highContrast: false,
          largeText: false
        }
      }
    ]
  };
}

export function createGreetingsPPPRequest() {
  return {
    action: 'generate_full_deck',
    lesson_data: {
      title: 'Greetings and Introductions',
      topic: 'Basic greetings, introductions, personal information',
      cefr_level: 'A1',
      learning_objectives: [
        'Greet people politely in different situations',
        'Introduce yourself with name and age',
        'Ask and respond to simple personal questions',
        'Use appropriate greetings for different times of day'
      ],
      vocabulary_focus: ['hello', 'hi', 'good morning', 'good afternoon', 'good evening', 'name', 'age', 'nice to meet you'],
      grammar_focus: ['Present tense "to be"', 'Personal pronouns', 'Basic sentence structure'],
      level_info: { cefr_level: 'A1' },
      duration_minutes: 30
    },
    slide_count: 25,
    structure: 'ppp'
  };
}