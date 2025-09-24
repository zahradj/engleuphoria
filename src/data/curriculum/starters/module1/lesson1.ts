import { LessonSlides } from '@/types/slides';

export const lesson1_1: LessonSlides = {
  version: '2.0',
  theme: 'mist-blue',
  durationMin: 30,
  metadata: {
    CEFR: 'A1',
    module: 1,
    lesson: 1,
    targets: [
      'Greet others and say goodbye',
      'Introduce themselves: My name is...',
      'Ask: What\'s your name?',
      'Reply politely: Nice to meet you',
      'Recognize and pronounce Aa words'
    ],
    weights: {
      accuracy: 60,
      fluency: 40
    }
  },
  slides: [
    {
      id: 'slide-1',
      type: 'warmup',
      prompt: 'Emoji Hello!',
      instructions: 'Drag a smiling emoji to say hello, sad emoji to say goodbye.',
      media: {
        type: 'image',
        url: '/assets/lessons/starters/module1/lesson1/hello.png',
        alt: 'Hello greeting illustration'
      },
      accessibility: {
        screenReaderText: 'Warm-up game: Drag emojis to practice greetings',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-2',
      type: 'vocabulary_preview',
      prompt: 'Hello! What\'s your name?',
      instructions: 'Watch the animated characters introduce themselves.',
      media: {
        type: 'image',
        url: '/assets/lessons/starters/module1/lesson1/spiderman_dialogue.png',
        alt: 'Character introduction scene'
      },
      accessibility: {
        screenReaderText: 'Topic introduction with character greetings',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-3',
      type: 'vocabulary_preview',
      prompt: 'Greeting Cards',
      instructions: 'Click to flip cards and learn greetings.',
      options: [
        { id: 'hello', text: 'Hello', image: '/assets/lessons/starters/module1/lesson1/hello.png' },
        { id: 'hi', text: 'Hi', image: '/assets/lessons/starters/module1/lesson1/hi.png' },
        { id: 'goodbye', text: 'Goodbye', image: '/assets/lessons/starters/module1/lesson1/goodbye.png' }
      ],
      accessibility: {
        screenReaderText: 'Interactive greeting flashcards',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-4',
      type: 'listening_comprehension',
      prompt: 'Listening Challenge',
      instructions: 'Listen to the greeting and drag the word to the correct picture.',
      media: {
        type: 'audio',
        url: '/assets/audio/hello.mp3'
      },
      dragDropItems: [
        { id: 'hello-word', text: 'Hello', targetId: 'hello-target' }
      ],
      dragDropTargets: [
        { id: 'hello-target', text: '', image: '/assets/lessons/starters/module1/lesson1/hello.png', acceptsItemIds: ['hello-word'] }
      ],
      accessibility: {
        screenReaderText: 'Listen and match greeting words to pictures',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-5',
      type: 'target_language',
      prompt: 'Dialogue Model',
      instructions: 'Watch and listen to the conversation.',
      media: {
        type: 'image',
        url: '/assets/lessons/starters/module1/lesson1/spongebob_dialogue.png',
        alt: 'SpongeBob character dialogue'
      },
      clozeText: 'Ed: Hello! My name is Ed.\nAnna: Hi, Ed. My name is Anna. Nice to meet you.\nEd: Nice to meet you too!',
      accessibility: {
        screenReaderText: 'Model dialogue between characters',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-6',
      type: 'drag_drop',
      prompt: 'Practice Greetings',
      instructions: 'Drag the correct greeting words into the speech bubbles.',
      dragDropItems: [
        { id: 'hello-item', text: 'Hello', targetId: 'morning-target' },
        { id: 'hi-item', text: 'Hi', targetId: 'casual-target' },
        { id: 'goodbye-item', text: 'Goodbye', targetId: 'leaving-target' }
      ],
      dragDropTargets: [
        { id: 'morning-target', text: 'Morning greeting', acceptsItemIds: ['hello-item', 'hi-item'] },
        { id: 'casual-target', text: 'Casual greeting', acceptsItemIds: ['hi-item'] },
        { id: 'leaving-target', text: 'Saying goodbye', acceptsItemIds: ['goodbye-item'] }
      ],
      accessibility: {
        screenReaderText: 'Drag greeting words to appropriate speech bubbles',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-7',
      type: 'sentence_builder',
      prompt: 'My Name Is...',
      instructions: 'Complete the sentence: My name is ___',
      clozeText: 'My name is {gap-1}.',
      clozeGaps: [
        { id: 'gap-1', correctAnswers: ['student name'], options: [] }
      ],
      accessibility: {
        screenReaderText: 'Fill in your name to complete the sentence',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-8',
      type: 'match',
      prompt: 'Matching Game',
      instructions: 'Match the greeting words to the correct images.',
      matchPairs: [
        { id: 'pair-1', left: 'Hello', right: 'Waving hand', leftImage: '/assets/lessons/starters/module1/lesson1/hello.png' },
        { id: 'pair-2', left: 'Goodbye', right: 'Leaving gesture', leftImage: '/assets/lessons/starters/module1/lesson1/goodbye.png' }
      ],
      accessibility: {
        screenReaderText: 'Match greeting words with corresponding actions',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-9',
      type: 'pronunciation_shadow',
      prompt: 'Speaking Practice',
      instructions: 'Repeat after me: Hello, my name is ___. Nice to meet you.',
      media: {
        type: 'audio',
        url: '/assets/audio/greeting-practice.mp3'
      },
      accessibility: {
        screenReaderText: 'Practice pronunciation of greeting phrases',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-10',
      type: 'roleplay_setup',
      prompt: 'Role-Play Cards',
      instructions: 'Choose a character and practice the dialogue.',
      options: [
        { id: 'ed', text: 'Ed', image: '/assets/lessons/starters/module1/lesson1/spiderman_dialogue.png' },
        { id: 'anna', text: 'Anna', image: '/assets/lessons/starters/module1/lesson1/spongebob_dialogue.png' }
      ],
      accessibility: {
        screenReaderText: 'Select character cards for role-play practice',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-11',
      type: 'tpr_phonics',
      prompt: 'Phonics Aa',
      instructions: 'Drag the Aa words to the basket: Apple, Ant, Alligator.',
      dragDropItems: [
        { id: 'apple', text: 'Apple', targetId: 'aa-basket', image: '/assets/lessons/starters/module1/lesson1/apple.png' },
        { id: 'ant', text: 'Ant', targetId: 'aa-basket', image: '/assets/lessons/starters/module1/lesson1/ant.png' }
      ],
      dragDropTargets: [
        { id: 'aa-basket', text: 'Aa Basket', acceptsItemIds: ['apple', 'ant'] }
      ],
      accessibility: {
        screenReaderText: 'Drag letter A words to the phonics basket',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-12',
      type: 'fast_match',
      prompt: 'Spin the Wheel',
      instructions: 'Spin the wheel and say the phrase when it stops!',
      options: [
        { id: 'hello', text: 'Hello' },
        { id: 'goodbye', text: 'Goodbye' },
        { id: 'my-name', text: 'My name is...' },
        { id: 'nice-meet', text: 'Nice to meet you' }
      ],
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy',
        soundEffects: true
      },
      accessibility: {
        screenReaderText: 'Interactive spinning wheel game with greeting phrases',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-13',
      type: 'listening_comprehension',
      prompt: 'Listen and Choose',
      instructions: 'Listen to the audio and click the correct character.',
      media: {
        type: 'audio',
        url: '/assets/audio/name-introduction.mp3'
      },
      options: [
        { id: 'ed', text: 'Ed', image: '/assets/lessons/starters/module1/lesson1/spiderman_dialogue.png', isCorrect: true },
        { id: 'anna', text: 'Anna', image: '/assets/lessons/starters/module1/lesson1/spongebob_dialogue.png', isCorrect: false }
      ],
      accessibility: {
        screenReaderText: 'Listen to audio and identify the correct character',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-14',
      type: 'picture_choice',
      prompt: 'Matching Challenge',
      instructions: 'Match the sentences to the correct pictures.',
      matchPairs: [
        { id: 'match-1', left: 'This is Ed', right: 'Ed character', rightImage: '/assets/lessons/starters/module1/lesson1/spiderman_dialogue.png' },
        { id: 'match-2', left: 'This is Anna', right: 'Anna character', rightImage: '/assets/lessons/starters/module1/lesson1/spongebob_dialogue.png' },
        { id: 'match-3', left: 'Nice to meet you', right: 'Handshake gesture' }
      ],
      accessibility: {
        screenReaderText: 'Match descriptive sentences with character images',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-15',
      type: 'cloze',
      prompt: 'Complete the Dialogue',
      instructions: 'Fill in the missing names in the conversation.',
      clozeText: 'Ed: Hello! My name is {gap-1}.\nAnna: Hi, {gap-2}. Nice to meet you.',
      clozeGaps: [
        { id: 'gap-1', correctAnswers: ['Ed'], options: ['Ed', 'Anna', 'Tom'] },
        { id: 'gap-2', correctAnswers: ['Ed'], options: ['Ed', 'Anna', 'Tom'] }
      ],
      accessibility: {
        screenReaderText: 'Complete dialogue by filling in character names',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-16',
      type: 'controlled_practice',
      prompt: 'Review Game',
      instructions: 'Move along the board game path. Say each greeting phrase to advance.',
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy',
        targetScore: 100,
        soundEffects: true
      },
      options: [
        { id: 'step-1', text: 'Hello' },
        { id: 'step-2', text: 'My name is...' },
        { id: 'step-3', text: 'Nice to meet you' },
        { id: 'step-4', text: 'Goodbye' }
      ],
      accessibility: {
        screenReaderText: 'Board game style review of greeting phrases',
        highContrast: true,
        largeText: true
      }
    },
    {
      id: 'slide-17',
      type: 'exit_check',
      prompt: 'Congratulations!',
      instructions: 'Great job! You can now greet people, introduce yourself, and say "Nice to meet you."',
      media: {
        type: 'image',
        url: '/assets/lessons/starters/module1/lesson1/hello.png',
        alt: 'Celebration and achievement badge'
      },
      gameConfig: {
        theme: 'playground',
        difficulty: 'easy'
      },
      accessibility: {
        screenReaderText: 'Lesson completion celebration with achievement badge',
        highContrast: true,
        largeText: true
      }
    }
  ]
};