import { LessonSlides } from '@/types/slides';

export const unit1Lesson1GreetingsNames: LessonSlides = {
  version: '2.0',
  theme: 'mist-blue',
  durationMin: 30,
  total_slides: 20,
  metadata: {
    CEFR: 'A1',
    module: 1,
    lesson: 1,
    targets: [
      'Use hello/hi/bye vocabulary correctly',
      'Say "Hello, I am ___" with confidence',
      'Recognize and write letter Aa',
      'Participate in interactive name games'
    ],
    weights: {
      accuracy: 0.6,
      fluency: 0.4
    }
  },
  slides: [
    {
      id: 'warmup-welcome',
      type: 'warmup',
      prompt: '🌟 Welcome to Unit 1! Hello English Adventure!',
      instructions: 'Wave your hands and say "Hello!" to everyone!',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Colorful cartoon children waving hello',
        imagePrompt: 'vibrant cartoon illustration of diverse children waving hello with big smiles, rainbow background, playful and engaging style'
      },
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy',
        soundEffects: true,
        backgroundMusic: true
      }
    },
    {
      id: 'vocab-hello-hi-bye',
      type: 'vocabulary_preview',
      prompt: '✨ Magic Greeting Words!',
      instructions: 'Touch each word and repeat after me!',
      options: [
        { id: 'hello', text: 'Hello', image: '/placeholder.svg' },
        { id: 'hi', text: 'Hi', image: '/placeholder.svg' },
        { id: 'bye', text: 'Bye', image: '/placeholder.svg' }
      ],
      vocabulary: ['hello', 'hi', 'bye'],
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy',
        soundEffects: true
      }
    },
    {
      id: 'phonics-aa',
      type: 'tpr_phonics',
      prompt: '🍎 Letter Aa - Apple Adventure!',
      instructions: 'Draw the letter A in the air while saying "Aaa for Apple!"',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Big letter A with apple graphics',
        imagePrompt: 'large colorful letter A with cute apple illustrations, educational phonics style'
      },
      vocabulary: ['apple', 'ant', 'airplane']
    },
    {
      id: 'target-sentence',
      type: 'target_language',
      prompt: '🗣️ Super Sentence: "Hello, I am ___"',
      instructions: 'Watch our friend introduce herself!',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Cartoon girl saying hello I am Sarah',
        imagePrompt: 'friendly cartoon girl with speech bubble saying "Hello, I am Sarah", bright classroom background'
      }
    },
    {
      id: 'ball-toss-game',
      type: 'fast_match',
      prompt: '🏀 Name Ball Toss Game!',
      instructions: 'Catch the ball and say "Hello, I am [your name]!"',
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy',
        targetScore: 5,
        soundEffects: true,
        powerUps: true
      },
      options: [
        { id: 'toss1', text: 'Hello, I am Anna!', isCorrect: true },
        { id: 'toss2', text: 'Hello, I am Tom!', isCorrect: true },
        { id: 'toss3', text: 'Hello, I am Lisa!', isCorrect: true }
      ]
    },
    {
      id: 'name-song-chant',
      type: 'pronunciation_shadow',
      prompt: '🎵 Hello Name Song!',
      instructions: 'Sing along: "Hello, hello, what\'s your name? My name is ___, let\'s play a game!"',
      media: {
        type: 'audio',
        url: '/placeholder.svg',
        alt: 'Hello name song audio'
      }
    },
    {
      id: 'drag-drop-faces',
      type: 'drag_drop',
      prompt: '😊 Match Names to Happy Faces!',
      instructions: 'Drag each name to the correct smiling face!',
      dragDropItems: [
        { id: 'name-anna', text: 'Anna', targetId: 'face-girl1' },
        { id: 'name-tom', text: 'Tom', targetId: 'face-boy1' },
        { id: 'name-lisa', text: 'Lisa', targetId: 'face-girl2' }
      ],
      dragDropTargets: [
        { 
          id: 'face-girl1',
          text: 'Girl with pigtails',
          acceptsItemIds: ['name-anna'],
          image: '/placeholder.svg'
        },
        { 
          id: 'face-boy1',
          text: 'Boy with brown hair',
          acceptsItemIds: ['name-tom'],
          image: '/placeholder.svg'
        },
        { 
          id: 'face-girl2',
          text: 'Girl with curly hair',
          acceptsItemIds: ['name-lisa'],
          image: '/placeholder.svg'
        }
      ]
    },
    {
      id: 'listening-greetings',
      type: 'listening_comprehension',
      prompt: '👂 Listen Carefully!',
      instructions: 'Which greeting do you hear?',
      media: {
        type: 'audio',
        url: '/placeholder.svg',
        alt: 'Audio greeting hello'
      },
      options: [
        { id: 'listen1', text: 'Hello!', isCorrect: true },
        { id: 'listen2', text: 'Goodbye!', isCorrect: false },
        { id: 'listen3', text: 'Hi there!', isCorrect: false }
      ]
    },
    {
      id: 'sentence-builder',
      type: 'sentence_builder',
      prompt: '🔧 Build Your Introduction!',
      instructions: 'Put the words in order: Hello + I + am + [your name]',
      options: [
        { id: 'word1', text: 'Hello' },
        { id: 'word2', text: 'I' },
        { id: 'word3', text: 'am' },
        { id: 'word4', text: 'Sarah' }
      ]
    },
    {
      id: 'mcq-greetings',
      type: 'accuracy_mcq',
      prompt: '❓ Choose the Best Greeting!',
      instructions: 'When you meet someone new, what do you say?',
      options: [
        { id: 'mcq1', text: 'Hello! Nice to meet you!', isCorrect: true },
        { id: 'mcq2', text: 'Goodbye! See you later!', isCorrect: false },
        { id: 'mcq3', text: 'Thank you very much!', isCorrect: false }
      ]
    },
    {
      id: 'picture-choice',
      type: 'picture_choice',
      prompt: '🖼️ Greeting Situations!',
      instructions: 'Which picture shows people saying "Hello"?',
      options: [
        { id: 'pic1', text: 'People waving hello', image: '/placeholder.svg', isCorrect: true },
        { id: 'pic2', text: 'People saying goodbye', image: '/placeholder.svg', isCorrect: false },
        { id: 'pic3', text: 'People sleeping', image: '/placeholder.svg', isCorrect: false }
      ]
    },
    {
      id: 'letter-a-trace',
      type: 'labeling',
      prompt: '✏️ Trace Letter Aa!',
      instructions: 'Follow the dots to write the letter A!',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Letter A tracing worksheet',
        imagePrompt: 'dotted line letter A for tracing practice with apple illustration'
      }
    },
    {
      id: 'memory-names',
      type: 'memory_flip',
      prompt: '🧠 Memory Game - Names!',
      instructions: 'Find the matching name pairs!',
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy',
        targetScore: 3,
        soundEffects: true
      },
      matchPairs: [
        { id: 'pair1', left: 'Anna', right: 'Anna' },
        { id: 'pair2', left: 'Tom', right: 'Tom' },
        { id: 'pair3', left: 'Lisa', right: 'Lisa' }
      ]
    },
    {
      id: 'controlled-practice',
      type: 'controlled_practice',
      prompt: '🎯 Practice Time!',
      instructions: 'Say: "Hello, I am [your name]. Nice to meet you!"',
      timeLimit: 30
    },
    {
      id: 'roleplay-introductions',
      type: 'roleplay_setup',
      prompt: '🎭 Introduction Role-Play!',
      instructions: 'Partner A: Say hello and introduce yourself. Partner B: Respond politely!',
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy'
      }
    },
    {
      id: 'hello-chant',
      type: 'pronunciation_shadow',
      prompt: '📢 Hello Chant Challenge!',
      instructions: 'Repeat: "Hello, hello, what\'s your name? Hello, hello, let\'s play a game!"',
      timeLimit: 20
    },
    {
      id: 'spelling-hello',
      type: 'spelling_race',
      prompt: '⚡ Spell "HELLO" Fast!',
      instructions: 'Type the letters H-E-L-L-O as fast as you can!',
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy',
        targetScore: 1,
        timeBonus: true
      },
      gameWords: ['HELLO']
    },
    {
      id: 'communicative-task',
      type: 'communicative_task',
      prompt: '💬 Real Talk Challenge!',
      instructions: 'Introduce yourself to 3 different classmates using "Hello, I am..."',
      timeLimit: 60
    },
    {
      id: 'aa-words',
      type: 'bubble_pop',
      prompt: '🫧 Pop the "A" Words!',
      instructions: 'Pop bubbles with words that start with "A"!',
      gameConfig: {
        theme: 'ocean',
        difficulty: 'easy',
        targetScore: 5,
        soundEffects: true
      },
      vocabulary: ['apple', 'ant', 'airplane', 'alligator']
    },
    {
      id: 'review-consolidation',
      type: 'review_consolidation',
      prompt: '⭐ Great Job! Let\'s Review!',
      instructions: 'What did we learn today? Hello, Hi, Bye, and "I am..."',
      media: {
        type: 'image',
        url: '/placeholder.svg',
        alt: 'Review summary with stars',
        imagePrompt: 'colorful review summary showing hello, hi, bye words with stars and celebration'
      }
    }
  ]
};